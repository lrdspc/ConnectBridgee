import React, { useState } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
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
  FileText, 
  Download, 
  Eye, 
  Mail, 
  Calendar, 
  Building,
  FileImage,
  AlertTriangle,
  MapPin,
  Printer,
  Share2,
  CheckCircle,
  ArrowUpDown,
  FileDown
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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Dados de exemplo para relatórios
const mockRelatorios = [
  {
    id: 'rel-1',
    inspecaoId: 'insp-1',
    tipo: 'telhado',
    titulo: 'Relatório de Inspeção - Construtora Horizonte',
    cliente: 'Construtora Horizonte LTDA',
    endereco: 'Av. Paulista, 1578, São Paulo, SP',
    data: '2025-02-15',
    problemasIdentificados: 7,
    recomendacoes: 5,
    status: 'finalizado',
    geradoEm: '2025-02-15T14:30:00Z',
    atualizadoEm: '2025-02-15T14:30:00Z',
    compartilhado: true,
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  },
  {
    id: 'rel-2',
    inspecaoId: 'insp-3',
    tipo: 'telhado',
    titulo: 'Relatório Parcial - Residencial Parque Sul',
    cliente: 'Residencial Parque Sul',
    endereco: 'Av. das Nações Unidas, 1200, São Paulo, SP',
    data: '2025-02-22',
    problemasIdentificados: 5,
    recomendacoes: 3,
    status: 'rascunho',
    geradoEm: '2025-02-22T10:15:00Z',
    atualizadoEm: '2025-02-22T10:15:00Z',
    compartilhado: false,
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  },
  {
    id: 'rel-3',
    inspecaoId: 'insp-4',
    tipo: 'estrutural',
    titulo: 'Avaliação Estrutural - Edifício Comercial Centro',
    cliente: 'Edifício Comercial Centro',
    endereco: 'Rua XV de Novembro, 100, São Paulo, SP',
    data: '2025-01-30',
    problemasIdentificados: 2,
    recomendacoes: 4,
    status: 'finalizado',
    geradoEm: '2025-01-30T16:45:00Z',
    atualizadoEm: '2025-01-30T16:45:00Z',
    compartilhado: true,
    tecnico: {
      nome: 'Carlos Silva',
      email: 'carlos.silva@brasilit.com',
      avatar: null
    }
  }
];

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  
  const navegarParaNovaVistoria = () => {
    setLocation("/nova-vistoria");
  };

  // Filtrar relatórios
  const filteredRelatorios = mockRelatorios.filter(relatorio => {
    const matchesSearch = 
      relatorio.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relatorio.cliente.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'todos' || 
      (activeTab === 'finalizados' && relatorio.status === 'finalizado') ||
      (activeTab === 'rascunhos' && relatorio.status === 'rascunho');
    
    return matchesSearch && matchesTab;
  });

  // Função para exibir o status do relatório
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizado':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Finalizado
          </Badge>
        );
      case 'rascunho':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Rascunho
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Função para simular download de relatório
  const downloadRelatorio = (relatorioId: string) => {
    console.log(`Baixando relatório ${relatorioId}...`);
    // Em uma implementação real, isso iniciaria o download do arquivo PDF
  };

  // Função para simular impressão
  const printRelatorio = (relatorioId: string) => {
    console.log(`Imprimindo relatório ${relatorioId}...`);
    // Em uma implementação real, isso abriria a janela de impressão
  };

  // Função para simular compartilhamento
  const shareRelatorio = (relatorioId: string) => {
    console.log(`Compartilhando relatório ${relatorioId}...`);
    // Em uma implementação real, isso abriria opções de compartilhamento
  };

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex items-center gap-3">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md" 
              onClick={navegarParaNovaVistoria}
            >
              <FileText className="mr-2 h-5 w-5" />
              Nova Vistoria
            </Button>
            <Button onClick={() => setLocation('/relatorios/modelos')}>
              <FileText className="mr-2 h-4 w-4" /> Modelos de Relatórios
            </Button>
          </div>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Pesquisar relatórios por título ou cliente..."
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
                  <Calendar size={16} className="mr-2" /> Últimos 30 dias
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Building size={16} className="mr-2" /> Por Cliente
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText size={16} className="mr-2" /> Por Tipo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArrowUpDown size={16} className="mr-2" /> Mais recentes primeiro
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpDown size={16} className="mr-2" /> Mais antigos primeiro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
            <TabsTrigger value="rascunhos">Rascunhos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de relatórios */}
        {filteredRelatorios.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <p className="text-muted-foreground">Nenhum relatório encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRelatorios.map((relatorio) => (
              <Card key={relatorio.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 md:p-6 grid gap-4 md:grid-cols-[2fr_1fr_auto]">
                    {/* Informações do relatório */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{relatorio.titulo}</h3>
                        {renderStatusBadge(relatorio.status)}
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {relatorio.tipo === 'telhado' ? 'Telhado' : 'Estrutural'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          <Building size={14} />
                          <span>Cliente: {relatorio.cliente}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{relatorio.endereco}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Data da Inspeção: {formatDate(new Date(relatorio.data), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle size={14} />
                          <span>Problemas identificados: {relatorio.problemasIdentificados}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informações adicionais */}
                    <div className="flex flex-col justify-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{relatorio.tecnico.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{relatorio.tecnico.nome}</p>
                          <p className="text-xs text-muted-foreground">{relatorio.tecnico.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileDown size={14} />
                          <span>Gerado em: {formatDate(new Date(relatorio.geradoEm), 'dd/MM/yyyy, HH:mm')}</span>
                        </div>
                        {relatorio.compartilhado && (
                          <div className="flex items-center gap-1 mt-1">
                            <Share2 size={14} />
                            <span>Compartilhado</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex md:flex-col gap-2 justify-end items-end">
                      {relatorio.status === 'finalizado' ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => downloadRelatorio(relatorio.id)}
                        >
                          <Download size={16} /> Baixar PDF
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => setLocation(`/relatorios/editar/${relatorio.id}`)}
                        >
                          <CheckCircle size={16} /> Finalizar
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Mais Opções <ChevronDown size={14} className="ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/relatorios/${relatorio.id}`)}>
                            <Eye size={16} className="mr-2" /> Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation(`/inspecoes/${relatorio.inspecaoId}`)}>
                            <FileImage size={16} className="mr-2" /> Ver Inspeção
                          </DropdownMenuItem>
                          {relatorio.status === 'finalizado' && (
                            <>
                              <DropdownMenuItem onClick={() => printRelatorio(relatorio.id)}>
                                <Printer size={16} className="mr-2" /> Imprimir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareRelatorio(relatorio.id)}>
                                <Share2 size={16} className="mr-2" /> Compartilhar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setLocation(`/relatorios/enviar/${relatorio.id}`)}>
                                <Mail size={16} className="mr-2" /> Enviar por E-mail
                              </DropdownMenuItem>
                            </>
                          )}
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