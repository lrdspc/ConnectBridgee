import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Thermometer,
  CloudRain,
  ChevronRight,
  PlusCircle,
  Calendar,
  CheckSquare,
  Clock,
  Users,
  BarChart2
} from 'lucide-react';

// Componentes
import SmartLayout from '../components/layout/SmartLayout';
import { SmartCard, SmartCardContent, SmartCardHeader } from '../components/ui/SmartCard';
import SmartButton from '../components/ui/SmartButton';
import { useVisits } from '../hooks/useVisits';
import { Visit } from '../lib/db';
import VisitCard from '../components/visits/VisitCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'purple' | 'yellow' | 'orange' | 'teal';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`device-small-card ${color}`}>
      <div className="device-small-card-icon">{icon}</div>
      <span className="device-small-card-value">{value}</span>
      <span className="device-small-card-title">{title}</span>
    </div>
  );
};

const PendingVisitSection: React.FC<{ visits: Visit[] }> = ({ visits }) => {
  const [, setLocation] = useLocation();
  
  if (visits.length === 0) {
    return (
      <div className="empty-state">
        <p>Não há visitas pendentes.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="visits-list">
        {visits.slice(0, 2).map((visit) => (
          <VisitCard key={visit.id} visit={visit} showActions={false} />
        ))}
      </div>
      {visits.length > 2 && (
        <div className="view-more">
          <SmartButton
            variant="ghost"
            color="primary"
            onClick={() => setLocation('/visitas')}
          >
            Ver todas as visitas
          </SmartButton>
        </div>
      )}
    </>
  );
};

const DashboardPage: React.FC = () => {
  const { visits, isLoading } = useVisits();
  const [, setLocation] = useLocation();
  const [weatherTemperature, setWeatherTemperature] = useState('23°C');
  const [weatherCondition, setWeatherCondition] = useState('Parcialmente nublado');
  
  // Filtrar visitas por status
  const pendingVisits = visits.filter(v => v.status === 'pending');
  const scheduledVisits = visits.filter(v => v.status === 'scheduled');
  const urgentVisits = visits.filter(v => v.status === 'urgent');
  const completedVisits = visits.filter(v => v.status === 'completed');
  
  // Simular obtenção de dados meteorológicos
  useEffect(() => {
    const getWeatherData = () => {
      // Simular API de clima
      const temperatures = ['19°C', '21°C', '23°C', '25°C', '27°C'];
      const conditions = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvoso', 'Tempestuoso'];
      
      setWeatherTemperature(temperatures[Math.floor(Math.random() * temperatures.length)]);
      setWeatherCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    };
    
    getWeatherData();
  }, []);
  
  return (
    <SmartLayout>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Olá, Técnico!</h2>
          <p>Bem-vindo ao seu painel de controle. Aqui está o resumo das suas atividades de hoje.</p>
          
          <div className="weather-info">
            <div className="weather-item">
              <Thermometer size={16} />
              <span>{weatherTemperature} Temperatura externa</span>
            </div>
            <div className="weather-item">
              <CloudRain size={16} />
              <span>{weatherCondition}</span>
            </div>
          </div>
        </div>
        <div className="welcome-image">
          <img src="/technician-illustration.svg" alt="Técnico trabalhando" />
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Resumo de Atividades</h3>
        </div>
        
        <div className="device-cards">
          <StatCard
            title="Visitas Agendadas"
            value={scheduledVisits.length}
            icon={<Calendar size={24} />}
            color="purple"
          />
          <StatCard
            title="Visitas Concluídas"
            value={completedVisits.length}
            icon={<CheckSquare size={24} />}
            color="teal"
          />
          <StatCard
            title="Urgências"
            value={urgentVisits.length}
            icon={<Clock size={24} />}
            color="orange"
          />
          <StatCard
            title="Clientes"
            value={visits.length > 0 ? new Set(visits.map(v => v.clientName)).size : 0}
            icon={<Users size={24} />}
            color="yellow"
          />
        </div>
      </div>
      
      {/* Pending Visits */}
      <div className="dashboard-section">
        <div className="section-header with-controls">
          <h3>Visitas Pendentes</h3>
          <div className="section-controls">
            <button 
              className="section-control-button add-new"
              onClick={() => setLocation('/visitas/nova')}
            >
              <PlusCircle size={18} />
              <span>Nova Visita</span>
            </button>
            <button 
              className="section-control-button"
              onClick={() => setLocation('/visitas')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-state">Carregando visitas...</div>
        ) : (
          <PendingVisitSection visits={pendingVisits} />
        )}
      </div>
      
      {/* Performance Chart */}
      <div className="dashboard-section">
        <div className="section-header with-controls">
          <h3>Desempenho da Semana</h3>
          <div className="section-controls">
            <button 
              className="section-control-button"
              onClick={() => setLocation('/estatisticas')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <SmartCard>
          <SmartCardContent>
            <div className="chart-container">
              <div className="chart-placeholder">
                <BarChart2 size={48} />
                <p>Gráfico de desempenho semanal</p>
              </div>
            </div>
          </SmartCardContent>
        </SmartCard>
      </div>
    </SmartLayout>
  );
};

export default DashboardPage;