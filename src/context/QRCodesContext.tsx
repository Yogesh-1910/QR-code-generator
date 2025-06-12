import React, { createContext, useContext, ReactNode } from 'react';
import { useQRCodes } from '../hooks/useQRCodes';

// Define the type for the context value, which is the return type of our hook
type QRCodesContextType = ReturnType<typeof useQRCodes>;

// Create the context with an initial undefined value
const QRCodesContext = createContext<QRCodesContextType | undefined>(undefined);

// Create the Provider component
export const QRCodesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const qrCodesData = useQRCodes();

  return (
    <QRCodesContext.Provider value={qrCodesData}>
      {children}
    </QRCodesContext.Provider>
  );
};

// Create a custom hook for easy consumption of the context
export const useQRCodesContext = () => {
  const context = useContext(QRCodesContext);
  if (context === undefined) {
    throw new Error('useQRCodesContext must be used within a QRCodesProvider');
  }
  return context;
};