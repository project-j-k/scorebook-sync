import { useState } from 'react';
import { GameState, GameAction, Runners, RunnerOutInfo } from '@/types/baseball';
import { getTeamColor } from '@/constants/teamColors';
import { getCurrentBatter } from '@/utils/gameUtils';
import { Diamond } from './Diamond';
import { CountDisplay } from './CountDisplay';
import { LongPressButton } from './LongPressButton';
import { SyncIndicator } from './SyncIndicator';
import { PlayHistory } from './PlayHistory';
import { ShareGameModal } from './ShareGameModal';
import { Undo2, ClipboardList, Square, Share2 } from 'lucide-react';

interface MainGameScreenProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onRecordPlay: (type: string, subType?: string, runnersOut?: RunnerOutInfo[]) => void;
  syncStatus: { isOnline: boolean; isSyncing: boolean; syncError: string | null; retryCount?: number; maxRetries?: number };
  shareCode: string | null;
  onGenerateShareCode: () => Promise<void>;
  isViewOnly?: boolean;
  isStandalone?: boolean;
}

export const MainGameScreen = ({ state, dispatch, onRecordPlay, syncStatus, shareCode, onGenerateShareCode, isViewOnly = false, isStandalone = false }: MainGameScreenProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRunnerOutModal, setShowRunnerOutModal] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const battingTeam = state.currentHalf === 'top' ? state.awayTeam : state.homeTeam;
  const currentBatter = getCurrentBatter(state);
  const teamColor = getTeamColor(battingTeam.color);

  const recordPlay = (type: string, subType?: string, runnersOut?: RunnerOutInfo[]) => {
    if (isViewOnly) return;
    onRecordPlay(type, subType, runnersOut);
  };

  const handleRunnerOut = (base: 'first' | 'second' | 'third') => {
    const runnerId = state.runners[base];
    if (runnerId) {
      recordPlay('runnerOut', `runnerOut${base.charAt(0).toUpperCase() + base.slice(1)}`, [{ base, runnerId }]);
    }
    setShowRunnerOutModal(false);
  };

  const handleDoublePlay = (bases: ('first' | 'second' | 'third')[]) => {
    const runnersOut: RunnerOutInfo[] = bases.filter(base => state.runners[base]).map(base => ({ base, runnerId: state.runners[base] }));
    if (runnersOut.length >= 2) {
      const subType = `doublePlay${bases.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join('')}`;
      recordPlay('out', subType, runnersOut);
    }
    setShowRunnerOutModal(false);
  };

  const hasRunners = state.runners.first || state.runners.second || state.runners.third;

  return (
    <div className="min-h-screen text-foreground pb-28" style={{ background: `linear-gradient(180deg, ${teamColor.primary}15 0%, hsl(var(--background)) 25%)` }}>
      <SyncIndicator {...syncStatus} />
      {isViewOnly && <div className="fixed top-3 left-3 z-50 px-3 py-1.5 bg-yellow-500 text-white text-xs rounded-full font-medium">閲覧専用</div>}

      {/* Scoreboard Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm p-4 border-b border-border/50 z-30">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: getTeamColor(state.awayTeam.color).primary, color: getTeamColor(state.awayTeam.color).secondary }}>{state.awayTeam.name}</div>
          <div className="text-3xl font-mono font-bold tracking-wider"><span>{state.awayScore}</span><span className="text-muted-foreground mx-2">-</span><span>{state.homeScore}</span></div>
          <div className="text-sm font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: getTeamColor(state.homeTeam.color).primary, color: getTeamColor(state.homeTeam.color).secondary }}>{state.homeTeam.name}</div>
        </div>
        <div className="text-center text-muted-foreground text-sm font-medium">{state.currentInning}回{state.currentHalf === 'top' ? '表' : '裏'}{isStandalone && <span className="ml-2 text-yellow-500">· オフライン</span>}</div>
      </div>

      <Diamond runners={state.runners} teamColor={battingTeam.color} />
      <CountDisplay count={state.count} outs={state.outs} />

      <div className="text-center mb-5 px-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">打者</div>
        <div className="text-xl font-bold" style={{ color: teamColor.primary }}>{currentBatter?.number && `#${currentBatter.number} `}{currentBatter?.displayName || '---'}</div>
      </div>

      {!isViewOnly && (
        <div className="px-4 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <LongPressButton label="ストライク" onClick={() => recordPlay('strike')} className="bg-yellow-500 text-white" subOptions={[{ label: '空振り', onClick: () => recordPlay('strike', 'swinging') }, { label: '見逃し', onClick: () => recordPlay('strike', 'looking') }]} />
            <LongPressButton label="ボール" onClick={() => recordPlay('ball')} className="bg-green-500 text-white" subOptions={[{ label: 'ワイルドピッチ', onClick: () => recordPlay('wildPitch') }, { label: 'パスボール', onClick: () => recordPlay('passedBall') }]} />
            <LongPressButton label="ファール" onClick={() => recordPlay('foul')} className="bg-muted text-muted-foreground" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <LongPressButton label="アウト" onClick={() => recordPlay('out', 'flyout')} className="bg-red-500 text-white" subOptions={[
              { label: '三振', onClick: () => recordPlay('out', 'strikeout') },
              { label: 'フライアウト', onClick: () => recordPlay('out', 'flyout') },
              { label: 'ゴロアウト', onClick: () => recordPlay('out', 'groundout') },
              { label: '併殺打', onClick: () => recordPlay('out', 'doublePlay') },
              ...(hasRunners ? [{ label: 'ランナーアウト...', onClick: () => setShowRunnerOutModal(true) }] : []),
            ]} />
            <LongPressButton label="ヒット" onClick={() => recordPlay('hit', 'single')} className="bg-primary text-primary-foreground" subOptions={[{ label: 'シングル', onClick: () => recordPlay('hit', 'single') }, { label: 'ツーベース', onClick: () => recordPlay('hit', 'double') }, { label: 'スリーベース', onClick: () => recordPlay('hit', 'triple') }]} />
            <LongPressButton label="HR" onClick={() => recordPlay('homerun')} className="bg-purple-600 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <LongPressButton label="四死球" onClick={() => recordPlay('walk')} className="bg-blue-500 text-white" subOptions={[{ label: 'フォアボール', onClick: () => recordPlay('walk') }, { label: 'デッドボール', onClick: () => recordPlay('hitByPitch') }]} />
            <LongPressButton label="走塁" onClick={() => {}} className="bg-orange-500 text-white" subOptions={[{ label: '盗塁成功', onClick: () => recordPlay('steal') }, { label: '盗塁死', onClick: () => recordPlay('caughtStealing') }, { label: 'エラー進塁', onClick: () => recordPlay('error') }]} />
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border/50">
        <div className="flex gap-2 max-w-md mx-auto">
          {!isViewOnly && <button onClick={() => dispatch({ type: 'UNDO_LAST' })} disabled={state.plays.length === 0} className="flex-1 py-3 bg-secondary hover:bg-muted disabled:opacity-50 text-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"><Undo2 size={16} />戻る</button>}
          <button onClick={() => setShowHistory(true)} className="flex-1 py-3 bg-secondary hover:bg-muted text-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"><ClipboardList size={16} />履歴</button>
          {!isViewOnly && <button onClick={() => setShowEndConfirm(true)} className="flex-1 py-3 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"><Square size={16} />終了</button>}
        </div>
      </div>

      {showHistory && <PlayHistory plays={state.plays} onClose={() => setShowHistory(false)} />}
      {showShareModal && <ShareGameModal shareCode={shareCode} onGenerateCode={onGenerateShareCode} onClose={() => setShowShareModal(false)} isGenerating={isGeneratingCode} />}

      {/* Runner Out Modal */}
      {showRunnerOutModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border">
            <h3 className="text-xl font-bold mb-4">ランナーアウト</h3>
            <div className="space-y-2">
              {state.runners.first && <button onClick={() => handleRunnerOut('first')} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold">１塁ランナーアウト</button>}
              {state.runners.second && <button onClick={() => handleRunnerOut('second')} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold">２塁ランナーアウト</button>}
              {state.runners.third && <button onClick={() => handleRunnerOut('third')} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold">３塁ランナーアウト</button>}
              {state.runners.first && state.runners.second && <button onClick={() => handleDoublePlay(['first', 'second'])} className="w-full py-3 bg-red-700 text-white rounded-xl font-bold">併殺（１塁・２塁）</button>}
              {state.runners.second && state.runners.third && <button onClick={() => handleDoublePlay(['second', 'third'])} className="w-full py-3 bg-red-700 text-white rounded-xl font-bold">併殺（２塁・３塁）</button>}
            </div>
            <button onClick={() => setShowRunnerOutModal(false)} className="w-full mt-4 py-3 bg-secondary text-foreground rounded-xl font-bold">キャンセル</button>
          </div>
        </div>
      )}

      {showEndConfirm && !isViewOnly && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-xs w-full border border-border">
            <h3 className="text-xl font-bold mb-4 text-center">試合を終了しますか？</h3>
            <div className="text-center text-3xl font-mono font-bold mb-6">{state.awayScore} - {state.homeScore}</div>
            <div className="flex gap-3">
              <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold">キャンセル</button>
              <button onClick={() => { dispatch({ type: 'END_GAME' }); setShowEndConfirm(false); }} className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-xl font-bold">終了</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
