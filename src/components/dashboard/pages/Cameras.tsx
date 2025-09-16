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

const initialCameras = [
  {
    id: 'CAM-001',
    name: 'CAM-001',
    status: 'Online',
    location: 'Lobby',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'CAM-002',
    name: 'CAM-002',
    status: 'Online',
    location: 'Office',
    ipAddress: '192.168.1.11',
  },
  {
    id: 'CAM-003',
    name: 'CAM-003',
    status: 'Offline',
    location: 'Warehouse',
    ipAddress: '192.168.1.12',
  },
  {
    id: 'CAM-004',
    name: 'CAM-004',
    status: 'Online',
    location: 'Parking Lot',
    ipAddress: '192.168.1.13',
  },
  {
    id: 'CAM-005',
    name: 'CAM-005',
    status: 'Maintenance',
    location: 'Entrance',
    ipAddress: '192.168.1.14',
  },
  {
    id: 'CAM-006',
    name: 'CAM-006',
    status: 'Online',
    location: 'Rooftop',
    ipAddress: '192.168.1.15',
  },
];

type Camera = (typeof initialCameras)[number];

function AddCameraForm({ onAdd }: { onAdd: (camera: Omit<Camera, 'id'>) => void }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCamera = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      ipAddress: formData.get('ipAddress') as string,
      status: 'Offline', // Default status
    };
    onAdd(newCamera);
    setOpen(false);
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
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Camera</DialogTitle>
            <DialogDescription>
              Enter the details for the new camera.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" name="location" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipAddress" className="text-right">
                IP Address
              </Label>
              <Input id="ipAddress" name="ipAddress" className="col-span-3" required />
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
              <TableHead>IP Address</TableHead>
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
                <TableCell>{camera.ipAddress}</TableCell>
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
