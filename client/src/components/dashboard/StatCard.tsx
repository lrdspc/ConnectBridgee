import React from "react";
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface StatCardProps {
  count: number;
  label: string;
  type: "inProgress" | "scheduled" | "pending" | "completed";
}

const StatCard: React.FC<StatCardProps> = ({ count, label, type }) => {
  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case "inProgress":
        return <Clock className="text-5xl text-primary absolute right-2 bottom-2 opacity-10" />;
      case "scheduled":
        return <Calendar className="text-5xl text-secondary absolute right-2 bottom-2 opacity-10" />;
      case "pending":
        return <AlertCircle className="text-5xl text-warning absolute right-2 bottom-2 opacity-10" />;
      case "completed":
        return <CheckCircle className="text-5xl text-success absolute right-2 bottom-2 opacity-10" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-neutral-800">{count}</h3>
        <p className="text-sm text-neutral-600">{label}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-16">
        {getIcon()}
      </div>
    </div>
  );
};

export default StatCard;
