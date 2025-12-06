import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareGameModalProps {
  shareCode: string | null;
  onGenerateCode: () => Promise<void>;
  onClose: () => void;
  isGenerating: boolean;
}

export const ShareGameModal = ({
  shareCode,
  onGenerateCode,
  onClose,
  isGenerating
}: ShareGameModalProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!shareCode) return;

    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast.success('コードをコピーしました');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  const shareUrl = shareCode
    ? `${window.location.origin}?code=${shareCode}`
    : null;

  const copyUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('URLをコピーしました');
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Share2 size={20} className="text-primary" />
            試合を共有
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!shareCode ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-4">
              共有コードを生成すると、他のデバイスでこの試合をリアルタイムで閲覧できます。
            </p>
            <button
              onClick={onGenerateCode}
              disabled={isGenerating}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : '共有コードを生成'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-2">
                共有コード
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-secondary rounded-xl px-4 py-3 font-mono text-2xl font-bold tracking-[0.3em] text-center">
                  {shareCode}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-2">
                共有URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl || ''}
                  className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-sm text-muted-foreground truncate"
                />
                <button
                  onClick={copyUrl}
                  className="px-4 bg-secondary hover:bg-muted text-foreground rounded-xl transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              このコードを共有すると、誰でもこの試合をリアルタイムで閲覧できます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
