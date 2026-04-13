'use client';

import { createContext, useContext } from 'react';
import { SchedulingRule } from './types';

interface StoreContextType {
  rules: SchedulingRule[];
  addRule: (rule: SchedulingRule) => void;
  updateRule: (id: string, updates: Partial<SchedulingRule>) => void;
  deleteRule: (id: string) => void;
  getRule: (id: string) => SchedulingRule | undefined;
}

export const StoreContext = createContext<StoreContextType>({
  rules: [],
  addRule: () => {},
  updateRule: () => {},
  deleteRule: () => {},
  getRule: () => undefined,
});

export function useStore() {
  return useContext(StoreContext);
}
