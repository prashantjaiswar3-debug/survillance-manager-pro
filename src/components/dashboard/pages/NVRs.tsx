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
import { MoreHorizontal, PlusCircle, Printer, Wifi } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NvrStatus = 'Online' | 'Offline';
export type NVR = {
  id: string;
  name: string;
  status: NvrStatus;
  storage: string;
  ipAddress: string;
  channels: number;
};

function NvrForm({
  nvr,
  onSave,
}: {
  nvr?: NVR;
  onSave: (nvr: Omit<NVR, 'id' | 'status'> & { id?: string }) => void;
}) {
    const [open, setOpen] = useState(false);

    const isEditMode = !!nvr;
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const nvrData = {
        id: nvr?.id,
        name: formData.get('name') as string,
        storage: formData.get('storage') as string,
        ipAddress: formData.get('ipAddress') as string,
        channels: parseInt(formData.get('channels') as string, 10),
      };
      onSave(nvrData);
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
                Add NVR
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit NVR' : 'Add NVR'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update the details for this NVR.' : 'Enter the details for the new NVR.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" defaultValue={nvr?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="storage" className="text-right">
                  Storage
                </Label>
                <Input id="storage" name="storage" defaultValue={nvr?.storage} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ipAddress" className="text-right">
                  IP Address
                </Label>
                <Input id="ipAddress" name="ipAddress" defaultValue={nvr?.ipAddress} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="channels" className="text-right">
                  Channels
                </Label>
                <Input id="channels" name="channels" type="number" defaultValue={nvr?.channels} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save NVR</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  function StickerDialog({ device, open, onOpenChange }: { device: NVR | null, open: boolean, onOpenChange: (open: boolean) => void }) {
    const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
  
    useEffect(() => {
      if (device && open) {
        const generateStickerPdf = async () => {
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'in',
            format: [2, 4] // Sticker size: 4 inches width, 2 inches height
          });
  
          doc.setFontSize(16);
          doc.text(device.name, 0.2, 0.4);
          doc.setFontSize(10);
          doc.text(`ID: ${device.id}`, 0.2, 0.8);
          doc.text(`IP: ${device.ipAddress}`, 0.2, 1.0);
          doc.text(`Storage: ${device.storage}`, 0.2, 1.2);
          doc.text(`Channels: ${device.channels}`, 0.2, 1.4);
  
          try {
            const qrCodeDataUrl = await QRCode.toDataURL(device.ipAddress, { errorCorrectionLevel: 'H' });
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
    }, [device, open]);
  
    if (!device) return null;
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Print Device Sticker</DialogTitle>
            <DialogDescription>
              Sticker for {device.name}. You can print this sticker from the PDF viewer.
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

type NVRsPageProps = {
    nvrs: NVR[];
    setNvrs: React.Dispatch<React.SetStateAction<NVR[]>>;
};

export function NVRsPage({ nvrs, setNvrs }: NVRsPageProps) {
    const [selectedNvr, setSelectedNvr] = useState<NVR | null>(null);
    const [isStickerOpen, setIsStickerOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isClient, setIsClient] = useState(false);
    const [pinging, setPinging] = useState<string[]>([]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePing = (id: string) => {
      setPinging(prev => [...prev, id]);
      setTimeout(() => {
        setNvrs(prevNvrs => 
          prevNvrs.map(nvr => 
            nvr.id === id 
              ? { ...nvr, status: Math.random() > 0.3 ? 'Online' : 'Offline' } 
              : nvr
          )
        );
        setPinging(prev => prev.filter(pingId => pingId !== id));
      }, 1000 + Math.random() * 1000);
    };

    const handlePingAll = () => {
      nvrs.forEach(nvr => handlePing(nvr.id));
    };

    const filteredNvrs = nvrs.filter(nvr => {
        if (statusFilter === 'All') return true;
        return nvr.status === statusFilter;
    });

    const handleSaveNvr = (nvrData: Omit<NVR, 'id' | 'status'> & { id?: string }) => {
        if (nvrData.id) {
            setNvrs(nvrs.map(n => n.id === nvrData.id ? { ...n, ...nvrData } as NVR : n));
        } else {
            const newNvr = { ...nvrData, id: `NVR-${Date.now()}`, status: 'Offline' as const };
            setNvrs((prevNvrs) => [...prevNvrs, newNvr]);
        }
    };

    const handleDeleteNvr = (id: string) => {
        setNvrs((prevNvrs) => prevNvrs.filter((nvr) => nvr.id !== id));
    };

    const handlePrintSticker = (nvr: NVR) => {
      setSelectedNvr(nvr);
      setIsStickerOpen(true);
    };
  
    const handlePrintAllStickers = () => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const stickerWidth = 90;
      const stickerHeight = 50;
      const marginX = (210 - stickerWidth * 2) / 3;
      const marginY = (297 - stickerHeight * 5) / 6;
      const devicesPerPage = 10;
    
      nvrs.forEach((device, index) => {
        const pageIndex = Math.floor(index / devicesPerPage);
        if (index % devicesPerPage === 0 && pageIndex > 0) {
          doc.addPage();
        }
        const deviceIndex = index % devicesPerPage;
        
        const x = marginX + (deviceIndex % 2) * (stickerWidth + marginX);
        const y = marginY + Math.floor(deviceIndex / 2) * (stickerHeight + marginY);
        
        doc.setDrawColor(150);
        doc.roundedRect(x, y, stickerWidth, stickerHeight, 3, 3, 'S');
    
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(device.name, x + 5, y + 8);
    
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const lineHeight = 6;
        let currentY = y + 18;
    
        // Left Column
        const leftColX = x + 5;
        doc.text(`ID: ${device.id}`, leftColX, currentY);
        doc.text(`IP: ${device.ipAddress}`, leftColX, currentY + lineHeight);
        
        // Right Column
        const rightColX = x + 45;
        doc.text(`Storage: ${device.storage}`, rightColX, currentY);
        doc.text(`Channels: ${device.channels}`, rightColX, currentY + lineHeight);
      });
    
      doc.output('dataurlnewwindow');
    };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>NVRs</CardTitle>
              <CardDescription>
              Manage your Network Video Recorders.
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
                </SelectContent>
              </Select>
            <Button size="sm" className="h-8 gap-1" onClick={handlePingAll}>
              <Wifi className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Ping All
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={handlePrintAllStickers}>
              <Printer className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Print All Stickers
              </span>
            </Button>
            <NvrForm onSave={handleSaveNvr} />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            {isClient && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNvrs.map((nvr) => (
                  <TableRow key={nvr.id}>
                    <TableCell className="font-medium">{nvr.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            nvr.status === 'Online'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {pinging.includes(nvr.id) ? 'Pinging...' : nvr.status}
                        </Badge>
                         {nvr.status === 'Online' && !pinging.includes(nvr.id) && (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{nvr.storage}</TableCell>
                    <TableCell>{nvr.ipAddress}</TableCell>
                    <TableCell>{nvr.channels}</TableCell>
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
                             <DropdownMenuItem onClick={() => handlePing(nvr.id)}>
                                <Wifi className="mr-2 h-4 w-4" />
                                <span>Ping</span>
                              </DropdownMenuItem>
                            <NvrForm key={nvr.id} nvr={nvr} onSave={handleSaveNvr} />
                            <DropdownMenuItem onClick={() => handleDeleteNvr(nvr.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintSticker(nvr)}>
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
      <StickerDialog device={selectedNvr} open={isStickerOpen} onOpenChange={setIsStickerOpen} />
    </>
  );
}
