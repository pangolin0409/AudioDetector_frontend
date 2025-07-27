import React from 'react';

export function Badge({ children, className, variant, ...props }) {
  let style = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  if (variant === "destructive") {
    style += " bg-red-100 text-red-800";
  } else if (variant === "secondary") {
    style += " bg-gray-100 text-gray-800";
  } else {
    style += " bg-blue-100 text-blue-800";
  }
  return (
    <span className={`${style} ${className || ''}`} {...props}>
      {children}
    </span>
  );
}
