import { TeamColor, TeamColorKey } from '@/types/baseball';

export const TEAM_COLORS: Record<TeamColorKey, TeamColor> = {
  ivory: { name: 'アイボリー', primary: '#FFFFF0', secondary: '#2C2C2C' },
  navy: { name: 'ネイビー', primary: '#1B2A4A', secondary: '#FFFFFF' },
  giants: { name: 'ジャイアンツ', primary: '#F97316', secondary: '#000000' },
  tigers: { name: 'タイガース', primary: '#FBBF24', secondary: '#000000' },
  dragons: { name: 'ドラゴンズ', primary: '#1E40AF', secondary: '#FFFFFF' },
  carp: { name: 'カープ', primary: '#DC2626', secondary: '#FFFFFF' },
  baystars: { name: 'ベイスターズ', primary: '#0EA5E9', secondary: '#FFFFFF' },
  swallows: { name: 'スワローズ', primary: '#059669', secondary: '#FFFFFF' },
  hawks: { name: 'ホークス', primary: '#D97706', secondary: '#000000' },
  lions: { name: 'ライオンズ', primary: '#2563EB', secondary: '#FFFFFF' },
  eagles: { name: 'イーグルス', primary: '#991B1B', secondary: '#D4AF37' },
  marines: { name: 'マリーンズ', primary: '#171717', secondary: '#FFFFFF' },
  fighters: { name: 'ファイターズ', primary: '#0369A1', secondary: '#FFFFFF' },
  buffaloes: { name: 'バファローズ', primary: '#1E3A5F', secondary: '#B8860B' },
};

export const getTeamColor = (colorKey: TeamColorKey): TeamColor => {
  return TEAM_COLORS[colorKey] || TEAM_COLORS.navy;
};
