import { Player } from '@/types/baseball';
import { generateId } from '@/utils/gameUtils';
import { X, Plus } from 'lucide-react';

interface PlayerInputFormProps {
  players: Player[];
  maxPlayers: number;
  onUpdate: (players: Player[]) => void;
  onSetDefaultOrder: () => void;
}

export const PlayerInputForm = ({
  players,
  maxPlayers,
  onUpdate,
  onSetDefaultOrder
}: PlayerInputFormProps) => {
  const addPlayer = () => {
    if (players.length >= maxPlayers) return;
    onUpdate([...players, { id: generateId(), displayName: '', number: '', isActive: true }]);
  };

  const updatePlayer = (id: string, field: keyof Player, value: string | boolean) => {
    onUpdate(players.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePlayer = (id: string) => {
    onUpdate(players.filter(p => p.id !== id));
  };

  const clearAll = () => {
    onUpdate([]);
  };

  const setDefaults = () => {
    const defaultPlayers: Player[] = Array.from({ length: 9 }, (_, i) => ({
      id: generateId(),
      displayName: `打者${i + 1}`,
      number: `${i + 1}`,
      isActive: true,
    }));
    onUpdate(defaultPlayers);
    onSetDefaultOrder();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          選手登録：打順で登録してください ({players.length}/{maxPlayers})
        </span>
        <div className="flex gap-2">
          {players.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-destructive hover:text-destructive/80 px-2.5 py-1 border border-destructive/30 rounded-full transition-colors"
            >
              クリア
            </button>
          )}
          <button
            onClick={setDefaults}
            className="text-xs text-primary hover:text-primary/80 px-2.5 py-1 border border-primary/30 rounded-full transition-colors"
          >
            デフォルト
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/70 leading-relaxed">
        背番号を入力してください。個人情報に留意してイニシャルや名前を入れても構いません。
      </p>

      <div className="space-y-2">
        {players.map((player, idx) => (
          <div key={player.id} className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs w-5 text-center font-mono">
              {idx + 1}
            </span>
            <input
              type="text"
              placeholder="#"
              value={player.number}
              onChange={e => updatePlayer(player.id, 'number', e.target.value)}
              className="w-14 px-2 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <input
              type="text"
              placeholder="表示名"
              value={player.displayName}
              onChange={e => updatePlayer(player.id, 'displayName', e.target.value)}
              className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={() => removePlayer(player.id)}
              className="text-muted-foreground/60 hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {players.length < maxPlayers && (
        <button
          onClick={addPlayer}
          className="w-full py-2.5 border border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus size={14} />
          選手を追加
        </button>
      )}
    </div>
  );
};
