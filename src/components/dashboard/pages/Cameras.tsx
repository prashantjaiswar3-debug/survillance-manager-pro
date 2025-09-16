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

const cameras = [
  {
    name: 'CAM-001',
    status: 'Online',
    location: 'Lobby',
    ipAddress: '192.168.1.10',
  },
  {
    name: 'CAM-002',
    status: 'Online',
    location: 'Office',
    ipAddress: '192.168.1.11',
  },
  {
    name: 'CAM-003',
    status: 'Offline',
    location: 'Warehouse',
    ipAddress: '192.168.1.12',
  },
  {
    name: 'CAM-004',
    status: 'Online',
    location: 'Parking Lot',
    ipAddress: '192.168.1.13',
  },
  {
    name: 'CAM-005',
    status: 'Maintenance',
    location: 'Entrance',
    ipAddress: '192.168.1.14',
  },
  {
    name: 'CAM-006',
    status: 'Online',
    location: 'Rooftop',
    ipAddress: '192.168.1.15',
  },
];

export function CamerasPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wifi className="h-6 w-6" />
          <CardTitle>Cameras</CardTitle>
        </div>
        <CardDescription>
          A list of all camera devices on the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.map((camera) => (
              <TableRow key={camera.name}>
                <TableCell className="font-medium">{camera.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      camera.status === 'Online'
                        ? 'default'
                        : camera.status === 'Offline'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {camera.status}
                  </Badge>
                </TableCell>
                <TableCell>{camera.location}</TableCell>
                <TableCell>{camera.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
