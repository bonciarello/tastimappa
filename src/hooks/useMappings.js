import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tastimappa-mappings';

function loadMappings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        m.id &&
        Array.isArray(m.modifiers) &&
        typeof m.mainKey === 'string' &&
        typeof m.command === 'string'
    );
  } catch {
    return [];
  }
}

function saveMappings(mappings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  } catch {
    /* localStorage non disponibile o pieno */
  }
}

export function useMappings() {
  const [mappings, setMappings] = useState(loadMappings);

  useEffect(() => {
    saveMappings(mappings);
  }, [mappings]);

  const addMapping = useCallback(({ modifiers, mainKey, command }) => {
    const mapping = {
      id: crypto.randomUUID(),
      modifiers,
      mainKey,
      command,
      createdAt: Date.now(),
    };
    setMappings((prev) => [...prev, mapping]);
    return mapping;
  }, []);

  const updateMapping = useCallback((id, updates) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deleteMapping = useCallback((id) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const reorderMappings = useCallback((fromIndex, toIndex) => {
    setMappings((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length ||
        fromIndex === toIndex
      ) {
        return prev;
      }
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setMappings([]);
  }, []);

  return {
    mappings,
    addMapping,
    updateMapping,
    deleteMapping,
    reorderMappings,
    clearAll,
  };
}
