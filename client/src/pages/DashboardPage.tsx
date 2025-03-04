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
  BarChart2,
  Lightbulb,
  Wifi,
  Music,
  Lamp
} from 'lucide-react';

// Componentes
import SmartLayout from '../components/layout/SmartLayout';
import { SmartCard, SmartCardContent, SmartCardHeader } from '../components/ui/SmartCard';
import SmartButton from '../components/ui/SmartButton';
import { useVisits } from '../hooks/useVisits';
import { Visit } from '../lib/db';
import VisitCard from '../components/visits/VisitCard';

// Componente de Card de Estatísticas
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'purple' | 'yellow' | 'orange' | 'teal';
}> = ({ title, value, icon, color }) => {
  return (
    <div className={`device-small-card ${color}`}>
      {icon}
      <span>{title}</span>
      <div className="toggle-mini on"></div>
    </div>
  );
};

// Componente de Card de Dispositivo
const DeviceCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOn?: boolean;
  color?: 'white' | 'purple' | 'yellow' | 'orange' | 'teal';
  onClick?: () => void;
}> = ({ title, icon, isOn = false, color = 'white', onClick }) => {
  return (
    <div className={`device-card ${color}`} onClick={onClick}>
      <div className="device-card-content">
        <div className="device-icon">
          {icon}
        </div>
        <div className="device-info">
          <span className="device-title">{title}</span>
          <div className="toggle-container">
            <span className="toggle-label">{isOn ? 'ON' : 'OFF'}</span>
            <div className={`toggle-switch ${isOn ? 'on' : ''}`}>
              <div className="toggle-knob"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Seção de Visitas Pendentes
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

// Página do Dashboard
const DashboardPage: React.FC = () => {
  const { visits, isLoading } = useVisits();
  const [, setLocation] = useLocation();
  const [weatherTemperature, setWeatherTemperature] = useState('23°C');
  const [weatherCondition, setWeatherCondition] = useState('Parcialmente nublado');
  const [devices, setDevices] = useState({
    lights: true,
    wifi: true,
    music: false,
    lamp: true
  });
  
  // Filtrar visitas por status
  const pendingVisits = visits.filter(v => v.status === 'pending');
  const scheduledVisits = visits.filter(v => v.status === 'scheduled');
  const urgentVisits = visits.filter(v => v.status === 'urgent');
  const completedVisits = visits.filter(v => v.status === 'completed');
  
  // Toggle de dispositivos
  const toggleDevice = (device: keyof typeof devices) => {
    setDevices({
      ...devices,
      [device]: !devices[device]
    });
  };
  
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
      </div>
      
      {/* Status Cards */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Resumo de Atividades</h3>
        </div>
        
        <div className="devices-grid">
          <DeviceCard 
            title="Visitas Agendadas" 
            icon={<Calendar size={24} />}
            isOn={true}
            color="white"
            onClick={() => setLocation('/visitas')}
          />
          <DeviceCard 
            title="Visitas Pendentes" 
            icon={<Clock size={24} />}
            isOn={true}
            color="purple"
            onClick={() => setLocation('/visitas')}
          />
          <DeviceCard 
            title="Relatórios" 
            icon={<CheckSquare size={24} />}
            isOn={true}
            color="white"
            onClick={() => setLocation('/relatorios')}
          />
          <DeviceCard 
            title="Clientes" 
            icon={<Users size={24} />}
            isOn={true}
            color="white"
            onClick={() => setLocation('/clientes')}
          />
        </div>
      </div>
      
      {/* Dispositivos de Exemplo */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Dispositivos de Exemplo</h3>
          <div className="section-controls">
            <div className="room-selector">
              <span>Todos os dispositivos</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
        
        <div className="devices-grid">
          <DeviceCard 
            title="Luzes" 
            icon={<Lightbulb size={24} />}
            isOn={devices.lights}
            color="white"
            onClick={() => toggleDevice('lights')}
          />
          <DeviceCard 
            title="Wi-Fi" 
            icon={<Wifi size={24} />}
            isOn={devices.wifi}
            color="purple"
            onClick={() => toggleDevice('wifi')}
          />
          <DeviceCard 
            title="Sistema de Música" 
            icon={<Music size={24} />}
            isOn={devices.music}
            color="white"
            onClick={() => toggleDevice('music')}
          />
          <DeviceCard 
            title="Lâmpadas" 
            icon={<Lamp size={24} />}
            isOn={devices.lamp}
            color="white"
            onClick={() => toggleDevice('lamp')}
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
        
        <div className="temperature-control">
          <div className="chart-container">
            <div className="chart-placeholder text-center">
              <BarChart2 size={48} />
              <p>Gráfico de desempenho semanal</p>
            </div>
          </div>
        </div>
      </div>
    </SmartLayout>
  );
};

export default DashboardPage;