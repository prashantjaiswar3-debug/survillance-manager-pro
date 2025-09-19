"use client";

import { useState, useEffect, useRef } from 'react';
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
  DropdownMenuSeparator,
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
import { MoreHorizontal, PlusCircle, Download, Printer, Camera as CameraIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import type { NVR } from './NVRs';
import type { PoeSwitch } from './POESwitch';

type CameraStatus = 'Online' | 'Offline' | 'Checking...';
export type Camera = {
  id: string;
  name: string;
  status: CameraStatus;
  location: string;
  ipAddress: string;
  zone: string;
  nvr: string;
  channel: number;
  poeSwitch: string;
  port: number;
};

const zones = ['Zone 1', 'Zone 2', 'Outdoor', 'Unassigned'];

function CameraForm({
  camera,
  onSave,
  allCameras,
  nvrs,
  poeSwitches
}: {
  camera?: Camera;
  onSave: (camera: Omit<Camera, 'id' | 'status'> & { id?: string; status: CameraStatus }) => void;
  allCameras: Camera[];
  nvrs: NVR[];
  poeSwitches: PoeSwitch[];
}) {
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState(camera?.zone || 'Unassigned');
  const [nvr, setNvr] = useState(camera?.nvr || '');
  const [poeSwitch, setPoeSwitch] = useState(camera?.poeSwitch || '');
  const [channel, setChannel] = useState(camera?.channel?.toString() || '');
  const [port, setPort] = useState(camera?.port?.toString() || '');

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
      channel: parseInt(channel, 10),
      poeSwitch: poeSwitch,
      port: parseInt(port, 10),
      status: 'Offline' as CameraStatus,
    };
    onSave(newCameraData);
    setOpen(false);
  };

  const selectedNvr = nvrs.find(n => n.id === nvr);
  const selectedPoeSwitch = poeSwitches.find(p => p.id === poeSwitch);

  const usedChannels = allCameras
    .filter(c => c.nvr === nvr && c.id !== camera?.id)
    .map(c => c.channel);

  const usedPorts = allCameras
    .filter(c => c.poeSwitch === poeSwitch && c.id !== camera?.id)
    .map(c => c.port);

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
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zone" className="text-right">
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
                        <SelectItem key={nvrItem.id} value={nvrItem.id}>
                          {nvrItem.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="channel" className="text-right">
                  Channel
                </Label>
                <Select name="channel" onValueChange={setChannel} defaultValue={channel} disabled={!selectedNvr}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedNvr && Array.from({ length: selectedNvr.channels }, (_, i) => i + 1).map(ch => (
                        <SelectItem key={ch} value={ch.toString()} disabled={usedChannels.includes(ch)}>
                          {ch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
             <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="poeSwitch" className="text-right">
                  POE Switch
                </Label>
                <Select name="poeSwitch" onValueChange={setPoeSwitch} defaultValue={poeSwitch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a POE Switch" />
                    </SelectTrigger>
                    <SelectContent>
                      {poeSwitches.map((poeSwitchItem) => (
                        <SelectItem key={poeSwitchItem.id} value={poeSwitchItem.id}>
                          {poeSwitchItem.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                 <Select name="port" onValueChange={setPort} defaultValue={port} disabled={!selectedPoeSwitch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a port" />
                    </SelectTrigger>
                    <SelectContent>
                       {selectedPoeSwitch && Array.from({ length: selectedPoeSwitch.ports }, (_, i) => i + 1).map(p => (
                        <SelectItem key={p} value={p.toString()} disabled={usedPorts.includes(p)}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

function StickerDialog({ camera, open, onOpenChange }: { camera: Camera | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const pdfPreviewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (camera && open) {
      const generateStickerPdf = async () => {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [2, 4] // Sticker size: 4 inches width, 2 inches height
        });

        doc.setFontSize(16);
        doc.text(camera.name, 0.2, 0.4);
        doc.setFontSize(10);
        doc.text(`ID: ${camera.id}`, 0.2, 0.8);
        doc.text(`IP: ${camera.ipAddress}`, 0.2, 1.0);
        doc.text(`Location: ${camera.location}`, 0.2, 1.2);
        doc.text(`Zone: ${camera.zone}`, 0.2, 1.4);

        try {
          const qrCodeDataUrl = await QRCode.toDataURL(camera.ipAddress, { errorCorrectionLevel: 'H' });
          doc.addImage(qrCodeDataUrl, 'PNG', 2.5, 0.2, 1.3, 1.3);
        } catch (err) {
          console.error(err);
        }

        if (pdfPreviewRef.current) {
          pdfPreviewRef.current.src = doc.output('datauristring');
        }
      };
      generateStickerPdf();
    }
  }, [camera, open]);

  if (!camera) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Print Device Sticker</DialogTitle>
          <DialogDescription>
            Sticker for {camera.name}. You can print this sticker from the PDF viewer.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full aspect-[4/2] mt-4">
          <iframe ref={pdfPreviewRef} className="w-full h-full" title="Sticker Preview" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type CamerasPageProps = {
  cameras: Camera[];
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
  nvrs: NVR[];
  poeSwitches: PoeSwitch[];
};

export function CamerasPage({ cameras, setCameras, nvrs, poeSwitches }: CamerasPageProps) {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateAllStatuses = async () => {
      setCameras(prevCameras => prevCameras.map(c => ({...c, status: 'Checking...'})));
      const promises = cameras.map(async (camera) => {
        try {
          const response = await fetch(`/api/ping?ip=${camera.ipAddress}`);
          if (!response.ok) {
            return { id: camera.id, status: 'Offline' as CameraStatus };
          }
          const data = await response.json();
          return { id: camera.id, status: data.status as CameraStatus };
        } catch (error) {
          return { id: camera.id, status: 'Offline' as CameraStatus };
        }
      });

      const results = await Promise.all(promises);
      setCameras(prevCameras =>
        prevCameras.map(cam => {
          const update = results.find(r => r.id === cam.id);
          return update ? { ...cam, status: update.status } : cam;
        })
      );
    };
    
    updateAllStatuses();
    const interval = setInterval(updateAllStatuses, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isClient, cameras.length]);


  const filteredCameras = cameras.filter(camera => {
    if (statusFilter === 'All') return true;
    return camera.status === statusFilter;
  });

  const handleSaveCamera = (cameraData: Omit<Camera, 'id'> & { id?: string }) => {
    if (cameraData.id) {
      // Edit
      setCameras(cameras.map(c => c.id === cameraData.id ? { ...c, ...cameraData } as Camera : c));
    } else {
      // Add
      const newCamera = { ...cameraData, id: `CAM-${Date.now()}` };
      setCameras(prevCameras => [...prevCameras, newCamera as Camera]);
    }
  };

  const handleDeleteCamera = (id: string) => {
    setCameras((prevCameras) => prevCameras.filter((camera) => camera.id !== id));
  }

  const handleViewCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsViewOpen(true);
  }

  const handlePrintSticker = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsStickerOpen(true);
  }

  const handleDownloadPdf = async () => {
    const doc = new jsPDF();
    (doc as any).autoTable({
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

  const handlePrintAllStickers = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const stickerWidth = 90;
    const stickerHeight = 50;
    const marginX = (210 - stickerWidth * 2) / 3;
    const marginY = (297 - stickerHeight * 5) / 6;
    const camerasPerPage = 10;
  
    cameras.forEach((camera, index) => {
      const pageIndex = Math.floor(index / camerasPerPage);
      if (index % camerasPerPage === 0 && pageIndex > 0) {
        doc.addPage();
      }
      const cameraIndex = index % camerasPerPage;
      
      const x = marginX + (cameraIndex % 2) * (stickerWidth + marginX);
      const y = marginY + Math.floor(cameraIndex / 2) * (stickerHeight + marginY);
      
      doc.setDrawColor(150);
      doc.roundedRect(x, y, stickerWidth, stickerHeight, 3, 3, 'S');
  
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(camera.name, x + 5, y + 8);
  
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const lineHeight = 6;
      let currentY = y + 18;
  
      // Left Column
      const leftColX = x + 5;
      doc.text(`ID: ${camera.id}`, leftColX, currentY);
      doc.text(`IP: ${camera.ipAddress}`, leftColX, currentY + lineHeight);
      doc.text(`Location: ${camera.location}`, leftColX, currentY + lineHeight * 2);
      
      // Right Column
      const rightColX = x + 45;
      doc.text(`Zone: ${camera.zone}`, rightColX, currentY);
      doc.text(`NVR: ${camera.nvr} / Ch: ${camera.channel}`, rightColX, currentY + lineHeight);
      doc.text(`Switch: ${camera.poeSwitch} / Port: ${camera.port}`, rightColX, currentY + lineHeight * 2);
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
              A list of all camera devices on the network. Statuses auto-refresh.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Checking...">Checking...</SelectItem>
                </SelectContent>
              </Select>
            <Button size="sm" className="h-8 gap-1" onClick={handleDownloadPdf}>
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                View PDF
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={handlePrintAllStickers}>
              <Printer className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Print All Stickers
              </span>
            </Button>
            <CameraForm onSave={handleSaveCamera} allCameras={cameras} nvrs={nvrs} poeSwitches={poeSwitches} />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            {isClient && (
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
                {filteredCameras.map((camera) => (
                  <TableRow key={camera.id}>
                    <TableCell className="font-medium">{camera.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            camera.status === 'Online' ? 'default'
                            : camera.status === 'Offline' ? 'destructive'
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
                         {camera.status === 'Checking...' && (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
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
                          <CameraForm key={`${camera.id}-edit`} camera={camera} onSave={handleSaveCamera} allCameras={cameras} nvrs={nvrs} poeSwitches={poeSwitches} />
                          <DropdownMenuItem onClick={() => handleDeleteCamera(camera.id)}>Delete</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePrintSticker(camera)}>
                            <Printer className="mr-2 h-4 w-4" />
                            <span>Print Sticker</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </ScrollArea>
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
                  <div className='relative aspect-video bg-muted rounded-md flex items-center justify-center'>
                    <CameraIcon className="w-16 h-16 text-muted-foreground" />
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
      <StickerDialog camera={selectedCamera} open={isStickerOpen} onOpenChange={setIsStickerOpen} />
    </>
  );
}
