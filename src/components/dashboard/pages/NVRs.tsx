import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function NVRsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NVRs</CardTitle>
        <CardDescription>
          Manage your Network Video Recorders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the NVRs page.</p>
      </CardContent>
    </Card>
  );
}
