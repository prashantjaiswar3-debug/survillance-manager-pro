import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wifi } from 'lucide-react';

const nvrs = [
  {
    name: 'NVR-001',
    status: 'Online',
    storage: '8 TB',
    ipAddress: '192.168.1.100',
  },
  {
    name: 'NVR-002',
    status: 'Offline',
    storage: '16 TB',
    ipAddress: '192.168.1.101',
  },
];

export function NVRsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wifi className="h-6 w-6" />
          <CardTitle>NVRs</CardTitle>
        </div>
        <CardDescription>
          Manage your Network Video Recorders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nvrs.map((nvr) => (
              <TableRow key={nvr.name}>
                <TableCell className="font-medium">{nvr.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      nvr.status === 'Online'
                        ? 'default'
                        : nvr.status === 'Offline'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {nvr.status}
                  </Badge>
                </TableCell>
                <TableCell>{nvr.storage}</TableCell>
                <TableCell>{nvr.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
