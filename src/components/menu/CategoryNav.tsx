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
              ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white border-transparent shadow-md scale-105'
              : 'bg-white text-[#231815] border-[#F2DDD0] hover:border-[#EA580C] hover:bg-[#FDEEE4]'
          }`}
        >
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
            selectedCategorySlug === null ? 'bg-[#FBBF24] text-[#941B1B]' : 'bg-[#FDEEE4] text-[#EA580C]'
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
                  ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white border-transparent shadow-md scale-105'
                  : 'bg-white text-[#231815] border-[#F2DDD0] hover:border-[#EA580C] hover:bg-[#FDEEE4]'
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
