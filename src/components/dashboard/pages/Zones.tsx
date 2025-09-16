"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const initialZones = [
  { id: 'zone-1', name: 'Zone 1' },
  { id: 'zone-2', name: 'Zone 2' },
  { id: 'outdoor', name: 'Outdoor' },
];

type Zone = {
  id: string;
  name: string;
};

export function ZonesPage() {
  const [zones, setZones] = useState(initialZones);
  const [newZoneName, setNewZoneName] = useState('');

  const handleAddZone = () => {
    if (newZoneName.trim() === '') return;
    const newZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
    };
    setZones((prevZones) => [...prevZones, newZone]);
    setNewZoneName('');
  };

  const handleDeleteZone = (id: string) => {
    setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zones</CardTitle>
        <CardDescription>
          Manage your camera zones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Input 
            type="text" 
            placeholder="New zone name"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)} 
          />
          <Button onClick={handleAddZone}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Zone
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell className="font-medium">{zone.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteZone(zone.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
