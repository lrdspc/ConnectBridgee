import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  AreaChart,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Smile,
  Users,
  Zap,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tipos para configuração de widgets
export interface DashboardConfig {
  visibleWidgets: Record<string, boolean>;
  widgetOrder: string[];
  layout: 'compact' | 'comfort' | 'spacious';
  columns: 1 | 2 | 3 | 4;
}

interface WidgetInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultEnabled: boolean;
}

interface DashboardCustomizationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  children?: React.ReactNode;
}

export function DashboardCustomizationModal({
  open,
  onOpenChange,
  config,
  onConfigChange,
  children
}: DashboardCustomizationModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    onOpenChange?.(open);
  };
  const { toast } = useToast();
  
  // Cópia local da configuração para edição
  const [localConfig, setLocalConfig] = useState<DashboardConfig>({
    visibleWidgets: {},
    widgetOrder: [],
    layout: 'comfort',
    columns: 2
  });
  
  // Lista de widgets disponíveis
  const availableWidgets: WidgetInfo[] = [
    {
      id: 'visitsOverview',
      name: 'Visitas Agendadas',
      description: 'Resumo das próximas visitas programadas',
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      defaultEnabled: true
    },
    {
      id: 'performanceChart',
      name: 'Desempenho Semanal',
      description: 'Gráfico com estatísticas de produtividade',
      icon: <AreaChart className="h-4 w-4 text-green-500" />,
      defaultEnabled: true
    },
    {
      id: 'tasksWidget',
      name: 'Tarefas Pendentes',
      description: 'Lista de tarefas e afazeres do dia',
      icon: <CheckSquare className="h-4 w-4 text-amber-500" />,
      defaultEnabled: true
    },
    {
      id: 'mapWidget',
      name: 'Mapa de Roteiros',
      description: 'Visualização da rota do dia',
      icon: <MapPin className="h-4 w-4 text-red-500" />,
      defaultEnabled: true
    },
    {
      id: 'weatherWidget',
      name: 'Previsão do Tempo',
      description: 'Condições climáticas para visitas',
      icon: <AlertCircle className="h-4 w-4 text-blue-400" />,
      defaultEnabled: false
    },
    {
      id: 'timeTrackingWidget',
      name: 'Controle de Tempo',
      description: 'Tempo gasto em cada atividade',
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      defaultEnabled: false
    },
    {
      id: 'reportsWidget',
      name: 'Relatórios Recentes',
      description: 'Últimos relatórios gerados',
      icon: <FileText className="h-4 w-4 text-indigo-500" />,
      defaultEnabled: true
    },
    {
      id: 'teamWidget',
      name: 'Equipe Online',
      description: 'Membros da equipe disponíveis',
      icon: <Users className="h-4 w-4 text-cyan-500" />,
      defaultEnabled: false
    },
    {
      id: 'notesWidget',
      name: 'Bloco de Notas',
      description: 'Anotações rápidas e lembretes',
      icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
      defaultEnabled: false
    },
    {
      id: 'motivationWidget',
      name: 'Motivação Diária',
      description: 'Frases e dicas motivacionais',
      icon: <Smile className="h-4 w-4 text-yellow-600" />,
      defaultEnabled: true
    },
    {
      id: 'tipsWidget',
      name: 'Dicas e Sugestões',
      description: 'Recomendações para melhorar produtividade',
      icon: <Zap className="h-4 w-4 text-amber-600" />,
      defaultEnabled: false
    }
  ];
  
  // Inicializar com configuração atual ao abrir o modal
  useEffect(() => {
    if (open) {
      setLocalConfig({...config});
    }
  }, [open, config]);
  
  // Manipulador para alternar visibilidade do widget
  const toggleWidget = (widgetId: string) => {
    setLocalConfig(prev => ({
      ...prev,
      visibleWidgets: {
        ...prev.visibleWidgets,
        [widgetId]: !prev.visibleWidgets[widgetId]
      }
    }));
  };
  
  // Manipulador para alternar o layout
  const setLayout = (layout: 'compact' | 'comfort' | 'spacious') => {
    setLocalConfig(prev => ({
      ...prev,
      layout
    }));
  };
  
  // Manipulador para alternar número de colunas
  const setColumns = (columns: 1 | 2 | 3 | 4) => {
    setLocalConfig(prev => ({
      ...prev,
      columns
    }));
  };
  
  // Restabelecer configurações padrão
  const resetToDefaults = () => {
    const defaultConfig: DashboardConfig = {
      visibleWidgets: Object.fromEntries(
        availableWidgets.map(widget => [widget.id, widget.defaultEnabled])
      ),
      widgetOrder: availableWidgets.map(widget => widget.id),
      layout: 'comfort',
      columns: 2
    };
    
    setLocalConfig(defaultConfig);
    
    toast({
      title: "Configurações padrão restauradas",
      description: "O dashboard foi redefinido para o formato original.",
    });
  };
  
  // Salvar configurações
  const saveConfig = () => {
    // Log para debug
    console.log('Salvando configurações...', localConfig);
    
    // Certificar que temos widgets para salvar
    if (!localConfig.visibleWidgets || Object.keys(localConfig.visibleWidgets).length === 0) {
      console.warn('Configurações de widgets vazias!');
      
      // Inicializar com valores padrão se estiver vazio
      localConfig.visibleWidgets = Object.fromEntries(
        availableWidgets.map(widget => [widget.id, widget.defaultEnabled])
      );
    }
    
    // Adicionar os widgets do dashboard atual caso não estejam mapeados
    const currentWidgets = ['resumo', 'proxima_visita', 'acoes_rapidas', 'visitas_agendadas', 'grafico_semanal', 'rota_dia', 'clima'];
    currentWidgets.forEach(widgetId => {
      if (localConfig.visibleWidgets[widgetId] === undefined) {
        localConfig.visibleWidgets[widgetId] = true;
      }
    });
    
    // Chamar a função de callback para atualizar o estado principal
    onConfigChange(localConfig);
    
    toast({
      title: "Personalização salva",
      description: "Seu dashboard foi atualizado com sucesso.",
    });
    
    handleOpenChange(false);
  };
  
  return (
    <>
      {/* Botão de Trigger */}
      <div onClick={() => handleOpenChange(true)}>
        {children}
      </div>
      
      {/* Modal de Customização */}
      <Dialog open={open || isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Dashboard</DialogTitle>
            <DialogDescription>
              Escolha quais widgets deseja exibir e como eles devem ser organizados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Layout e Apresentação</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina como o dashboard deve ser organizado
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetToDefaults}
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Restaurar padrão
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="layout-select">Densidade</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={localConfig.layout === 'compact' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setLayout('compact')}
                    >
                      Compacto
                    </Button>
                    <Button 
                      variant={localConfig.layout === 'comfort' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setLayout('comfort')}
                    >
                      Médio
                    </Button>
                    <Button 
                      variant={localConfig.layout === 'spacious' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setLayout('spacious')}
                    >
                      Espaçoso
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="columns-select">Número de colunas</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={localConfig.columns === 1 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setColumns(1)}
                    >
                      1
                    </Button>
                    <Button 
                      variant={localConfig.columns === 2 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setColumns(2)}
                    >
                      2
                    </Button>
                    <Button 
                      variant={localConfig.columns === 3 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setColumns(3)}
                    >
                      3
                    </Button>
                    <Button 
                      variant={localConfig.columns === 4 ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setColumns(4)}
                    >
                      4
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Widgets Disponíveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableWidgets.map((widget) => (
                  <div 
                    key={widget.id} 
                    className="flex items-center justify-between space-x-2 rounded-md border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-md border bg-muted flex items-center justify-center">
                        {widget.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">{widget.name}</h4>
                        <p className="text-xs text-muted-foreground">{widget.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={!!localConfig.visibleWidgets[widget.id]}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md flex items-start space-x-4">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium">Dica de personalização</h4>
                <p className="text-muted-foreground">
                  Você pode arrastar e reordenar os widgets diretamente no dashboard mantendo o botão do mouse pressionado sobre a barra de título de qualquer widget.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={saveConfig}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}