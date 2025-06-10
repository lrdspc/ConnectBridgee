import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { DashboardLayoutNew } from '../../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useVisits } from '../../hooks/useVisits';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Camera, 
  Image, 
  Check, 
  Save, 
  AlertTriangle,
  FileText,
  Zap
} from 'lucide-react';
import { Visit } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

// Esquema de validação para formulário de inspeção - todos os campos opcionais
const inspecaoSchema = z.object({
  dataInspecao: z.string().optional().default(""),
  tipoTelhado: z.enum(['fibrocimento', 'metalico', 'ceramica', 'concreto', 'outro']).optional().default('fibrocimento' as 'fibrocimento'),
  inclinacao: z.enum(['baixa', 'media', 'alta']).optional().default('media' as 'media'),
  areaAproximada: z.string().optional().default(""),
  observacoes: z.string().optional().default(""),
  problemas: z.array(
    z.object({
      id: z.string(),
      tipo: z.string(),
      descricao: z.string(),
      selecionado: z.boolean().default(false),
      observacoes: z.string().optional().default(""),
      imagens: z.array(z.string()).default([])
    })
  ).optional().default([])
});

// Tipos baseados no esquema
type InspecaoFormData = z.infer<typeof inspecaoSchema>;

// Lista de problemas pré-definidos
const problemasPredefinidos = [
  { id: "1", tipo: "Armazenagem Incorreta", descricao: "As telhas não foram armazenadas conforme recomendações do fabricante" },
  { id: "2", tipo: "Carga Permanente sobre as Telhas", descricao: "Existem elementos causando sobrecarga nas telhas" },
  { id: "3", tipo: "Corte de Canto Incorreto ou Ausente", descricao: "Os cantos das telhas não foram cortados corretamente" },
  { id: "4", tipo: "Estrutura Desalinhada", descricao: "Estrutura de suporte apresenta desalinhamento" },
  { id: "5", tipo: "Fixação Irregular das Telhas", descricao: "Método de fixação inadequado ou insuficiente" },
  { id: "6", tipo: "Inclinação da Telha Inferior ao Recomendado", descricao: "A inclinação do telhado está abaixo do mínimo recomendado" },
  { id: "7", tipo: "Marcas de Caminhamento sobre o Telhado", descricao: "Sinais de trânsito sobre as telhas, causando danos" },
  { id: "8", tipo: "Balanço Livre do Beiral Incorreto", descricao: "Beiral com balanço excessivo ou insuficiente" },
  { id: "9", tipo: "Número de Apoios e Vão Livre Inadequados", descricao: "Quantidade ou espaçamento incorreto dos apoios" },
  { id: "10", tipo: "Recobrimento Incorreto", descricao: "Sobreposição das telhas inadequada" },
  { id: "11", tipo: "Sentido de Montagem Incorreto", descricao: "Telhas instaladas no sentido contrário ao recomendado" },
  { id: "12", tipo: "Uso de Cumeeira Cerâmica", descricao: "Utilização de cumeeira incompatível com telhas Brasilit" },
  { id: "13", tipo: "Uso de Argamassa em Substituição a Peças Complementares", descricao: "Substituição indevida de peças por argamassa" },
  { id: "14", tipo: "Fixação de Acessórios Complementares Realizada de Forma Inadequada", descricao: "Acessórios fixados incorretamente" }
];

