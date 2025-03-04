import { FileText, Camera, CheckSquare, ChevronRight, MapPin, Calendar, Clock } from "lucide-react";
import { VisitStatus, Visit, VisitType } from "../../lib/db";
import { formatDate, formatTime } from "../../lib/utils";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface VisitCardProps {
  visit: Visit;
}

const getStatusColor = (status: VisitStatus) => {
  switch (status) {
    case "scheduled":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in-progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "completed":
      return "bg-primary/10 text-primary border-primary/20";
    case "urgent":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
};

const getStatusText = (status: VisitStatus) => {
  switch (status) {
    case "scheduled":
      return "Agendada";
    case "in-progress":
      return "Em Andamento";
    case "pending":
      return "Pendente";
    case "completed":
      return "Concluída";
    case "urgent":
      return "Urgente";
    default:
      return "Desconhecido";
  }
};

const getVisitTypeLabel = (type: VisitType) => {
  switch (type) {
    case "installation":
      return "Instalação";
    case "maintenance":
      return "Manutenção";
    case "inspection":
      return "Inspeção";
    case "repair":
      return "Reparo";
    case "emergency":
      return "Emergência";
    default:
      return type;
  }
};

const VisitCard = ({ visit }: VisitCardProps) => {
  const statusColorClass = getStatusColor(visit.status);
  const statusText = getStatusText(visit.status);
  const formattedDate = formatDate(new Date(visit.date), "dd/MM/yyyy");
  const timeFormatted = visit.time ? formatTime(visit.time) : "";
  const checklistCompleted = visit.checklist ? 
    visit.checklist.filter(item => item.completed).length : 0;
  const checklistTotal = visit.checklist ? visit.checklist.length : 0;
  const visitTypeLabel = getVisitTypeLabel(visit.type);

  return (
    <Link href={`/visits/${visit.id}`}>
      <a className="block bg-white rounded-xl p-4 shadow-sm hover:shadow transition-all duration-200 border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-800 text-base mb-1">{visit.clientName}</h3>
            <div className="flex items-center text-sm text-neutral-500 mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <p className="truncate">{visit.address}</p>
            </div>
          </div>
          <div className="flex flex-col items-end ml-2">
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full border",
              statusColorClass
            )}>
              {statusText}
            </span>
          </div>
        </div>
        
        <div className="flex items-center mb-3 text-sm">
          <div className="flex items-center text-neutral-600 mr-4">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>{formattedDate}</span>
          </div>
          {timeFormatted && (
            <div className="flex items-center text-neutral-600">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>{timeFormatted}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-neutral-500">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              <span>{visit.documents?.length || 0}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <Camera className="h-3.5 w-3.5 mr-1.5" />
              <span>{visit.photos?.length || 0}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
              <span>{checklistCompleted}/{checklistTotal}</span>
            </div>
          </div>
          
          <div className="flex items-center text-primary text-sm font-medium">
            <span className="mr-1">Detalhes</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {visitTypeLabel}
          </span>
          {visit.priority === "high" && (
            <span className="ml-2 inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
              Prioridade Alta
            </span>
          )}
          {visit.priority === "urgent" && (
            <span className="ml-2 inline-block px-2.5 py-1 bg-rose-50 text-rose-700 text-xs rounded-full">
              Urgente
            </span>
          )}
        </div>
      </a>
    </Link>
  );
};

export default VisitCard;
