import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Grid,
  Bell,
  Shield,
  MapPin,
  User,
  BarChart2,
  LogOut,
  Settings,
  Search,
  ChevronRight,
  Menu
} from 'lucide-react';

interface SmartLayoutProps {
  children: ReactNode;
  title?: string;
}

const SmartLayout: React.FC<SmartLayoutProps> = ({ children, title }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="smart-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <Link href="/">
            <div className={`sidebar-icon ${isActive('/') ? 'active' : ''}`}>
              <Home size={24} />
            </div>
          </Link>
          <Link href="/visitas">
            <div className={`sidebar-icon ${isActive('/visitas') ? 'active' : ''}`}>
              <Grid size={24} />
            </div>
          </Link>
          <Link href="/relatorios">
            <div className={`sidebar-icon ${isActive('/relatorios') ? 'active' : ''}`}>
              <Bell size={24} />
            </div>
          </Link>
          <Link href="/clientes">
            <div className={`sidebar-icon ${isActive('/clientes') ? 'active' : ''}`}>
              <Shield size={24} />
            </div>
          </Link>
          <Link href="/rotas">
            <div className={`sidebar-icon ${isActive('/rotas') ? 'active' : ''}`}>
              <MapPin size={24} />
            </div>
          </Link>
          <Link href="/perfil">
            <div className={`sidebar-icon ${isActive('/perfil') ? 'active' : ''}`}>
              <User size={24} />
            </div>
          </Link>
          <Link href="/estatisticas">
            <div className={`sidebar-icon ${isActive('/estatisticas') ? 'active' : ''}`}>
              <BarChart2 size={24} />
            </div>
          </Link>
        </div>
        <div className="sidebar-bottom">
          <Link href="/login">
            <div className="sidebar-icon">
              <LogOut size={24} />
            </div>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </div>
          
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Pesquisar" />
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
              <span>Técnico</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="dashboard-content">
          {title && <h1 className="page-title">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default SmartLayout;