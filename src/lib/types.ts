export type WidgetType = 'note' | 'todo' | 'link' | 'cctv';

export type Widget = {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  content: any; // This will vary based on widget type
};

export type ToDoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type LinkItem = {
  id: string;
  url: string;
  label: string;
};

export type Layout = {
  id: string;
  name: string;
  widgets: Widget[];
};