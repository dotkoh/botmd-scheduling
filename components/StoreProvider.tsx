'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { StoreContext } from '@/lib/store';
import { SchedulingRule } from '@/lib/types';
import { MOCK_RULES } from '@/lib/mock-data';

const STORAGE_KEY = 'scheduling-agent-rules';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<SchedulingRule[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRules(JSON.parse(stored));
      } catch {
        setRules(MOCK_RULES);
      }
    } else {
      setRules(MOCK_RULES);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    }
  }, [rules, loaded]);

  const addRule = useCallback((rule: SchedulingRule) => {
    setRules(prev => [...prev, rule]);
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<SchedulingRule>) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const getRule = useCallback(
    (id: string) => rules.find(r => r.id === id),
    [rules]
  );

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={{ rules, addRule, updateRule, deleteRule, getRule }}>
      {children}
    </StoreContext.Provider>
  );
}
