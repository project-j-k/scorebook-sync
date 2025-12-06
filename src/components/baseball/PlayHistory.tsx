import { useMemo } from 'react';
import { Play } from '@/types/baseball';
import { X } from 'lucide-react';

interface PlayHistoryProps {
  plays: Play[];
  onClose: () => void;
}

export const PlayHistory = ({ plays, onClose }: PlayHistoryProps) => {
  const groupedPlays = useMemo(() => {
    const groups: Record<string, Play[]> = {};
    plays.forEach(play => {
      const key = `${play.inning}${play.half === 'top' ? '表' : '裏'}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(play);
    });
    return groups;
  }, [plays]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-card w-full max-w-md rounded-t-3xl max-h-[75vh] overflow-hidden animate-in slide-in-from-bottom border-t border-border">
        <div className="sticky top-0 bg-card p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-lg">プレイ履歴</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedPlays).reverse().map(([inning, inningPlays]) => (
            <div key={inning}>
              <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                {inning}
              </h4>
              <div className="space-y-2">
                {inningPlays.slice().reverse().map(play => (
                  <div
                    key={play.id}
                    className="bg-secondary/50 rounded-xl p-3 text-sm border border-border/50"
                  >
                    <span className="text-muted-foreground">{play.batterName}</span>
                    <span className="text-muted-foreground/50 mx-2">·</span>
                    <span className="text-foreground font-medium">{play.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {plays.length === 0 && (
            <p className="text-muted-foreground text-center py-12 text-sm">
              まだプレイがありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
