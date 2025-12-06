import { GameState } from '@/types/baseball';

export const exportToCSV = (state: GameState): string => {
  const headers = ['play_id', 'inning', 'half', 'batter', 'pitch_num', 'type', 'sub_type', 'balls', 'strikes', 'outs', 'timestamp', 'description'].join(',');
  const rows = state.plays.map(play => [
    play.id,
    play.inning,
    play.half,
    `"${play.batterName}"`,
    play.pitchNumber,
    play.type,
    play.subType || '',
    play.countBefore.balls,
    play.countBefore.strikes,
    play.outs,
    play.timestamp.toISOString(),
    `"${play.description}"`
  ].join(','));

  const metadata = [
    `# Game: ${state.awayTeam.name} vs ${state.homeTeam.name}`,
    `# Final Score: ${state.awayScore} - ${state.homeScore}`,
    `# Date: ${new Date().toLocaleDateString('ja-JP')}`,
    ''
  ].join('\n');

  return metadata + headers + '\n' + rows.join('\n');
};

export const downloadCSV = (state: GameState): void => {
  const csv = exportToCSV(state);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `baseball_game_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
