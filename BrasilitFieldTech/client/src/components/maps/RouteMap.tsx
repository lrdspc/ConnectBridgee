import { useEffect, useState, useRef, useMemo, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Corrigir o problema de ícones no Leaflet no React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Importar as funções de navegação
import { gerarLinkGoogleMaps, gerarLinkWaze } from '../../lib/geocoding';
import { MapProvider as MapProviderType, getProviderInfo } from '../../lib/map-providers';

// Componentes UI
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink, Map } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Importar CSS para estabilizar o mapa
import '../../styles/map.css';

// Definir tipos para as coordenadas
interface Coordinate {
  lat: number;
  lng: number;
}

interface RouteMapProps {
  startCoordinate?: Coordinate;
  endCoordinate?: Coordinate;
  visits?: {
    id: string;
    clientName: string;
    address: string;
    coordinates: Coordinate;
  }[];
  currentLocation?: Coordinate;
  showRoutingMachine?: boolean;
  className?: string;
}

// Cache de ícones para evitar recriação desnecessária
const iconCache = {
  default: L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  currentLocation: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  visit: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Configurar o ícone padrão para os marcadores
L.Marker.prototype.options.icon = iconCache.default;

// Componente para lidar com o roteamento
const RoutingMachine = ({ startCoordinate, endCoordinate }: { startCoordinate: Coordinate; endCoordinate: Coordinate }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !startCoordinate || !endCoordinate) return;
    
    // Evitar o erro de tipo para o Leaflet Routing Machine
    // @ts-ignore - O tipo para o método Routing.control não está sendo reconhecido corretamente
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startCoordinate.lat, startCoordinate.lng),
        L.latLng(endCoordinate.lat, endCoordinate.lng)
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366F1', weight: 6 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [
          { color: '#4F46E5', weight: 4, opacity: 0.6 },
          { color: '#818CF8', weight: 2, opacity: 0.5 }
        ]
      }
    }).addTo(map);
    
    // Limpar ao desmontar
    return () => {
      // @ts-ignore - O tipo para o método removeControl não está reconhecendo o routingControl
      map.removeControl(routingControl);
    };
  }, [map, startCoordinate, endCoordinate]);
  
  return null;
};

