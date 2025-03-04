import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Search, ArrowRight, Book } from 'lucide-react';
import '../styles/modern-layout.css';
import { Link } from 'wouter';

// Logo component
const Logo = () => (
  <div className="logo">
    <span>C.</span>
  </div>
);

// Sidebar Icon component
const SidebarIcon = ({ 
  children, 
  active = false 
}: { 
  children: React.ReactNode, 
  active?: boolean 
}) => (
  <div className={`sidebar-icon ${active ? 'active' : ''}`}>
    {children}
  </div>
);

// Cartão de curso
const CourseCard = ({ 
  title, 
  rating, 
  color 
}: { 
  title: string, 
  rating: number, 
  color: "green" | "pink" 
}) => (
  <div className={`card-base course-card ${color}`}>
    <div className="flex justify-between">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 bg-cover bg-center" 
            style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`}}>
          </div>
        ))}
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/30 border-2 border-white text-xs">
          +6
        </div>
      </div>
      
      <div className="course-rating">
        <span className="course-rating-star">★</span>
        <span className="text-xs font-semibold">{rating}</span>
      </div>
    </div>
    
    <h3 className="course-title">{title}</h3>
    
    <button className="course-action">
      <ArrowRight size={16} />
    </button>
  </div>
);

// Cartão de estatística
const StatCard = ({ 
  label, 
  value, 
  color 
}: { 
  label: string, 
  value: number, 
  color: "green" | "yellow" | "purple" 
}) => (
  <div className={`card-base stat-card ${color}`}>
    <h3 className="stat-value">{value}</h3>
    <p className="stat-label">{label}</p>
    
    <button className="course-action">
      <ArrowRight size={16} />
    </button>
  </div>
);

// Cartão de progresso do curso
const ProgressCard = ({ 
  title, 
  category, 
  progress, 
  lessons, 
  color 
}: { 
  title: string, 
  category: string, 
  progress: number, 
  lessons: string, 
  color: "yellow" | "pink" 
}) => (
  <div className={`card-base progress-card ${color}`}>
    <div className="flex justify-between items-center">
      <div className="category-badge">
        {category}
      </div>
      <ArrowRight size={16} />
    </div>
    
    <div className="progress-lessons">
      {lessons}
    </div>
    
    <h3 className="progress-title">{title}</h3>
    
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
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

// Cartão de evento
const EventCard = ({ 
  title,
  icon
}: { 
  title: string,
  icon: React.ReactNode
}) => (
  <div className="event-card">
    <div className="event-icon">
      {icon}
    </div>
    <span className="event-title">{title}</span>
  </div>
);

const ModernDashboard = () => {
  // Dados de atividades
  const activitiesData = {
    courses: [
      { id: 'c1', title: 'UX/UI Design', rating: 4.9, color: 'green' as const },
      { id: 'c2', title: 'Analytics Tools', rating: 4.8, color: 'pink' as const },
    ],
    stats: {
      completed: 18,
      score: 72,
      active: 11
    },
    progress: [
      { 
        id: 'p1', 
        title: 'Interface motion', 
        category: 'IT & Software', 
        progress: 45, 
        lessons: '11/24 lessons',
        color: 'yellow' as const
      },
      { 
        id: 'p2', 
        title: '', 
        category: 'IT & Software', 
        progress: 0, 
        lessons: '',
        color: 'pink' as const
      },
    ]
  };
  
  // Dados do calendário
  const calendarData = {
    month: 'July 2024',
    days: [
      { day: 'MON', date: 30, inactive: true },
      { day: 'TUE', date: 1 },
      { day: 'WED', date: 2 },
      { day: 'THU', date: 3 },
      { day: 'FRI', date: 4 },
      { day: 'SAT', date: 5 },
      { day: 'SUN', date: 6 },
      { day: '', date: 7 },
      { day: '', date: 8 },
      { day: '', date: 9, active: true },
      { day: '', date: 10 },
      { day: '', date: 11 },
      { day: '', date: 12, active: true },
      { day: '', date: 13 },
      { day: '', date: 14 },
      { day: '', date: 15 },
      { day: '', date: 16 },
      { day: '', date: 17, current: true },
      { day: '', date: 18 },
      { day: '', date: 19 },
      { day: '', date: 20 },
      { day: '', date: 21 },
      { day: '', date: 22 },
      { day: '', date: 23 },
      { day: '', date: 24 },
      { day: '', date: 25 },
      { day: '', date: 26 },
      { day: '', date: 27 },
      { day: '', date: 28 },
      { day: '', date: 29 },
      { day: '', date: 30 },
      { day: '', date: 31 },
      { day: '', date: 1, inactive: true },
      { day: '', date: 2, inactive: true },
      { day: '', date: 3, inactive: true },
    ],
    events: [
      { id: 1, title: 'Webinar "How to create a web hierarchy?"' },
      { id: 2, title: 'Lesson "Client psychology and communication strategy?"' },
      { id: 3, title: 'Lesson "Colour gradients"' },
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <Logo />
          
          <div className="sidebar-icons">
            <SidebarIcon active={true}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="6" height="6" x="3" y="3" rx="1" />
                <rect width="6" height="6" x="15" y="3" rx="1" />
                <rect width="6" height="6" x="3" y="15" rx="1" />
                <rect width="6" height="6" x="15" y="15" rx="1" />
              </svg>
            </SidebarIcon>
            <SidebarIcon>
              <Book size={20} />
            </SidebarIcon>
            <SidebarIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </SidebarIcon>
            <SidebarIcon>
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
        <div className="main-content">
          <div className="dashboard-content">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-3xl font-bold">Welcome back <span className="inline-block">👋</span></h1>
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
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activities Section */}
              <div>
                <h2 className="text-2xl font-bold mb-5">Your activities today <span className="text-gray-400">(5)</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {activitiesData.courses.map(course => (
                    <CourseCard 
                      key={course.id}
                      title={course.title}
                      rating={course.rating}
                      color={course.color}
                    />
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold mb-5">Learning progress</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    label="Completed"
                    value={activitiesData.stats.completed}
                    color="green"
                  />
                  
                  <StatCard 
                    label="Your score"
                    value={activitiesData.stats.score}
                    color="yellow"
                  />
                  
                  <StatCard 
                    label="Active"
                    value={activitiesData.stats.active}
                    color="purple"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProgressCard 
                    title={activitiesData.progress[0].title}
                    category={activitiesData.progress[0].category}
                    progress={activitiesData.progress[0].progress}
                    lessons={activitiesData.progress[0].lessons}
                    color={activitiesData.progress[0].color}
                  />
                  
                  <ProgressCard 
                    title={activitiesData.progress[1].title}
                    category={activitiesData.progress[1].category}
                    progress={activitiesData.progress[1].progress}
                    lessons={activitiesData.progress[1].lessons}
                    color={activitiesData.progress[1].color}
                  />
                </div>
              </div>
              
              {/* Calendar Section */}
              <div>
                <h2 className="text-2xl font-bold mb-5">Lesson schedule</h2>
                
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
                    <div className="calendar-day-header">MON</div>
                    <div className="calendar-day-header">TUE</div>
                    <div className="calendar-day-header">WED</div>
                    <div className="calendar-day-header">THU</div>
                    <div className="calendar-day-header">FRI</div>
                    <div className="calendar-day-header">SAT</div>
                    <div className="calendar-day-header">SUN</div>
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
                  
                  {/* Lista de eventos */}
                  <div className="space-y-3 mt-4">
                    {calendarData.events.map(event => (
                      <EventCard 
                        key={event.id}
                        title={event.title}
                        icon={<Book size={14} />}
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