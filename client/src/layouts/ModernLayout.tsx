import React, { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Book, Calendar, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';

// Logo component
const Logo = () => (
  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
    <span className="text-white font-bold text-lg">C.</span>
  </div>
);

// Sidebar Icon component
const SidebarIcon = ({ 
  children, 
  active = false, 
  href 
}: { 
  children: React.ReactNode, 
  active?: boolean,
  href: string
}) => {
  const [location] = useLocation();
  const isActive = active || location === href;
  
  return (
    <Link href={href}>
      <a className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
        {children}
      </a>
    </Link>
  );
};

interface ModernLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string | React.ReactNode;
}

export function ModernLayout({ children, title = "Welcome back 👋", subtitle }: ModernLayoutProps) {
  return (
    <div className="dashboard-container bg-white min-h-screen">
      <div className="dashboard-layout flex min-h-screen">
        {/* Sidebar */}
        <div className="sidebar w-20 fixed left-0 top-0 bottom-0 flex flex-col items-center py-8 bg-white border-r border-gray-100">
          <Link href="/">
            <a><Logo /></a>
          </Link>
          
          <div className="sidebar-icons flex flex-col gap-6 mt-12">
            <SidebarIcon href="/" active={true}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="6" height="6" x="3" y="3" rx="1" />
                <rect width="6" height="6" x="15" y="3" rx="1" />
                <rect width="6" height="6" x="3" y="15" rx="1" />
                <rect width="6" height="6" x="15" y="15" rx="1" />
              </svg>
            </SidebarIcon>
            <SidebarIcon href="/visitas">
              <Book size={20} />
            </SidebarIcon>
            <SidebarIcon href="/relatorios">
              <Calendar size={20} />
            </SidebarIcon>
            <SidebarIcon href="/perfil">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="21.17" x2="12" y1="8" y2="8" />
                <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
              </svg>
            </SidebarIcon>
          </div>
        </div>
        
        {/* Main content */}
        <div className="main-content ml-20 flex-1 p-12 bg-gray-50 relative">
          <div className="dashboard-content max-w-6xl mx-auto bg-white rounded-3xl p-10 shadow-sm">
            {/* Header */}
            <div className="header flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle && <div className="text-gray-500 mt-1">{subtitle}</div>}
              </div>
              
              <div className="flex items-center gap-5">
                <div className="search-box relative">
                  <input 
                    type="text" 
                    placeholder="Search something" 
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-64 text-sm" 
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <Link href="/perfil">
                  <a>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://ui-avatars.com/api/?name=User&background=FFB6C1&color=FFF" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Content */}
            <div className="dashboard-container">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernLayout;