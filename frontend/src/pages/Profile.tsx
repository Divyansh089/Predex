import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink, Edit, Search, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const timePeriods = ['1D', '1W', '1M', 'ALL'] as const;
const positionTabs = ['Active', 'Closed'] as const;
const activityTabs = ['Positions', 'Activity'] as const;

export default function Profile() {
  const [selectedPeriod, setSelectedPeriod] = useState<typeof timePeriods[number]>('1M');
  const [selectedPositionTab, setSelectedPositionTab] = useState<typeof positionTabs[number]>('Active');
  const [selectedActivityTab, setSelectedActivityTab] = useState<typeof activityTabs[number]>('Positions');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">predexUser01</h1>
                  <button className="px-3 py-1 text-xs border border-border rounded-full hover:bg-muted transition-colors">
                    Connect 𝕏
                  </button>
                  <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Joined Jan 2026 · 0 views</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Positions Value</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Biggest Win</p>
                <p className="text-2xl font-bold">—</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>

            {/* Activity Tabs */}
            <div className="flex items-center gap-6 mb-6 border-b border-border">
              {activityTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedActivityTab(tab)}
                  className={cn(
                    "pb-3 text-sm font-medium border-b-2 transition-colors",
                    selectedActivityTab === tab
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Position Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-muted rounded-lg p-1">
                {positionTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedPositionTab(tab)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      selectedPositionTab === tab
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search positions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm">
                <Filter className="w-4 h-4" />
                Value
              </button>
            </div>

            {/* Positions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-4 font-medium">MARKET</th>
                    <th className="pb-4 font-medium text-right">AVG</th>
                    <th className="pb-4 font-medium text-right">CURRENT</th>
                    <th className="pb-4 font-medium text-right">VALUE ▼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-muted-foreground">
                      No positions found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* P&L Card */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-success">▲</span>
                  <span className="font-medium">Profit/Loss</span>
                </div>
                <div className="flex items-center gap-1">
                  {timePeriods.map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded transition-colors",
                        selectedPeriod === period
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold">$0.00</p>
                <p className="text-sm text-muted-foreground">Past Month</p>
              </div>

              {/* Placeholder Chart */}
              <div className="h-24 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <div className="w-full h-1 bg-primary/20 rounded-full mx-4" />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">P</span>
                </div>
                <span className="text-sm text-muted-foreground">Predex</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
