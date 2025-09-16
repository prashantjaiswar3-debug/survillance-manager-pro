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

const initialNvrs = [
  {
    id: 'NVR-001',
    name: 'NVR-001',
    status: 'Online',
    storage: '8 TB',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'NVR-002',
    name: 'NVR-002',
    status: 'Offline',
    storage: '16 TB',
    ipAddress: '192.168.1.101',
  },
];

type NVR = (typeof initialNvrs)[number];

function AddNvrForm({ onAdd }: { onAdd: (nvr: Omit<NVR, 'id' | 'status'>) => void }) {
    const [open, setOpen] = useState(false);
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newNvr = {
        name: formData.get('name') as string,
        storage: formData.get('storage') as string,
        ipAddress: formData.get('ipAddress') as string,
      };
      onAdd(newNvr);
      setOpen(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add NVR
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add NVR</DialogTitle>
              <DialogDescription>
                Enter the details for the new NVR.
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
                <Label htmlFor="storage" className="text-right">
                  Storage
                </Label>
                <Input id="storage" name="storage" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ipAddress" className="text-right">
                  IP Address
                </Label>
                <Input id="ipAddress" name="ipAddress" className="col-span-3" required />
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

export function NVRsPage() {
    const [nvrs, setNvrs] = useState(initialNvrs);

    const handleAddNvr = (newNvr: Omit<NVR, 'id' | 'status'>) => {
        const nvrWithId = { ...newNvr, id: `NVR-${Date.now()}`, status: 'Offline' };
        setNvrs((prevNvrs) => [...prevNvrs, nvrWithId]);
    };

    const handleDeleteNvr = (id: string) => {
        setNvrs((prevNvrs) => prevNvrs.filter((nvr) => nvr.id !== id));
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>NVRs</CardTitle>
            <CardDescription>
            Manage your Network Video Recorders.
            </CardDescription>
        </div>
        <AddNvrForm onAdd={handleAddNvr} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nvrs.map((nvr) => (
              <TableRow key={nvr.id}>
                <TableCell className="font-medium">{nvr.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
                     {nvr.status === 'Online' && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{nvr.storage}</TableCell>
                <TableCell>{nvr.ipAddress}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDeleteNvr(nvr.id)}>Delete</DropdownMenuItem>
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
