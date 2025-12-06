import { Count } from '@/types/baseball';

interface CountDisplayProps {
  count: Count;
  outs: number;
}

export const CountDisplay = ({ count, outs }: CountDisplayProps) => (
  <div className="flex justify-center gap-6 my-4 font-mono text-sm">
    {/* Balls */}
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-4 text-xs font-semibold">B</span>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
              i < count.balls
                ? 'bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                : 'border-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>

    {/* Strikes */}
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-4 text-xs font-semibold">S</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
              i < count.strikes
                ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                : 'border-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>

    {/* Outs */}
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-4 text-xs font-semibold">O</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
              i < outs
                ? 'bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                : 'border-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);
