import { useState } from 'react';
import { DashboardLayoutNew } from '../../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useLocation } from 'wouter';
import { formatDate } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Plus, 
  CalendarRange, 
  Building,
  MapPin,
  FileText,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Dados de exemplo para inspeções
const mockInspecoes = [
  {
    id: 'insp-1',
    clienteId: 'client-1',
    cliente: 'Construtora Horizonte LTDA',
    endereco: 'Av. Paulista, 1578, São Paulo, SP',
    dataInspecao: '2025-02-15',
    tipoTelhado: 'fibrocimento',
    inclinacao: 'media',
    areaAproximada: '650',
    problemasIdentificados: 7,
    status: 'concluida',
    criadoEm: '2025-02-10T14:30:00Z',
    atualizadoEm: '2025-02-15T14:30:00Z',
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  },
  {
    id: 'insp-2',
    clienteId: 'client-2',
    cliente: 'Condomínio Parque das Flores',
    endereco: 'Rua das Hortênsias, 250, Bloco B, São Paulo, SP',
    dataInspecao: '2025-02-20',
    tipoTelhado: 'ceramica',
    inclinacao: 'alta',
    areaAproximada: '320',
    problemasIdentificados: 3,
    status: 'pendente',
    criadoEm: '2025-02-18T09:15:00Z',
    atualizadoEm: '2025-02-18T09:15:00Z',
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  },
  {
    id: 'insp-3',
    clienteId: 'client-3',
    cliente: 'Residencial Parque Sul',
    endereco: 'Av. das Nações Unidas, 1200, São Paulo, SP',
    dataInspecao: '2025-02-22',
    tipoTelhado: 'fibrocimento',
    inclinacao: 'baixa',
    areaAproximada: '890',
    problemasIdentificados: 5,
    status: 'em_andamento',
    criadoEm: '2025-02-22T10:15:00Z',
    atualizadoEm: '2025-02-22T10:15:00Z',
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  }
];

export default function InspecoesPage() {
  const [activeTab, setActiveTab] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  // Filtrar inspeções
  const filteredInspecoes = mockInspecoes.filter(inspecao => {
    const matchesSearch = 
      inspecao.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspecao.endereco.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'todas' || 
      (activeTab === 'concluidas' && inspecao.status === 'concluida') ||
      (activeTab === 'em_andamento' && inspecao.status === 'em_andamento') ||
      (activeTab === 'pendentes' && inspecao.status === 'pendente');
    
    return matchesSearch && matchesTab;
  });

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'em_andamento':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pendente':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Função para obter o texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'em_andamento':
        return 'Em Andamento';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  // Função para obter ícone de tipo de telhado
  const getTelhadoIcon = (tipo: string) => {
    switch (tipo) {
      case 'fibrocimento':
        return <Layers size={14} className="mr-1" />;
      case 'ceramica':
        return <Layers size={14} className="mr-1" />;
      case 'metalico':
        return <Layers size={14} className="mr-1" />;
      default:
        return <Layers size={14} className="mr-1" />;
    }
  };

  // Função para obter nome do tipo de telhado
  const getTelhadoName = (tipo: string) => {
    switch (tipo) {
      case 'fibrocimento':
        return 'Fibrocimento';
      case 'ceramica':
        return 'Cerâmica';
      case 'metalico':
        return 'Metálico';
      case 'concreto':
        return 'Concreto';
      default:
        return 'Outro';
    }
  };

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Inspeções</h1>
          <Button onClick={() => setLocation('/inspecoes/novo')}>
            <Plus className="mr-2 h-4 w-4" /> Nova Inspeção
          </Button>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Pesquisar inspeções por cliente ou endereço..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter size={16} /> Filtrar <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <CalendarRange size={16} className="mr-2" /> Últimos 30 dias
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Building size={16} className="mr-2" /> Por Cliente
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Layers size={16} className="mr-2" /> Por Tipo de Telhado
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <AlertTriangle size={16} className="mr-2" /> Com mais problemas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todas" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de inspeções */}
        {filteredInspecoes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <p className="text-muted-foreground">Nenhuma inspeção encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredInspecoes.map((inspecao) => (
              <Card 
                key={inspecao.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLocation(`/inspecoes/${inspecao.id}`)}
              >
                <CardContent className="p-0">
                  <div className="p-4 md:p-6 grid gap-4 md:grid-cols-[2fr_1fr_auto]">
                    {/* Informações da inspeção */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Inspeção: {inspecao.cliente}</h3>
                        <Badge variant="outline" className={getStatusColor(inspecao.status)}>
                          {getStatusText(inspecao.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          <Building size={14} />
                          <span>Cliente: {inspecao.cliente}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{inspecao.endereco}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarRange size={14} />
                          <span>Data da Inspeção: {formatDate(new Date(inspecao.dataInspecao), 'dd/MM/yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informações técnicas */}
                    <div className="text-sm">
                      <div className="mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center w-fit">
                          {getTelhadoIcon(inspecao.tipoTelhado)}
                          {getTelhadoName(inspecao.tipoTelhado)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Inclinação: {inspecao.inclinacao === 'baixa' ? 'Baixa' : inspecao.inclinacao === 'media' ? 'Média' : 'Alta'}</div>
                        <div>Área: {inspecao.areaAproximada} m²</div>
                        <div className="flex items-center gap-1 font-medium text-amber-700">
                          <AlertTriangle size={14} />
                          <span>{inspecao.problemasIdentificados} problemas identificados</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex items-end flex-col justify-between h-full">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{inspecao.tecnico.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium">{inspecao.tecnico.nome}</p>
                          <p className="text-muted-foreground">{formatDate(new Date(inspecao.atualizadoEm), 'dd/MM HH:mm')}</p>
                        </div>
                      </div>
                      <div>
                        {inspecao.status === 'concluida' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/relatorios?inspecaoId=${inspecao.id}`);
                            }}
                          >
                            <FileText size={14} className="mr-1" /> Ver Relatório
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayoutNew>
    </PageTransition>
  );
}