import { useState, useRef } from 'react';

interface SubOption {
  label: string;
  onClick: () => void;
}

interface LongPressButtonProps {
  label: string;
  onClick: () => void;
  subOptions?: SubOption[];
  className?: string;
  disabled?: boolean;
}

export const LongPressButton = ({
  label,
  onClick,
  subOptions,
  className = '',
  disabled = false
}: LongPressButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    if (subOptions && subOptions.length > 0) {
      pressTimer.current = setTimeout(() => setShowMenu(true), 500);
    }
  };

  const handleEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!showMenu) onClick();
  };

  const handleCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <div className="relative">
      <button
        className={`
          w-full px-3 py-3 rounded-xl font-bold text-sm
          transition-all duration-150
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg
          ${className}
        `}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleCancel}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleCancel}
        disabled={disabled}
      >
        {label}
        {subOptions && subOptions.length > 0 && (
          <span className="ml-1.5 text-xs opacity-60">⋮</span>
        )}
      </button>

      {showMenu && subOptions && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover rounded-xl shadow-2xl z-50 overflow-hidden min-w-max border border-border animate-scale-in">
            {subOptions.map((opt, idx) => (
              <button
                key={idx}
                className="block w-full px-4 py-3 text-sm text-foreground hover:bg-muted text-left whitespace-nowrap border-b border-border last:border-0 transition-colors"
                onClick={() => {
                  opt.onClick();
                  setShowMenu(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
