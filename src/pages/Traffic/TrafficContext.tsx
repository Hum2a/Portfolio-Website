import React, { createContext, useContext } from 'react';
import { useTrafficData } from './useTrafficData';

const TrafficContext = createContext(null);

export function TrafficProvider({ role, children }) {
  const value = useTrafficData(role);
  return <TrafficContext.Provider value={value}>{children}</TrafficContext.Provider>;
}

export function useTraffic() {
  const context = useContext(TrafficContext);
  if (!context) {
    throw new Error('useTraffic must be used within TrafficProvider');
  }
  return context;
}
