import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Check, X, ArrowDown, ArrowUp, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  required?: boolean;
  order: number;
}

export interface DashboardConfig {
  widgets: DashboardWidgetConfig[];
  layout: 'grid' | 'list';
  compactMode: boolean;
}

interface DashboardCustomizationModalProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  children?: React.ReactNode;
}

export function DashboardCustomizationModal({
  config,
  onConfigChange,
  children
}: DashboardCustomizationModalProps) {
  const [open, setOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<DashboardConfig>(config);
  const { toast } = useToast();

  // Atualizar localConfig quando config mudar (por exemplo, ao abrir o modal)
  useEffect(() => {
    setLocalConfig(config);
  }, [config, open]);

  // Alternar visibilidade de um widget
  const toggleWidget = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => 
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    }));
  };

  // Mover widget para cima ou para baixo
  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const widgets = [...localConfig.widgets];
    const index = widgets.findIndex(w => w.id === id);
    
    if (direction === 'up' && index > 0) {
      // Trocar com o widget acima
      [widgets[index], widgets[index - 1]] = [widgets[index - 1], widgets[index]];
    } else if (direction === 'down' && index < widgets.length - 1) {
      // Trocar com o widget abaixo
      [widgets[index], widgets[index + 1]] = [widgets[index + 1], widgets[index]];
    }
    
    // Atualizar ordem
    const updatedWidgets = widgets.map((widget, i) => ({
      ...widget,
      order: i
    }));
    
    setLocalConfig(prev => ({
      ...prev,
      widgets: updatedWidgets
    }));
  };

  // Alternar entre layout grid ou lista
  const toggleLayout = () => {
    setLocalConfig(prev => ({
      ...prev,
      layout: prev.layout === 'grid' ? 'list' : 'grid'
    }));
  };

  // Alternar modo compacto
  const toggleCompactMode = () => {
    setLocalConfig(prev => ({
      ...prev,
      compactMode: !prev.compactMode
    }));
  };

  // Resetar para configurações padrão
  const resetToDefaults = () => {
    const defaultWidgets = config.widgets.map(widget => ({
      ...widget,
      enabled: true,
      order: widget.order
    }));
    
    setLocalConfig({
      widgets: defaultWidgets,
      layout: 'grid',
      compactMode: false
    });
    
    toast({
      title: "Configurações resetadas",
      description: "O dashboard voltou para as configurações padrão",
    });
  };

  // Salvar alterações
  const saveChanges = () => {
    onConfigChange(localConfig);
    setOpen(false);
    
    toast({
      title: "Dashboard personalizado",
      description: "Suas configurações foram salvas com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Personalizar
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>
            Configure quais informações deseja visualizar e a disposição do seu dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Layout e Aparência</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="layout-toggle">Modo de Visualização</Label>
                <p className="text-xs text-muted-foreground">
                  {localConfig.layout === 'grid' 
                    ? "Grade: Widgets organizados em cartões" 
                    : "Lista: Widgets empilhados verticalmente"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Lista</span>
                <Switch 
                  id="layout-toggle" 
                  checked={localConfig.layout === 'grid'}
                  onCheckedChange={toggleLayout}
                />
                <span className="text-xs">Grade</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-toggle">Modo Compacto</Label>
                <p className="text-xs text-muted-foreground">
                  Reduz o espaçamento entre componentes para exibir mais conteúdo
                </p>
              </div>
              <Switch 
                id="compact-toggle" 
                checked={localConfig.compactMode}
                onCheckedChange={toggleCompactMode}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Widgets Visíveis</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetToDefaults}
                className="h-8 gap-1 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Restaurar padrão
              </Button>
            </div>
            
            {localConfig.widgets.map((widget) => (
              <div 
                key={widget.id}
                className={cn(
                  "flex items-start justify-between p-3 rounded-lg border",
                  widget.enabled 
                    ? "bg-card border-muted" 
                    : "bg-muted/30 border-dashed border-muted-foreground/30"
                )}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center">
                    <h4 className={cn(
                      "text-sm font-medium",
                      !widget.enabled && "text-muted-foreground"
                    )}>
                      {widget.title}
                    </h4>
                    {widget.required && (
                      <span className="ml-2 text-[10px] bg-primary/10 text-primary rounded-sm px-1 py-0.5">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{widget.description}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => moveWidget(widget.id, 'up')}
                      disabled={widget.order === 0 || !widget.enabled}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => moveWidget(widget.id, 'down')}
                      disabled={widget.order === localConfig.widgets.length - 1 || !widget.enabled}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1",
                      widget.enabled ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => toggleWidget(widget.id)}
                    disabled={widget.required}
                  >
                    {widget.enabled ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">Ocultar</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span className="sr-only">Mostrar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={saveChanges}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}