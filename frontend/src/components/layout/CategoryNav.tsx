import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { categories, subcategories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function CategoryNav({
  selectedCategory,
  onCategoryChange,
  selectedFilter,
  onFilterChange,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Main Categories */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 text-sm mr-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-medium">Trending</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <button className="nav-link flex items-center gap-1 text-sm whitespace-nowrap">
            <Zap className="w-4 h-4" />
            Breaking
          </button>
          <button className="nav-link flex items-center gap-1 text-sm whitespace-nowrap">
            <Sparkles className="w-4 h-4" />
            New
          </button>
          <span className="text-muted-foreground">|</span>
          {categories.slice(1).map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "nav-link text-sm whitespace-nowrap px-2 py-1 rounded-md transition-colors",
                selectedCategory === category.id && "text-primary font-medium"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Subcategory Filters */}
        <div className="relative flex items-center gap-2 pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 h-8 w-8 bg-background/80 hover:bg-muted"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-10"
          >
            <button
              onClick={() => onFilterChange('all')}
              className={cn(
                "category-tab",
                selectedFilter === 'all' ? "category-tab-active" : "category-tab-inactive"
              )}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => onFilterChange(sub.toLowerCase())}
                className={cn(
                  "category-tab",
                  selectedFilter === sub.toLowerCase() ? "category-tab-active" : "category-tab-inactive"
                )}
              >
                {sub}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 h-8 w-8 bg-background/80 hover:bg-muted"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
