import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardHorizontalNav } from '@/components/dashboard/DashboardHorizontalNav';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <DashboardHorizontalNav />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"></main>
    </div>
  );
}
