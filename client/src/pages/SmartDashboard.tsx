import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Home,
  Grid,
  Bell,
  Shield,
  MapPin,
  User,
  BarChart2,
  LogOut,
  Thermometer,
  CloudRain,
  Settings,
  ChevronRight,
  Minus,
  Plus,
  Search
} from 'lucide-react';

// Importando estilos específicos
import '../styles/smart-dashboard.css';

// Componentes
const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) => (
  <div className={`sidebar-icon ${active ? 'active' : ''}`}>
    {icon}
  </div>
);

const DeviceCard = ({ 
  title, 
  icon, 
  isOn = false, 
  color = 'blue',
  onClick
}: { 
  title: string; 
  icon: React.ReactNode; 
  isOn?: boolean; 
  color?: string;
  onClick?: () => void;
}) => (
  <div 
    className={`device-card ${color}`} 
    onClick={onClick}
  >
    <div className="device-card-content">
      <div className="device-icon">
        {icon}
      </div>
      <div className="device-info">
        <span className="device-title">{title}</span>
        <div className="toggle-container">
          <span className="toggle-label">{isOn ? 'ON' : 'OFF'}</span>
          <div className={`toggle-switch ${isOn ? 'on' : 'off'}`}>
            <div className="toggle-knob"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MemberBadge = ({ 
  name, 
  avatar, 
  status = 'online', 
  access = 'Full Access'
}: { 
  name: string; 
  avatar: string; 
  status?: string; 
  access?: string; 
}) => (
  <div className="member-badge">
    <div className="member-avatar">
      <img src={avatar} alt={name} />
    </div>
    <div className="member-name">{name}</div>
    <div className="member-status">{access}</div>
  </div>
);

// Dashboard principal
const SmartDashboard: React.FC = () => {
  // Estados
  const [temperature, setTemperature] = useState(25);
  const [currentRoom, setCurrentRoom] = useState('Living Room');
  const [devices, setDevices] = useState({
    refrigerator: true,
    temperature: true,
    airConditioner: false,
    lights: false,
    musicSystem: true,
    router: true,
    lamps: true
  });
  
  // Funções de controle
  const toggleDevice = (device: keyof typeof devices) => {
    setDevices({
      ...devices,
      [device]: !devices[device]
    });
  };
  
  const incrementTemperature = () => {
    if (temperature < 30) {
      setTemperature(temperature + 1);
    }
  };
  
  const decrementTemperature = () => {
    if (temperature > 16) {
      setTemperature(temperature - 1);
    }
  };
  
  return (
    <div className="smart-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <SidebarIcon icon={<Home size={24} />} active />
          <SidebarIcon icon={<Grid size={24} />} />
          <SidebarIcon icon={<Bell size={24} />} />
          <SidebarIcon icon={<Shield size={24} />} />
          <SidebarIcon icon={<MapPin size={24} />} />
          <SidebarIcon icon={<User size={24} />} />
          <SidebarIcon icon={<BarChart2 size={24} />} />
        </div>
        <div className="sidebar-bottom">
          <SidebarIcon icon={<LogOut size={24} />} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search" />
          </div>
          <div className="user-controls">
            <button className="icon-button">
              <Settings size={20} />
            </button>
            <button className="icon-button">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
              <span>Scarlett</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
        
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Hello, Scarlett!</h2>
            <p>Welcome home! The air quality is good & fresh you can go out today.</p>
            
            <div className="weather-info">
              <div className="weather-item">
                <Thermometer size={16} />
                <span>+25°C Outdoor temperature</span>
              </div>
              <div className="weather-item">
                <CloudRain size={16} />
                <span>Fuzzy cloudy weather</span>
              </div>
            </div>
          </div>
          <div className="welcome-image">
            <img src="/walking-dog-illustration.svg" alt="Walking with dog" />
          </div>
        </div>
        
        {/* Home Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Scarlett's Home</h3>
            <div className="section-controls">
              <div className="section-tag">
                <div className="humidity-icon"></div>
                <span>35%</span>
              </div>
              <div className="section-tag">
                <Thermometer size={16} />
                <span>15°C</span>
              </div>
              <div className="room-selector">
                <span>{currentRoom}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
          
          {/* Device Controls */}
          <div className="devices-grid">
            <DeviceCard 
              title="Refrigerator" 
              icon={<i className="bi bi-cup-hot-fill"></i>}
              isOn={devices.refrigerator}
              color="white"
              onClick={() => toggleDevice('refrigerator')}
            />
            <DeviceCard 
              title="Temperature" 
              icon={<Thermometer size={24} />}
              isOn={devices.temperature}
              color="purple"
              onClick={() => toggleDevice('temperature')}
            />
            <DeviceCard 
              title="Air Conditioner" 
              icon={<i className="bi bi-snow"></i>}
              isOn={devices.airConditioner}
              color="white"
              onClick={() => toggleDevice('airConditioner')}
            />
            <DeviceCard 
              title="Lights" 
              icon={<i className="bi bi-lightbulb"></i>}
              isOn={devices.lights}
              color="white"
              onClick={() => toggleDevice('lights')}
            />
          </div>
          
          {/* Temperature Control */}
          <div className="temperature-control">
            <div className="temp-header">
              <div className="temp-title">
                <i className="bi bi-lightning-charge"></i>
                <span>Living Room Temperature</span>
              </div>
              <div className="toggle-container">
                <span className="toggle-label">ON</span>
                <div className="toggle-switch on">
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>
            
            <div className="temp-control-container">
              <button className="temp-button minus" onClick={decrementTemperature}>
                <Minus size={20} />
              </button>
              
              <div className="temp-display">
                <div className="temp-value">
                  <span className="temp-number">{temperature}</span>
                  <span className="temp-unit">°C</span>
                  <div className="temp-label">Celsius</div>
                </div>
                <div className="temp-circle">
                  <div className="temp-marks"></div>
                </div>
              </div>
              
              <button className="temp-button plus" onClick={incrementTemperature}>
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* My Devices */}
        <div className="sidebar-section my-devices">
          <div className="section-header with-controls">
            <h3>My Devices</h3>
            <div className="section-controls">
              <span className="toggle-state">ON</span>
              <span className="dropdown-arrow">▼</span>
              <button className="section-control-button">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="device-cards">
            <div className="device-small-card purple">
              <i className="bi bi-cup-hot-fill"></i>
              <span>Refrigerator</span>
              <div className="toggle-mini on"></div>
            </div>
            <div className="device-small-card yellow">
              <i className="bi bi-router"></i>
              <span>Router</span>
              <div className="toggle-mini on"></div>
            </div>
            <div className="device-small-card orange">
              <i className="bi bi-music-note-beamed"></i>
              <span>Music System</span>
              <div className="toggle-mini on"></div>
            </div>
            <div className="device-small-card teal">
              <i className="bi bi-lamp-fill"></i>
              <span>Lamps</span>
              <div className="toggle-mini on"></div>
            </div>
          </div>
        </div>
        
        {/* Members */}
        <div className="sidebar-section members">
          <div className="section-header with-controls">
            <h3>Members</h3>
            <button className="section-control-button">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="members-container">
            <MemberBadge 
              name="Scarlett" 
              avatar="https://i.pravatar.cc/150?img=32" 
              status="online" 
              access="Admin"
            />
            <MemberBadge 
              name="Nanya" 
              avatar="https://i.pravatar.cc/150?img=23" 
              status="online" 
              access="Full Access"
            />
            <MemberBadge 
              name="Riya" 
              avatar="https://i.pravatar.cc/150?img=25" 
              status="offline" 
              access="Full Access"
            />
            <MemberBadge 
              name="Dad" 
              avatar="https://i.pravatar.cc/150?img=53" 
              status="online" 
              access="Full Access"
            />
            <MemberBadge 
              name="Mom" 
              avatar="https://i.pravatar.cc/150?img=47" 
              status="online" 
              access="Full Access"
            />
          </div>
        </div>
        
        {/* Power Consumed */}
        <div className="sidebar-section power-consumption">
          <div className="section-header with-controls">
            <h3>Power Consumed</h3>
            <div className="section-controls">
              <span className="time-period">Month</span>
              <span className="dropdown-arrow">▼</span>
              <button className="section-control-button">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="power-stat">
            <div className="power-header">
              <div className="power-icon">
                <i className="bi bi-lightning-charge-fill"></i>
                <span>Electricity Consumed</span>
              </div>
              <div className="power-value">
                <span>73% Spending</span>
              </div>
            </div>
            
            <div className="power-chart">
              {/* Aqui seria renderizado o gráfico - usando placeholder por enquanto */}
              <div className="chart-placeholder">
                <img src="/power-consumption-chart.svg" alt="Power consumption chart" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDashboard;