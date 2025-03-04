import React from "react";
import { Loader2, Wrench, CheckCircle2, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  variant?: "default" | "success" | "tool" | "calendar";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingAnimation({
  variant = "default",
  size = "md",
  text,
  className
}: LoadingAnimationProps) {
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const iconSize = sizeClasses[size];
  
  const renderIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className={cn("text-emerald-500 animate-bounce", iconSize)} />;
      case "tool":
        return <Wrench className={cn("text-primary animate-pulse", iconSize)} />;
      case "calendar":
        return (
          <div className="flex space-x-1 animate-pulse">
            <Calendar className={cn("text-primary", iconSize)} />
            <Clock className={cn("text-blue-500", iconSize)} />
          </div>
        );
      default:
        return (
          <Loader2 className={cn("text-primary animate-spin", iconSize)} />
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      {renderIcon()}
      {text && (
        <p className="mt-2 text-sm text-neutral-600">{text}</p>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="h-5 bg-neutral-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-56"></div>
        </div>
        <div className="flex flex-col items-end">
          <div className="h-4 bg-neutral-200 rounded w-20 mb-1"></div>
          <div className="h-4 bg-neutral-200 rounded w-16"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-neutral-200 rounded w-32"></div>
        <div className="h-4 bg-neutral-200 rounded w-20"></div>
      </div>
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {children}
    </div>
  );
}