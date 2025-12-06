import { GameState, GameAction } from '@/types/baseball';
import { getTeamColor } from '@/constants/teamColors';
import { downloadCSV } from '@/utils/csvExport';
import { Download, RefreshCw, Trophy } from 'lucide-react';

interface GameResultScreenProps { state: GameState; dispatch: React.Dispatch<GameAction>; onNewGame: () => void; }

export const GameResultScreen = ({ state, onNewGame }: GameResultScreenProps) => {
  const awayColor = getTeamColor(state.awayTeam.color);
  const homeColor = getTeamColor(state.homeTeam.color);
  const winner = state.homeScore > state.awayScore ? 'home' : state.awayScore > state.homeScore ? 'away' : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background text-foreground p-4">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-2xl font-bold text-center mb-3 flex items-center justify-center gap-2"><Trophy className="text-yellow-500" size={28} />試合終了</h1>
        {state.isWalkoff && <div className="text-center text-yellow-500 font-bold mb-6 text-lg animate-pulse">🎉 サヨナラ勝ち！</div>}
        <div className="bg-card/50 rounded-3xl p-6 mb-6 border border-border">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className={`text-sm font-bold px-4 py-2 rounded-xl mb-3 inline-block ${winner === 'away' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`} style={{ backgroundColor: awayColor.primary, color: awayColor.secondary }}>{state.awayTeam.name}</div>
              <div className="text-5xl font-mono font-bold">{state.awayScore}</div>
            </div>
            <div className="text-2xl text-muted-foreground font-light px-4">vs</div>
            <div className="text-center flex-1">
              <div className={`text-sm font-bold px-4 py-2 rounded-xl mb-3 inline-block ${winner === 'home' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`} style={{ backgroundColor: homeColor.primary, color: homeColor.secondary }}>{state.homeTeam.name}</div>
              <div className="text-5xl font-mono font-bold">{state.homeScore}</div>
            </div>
          </div>
        </div>
        <div className="bg-card/30 rounded-2xl p-5 mb-6 border border-border/50">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div><div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">総投球数</div><div className="text-2xl font-mono font-bold">{state.plays.length}</div></div>
            <div><div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">イニング</div><div className="text-2xl font-mono font-bold">{state.currentInning}{state.currentHalf === 'bottom' ? '裏' : '表'}</div></div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => downloadCSV(state)} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-2"><Download size={20} />CSVでダウンロード</button>
          <button onClick={onNewGame} className="w-full py-4 bg-secondary text-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-2"><RefreshCw size={20} />新しい試合を始める</button>
        </div>
      </div>
    </div>
  );
};
