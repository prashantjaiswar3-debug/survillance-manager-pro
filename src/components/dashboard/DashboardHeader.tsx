"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDashboard } from '@/contexts/DashboardContext';
import { AddWidgetDialog } from './AddWidgetDialog';
import { LayoutList, Plus, Save, Trash2 } from 'lucide-react';

export function DashboardHeader() {
  const { layouts, saveLayout, loadLayout, deleteLayout } = useDashboard();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');

  const handleSaveLayout = () => {
    saveLayout(newLayoutName);
    setNewLayoutName('');
    setSaveDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm">
      <h1 className="text-xl font-bold">CCTV Manager</h1>
      <div className="flex items-center gap-2">
        <AddWidgetDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </AddWidgetDialog>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current Layout</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter layout name"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLayout()}
              />
            </div>
            <Button onClick={handleSaveLayout}>Save</Button>
          </DialogContent>
        </Dialog>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <LayoutList className="mr-2 h-4 w-4" />
              Load Layout
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Saved Layouts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {layouts.length > 0 ? (
              layouts.map((layout) => (
                <DropdownMenuItem key={layout.id} className="flex justify-between items-center" onSelect={(e) => e.preventDefault()}>
                  <span onClick={() => loadLayout(layout.id)} className="flex-1 cursor-pointer">{layout.name}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteLayout(layout.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No layouts saved</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
