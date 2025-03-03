import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, List, Plus, Home, BarChart2, Search, HelpCircle, User } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactNode;
}

interface OnboardingTutorialProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  onComplete,
  forceShow = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    try {
      const value = localStorage.getItem('has-seen-tutorial');
      return value ? JSON.parse(value) : false;
    } catch (e) {
      return false;
    }
  });

  // Obter a localização atual para saber em que página o usuário está
  const [location, setLocation] = useState(window.location.pathname);

  // Atualizar a localização quando ela mudar
  useEffect(() => {
    const updateLocation = () => {
      setLocation(window.location.pathname);
    };
    
    window.addEventListener('popstate', updateLocation);
    
    return () => {
      window.removeEventListener('popstate', updateLocation);
    };
  }, []);

  // Define os passos do tutorial com base na localização atual
  const getStepsForLocation = () => {
    // Passos comuns para todas as páginas
    const commonSteps = [
      {
        title: "Bem-vindo ao Brasilit Visit!",
        description: "Vamos te mostrar como usar nosso aplicativo para gerenciar visitas técnicas com eficiência.",
        icon: <Home className="h-10 w-10 text-primary" />
      },
      {
        title: "Navegação Simplificada",
        description: "Use a barra inferior para navegar entre páginas. Você pode visitar o painel, visitas, relatórios e perfil.",
        targetElement: "nav",
        position: "top",
        icon: <List className="h-10 w-10 text-blue-500" />
      },
      {
        title: "Adicione Novas Visitas",
        description: "Clique no botão '+' na barra de navegação para adicionar uma nova visita técnica.",
        targetElement: "[data-tutorial='add-button']",
        position: "top",
        icon: <Plus className="h-10 w-10 text-green-500" />
      }
    ];

    // Páginas específicas
    if (location === '/visits' || location === '/') {
      return [
        ...commonSteps,
        {
          title: "Lista de Visitas",
          description: "Aqui você encontra todas as suas visitas organizadas. Filtre por status usando as abas superiores.",
          targetElement: "#taskList",
          position: "top",
          icon: <List className="h-10 w-10 text-blue-500" />
        },
        {
          title: "Busca Rápida",
          description: "Use a barra de busca para encontrar rapidamente visitas por nome do cliente ou endereço.",
          targetElement: "input[placeholder='Buscar visitas...']",
          position: "bottom",
          icon: <Search className="h-10 w-10 text-orange-500" />
        },
        {
          title: "Acompanhe Seu Dia",
          description: "O widget motivacional se adapta conforme o período do dia para te ajudar a manter o foco.",
          targetElement: "[data-tutorial='motivation-widget']",
          position: "bottom",
          icon: <BarChart2 className="h-10 w-10 text-purple-500" />
        }
      ];
    } else if (location.includes('/profile')) {
      return [
        ...commonSteps,
        {
          title: "Seu Perfil",
          description: "Gerencie suas informações pessoais e configurações da aplicação nesta página.",
          targetElement: "#profile",
          position: "top",
          icon: <User className="h-10 w-10 text-purple-500" />
        },
        {
          title: "Ajuda e Suporte",
          description: "Você pode redefinir o tutorial ou voltar a vê-lo a qualquer momento nesta página.",
          targetElement: "button:contains('Redefinir Tutorial')",
          position: "bottom",
          icon: <HelpCircle className="h-10 w-10 text-orange-500" />
        }
      ];
    } else {
      // Para outras páginas, mostrar apenas os passos comuns
      return commonSteps;
    }
  };

  const tutorialSteps = getStepsForLocation();

  useEffect(() => {
    if (forceShow || !hasSeenTutorial) {
      // Aguarde um pouco para que os elementos da interface sejam renderizados
      const timer = setTimeout(() => {
        setIsVisible(true);
        updateHighlightPosition();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [forceShow, hasSeenTutorial]);

  useEffect(() => {
    if (isVisible) {
      updateHighlightPosition();
    }
  }, [currentStep, isVisible]);

  const updateHighlightPosition = () => {
    const step = tutorialSteps[currentStep];
    if (step.targetElement) {
      try {
        // Primeiro tenta usar o seletor exato
        let element = document.querySelector(step.targetElement);
        
        // Se não encontrar, tenta encontrar por conteúdo de texto para botões
        if (!element && step.targetElement.includes(':contains')) {
          const searchText = step.targetElement.match(/:contains\('(.+?)'\)/)?.[1];
          if (searchText) {
            const allButtons = Array.from(document.querySelectorAll('button'));
            element = allButtons.find(btn => btn.textContent?.includes(searchText)) || null;
          }
        }
        
        // Mecanismo de fallback para encontrar elementos importantes
        if (!element) {
          if (step.targetElement.includes('motivation-widget')) {
            element = document.querySelector('[data-tutorial="motivation-widget"]') || 
                     document.querySelector('[class*="bg-gradient-to-r"]');
          } else if (step.targetElement.includes('search-bar')) {
            element = document.querySelector('[data-tutorial="search-bar"]') || 
                     document.querySelector('input[type="text"]');
          } else if (step.targetElement.includes('add-button')) {
            element = document.querySelector('[data-tutorial="add-button"]') || 
                     document.querySelector('.bg-primary.rounded-full');
          } else if (step.targetElement === 'nav') {
            element = document.querySelector('nav');
          } else if (step.targetElement.includes('visit-list')) {
            element = document.querySelector('[data-tutorial="visit-list"]');
          }
        }
        
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        } else {
          console.warn(`Element not found for selector: ${step.targetElement}`);
          // Fallback para posição central quando o elemento não é encontrado
          setHighlightPosition({
            top: window.innerHeight / 2 - 100,
            left: window.innerWidth / 2 - 150,
            width: 300,
            height: 200
          });
        }
      } catch (error) {
        console.error("Error finding element:", error);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('has-seen-tutorial', JSON.stringify(true));
    setHasSeenTutorial(true);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('has-seen-tutorial', JSON.stringify(true));
    setHasSeenTutorial(true);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];
  const hasTargetElement = !!currentTutorialStep.targetElement;

  // Determine a posição do tooltip com base na posição do elemento alvo
  let tooltipStyle: React.CSSProperties = {};
  
  if (hasTargetElement) {
    const margin = 16; // Espaço entre o elemento e o tooltip
    
    switch (currentTutorialStep.position) {
      case 'top':
        tooltipStyle = {
          top: highlightPosition.top - margin - 150,
          left: highlightPosition.left + (highlightPosition.width / 2) - 150,
        };
        break;
      case 'bottom':
        tooltipStyle = {
          top: highlightPosition.top + highlightPosition.height + margin,
          left: highlightPosition.left + (highlightPosition.width / 2) - 150,
        };
        break;
      case 'left':
        tooltipStyle = {
          top: highlightPosition.top + (highlightPosition.height / 2) - 75,
          left: highlightPosition.left - margin - 300,
        };
        break;
      case 'right':
        tooltipStyle = {
          top: highlightPosition.top + (highlightPosition.height / 2) - 75,
          left: highlightPosition.left + highlightPosition.width + margin,
        };
        break;
      default:
        tooltipStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  } else {
    // Centraliza o tooltip na tela quando não há elemento alvo
    tooltipStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay semi-transparente */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleSkip}
      />
      
      {/* Highlight para o elemento alvo */}
      {hasTargetElement && (
        <div 
          className="absolute border-2 border-primary rounded-lg z-10 animate-pulse"
          style={{
            top: highlightPosition.top - 4,
            left: highlightPosition.left - 4,
            width: highlightPosition.width + 8,
            height: highlightPosition.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
          }}
        />
      )}
      
      {/* Tooltip de instrução */}
      <div 
        className="absolute z-20 w-[300px] bg-white rounded-lg shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={tooltipStyle}
      >
        <button 
          onClick={handleSkip}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col items-center mb-4">
          {currentTutorialStep.icon}
          <h3 className="text-lg font-bold mt-2 text-center">{currentTutorialStep.title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 text-center mb-6">{currentTutorialStep.description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 w-6 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="text-xs"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={handleNext}
              className="text-xs"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Próximo' : 'Concluir'}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;