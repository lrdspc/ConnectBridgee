import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { 
  RelatorioVistoria,
  relatorioVistoriaSchema,
  naoConformidadesDisponiveis,
  modelosTelhas,
  espessurasTelhas,
  novoRelatorioVistoria,
  gerarRelatorioAleatorio
} from '../../../shared/relatorioVistoriaSchema';
import { gerarRelatorioVistoriaDoc } from '@/lib/relatorioVistoriaDocGenerator';

import { DashboardLayoutNew } from '@/layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { CheckboxProps } from '@/components/ui/checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileCheck, 
  FileText, 
  AlertTriangle, 
  Camera, 
  Save, 
  Upload, 
  Download, 
  Building, 
  HardHat, 
  Calendar, 
  User, 
  Check,
  X
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function RelatorioVistoriaPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('informacoes-basicas');
  const [fotos, setFotos] = useState<{ id: string; dataUrl: string; descricao?: string; timestamp: string }[]>([]);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  // Inicializar o formulário com valores padrão
  const form = useForm<RelatorioVistoria>({
    resolver: zodResolver(relatorioVistoriaSchema),
    defaultValues: novoRelatorioVistoria(),
  });
  
  const watchNaoConformidades = form.watch('naoConformidades');
  const watchResultado = form.watch('resultado');
  
  // Função para lidar com o upload de fotos
  const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const novaFoto = {
              id: `foto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              dataUrl: e.target.result.toString(),
              descricao: '',
              timestamp: new Date().toISOString()
            };
            setFotos(prev => [...prev, novaFoto]);
            
            // Atualizar o campo de fotos no formulário
            const fotosCampo = form.getValues('fotos') || [];
            form.setValue('fotos', [...fotosCampo, novaFoto]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Função para atualizar a descrição de uma foto
  const handleFotoDescricaoChange = (id: string, descricao: string) => {
    setFotos(prev => prev.map(f => f.id === id ? { ...f, descricao } : f));
    
    // Atualizar também no formulário
    const fotosCampo = form.getValues('fotos') || [];
    form.setValue(
      'fotos', 
      fotosCampo.map(f => f.id === id ? { ...f, descricao } : f)
    );
  };
  
  // Função para remover uma foto
  const handleRemoverFoto = (id: string) => {
    setFotos(prev => prev.filter(f => f.id !== id));
    
    // Atualizar também no formulário
    const fotosCampo = form.getValues('fotos') || [];
    form.setValue('fotos', fotosCampo.filter(f => f.id !== id));
  };
  
  // Função para alternar o estado de seleção de uma não conformidade
  const toggleNaoConformidade = (id: number) => {
    const naoConformidadesAtualizadas = watchNaoConformidades.map(nc => 
      nc.id === id ? { ...nc, selecionado: !nc.selecionado } : nc
    );
    form.setValue('naoConformidades', naoConformidadesAtualizadas);
  };
  
  // Função para gerar uma visualização do relatório
  const gerarPreviewRelatorio = () => {
    setIsGeneratingPreview(true);
    
    try {
      const formData = form.getValues();
      
      // Filtrar não conformidades selecionadas
      const naoConformidadesSelecionadas = formData.naoConformidades
        .filter(nc => nc.selecionado)
        .map(nc => {
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            titulo: completa?.titulo || '',
            descricao: completa?.descricao || ''
          };
        });
      
      // Montar a lista de não conformidades para a conclusão
      const listaNaoConformidades = naoConformidadesSelecionadas.length > 0
        ? `<ul>${naoConformidadesSelecionadas.map(nc => 
            `<li>
              <strong>${nc.titulo}</strong>
              <p style="margin-left: 20px; margin-top: 5px; margin-bottom: 15px;">${nc.descricao}</p>
            </li>`).join('')}</ul>`
        : '<p>Não foram identificadas não conformidades.</p>';
      
      // Criar HTML para o preview
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">RELATÓRIO DE VISTORIA TÉCNICA</h1>
          
          <div style="margin-top: 20px;">
            <h2>IDENTIFICAÇÃO DO PROJETO</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; width: 40%;"><strong>Protocolo/FAR:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.protocolo}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Data de vistoria:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.dataVistoria}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cliente:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.cliente}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Empreendimento:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.empreendimento}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Endereço:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.endereco}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cidade/UF:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.cidade} - ${formData.uf}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Assunto:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.assunto}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px;">
            <h2>RESPONSÁVEIS TÉCNICOS</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; width: 40%;"><strong>Elaborado por:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.elaboradoPor}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Departamento:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.departamento}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Unidade:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.unidade}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Coordenador:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.coordenador}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Gerente:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.gerente}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Regional:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.regional}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px;">
            <h2>1. INTRODUÇÃO</h2>
            <p>${formData.introducao || 'Não informado.'}</p>
            
            <h3>1.1 DADOS DO PRODUTO</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; width: 40%;"><strong>Quantidade:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.quantidade}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Modelo:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.modeloTelha} ${formData.espessura}mm CRFS</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Área coberta:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.area}m² (aproximadamente)</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px;">
            <h2>2. ANÁLISE TÉCNICA</h2>
            <p>${formData.analiseTecnica || 'Não informado.'}</p>
            
            <h3>2.1 NÃO CONFORMIDADES IDENTIFICADAS</h3>
            ${listaNaoConformidades}
          </div>
          
          <div style="margin-top: 20px;">
            <h2>3. CONCLUSÃO</h2>
            <p>Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:</p>
            ${listaNaoConformidades}
            <p>${formData.conclusao || ''}</p>
            <p>Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, 
            finalizamos o atendimento considerando a reclamação como <strong>${formData.resultado}</strong>, 
            onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a 
            problemas relacionados à qualidade do material.</p>
            
            <p>As telhas BRASILIT modelo FIBROCIMENTO ${formData.modeloTelha.toUpperCase()} possuem ${formData.anosGarantiaTotal} 
            anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a 
            correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no 
            Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico 
            está sempre disponível em: http://www.brasilit.com.br.</p>
            
            <p>Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, 
            específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a 
            legislação em vigor.</p>
            
            <p>${formData.recomendacao || ''}</p>
            
            <p>Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.</p>
            
            <p>Atenciosamente,</p>
          </div>
          
          <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
            <p><strong>Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.</strong><br>
            <strong>Divisão Produtos Para Construção</strong><br>
            <strong>Departamento de Assistência Técnica</strong></p>
            
            <div style="margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #000; width: 60%;"></div>
            <p>${formData.elaboradoPor}<br>
            ${formData.departamento} - ${formData.unidade}<br>
            CREA/CAU ${formData.numeroRegistro}</p>
          </div>
          
          ${formData.fotos && formData.fotos.length > 0 ? `
            <div style="margin-top: 20px;">
              <h2>ANEXO: REGISTRO FOTOGRÁFICO</h2>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                ${formData.fotos.map((foto, index) => `
                  <div style="border: 1px solid #ddd; padding: 10px;">
                    <img src="${foto.dataUrl}" style="width: 100%; height: auto; max-height: 200px; object-fit: contain;" />
                    <p><strong>Imagem ${index + 1}:</strong> ${foto.descricao || 'Sem descrição'}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      
      setPreviewHTML(html);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      toast({
        title: 'Erro ao gerar preview',
        description: 'Não foi possível gerar a visualização do relatório.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };
  
  // Submissão do formulário
  const onSubmit = (data: RelatorioVistoria) => {
    try {
      console.log('Dados do formulário:', data);
      
      toast({
        title: 'Relatório salvo com sucesso!',
        description: 'O relatório foi salvo e pode ser acessado posteriormente.',
      });
      
      // Gerar preview atualizado
      gerarPreviewRelatorio();
      
      // Mudar para a aba de preview
      setActiveTab('preview');
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast({
        title: 'Erro ao salvar o relatório',
        description: 'Não foi possível salvar o relatório. Tente novamente.',
        variant: 'destructive'
      });
    }
  };
  
  // Função para baixar o relatório em HTML
  const baixarRelatorioHTML = () => {
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-vistoria-${form.getValues().protocolo || 'novo'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Estado para controlar o carregamento ao gerar DOCX
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  
  // Função para baixar o relatório em DOCX
  const baixarRelatorioDocx = async () => {
    try {
      setIsGeneratingDocx(true);
      const formData = form.getValues();
      
      // Gerar o documento usando a biblioteca docx
      const blob = await gerarRelatorioVistoriaDoc(formData);
      
      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-vistoria-${formData.protocolo || 'novo'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Documento Word gerado com sucesso!',
        description: 'O relatório foi gerado em formato DOCX e está pronto para download.',
      });
    } catch (error) {
      console.error('Erro ao gerar documento Word:', error);
      toast({
        title: 'Erro ao gerar documento Word',
        description: 'Não foi possível gerar o documento. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingDocx(false);
    }
  };
  
  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Relatório de Vistoria Técnica</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Voltar
              </Button>
              <Button
                variant="outline"
                onClick={() => form.reset(novoRelatorioVistoria())}
              >
                Limpar
              </Button>
              <Button 
                variant="default" 
                onClick={form.handleSubmit(onSubmit)}
              >
                <Save className="mr-2 h-4 w-4" /> Salvar Relatório
              </Button>
            </div>
          </div>
        
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="informacoes-basicas">
                <Building className="mr-2 h-4 w-4" /> Informações Básicas
              </TabsTrigger>
              <TabsTrigger value="analise-tecnica">
                <HardHat className="mr-2 h-4 w-4" /> Análise Técnica
              </TabsTrigger>
              <TabsTrigger value="fotos">
                <Camera className="mr-2 h-4 w-4" /> Fotos
              </TabsTrigger>
              <TabsTrigger value="preview">
                <FileText className="mr-2 h-4 w-4" /> Visualização
              </TabsTrigger>
            </TabsList>
            
            {/* Botão para gerar dados aleatórios */}
            <div className="mb-4 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                className="gap-2" 
                onClick={() => {
                  const dadosAleatorios = gerarRelatorioAleatorio();
                  form.reset(dadosAleatorios);
                  setFotos(dadosAleatorios.fotos || []);
                  toast({
                    title: "Dados gerados com sucesso",
                    description: "O formulário foi preenchido com dados de teste aleatórios.",
                  });
                }}
              >
                <HardHat className="h-4 w-4" /> Gerar Dados de Teste
              </Button>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Tab de Informações Básicas */}
                <TabsContent value="informacoes-basicas">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Identificação do Projeto</CardTitle>
                        <CardDescription>
                          Informações básicas sobre o local da vistoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="protocolo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Protocolo/FAR</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="dataVistoria"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data da Vistoria</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="cliente"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="empreendimento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Empreendimento</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endereco"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cidade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="uf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>UF</FormLabel>
                                <FormControl>
                                  <Input {...field} maxLength={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="assunto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assunto</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Responsáveis Técnicos</CardTitle>
                          <CardDescription>
                            Informações dos responsáveis pela vistoria
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="elaboradoPor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Elaborado por</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="departamento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="unidade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unidade</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="regional"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Regional</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="coordenador"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Coordenador</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="gerente"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gerente</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="numeroRegistro"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CREA/CAU</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Dados do Produto</CardTitle>
                          <CardDescription>
                            Informações sobre as telhas
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="modeloTelha"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Modelo</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o modelo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {modelosTelhas.map((modelo) => (
                                        <SelectItem key={modelo} value={modelo}>
                                          {modelo}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="espessura"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Espessura (mm)</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione a espessura" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {espessurasTelhas.map((espessura) => (
                                        <SelectItem key={espessura} value={espessura}>
                                          {espessura}mm
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="quantidade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantidade</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="area"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Área (m²)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="anosGarantia"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Anos de Garantia</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="anosGarantiaSistemaCompleto"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Garantia Sistema</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="anosGarantiaTotal"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Garantia Total</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab de Análise Técnica */}
                <TabsContent value="analise-tecnica">
                  <div className="grid md:grid-cols-[1fr_380px] gap-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Introdução e Análise</CardTitle>
                          <CardDescription>
                            Detalhes sobre a análise técnica realizada
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="introducao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Introdução</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Descreva a introdução do relatório"
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="analiseTecnica"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Análise Técnica</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Descreva a análise técnica realizada"
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="conclusao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Conclusão</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Descreva a conclusão da análise"
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="recomendacao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recomendações</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Informe recomendações, se houver"
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="observacoesGerais"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observações Gerais</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Observações adicionais, se houver"
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Resultado da Análise</CardTitle>
                          <CardDescription>
                            Avaliação final da reclamação
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="resultado"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resultado</FormLabel>
                                <div className="flex gap-4">
                                  <div 
                                    className={`flex-1 border rounded-md p-4 cursor-pointer ${field.value === 'PROCEDENTE' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                                    onClick={() => field.onChange('PROCEDENTE')}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Check className={`h-5 w-5 ${field.value === 'PROCEDENTE' ? 'text-primary' : 'text-gray-400'}`} />
                                      <div className="font-medium">PROCEDENTE</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                      A reclamação procede. Garantia aplicável.
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className={`flex-1 border rounded-md p-4 cursor-pointer ${field.value === 'IMPROCEDENTE' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                                    onClick={() => field.onChange('IMPROCEDENTE')}
                                  >
                                    <div className="flex items-center gap-2">
                                      <X className={`h-5 w-5 ${field.value === 'IMPROCEDENTE' ? 'text-primary' : 'text-gray-400'}`} />
                                      <div className="font-medium">IMPROCEDENTE</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                      A reclamação não procede. Garantia não aplicável.
                                    </div>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Não Conformidades</CardTitle>
                        <CardDescription>
                          Selecione as não conformidades identificadas na vistoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[700px] pr-4">
                          <div className="space-y-2">
                            {naoConformidadesDisponiveis.map((nc) => {
                              const naoConformidade = watchNaoConformidades.find(item => item.id === nc.id);
                              const selecionado = naoConformidade?.selecionado || false;
                              
                              return (
                                <div 
                                  key={nc.id} 
                                  className={`p-3 border rounded-md ${selecionado ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                >
                                  <div className="flex items-start space-x-2">
                                    <Checkbox 
                                      id={`nc-${nc.id}`} 
                                      checked={selecionado}
                                      onCheckedChange={() => toggleNaoConformidade(nc.id)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <label
                                        htmlFor={`nc-${nc.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                      >
                                        {nc.titulo}
                                      </label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {nc.descricao}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Tab de Fotos */}
                <TabsContent value="fotos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fotos da Vistoria</CardTitle>
                      <CardDescription>
                        Adicione fotos para documentar a vistoria
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 mb-6">
                        <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Arraste e solte imagens aqui ou clique para selecionar arquivos
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('foto-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Selecionar imagens
                        </Button>
                        <input
                          id="foto-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFotoUpload}
                          className="hidden"
                        />
                      </div>
                      
                      {fotos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {fotos.map((foto) => (
                            <Card key={foto.id} className="overflow-hidden">
                              <img 
                                src={foto.dataUrl} 
                                alt="Foto da vistoria" 
                                className="h-48 w-full object-cover"
                              />
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <textarea
                                    placeholder="Descrição da foto"
                                    className="w-full text-sm rounded-md border p-2 h-20 resize-none"
                                    value={foto.descricao || ''}
                                    onChange={(e) => handleFotoDescricaoChange(foto.id, e.target.value)}
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleRemoverFoto(foto.id)}
                                  >
                                    Remover
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          Nenhuma foto adicionada.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </form>
            </Form>
            
            {/* Tab de Preview */}
            <TabsContent value="preview">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Visualização do Relatório</CardTitle>
                    <CardDescription>
                      Visualize como o relatório será gerado
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={gerarPreviewRelatorio}
                      disabled={isGeneratingPreview}
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      Atualizar Preview
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={baixarRelatorioHTML}
                        disabled={!previewHTML}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar HTML
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={baixarRelatorioDocx}
                        disabled={!form.formState.isValid}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {isGeneratingDocx ? "Gerando..." : "Exportar DOC"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {previewHTML ? (
                    <div className="border rounded-md">
                      <iframe
                        srcDoc={previewHTML}
                        title="Visualização do Relatório"
                        className="w-full h-[800px] rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Clique em "Atualizar Preview" para visualizar o relatório.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={gerarPreviewRelatorio}
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Gerar Visualização
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}