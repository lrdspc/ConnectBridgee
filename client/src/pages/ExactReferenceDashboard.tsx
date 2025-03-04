import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Bell, Calendar, ChevronLeft, ChevronRight, Clock, FolderIcon, Home, Move, Plus, Search, Settings, Users, X } from 'lucide-react';
import { Link } from 'wouter';

// Importando estilos específicos
import '../styles/exact-reference.css';

// Tipos de blocos
interface ActivityCardData {
  id: string;
  title: string;
  rating: number;
  color: 'green' | 'pink';
  users: { id: number; imageUrl: string }[];
}

interface CalendarDayData {
  date: number;
  active?: boolean;
  current?: boolean;
  inactive?: boolean;
  events?: { id: string; title: string; time: string }[];
}

interface StatCardData {
  title: string;
  value: string | number;
  trend: number;
  color: string;
  data: { name: string; value: number }[];
}

// Tipo de bloco
interface Block {
  id: string;
  type: 'activity' | 'calendar' | 'stats';
  title: string;
  isFullWidth?: boolean;
  position: { x: number, y: number };
  props: any;
}

// Componente BlockWrapper
const BlockWrapper: React.FC<{
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove: (id: string) => void;
  isDraggable?: boolean;
  onMoveStart?: (id: string, e: React.MouseEvent) => void;
  isFullWidth?: boolean;
}> = ({
  id,
  title,
  children,
  onRemove,
  isDraggable = true,
  onMoveStart,
  isFullWidth = false
}) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className={`block-wrapper ${isFullWidth ? 'block-full-width' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="block-header">
        <h3 className="section-title">{title}</h3>
        
        {showControls && (
          <div className="block-controls">
            {isDraggable && onMoveStart && (
              <button 
                className="block-control-btn"
                onMouseDown={(e) => onMoveStart(id, e)}
              >
                <Move size={16} />
              </button>
            )}
            <button 
              className="block-control-btn"
              onClick={() => onRemove(id)}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="block-content">
        {children}
      </div>
    </div>
  );
};

// Componente ActivityBlock
const ActivityBlock: React.FC<{
  activities: ActivityCardData[];
}> = ({ activities }) => {
  return (
    <div className="activities-grid">
      {activities.map((activity) => (
        <div key={activity.id} className={`activity-card ${activity.color === 'pink' ? 'pink' : ''}`}>
          <div className="activity-card-header">
            <div className="users-group">
              {activity.users.map((user, i) => (
                <div 
                  key={user.id} 
                  className="user-dot" 
                  style={{
                    backgroundImage: `url(${user.imageUrl})`,
                    backgroundSize: 'cover',
                    zIndex: 5 - i
                  }}
                />
              ))}
              <div className="more-users">+6</div>
            </div>
            
            <div className="rating-badge">
              <span className="rating-star">★</span>
              <span>{activity.rating}</span>
            </div>
          </div>
          
          <h3 className="activity-title">{activity.title}</h3>
          
          <button className="action-button">
            <ArrowRight size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Componente CalendarBlock
const CalendarBlock: React.FC<{
  month: string;
  year: number;
  days: CalendarDayData[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}> = ({
  month,
  year,
  days,
  onPrevMonth,
  onNextMonth
}) => {
  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={onPrevMonth}>
          <ChevronLeft size={18} />
        </button>
        
        <h3 className="calendar-title">
          {month} {year}
        </h3>
        
        <button className="calendar-nav-btn" onClick={onNextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day ${day.inactive ? 'inactive' : ''} ${day.current ? 'current' : ''} ${day.active ? 'active' : ''}`}
          >
            <span className="day-number">{day.date}</span>
            
            {day.events && day.events.length > 0 && (
              <div className="day-events">
                {day.events.map(event => (
                  <div key={event.id} className="event-indicator">
                    <span className="event-time">{event.time}</span>
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente StatsBlock
const StatsBlock: React.FC<{
  stats: StatCardData[];
}> = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-info">
            <span className="stat-title">{stat.title}</span>
            <h3 className="stat-value">{stat.value}</h3>
            <div className={`stat-trend ${stat.trend > 0 ? 'positive' : 'negative'}`}>
              {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
            </div>
          </div>
          
          <div className="stat-chart">
            <div className="chart-placeholder" style={{ backgroundColor: stat.color + '20' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente principal ExactReferenceDashboard
const ExactReferenceDashboard: React.FC = () => {
  // Estado para controle dos blocos dinâmicos
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'activities-1',
      type: 'activity',
      title: 'Activities',
      position: { x: 0, y: 0 },
      props: {
        activities: getActivitiesData(),
      }
    },
    {
      id: 'calendar-1',
      type: 'calendar',
      title: 'Calendar',
      position: { x: 1, y: 0 },
      props: {
        month: 'July',
        year: 2023,
        days: getCalendarData(),
        onPrevMonth: () => console.log('Previous month'),
        onNextMonth: () => console.log('Next month'),
      }
    },
    {
      id: 'stats-1',
      type: 'stats',
      title: 'Statistics',
      isFullWidth: true,
      position: { x: 0, y: 1 },
      props: {
        stats: getStatsData(),
      }
    }
  ]);

  // Estados para arrastar e soltar
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Handler para começar a arrastar um bloco
  const handleMoveStart = (id: string, e: React.MouseEvent) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;

    setIsDragging(true);
    setDraggedBlockId(id);

    // Calculando o offset do mouse em relação ao bloco
    const blockElement = e.currentTarget.closest('.block-wrapper') as HTMLElement;
    if (blockElement) {
      const rect = blockElement.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragPosition({
        x: rect.left,
        y: rect.top
      });
    }

    // Adicionando event listeners para mousemove e mouseup
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handler para movimentação durante arrasto
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedBlockId) return;
    
    setDragPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  // Handler para finalizar arrasto
  const handleMouseUp = () => {
    if (!isDragging || !draggedBlockId || !dashboardRef.current) return;

    // Pegando referência ao dashboard e calculando a grade
    const dashboardRect = dashboardRef.current.getBoundingClientRect();
    
    // Posição em relação ao dashboard
    const relativeX = dragPosition.x - dashboardRect.left;
    const relativeY = dragPosition.y - dashboardRect.top;
    
    // Largura da coluna
    const columnWidth = dashboardRect.width / 2;
    
    // Calculando a coluna mais próxima (0 ou 1)
    const column = Math.round(relativeX / columnWidth);
    
    // Atualizando a posição do bloco
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === draggedBlockId
          ? { ...block, position: { ...block.position, x: Math.min(1, Math.max(0, column)) } }
          : block
      )
    );

    // Limpando estados de arrasto
    setIsDragging(false);
    setDraggedBlockId(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Removendo um bloco
  const handleRemoveBlock = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  };

  // Adicionando um novo bloco
  const handleAddBlock = (type: 'activity' | 'calendar' | 'stats') => {
    const newId = `${type}-${Date.now()}`;
    let newBlock: Block;

    switch (type) {
      case 'activity':
        newBlock = {
          id: newId,
          type,
          title: 'Activities',
          position: { x: 0, y: blocks.length },
          props: {
            activities: getActivitiesData(),
          }
        };
        break;
      case 'calendar':
        newBlock = {
          id: newId,
          type,
          title: 'Calendar',
          position: { x: 1, y: blocks.length },
          props: {
            month: 'July',
            year: 2023,
            days: getCalendarData(),
          }
        };
        break;
      case 'stats':
        newBlock = {
          id: newId,
          type,
          title: 'Statistics',
          isFullWidth: true,
          position: { x: 0, y: blocks.length },
          props: {
            stats: getStatsData(),
          }
        };
        break;
      default:
        return;
    }

    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  };

  // Renderizando o conteúdo de um bloco
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'activity':
        return <ActivityBlock {...block.props} />;
      case 'calendar':
        return <CalendarBlock {...block.props} />;
      case 'stats':
        return <StatsBlock {...block.props} />;
      default:
        return null;
    }
  };

  // Organizando blocos por posição Y
  const sortedBlocks = [...blocks].sort((a, b) => {
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });

  // Blocos na coluna esquerda e direita
  const leftColumnBlocks = sortedBlocks.filter(block => !block.isFullWidth && block.position.x === 0);
  const rightColumnBlocks = sortedBlocks.filter(block => !block.isFullWidth && block.position.x === 1);
  const fullWidthBlocks = sortedBlocks.filter(block => block.isFullWidth);

  return (
    <div className="reference-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="logo">P</div>
          <div className="sidebar-icons">
            <Link href="/" className="sidebar-icon active">
              <Home size={20} />
            </Link>
            <Link href="/calendar" className="sidebar-icon">
              <Calendar size={20} />
            </Link>
            <Link href="/users" className="sidebar-icon">
              <Users size={20} />
            </Link>
            <Link href="/files" className="sidebar-icon">
              <FolderIcon size={20} />
            </Link>
          </div>
        </div>
        <div className="sidebar-bottom">
          <Link href="/settings" className="sidebar-icon">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search" />
          </div>
          <div className="user-controls">
            <button className="header-icon-button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" />
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="dashboard-content" ref={dashboardRef}>
          {/* Esquerda - Atividades */}
          <div className="content-left">
            {leftColumnBlocks.map(block => (
              <BlockWrapper
                key={block.id}
                id={block.id}
                title={block.title}
                onRemove={handleRemoveBlock}
                onMoveStart={handleMoveStart}
              >
                {renderBlockContent(block)}
              </BlockWrapper>
            ))}
            <button className="add-block-button" onClick={() => handleAddBlock('activity')}>
              <Plus size={20} />
              <span>Add Activity Block</span>
            </button>
          </div>

          {/* Direita - Calendário */}
          <div className="content-right">
            {rightColumnBlocks.map(block => (
              <BlockWrapper
                key={block.id}
                id={block.id}
                title={block.title}
                onRemove={handleRemoveBlock}
                onMoveStart={handleMoveStart}
              >
                {renderBlockContent(block)}
              </BlockWrapper>
            ))}
            <button className="add-block-button" onClick={() => handleAddBlock('calendar')}>
              <Plus size={20} />
              <span>Add Calendar Block</span>
            </button>
          </div>

          {/* Full width blocks */}
          <div className="content-full">
            {fullWidthBlocks.map(block => (
              <BlockWrapper
                key={block.id}
                id={block.id}
                title={block.title}
                onRemove={handleRemoveBlock}
                onMoveStart={handleMoveStart}
                isFullWidth={true}
              >
                {renderBlockContent(block)}
              </BlockWrapper>
            ))}
            <button className="add-block-button full-width" onClick={() => handleAddBlock('stats')}>
              <Plus size={20} />
              <span>Add Statistics Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bloco sendo arrastado */}
      {isDragging && draggedBlockId && (
        <div
          className="dragged-block-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              opacity: 0.8,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {draggedBlockId && renderBlockContent(blocks.find(b => b.id === draggedBlockId)!)}
          </div>
        </div>
      )}
    </div>
  );
};

