import React from 'react';
import { Tag } from 'lucide-react';

export default function CategoryFilter({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  categoryCounts = {},
}) {
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  return (
    <div className="category-filter-wrapper">
      <div className="category-pills-row">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] ?? 0;

          return (
            <button
              key={cat}
              type="button"
              className={`category-chip ${isActive ? 'category-chip-active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <Tag size={13} className="category-chip-icon" />
              <span>{cat}</span>
              <span className={`chip-count ${isActive ? 'chip-count-active' : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
