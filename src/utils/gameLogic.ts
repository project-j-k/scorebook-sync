import { GameState, RunnerOutInfo, RunnerAdvanceInfo } from '@/types/baseball';
import { advanceBatter, checkWalkoff, getCurrentBatter } from './gameUtils';

export const processOut = (state: GameState, outsToAdd: number): GameState => {
  const newOuts = state.outs + outsToAdd;
  const battingTeamKey = state.currentHalf === 'top' ? 'awayTeam' : 'homeTeam';

  if (newOuts >= 3) {
    const isEndOfInning = state.currentHalf === 'bottom';
    const newInning = isEndOfInning ? state.currentInning + 1 : state.currentInning;
    const newHalf = isEndOfInning ? 'top' : 'bottom';

    if (checkWalkoff({ ...state, currentInning: newInning, currentHalf: newHalf })) {
      return { ...state, status: 'finished', isWalkoff: true };
    }

    if (newInning > state.innings && state.homeScore !== state.awayScore) {
      return { ...state, status: 'finished' };
    }

    return {
      ...state,
      outs: 0,
      count: { balls: 0, strikes: 0 },
      runners: { first: null, second: null, third: null },
      currentInning: newInning,
      currentHalf: newHalf,
      [battingTeamKey]: advanceBatter(state[battingTeamKey]),
    };
  }

  return {
    ...state,
    outs: newOuts,
    count: { balls: 0, strikes: 0 },
    [battingTeamKey]: advanceBatter(state[battingTeamKey]),
  };
};

// New: Process runner out at specific base(s)
export const processRunnerOut = (state: GameState, runnersOut: RunnerOutInfo[]): GameState => {
  const battingTeamKey = state.currentHalf === 'top' ? 'awayTeam' : 'homeTeam';
  let newRunners = { ...state.runners };
  let outsToAdd = 0;

  // Remove runners from specified bases
  for (const runnerOut of runnersOut) {
    if (runnerOut.base === 'first' && newRunners.first) {
      newRunners.first = null;
      outsToAdd++;
    } else if (runnerOut.base === 'second' && newRunners.second) {
      newRunners.second = null;
      outsToAdd++;
    } else if (runnerOut.base === 'third' && newRunners.third) {
      newRunners.third = null;
      outsToAdd++;
    }
  }

  const newOuts = state.outs + outsToAdd;

  if (newOuts >= 3) {
    const isEndOfInning = state.currentHalf === 'bottom';
    const newInning = isEndOfInning ? state.currentInning + 1 : state.currentInning;
    const newHalf = isEndOfInning ? 'top' : 'bottom';

    if (checkWalkoff({ ...state, currentInning: newInning, currentHalf: newHalf })) {
      return { ...state, status: 'finished', isWalkoff: true };
    }

    if (newInning > state.innings && state.homeScore !== state.awayScore) {
      return { ...state, status: 'finished' };
    }

    return {
      ...state,
      outs: 0,
      count: { balls: 0, strikes: 0 },
      runners: { first: null, second: null, third: null },
      currentInning: newInning,
      currentHalf: newHalf,
    };
  }

  return {
    ...state,
    outs: newOuts,
    runners: newRunners,
  };
};

export const processWalk = (state: GameState): GameState => {
  const batter = getCurrentBatter(state);
  if (!batter) return state;

  let newRunners = { ...state.runners };
  let runsScored = 0;

  if (newRunners.first) {
    if (newRunners.second) {
      if (newRunners.third) {
        runsScored = 1;
      }
      newRunners.third = newRunners.second;
    }
    newRunners.second = newRunners.first;
  }
  newRunners.first = batter.id;

  const battingTeamKey = state.currentHalf === 'top' ? 'awayTeam' : 'homeTeam';
  const scoreKey = state.currentHalf === 'top' ? 'awayScore' : 'homeScore';

  const newState: GameState = {
    ...state,
    runners: newRunners,
    count: { balls: 0, strikes: 0 },
    [scoreKey]: state[scoreKey] + runsScored,
    [battingTeamKey]: advanceBatter(state[battingTeamKey]),
  };

  if (checkWalkoff(newState)) {
    return { ...newState, status: 'finished', isWalkoff: true };
  }

  return newState;
};

