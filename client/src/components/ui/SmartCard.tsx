import React, { ReactNode } from 'react';

interface SmartCardProps {
  children: ReactNode;
  className?: string;
  color?: 'white' | 'purple' | 'yellow' | 'orange' | 'teal';
  onClick?: () => void;
}

export const SmartCard: React.FC<SmartCardProps> = ({
  children,
  className = '',
  color = 'white',
  onClick
}) => {
  return (
    <div
      className={`device-card ${color} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface SmartCardHeaderProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const SmartCardHeader: React.FC<SmartCardHeaderProps> = ({
  title,
  icon,
  action
}) => {
  return (
    <div className="device-card-header">
      <div className="device-card-title">
        {icon && <span className="device-card-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      {action && <div className="device-card-action">{action}</div>}
    </div>
  );
};

interface SmartCardContentProps {
  children: ReactNode;
  className?: string;
}

export const SmartCardContent: React.FC<SmartCardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`device-card-content ${className}`}>
      {children}
    </div>
  );
};

interface SmartCardFooterProps {
  children: ReactNode;
  className?: string;
}

export const SmartCardFooter: React.FC<SmartCardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`device-card-footer ${className}`}>
      {children}
    </div>
  );
};