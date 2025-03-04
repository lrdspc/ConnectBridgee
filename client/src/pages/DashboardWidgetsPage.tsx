import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Book, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import '../styles/dashboard-widgets.css';

// Logo component
const Logo = () => (
  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
    <span className="text-white font-bold text-lg">C.</span>
  </div>
);

// Sidebar Icon component
const SidebarIcon = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${active ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
    {children}
  </div>
);

// Course Card component
const CourseCard = ({ title, rating, backgroundColor }: { title: string, rating: number, backgroundColor: string }) => (
  <div className={`course-card p-4 ${backgroundColor} rounded-xl relative overflow-hidden`}>
    <div className="flex justify-between mb-4">
      <div className="course-avatars flex">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-6 h-6 -ml-2 first:ml-0 rounded-full bg-white/30 border border-white/50">
            <span className="sr-only">User {i}</span>
          </div>
        ))}
        <div className="w-6 h-6 -ml-2 rounded-full bg-white/20 border border-white/50 flex items-center justify-center text-xs text-white/80">
          +6
        </div>
      </div>
      <Badge className="bg-white/90 text-black flex items-center gap-1 px-2 py-1 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span className="text-xs font-semibold">{rating}</span>
      </Badge>
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black">
      <ArrowRight size={16} />
    </button>
  </div>
);

// Stat Card component
const StatCard = ({ title, value, backgroundColor }: { title: string, value: number, backgroundColor: string }) => (
  <div className={`stat-card p-4 ${backgroundColor} rounded-xl`}>
    <h3 className="text-3xl font-bold">{value}</h3>
    <p className="text-sm">{title}</p>
    <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black">
      <ArrowRight size={16} />
    </button>
  </div>
);

// Course Progress Card component
const CourseProgressCard = ({ title, progress, category }: { title: string, progress: number, category: string }) => (
  <div className="course-progress p-4 bg-amber-100 rounded-xl relative">
    <div className="flex justify-between items-center mb-1">
      <div className="px-2 py-1 bg-white/60 rounded-lg text-xs">
        {category}
      </div>
      <ArrowRight size={16} className="text-gray-700" />
    </div>
    <div className="text-sm text-gray-600 mb-1">
      11/24 lessons
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-amber-500 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// Event Card component
const EventCard = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="event-card p-4 bg-gray-100 rounded-xl mb-2">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  </div>
);

// Calendar Day component
const CalendarDay = ({ day, date, active, current }: { day: string, date: number, active?: boolean, current?: boolean }) => (
  <div 
    className={`calendar-day flex flex-col items-center justify-center p-1 aspect-square rounded-full text-center transition-all cursor-pointer
      ${active ? 'bg-gray-200' : ''}
      ${current ? 'bg-black text-white' : ''}
    `}
  >
    <span className="text-xs font-medium">{day}</span>
    <span className="text-sm font-bold">
      {date}
    </span>
  </div>
);

