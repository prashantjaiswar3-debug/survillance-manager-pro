"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { DashboardHeader } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const { isLoaded } = useDashboard();

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-12 gap-6">
                <Skeleton className="col-span-12 md:col-span-4 h-48" />
                <Skeleton className="col-span-12 md:col-span-4 h-48" />
                <Skeleton className="col-span-12 md:col-span-4 h-48" />
                <Skeleton className="col-span-12 md:col-span-6 h-64" />
                <Skeleton className="col-span-12 md:col-span-6 h-64" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <DashboardGrid />
      </main>
    </div>
  );
}
