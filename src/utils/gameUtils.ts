import { GameState, Team, Player } from '@/types/baseball';

export const generateId = (): string =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createDefaultPlayers = (): Player[] => {
  const positions = ['投', '捕', '一', '二', '三', '遊', '左', '中', '右'];
  return positions.map((pos, index) => ({
    id: generateId() + '_' + index,
    displayName: `選手${index + 1}`,
    number: String(index + 1),
    isActive: true,
  }));
};

export const createInitialTeam = (isHome: boolean): Team => {
  const players = createDefaultPlayers();
  const battingOrder = players.map(p => p.id);
  return {
    name: isHome ? 'ホームチーム' : 'アウェイチーム',
    color: isHome ? 'navy' : 'ivory',
    players,
    battingOrder,
    currentBatterIndex: 0,
  };
};

export const getCurrentBatter = (state: GameState): Player | null => {
  const battingTeam = state.currentHalf === 'top' ? state.awayTeam : state.homeTeam;
  if (battingTeam.battingOrder.length === 0) return null;
  const batterId = battingTeam.battingOrder[battingTeam.currentBatterIndex];
  return battingTeam.players.find(p => p.id === batterId) || null;
};

export const advanceBatter = (team: Team): Team => {
  const nextIndex = (team.currentBatterIndex + 1) % team.battingOrder.length;
  return { ...team, currentBatterIndex: nextIndex };
};

export const checkWalkoff = (state: GameState): boolean => {
  if (state.currentHalf === 'bottom' && state.currentInning >= state.innings) {
    return state.homeScore > state.awayScore;
  }
  return false;
};
