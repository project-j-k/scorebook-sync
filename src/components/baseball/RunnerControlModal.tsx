import { useState } from 'react';
import { Runners, RunnerOutInfo, RunnerAdvanceInfo } from '@/types/baseball';

interface RunnerAction {
  runnerId: string;
  fromBase: 'first' | 'second' | 'third';
  action: 'stay' | 'advance' | 'out';
  toBase?: 'second' | 'third' | 'home';
}

interface RunnerControlModalProps {
  runners: Runners;
  onConfirm: (runnersOut: RunnerOutInfo[], runnersAdvance: RunnerAdvanceInfo[], playType: string) => void;
  onClose: () => void;
}

const baseNames = { first: '１塁', second: '２塁', third: '３塁', home: 'ホーム' };

export const RunnerControlModal = ({ runners, onConfirm, onClose }: RunnerControlModalProps) => {
  const [playType, setPlayType] = useState<string>('sacrifice');
  const [runnerActions, setRunnerActions] = useState<RunnerAction[]>(() => {
    const actions: RunnerAction[] = [];
    if (runners.third) actions.push({ runnerId: runners.third, fromBase: 'third', action: 'stay' });
    if (runners.second) actions.push({ runnerId: runners.second, fromBase: 'second', action: 'stay' });
    if (runners.first) actions.push({ runnerId: runners.first, fromBase: 'first', action: 'stay' });
    return actions;
  });

  const updateAction = (index: number, action: 'stay' | 'advance' | 'out', toBase?: 'second' | 'third' | 'home') => {
    setRunnerActions(prev => prev.map((ra, i) => i === index ? { ...ra, action, toBase } : ra));
  };

  const getAvailableAdvances = (fromBase: 'first' | 'second' | 'third'): ('second' | 'third' | 'home')[] => {
    const occupiedBases = new Set<string>();
    runnerActions.forEach(ra => {
      if (ra.action === 'stay') occupiedBases.add(ra.fromBase);
      else if (ra.action === 'advance' && ra.toBase && ra.toBase !== 'home') occupiedBases.add(ra.toBase);
    });

    const options: ('second' | 'third' | 'home')[] = [];
    if (fromBase === 'first') {
      if (!occupiedBases.has('second')) options.push('second');
      if (!occupiedBases.has('third')) options.push('third');
      options.push('home');
    } else if (fromBase === 'second') {
      if (!occupiedBases.has('third')) options.push('third');
      options.push('home');
    } else {
      options.push('home');
    }
    return options;
  };

  const handleConfirm = () => {
    const runnersOut: RunnerOutInfo[] = [];
    const runnersAdvance: RunnerAdvanceInfo[] = [];

    runnerActions.forEach(ra => {
      if (ra.action === 'out') {
        runnersOut.push({ base: ra.fromBase, runnerId: ra.runnerId });
      } else if (ra.action === 'advance' && ra.toBase) {
        runnersAdvance.push({ fromBase: ra.fromBase, toBase: ra.toBase, runnerId: ra.runnerId });
      }
    });

    if (runnersOut.length === 0 && runnersAdvance.length === 0) {
      onClose();
      return;
    }

    onConfirm(runnersOut, runnersAdvance, playType);
  };

  const playTypes = [
    { value: 'sacrifice', label: '犠打・犠飛' },
    { value: 'fieldersChoice', label: 'フィルダースチョイス' },
    { value: 'error', label: 'エラー' },
    { value: 'wildPitch', label: 'ワイルドピッチ' },
    { value: 'passedBall', label: 'パスボール' },
    { value: 'other', label: 'その他' },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">ランナー状況</h3>

        {/* Play Type Selection */}
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">プレー種別</label>
          <div className="grid grid-cols-2 gap-2">
            {playTypes.map(pt => (
              <button
                key={pt.value}
                onClick={() => setPlayType(pt.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  playType === pt.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Runner Actions */}
        <div className="space-y-4">
          {runnerActions.map((ra, index) => (
            <div key={ra.fromBase} className="bg-secondary/50 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">{baseNames[ra.fromBase]}ランナー</div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  onClick={() => updateAction(index, 'stay')}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    ra.action === 'stay' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  留まる
                </button>
                <button
                  onClick={() => {
                    const advances = getAvailableAdvances(ra.fromBase);
                    if (advances.length > 0) updateAction(index, 'advance', advances[0]);
                  }}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    ra.action === 'advance' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  進塁
                </button>
                <button
                  onClick={() => updateAction(index, 'out')}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    ra.action === 'out' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  アウト
                </button>
              </div>
              {ra.action === 'advance' && (
                <div className="flex gap-2 mt-2">
                  {getAvailableAdvances(ra.fromBase).map(toBase => (
                    <button
                      key={toBase}
                      onClick={() => updateAction(index, 'advance', toBase)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        ra.toBase === toBase 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      →{baseNames[toBase]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {runnerActions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">ランナーがいません</div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};
