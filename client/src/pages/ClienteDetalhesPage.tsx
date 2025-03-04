import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  MoreVertical, 
  Edit, 
  Trash, 
  MapPin, 
  Phone, 
  Calendar, 
  Mail, 
  ClipboardCheck,
  MapPinned,
  FileText,
  Clock
} from 'lucide-react';
import { useVisits } from '../hooks/useVisits';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Visit } from '../lib/db';

export default function ClienteDetalhesPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { visits, isLoading } = useVisits();
  const [cliente, setCliente] = useState<Visit | null>(null);
  const [inspecoes, setInspecoes] = useState<any[]>([]);

  // Carregar os dados do cliente quando a página for carregada
  useEffect(() => {
    if (!isLoading && visits.length > 0 && id) {
      const clienteEncontrado = visits.find(v => v.id === id);
      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
        
        // Simular informações de inspeções relacionadas
        // Numa implementação real, estas informações viriam do banco de dados
        setInspecoes([
          {
            id: 'insp-1',
            data: new Date(2025, 1, 15).toISOString(),
            status: 'concluida',
            tipo: 'telhado',
            problemas: 7,
            observacoes: 'Vazamento no telhado identificado na área sul.',
            criadaEm: new Date(2025, 1, 10).toISOString(),
            atualizadaEm: new Date(2025, 1, 15).toISOString(),
          },
          {
            id: 'insp-2',
            data: new Date(2024, 11, 10).toISOString(),
            status: 'concluida',
            tipo: 'estrutural',
            problemas: 3,
            observacoes: 'Inspeção estrutural realizada sem problemas graves.',
            criadaEm: new Date(2024, 11, 5).toISOString(),
            atualizadaEm: new Date(2024, 11, 10).toISOString(),
          }
        ]);
      } else {
        // Cliente não encontrado, redirecionar para a lista
        setLocation('/clientes');
      }
    }
  }, [id, visits, isLoading, setLocation]);

  // Função para obter a cor do badge de status
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
        return 'Em andamento';
      case 'pendente':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  if (isLoading || !cliente) {
    return (
      <PageTransition>
        <DashboardLayoutNew>
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/clientes')}>
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight ml-2">Carregando detalhes do cliente...</h1>
          </div>
        </DashboardLayoutNew>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <DashboardLayoutNew>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/clientes')}>
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight ml-2">{cliente.clientName}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setLocation(`/vistoria/${cliente.id}`)} 
              variant="default"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" /> Nova Vistoria
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocation(`/clientes/editar/${cliente.id}`)}>
                  <Edit size={16} className="mr-2" /> Editar cliente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation(`/rotas?clienteId=${cliente.id}`)}>
                  <MapPinned size={16} className="mr-2" /> Ver no mapa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash size={16} className="mr-2" /> Excluir cliente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Informações do cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="text-2xl">
                      {cliente.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="outline" className={
                    cliente.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                    cliente.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }>
                    {cliente.status === 'completed' ? 'Concluído' : 
                     cliente.status === 'in-progress' ? 'Em andamento' : 'Pendente'}
                  </Badge>
                </div>
                <div className="md:w-2/3 space-y-3">
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <MapPin size={16} className="mt-1" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">{cliente.address}</p>
                    </div>
                  </div>
                  
                  {cliente.contactInfo && (
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <Phone size={16} className="mt-1" />
                      <div>
                        <p className="font-medium">Contato</p>
                        <p className="text-sm text-muted-foreground">{cliente.contactInfo}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <Clock size={16} className="mt-1" />
                    <div>
                      <p className="font-medium">Data de Cadastro</p>
                      <p className="text-sm text-muted-foreground">{formatDate(new Date(cliente.createdAt), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <FileText size={16} className="mt-1" />
                    <div>
                      <p className="font-medium">Descrição</p>
                      <p className="text-sm text-muted-foreground">{cliente.description || 'Nenhuma descrição adicionada.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-medium">Total de Inspeções</p>
                    <p className="text-xl font-bold text-blue-800">{inspecoes.length}</p>
                  </div>
                  <ClipboardCheck className="h-8 w-8 text-blue-400" />
                </div>
                
                <div className="bg-green-50 p-3 rounded border border-green-100 flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">Última Inspeção</p>
                    <p className="text-sm font-medium text-green-800">
                      {inspecoes.length > 0 
                        ? formatDate(new Date(inspecoes[0].data), 'dd/MM/yyyy')
                        : 'Nenhuma inspeção'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
                
                <Button className="w-full" variant="outline" onClick={() => setLocation(`/rotas?clienteId=${cliente.id}`)}>
                  <MapPinned className="mr-2 h-4 w-4" /> Ver Localização
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de inspeções */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Histórico de Inspeções</CardTitle>
            <CardDescription>Todas as inspeções realizadas para este cliente</CardDescription>
          </CardHeader>
          <CardContent>
            {inspecoes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhuma inspeção encontrada para este cliente.</p>
                <Button 
                  onClick={() => setLocation(`/vistoria/${cliente.id}`)} 
                  variant="outline"
                  className="mt-4"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Realizar Nova Vistoria
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {inspecoes.map((inspecao) => (
                  <div key={inspecao.id} className="border rounded-lg p-4 grid md:grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">Inspeção de {inspecao.tipo}</h3>
                        <Badge variant="outline" className={getStatusColor(inspecao.status)}>
                          {getStatusText(inspecao.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-start text-sm text-muted-foreground">
                        <Calendar size={14} className="mt-0.5" />
                        <div>
                          <span>Realizada em: {formatDate(new Date(inspecao.data), 'dd/MM/yyyy')}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-start text-sm text-muted-foreground mt-1">
                        <FileText size={14} className="mt-0.5" />
                        <div>
                          <span>Problemas identificados: {inspecao.problemas}</span>
                        </div>
                      </div>
                      {inspecao.observacoes && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Observações:</p>
                          <p className="text-muted-foreground">{inspecao.observacoes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex md:flex-col gap-2 items-end justify-end">
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/inspecoes/${inspecao.id}`)}>
                        Ver Detalhes
                      </Button>
                      {inspecao.status === 'concluida' && (
                        <Button variant="ghost" size="sm">
                          Gerar Relatório
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayoutNew>
    </PageTransition>
  );
}