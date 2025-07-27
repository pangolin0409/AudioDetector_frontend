import React from 'react';

export function Card({ children, className, ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`pb-2 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h2 className={`text-xl font-semibold ${className || ''}`} {...props}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={`pt-2 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
