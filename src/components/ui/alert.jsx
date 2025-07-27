import React from 'react';

export function Alert({ children, className, variant, ...props }) {
  let style = "p-4 rounded-md";
  if (variant === "destructive") {
    style += " bg-red-100 text-red-700";
  } else {
    style += " bg-blue-100 text-blue-700";
  }
  return (
    <div className={`${style} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({ children, className, ...props }) {
  return (
    <p className={`${className || ''}`} {...props}>
      {children}
    </p>
  );
}
