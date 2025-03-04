import { useState } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useVisits } from '../hooks/useVisits';
import { Link, useLocation } from 'wouter';
import { formatDate } from '@/lib/utils';
import { 
  ChevronDown, 
  Plus, 
  Search, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  ClipboardCheck, 
  Filter, 
  Map,
  MoreVertical,
  Edit,
  Eye,
  Trash,
  Clipboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ClientesPage() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { visits: clientes, isLoading } = useVisits();
  const [, setLocation] = useLocation();

  // Filtrar clientes com base na pesquisa
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = 
      cliente.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'todos' || 
      (activeTab === 'pendentes' && ['scheduled', 'pending'].includes(cliente.status)) ||
      (activeTab === 'concluidos' && cliente.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <Link href="/clientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </Link>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Pesquisar por nome ou endereço..."
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
                <DropdownMenuItem>Todos os Clientes</DropdownMenuItem>
                <DropdownMenuItem>Clientes com Inspeções Pendentes</DropdownMenuItem>
                <DropdownMenuItem>Clientes sem Inspeção</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ordenar por Nome</DropdownMenuItem>
                <DropdownMenuItem>Ordenar por Data de Cadastro</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de clientes */}
        {isLoading ? (
          <div className="text-center py-10">
            <p>Carregando clientes...</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 md:p-6 grid gap-2 md:grid-cols-[2fr,1fr,auto]">
                    {/* Detalhes do cliente */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{cliente.clientName}</h3>
                        <Badge variant="outline" className={
                          cliente.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          cliente.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }>
                          {cliente.status === 'completed' ? 'Concluído' : 
                           cliente.status === 'in-progress' ? 'Em andamento' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{cliente.address}</span>
                        </div>
                        {cliente.contactInfo && (
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            <span>{cliente.contactInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Agendamento */}
                    <div className="flex flex-col justify-center">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Cadastrado em: {formatDate(new Date(cliente.createdAt), 'dd/MM/yyyy')}</span>
                        </div>
                        {cliente.date && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Visita: {formatDate(new Date(cliente.date), 'dd/MM/yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex md:flex-col gap-2 justify-end items-end">
                      <Button 
                        onClick={() => setLocation(`/inspecoes/novo?clienteId=${cliente.id}`)} 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                      >
                        <ClipboardCheck size={16} /> Nova Inspeção
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/clientes/${cliente.id}`)}>
                            <Eye size={16} className="mr-2" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation(`/clientes/editar/${cliente.id}`)}>
                            <Edit size={16} className="mr-2" /> Editar cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation(`/rotas?clienteId=${cliente.id}`)}>
                            <Map size={16} className="mr-2" /> Ver no mapa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash size={16} className="mr-2" /> Excluir cliente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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