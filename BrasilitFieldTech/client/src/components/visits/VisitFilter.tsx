import React from "react";
import { VisitStatus } from "../../lib/db";
import { CalendarClock, Clock, CheckCircle2, Calendar } from "lucide-react";

interface VisitFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const VisitFilter: React.FC<VisitFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "Todas", icon: <Calendar className="h-4 w-4 mr-1" /> },
    { id: "scheduled", label: "Agendadas", icon: <CalendarClock className="h-4 w-4 mr-1" /> },
    { id: "in-progress", label: "Em Andamento", icon: <Clock className="h-4 w-4 mr-1" /> },
    { id: "completed", label: "Concluídas", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> }
  ];

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="flex items-center overflow-x-auto px-1 py-1 hide-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`py-2 px-2.5 text-xs sm:text-sm font-medium mx-1 whitespace-nowrap flex items-center transition-all duration-200 border-b-2
              ${activeFilter === filter.id 
                ? "text-primary border-primary" 
                : "text-gray-600 border-transparent hover:text-primary/70 hover:border-gray-200"}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.icon}
            <span className="truncate">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisitFilter;
