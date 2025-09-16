"use client";

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Camera } from './Cameras';
import type { NVR } from './NVRs';
import type { PoeSwitch } from './POESwitch';

type IPScannerPageProps = {
    cameras: Camera[];
    nvrs: NVR[];
    poeSwitches: PoeSwitch[];
};

function isValidIp(ip: string) {
    const octets = ip.split('.').map(Number);
    return octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
}

export function IPScannerPage({ cameras, nvrs, poeSwitches }: IPScannerPageProps) {
    const [ipRangeStart, setIpRangeStart] = useState('192.168.1.1');
    const [ipRangeEnd, setIpRangeEnd] = useState('192.168.1.254');
    const [isScanning, setIsScanning] = useState(false);
    
    const usedIps = useMemo(() => {
        const ips = new Map<string, { type: string, name: string }>();
        cameras.forEach(c => ips.set(c.ipAddress, { type: 'Camera', name: c.name }));
        nvrs.forEach(n => ips.set(n.ipAddress, { type: 'NVR', name: n.name }));
        poeSwitches.forEach(s => ips.set(s.ipAddress, { type: 'POE Switch', name: s.name }));
        return ips;
    }, [cameras, nvrs, poeSwitches]);

    const ipList = useMemo(() => {
        if (!isValidIp(ipRangeStart) || !isValidIp(ipRangeEnd)) return [];

        const start = ipRangeStart.split('.').map(Number);
        const end = ipRangeEnd.split('.').map(Number);
        const startNum = (start[0] << 24) | (start[1] << 16) | (start[2] << 8) | start[3];
        const endNum = (end[0] << 24) | (end[1] << 16) | (end[2] << 8) | end[3];
        
        const list = [];
        for (let i = startNum; i <= endNum; i++) {
            const ip = [
                (i >> 24) & 255,
                (i >> 16) & 255,
                (i >> 8) & 255,
                i & 255
            ].join('.');
            list.push(ip);
        }
        return list;
    }, [ipRangeStart, ipRangeEnd]);

    const handleScan = () => {
        setIsScanning(true);
        // Simulate network scan
        setTimeout(() => {
            setIsScanning(false);
        }, 1500);
    };
    

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Scanner</CardTitle>
        <CardDescription>
          Scan your network for connected devices and check for available IP addresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
                <Label htmlFor="ip-start">IP Range Start</Label>
                <Input id="ip-start" value={ipRangeStart} onChange={(e) => setIpRangeStart(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ip-end">IP Range End</Label>
                <Input id="ip-end" value={ipRangeEnd} onChange={(e) => setIpRangeEnd(e.target.value)} />
            </div>
            <div className="flex items-end">
                <Button onClick={handleScan} disabled={isScanning} className="w-full">
                    {isScanning ? 'Scanning...' : 'Scan Network'}
                </Button>
            </div>
        </div>

        <ScrollArea className="h-[calc(100vh-350px)]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Device Type</TableHead>
                        <TableHead>Device Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ipList.map(ip => {
                        const usedBy = usedIps.get(ip);
                        return (
                            <TableRow key={ip}>
                                <TableCell className="font-mono">{ip}</TableCell>
                                <TableCell>
                                    <Badge variant={usedBy ? 'destructive' : 'default'}>
                                        {usedBy ? 'Used' : 'Free'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{usedBy?.type || '-'}</TableCell>
                                <TableCell>{usedBy?.name || '-'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
