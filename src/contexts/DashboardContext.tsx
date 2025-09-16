"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Widget, Layout, WidgetType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DashboardContextType {
  widgets: Widget[];
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  addWidget: (type: Widget['type']) => void;
  updateWidget: (id: string, newConfig: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  layouts: Layout[];
  saveLayout: (name: string) => void;
  loadLayout: (id: string) => void;
  deleteLayout: (id: string) => void;
  isLoaded: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const getDefaultWidget = (type: WidgetType): Omit<Widget, 'id'| 'x' | 'y'> => {
    switch (type) {
        case 'note':
            return { type, w: 4, h: 2, title: 'New Note', content: '' };
        case 'todo':
            return { type, w: 4, h: 3, title: 'To-do List', content: [] };
        case 'link':
            return { type, w: 3, h: 2, title: 'Quick Links', content: [] };
        case 'cctv':
            return { type, w: 6, h: 4, title: 'CCTV Camera', content: { cameraName: 'Lobby' } };
        default:
            throw new Error('Unknown widget type');
    }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem('cctv-dashboard-widgets');
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
      const savedLayouts = localStorage.getItem('cctv-dashboard-layouts');
      if (savedLayouts) {
        setLayouts(JSON.parse(savedLayouts));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      toast({ title: 'Error', description: 'Could not load saved dashboard state.', variant: 'destructive' });
    }
    setIsLoaded(true);
  }, [toast]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cctv-dashboard-widgets', JSON.stringify(widgets));
      } catch (error) {
        console.error("Failed to save widgets to localStorage", error);
      }
    }
  }, [widgets, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cctv-dashboard-layouts', JSON.stringify(layouts));
      } catch (error) {
        console.error("Failed to save layouts to localStorage", error);
      }
    }
  }, [layouts, isLoaded]);

  const addWidget = useCallback((type: Widget['type']) => {
    setWidgets(prev => {
        const newWidgetConfig = getDefaultWidget(type);
        const newId = crypto.randomUUID();
        
        // Simple placement logic: find the next available spot
        // In a real grid, this would be more complex. For now, we add and let CSS grid flow.
        const newWidget: Widget = { ...newWidgetConfig, id: newId, x: 0, y: 0 };
        return [...prev, newWidget];
    });
  }, []);

  const updateWidget = useCallback((id: string, newConfig: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...newConfig } : w));
  }, []);

  const removeWidget = useCallback((id:string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const saveLayout = useCallback((name: string) => {
    if (!name.trim()) {
        toast({ title: 'Error', description: 'Layout name cannot be empty.', variant: 'destructive' });
        return;
    }
    const newLayout: Layout = { id: crypto.randomUUID(), name, widgets: [...widgets] };
    setLayouts(prev => [...prev, newLayout]);
    toast({ title: 'Success', description: `Layout "${name}" saved.` });
  }, [widgets, toast]);

  const loadLayout = useCallback((id: string) => {
    const layoutToLoad = layouts.find(l => l.id === id);
    if (layoutToLoad) {
        setWidgets(layoutToLoad.widgets);
        toast({ title: 'Success', description: `Layout "${layoutToLoad.name}" loaded.` });
    } else {
        toast({ title: 'Error', description: 'Layout not found.', variant: 'destructive' });
    }
  }, [layouts, toast]);

  const deleteLayout = useCallback((id: string) => {
    setLayouts(prev => prev.filter(l => l.id !== id));
    toast({ title: 'Success', description: 'Layout deleted.' });
  }, [toast]);

  const value = {
    widgets,
    setWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    layouts,
    saveLayout,
    loadLayout,
    deleteLayout,
    isLoaded,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};