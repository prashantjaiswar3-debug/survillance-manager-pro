"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { Widget, ToDoItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function TodoListWidget({ widget }: { widget: Widget }) {
  const { updateWidget } = useDashboard();
  const items: ToDoItem[] = widget.content;
  const [newItemText, setNewItemText] = useState('');

  const updateItems = (newItems: ToDoItem[]) => {
    updateWidget(widget.id, { content: newItems });
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ToDoItem = { id: crypto.randomUUID(), text: newItemText, completed: false };
      updateItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const handleToggleItem = (itemId: string) => {
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateItems(newItems);
  };
  
  const handleRemoveItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    updateItems(newItems);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox
              id={`todo-${widget.id}-${item.id}`}
              checked={item.completed}
              onCheckedChange={() => handleToggleItem(item.id)}
            />
            <label
              htmlFor={`todo-${widget.id}-${item.id}`}
              className={`flex-1 text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {item.text}
            </label>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveItem(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-4">No tasks yet. Add one below!</p>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="New to-do..."
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddItem()}
        />
        <Button onClick={handleAddItem} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
