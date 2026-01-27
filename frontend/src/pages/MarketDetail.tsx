import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CategoryNav from '@/components/layout/CategoryNav';
import TradingPanel from '@/components/markets/TradingPanel';
import PriceChart from '@/components/markets/PriceChart';
import MarketCard from '@/components/markets/MarketCard';
import { markets, formatVolume, Outcome } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function MarketDetail() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const market = markets.find(m => m.id === id);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | undefined>(
    market?.outcomes[0]
  );

  const relatedMarkets = markets
    .filter(m => m.id !== id && m.category === market?.category)
    .slice(0, 3);

  if (!market) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Market not found</h1>
          <Link to="/" className="text-primary hover:underline">
            ← Back to markets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {market.title.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{market.title}</h1>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Bookmark className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prediction Summary */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-primary font-medium mb-1">⚡ Predicted</p>
              <p className="text-2xl font-bold text-primary mb-3">
                {market.outcomes[0].label} ({market.outcomes[0].probability}%)
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {market.outcomes.map((outcome, index) => (
                  <div key={outcome.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        index === 0 ? "bg-chart-up" : index === 1 ? "bg-chart-down" : "bg-chart-neutral"
                      )}
                    />
                    <span className="text-sm">
                      {outcome.label} <span className="font-semibold">{outcome.probability}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <PriceChart outcomes={market.outcomes} />

            {/* Market Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-semibold">{formatVolume(market.volume)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">End date:</span>
                <span className="font-semibold">{market.endDate}</span>
              </div>
            </div>

            {/* Outcome Breakdown */}
            <div className="space-y-3">
              {market.outcomes.map((outcome) => (
                <div
                  key={outcome.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {outcome.label.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{outcome.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatVolume(market.volume * (outcome.probability / 100))} Vol.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{outcome.probability}%</span>
                    {outcome.change24h && (
                      <span className={cn(
                        "text-sm px-2 py-1 rounded",
                        outcome.change24h > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                        {outcome.change24h > 0 ? '▲' : '▼'} {Math.abs(outcome.change24h)}%
                      </span>
                    )}
                    <button className="outcome-btn outcome-btn-yes">
                      Buy Yes {(outcome.price * 100).toFixed(1)}¢
                    </button>
                    <button className="outcome-btn outcome-btn-no">
                      Buy No {((1 - outcome.price) * 100).toFixed(1)}¢
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {market.description && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold mb-2">About this market</h3>
                <p className="text-sm text-muted-foreground">{market.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trading Panel */}
            <TradingPanel
              outcomes={market.outcomes}
              selectedOutcome={selectedOutcome}
              onOutcomeSelect={setSelectedOutcome}
            />

            {/* Related Markets */}
            {relatedMarkets.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Related Markets</h3>
                <div className="space-y-4">
                  {relatedMarkets.map((m) => (
                    <MarketCard key={m.id} market={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
