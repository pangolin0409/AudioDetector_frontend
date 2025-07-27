import React, { useState } from 'react';

export function Select({ children, value, onValueChange, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  const trigger = React.Children.toArray(children).find(child => child.type === SelectTrigger);
  const content = React.Children.toArray(children).find(child => child.type === SelectContent);

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" {...props}>
      {trigger && React.cloneElement(trigger, { onClick: () => setIsOpen(!isOpen), value })}
      {isOpen && content && React.cloneElement(content, { onSelect: handleSelect, currentValue: value })}
    </div>
  );
}

export function SelectTrigger({ children, onClick, value, ...props }) {
  const placeholder = React.Children.toArray(children).find(child => child.type === SelectValue)?.props.placeholder;
  const selectedItem = React.Children.toArray(children).find(child => child.type === SelectValue);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {value ? React.cloneElement(selectedItem, { value }) : placeholder}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder, value }) {
  return <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || placeholder}</span>;
}

export function SelectContent({ children, onSelect, currentValue, ...props }) {
  return (
    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80"
      {...props}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { onClick: () => onSelect(child.props.value), isSelected: child.props.value === currentValue })
      )}
    </div>
  );
}

export function SelectItem({ children, value, onClick, isSelected, ...props }) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-accent text-accent-foreground' : ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
