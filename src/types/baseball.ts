export type TeamColorKey =
  | 'ivory' | 'navy' | 'giants' | 'tigers' | 'dragons' | 'carp'
  | 'baystars' | 'swallows' | 'hawks' | 'lions' | 'eagles'
  | 'marines' | 'fighters' | 'buffaloes';

export interface TeamColor {
  name: string;
  primary: string;
  secondary: string;
}

export interface Player {
  id: string;
  displayName: string;
  number: string;
  isActive: boolean;
}

export interface Team {
  name: string;
  color: TeamColorKey;
  players: Player[];
  battingOrder: string[];
  currentBatterIndex: number;
}

export interface Runners {
  first: string | null;
  second: string | null;
  third: string | null;
}

export interface Count {
  balls: number;
  strikes: number;
}

// Runner out information for recording specific outs
export interface RunnerOutInfo {
  base: 'first' | 'second' | 'third';
  runnerId: string | null;
}

// Runner advance information for error/wild pitch advancement
export interface RunnerAdvanceInfo {
  fromBase: 'first' | 'second' | 'third';
  toBase: 'second' | 'third' | 'home';
  runnerId: string | null;
}

export interface Play {
  id: string;
  inning: number;
  half: 'top' | 'bottom';
  batterId: string;
  batterName: string;
  pitchNumber: number;
  type: string;
  subType?: string;
  countBefore: Count;
  runnersBefore: Runners;
  outs: number;
  runsScored: number;
  timestamp: Date;
  description: string;
  // New: track which runners were out
  runnersOut?: RunnerOutInfo[];
}

export type GameStatus = 'loading' | 'setup' | 'playing' | 'finished';

export interface GameState {
  id: string | null;
  homeTeam: Team;
  awayTeam: Team;
  innings: number;
  currentInning: number;
  currentHalf: 'top' | 'bottom';
  count: Count;
  outs: number;
  runners: Runners;
  homeScore: number;
  awayScore: number;
  plays: Play[];
  status: GameStatus;
  isWalkoff: boolean;
  lastSyncedAt: number | null;
}

export type GameAction =
  | { type: 'SET_LOADING' }
  | { type: 'LOAD_GAME'; payload: Partial<GameState> }
  | { type: 'SET_NO_GAME' }
  | { type: 'SET_TEAM'; payload: { isHome: boolean; team: Partial<Team> } }
  | { type: 'SET_INNINGS'; payload: number }
  | { type: 'START_GAME' }
  | { type: 'SYNC_STATE'; payload: Partial<GameState> }
  | { type: 'RECORD_PLAY'; payload: { type: string; subType?: string; runnersOut?: RunnerOutInfo[]; runnersAdvance?: RunnerAdvanceInfo[] } }
  | { type: 'UNDO_LAST'; payload?: GameState }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };
