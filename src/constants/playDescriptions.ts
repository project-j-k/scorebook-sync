const PLAY_DESCRIPTIONS: Record<string, string> = {
  'strike': 'ストライク',
  'strike-swinging': '空振り',
  'strike-looking': '見逃し',
  'ball': 'ボール',
  'foul': 'ファール',
  'out-strikeout': '三振',
  'out-flyout': 'フライアウト',
  'out-groundout': 'ゴロアウト',
  'out-doublePlay': '併殺打',
  'out-sacrificeFly': '犠牲フライ',
  'out-sacrificeBunt': '犠牲バント',
  // New runner out descriptions
  'out-runnerOutFirst': '１塁ランナーアウト',
  'out-runnerOutSecond': '２塁ランナーアウト',
  'out-runnerOutThird': '３塁ランナーアウト',
  'out-doublePlayFirstSecond': '併殺（１塁・２塁）',
  'out-doublePlaySecondThird': '併殺（２塁・３塁）',
  'out-doublePlayFirstThird': '併殺（１塁・３塁）',
  'hit-single': 'シングルヒット',
  'hit-double': 'ツーベースヒット',
  'hit-triple': 'スリーベースヒット',
  'homerun': 'ホームラン',
  'walk': 'フォアボール',
  'hitByPitch': 'デッドボール',
  'steal': '盗塁成功',
  'caughtStealing': '盗塁死',
  'error': 'エラー',
  'wildPitch': 'ワイルドピッチ',
  'passedBall': 'パスボール',
};

export const getPlayDescription = (type: string, subType?: string): string => {
  const key = subType ? `${type}-${subType}` : type;
  return PLAY_DESCRIPTIONS[key] || type;
};
