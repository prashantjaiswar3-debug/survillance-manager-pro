"use client";

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardHorizontalNav } from '@/components/dashboard/DashboardHorizontalNav';
import { CamerasPage, type Camera } from '@/components/dashboard/pages/Cameras';
import { NVRsPage, type NVR } from '@/components/dashboard/pages/NVRs';
import { POESwitchPage, type PoeSwitch } from '@/components/dashboard/pages/POESwitch';
import { TodoPage } from '@/components/dashboard/pages/Todo';
import { IPScannerPage } from '@/components/dashboard/pages/IPScanner';
import { ZonesPage } from '@/components/dashboard/pages/Zones';
import { menuItems } from '@/components/dashboard/DashboardHorizontalNav';
import useLocalStorageState from '@/hooks/use-local-storage-state';

type MenuItem = (typeof menuItems)[number];

const initialCameras: Camera[] = [
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
    status: 'Offline',
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

const initialNvrs: NVR[] = [
  {
    id: 'NVR-001',
    name: 'NVR-001',
    status: 'Online',
    storage: '8 TB',
    ipAddress: '192.168.1.100',
    channels: 8,
  },
  {
    id: 'NVR-002',
    name: 'NVR-002',
    status: 'Offline',
    storage: '16 TB',
    ipAddress: '192.168.1.101',
    channels: 16,
  },
];

const initialPoeSwitches: PoeSwitch[] = [
  {
    id: 'SW-001',
    name: 'SW-001',
    status: 'Online',
    model: 'UniFi Switch 24 POE',
    ports: 24,
  },
  {
    id: 'SW-002',
    name: 'SW-002',
    status: 'Offline',
    model: 'UniFi Switch 16 POE',
    ports: 16,
  },
];

export default function Home() {
  const [activePage, setActivePage] = useState<MenuItem>('Cameras');
  const [cameras, setCameras] = useLocalStorageState<Camera[]>('cameras', initialCameras);
  const [nvrs, setNvrs] = useLocalStorageState<NVR[]>('nvrs', initialNvrs);
  const [poeSwitches, setPoeSwitches] = useLocalStorageState<PoeSwitch[]>('poeSwitches', initialPoeSwitches);

  const renderPage = () => {
    switch (activePage) {
      case 'Cameras':
        return <CamerasPage cameras={cameras} setCameras={setCameras} nvrs={nvrs} poeSwitches={poeSwitches} />;
      case 'NVRs':
        return <NVRsPage nvrs={nvrs} setNvrs={setNvrs} />;
      case 'POE Switch':
        return <POESwitchPage poeSwitches={poeSwitches} setPoeSwitches={setPoeSwitches} />;
      case 'Todo':
        return <TodoPage />;
      case 'IP Scanner':
        return <IPScannerPage cameras={cameras} nvrs={nvrs} poeSwitches={poeSwitches} />;
      case 'Zones':
        return <ZonesPage />;
      default:
        return <CamerasPage cameras={cameras} setCameras={setCameras} nvrs={nvrs} poeSwitches={poeSwitches} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader activePage={activePage} setActivePage={setActivePage} />
      <DashboardHorizontalNav
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {renderPage()}
      </main>
    </div>
  );
}
