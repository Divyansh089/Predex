import { useState } from 'react';
import { Search, Bookmark, ChevronDown, Info } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { rewardMarkets, rewardCategories } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMarkets = rewardMarkets.filter(market =>
    market.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="gradient-rewards py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Daily Rewards</h1>
              <p className="text-white/80 max-w-lg">
                Earn rewards by placing orders within the spread. Rewards are distributed
                directly to wallets everyday at midnight UTC.{' '}
                <a href="#" className="underline hover:text-white">Learn more</a>
              </p>
            </div>
            <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-white/60 text-sm mb-1">JAN 27 EARNINGS</p>
              <Button className="bg-white text-primary hover:bg-white/90">
                Enable Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {rewardCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "category-tab",
                  selectedCategory === category ? "category-tab-active" : "category-tab-inactive"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bookmark className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Rewards Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Market
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Max Spread
                    <Info className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Min Shares
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Reward
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Comp.
                    <Info className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Earnings
                    <Info className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-4 font-medium">Percent</th>
                <th className="pb-4 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Price
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredMarkets.map((market) => (
                <tr key={market.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {market.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 max-w-xs">{market.title}</p>
                        <a href="#" className="text-xs text-primary hover:underline">Rules</a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">±{market.maxSpread}¢</td>
                  <td className="py-4">{market.minShares}</td>
                  <td className="py-4">
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] text-primary">$</span>
                      </span>
                      {market.reward}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-4 rounded-sm",
                            i < market.competition ? "bg-success" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[10px]">$</span>
                      </span>
                      ${market.earnings.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">-</td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-success text-xs bg-success/10 px-2 py-0.5 rounded">
                        Yes {market.yesPrice}¢
                      </span>
                      <span className="text-destructive text-xs bg-destructive/10 px-2 py-0.5 rounded">
                        No {market.noPrice}¢
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No reward markets found</p>
          </div>
        )}
      </main>
    </div>
  );
}
