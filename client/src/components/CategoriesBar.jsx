import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Waves,
  Building2,
  Landmark,
  Trees,
  Crown,
  Tent,
  Snowflake,
  Sailboat,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: Sparkles },
  { label: 'Trending', icon: Flame },
  { label: 'Beachfront', icon: Waves },
  { label: 'Iconic Cities', icon: Building2 },
  { label: 'Castles', icon: Landmark },
  { label: 'Cabins', icon: Trees },
  { label: 'Mansions', icon: Crown },
  { label: 'Camping', icon: Tent },
  { label: 'Arctic', icon: Snowflake },
  { label: 'Lakefront', icon: Sailboat },
];

const CategoriesBar = ({ activeCategory, onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="categories-wrapper">
      <div className="container">
        <div className="categories-container" id="categories-scroll-container">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isActive = activeCategory === label;
            const translatedLabel = t(`categories.${label}`, label);
            return (
              <button
                key={label}
                className={`category-tab ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(label)}
                id={`category-tab-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{translatedLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesBar;
