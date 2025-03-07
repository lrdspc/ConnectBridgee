import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { InspectionList } from '@/components/inspections/InspectionList';
import { useAuth } from '@/hooks/useAuth';

export default function InspecoesTelhadosPage() {
  const { user } = useAuth();
  
  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="container mx-auto px-4 py-6">
          <InspectionList userId={user?.id} />
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}