// Funções auxiliares para obter dados mockados
function getActivitiesData(): ActivityCardData[] {
  return [
    {
      id: '1',
      title: 'Meditation Time',
      rating: 4.6,
      color: 'green',
      users: [
        { id: 1, imageUrl: 'https://i.pravatar.cc/150?img=32' },
        { id: 2, imageUrl: 'https://i.pravatar.cc/150?img=33' },
        { id: 3, imageUrl: 'https://i.pravatar.cc/150?img=35' },
      ],
    },
    {
      id: '2',
      title: 'Yoga Exercises',
      rating: 4.2,
      color: 'pink',
      users: [
        { id: 4, imageUrl: 'https://i.pravatar.cc/150?img=31' },
        { id: 5, imageUrl: 'https://i.pravatar.cc/150?img=36' },
      ],
    },
    {
      id: '3',
      title: 'Daily Planning',
      rating: 4.8,
      color: 'green',
      users: [
        { id: 6, imageUrl: 'https://i.pravatar.cc/150?img=37' },
        { id: 7, imageUrl: 'https://i.pravatar.cc/150?img=38' },
        { id: 8, imageUrl: 'https://i.pravatar.cc/150?img=39' },
      ],
    },
    {
      id: '4',
      title: 'Reading Books',
      rating: 4.5,
      color: 'pink',
      users: [
        { id: 9, imageUrl: 'https://i.pravatar.cc/150?img=40' },
        { id: 10, imageUrl: 'https://i.pravatar.cc/150?img=41' },
      ],
    }
  ];
}

