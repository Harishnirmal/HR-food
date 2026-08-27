import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryNav } from './CategoryNav';
import { FoodCard } from './FoodCard';
import { 
  Search, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  Utensils, 
  Filter, 
  X,
  ChevronDown
} from 'lucide-react';

export const MenuView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategorySlug, 
    setSelectedCategorySlug 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);

    return products.filter((p) => {
      // Category filter
      if (selectedCategorySlug) {
        const matchesCategory =
          p.category_slug === selectedCategorySlug ||
          p.category_id === selectedCategorySlug ||
          (activeCategory && p.category_id === activeCategory.id);
        if (!matchesCategory) return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !p.veg) return false;
      if (dietaryFilter === 'non-veg' && p.veg) return false;
      // Bestseller filter
      if (bestsellerOnly && !p.bestseller) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = (p.category_slug || p.category_id || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [products, categories, selectedCategorySlug, dietaryFilter, bestsellerOnly, searchQuery, sortBy]);

  const selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Category Nav Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#183928]">
          {selectedCategory ? selectedCategory.name : 'Complete Dining Menu'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {selectedCategory ? selectedCategory.description : 'Freshly prepared traditional South Indian delicacies, dosas, thalis & biriyanis.'}
        </p>
      </div>

      {/* Categories Horizontal Scroll */}
      <CategoryNav />

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ECE3D5] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dosas, biriyanis, thali, filter coffee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#183928]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges and Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Veg Only Toggle */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Pure Veg</span>
          </button>

          {/* Non-Veg Toggle */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              dietaryFilter === 'non-veg'
                ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
            <span>Non-Veg</span>
          </button>

          {/* Bestseller Toggle */}
          <button
            onClick={() => setBestsellerOnly(!bestsellerOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              bestsellerOnly
                ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-xs'
                : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Bestsellers</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#183928]"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>
      </div>

      {/* Active filter count bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>Showing {filteredProducts.length} dishes</span>
        {(selectedCategorySlug || dietaryFilter !== 'all' || bestsellerOnly || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setDietaryFilter('all');
              setBestsellerOnly(false);
              setSearchQuery('');
            }}
            className="text-[#C85A32] font-bold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#ECE3D5] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-stone-800">
              No dishes found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any dishes matching your filters. Try resetting the filters or searching for something else.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setDietaryFilter('all');
              setBestsellerOnly(false);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#183928] text-white font-bold text-xs shadow-md"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