export default function NovaInspecaoPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { visits, isLoading } = useVisits();
  const [cliente, setCliente] = useState<Visit | null>(null);
  const [activeTab, setActiveTab] = useState('informacoes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Extrair clienteId da URL
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get('clienteId');

  // Buscar informações do cliente
  useEffect(() => {
    if (!isLoading && visits.length > 0 && clienteId) {
      const foundCliente = visits.find(v => v.id === clienteId);
      if (foundCliente) {
        setCliente(foundCliente);
      }
    }
  }, [clienteId, visits, isLoading]);

  // Configurar o formulário com react-hook-form e resolver de validação
  const form = useForm<InspecaoFormData>({
    resolver: zodResolver(inspecaoSchema),
    defaultValues: {
      dataInspecao: new Date().toISOString().split('T')[0],
      tipoTelhado: 'fibrocimento',
      inclinacao: 'media',
      areaAproximada: '',
      observacoes: '',
      problemas: problemasPredefinidos.map(problema => ({
        ...problema,
        selecionado: false,
        observacoes: '',
        imagens: []
      }))
    }
  });

  // Função para capturar imagem
  const captureImage = (problemaId: string) => {
    // Simulando captura (em uma implementação real, acessaria a câmera do dispositivo)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            // Atualizar apenas o problema específico com a nova imagem
            const problemas = form.getValues('problemas');
            const updatedProblemas = problemas.map(p => {
              if (p.id === problemaId) {
                return {
                  ...p,
                  imagens: [...p.imagens, event.target?.result as string]
                };
              }
              return p;
            });
            form.setValue('problemas', updatedProblemas);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Função para remover imagem
  const removeImage = (problemaId: string, imageIndex: number) => {
    const problemas = form.getValues('problemas');
    const updatedProblemas = problemas.map(p => {
      if (p.id === problemaId) {
        const imagens = [...p.imagens];
        imagens.splice(imageIndex, 1);
        return {
          ...p,
          imagens
        };
      }
      return p;
    });
    form.setValue('problemas', updatedProblemas);
  };

  // Função para visualizar imagem em tamanho maior
  const viewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    // Aqui você poderia abrir um modal para visualização da imagem
  };

  // Função para atualizar o estado de seleção de um problema
  const handleProblemaToggle = (problemaId: string, checked: boolean) => {
    const problemas = form.getValues('problemas');
    const updatedProblemas = problemas.map(p => {
      if (p.id === problemaId) {
        return {
          ...p,
          selecionado: checked
        };
      }
      return p;
    });
    form.setValue('problemas', updatedProblemas);
  };

  // Função para atualizar observações de um problema
  const handleProblemaObservacao = (problemaId: string, observacao: string) => {
    const problemas = form.getValues('problemas');
    const updatedProblemas = problemas.map(p => {
      if (p.id === problemaId) {
        return {
          ...p,
          observacoes: observacao
        };
      }
      return p;
    });
    form.setValue('problemas', updatedProblemas);
  };

  // Função para gerar dados aleatórios
  const gerarDadosAleatorios = () => {
    // Área aleatória entre 100 e 1000 m²
    const areaAproximada = Math.floor(Math.random() * 900 + 100).toString();
    
    // Data aleatória nos últimos 30 dias
    const dataAtual = new Date();
    const dataAnterior = new Date();
    dataAnterior.setDate(dataAtual.getDate() - Math.floor(Math.random() * 30));
    const dataFormatada = dataAnterior.toISOString().split('T')[0];
    
    // Tipo de telhado aleatório
    const tiposTelhado = ['fibrocimento', 'metalico', 'ceramica', 'concreto', 'outro'];
    const tipoTelhado = tiposTelhado[Math.floor(Math.random() * tiposTelhado.length)] as 'fibrocimento' | 'metalico' | 'ceramica' | 'concreto' | 'outro';
    
    // Inclinação aleatória
    const inclinacoes = ['baixa', 'media', 'alta'];
    const inclinacao = inclinacoes[Math.floor(Math.random() * inclinacoes.length)] as 'baixa' | 'media' | 'alta';
    
    // Observações aleatórias
    const observacoesOpcoes = [
      "Telhado em bom estado geral, com apenas alguns pontos de atenção.",
      "Cliente relatou problemas de infiltração recentes após chuvas fortes.",
      "Estrutura apresenta sinais de fadiga em alguns pontos.",
      "Telhado já passou por reforma anterior há aproximadamente 5 anos.",
      "Instalação original feita por mão de obra não especializada."
    ];
    const observacoes = observacoesOpcoes[Math.floor(Math.random() * observacoesOpcoes.length)];
    
    // Selecionar alguns problemas aleatoriamente
    const problemasSelecionados = problemasPredefinidos.map(problema => {
      // 30% de chance de selecionar cada problema
      const selecionado = Math.random() < 0.3;
      
      let observacoes = "";
      if (selecionado) {
        const observacoesProblema = [
          "Problema verificado em várias áreas do telhado.",
          "Situação pontual, afetando apenas uma pequena região.",
          "Requer atenção imediata para evitar danos maiores.",
          "Problema comum neste tipo de instalação.",
          "Cliente já havia identificado este problema anteriormente."
        ];
        observacoes = observacoesProblema[Math.floor(Math.random() * observacoesProblema.length)];
      }
      
      return {
        ...problema,
        selecionado,
        observacoes,
        imagens: []
      };
    });
    
    // Atualizar o formulário
    form.reset({
      dataInspecao: dataFormatada,
      tipoTelhado,
      inclinacao,
      areaAproximada,
      observacoes,
      problemas: problemasSelecionados
    });
    
    toast({
      title: "Dados gerados",
      description: "O formulário foi preenchido com dados aleatórios.",
    });
  };

  // Função para salvar como rascunho
  const salvarRascunho = () => {
    setSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      toast({
        title: "Inspeção salva",
        description: "A inspeção foi salva como rascunho e pode ser editada posteriormente.",
      });
      setSaving(false);
    }, 1000);
  };

  // Função para finalizar e enviar a inspeção
  const onSubmit = (data: InspecaoFormData) => {
    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      console.log("Dados da inspeção:", data);
      
      toast({
        title: "Inspeção concluída",
        description: "A inspeção foi registrada com sucesso!",
      });
      
      setIsSubmitting(false);
      
      // Redirecionar para página de detalhes ou lista de inspeções
      navigate('/inspecoes');
    }, 1500);
  };

  return (
    <PageTransition>
      <DashboardLayoutNew>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/inspecoes')}>
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight ml-2">Nova Inspeção</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={salvarRascunho} 
              disabled={saving || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={saving || isSubmitting}
            >
              <Check className="mr-2 h-4 w-4" />
              Finalizar Inspeção
            </Button>
          </div>
        </div>

        {/* Dados do cliente */}
        {cliente && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{cliente.clientName}</h2>
                  <p className="text-sm text-muted-foreground">{cliente.address}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/clientes/${cliente.id}`)}>
                  Ver Detalhes do Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão para gerar dados aleatórios */}
        <div className="mb-4 flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={gerarDadosAleatorios}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4 text-amber-500" />
            Gerar Dados Aleatórios
          </Button>
        </div>
        
        {/* Tabs para navegação entre seções do formulário */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
            <TabsTrigger value="problemas">Problemas Identificados</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Tab de Informações Gerais */}
              <TabsContent value="informacoes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Inspeção</CardTitle>
                    <CardDescription>
                      Preencha os dados básicos sobre a inspeção do telhado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Data da Inspeção */}
                    <FormField
                      control={form.control}
                      name="dataInspecao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Inspeção</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Tipo de Telhado */}
                    <FormField
                      control={form.control}
                      name="tipoTelhado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Telhado</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fibrocimento" id="fibrocimento" />
                                <Label htmlFor="fibrocimento">Fibrocimento</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="metalico" id="metalico" />
                                <Label htmlFor="metalico">Metálico</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ceramica" id="ceramica" />
                                <Label htmlFor="ceramica">Cerâmica</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="concreto" id="concreto" />
                                <Label htmlFor="concreto">Concreto</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="outro" id="outro" />
                                <Label htmlFor="outro">Outro</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Inclinação do Telhado */}
                    <FormField
                      control={form.control}
                      name="inclinacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inclinação do Telhado</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="baixa" id="baixa" />
                                <Label htmlFor="baixa">Baixa (até 15°)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="media" id="media" />
                                <Label htmlFor="media">Média (15° a 30°)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alta" id="alta" />
                                <Label htmlFor="alta">Alta (acima de 30°)</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Área Aproximada */}
                    <FormField
                      control={form.control}
                      name="areaAproximada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área Aproximada (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Informe a área aproximada do telhado em metros quadrados
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Observações Gerais */}
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações Gerais</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Observações gerais sobre o telhado e condições da inspeção"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/inspecoes')}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('problemas')}
                    >
                      Próximo: Problemas Identificados
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Tab de Problemas Identificados */}
              <TabsContent value="problemas" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Problemas Identificados</CardTitle>
                    <CardDescription>
                      Selecione os problemas identificados durante a inspeção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {form.getValues('problemas').map((problema, index) => (
                        <div key={problema.id} className="border rounded-lg p-4">
                          <div className="flex items-start">
                            <Checkbox 
                              id={`problema-${problema.id}`}
                              checked={problema.selecionado}
                              onCheckedChange={(checked) => 
                                handleProblemaToggle(problema.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <div className="ml-3 flex-1">
                              <label 
                                htmlFor={`problema-${problema.id}`} 
                                className="font-medium cursor-pointer"
                              >
                                {problema.tipo}
                              </label>
                              <p className="text-sm text-muted-foreground">{problema.descricao}</p>
                              
                              {problema.selecionado && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <Label htmlFor={`observacao-${problema.id}`}>
                                      Observações específicas
                                    </Label>
                                    <Textarea 
                                      id={`observacao-${problema.id}`}
                                      placeholder="Detalhes adicionais sobre o problema identificado"
                                      value={problema.observacoes || ''}
                                      onChange={(e) => 
                                        handleProblemaObservacao(problema.id, e.target.value)
                                      }
                                      className="mt-2"
                                      rows={2}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Imagens</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {problema.imagens.map((img, imgIndex) => (
                                        <div 
                                          key={imgIndex} 
                                          className="relative border rounded-md overflow-hidden w-20 h-20"
                                        >
                                          <img 
                                            src={img} 
                                            alt={`Imagem ${imgIndex + 1}`}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => viewImage(img)}
                                          />
                                          <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-md"
                                            onClick={() => removeImage(problema.id, imgIndex)}
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => captureImage(problema.id)}
                                        className="border border-dashed rounded-md flex items-center justify-center w-20 h-20 text-muted-foreground hover:bg-gray-50"
                                      >
                                        <Camera size={24} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('informacoes')}
                    >
                      Voltar: Informações Gerais
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={salvarRascunho} 
                        disabled={saving || isSubmitting}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Rascunho
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={saving || isSubmitting}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Finalizar Inspeção
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DashboardLayoutNew>
    </PageTransition>
  );
}