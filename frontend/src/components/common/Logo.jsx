import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', to = '/', showText = true, inverted = false }) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black'
  };

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Trophy Icon matching Reference UI */}
      <div className={`${iconDimensions[size]} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-xs">
          {/* Base pedestal in royal blue */}
          <path d="M10 27H22C22.5523 27 23 27.4477 23 28C23 28.5523 22.5523 29 22 29H10C9.44772 29 9 28.5523 9 28C9 27.4477 9.44772 27 10 27Z" fill="#1D4ED8" />
          <path d="M12 24H20L19 27H13L12 24Z" fill="#2563EB" />
          <path d="M14 19H18V24H14V19Z" fill="#3B82F6" />
          {/* Main Cup in Crimson Red with gradient */}
          <path d="M7 6H25V13C25 17.4183 20.9706 21 16 21C11.0294 21 7 17.4183 7 13V6Z" fill="#E63946" />
          {/* Cup handles */}
          <path d="M7 8H4.5C3.67157 8 3 8.67157 3 9.5V11.5C3 13.9853 5.01472 16 7.5 16H8V14H7.5C6.11929 14 5 12.8807 5 11.5V10H7V8Z" fill="#F59E0B" />
          <path d="M25 8H27.5C28.3284 8 29 8.67157 29 9.5V11.5C29 13.9853 26.9853 16 24.5 16H24V14H24.5C25.8807 14 27 12.8807 27 11.5V10H25V8Z" fill="#F59E0B" />
          {/* Cup Rim & Star Emblem */}
          <path d="M6 5H26C26.5523 5 27 5.44772 27 6C27 6.55228 26.5523 7 26 7H6C5.44772 7 5 6.55228 5 6C5 5.44772 5.44772 5 6 5Z" fill="#D90429" />
          <path d="M16 9.5L17.2 12.5H20.3L17.8 14.3L18.7 17.3L16 15.4L13.3 17.3L14.2 14.3L11.7 12.5H14.8L16 9.5Z" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} tracking-tight transition-colors duration-200 ${
            inverted
              ? 'text-white group-hover:text-brand-red'
              : 'text-slate-900 group-hover:text-brand-red'
          }`}
        >
          Sports{' '}
          <span className={inverted ? 'text-slate-300' : 'text-slate-800'}>
            Scheduler
          </span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};
