import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TodoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todo</CardTitle>
        <CardDescription>
          Keep track of your tasks and reminders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the Todo page.</p>
      </CardContent>
    </Card>
  );
}
