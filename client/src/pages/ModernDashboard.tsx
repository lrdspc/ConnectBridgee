import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowRight, 
  Home, 
  FileText, 
  Calendar, 
  ClipboardCheck, 
  User,
  BarChart,
  Map,
  CheckSquare
} from 'lucide-react';
import '../styles/modern-layout.css';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Logo component
const Logo = () => (
  <div className="logo">
    <span>B.</span>
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
}) => (
  <Link href={href}>
    <a className={`sidebar-icon ${active ? 'active' : ''}`}>
      {children}
    </a>
  </Link>
);

// Cartão de Visita/Inspeção
const InspectionCard = ({ 
  title, 
  rating, 
  color,
  status,
  address,
  href
}: { 
  title: string, 
  rating: number, 
  color: "green" | "pink", 
  status: string,
  address?: string,
  href: string
}) => (
  <Link href={href}>
    <a className={`card-base course-card ${color}`}>
      <div className="flex justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 bg-cover bg-center" 
              style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`}}>
            </div>
          ))}
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/30 border-2 border-white text-xs">
            +2
          </div>
        </div>
        
        <div className="course-rating">
          <span className="course-rating-star">★</span>
          <span className="text-xs font-semibold">{rating}</span>
        </div>
      </div>
      
      <h3 className="course-title">{title}</h3>
      {address && <p className="text-xs opacity-70 mt-1">{address}</p>}
      
      <button className="course-action">
        <ArrowRight size={16} />
      </button>
    </a>
  </Link>
);

// Cartão de estatística
const StatCard = ({ 
  label, 
  value, 
  color,
  href
}: { 
  label: string, 
  value: number | string, 
  color: "green" | "yellow" | "purple",
  href: string
}) => (
  <Link href={href}>
    <a className={`card-base stat-card ${color}`}>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{label}</p>
      
      <button className="course-action">
        <ArrowRight size={16} />
      </button>
    </a>
  </Link>
);

// Cartão de progresso de relatório
const ReportProgressCard = ({ 
  title, 
  category, 
  progress, 
  details, 
  color,
  href
}: { 
  title: string, 
  category: string, 
  progress: number, 
  details: string, 
  color: "yellow" | "pink",
  href: string
}) => (
  <Link href={href}>
    <a className={`card-base progress-card ${color}`}>
      <div className="flex justify-between items-center">
        <div className="category-badge">
          {category}
        </div>
        <ArrowRight size={16} />
      </div>
      
      <div className="progress-lessons">
        {details}
      </div>
      
      <h3 className="progress-title">{title}</h3>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </a>
  </Link>
);

// Dia do calendário
const CalendarDay = ({ 
  day, 
  date, 
  active, 
  current, 
  inactive 
}: { 
  day?: string, 
  date: number, 
  active?: boolean, 
  current?: boolean,
  inactive?: boolean 
}) => (
  <div className={`calendar-day ${active ? 'active' : ''} ${current ? 'current' : ''} ${inactive ? 'inactive' : ''}`}>
    {day && <span className="text-xs opacity-60">{day}</span>}
    <span>{date}</span>
  </div>
);

// Cartão de visita agendada
const ScheduledVisitCard = ({ 
  title,
  icon,
  time,
  address,
  color = "default",
  href
}: { 
  title: string,
  icon: React.ReactNode,
  time: string,
  address?: string,
  color?: "default" | "urgent" | "pending",
  href: string
}) => (
  <Link href={href}>
    <a className={`event-card ${color === "urgent" ? "bg-red-50" : color === "pending" ? "bg-yellow-50" : ""}`}>
      <div className="event-icon">
        {icon}
      </div>
      <div className="flex-1">
        <span className="event-title">{title}</span>
        {address && <div className="text-xs opacity-60 mt-1">{address}</div>}
      </div>
      <div className="text-xs font-medium opacity-70">{time}</div>
    </a>
  </Link>
);

const ModernDashboard = () => {
  // Configurar data atual
  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  const currentDay = format(currentDate, 'd');
  
  // Dados de visitas e inspeções
  const fieldActivitiesData = {
    inspections: [
      { 
        id: 'i1', 
        title: 'Inspeção de Telhado', 
        rating: 4.9, 
        color: 'green' as const,
        status: 'Em Progresso',
        address: 'Brasilit São Paulo - Zona Industrial',
        href: '/visitas/1'
      },
      { 
        id: 'i2', 
        title: 'Vistoria Técnica FAR', 
        rating: 4.8, 
        color: 'pink' as const,
        status: 'Agendada',
        address: 'Condomínio Villa Nova - Bloco A',
        href: '/visitas/2'
      },
    ],
    stats: {
      concluidas: 18,
      desempenho: 92,
      pendentes: 7
    },
    reports: [
      { 
        id: 'r1', 
        title: 'Relatório FAR - Telhas', 
        category: 'Vistoria Técnica', 
        progress: 65, 
        details: '13/20 itens concluídos',
        color: 'yellow' as const,
        href: '/relatorio-vistoria'
      },
      { 
        id: 'r2', 
        title: 'Inspeção Preventiva', 
        category: 'Manutenção', 
        progress: 30, 
        details: '6/20 itens concluídos',
        color: 'pink' as const,
        href: '/relatorio-vistoria'
      },
    ]
  };
  
  // Gerar dias do mês atual para o calendário
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  // Ajustar o primeiro dia para começar na segunda-feira (0 = Segunda no nosso caso)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  // Gerar dias do mês anterior
  const prevMonthDays = [];
  for (let i = daysInPrevMonth - adjustedFirstDay + 1; i <= daysInPrevMonth; i++) {
    prevMonthDays.push({ date: i, inactive: true });
  }
  
  // Gerar dias do mês atual
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === parseInt(currentDay);
    currentMonthDays.push({ 
      date: i, 
      current: isToday,
      active: [9, 12, 17, 22].includes(i) // Dias com visitas marcadas
    });
  }
  
  // Gerar dias do próximo mês
  const nextMonthDays = [];
  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push({ date: i, inactive: true });
  }
  
  // Combinar todos os dias
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  // Adicionar dias da semana no começo
  const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  allDays.splice(0, 0, ...weekDays.map(day => ({ day, date: 0 })));
  
  // Dados do calendário
  const calendarData = {
    month: currentMonth,
    days: allDays.slice(7), // Remover os dias da semana
    weekDays,
    visits: [
      { 
        id: 1, 
        title: 'Vistoria de Telhado - Condomínio Villa Verde', 
        time: '09:30',
        address: 'Av. Paulo Faccini, 200',
        href: '/visitas/1'
      },
      { 
        id: 2, 
        title: 'Inspeção FAR - Construtora Cury', 
        time: '14:00',
        address: 'Rua das Palmeiras, 1500 - Torre 3',
        urgent: true,
        href: '/visitas/2'
      },
      { 
        id: 3, 
        title: 'Elaboração de Laudo Técnico - Coberturas', 
        time: '16:30',
        pending: true,
        href: '/visitas/3'
      },
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <Link href="/">
            <a><Logo /></a>
          </Link>
          
          <div className="sidebar-icons">
            <SidebarIcon active={true} href="/">
              <Home size={20} />
            </SidebarIcon>
            <SidebarIcon href="/visitas">
              <ClipboardCheck size={20} />
            </SidebarIcon>
            <SidebarIcon href="/relatorios">
              <FileText size={20} />
            </SidebarIcon>
            <SidebarIcon href="/perfil">
              <User size={20} />
            </SidebarIcon>
          </div>
        </div>
        
        {/* Main content */}
        <div className="main-content">
          <div className="dashboard-content">
            {/* Header */}
            <div className="header flex justify-between items-center mb-12">
              <div>
                <h1 className="text-3xl font-bold">Bem-vindo de volta <span className="inline-block">👋</span></h1>
              </div>
              
              <div className="header-profile flex items-center gap-5">
                <div className="search-box relative">
                  <input 
                    type="text" 
                    placeholder="Buscar visitas, relatórios..." 
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-64 text-sm" 
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <Link href="/perfil">
                  <a>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Técnico&background=4ADE80&color=FFF" alt="Técnico" />
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Field Activities Section */}
              <div className="mobile-slide-in">
                <h2 className="text-2xl font-bold mb-5">Atividades de hoje <span className="text-gray-400">(5)</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {fieldActivitiesData.inspections.map(inspection => (
                    <InspectionCard 
                      key={inspection.id}
                      title={inspection.title}
                      rating={inspection.rating}
                      color={inspection.color}
                      status={inspection.status}
                      address={inspection.address}
                      href={inspection.href}
                    />
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold mb-5">Desempenho</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    label="Concluídas"
                    value={fieldActivitiesData.stats.concluidas}
                    color="green"
                    href="/visitas?status=completed"
                  />
                  
                  <StatCard 
                    label="Taxa de Sucesso"
                    value={`${fieldActivitiesData.stats.desempenho}%`}
                    color="yellow"
                    href="/perfil"
                  />
                  
                  <StatCard 
                    label="Pendentes"
                    value={fieldActivitiesData.stats.pendentes}
                    color="purple"
                    href="/visitas?status=pending"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldActivitiesData.reports.map(report => (
                    <ReportProgressCard 
                      key={report.id}
                      title={report.title}
                      category={report.category}
                      progress={report.progress}
                      details={report.details}
                      color={report.color}
                      href={report.href}
                    />
                  ))}
                </div>
              </div>
              
              {/* Calendar Section */}
              <div className="mobile-slide-in" style={{animationDelay: '0.1s'}}>
                <h2 className="text-2xl font-bold mb-5">Agenda de Visitas</h2>
                
                <div className="bg-white rounded-xl p-6">
                  <div className="calendar-header">
                    <h3 className="calendar-title">{calendarData.month}</h3>
                    <div className="calendar-controls">
                      <button className="calendar-control">
                        <ChevronLeft size={18} />
                      </button>
                      <button className="calendar-control">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {calendarData.weekDays.map((day, index) => (
                      <div key={index} className="calendar-day-header">{day}</div>
                    ))}
                  </div>
                  
                  {/* Dias do calendário */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {calendarData.days.map((day, index) => (
                      <CalendarDay 
                        key={index}
                        date={day.date}
                        day={day.day}
                        active={day.active}
                        current={day.current}
                        inactive={day.inactive}
                      />
                    ))}
                  </div>
                  
                  {/* Lista de visitas agendadas */}
                  <div className="space-y-3 mt-4">
                    {calendarData.visits.map(visit => (
                      <ScheduledVisitCard 
                        key={visit.id}
                        title={visit.title}
                        icon={visit.urgent ? <CheckSquare size={14} className="text-red-600" /> : visit.pending ? <CheckSquare size={14} className="text-amber-600" /> : <CheckSquare size={14} />}
                        time={visit.time}
                        address={visit.address}
                        color={visit.urgent ? "urgent" : visit.pending ? "pending" : "default"}
                        href={visit.href}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;