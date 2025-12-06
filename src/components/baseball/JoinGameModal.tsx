import { useState } from 'react';
import { Users, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

interface JoinGameModalProps {
  onJoin: (shareCode: string) => Promise<boolean>;
  onClose: () => void;
}

export const JoinGameModal = ({ onJoin, onClose }: JoinGameModalProps) => {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('6桁のコードを入力してください');
      return;
    }

    setIsJoining(true);
    try {
      const success = await onJoin(code.toUpperCase());
      if (!success) {
        toast.error('試合が見つかりませんでした');
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            試合に参加
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-5">
          共有コードを入力して、進行中の試合に参加します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-2">
              共有コード（6桁）
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABCD12"
              className="w-full bg-secondary rounded-xl px-4 py-3 font-mono text-2xl font-bold tracking-[0.3em] text-center placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={code.length !== 6 || isJoining}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isJoining ? '参加中...' : (
              <>
                参加する
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
