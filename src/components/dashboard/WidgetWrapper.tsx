"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Widget } from '@/lib/types';
import { Input } from '../ui/input';
import { useState } from 'react';

export function WidgetWrapper({ widget, children }: { widget: Widget; children: React.ReactNode }) {
  const { removeWidget, updateWidget } = useDashboard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(widget.title);

  const handleTitleBlur = () => {
    updateWidget(widget.id, { title });
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-lg hover:shadow-accent/20">
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0 border-b">
        <div className="flex items-center gap-2 flex-1 min-w-0">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className="h-8"
              />
            ) : (
              <CardTitle
                className="text-base font-semibold cursor-pointer truncate"
                onClick={() => setIsEditingTitle(true)}
              >
                {widget.title}
              </CardTitle>
            )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeWidget(widget.id)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
