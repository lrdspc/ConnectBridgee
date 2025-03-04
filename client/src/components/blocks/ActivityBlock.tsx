import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ActivityCardProps {
  id: string;
  title: string;
  rating: number;
  color: 'green' | 'pink';
  users: { id: number; imageUrl: string }[];
}

export interface ActivityBlockProps {
  activities: ActivityCardProps[];
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ activities }) => {
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

export default ActivityBlock;