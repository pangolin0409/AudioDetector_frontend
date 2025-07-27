import React from 'react';

export function Button({ children, onClick, disabled, className, variant, size, ...props }) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  let style = baseStyle;

  if (variant === "outline") {
    style += " border border-gray-300 text-gray-700 hover:bg-gray-100";
  } else if (variant === "destructive") {
    style += " bg-red-500 text-white hover:bg-red-600";
  } else {
    style += " bg-blue-500 text-white hover:bg-blue-600";
  }

  if (size === "lg") {
    style += " px-6 py-3 text-lg";
  } else if (size === "sm") {
    style += " px-3 py-1 text-sm";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${style} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