function getCalendarData(): CalendarDayData[] {
  return [
    { date: 1, inactive: true },
    { date: 2, inactive: true },
    { date: 3, inactive: true },
    { date: 4, inactive: true },
    { date: 5, inactive: true },
    { date: 6, inactive: true },
    { date: 7, inactive: true },
    { date: 8, inactive: true },
    { date: 9, inactive: true },
    { date: 10 },
    { date: 11 },
    { date: 12 },
    { date: 13 },
    { date: 14, current: true, active: true, events: [{ id: 'e1', title: 'Meeting', time: '09:00' }] },
    { date: 15 },
    { date: 16 },
    { date: 17, events: [{ id: 'e2', title: 'Call', time: '14:30' }] },
    { date: 18 },
    { date: 19 },
    { date: 20 },
    { date: 21 },
    { date: 22 },
    { date: 23 },
    { date: 24 },
    { date: 25 },
    { date: 26 },
    { date: 27 },
    { date: 28 },
    { date: 29 },
    { date: 30 },
    { date: 31 },
  ];
}

function getStatsData(): StatCardData[] {
  return [
    {
      title: 'Progress',
      value: '64%',
      trend: 12,
      color: '#7166F9',
      data: [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 30 },
        { name: 'Mar', value: 25 },
        { name: 'Apr', value: 38 },
        { name: 'May', value: 40 },
        { name: 'Jun', value: 48 },
        { name: 'Jul', value: 64 },
      ],
    },
    {
      title: 'Tasks',
      value: '126',
      trend: 8,
      color: '#67D4CA',
      data: [
        { name: 'Jan', value: 60 },
        { name: 'Feb', value: 80 },
        { name: 'Mar', value: 85 },
        { name: 'Apr', value: 90 },
        { name: 'May', value: 100 },
        { name: 'Jun', value: 110 },
        { name: 'Jul', value: 126 },
      ],
    },
    {
      title: 'Hours',
      value: '42.8',
      trend: -3,
      color: '#F6C6EA',
      data: [
        { name: 'Jan', value: 50 },
        { name: 'Feb', value: 48 },
        { name: 'Mar', value: 45 },
        { name: 'Apr', value: 44 },
        { name: 'May', value: 46 },
        { name: 'Jun', value: 44 },
        { name: 'Jul', value: 42.8 },
      ],
    },
    {
      title: 'Efficiency',
      value: '82%',
      trend: 5,
      color: '#F9E25D',
      data: [
        { name: 'Jan', value: 70 },
        { name: 'Feb', value: 72 },
        { name: 'Mar', value: 75 },
        { name: 'Apr', value: 78 },
        { name: 'May', value: 78 },
        { name: 'Jun', value: 80 },
        { name: 'Jul', value: 82 },
      ],
    },
  ];
}

export default ExactReferenceDashboard;