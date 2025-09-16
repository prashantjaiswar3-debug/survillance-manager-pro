import { ListTodo, StickyNote, Link as LinkIcon } from 'lucide-react';
import { WidgetType } from './types';

export const WIDGET_TYPES: {
  type: WidgetType;
  name: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    type: 'note',
    name: 'Note',
    description: 'A simple text note.',
    icon: StickyNote,
  },
  {
    type: 'todo',
    name: 'To-do List',
    description: 'Track your tasks.',
    icon: ListTodo,
  },
  {
    type: 'link',
    name: 'Quick Links',
    description: 'A collection of useful links.',
    icon: LinkIcon,
  },
];
