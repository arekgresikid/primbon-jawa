import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbProps {
  items: {
    label: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-6 px-1">
      <div className="flex items-center gap-1 cursor-pointer hover:text-gold-600 transition-colors" onClick={items[0].onClick}>
        <Home size={12} />
        <span>Primbon</span>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-stone-300" />
          <button
            onClick={item.onClick}
            disabled={item.active}
            className={cn(
              "transition-colors",
              item.active 
                ? "text-gold-600 dark:text-gold-500 cursor-default" 
                : "hover:text-stone-700 dark:hover:text-stone-200"
            )}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
