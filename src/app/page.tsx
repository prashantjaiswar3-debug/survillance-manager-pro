"use client";

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardHorizontalNav } from '@/components/dashboard/DashboardHorizontalNav';
import { CamerasPage } from '@/components/dashboard/pages/Cameras';
import { NVRsPage } from '@/components/dashboard/pages/NVRs';
import { POESwitchPage } from '@/components/dashboard/pages/POESwitch';
import { TodoPage } from '@/components/dashboard/pages/Todo';
import { IPScannerPage } from '@/components/dashboard/pages/IPScanner';
import { menuItems } from '@/components/dashboard/DashboardHorizontalNav';

type MenuItem = (typeof menuItems)[number];

export default function Home() {
  const [activePage, setActivePage] = useState<MenuItem>('Cameras');

  const renderPage = () => {
    switch (activePage) {
      case 'Cameras':
        return <CamerasPage />;
      case 'NVRs':
        return <NVRsPage />;
      case 'POE Switch':
        return <POESwitchPage />;
      case 'Todo':
        return <TodoPage />;
      case 'IP Scanner':
        return <IPScannerPage />;
      default:
        return <CamerasPage />;
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
