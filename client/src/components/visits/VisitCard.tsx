import React from 'react';
import { useLocation } from 'wouter';
import { Calendar, Clock, MapPin, Phone, FileText, AlertTriangle } from 'lucide-react';
import { SmartCard, SmartCardContent, SmartCardHeader, SmartCardFooter } from '../ui/SmartCard';
import SmartButton from '../ui/SmartButton';
import { Visit, VisitStatus, VisitType, VisitPriority } from '../../lib/db';

interface VisitCardProps {
  visit: Visit;
  showActions?: boolean;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, showActions = true }) => {
  const [, setLocation] = useLocation();
  
  const getStatusColor = (status: VisitStatus): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-color text-white';
      case 'in-progress':
        return 'bg-primary-color text-white';
      case 'urgent':
        return 'bg-red-color text-white';
      case 'scheduled':
        return 'bg-yellow-color text-white';
      case 'pending':
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };
  
  const getStatusText = (status: VisitStatus): string => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in-progress':
        return 'Em Andamento';
      case 'urgent':
        return 'Urgente';
      case 'scheduled':
        return 'Agendada';
      case 'pending':
      default:
        return 'Pendente';
    }
  };
  
  const getTypeIcon = (type: VisitType) => {
    switch (type) {
      case 'installation':
        return <FileText size={18} />;
      case 'maintenance':
        return <AlertTriangle size={18} />;
      case 'inspection':
        return <FileText size={18} />;
      case 'repair':
        return <AlertTriangle size={18} />;
      case 'emergency':
        return <AlertTriangle size={18} />;
      default:
        return <FileText size={18} />;
    }
  };
  
  const getTypeText = (type: VisitType): string => {
    switch (type) {
      case 'installation':
        return 'Instalação';
      case 'maintenance':
        return 'Manutenção';
      case 'inspection':
        return 'Inspeção';
      case 'repair':
        return 'Reparo';
      case 'emergency':
        return 'Emergência';
      default:
        return 'Visita';
    }
  };
  
  const getPriorityClass = (priority: VisitPriority): string => {
    switch (priority) {
      case 'urgent':
        return 'text-red-color';
      case 'high':
        return 'text-orange-color';
      case 'normal':
      default:
        return 'text-text-light';
    }
  };
  
  const handleViewDetails = () => {
    setLocation(`/visitas/${visit.id}`);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <SmartCard className="visit-card">
      <SmartCardHeader
        title={visit.clientName}
        icon={getTypeIcon(visit.type)}
        action={
          <span className={`status-badge ${getStatusColor(visit.status)}`}>
            {getStatusText(visit.status)}
          </span>
        }
      />
      
      <SmartCardContent>
        <div className="visit-info">
          <div className="visit-info-item">
            <Calendar size={16} />
            <span>{formatDate(visit.date)}</span>
          </div>
          
          {visit.time && (
            <div className="visit-info-item">
              <Clock size={16} />
              <span>{visit.time}</span>
            </div>
          )}
          
          <div className="visit-info-item">
            <MapPin size={16} />
            <span>{visit.address}</span>
          </div>
          
          {visit.contactInfo && (
            <div className="visit-info-item">
              <Phone size={16} />
              <span>{visit.contactInfo}</span>
            </div>
          )}
        </div>
        
        <div className="visit-description">
          <p className={`visit-type ${getPriorityClass(visit.priority)}`}>
            {getTypeText(visit.type)}
          </p>
          {visit.description && <p className="visit-notes">{visit.description}</p>}
        </div>
      </SmartCardContent>
      
      {showActions && (
        <SmartCardFooter>
          <div className="visit-actions">
            <SmartButton
              variant="outlined"
              color="primary"
              size="sm"
              onClick={handleViewDetails}
            >
              Ver Detalhes
            </SmartButton>
          </div>
        </SmartCardFooter>
      )}
    </SmartCard>
  );
};

export default VisitCard;