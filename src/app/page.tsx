import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6"></main>
    </div>
  );
}
