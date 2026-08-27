import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ArrowRight, Flame } from 'lucide-react';
import { VegIndicator } from './Badge';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    products, 
    setSelectedProductDetails,
    setCurrentView,
    setSelectedCategorySlug
  } = useApp();

  const [term, setTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!term.trim()) return [];
    const lower = term.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.ingredients?.some((i) => i.toLowerCase().includes(lower))
    );
  }, [term, products]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl bg-[#FCFAF6] rounded-2xl shadow-2xl border border-[#E8DFD3] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#EBE3D5] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#8F4A2D]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search dosas, biriyani, meals, filter coffee..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-lg text-[#1E2420] placeholder:text-[#9A9084] outline-none font-medium"
          />
          {term && (
            <button 
              onClick={() => setTerm('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-stone-900 px-2 py-1 rounded-md bg-stone-100"
          >
            ESC
          </button>
        </div>

        {/* Popular searches suggestions */}
        {!term && (
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Ghee Roast Dosa', 'Thalassery Biriyani', 'Degree Filter Coffee', 'Chicken 65', 'Button Idli', 'South Indian Meals'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTerm(tag)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F1EAE0] text-[#3F332A] hover:bg-[#C85A32] hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {term && (
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-[#F1EAE0]">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-stone-500 font-medium">No dishes found for "{term}"</p>
                <p className="text-xs text-stone-400 mt-1">Try searching for Biriyani, Dosa, Meals or Starters</p>
              </div>
            ) : (
              filteredProducts.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => {
                    setSelectedProductDetails(dish);
                    setIsSearchModalOpen(false);
                  }}
                  className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-[#F3ECE0] cursor-pointer transition-colors group"
                >
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <VegIndicator veg={dish.veg} size="sm" />
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-[#C85A32] transition-colors truncate">
                        {dish.name}
                      </h4>
                      {dish.bestseller && (
                        <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{dish.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-bold text-stone-900">₹{dish.price}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-amber-700 font-medium flex items-center gap-0.5">
                        ★ {dish.rating}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C85A32] group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 bg-[#F5EFE6] border-t border-[#EBE3D5] flex items-center justify-between text-xs text-stone-500">
          <span>Click any dish to customize & order</span>
          <button
            onClick={() => {
              setIsSearchModalOpen(false);
              setCurrentView('menu');
              setSelectedCategorySlug(null);
            }}
            className="text-[#C85A32] font-semibold hover:underline"
          >
            Explore Full Menu →
          </button>
        </div>
      </div>
    </div>
  );
};
