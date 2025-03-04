import React, { useState, useEffect } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { useVisits } from '../hooks/useVisits';
import { PageTransition, LoadingAnimation } from '@/components/ui/loading-animation';
import { Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import DashboardTiles from '@/components/dashboard/DashboardTiles';

export default function DashboardPage() {
  const { visits, isLoading } = useVisits();
  const [stats, setStats] = useState({
    completed: 0,
    scheduled: 0,
    pending: 0,
    inProgress: 0
  });
  const [weeklyVisits, setWeeklyVisits] = useState<{day: string, count: number}[]>([]);
  const [today] = useState(new Date());

  // Processar estatísticas quando os dados de visitas mudarem
  useEffect(() => {
    if (!isLoading && visits) {
      const statusCounts = {
        completed: visits.filter(v => v.status === 'completed').length,
        scheduled: visits.filter(v => v.status === 'scheduled').length,
        pending: visits.filter(v => v.status === 'pending').length,
        inProgress: visits.filter(v => v.status === 'in-progress').length
      };
      setStats(statusCounts);

      // Criar dados para o gráfico semanal
      const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const currentDay = today.getDay();
      
      // Preparar dados dos últimos 7 dias
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (currentDay - i + 7) % 7;
        const dayName = daysOfWeek[dayIndex];
        
        // Data para comparação (últimos 7 dias)
        const compareDate = new Date(today);
        compareDate.setDate(today.getDate() - i);
        const compareString = formatDate(compareDate, 'yyyy-MM-dd');
        
        // Contar visitas deste dia
        const dayVisits = visits.filter(v => {
          const visitDate = v.date.split('T')[0];
          return visitDate === compareString;
        }).length;
        
        weekData.push({ day: dayName, count: dayVisits });
      }
      setWeeklyVisits(weekData);
    }
  }, [visits, isLoading, today]);

  // Renderização do componente
  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              <span className="text-sm text-slate-600 font-medium">
                {formatDate(today, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingAnimation text="Carregando dashboard..." />
            </div>
          ) : (
            <DashboardTiles 
              stats={stats} 
              visits={visits} 
              weeklyVisits={weeklyVisits}
              className="mt-4" 
            />
          )}
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}