import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

interface SyncQueueItem {
  id: string;
  operation: () => Promise<void>;
  retryCount: number;
  timestamp: number;
}

export const useSyncWithRetry = (config: Partial<RetryConfig> = {}) => {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const syncQueueRef = useRef<SyncQueueItem[]>([]);
  const isProcessingRef = useRef(false);

  const calculateDelay = (attempt: number): number => {
    // Exponential backoff with jitter
    const exponentialDelay = retryConfig.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * 500;
    return Math.min(exponentialDelay + jitter, retryConfig.maxDelayMs);
  };

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || syncQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    setIsSyncing(true);

    while (syncQueueRef.current.length > 0) {
      const item = syncQueueRef.current[0];

      try {
        await item.operation();
        // Success - remove from queue
        syncQueueRef.current.shift();
        setSyncError(null);
        setRetryCount(0);
        console.log(`Sync successful for item ${item.id}`);
      } catch (error: any) {
        console.error(`Sync failed for item ${item.id}:`, error);
        
        if (item.retryCount < retryConfig.maxRetries) {
          // Retry with exponential backoff
          item.retryCount++;
          setRetryCount(item.retryCount);
          const delay = calculateDelay(item.retryCount);
          
          console.log(`Retrying item ${item.id} in ${delay}ms (attempt ${item.retryCount}/${retryConfig.maxRetries})`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Max retries exceeded - remove from queue and notify
          syncQueueRef.current.shift();
          setSyncError(`同期に失敗しました: ${error.message}`);
          toast.error('同期に失敗しました。データはローカルに保存されています。');
          console.error(`Max retries exceeded for item ${item.id}`);
        }
      }
    }

    isProcessingRef.current = false;
    setIsSyncing(false);
  }, [retryConfig.maxRetries]);

  const addToQueue = useCallback((id: string, operation: () => Promise<void>) => {
    // Check for duplicate operations
    const existingIndex = syncQueueRef.current.findIndex(item => item.id === id);
    if (existingIndex >= 0) {
      // Replace existing operation with new one
      syncQueueRef.current[existingIndex] = {
        id,
        operation,
        retryCount: 0,
        timestamp: Date.now(),
      };
    } else {
      syncQueueRef.current.push({
        id,
        operation,
        retryCount: 0,
        timestamp: Date.now(),
      });
    }
    
    // Start processing if not already running
    processQueue();
  }, [processQueue]);

  const clearQueue = useCallback(() => {
    syncQueueRef.current = [];
    setIsSyncing(false);
    setSyncError(null);
    setRetryCount(0);
  }, []);

  const getQueueLength = useCallback(() => {
    return syncQueueRef.current.length;
  }, []);

  return {
    isSyncing,
    syncError,
    retryCount,
    maxRetries: retryConfig.maxRetries,
    addToQueue,
    clearQueue,
    getQueueLength,
  };
};
