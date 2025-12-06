interface SyncIndicatorProps {
  isOnline: boolean;
  isSyncing: boolean;
  syncError: string | null;
  retryCount?: number;
  maxRetries?: number;
}

export const SyncIndicator = ({ 
  isOnline, 
  isSyncing, 
  syncError,
  retryCount = 0,
  maxRetries = 3
}: SyncIndicatorProps) => (
  <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
    {!isOnline && (
      <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-xs rounded-full font-medium">
        オフライン
      </span>
    )}
    {isSyncing && (
      <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium animate-pulse">
        同期中{retryCount > 0 ? ` (リトライ ${retryCount}/${maxRetries})` : '...'}
      </span>
    )}
    {syncError && !isSyncing && (
      <span
        className="px-2.5 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium"
        title={syncError}
      >
        ⚠️ 同期エラー
      </span>
    )}
    {isOnline && !isSyncing && !syncError && (
      <span
        className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
        title="接続中"
      />
    )}
  </div>
);
