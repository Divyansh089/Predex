import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import CategoryNav from '@/components/layout/CategoryNav';
import MarketCard from '@/components/markets/MarketCard';
import { markets } from '@/lib/data';

export default function Index() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredMarkets = useMemo(() => {
    let result = markets;

    if (searchQuery) {
      result = result.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory);
    }

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'trending') {
        result = [...result].sort((a, b) => b.volume - a.volume);
      } else if (selectedFilter === 'new') {
        result = result.filter(m => m.isNew);
      } else if (selectedFilter === 'breaking') {
        result = result.filter(m => m.isLive);
      }
    }

    return result;
  }, [searchQuery, selectedCategory, selectedFilter]);

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
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredMarkets.length} markets found
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No markets found</p>
          </div>
        )}
      </main>
    </div>
  );
}
