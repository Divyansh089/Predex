import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { leaderboardData, biggestWins, formatMoney, formatProfitLoss } from '@/lib/data';
import { cn } from '@/lib/utils';

const timePeriods = ['Today', 'Weekly', 'Monthly', 'All'] as const;
const sortOptions = ['Profit/Loss', 'Volume'] as const;

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<typeof timePeriods[number]>('Monthly');
  const [selectedSort, setSelectedSort] = useState<typeof sortOptions[number]>('Profit/Loss');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = leaderboardData.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (selectedSort === 'Profit/Loss') {
      return b.profitLoss - a.profitLoss;
    }
    return b.volume - a.volume;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Time Period Tabs */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                {timePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      selectedPeriod === period
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm">
                All Categories
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Tabs */}
            <div className="flex items-center gap-6 mb-4 border-b border-border">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={cn(
                    "pb-3 text-sm font-medium border-b-2 transition-colors",
                    selectedSort === option
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {sortedUsers.map((user, index) => (
                <div
                  key={user.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-colors",
                    user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  )}
                >
                  <span className="w-8 text-center text-muted-foreground font-medium">
                    {user.isCurrentUser ? '—' : user.rank}
                  </span>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user.username}
                      {user.isCurrentUser && <span className="text-muted-foreground"> (You)</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      user.profitLoss >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {user.isCurrentUser ? '—' : formatProfitLoss(user.profitLoss)}
                    </p>
                  </div>

                  <div className="text-right w-32">
                    <p className="text-muted-foreground">
                      {user.isCurrentUser ? '—' : formatMoney(user.volume)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Current User Highlight */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <span className="w-8 text-center text-muted-foreground font-medium">—</span>
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">predexUser01 <span className="text-muted-foreground">(You)</span></p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">—</p>
                </div>
                <div className="text-right w-32">
                  <p className="text-muted-foreground">—</p>
                </div>
              </div>
            </div>
          </div>

          {/* Biggest Wins Sidebar */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Biggest wins this month</h2>
              <div className="space-y-4">
                {biggestWins.map((win, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-muted-foreground text-sm w-4">{index + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {win.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{win.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{win.market}</p>
                      <p className="text-xs">
                        <span className="text-muted-foreground">{formatMoney(win.initialValue)}</span>
                        <span className="text-muted-foreground"> → </span>
                        <span className="text-success">{formatMoney(win.finalValue)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
