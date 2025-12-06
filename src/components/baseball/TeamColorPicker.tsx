import { TeamColorKey } from '@/types/baseball';
import { TEAM_COLORS } from '@/constants/teamColors';
import { Check } from 'lucide-react';

interface TeamColorPickerProps {
  selectedColor: TeamColorKey;
  onSelect: (color: TeamColorKey) => void;
}

export const TeamColorPicker = ({ selectedColor, onSelect }: TeamColorPickerProps) => (
  <div>
    <label className="block text-xs text-muted-foreground mb-2.5 uppercase tracking-wider font-medium">
      チームカラー
    </label>
    <div className="grid grid-cols-7 gap-2">
      {Object.entries(TEAM_COLORS).map(([key, color]) => (
        <button
          key={key}
          onClick={() => onSelect(key as TeamColorKey)}
          className={`
            aspect-square rounded-lg transition-all relative
            ${selectedColor === key
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 z-10'
              : 'hover:scale-105'
            }
          `}
          style={{ backgroundColor: color.primary }}
          title={color.name}
        >
          {selectedColor === key && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Check
                size={14}
                className="drop-shadow-lg"
                style={{ color: color.secondary }}
              />
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);
