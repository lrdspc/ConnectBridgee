import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Corrigir o problema de ícones no Leaflet no React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Importar as funções de navegação
import { gerarLinkGoogleMaps, gerarLinkWaze } from '../../lib/geocoding';

// Componentes UI
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
      }
    }).addTo(map);
    
    // Limpar ao desmontar
    return () => {
      // @ts-ignore
      map.removeControl(routingControl);
    };
  }, [map, startCoordinate, endCoordinate]);
  
  return null;
};

// Componente para atualizar o centro do mapa
const MapUpdater = ({ center }: { center: Coordinate }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [map, center]);
  
  return null;
};

// Componente principal do mapa (versão simplificada para evitar piscadas)
const SimpleRouteMap = ({ 
  startCoordinate, 
  endCoordinate, 
  visits = [],
  currentLocation,
  showRoutingMachine = false,
  className = ''
}: RouteMapProps) => {
  // Estado para armazenar o centro do mapa
  const [center, setCenter] = useState<Coordinate>({ lat: -29.7604, lng: -51.1480 }); // São Leopoldo como padrão
  
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
  
  // Estilo para o container externo do mapa - evitando reflow
  const containerStyle = useMemo(() => {
    // Definindo tamanho fixo mas responsivo
    const mapSize = Math.min(window.innerHeight - 150, 450);
    
    return {
      height: `${mapSize}px`,
      maxHeight: `${mapSize}px`, // Altura fixa para evitar reflow
      width: '100%',
      maxWidth: `${mapSize}px`, // Manter proporção quadrada
      margin: '0 auto',
      marginBottom: '20px',
      position: 'relative' as const,
      zIndex: 0
    };
  }, []);
  
  return (
    <div className={`route-map-container ${className}`} style={containerStyle}>
      {/* Barra de informações acima do mapa */}
      {currentLocation && visits && visits.length > 0 && (
        <Card className="mb-2 bg-blue-50 border-blue-200">
          <div className="p-2 flex flex-row justify-between items-center">
            <div className="text-xs text-blue-800">
              <span className="font-medium">Dica:</span> Clique nos marcadores
            </div>
            
            {/* Botão para Google Maps */}
            <a 
              href={gerarLinkGoogleMaps(
                visits.length > 0 ? visits[0].coordinates : currentLocation,
                currentLocation
              )} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" /> Google Maps
              </Button>
            </a>
          </div>
        </Card>
      )}
      
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        <MapUpdater center={center} />
        
        {/* Marcador de localização atual */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]}
            icon={iconCache.currentLocation}
          >
            <Popup>
              <div className="text-center">
                <div className="font-medium">Sua localização</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcadores para as visitas */}
        {visits.map((visit) => {
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
                  
                  <div className="flex flex-col gap-2 mt-3">
                    <a 
                      href={googleMapsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Google Maps
                    </a>
                    
                    <a 
                      href={wazeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white py-2 px-3 rounded"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Waze
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
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

export default SimpleRouteMap;