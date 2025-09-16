"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { WIDGET_TYPES } from '@/lib/widget-types';
import { useDashboard } from '@/contexts/DashboardContext';
import { Plus } from 'lucide-react';

export function AddWidgetDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { addWidget } = useDashboard();

  const filteredWidgets = useMemo(() => {
    return WIDGET_TYPES.filter(widget =>
      widget.name.toLowerCase().includes(search.toLowerCase()) ||
      widget.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleAddWidget = (type: (typeof WIDGET_TYPES)[0]['type']) => {
    addWidget(type);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new widget</DialogTitle>
          <DialogDescription>
            Search for a widget and add it to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredWidgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <div key={widget.type} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">{widget.name}</p>
                      <p className="text-sm text-muted-foreground">{widget.description}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddWidget(widget.type)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              );
            })}
             {filteredWidgets.length === 0 && (
                <p className="text-center text-muted-foreground">No widgets found.</p>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
