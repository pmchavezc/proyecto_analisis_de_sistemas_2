
import { ChevronRight, Info } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  color: 'orange' | 'blue' | 'green';
  info?: string;
  onViewDetails?: () => void;
}

import { useState } from 'react';

export default function StatsCard({ title, value, color, info, onViewDetails }: StatsCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-3 h-3 ${colorClasses[color]} rounded-full`}></div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{title}</span>
          {info && (
            <span className="relative">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                tabIndex={0}
              >
                <Info size={16} />
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-2 z-10">
                  {info}
                </div>
              )}
            </span>
          )}
        </div>
      </div>
  <div className="text-4xl font-bold text-gray-800 mb-2">{value}</div>
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Ver detalles <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
