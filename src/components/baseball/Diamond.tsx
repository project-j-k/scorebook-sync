import { Runners, TeamColorKey } from '@/types/baseball';
import { getTeamColor } from '@/constants/teamColors';

interface DiamondProps {
  runners: Runners;
  teamColor: TeamColorKey;
  onBaseClick?: (base: 'first' | 'second' | 'third') => void;
  clickable?: boolean;
}

export const Diamond = ({ runners, teamColor, onBaseClick, clickable = false }: DiamondProps) => {
  const colorInfo = getTeamColor(teamColor);

  const handleBaseClick = (base: 'first' | 'second' | 'third') => {
    if (clickable && onBaseClick && runners[base]) {
      onBaseClick(base);
    }
  };

  return (
    <div className="relative w-32 h-32 mx-auto my-4">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Field outline */}
        <path
          d="M50 15 L85 50 L50 85 L15 50 Z"
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="1.5"
        />

        {/* Base paths */}
        <line x1="50" y1="80" x2="80" y2="50" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <line x1="80" y1="50" x2="50" y2="20" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <line x1="50" y1="20" x2="20" y2="50" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <line x1="20" y1="50" x2="50" y2="80" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />

        {/* Home plate */}
        <polygon
          points="50,80 45,85 50,90 55,85"
          fill="hsl(var(--muted-foreground) / 0.8)"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
        />

        {/* First base */}
        <rect
          x="78" y="43" width="14" height="14"
          transform="rotate(45 85 50)"
          fill={runners.first ? colorInfo.primary : 'hsl(var(--muted))'}
          stroke={runners.first ? colorInfo.primary : 'hsl(var(--muted-foreground) / 0.5)'}
          strokeWidth="2"
          className={`${runners.first ? 'drop-shadow-[0_0_8px_currentColor]' : ''} ${clickable && runners.first ? 'cursor-pointer' : ''}`}
          style={{ color: runners.first ? colorInfo.primary : 'transparent' }}
          onClick={() => handleBaseClick('first')}
        />

        {/* Second base */}
        <rect
          x="43" y="8" width="14" height="14"
          transform="rotate(45 50 15)"
          fill={runners.second ? colorInfo.primary : 'hsl(var(--muted))'}
          stroke={runners.second ? colorInfo.primary : 'hsl(var(--muted-foreground) / 0.5)'}
          strokeWidth="2"
          className={`${runners.second ? 'drop-shadow-[0_0_8px_currentColor]' : ''} ${clickable && runners.second ? 'cursor-pointer' : ''}`}
          style={{ color: runners.second ? colorInfo.primary : 'transparent' }}
          onClick={() => handleBaseClick('second')}
        />

        {/* Third base */}
        <rect
          x="8" y="43" width="14" height="14"
          transform="rotate(45 15 50)"
          fill={runners.third ? colorInfo.primary : 'hsl(var(--muted))'}
          stroke={runners.third ? colorInfo.primary : 'hsl(var(--muted-foreground) / 0.5)'}
          strokeWidth="2"
          className={`${runners.third ? 'drop-shadow-[0_0_8px_currentColor]' : ''} ${clickable && runners.third ? 'cursor-pointer' : ''}`}
          style={{ color: runners.third ? colorInfo.primary : 'transparent' }}
          onClick={() => handleBaseClick('third')}
        />
      </svg>
    </div>
  );
};
