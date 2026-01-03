import { createContext, useContext, useState, ReactNode } from 'react';
import { Lodge } from '@/lib/types';
import { lodgeStore } from '@/lib/store';

interface LodgeContextType {
  activeLodge: Lodge | null;
  setActiveLodge: (lodge: Lodge | null) => void;
  lodges: Lodge[];
  refreshLodges: () => void;
}

const LodgeContext = createContext<LodgeContextType | undefined>(undefined);

export function LodgeProvider({ children }: { children: ReactNode }) {
  const [activeLodge, setActiveLodge] = useState<Lodge | null>(() => {
    const lodges = lodgeStore.getAll();
    return lodges.length > 0 ? lodges[0] : null;
  });
  const [lodges, setLodges] = useState<Lodge[]>(lodgeStore.getAll());

  const refreshLodges = () => {
    const updated = lodgeStore.getAll();
    setLodges(updated);
    if (activeLodge) {
      const refreshed = updated.find(l => l.id === activeLodge.id);
      if (refreshed) setActiveLodge(refreshed);
    }
  };

  return (
    <LodgeContext.Provider value={{ activeLodge, setActiveLodge, lodges, refreshLodges }}>
      {children}
    </LodgeContext.Provider>
  );
}

export function useLodge() {
  const context = useContext(LodgeContext);
  if (!context) {
    throw new Error('useLodge deve ser usado dentro de LodgeProvider');
  }
  return context;
}
