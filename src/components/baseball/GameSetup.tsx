import { useState, useCallback } from 'react';
import { GameState, GameAction, Team } from '@/types/baseball';
import { getTeamColor } from '@/constants/teamColors';
import { PlayerInputForm } from './PlayerInputForm';
import { TeamColorPicker } from './TeamColorPicker';
import { JoinGameModal } from './JoinGameModal';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface GameSetupProps { state: GameState; dispatch: React.Dispatch<GameAction>; onStartGame: () => Promise<void>; onJoinGame: (shareCode: string) => Promise<boolean>; isStandalone?: boolean; onToggleStandalone?: () => void; }

export const GameSetup = ({ state, dispatch, onStartGame, onJoinGame, isStandalone = false, onToggleStandalone }: GameSetupProps) => {
  const [activeTeam, setActiveTeam] = useState<'away' | 'home'>('away');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const updateTeam = (isHome: boolean, updates: Partial<Team>) => dispatch({ type: 'SET_TEAM', payload: { isHome, team: updates } });
  const team = activeTeam === 'home' ? state.homeTeam : state.awayTeam;
  const isHome = activeTeam === 'home';
  const teamColorInfo = getTeamColor(team.color);
  const canStart = state.homeTeam.name.trim() !== '' && state.awayTeam.name.trim() !== '' && state.homeTeam.players.length >= 9 && state.awayTeam.players.length >= 9 && state.homeTeam.battingOrder.length === 9 && state.awayTeam.battingOrder.length === 9;
  const setBattingOrder = () => updateTeam(isHome, { battingOrder: team.players.slice(0, 9).map(p => p.id) });
  const handleStartGame = async () => { setIsStarting(true); try { dispatch({ type: 'START_GAME' }); await onStartGame(); } finally { setIsStarting(false); } };
  const handleJoinGame = useCallback(async (shareCode: string) => { const success = await onJoinGame(shareCode); if (success) setShowJoinModal(false); return success; }, [onJoinGame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background text-foreground p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 tracking-wide flex items-center justify-center gap-2"><span className="text-3xl">⚾</span>野球スコアブック</h1>
        <div className="flex gap-2 mb-6">
          {!isStandalone && <button onClick={() => setShowJoinModal(true)} className="flex-1 py-3 bg-secondary hover:bg-muted text-foreground rounded-xl font-medium flex items-center justify-center gap-2 border border-border"><Users size={18} />試合に参加</button>}
          {onToggleStandalone && <button onClick={onToggleStandalone} className={`${isStandalone ? 'flex-1' : ''} py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 border ${isStandalone ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' : 'bg-secondary border-border'}`}>{isStandalone ? <><WifiOff size={18} />オフラインモード</> : <><Wifi size={18} />オンライン</>}</button>}
        </div>
        {isStandalone && <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-600">オフラインモード：データは同期されません。</div>}
        <div className="mb-6"><label className="block text-xs text-muted-foreground mb-2.5 uppercase tracking-wider font-medium">イニング数</label><div className="flex gap-2">{[5, 7, 9].map(n => <button key={n} onClick={() => dispatch({ type: 'SET_INNINGS', payload: n })} className={`flex-1 py-3 rounded-xl font-bold text-sm ${state.innings === n ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-muted'}`}>{n}回</button>)}</div></div>
        <div className="flex mb-5 bg-secondary/50 rounded-xl p-1"><button onClick={() => setActiveTeam('away')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${activeTeam === 'away' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>先攻（ビジター）</button><button onClick={() => setActiveTeam('home')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${activeTeam === 'home' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>後攻（ホーム）</button></div>
        <div className="bg-card/50 rounded-2xl p-5 mb-5 border-l-4" style={{ borderLeftColor: teamColorInfo.primary }}>
          <input type="text" placeholder="チーム名を入力" value={team.name} onChange={e => updateTeam(isHome, { name: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl mb-5 focus:border-primary focus:outline-none" />
          <div className="mb-5"><TeamColorPicker selectedColor={team.color} onSelect={(color) => updateTeam(isHome, { color })} /></div>
          <PlayerInputForm players={team.players} maxPlayers={20} onUpdate={players => updateTeam(isHome, { players })} onSetDefaultOrder={setBattingOrder} />
          {team.players.length >= 9 && team.battingOrder.length !== 9 && <button onClick={setBattingOrder} className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm">上位9人を打順に設定</button>}
          {team.battingOrder.length === 9 && <div className="mt-4 text-green-500 text-sm text-center font-medium">✓ 打順設定完了</div>}
        </div>
        <button onClick={handleStartGame} disabled={!canStart || isStarting} className={`w-full py-4 rounded-2xl font-bold text-lg ${canStart ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>{isStarting ? '作成中...' : canStart ? '試合開始 ⚾' : '両チームの設定を完了してください'}</button>
      </div>
      {showJoinModal && <JoinGameModal onJoin={handleJoinGame} onClose={() => setShowJoinModal(false)} />}
    </div>
  );
};
