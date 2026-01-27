import { Link } from 'react-router-dom';
import { Bookmark, Gift, Share2 } from 'lucide-react';
import { Market, formatVolume } from '@/lib/data';
import { cn } from '@/lib/utils';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const isBinary = market.outcomes.length === 2;
  const mainOutcome = market.outcomes[0];

  return (
    <Link to={`/market/${market.id}`} className="market-card block">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {market.image ? (
            <img
              src={market.image}
              alt=""
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary">
                {market.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {market.title}
            </h3>
            {isBinary && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold">{mainOutcome.probability}%</span>
                {mainOutcome.change24h && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    mainOutcome.change24h > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {mainOutcome.change24h > 0 ? '+' : ''}{mainOutcome.change24h}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Outcomes */}
        {isBinary ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {market.outcomes.map((outcome) => (
              <button
                key={outcome.id}
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "outcome-btn",
                  outcome.label.toLowerCase() === 'yes' || outcome.label === market.outcomes[0].label
                    ? "outcome-btn-yes"
                    : "outcome-btn-no"
                )}
              >
                {outcome.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <div key={outcome.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{outcome.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{outcome.probability}%</span>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="outcome-btn outcome-btn-yes text-xs px-2 py-1"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="outcome-btn outcome-btn-no text-xs px-2 py-1"
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {market.isNew && (
              <span className="text-primary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                NEW
              </span>
            )}
            {market.isLive && (
              <span className="text-destructive font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                {market.liveStatus}
              </span>
            )}
            <span>{formatVolume(market.volume)} Vol.</span>
            {market.category && (
              <>
                <span>·</span>
                <span className="capitalize">{market.category}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <Gift className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
