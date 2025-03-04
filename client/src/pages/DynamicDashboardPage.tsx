import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Card } from '@/components/ui/card';
import {
  Cloud,
  Droplets,
  Sun,
  Wind,
  TrendingUp,
  BarChart3,
  CheckSquare,
  Newspaper,
  Zap,
  GripVertical,
  Plus,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/dashboard-widgets.css';

// Width provider for the grid layout
const ReactGridLayout = WidthProvider(RGL);

// Define widget types
type WidgetType = 'weather' | 'crypto' | 'tasks' | 'news' | 'learning' | 'calendar';

// Widget data structure
interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content?: any;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

// Mock data for calendar
const calendarData = {
  month: 'Julho 2024',
  days: [
    { day: 'SEG', date: 1, active: false },
    { day: 'TER', date: 2, active: false },
    { day: 'QUA', date: 3, active: false },
    { day: 'QUI', date: 4, active: false },
    { day: 'SEX', date: 5, active: false },
    { day: 'SAB', date: 6, active: false },
    { day: 'DOM', date: 7, active: false },
    { day: 'SEG', date: 8, active: false },
    { day: 'TER', date: 9, active: true },
    { day: 'QUA', date: 10, active: false },
    { day: 'QUI', date: 11, active: false },
    { day: 'SEX', date: 12, active: true },
    { day: 'SAB', date: 13, active: false },
    { day: 'DOM', date: 14, active: false },
    { day: 'SEG', date: 15, active: false },
    { day: 'TER', date: 16, active: false },
    { day: 'QUA', date: 17, active: true, current: true },
    { day: 'QUI', date: 18, active: false },
    { day: 'SEX', date: 19, active: false },
    { day: 'SAB', date: 20, active: false },
    { day: 'DOM', date: 21, active: false },
  ],
  events: [
    { id: 1, title: 'Webinar "How to create a web hierarchy?"', time: '10:00 AM' },
    { id: 2, title: 'Lesson "Client psychology and communication strategy"', time: '2:00 PM' },
    { id: 3, title: 'Lesson "Colour gradients"', time: '4:30 PM' },
  ]
};

const DynamicDashboardPage: React.FC = () => {
  const { toast } = useToast();
  
  // Initial widgets
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'weather-1',
      type: 'weather',
      title: 'Weather Widget',
      content: {
        location: 'São Paulo',
        temperature: 24,
        condition: 'Partly Cloudy',
        humidity: 70,
        wind: 15,
      },
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      minH: 2,
    },
    {
      id: 'crypto-1',
      type: 'crypto',
      title: 'Crypto Trends',
      content: {
        coins: [
          { name: 'Bitcoin', symbol: 'BTC', price: 52430.78, change: 2.4 },
          { name: 'Ethereum', symbol: 'ETH', price: 3120.15, change: -0.8 },
          { name: 'Solana', symbol: 'SOL', price: 142.37, change: 5.2 },
        ],
      },
      x: 4,
      y: 0,
      w: 4,
      h: 2,
      minW: 3,
      minH: 2,
    },
    {
      id: 'tasks-1',
      type: 'tasks',
      title: 'Tasks',
      content: {
        tasks: [
          { id: 't1', text: 'Prepare design presentation', completed: true },
          { id: 't2', text: 'Review marketing materials', completed: false },
          { id: 't3', text: 'Send client proposal', completed: false },
          { id: 't4', text: 'Update portfolio site', completed: false },
        ],
      },
      x: 8,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      minH: 2,
    },
    {
      id: 'news-1',
      type: 'news',
      title: 'Latest News',
      content: {
        articles: [
          { 
            id: 'n1', 
            title: 'New Design Trends for 2024', 
            summary: 'Discover the latest UI/UX design trends that are shaping the digital landscape in 2024.',
            image: 'https://placehold.co/100x60/e9f5f9/1a4a5a?text=Design'
          },
          { 
            id: 'n2', 
            title: 'AI Tools Revolutionizing Workflow', 
            summary: 'How artificial intelligence is changing the way designers and developers work.',
            image: 'https://placehold.co/100x60/f9e9f5/5a1a4a?text=AI'
          },
        ],
      },
      x: 0,
      y: 2,
      w: 6,
      h: 2,
      minW: 4,
      minH: 2,
    },
    {
      id: 'learning-1',
      type: 'learning',
      title: 'Learning Progress',
      content: {
        courses: [
          { id: 'c1', name: 'UX/UI Design', progress: 72, rating: 4.9 },
          { id: 'c2', name: 'Analytics Tools', progress: 48, rating: 4.8 },
        ],
        stats: {
          completed: 18,
          score: 72,
          active: 11
        }
      },
      x: 6,
      y: 2,
      w: 6,
      h: 2,
      minW: 4,
      minH: 2,
    },
    {
      id: 'calendar-1',
      type: 'calendar',
      title: 'Calendar',
      content: calendarData,
      x: 0,
      y: 4,
      w: 12,
      h: 3,
      minW: 6,
      minH: 3,
    }
  ]);

  // Handle layout change
  const handleLayoutChange = (layout: RGL.Layout[]) => {
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = layout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return widget;
    });
    setWidgets(updatedWidgets);
  };

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    toast({
      title: "Widget removed",
      description: "The widget has been removed from your dashboard.",
    });
  };

  // Generate layout for react-grid-layout
  const generateLayout = () => {
    return widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      minW: widget.minW || 2,
      minH: widget.minH || 2,
      maxW: widget.maxW,
      maxH: widget.maxH,
    }));
  };

  // Render a specific widget based on type
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'weather':
        return <WeatherWidget data={widget.content} />;
      case 'crypto':
        return <CryptoWidget data={widget.content} />;
      case 'tasks':
        return <TasksWidget data={widget.content} />;
      case 'news':
        return <NewsWidget data={widget.content} />;
      case 'learning':
        return <LearningWidget data={widget.content} />;
      case 'calendar':
        return <CalendarWidget data={widget.content} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="dashboard-container p-4 md:p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back <span className="inline-block">👋</span>
          </motion.h1>
          <p className="text-gray-500 mt-1">Your personalized dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search something" 
              className="px-4 py-2 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full max-w-xs" 
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <Avatar>
            <AvatarImage src="https://placehold.co/200/f0f0f0/5a5a5a?text=U" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="widget-controls mb-6 flex items-center gap-2">
        <motion.button
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          <span>Add Widget</span>
        </motion.button>
        <Button variant="outline" className="gap-2">
          <GripVertical size={16} />
          <span>Organize</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="widgets-grid"
      >
        <ReactGridLayout
          className="layout"
          layout={generateLayout()}
          cols={12}
          rowHeight={100}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          isBounded={true}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="widget-wrapper">
              <motion.div 
                className="widget-container h-full"
                whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
                transition={{ duration: 0.2 }}
              >
                <Card className="widget h-full overflow-hidden">
                  <div className="widget-header px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="widget-drag-handle cursor-move">
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                      <h3 className="font-medium">{widget.title}</h3>
                    </div>
                    <button 
                      className="widget-close-btn p-1 rounded-full hover:bg-gray-100"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="widget-content p-4 pt-0">
                    {renderWidget(widget)}
                  </div>
                </Card>
              </motion.div>
            </div>
          ))}
        </ReactGridLayout>
      </motion.div>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="weather-widget">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold">{data.temperature}°C</h4>
          <p className="text-gray-500">{data.location}</p>
          <p className="text-sm text-gray-400">{data.condition}</p>
        </div>
        <div className="weather-icon p-2 bg-blue-50 rounded-full">
          {data.condition.includes('Cloud') ? (
            <Cloud size={40} className="text-blue-500" />
          ) : data.condition.includes('Sun') ? (
            <Sun size={40} className="text-yellow-500" />
          ) : (
            <Cloud size={40} className="text-blue-500" />
          )}
        </div>
      </div>
      <div className="weather-details mt-4 grid grid-cols-2 gap-2">
        <div className="weather-detail flex items-center gap-2">
          <Droplets size={18} className="text-blue-400" />
          <span className="text-sm">Humidity: {data.humidity}%</span>
        </div>
        <div className="weather-detail flex items-center gap-2">
          <Wind size={18} className="text-blue-400" />
          <span className="text-sm">Wind: {data.wind} km/h</span>
        </div>
      </div>
    </div>
  );
};

