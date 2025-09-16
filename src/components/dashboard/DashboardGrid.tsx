"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { WidgetWrapper } from './WidgetWrapper';
import { NoteWidget } from '../widgets/NoteWidget';
import { TodoListWidget } from '../widgets/TodoListWidget';
import { QuickLinkWidget } from '../widgets/QuickLinkWidget';
import { CCTVWidget } from '../widgets/CCTVWidget';

export function DashboardGrid() {
  const { widgets } = useDashboard();

  if (widgets.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <h2 className="text-2xl font-semibold">Your Dashboard is Empty</h2>
            <p className="mt-2">Click "Add Widget" to get started.</p>
        </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
      style={{ gridAutoRows: 'minmax(160px, auto)' }}
    >
      {widgets.map((widget) => {
        const style = {
            gridColumn: `span ${Math.min(widget.w, 12)}`,
            gridRow: `span ${widget.h}`,
        };
        return (
          <div key={widget.id} style={style} className="animate-in fade-in zoom-in-95 duration-300 min-h-[160px]">
            <WidgetWrapper widget={widget}>
              {widget.type === 'note' && <NoteWidget widget={widget} />}
              {widget.type === 'todo' && <TodoListWidget widget={widget} />}
              {widget.type === 'link' && <QuickLinkWidget widget={widget} />}
              {widget.type === 'cctv' && <CCTVWidget widget={widget} />}
            </WidgetWrapper>
          </div>
        );
      })}
    </div>
  );
}