const DashboardWidgetsPage: React.FC = () => {
  // Data for your activities
  const activitiesData = {
    courses: [
      { id: 'c1', name: 'UX/UI Design', progress: 72, rating: 4.9 },
      { id: 'c2', name: 'Analytics Tools', progress: 48, rating: 4.8 },
    ],
    stats: {
      completed: 18,
      score: 72,
      active: 11
    }
  };
  
  // Data for calendar
  const calendarData = {
    month: 'July 2024',
    days: [
      { day: 'MON', date: 30, active: false, current: false },
      { day: 'TUE', date: 1, active: false, current: false },
      { day: 'WED', date: 2, active: false, current: false },
      { day: 'THU', date: 3, active: false, current: false },
      { day: 'FRI', date: 4, active: false, current: false },
      { day: 'SAT', date: 5, active: false, current: false },
      { day: 'SUN', date: 6, active: false, current: false },
      { day: 'MON', date: 7, active: false, current: false },
      { day: 'TUE', date: 8, active: false, current: false },
      { day: 'WED', date: 9, active: true, current: false },
      { day: 'THU', date: 10, active: false, current: false },
      { day: 'FRI', date: 11, active: false, current: false },
      { day: 'SAT', date: 12, active: true, current: false },
      { day: 'SUN', date: 13, active: false, current: false },
      { day: 'MON', date: 14, active: false, current: false },
      { day: 'TUE', date: 15, active: false, current: false },
      { day: 'WED', date: 16, active: false, current: false },
      { day: 'THU', date: 17, active: true, current: true },
      { day: 'FRI', date: 18, active: false, current: false },
      { day: 'SAT', date: 19, active: false, current: false },
      { day: 'SUN', date: 20, active: false, current: false },
      { day: 'MON', date: 21, active: false, current: false },
      { day: 'TUE', date: 22, active: false, current: false },
      { day: 'WED', date: 23, active: false, current: false },
      { day: 'THU', date: 24, active: false, current: false },
      { day: 'FRI', date: 25, active: false, current: false },
      { day: 'SAT', date: 26, active: false, current: false },
      { day: 'SUN', date: 27, active: false, current: false },
      { day: 'MON', date: 28, active: false, current: false },
      { day: 'TUE', date: 29, active: false, current: false },
      { day: 'WED', date: 30, active: false, current: false },
      { day: 'THU', date: 31, active: false, current: false },
      { day: 'FRI', date: 1, active: false, current: false },
      { day: 'SAT', date: 2, active: false, current: false },
      { day: 'SUN', date: 3, active: false, current: false },
    ],
    events: [
      { id: 1, title: 'Webinar "How to create a web hierarchy?"', time: '10:00 AM' },
      { id: 2, title: 'Lesson "Client psychology and communication strategy?"', time: '2:00 PM' },
      { id: 3, title: 'Lesson "Colour gradients"', time: '4:30 PM' },
    ]
  };

  return (
    <div className="dashboard-container bg-white min-h-screen">
      <div className="dashboard-layout flex min-h-screen">
        {/* Sidebar */}
        <div className="sidebar w-20 fixed left-0 top-0 bottom-0 flex flex-col items-center py-8 bg-white border-r border-gray-100">
          <Logo />
          
          <div className="sidebar-icons flex flex-col gap-6 mt-12">
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
              <Calendar size={20} />
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
        <div className="main-content ml-20 flex-1 p-12 bg-gray-50 relative">
          <div className="dashboard-content max-w-6xl mx-auto bg-white rounded-3xl p-10 shadow-sm">
            {/* Header */}
            <div className="header flex justify-between items-center mb-10">
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
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://ui-avatars.com/api/?name=User&background=FFB6C1&color=FFF" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="dashboard-grid">
              {/* Activities Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div>
                  <h2 className="text-2xl font-bold mb-5">Your activities today <span className="text-gray-400">(5)</span></h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CourseCard 
                      title="UX/UI Design"
                      rating={4.9}
                      backgroundColor="bg-gradient-to-br from-green-100 to-green-50"
                    />
                    
                    <CourseCard 
                      title="Analytics Tools"
                      rating={4.8}
                      backgroundColor="bg-gradient-to-br from-pink-100 to-pink-50"
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-5">Lesson schedule</h2>
                  
                  <div className="calendar-widget">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{calendarData.month}</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <ChevronLeft size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                      <div className="text-xs font-medium text-gray-500">MON</div>
                      <div className="text-xs font-medium text-gray-500">TUE</div>
                      <div className="text-xs font-medium text-gray-500">WED</div>
                      <div className="text-xs font-medium text-gray-500">THU</div>
                      <div className="text-xs font-medium text-gray-500">FRI</div>
                      <div className="text-xs font-medium text-gray-500">SAT</div>
                      <div className="text-xs font-medium text-gray-500">SUN</div>
                    </div>
                    
                    {/* Calendar grid - first 7x4 grid */}
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {calendarData.days.slice(0, 28).map((day, index) => (
                        <CalendarDay 
                          key={index}
                          day=""
                          date={day.date}
                          active={day.active}
                          current={day.current}
                        />
                      ))}
                    </div>
                    
                    {/* Event list */}
                    <div className="space-y-2">
                      {calendarData.events.map((event) => (
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
              
              {/* Learning Progress Section */}
              <div>
                <h2 className="text-2xl font-bold mb-5">Learning progress</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    title="Completed"
                    value={activitiesData.stats.completed}
                    backgroundColor="bg-gradient-to-br from-green-100 to-green-50"
                  />
                  
                  <StatCard 
                    title="Your score"
                    value={activitiesData.stats.score}
                    backgroundColor="bg-gradient-to-br from-amber-100 to-amber-50"
                  />
                  
                  <StatCard 
                    title="Active"
                    value={activitiesData.stats.active}
                    backgroundColor="bg-gradient-to-br from-purple-100 to-purple-50"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CourseProgressCard 
                    title="Interface motion"
                    progress={35}
                    category="IT & Software"
                  />
                  
                  <div className="bg-pink-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="px-2 py-1 bg-white/60 rounded-lg text-xs">
                        IT & Software
                      </div>
                      <ArrowRight size={16} className="text-gray-700" />
                    </div>
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

export default DashboardWidgetsPage;