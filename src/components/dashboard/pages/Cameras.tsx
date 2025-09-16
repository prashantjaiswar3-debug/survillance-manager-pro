"use client";

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialCameras = [
  {
    id: 'CAM-001',
    name: 'CAM-001',
    status: 'Online',
    location: 'Lobby',
    ipAddress: '192.168.1.10',
    zone: 'Zone 1',
    nvr: 'NVR-001',
    channel: 1,
    poeSwitch: 'SW-001',
    port: 1,
  },
  {
    id: 'CAM-002',
    name: 'CAM-002',
    status: 'Online',
    location: 'Office',
    ipAddress: '192.168.1.11',
    zone: 'Zone 1',
    nvr: 'NVR-001',
    channel: 2,
    poeSwitch: 'SW-001',
    port: 2,
  },
  {
    id: 'CAM-003',
    name: 'CAM-003',
    status: 'Offline',
    location: 'Warehouse',
    ipAddress: '192.168.1.12',
    zone: 'Zone 2',
    nvr: 'NVR-001',
    channel: 3,
    poeSwitch: 'SW-001',
    port: 3,
  },
  {
    id: 'CAM-004',
    name: 'CAM-004',
    status: 'Online',
    location: 'Parking Lot',
    ipAddress: '192.168.1.13',
    zone: 'Outdoor',
    nvr: 'NVR-002',
    channel: 1,
    poeSwitch: 'SW-002',
    port: 1,
  },
  {
    id: 'CAM-005',
    name: 'CAM-005',
    status: 'Maintenance',
    location: 'Entrance',
    ipAddress: '192.168.1.14',
    zone: 'Zone 1',
    nvr: 'NVR-002',
    channel: 2,
    poeSwitch: 'SW-002',
    port: 2,
  },
  {
    id: 'CAM-006',
    name: 'CAM-006',
    status: 'Online',
    location: 'Rooftop',
    ipAddress: '192.168.1.15',
    zone: 'Outdoor',
    nvr: 'NVR-002',
    channel: 3,
    poeSwitch: 'SW-002',
    port: 3,
  },
];

type Camera = (typeof initialCameras)[number];

const zones = ['Zone 1', 'Zone 2', 'Outdoor', 'Unassigned'];

function AddCameraForm({ onAdd }: { onAdd: (camera: Omit<Camera, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState('Unassigned');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCamera = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      ipAddress: formData.get('ipAddress') as string,
      status: 'Offline', // Default status
      zone: zone,
      nvr: formData.get('nvr') as string,
      channel: parseInt(formData.get('channel') as string, 10),
      poeSwitch: formData.get('poeSwitch') as string,
      port: parseInt(formData.get('port') as string, 10),
    };
    onAdd(newCamera);
    setOpen(false);
    event.currentTarget.reset();
    setZone('Unassigned');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Camera
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Camera</DialogTitle>
            <DialogDescription>
              Enter the details for the new camera.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="name" className="text-right col-span-1">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="location" className="text-right col-span-1">
                Location
              </Label>
              <Input id="location" name="location" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="ipAddress" className="text-right col-span-1">
                IP Address
              </Label>
              <Input id="ipAddress" name="ipAddress" className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="zone" className="text-right col-span-1">
                Zone
              </Label>
              <Select name="zone" onValueChange={setZone} value={zone}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="nvr" className="text-right">
                  NVR
                </Label>
                <Input id="nvr" name="nvr" required />
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="channel" className="text-right">
                  Channel
                </Label>
                <Input id="channel" name="channel" type="number" required />
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="poeSwitch" className="text-right">
                  POE Switch
                </Label>
                <Input id="poeSwitch" name="poeSwitch" required />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                <Input id="port" name="port" type="number" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save camera</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function CamerasPage() {
  const [cameras, setCameras] = useState(initialCameras);

  const handleAddCamera = (newCamera: Omit<Camera, 'id'>) => {
    const cameraWithId = { ...newCamera, id: `CAM-${Date.now()}` };
    setCameras((prevCameras) => [...prevCameras, cameraWithId]);
  };

  const handleDeleteCamera = (id: string) => {
    setCameras((prevCameras) => prevCameras.filter((camera) => camera.id !== id));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Cameras</CardTitle>
          <CardDescription>
            A list of all camera devices on the network.
          </CardDescription>
        </div>
        <AddCameraForm onAdd={handleAddCamera} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>NVR</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>POE Switch</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.map((camera) => (
              <TableRow key={camera.id}>
                <TableCell className="font-medium">{camera.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
                    {camera.status === 'Online' && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{camera.location}</TableCell>
                <TableCell>{camera.zone}</TableCell>
                <TableCell>{camera.ipAddress}</TableCell>
                <TableCell>{camera.nvr}</TableCell>
                <TableCell>{camera.channel}</TableCell>
                <TableCell>{camera.poeSwitch}</TableCell>
                <TableCell>{camera.port}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCamera(camera.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