export const processHit = (state: GameState, hitType: string): GameState => {
  const batter = getCurrentBatter(state);
  if (!batter) return state;

  let newRunners = { ...state.runners };
  let runsScored = 0;
  const bases = hitType === 'single' ? 1 : hitType === 'double' ? 2 : 3;

  if (newRunners.third) {
    runsScored++;
    newRunners.third = null;
  }
  if (newRunners.second) {
    if (bases >= 2) {
      runsScored++;
    } else {
      newRunners.third = newRunners.second;
    }
    newRunners.second = null;
  }
  if (newRunners.first) {
    if (bases >= 3) {
      runsScored++;
    } else if (bases === 2) {
      newRunners.third = newRunners.first;
    } else {
      newRunners.second = newRunners.first;
    }
    newRunners.first = null;
  }

  if (bases === 1) newRunners.first = batter.id;
  else if (bases === 2) newRunners.second = batter.id;
  else newRunners.third = batter.id;

  const battingTeamKey = state.currentHalf === 'top' ? 'awayTeam' : 'homeTeam';
  const scoreKey = state.currentHalf === 'top' ? 'awayScore' : 'homeScore';

  const newState: GameState = {
    ...state,
    runners: newRunners,
    count: { balls: 0, strikes: 0 },
    [scoreKey]: state[scoreKey] + runsScored,
    [battingTeamKey]: advanceBatter(state[battingTeamKey]),
  };

  if (checkWalkoff(newState)) {
    return { ...newState, status: 'finished', isWalkoff: true };
  }

  return newState;
};

export const processHomerun = (state: GameState): GameState => {
  const batter = getCurrentBatter(state);
  if (!batter) return state;

  let runsScored = 1;
  if (state.runners.first) runsScored++;
  if (state.runners.second) runsScored++;
  if (state.runners.third) runsScored++;

  const battingTeamKey = state.currentHalf === 'top' ? 'awayTeam' : 'homeTeam';
  const scoreKey = state.currentHalf === 'top' ? 'awayScore' : 'homeScore';

  const newState: GameState = {
    ...state,
    runners: { first: null, second: null, third: null },
    count: { balls: 0, strikes: 0 },
    [scoreKey]: state[scoreKey] + runsScored,
    [battingTeamKey]: advanceBatter(state[battingTeamKey]),
  };

  if (checkWalkoff(newState)) {
    return { ...newState, status: 'finished', isWalkoff: true };
  }

  return newState;
};

// Process runner advancement (error, wild pitch, passed ball)
export const processRunnerAdvance = (state: GameState, advances: RunnerAdvanceInfo[]): GameState => {
  let newRunners = { ...state.runners };
  let runsScored = 0;

  // Sort advances from third base first to avoid collision
  const sortedAdvances = [...advances].sort((a, b) => {
    const order = { third: 0, second: 1, first: 2 };
    return order[a.fromBase] - order[b.fromBase];
  });

  for (const advance of sortedAdvances) {
    const runnerId = newRunners[advance.fromBase];
    if (!runnerId) continue;

    // Clear the original base
    newRunners[advance.fromBase] = null;

    // Move to new base or score
    if (advance.toBase === 'home') {
      runsScored++;
    } else if (advance.toBase === 'third') {
      newRunners.third = runnerId;
    } else if (advance.toBase === 'second') {
      newRunners.second = runnerId;
    }
  }

  const scoreKey = state.currentHalf === 'top' ? 'awayScore' : 'homeScore';

  const newState: GameState = {
    ...state,
    runners: newRunners,
    [scoreKey]: state[scoreKey] + runsScored,
  };

  if (checkWalkoff(newState)) {
    return { ...newState, status: 'finished', isWalkoff: true };
  }

  return newState;
};
