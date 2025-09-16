import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <h2 className="text-2xl font-semibold">Dashboard is Empty</h2>
            <p className="mt-2">The dashboard has been cleared.</p>
        </div>
      </main>
    </div>
  );
}
