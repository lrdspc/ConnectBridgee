import { useState, useEffect, useRef } from "react";
import VisitFilter from "../components/visits/VisitFilter";
import VisitCard from "../components/visits/VisitCard";
import { useVisits } from "../hooks/useVisits";
import { useAuth } from "../hooks/useAuth";
import { Search, Plus, ArrowRight } from "lucide-react";
import { Visit } from "../lib/db";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LoadingAnimation, SkeletonCard, PageTransition } from "@/components/ui/loading-animation";
import { DashboardLayoutNew } from "../layouts/DashboardLayoutNew";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


// Estilos específicos para ocultar a barra de rolagem em diferentes navegadores
const hideScrollbarStyles = `
  /* Oculta a barra de rolagem no Chrome, Safari e Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Oculta a barra de rolagem no IE, Edge e Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE e Edge */
    scrollbar-width: none;     /* Firefox */
  }

  /* Animações para transição de página */
  @keyframes slideAndFade {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-fade {
    animation: slideAndFade 0.3s ease-out forwards;
  }

  .staggered-item {
    opacity: 0;
  }

  .staggered-item.animate {
    animation: slideAndFade 0.3s ease-out forwards;
  }
`;



const VisitListPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { visits, isLoading } = useVisits(activeFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const { user } = useAuth();
  const visitRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Adiciona os estilos ao documento quando o componente é montado
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = hideScrollbarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Controla a animação das visitas ao entrar em vista
  useEffect(() => {
    if (!isLoading && filteredVisits.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      visitRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        visitRefs.current.forEach((ref) => {
          if (ref) observer.disconnect();
        });
      };
    }
  }, [isLoading, filteredVisits]);



  useEffect(() => {
    if (visits) {
      const filtered = visits.filter(visit => 
        visit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVisits(filtered);
      
      // Reseta o array de referências quando a lista muda
      visitRefs.current = filtered.map(() => null);
    }
  }, [visits, searchTerm]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };





  // Determinar visitas recentes (últimas 3 visitas realizadas)
  const recentVisits = visits?.filter(v => v.status === "completed")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3) || [];





  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Lista de Visitas</h1>
        </div>


        {/* Recent Visits Carousel */}
        {recentVisits.length > 0 && (
          <div className="mb-4 px-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-neutral-700">Visitas Recentes</h3>
              <Link href="/visits/completed">
                <a className="text-xs text-primary flex items-center">
                  Ver todas <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Link>
            </div>
            <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
              {recentVisits.map(visit => (
                <Link key={visit.id} href={`/visits/${visit.id}`}>
                  <a className="flex-shrink-0 w-56 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <p className="font-medium text-sm text-neutral-800 truncate">{visit.clientName}</p>
                    <p className="text-xs text-neutral-500 truncate">{visit.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-primary">Concluída</span>
                      <span className="text-xs text-neutral-400">{new Date(visit.completedAt || "").toLocaleDateString()}</span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search bar with gradient background */}
        <div className="relative px-4 pt-2 pb-6 bg-gradient-to-b from-gray-100 to-white shadow-sm">
          <div className="relative" data-tutorial="search-bar">
            <input 
              type="text" 
              placeholder="Buscar visitas..." 
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-200 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute right-3 top-2.5 text-neutral-400 h-5 w-5" />
          </div>
        </div>

        {/* Filter tabs */}
        <VisitFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Visits list */}
        <div className="flex-1 p-4 space-y-3" data-tutorial="visit-list">
          {isLoading ? (
            <>
              <LoadingAnimation 
                variant="calendar" 
                text="Carregando suas visitas..."
                className="mb-4" 
              />
              {Array(3).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </>
          ) : filteredVisits.length > 0 ? (
            filteredVisits.map((visit, index) => (
              <div 
                key={visit.id} 
                ref={el => visitRefs.current[index] = el}
                className="staggered-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <VisitCard visit={visit} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <p className="text-neutral-600 mb-4">
                {searchTerm ? 'Nenhuma visita encontrada com esses termos' : 'Nenhuma visita disponível'}
              </p>
              <Link href="/vistoria-far">
                <a>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Nova Vistoria
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>


      </DashboardLayoutNew>
    </PageTransition>
  );
};

export default VisitListPage;
