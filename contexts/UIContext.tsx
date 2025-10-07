import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isStatusBarVisible: boolean;
  isNavBarVisible: boolean;
  toggleStatusBar: () => void;
  toggleNavBar: () => void;
  showBars: () => void;
  hideBars: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);

  const toggleStatusBar = () => {
    setIsStatusBarVisible(prev => !prev);
  };

  const toggleNavBar = () => {
    setIsNavBarVisible(prev => !prev);
  };

  const showBars = () => {
    setIsStatusBarVisible(true);
    setIsNavBarVisible(true);
  };

  const hideBars = () => {
    setIsStatusBarVisible(false);
    setIsNavBarVisible(true); // Keep nav visible by default
  };

  return (
    <UIContext.Provider
      value={{
        isStatusBarVisible,
        isNavBarVisible,
        toggleStatusBar,
        toggleNavBar,
        showBars,
        hideBars,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};