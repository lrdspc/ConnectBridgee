import { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { OfflineIndicator } from "../components/layout/OfflineIndicator";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { FloatingActionButton } from "../components/layout/FloatingActionButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <OfflineIndicator />
      <Navbar />
      
      <main className="flex-1 px-4 py-6 md:py-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      <BottomNavigation />
      <FloatingActionButton />
      <Footer />
    </div>
  );
}