import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CCTVWidget } from '@/components/widgets/CCTVWidget';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1">
        <div className="w-full h-full">
            <CCTVWidget widget={{ id: 'main-cctv', type: 'cctv', x:0, y:0, w:12, h:12, title: '', content: {}}} />
        </div>
      </main>
    </div>
  );
}
