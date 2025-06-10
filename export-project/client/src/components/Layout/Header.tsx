import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Settings, ArrowLeft, Navigation2, User } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { SettingsMenu } from "./SettingsMenu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showWorkInfo?: boolean;
  address?: string;
  onMapOpen?: () => void;
}

const Header = ({ 
  title, 
  showBackButton = false, 
  showWorkInfo = false,
  address,
  onMapOpen
}: HeaderProps) => {
  const [, setLocation] = useLocation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { user } = useAuth();
  const [isOnDashboard] = useRoute("/");

  // Get current date in Portuguese format
  const currentDate = formatDate(new Date());
  const workingHours = "6h 45m"; // This would normally come from a state/prop
  const visitsCompleted = 4; // This would normally come from a state/prop

  const handleBack = () => {
    // If there's history, go back, otherwise go to a default page
    if (window.history.length > 2) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  // Verificar se está no desktop ou no mobile
  const isMobile = useIsMobile();
  
  // Obter as configurações do usuário do localStorage
  const [username, setUsername] = useState("Técnico");
  
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.username) {
          setUsername(settings.username);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  }, []);
  
  return (
    <header className="bg-primary p-4 text-white rounded-b-xl shadow-lg">
      {isOnDashboard ? (
        // Dashboard header
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=3984D6&color=fff`}
                alt="Foto do técnico" 
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="ml-3">
                <h2 className="font-semibold">{username}</h2>
                <p className="text-sm opacity-90">{user?.role || "Técnico de Campo"}</p>
              </div>
            </div>
            <div className="flex items-center">
              {!isMobile && (
                <span className="text-sm opacity-80 mr-3">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
              <SettingsMenu className="text-white" />
            </div>
          </div>
          
          {showWorkInfo && (
            <div className="mt-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="flex items-center text-sm">
                  <span className="mr-2">📅</span>
                  <span>{currentDate}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span className="font-medium">{workingHours}</span>
                    <span className="text-xs ml-2">hoje</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🏢</span>
                    <span className="font-medium">{visitsCompleted}</span>
                    <span className="text-xs ml-2">visitas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Other pages header
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {showBackButton && (
                <button className="mr-3" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-xl font-bold">{title || "Brasilit Técnico"}</h1>
            </div>
            
            {/* Adicionar SettingsMenu também nas outras páginas */}
            <SettingsMenu className="text-white" />
          </div>
          
          {address && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span className="text-sm">{address}</span>
              </div>
              {onMapOpen && (
                <button 
                  className="bg-white bg-opacity-20 rounded-full p-2"
                  onClick={onMapOpen}
                >
                  <Navigation2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          
          {/* Barra adicional para desktop - informações extras */}
          {!isMobile && (
            <div className="mt-3 pt-2 border-t border-white border-opacity-20 text-xs flex justify-between items-center">
              <div>
                {currentDate}
              </div>
              <div>
                Versão Desktop
              </div>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
