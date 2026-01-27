import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Outcome } from '@/lib/data';

interface TradingPanelProps {
  outcomes: Outcome[];
  selectedOutcome?: Outcome;
  onOutcomeSelect: (outcome: Outcome) => void;
}

export default function TradingPanel({ outcomes, selectedOutcome, onOutcomeSelect }: TradingPanelProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState(0);

  const selected = selectedOutcome || outcomes[0];
  const yesOutcome = outcomes.find(o => o.label.toLowerCase() === 'yes') || outcomes[0];
  const noOutcome = outcomes.find(o => o.label.toLowerCase() === 'no') || outcomes[1];

  const quickAmounts = [1, 20, 100, 'Max'] as const;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {/* Outcome Selection */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {selected.label.charAt(0)}
          </span>
        </div>
        <span className="font-medium">{selected.label}</span>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('buy')}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
            mode === 'buy' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
            mode === 'sell' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sell
        </button>
        <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors">
          Market ▼
        </button>
      </div>

      {/* Outcome Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => onOutcomeSelect(yesOutcome)}
          className={cn(
            "py-3 px-4 rounded-lg font-medium text-sm transition-all",
            selected.id === yesOutcome.id
              ? "bg-success text-success-foreground"
              : "bg-success/10 text-success hover:bg-success/20"
          )}
        >
          Yes {(yesOutcome.price * 100).toFixed(1)}¢
        </button>
        <button
          onClick={() => onOutcomeSelect(noOutcome)}
          className={cn(
            "py-3 px-4 rounded-lg font-medium text-sm transition-all",
            selected.id === noOutcome.id
              ? "bg-muted text-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          No {(noOutcome.price * 100).toFixed(1)}¢
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-sm text-muted-foreground">Balance $0.00</span>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">$</span>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="0"
            className="w-full h-14 pl-10 pr-4 text-2xl font-semibold bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-primary text-right"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {quickAmounts.map((qa) => (
          <button
            key={qa}
            onClick={() => setAmount(qa === 'Max' ? 0 : qa)}
            className="py-2 px-3 text-sm font-medium bg-muted/50 hover:bg-muted rounded-lg transition-colors"
          >
            {qa === 'Max' ? 'Max' : `+$${qa}`}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <Button
        className={cn(
          "w-full h-12 font-semibold",
          mode === 'buy' ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
        )}
        disabled={amount <= 0}
      >
        {mode === 'buy' ? `Buy ${selected.label}` : `Sell ${selected.label}`}
      </Button>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        By trading, you agree to the{' '}
        <a href="#" className="text-primary hover:underline">Terms of Use</a>.
      </p>
    </div>
  );
}
