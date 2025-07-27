import React, { useState } from 'react';

export function Tabs({ defaultValue, children, className, ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const tabsList = React.Children.toArray(children).find(child => child.type === TabsList);
  const tabsContent = React.Children.toArray(children).filter(child => child.type === TabsContent);

  return (
    <div className={className} {...props}>
      {tabsList && React.cloneElement(tabsList, { activeTab, setActiveTab })}
      {tabsContent.map(content =>
        React.cloneElement(content, { key: content.props.value, activeTab })
      )}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab, className, ...props }) {
  return (
    <div className={`flex border-b ${className || ''}`} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab, className, ...props }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-4 text-center flex-1 ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab, className, ...props }) {
  return activeTab === value ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
}
