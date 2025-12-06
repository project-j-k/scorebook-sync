export const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-5 animate-bounce">⚾</div>
      <div className="text-foreground text-lg font-medium">読み込み中...</div>
      <div className="mt-5 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  </div>
);
