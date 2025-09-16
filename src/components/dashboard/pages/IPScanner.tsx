import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function IPScannerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Scanner</CardTitle>
        <CardDescription>
          Scan your network for connected devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the IP Scanner page.</p>
      </CardContent>
    </Card>
  );
}
