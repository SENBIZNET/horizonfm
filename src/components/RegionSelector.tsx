import React from 'react';
import { motion } from 'motion/react';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  variant?: 'light' | 'dark';
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  selectedRegion, 
  onRegionChange, 
  variant = 'light' 
}) => {
  const regions = ['Conakry', 'Kankan', 'Kindia'];
  
  const regionColors: Record<string, string> = {
    'Conakry': '#ffbe0b',
    'Kankan': '#6c5ce7',
    'Kindia': '#00b894'
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-6 relative z-50 rounded-full px-4 ${
      isDark ? 'bg-black/40 backdrop-blur-md border border-white/10' : ''
    }`}>
      <h2 className={`text-[9px] font-black uppercase tracking-[0.2em] shrink-0 ${
        isDark ? 'text-white/60' : 'text-slate-400'
      }`}>
        REGIONS
      </h2>
      <div className="flex items-center gap-2 lg:gap-6">
        {regions.map((region) => (
          <button
            key={region}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRegionChange(region);
            }}
            className="relative py-2 px-1 group cursor-pointer"
          >
            <span className={`text-[11px] lg:text-xs font-black transition-all duration-300 ${
              selectedRegion === region 
                ? (isDark ? 'text-white scale-110' : 'text-slate-900 scale-110')
                : (isDark ? 'text-white/30 hover:text-white/70' : 'text-slate-400 hover:text-slate-600')
            }`}>
              {region.toUpperCase()}
            </span>
            {selectedRegion === region && (
              <motion.div 
                layoutId="region-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: regionColors[region] }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
