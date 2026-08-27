import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Utensils } from 'lucide-react';

export const CategoryNav: React.FC = () => {
  const { categories, selectedCategorySlug, setSelectedCategorySlug } = useApp();

  const activeCategories = categories.filter((c) => c.active).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="w-full py-4">
      {/* Horizontal category scroll list */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
        {/* 'All Dishes' Tab */}
        <button
          onClick={() => setSelectedCategorySlug(null)}
          className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all select-none ${
            selectedCategorySlug === null
              ? 'bg-[#183928] text-white border-[#183928] shadow-md scale-105'
              : 'bg-white text-stone-700 border-[#E8DFD3] hover:border-[#C85A32] hover:bg-[#FAF6F0]'
          }`}
        >
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
            selectedCategorySlug === null ? 'bg-[#E6C687] text-[#183928]' : 'bg-[#F2EBE1] text-[#8F4A2D]'
          }`}>
            <Utensils className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight whitespace-nowrap">All Dishes</span>
        </button>

        {activeCategories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all select-none group ${
                isSelected
                  ? 'bg-[#183928] text-white border-[#183928] shadow-md scale-105'
                  : 'bg-white text-stone-700 border-[#E8DFD3] hover:border-[#C85A32] hover:bg-[#FAF6F0]'
              }`}
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-7 h-7 rounded-lg object-cover shrink-0 border border-stone-200"
              />
              <span className="font-bold text-sm tracking-tight whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