// Crypto Widget Component
const CryptoWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="crypto-widget">
      <div className="crypto-list space-y-3">
        {data.coins.map((coin: any) => (
          <div key={coin.symbol} className="crypto-item flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="crypto-icon p-2 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-lg">
                <TrendingUp size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="font-medium">{coin.name}</p>
                <p className="text-xs text-gray-500">{coin.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${coin.price.toLocaleString()}</p>
              <p className={cn(
                "text-xs",
                coin.change > 0 ? "text-green-500" : "text-red-500"
              )}>
                {coin.change > 0 ? "+" : ""}{coin.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tasks Widget Component
const TasksWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="tasks-widget">
      <div className="tasks-list space-y-2">
        {data.tasks.map((task: any) => (
          <div key={task.id} className="task-item flex items-start gap-2">
            <div className={cn(
              "mt-0.5 flex-shrink-0",
              task.completed ? "text-green-500" : "text-gray-300"
            )}>
              <CheckSquare size={18} />
            </div>
            <p className={cn(
              "text-sm",
              task.completed ? "text-gray-500 line-through" : "text-gray-800"
            )}>
              {task.text}
            </p>
          </div>
        ))}
      </div>
      <Button className="w-full mt-3" variant="outline" size="sm">
        Add Task
      </Button>
    </div>
  );
};

// News Widget Component
const NewsWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="news-widget">
      <div className="news-list space-y-4">
        {data.articles.map((article: any) => (
          <div key={article.id} className="news-item flex gap-3">
            <div className="news-image flex-shrink-0">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-24 h-16 object-cover rounded-md" 
              />
            </div>
            <div className="news-content">
              <h4 className="font-medium text-sm">{article.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Learning Widget Component
const LearningWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="learning-widget">
      <div className="learning-progress flex flex-col gap-4">
        <div className="courses space-y-3">
          {data.courses.map((course: any) => (
            <div key={course.id} className="course">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="course-avatar flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white">
                        <span className="sr-only">User {i}</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                      +6
                    </div>
                  </div>
                  <h4 className="font-medium">{course.name}</h4>
                </div>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{course.rating}</span>
                </Badge>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="stats grid grid-cols-3 gap-2">
          <div className="stat bg-green-50 p-3 rounded-lg">
            <h4 className="text-xl font-bold text-green-700">{data.stats.completed}</h4>
            <p className="text-xs text-green-600">Completed</p>
          </div>
          <div className="stat bg-amber-50 p-3 rounded-lg">
            <h4 className="text-xl font-bold text-amber-700">{data.stats.score}</h4>
            <p className="text-xs text-amber-600">Your score</p>
          </div>
          <div className="stat bg-purple-50 p-3 rounded-lg">
            <h4 className="text-xl font-bold text-purple-700">{data.stats.active}</h4>
            <p className="text-xs text-purple-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar Widget Component
const CalendarWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="calendar-widget">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{data.month}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Button>
        </div>
      </div>

      <div className="calendar-container grid grid-cols-7 gap-1">
        {data.days.map((day: any, index: number) => (
          <motion.div 
            key={index}
            className={cn(
              "calendar-day flex flex-col items-center justify-center p-1 rounded-full text-center",
              day.active && "bg-blue-50 text-blue-700",
              day.current && "bg-blue-600 text-white"
            )}
            whileHover={day.active ? { scale: 1.1 } : {}}
            whileTap={day.active ? { scale: 0.95 } : {}}
          >
            <span className="text-xs font-medium">{day.day}</span>
            <span className={cn(
              "text-sm font-bold",
              !day.active && !day.current && "text-gray-500",
            )}>
              {day.date}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="events mt-3 space-y-2">
        {data.events.map((event: any) => (
          <motion.div 
            key={event.id}
            className="event p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start gap-2">
              <div className="event-icon p-2 bg-blue-100 rounded-full">
                <Zap size={14} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{event.title}</h4>
                <p className="text-xs text-gray-500">{event.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DynamicDashboardPage;