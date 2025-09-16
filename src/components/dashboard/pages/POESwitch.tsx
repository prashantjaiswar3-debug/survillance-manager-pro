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
import { MoreHorizontal, PlusCircle } from 'lucide-react';

const initialPoeSwitches = [
  {
    id: 'SW-001',
    name: 'SW-001',
    status: 'Online',
    model: 'UniFi Switch 24 POE',
    ipAddress: '192.168.1.200',
    ports: 24,
  },
  {
    id: 'SW-002',
    name: 'SW-002',
    status: 'Offline',
    model: 'UniFi Switch 16 POE',
    ipAddress: '192.168.1.201',
    ports: 16,
  },
];

type PoeSwitchStatus = 'Online' | 'Offline' | 'Maintenance';
type PoeSwitch = (typeof initialPoeSwitches)[number] & { status: PoeSwitchStatus };

function PoeSwitchForm({
  poeSwitch,
  onSave,
}: {
  poeSwitch?: PoeSwitch;
  onSave: (poeSwitch: Omit<PoeSwitch, 'id' | 'status'> & { id?: string }) => void;
}) {
    const [open, setOpen] = useState(false);

    const isEditMode = !!poeSwitch;
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const poeSwitchData = {
        id: poeSwitch?.id,
        name: formData.get('name') as string,
        model: formData.get('model') as string,
        ipAddress: formData.get('ipAddress') as string,
        ports: parseInt(formData.get('ports') as string, 10),
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
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input id="model" name="model" defaultValue={poeSwitch?.model} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ipAddress" className="text-right">
                  IP Address
                </Label>
                <Input id="ipAddress" name="ipAddress" defaultValue={poeSwitch?.ipAddress} className="col-span-3" required />
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

export function POESwitchPage() {
    const [poeSwitches, setPoeSwitches] = useState<PoeSwitch[]>(initialPoeSwitches as PoeSwitch[]);

    useEffect(() => {
        const interval = setInterval(() => {
          setPoeSwitches(prevPoeSwitches => {
            if (prevPoeSwitches.length === 0) return prevPoeSwitches;
            const randomIndex = Math.floor(Math.random() * prevPoeSwitches.length);
            return prevPoeSwitches.map((sw, index) => {
              if (index === randomIndex) {
                const newStatus = sw.status === 'Online' ? 'Offline' : 'Online';
                return { ...sw, status: newStatus as PoeSwitchStatus };
              }
              return sw;
            });
          });
        }, 5000);
    
        return () => clearInterval(interval);
      }, []);

    const handleSavePoeSwitch = (poeSwitchData: Omit<PoeSwitch, 'id' | 'status'> & { id?: string }) => {
        if (poeSwitchData.id) {
            setPoeSwitches(poeSwitches.map(s => s.id === poeSwitchData.id ? { ...s, ...poeSwitchData } as PoeSwitch : s));
        } else {
            const newPoeSwitch = { ...poeSwitchData, id: `SW-${Date.now()}`, status: 'Offline' as const };
            setPoeSwitches((prev) => [...prev, newPoeSwitch]);
        }
    };

    const handleDeletePoeSwitch = (id: string) => {
        setPoeSwitches((prev) => prev.filter((sw) => sw.id !== id));
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>POE Switches</CardTitle>
            <CardDescription>
            Manage your Power Over Ethernet switches.
            </CardDescription>
        </div>
        <PoeSwitchForm onSave={handleSavePoeSwitch} />
      </CardHeader>
      <CardContent>
         <div className="relative h-[calc(100vh-250px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Ports</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poeSwitches.map((sw) => (
              <TableRow key={sw.id}>
                <TableCell className="font-medium">{sw.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        sw.status === 'Online'
                          ? 'default'
                          : sw.status === 'Offline'
                            ? 'destructive'
                            : 'secondary'
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
                <TableCell>{sw.ipAddress}</TableCell>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
