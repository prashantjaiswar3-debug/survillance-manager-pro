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
import { MoreHorizontal, PlusCircle, Printer } from 'lucide-react';
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

type PoeSwitchStatus = 'Online' | 'Offline';
export type PoeSwitch = {
  id: string;
  name: string;
  status: PoeSwitchStatus;
  model: string;
  ports: number;
};

function PoeSwitchForm({
  poeSwitch,
  onSave,
}: {
  poeSwitch?: PoeSwitch;
  onSave: (poeSwitch: Omit<PoeSwitch, 'id'> & { id?: string }) => void;
}) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<PoeSwitchStatus>(poeSwitch?.status || 'Offline');

    const isEditMode = !!poeSwitch;
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const poeSwitchData = {
        id: poeSwitch?.id,
        name: formData.get('name') as string,
        model: formData.get('model') as string,
        ports: parseInt(formData.get('ports') as string, 10),
        status: status,
      };
      onSave(poeSwitchData);
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
                Add POE Switch
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit POE Switch' : 'Add POE Switch'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update the details for this POE Switch.' : 'Enter the details for the new POE Switch.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" defaultValue={poeSwitch?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" onValueChange={(value) => setStatus(value as PoeSwitchStatus)} defaultValue={status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input id="model" name="model" defaultValue={poeSwitch?.model} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ports" className="text-right">
                  Ports
                </Label>
                <Input id="ports" name="ports" type="number" defaultValue={poeSwitch?.ports} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save POE Switch</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  function StickerDialog({ device, open, onOpenChange }: { device: PoeSwitch | null, open: boolean, onOpenChange: (open: boolean) => void }) {
    const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
  
    useEffect(() => {
      if (device && open) {
        const generateStickerPdf = async () => {
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'in',
            format: [2, 4]
          });
  
          doc.setFontSize(16);
          doc.text(device.name, 0.2, 0.4);
          doc.setFontSize(10);
          doc.text(`ID: ${device.id}`, 0.2, 0.8);
          doc.text(`Model: ${device.model}`, 0.2, 1.0);
          doc.text(`Ports: ${device.ports}`, 0.2, 1.2);
  
          try {
            const qrCodeDataUrl = await QRCode.toDataURL(device.id, { errorCorrectionLevel: 'H' });
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

type POESwitchPageProps = {
    poeSwitches: PoeSwitch[];
    setPoeSwitches: React.Dispatch<React.SetStateAction<PoeSwitch[]>>;
};

export function POESwitchPage({ poeSwitches, setPoeSwitches }: POESwitchPageProps) {
    const [selectedSwitch, setSelectedSwitch] = useState<PoeSwitch | null>(null);
    const [isStickerOpen, setIsStickerOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const filteredPoeSwitches = poeSwitches.filter(sw => {
        if (statusFilter === 'All') return true;
        return sw.status === statusFilter;
    });

    const handleSavePoeSwitch = (poeSwitchData: Omit<PoeSwitch, 'id'> & { id?: string }) => {
        if (poeSwitchData.id) {
            setPoeSwitches(poeSwitches.map(s => s.id === poeSwitchData.id ? { ...s, ...poeSwitchData } as PoeSwitch : s));
        } else {
            const newPoeSwitch = { ...poeSwitchData, id: `SW-${Date.now()}` };
            setPoeSwitches((prev) => [...prev, newPoeSwitch as PoeSwitch]);
        }
    };

    const handleDeletePoeSwitch = (id: string) => {
        setPoeSwitches((prev) => prev.filter((sw) => sw.id !== id));
    };

    const handlePrintSticker = (sw: PoeSwitch) => {
      setSelectedSwitch(sw);
      setIsStickerOpen(true);
    };
  
    const handlePrintAllStickers = () => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const stickerWidth = 90;
      const stickerHeight = 50;
      const marginX = (210 - stickerWidth * 2) / 3;
      const marginY = (297 - stickerHeight * 5) / 6;
      const devicesPerPage = 10;
    
      poeSwitches.forEach((device, index) => {
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
    
        doc.text(`ID: ${device.id}`, x + 5, currentY);
        doc.text(`Model: ${device.model}`, x + 5, currentY + lineHeight);
        doc.text(`Ports: ${device.ports}`, x + 5, currentY + lineHeight * 2);
      });
    
      doc.output('dataurlnewwindow');
    };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>POE Switches</CardTitle>
              <CardDescription>
              Manage your Power Over Ethernet switches.
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
            <Button size="sm" className="h-8 gap-1" onClick={handlePrintAllStickers}>
                <Printer className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Print All Stickers
                </span>
            </Button>
            <PoeSwitchForm onSave={handleSavePoeSwitch} />
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
                  <TableHead>Model</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPoeSwitches.map((sw) => (
                  <TableRow key={sw.id}>
                    <TableCell className="font-medium">{sw.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            sw.status === 'Online'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {sw.status}
                        </Badge>
                         {sw.status === 'Online' && (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sw.model}</TableCell>
                    <TableCell>{sw.ports}</TableCell>
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
                            <PoeSwitchForm key={sw.id} poeSwitch={sw} onSave={handleSavePoeSwitch} />
                            <DropdownMenuItem onClick={() => handleDeletePoeSwitch(sw.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintSticker(sw)}>
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
      <StickerDialog device={selectedSwitch} open={isStickerOpen} onOpenChange={setIsStickerOpen} />
    </>
  );
}