// Componente para lidar com a localização atual do usuário (otimizado)
const CurrentLocationMarker = memo(({ currentLocation }: { currentLocation?: Coordinate }) => {
  const map = useMap();
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const intervalRef = useRef<number | null>(null);
  const gpsIconRef = useRef<HTMLElement | null>(null);
  
  // Usar um timer com intervalo mais longo para evitar piscadas rápidas
  useEffect(() => {
    if (!currentLocation) return;
    
    // Centralizar o mapa na localização atual (com animação suave)
    map.flyTo([currentLocation.lat, currentLocation.lng], map.getZoom(), {
      duration: 1.5 // Duração da animação em segundos
    });
    
    // Remover círculo anterior se existir
    if (accuracyCircleRef.current) {
      map.removeLayer(accuracyCircleRef.current);
    }
    
    // Criar um círculo para mostrar a precisão da localização (sem animação de piscada)
    const accuracyCircle = L.circle([currentLocation.lat, currentLocation.lng], {
      radius: 100,
      color: '#4F46E5',
      fillColor: '#818CF8',
      fillOpacity: 0.2,
      weight: 2
    }).addTo(map);
    
    accuracyCircleRef.current = accuracyCircle;
    
    // Ícone do GPS da barra de status - busca por classes específicas
    if (!gpsIconRef.current) {
      gpsIconRef.current = document.querySelector('.status-bar .gps-icon') as HTMLElement;
    }
    
    // Limpar intervalos anteriores
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Limpeza ao desmontar
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (accuracyCircleRef.current) {
        map.removeLayer(accuracyCircleRef.current);
        accuracyCircleRef.current = null;
      }
    };
  }, [map, currentLocation]);
  
  if (!currentLocation) return null;
  
  return (
    <Marker 
      position={[currentLocation.lat, currentLocation.lng]}
      icon={iconCache.currentLocation}
    >
      <Popup>
        <div className="text-center">
          <div className="font-medium">Sua localização atual</div>
          <div className="text-xs text-gray-500 mt-1">
            {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

// Componente de marcador de visita memoizado para evitar re-renderizações desnecessárias
const VisitMarker = memo(({ visit, currentLocation }: { 
  visit: { 
    id: string; 
    clientName: string; 
    address: string; 
    coordinates: Coordinate 
  },
  currentLocation?: Coordinate
}) => {
  // Gerar links para navegação
  const googleMapsLink = currentLocation 
    ? gerarLinkGoogleMaps(visit.coordinates, currentLocation)
    : gerarLinkGoogleMaps(visit.coordinates);
  
  const wazeLink = gerarLinkWaze(visit.coordinates);
  
  return (
    <Marker 
      key={visit.id} 
      position={[visit.coordinates.lat, visit.coordinates.lng]}
      icon={iconCache.visit}
    >
      <Popup>
        <div className="w-48">
          <h3 className="font-medium text-base">{visit.clientName}</h3>
          <p className="text-sm my-1">{visit.address}</p>
          <p className="text-xs text-gray-500 mb-2">
            {visit.coordinates.lat.toFixed(5)}, {visit.coordinates.lng.toFixed(5)}
          </p>
          
          <div className="flex flex-col gap-2 mt-3">
            <a 
              href={googleMapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Google Maps
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            
            <a 
              href={wazeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white py-2 px-3 rounded"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Waze
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

// Componente para atualizar o centro do mapa
const MapUpdater = ({ center }: { center: Coordinate }) => {
  const map = useMap();
  
  // Usar uma atualização não-animada para evitar flickers
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: false
    });
  }, [map, center]);
  
  return null;
};

// Componente principal do mapa (versão otimizada)
const RouteMap = ({ 
  startCoordinate, 
  endCoordinate, 
  visits = [],
  currentLocation,
  showRoutingMachine = false,
  className = ''
}: RouteMapProps) => {
  // Valor inicial memoizado para evitar recriação a cada renderização
  const initialCenter = useMemo(() => ({ lat: -29.7604, lng: -51.1480 }), []); // São Leopoldo como padrão
  
  // Estado para armazenar o centro do mapa
  const [center, setCenter] = useState<Coordinate>(initialCenter); 
  
  // Determinar o centro do mapa usando useMemo para evitar cálculos desnecessários
  const mapCenter = useMemo(() => {
    if (currentLocation) {
      return currentLocation;
    } else if (startCoordinate) {
      return startCoordinate;
    } else if (visits.length > 0 && visits[0].coordinates) {
      return visits[0].coordinates;
    }
    // Retornar o centro padrão se nenhuma das condições for atendida
    return center;
  }, [currentLocation, startCoordinate, visits, center]);
  
  // Atualizar o estado central apenas quando o centro calculado mudar
  useEffect(() => {
    setCenter(mapCenter);
  }, [mapCenter]);
  
  // Usando ref para armazenar dimensões da janela
  const windowSizeRef = useRef({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  
  // Estado para forçar re-renderização apenas quando necessário
  const [, forceUpdate] = useState({});
  
  // Efeito para atualizar o tamanho da janela quando redimensionada com debounce
  useEffect(() => {
    let timeoutId: number | null = null;
    
    const handleResize = () => {
      // Limpar timeout anterior se existir
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      
      // Definir novo timeout para debounce (300ms)
      timeoutId = window.setTimeout(() => {
        windowSizeRef.current = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        // Forçar re-renderização apenas quando o resize terminar
        forceUpdate({});
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Limpar o event listener e timeout ao desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);
  
  // Estilo para o container externo do mapa - evitando reflow e adaptando para desktop
  const containerStyle = useMemo(() => {
    // Detectar se é desktop ou mobile
    const isDesktop = window.innerWidth >= 768;
    
    // Altura responsiva baseada no dispositivo
    const mapSize = isDesktop 
      ? Math.min(windowSizeRef.current.height - 100, 600) 
      : Math.min(windowSizeRef.current.height - 150, 450);
    
    return {
      height: isDesktop ? '100%' : `${mapSize}px`,
      maxHeight: isDesktop ? '100vh' : `${mapSize}px`,
      width: '100%',
      margin: '0 auto',
      marginBottom: isDesktop ? '0' : '70px',
      position: 'relative' as const,
      zIndex: 0,
      borderRadius: isDesktop ? '12px' : '8px',
      // Hardware acceleration para melhorar o desempenho
      transform: 'translateZ(0)',
      willChange: 'transform',
      boxShadow: isDesktop ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      overflow: 'hidden'
    };
  }, [windowSizeRef.current.width, windowSizeRef.current.height]);
  
  // Melhorar a performance evitando re-renderizações desnecessárias ao usar valor memoizado
  const mapContainerStyle = useMemo(() => ({
    height: "100%", 
    width: "100%", 
    zIndex: 0,
    // Estes estilos ajudam a estabilizar o mapa e reduzir piscadas
    isolation: 'isolate' as const,
    borderRadius: '8px',
    overflow: 'hidden'
  }), []);
  
  // Limitar a taxa de atualização da posição do GPS para evitar piscadas
  const throttledLocation = useMemo(() => {
    return currentLocation;
  }, [
    currentLocation?.lat.toFixed(5), 
    currentLocation?.lng.toFixed(5)
  ]);
  
  // Detectar se é desktop ou mobile
  const isMobileDevice = window.innerWidth < 768;
  
  return (
    <div className={`route-map-container ${className}`} style={containerStyle}>
      {/* Barra de informações acima do mapa */}
      {currentLocation && visits && visits.length > 0 && (
        <Card className="mb-2 bg-blue-50 border-blue-200">
          <div className="p-2 flex flex-row justify-between items-center">
            <div className={`${isMobileDevice ? 'mobile-condensed' : 'text-xs'} text-blue-800`}>
              <span className="font-medium">Dica:</span> Clique nos marcadores para opções
            </div>
            
            {/* Botão para ver rota completa no Google Maps */}
            <a 
              href={gerarLinkGoogleMaps(
                visits.length > 0 ? visits[0].coordinates : currentLocation,
                currentLocation
              )} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Button size="sm" variant="outline" className="h-7 text-xs desktop-button">
                <ExternalLink className="w-3 h-3 mr-1" /> {isMobileDevice ? 'Mapa' : 'Google Maps'}
              </Button>
            </a>
          </div>
        </Card>
      )}
      
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={mapContainerStyle}
        className="map-container"
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        <MapUpdater center={center} />
        
        {/* Marcador de localização atual */}
        {throttledLocation && (
          <CurrentLocationMarker currentLocation={throttledLocation} />
        )}
        
        {/* Marcadores para as visitas */}
        {visits.map((visit) => (
          <VisitMarker key={visit.id} visit={visit} currentLocation={currentLocation} />
        ))}
        
        {/* Componente de roteamento */}
        {showRoutingMachine && startCoordinate && endCoordinate && (
          <RoutingMachine 
            startCoordinate={startCoordinate} 
            endCoordinate={endCoordinate} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;