import { Dashboard } from '@/components/dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
