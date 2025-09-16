"use client";

import { useState, useEffect } from 'react';
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
import { MoreHorizontal, PlusCircle, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

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

type CameraStatus = 'Online' | 'Offline' | 'Maintenance';
type Camera = (typeof initialCameras)[number] & { status: CameraStatus };

const zones = ['Zone 1', 'Zone 2', 'Outdoor', 'Unassigned'];
const nvrs = ['NVR-001', 'NVR-002'];

function CameraForm({
  camera,
  onSave,
}: {
  camera?: Camera;
  onSave: (camera: Omit<Camera, 'id' | 'status'> & { id?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState(camera?.zone || 'Unassigned');
  const [nvr, setNvr] = useState(camera?.nvr || '');

  const isEditMode = !!camera;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCameraData = {
      id: camera?.id,
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      ipAddress: formData.get('ipAddress') as string,
      zone: zone,
      nvr: nvr,
      channel: parseInt(formData.get('channel') as string, 10),
      poeSwitch: formData.get('poeSwitch') as string,
      port: parseInt(formData.get('port') as string, 10),
    };
    onSave(newCameraData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
        ) : (
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Camera
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Camera' : 'Add Camera'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the details for this camera.'
                : 'Enter the details for the new camera.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="name" className="text-right col-span-1">
                Name
              </Label>
              <Input id="name" name="name" defaultValue={camera?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="location" className="text-right col-span-1">
                Location
              </Label>
              <Input id="location" name="location" defaultValue={camera?.location} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="ipAddress" className="text-right col-span-1">
                IP Address
              </Label>
              <Input id="ipAddress" name="ipAddress" defaultValue={camera?.ipAddress} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4 col-span-2">
              <Label htmlFor="zone" className="text-right col-span-1">
                Zone
              </Label>
              <Select name="zone" onValueChange={setZone} defaultValue={zone}>
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
                 <Select name="nvr" onValueChange={setNvr} defaultValue={nvr}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an NVR" />
                    </SelectTrigger>
                    <SelectContent>
                      {nvrs.map((nvrItem) => (
                        <SelectItem key={nvrItem} value={nvrItem}>
                          {nvrItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="channel" className="text-right">
                  Channel
                </Label>
                <Input id="channel" name="channel" type="number" defaultValue={camera?.channel} required />
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="poeSwitch" className="text-right">
                  POE Switch
                </Label>
                <Input id="poeSwitch" name="poeSwitch" defaultValue={camera?.poeSwitch} required />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                <Input id="port" name="port" type="number" defaultValue={camera?.port} required />
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
  const [cameras, setCameras] = useState<Camera[]>(initialCameras as Camera[]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prevCameras => {
        if (prevCameras.length === 0) return prevCameras;
        const randomIndex = Math.floor(Math.random() * prevCameras.length);
        return prevCameras.map((camera, index) => {
          if (index === randomIndex) {
            const newStatus = camera.status === 'Online' ? 'Offline' : 'Online';
            return { ...camera, status: newStatus as CameraStatus };
          }
          return camera;
        });
      });
    }, 5000); // Toggles a random camera's status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSaveCamera = (cameraData: Omit<Camera, 'id' | 'status'> & { id?: string }) => {
    if (cameraData.id) {
      // Edit
      setCameras(cameras.map(c => c.id === cameraData.id ? { ...c, ...cameraData } as Camera : c));
    } else {
      // Add
      const newCamera = { ...cameraData, id: `CAM-${Date.now()}`, status: 'Offline' as const };
      setCameras(prevCameras => [...prevCameras, newCamera]);
    }
  };

  const handleDeleteCamera = (id: string) => {
    setCameras((prevCameras) => prevCameras.filter((camera) => camera.id !== id));
  }

  const handleViewCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsViewOpen(true);
  }

  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Status', 'Location', 'Zone', 'IP Address', 'NVR/Channel', 'POE/Port']],
      body: cameras.map(camera => [
        camera.name,
        camera.status,
        camera.location,
        camera.zone,
        camera.ipAddress,
        `${camera.nvr} / ${camera.channel}`,
        `${camera.poeSwitch} / ${camera.port}`
      ]),
    });
    doc.output('dataurlnewwindow');
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cameras</CardTitle>
            <CardDescription>
              A list of all camera devices on the network.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={handleDownloadPdf}>
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                View PDF
              </span>
            </Button>
            <CameraForm onSave={handleSaveCamera} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>NVR / Channel</TableHead>
                <TableHead>POE Switch / Port</TableHead>
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
                  <TableCell>{camera.nvr} / {camera.channel}</TableCell>
                  <TableCell>{camera.poeSwitch} / {camera.port}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewCamera(camera)}>View</DropdownMenuItem>
                        <CameraForm key={camera.id} camera={camera} onSave={handleSaveCamera} />
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-4xl">
          {selectedCamera && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCamera.name}</DialogTitle>
                <DialogDescription>
                  {selectedCamera.location} - {selectedCamera.ipAddress}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className='relative aspect-video'>
                    <Image src={`https://picsum.photos/seed/${selectedCamera.id}/640/480`} alt={selectedCamera.name} fill objectFit="cover" className="rounded-md" data-ai-hint="security camera" />
                  </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {selectedCamera.status}</p>
                  <p><strong>Zone:</strong> {selectedCamera.zone}</p>
                  <p><strong>NVR/Channel:</strong> {selectedCamera.nvr} / {selectedCamera.channel}</p>
                  <p><strong>POE Switch/Port:</strong> {selectedCamera.poeSwitch} / {selectedCamera.port}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
