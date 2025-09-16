"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { Widget } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

export function NoteWidget({ widget }: { widget: Widget }) {
  const { updateWidget } = useDashboard();
  const [content, setContent] = useState(widget.content);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (content !== widget.content) {
          updateWidget(widget.id, { content });
      }
    }, 500); // Debounce updates

    return () => {
      clearTimeout(handler);
    };
  }, [content, widget.id, widget.content, updateWidget]);

  return (
    <Textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Type your note here..."
      className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
    />
  );
}
