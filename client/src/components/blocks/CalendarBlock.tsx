import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarDay {
  date: number;
  active?: boolean;
  current?: boolean;
  inactive?: boolean;
  events?: { id: string; title: string; time: string }[];
}

export interface CalendarBlockProps {
  month: string;
  year: number;
  days: CalendarDay[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const CalendarBlock: React.FC<CalendarBlockProps> = ({
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

export default CalendarBlock;