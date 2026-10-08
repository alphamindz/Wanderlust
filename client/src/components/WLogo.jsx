import React from 'react';

const WLogo = ({ size = 24, className = '', style = {} }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Wanderlust"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="wanderlust-wlogo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="100%" stopColor="#E0114A" />
        </linearGradient>
      </defs>
      {/* Rounded Square */}
      <rect width="48" height="48" rx="12" fill="url(#wanderlust-wlogo-gradient)" />
      {/* White Dot above middle of W */}
      <circle cx="24" cy="11" r="2.5" fill="#FFFFFF" />
      {/* White 'W' Path */}
      <path
        d="M10 15 L17 34 L24 21 L31 34 L38 15"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WLogo;
