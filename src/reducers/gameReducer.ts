import { GameState, GameAction } from '@/types/baseball';
import { createInitialTeam, generateId, getCurrentBatter, advanceBatter } from '@/utils/gameUtils';
import { processOut, processWalk, processHit, processHomerun, processRunnerOut, processRunnerAdvance } from '@/utils/gameLogic';
import { getPlayDescription } from '@/constants/playDescriptions';

export const initialGameState: GameState = {
  id: null,
  homeTeam: createInitialTeam(true),
  awayTeam: createInitialTeam(false),
  innings: 9,
  currentInning: 1,
  currentHalf: 'top',
  count: { balls: 0, strikes: 0 },
  outs: 0,
  runners: { first: null, second: null, third: null },
  homeScore: 0,
  awayScore: 0,
  plays: [],
  status: 'setup',
  isWalkoff: false,
  lastSyncedAt: null,
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading' };

    case 'LOAD_GAME':
      return { ...state, ...action.payload, status: action.payload.status || 'setup' };

    case 'SET_NO_GAME':
      return { ...initialGameState, status: 'setup' };

    case 'SET_TEAM': {
      const { isHome, team } = action.payload;
      const key = isHome ? 'homeTeam' : 'awayTeam';
      return { ...state, [key]: { ...state[key], ...team } };
    }

    case 'SET_INNINGS':
      return { ...state, innings: action.payload };

    case 'START_GAME':
      return { ...state, status: 'playing' };

    case 'SYNC_STATE':
      return { ...state, ...action.payload, lastSyncedAt: Date.now() };

    case 'RECORD_PLAY': {
      const { type, subType, runnersOut, runnersAdvance } = action.payload;
      const batter = getCurrentBatter(state);
      if (!batter) return state;

      const play = {
        id: generateId(),
        inning: state.currentInning,
        half: state.currentHalf,
        batterId: batter.id,
        batterName: batter.displayName,
        pitchNumber: state.plays.filter(
          p => p.inning === state.currentInning &&
               p.half === state.currentHalf &&
               p.batterId === batter.id
        ).length + 1,
        type,
        subType,
        countBefore: { ...state.count },
        runnersBefore: { ...state.runners },
        outs: state.outs,
        runsScored: 0,
        timestamp: new Date(),
        description: getPlayDescription(type, subType),
        runnersOut,
      };

      let newState: GameState = {
        ...state,
        plays: [...state.plays, play],
      };

      switch (type) {
        case 'strike': {
          const newStrikes = state.count.strikes + 1;
          if (newStrikes >= 3) {
            return processOut({ ...newState, count: { balls: 0, strikes: 0 } }, 1);
          }
          return { ...newState, count: { ...state.count, strikes: newStrikes } };
        }
        case 'ball': {
          const newBalls = state.count.balls + 1;
          if (newBalls >= 4) {
            return processWalk(newState);
          }
          return { ...newState, count: { ...state.count, balls: newBalls } };
        }
        case 'foul': {
          if (state.count.strikes < 2) {
            return { ...newState, count: { ...state.count, strikes: state.count.strikes + 1 } };
          }
          return newState;
        }
        case 'out': {
          // Handle runner-specific outs
          if (runnersOut && runnersOut.length > 0) {
            return processRunnerOut(newState, runnersOut);
          }
          const outsToAdd = subType === 'doublePlay' || 
                           subType === 'doublePlayFirstSecond' ||
                           subType === 'doublePlaySecondThird' ||
                           subType === 'doublePlayFirstThird' ? 2 : 1;
          return processOut({ ...newState, count: { balls: 0, strikes: 0 } }, outsToAdd);
        }
        case 'runnerOut': {
          // Process runner out at specific base
          if (runnersOut && runnersOut.length > 0) {
            return processRunnerOut(newState, runnersOut);
          }
          return newState;
        }
        case 'hit':
          return processHit(newState, subType || 'single');
        case 'homerun':
          return processHomerun(newState);
        case 'walk':
        case 'hitByPitch':
          return processWalk(newState);
        case 'caughtStealing':
          return processOut(newState, 1);
        case 'advance': {
          // Process runner advancement (error, wild pitch, passed ball)
          if (runnersAdvance && runnersAdvance.length > 0) {
            return processRunnerAdvance(newState, runnersAdvance);
          }
          return newState;
        }
        default:
          return newState;
      }
    }

    case 'UNDO_LAST': {
      if (state.plays.length === 0) return state;
      return action.payload || state;
    }

    case 'END_GAME':
      return { ...state, status: 'finished' };

    case 'RESET_GAME':
      return { ...initialGameState, status: 'setup' };

    default:
      return state;
  }
};
