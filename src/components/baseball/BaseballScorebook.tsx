import { useReducer, useCallback, useState, useEffect, useRef } from 'react';
import { gameReducer, initialGameState } from '@/reducers/gameReducer';
import { useSyncWithRetry } from '@/hooks/useSyncWithRetry';
import { LoadingScreen } from './LoadingScreen';
import { GameSetup } from './GameSetup';
import { MainGameScreen } from './MainGameScreen';
import { GameResultScreen } from './GameResultScreen';
import { toast } from 'sonner';
import { Play, RunnerOutInfo } from '@/types/baseball';

export const BaseballScorebook = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default to standalone for now
  const pendingPlayRef = useRef<{ play: Play; stateBefore: any } | null>(null);
  
  const { isSyncing, syncError, retryCount, maxRetries, addToQueue } = useSyncWithRetry({ maxRetries: 3, baseDelayMs: 1000 });

  useEffect(() => {
    const standalone = localStorage.getItem('baseball-standalone');
    if (standalone === '1') setIsStandalone(true);
  }, []);

  const handleStartGame = useCallback(async () => {
    if (isStandalone) {
      toast.success('試合を開始しました（オフラインモード）');
      return;
    }
    toast.success('試合を開始しました');
  }, [isStandalone]);

  const handleRecordPlay = useCallback((type: string, subType?: string, runnersOut?: RunnerOutInfo[]) => {
    const stateBefore = JSON.parse(JSON.stringify(state));
    dispatch({ type: 'RECORD_PLAY', payload: { type, subType, runnersOut } });
    if (state.id && !isStandalone) {
      pendingPlayRef.current = { play: {} as Play, stateBefore };
    }
  }, [state, isStandalone]);

  const handleJoinGame = useCallback(async (code: string): Promise<boolean> => {
    toast.info('オフラインモードでは試合参加機能は使用できません');
    return false;
  }, []);

  const handleGenerateShareCode = useCallback(async () => {
    toast.info('オフラインモードでは共有機能は使用できません');
  }, []);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    setShareCode(null);
    setIsViewOnly(false);
  }, []);

  const handleToggleStandalone = useCallback(() => {
    if (isStandalone) {
      localStorage.removeItem('baseball-standalone');
      setIsStandalone(false);
      toast.success('オンラインモードに切り替えました');
    } else {
      localStorage.setItem('baseball-standalone', '1');
      setIsStandalone(true);
      toast.success('オフラインモードに切り替えました');
    }
  }, [isStandalone]);

  const syncStatus = { isOnline: !isStandalone, isSyncing, syncError, retryCount, maxRetries };

  if (isInitializing) return <LoadingScreen />;

  return (
    <div className="font-sans antialiased">
      {state.status === 'loading' && <LoadingScreen />}
      {state.status === 'setup' && <GameSetup state={state} dispatch={dispatch} onStartGame={handleStartGame} onJoinGame={handleJoinGame} isStandalone={isStandalone} onToggleStandalone={handleToggleStandalone} />}
      {state.status === 'playing' && <MainGameScreen state={state} dispatch={dispatch} onRecordPlay={handleRecordPlay} syncStatus={syncStatus} shareCode={shareCode} onGenerateShareCode={handleGenerateShareCode} isViewOnly={isViewOnly} isStandalone={isStandalone} />}
      {state.status === 'finished' && <GameResultScreen state={state} dispatch={dispatch} onNewGame={handleNewGame} />}
    </div>
  );
};
