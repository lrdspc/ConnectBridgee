import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useParams, useLocation } from 'wouter';
import { useVisits } from '../hooks/useVisits';
import { 
  RelatorioVistoria,
  relatorioVistoriaSchema,
  naoConformidadesDisponiveis,
  modelosTelhas,
  espessurasTelhas,
  novoRelatorioVistoria,
  gerarRelatorioAleatorio
} from '@shared/relatorioVistoriaSchema';
import { gerarRelatorioSimples } from '@/lib/relatorioVistoriaSimpleGenerator';

import { DashboardLayoutNew } from '@/layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertTriangle,
  Calendar,
  Camera,
  Check,
  Clipboard,
  Database,
  Download,
  FileText,
  HardHat,
  Image,
  Info,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
  Map,
  Users
} from 'lucide-react';

export default function RelatorioVistoriaPage() {
  // Estados
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('informacoes-basicas');
  const [fotos, setFotos] = useState<{ id: string; dataUrl: string; descricao?: string; timestamp: string }[]>([]);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  // Obter o ID do cliente a partir dos parâmetros de consulta
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const clientId = searchParams.get('clientId');
  const { visits } = useVisits();
  
  // Inicializar o formulário com valores padrão
  const form = useForm<RelatorioVistoria>({
    resolver: zodResolver(relatorioVistoriaSchema),
    defaultValues: novoRelatorioVistoria(),
  });
  
  // Carregar dados do cliente quando o clientId estiver disponível
  useEffect(() => {
    if (clientId && visits) {
      const clientVisit = visits.find((visit: { id: string }) => visit.id === clientId);
      if (clientVisit) {
        // Pré-preencher o formulário com os dados do cliente
        form.setValue('cliente', clientVisit.clientName);
        form.setValue('endereco', clientVisit.address);
        form.setValue('protocolo', `VISTORIA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`);
        
        // Se a cidade/UF estiver disponível no endereço, tentar extrair
        const addressParts = clientVisit.address.split(',');
        if (addressParts.length > 1) {
          const lastPart = addressParts[addressParts.length - 1].trim();
          const cityUfMatch = lastPart.match(/(.+)\/(.+)/);
          if (cityUfMatch) {
            form.setValue('cidade', cityUfMatch[1].trim());
            form.setValue('uf', cityUfMatch[2].trim());
          }
        }
        
        toast({
          title: 'Dados do cliente carregados',
          description: 'O formulário foi pré-preenchido com os dados do cliente selecionado.',
          variant: 'default'
        });
      }
    }
  }, [clientId, visits, form, toast]);
  
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
      // Clonar o formulário para não afetar os valores originais
      const formData = {...form.getValues()};
      
      // Garantir que estamos usando IMPROCEDENTE sempre
      formData.resultado = "IMPROCEDENTE";
      
      // Textos fixos com substituição de variáveis
      const introducaoTexto = `A Área de Assistência Técnica foi solicitada para atender uma reclamação
relacionada ao surgimento de infiltrações nas telhas de fibrocimento: -
Telha da marca BRASILIT modelo ${formData.modeloTelha} de ${formData.espessura}mm, produzidas com
tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem
amianto - cuja fabricação segue a norma internacional ISO 9933, bem como
as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas,
para avaliar as manifestações patológicas reclamadas em telhas de nossa
marca aplicada em sua cobertura conforme registro de reclamação
protocolo FAR ${formData.protocolo}.

O modelo de telha escolhido para a edificação foi: ${formData.modeloTelha}. Esse
modelo, como os demais, possui a necessidade de seguir rigorosamente as
orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento
e Acessórios para Telhado - Brasilit para o melhor desempenho do
produto, assim como a garantia do produto coberta por ${formData.anosGarantia} anos (ou ${formData.anosGarantiaSistemaCompleto}
anos para sistema completo).`;
      
      // Texto fixo da análise técnica
      const analiseTecnicaTexto = `Durante a visita técnica realizada no local, nossa equipe conduziu uma
vistoria minuciosa da cobertura, documentando e analisando as condições
de instalação e o estado atual das telhas. Após criteriosa avaliação das
evidências coletadas em campo, identificamos alguns desvios nos
procedimentos de manuseio e instalação em relação às especificações
técnicas do fabricante, os quais são detalhados a seguir.`;
      
      // Conclusão - sempre como IMPROCEDENTE
      const conclusaoTexto = `Com base na análise técnica realizada, foram identificadas as não conformidades listadas acima.

Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, 
finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados 
se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ${formData.modeloTelha} possuem ${formData.anosGarantiaTotal} anos de garantia 
com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, 
seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento 
e Acessórios para Telhado - Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas - ABNT, 
específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos
conforme a legislação em vigor.`;
      
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
      
      // Montar a lista de não conformidades com descrições completas (para a seção 2.1)
      const listaNaoConformidades = naoConformidadesSelecionadas.length > 0
        ? `<ul>${naoConformidadesSelecionadas.map(nc => 
            `<li>
              <strong>${nc.titulo}</strong>
              <p style="margin-left: 20px; margin-top: 5px; margin-bottom: 15px;">${nc.descricao}</p>
            </li>`).join('')}</ul>`
        : '<p>Não foram identificadas não conformidades.</p>';
        
      // Montar a lista de não conformidades apenas com títulos (para a conclusão)
      const listaNaoConformidadesTitulos = naoConformidadesSelecionadas.length > 0
        ? `<ul>${naoConformidadesSelecionadas.map(nc => 
            `<li>
              <strong>${nc.titulo}</strong>
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
            <p>${introducaoTexto}</p>
            
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
            <p>${analiseTecnicaTexto}</p>
            
            <h3>2.1 NÃO CONFORMIDADES IDENTIFICADAS</h3>
            ${listaNaoConformidades}
          </div>
          
          <div style="margin-top: 20px;">
            <h2>3. CONCLUSÃO</h2>
            <p>Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:</p>
            ${listaNaoConformidadesTitulos}
            <p>${conclusaoTexto}</p>
            
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
      // Garantir que o resultado é sempre IMPROCEDENTE
      data.resultado = "IMPROCEDENTE";
      
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
  
  // Função para baixar o relatório em DOCX
  const baixarRelatorioDocx = async () => {
    try {
      setIsGeneratingDocx(true);
      
      // Clonar os dados do formulário para não afetar o estado
      const formData = {...form.getValues()};
      
      // Forçar resultado como IMPROCEDENTE
      formData.resultado = "IMPROCEDENTE";
      
      // Os textos fixos serão inseridos diretamente no gerador
      // Não precisamos mais preencher os campos de texto, pois eles serão gerados no gerador de relatório
      
      // Filtrar não conformidades selecionadas e usar as versões completas
      const naoConformidadesSelecionadas = formData.naoConformidades
        .filter(nc => nc.selecionado)
        .map(nc => {
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            id: nc.id,
            titulo: completa?.titulo || '',
            descricao: completa?.descricao || '',
            selecionado: true
          };
        });
      
      // Substituir as não conformidades com as versões completas
      formData.naoConformidades = naoConformidadesSelecionadas;
      
      // Função auxiliar para salvar o arquivo
      const saveDocFile = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        // Limpar recursos
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      };
      
      // Nome do arquivo com marcação ABNT
      const fileName = `relatorio-vistoria-${formData.protocolo || 'novo'}-ABNT.docx`;
      
      // Usar o gerador simplificado que funciona corretamente com formatação ABNT
      console.log('▶️ Gerando relatório usando o gerador simplificado (formatação ABNT)');
      const blob = await gerarRelatorioSimples(formData);
      saveDocFile(blob, fileName);
      
      toast({
        title: 'Documento Word gerado com sucesso!',
        description: 'O relatório foi exportado no formato DOCX com formatação ABNT.',
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
  
  // Define resultado como IMPROCEDENTE sempre
  useEffect(() => {
    // Definir o resultado como IMPROCEDENTE ao montar o componente
    form.setValue("resultado", "IMPROCEDENTE");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">Relatório</Badge>
                <Badge variant="outline">Vistoria Técnica</Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Relatório de Vistoria Técnica</h1>
              <p className="text-sm text-muted-foreground mt-1">Preencha o formulário com os dados da vistoria técnica realizada.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                size="sm"
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={() => form.reset(novoRelatorioVistoria())}
                size="sm"
                className="flex items-center gap-1"
              >
                <Clipboard className="h-4 w-4" /> Limpar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm("Deseja resetar o banco de dados? Todos os dados serão perdidos.")) {
                    // Carregamos o script de reset do banco
                    const script = document.createElement('script');
                    script.src = '/src/reset-database.js';
                    script.type = 'module';
                    document.body.appendChild(script);
                    
                    // Removemos o script após execução
                    script.onload = () => {
                      document.body.removeChild(script);
                      toast({
                        title: 'Banco de dados resetado',
                        description: 'O banco de dados foi reinicializado com sucesso.',
                      });
                    };
                  }
                }}
                size="sm"
                className="flex items-center gap-1"
              >
                <Database className="h-4 w-4" /> Resetar DB
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                size="sm"
                onClick={() => {
                  const dadosAleatorios = gerarRelatorioAleatorio();
                  // Sempre definir como IMPROCEDENTE
                  dadosAleatorios.resultado = "IMPROCEDENTE";
                  form.reset(dadosAleatorios);
                  setFotos(dadosAleatorios.fotos || []);
                  toast({
                    title: 'Dados carregados',
                    description: 'O formulário foi preenchido com dados de exemplo.',
                  });
                }}
              >
                <FileText className="h-4 w-4" /> Carregar Exemplo
              </Button>
              <Button 
                variant="default" 
                onClick={form.handleSubmit(onSubmit)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Salvar Relatório
              </Button>
            </div>
          </div>
          
          {/* Progresso do formulário */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>Progresso do relatório</span>
              <span className="text-primary font-medium">
                {
                  activeTab === 'preview' ? '100%' :
                  activeTab === 'fotos' ? '75%' :
                  activeTab === 'nao-conformidades' ? '50%' :
                  activeTab === 'responsaveis' ? '25%' :
                  '0%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: 
                    activeTab === 'preview' ? '100%' :
                    activeTab === 'fotos' ? '75%' :
                    activeTab === 'nao-conformidades' ? '50%' :
                    activeTab === 'responsaveis' ? '25%' :
                    '0%'
                }}
              ></div>
            </div>
          </div>

          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-5xl mx-auto mb-10"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="informacoes-basicas" className="flex items-center gap-2">
                <Info className="h-4 w-4" /> <span className="hidden sm:inline">Informações</span>
              </TabsTrigger>
              <TabsTrigger value="responsaveis" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> <span className="hidden sm:inline">Responsáveis</span>
              </TabsTrigger>
              <TabsTrigger value="nao-conformidades" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> <span className="hidden sm:inline">Não Conformidades</span>
              </TabsTrigger>
              <TabsTrigger value="fotos" className="flex items-center gap-2">
                <Image className="h-4 w-4" /> <span className="hidden sm:inline">Fotos</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
              
                {/* Tab 1: Informações Básicas */}
                <TabsContent value="informacoes-basicas">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações do Cliente e Produto - COLUNA 1 */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Informações Básicas</CardTitle>
                          <CardDescription>
                            Dados do cliente e da vistoria
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
                    
                    {/* Coluna 2 - Informações extras como recomendações */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recomendações e Observações</CardTitle>
                          <CardDescription>
                            Informações adicionais para o relatório
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="recomendacao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recomendações Técnicas</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Insira aqui recomendações técnicas para o cliente" 
                                    className="min-h-[150px]"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Estas recomendações serão incluídas na conclusão do relatório.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setActiveTab('responsaveis')}
                          >
                            Continuar <span className="sr-only sm:not-sr-only sm:ml-2">para Responsáveis</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 2: Responsáveis */}
                <TabsContent value="responsaveis">
                  <div className="max-w-3xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Responsáveis Técnicos</CardTitle>
                        <CardDescription>
                          Informações sobre os responsáveis técnicos pela vistoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('informacoes-basicas')}
                        >
                          <span className="sr-only sm:not-sr-only sm:mr-2">Voltar para</span> Informações
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('nao-conformidades')}
                        >
                          Continuar <span className="sr-only sm:not-sr-only sm:ml-2">para Não Conformidades</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Tab 3: Não Conformidades */}
                <TabsContent value="nao-conformidades">
                  <div className="max-w-4xl mx-auto">
                    <Card>
                      <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          Checklist de Verificação (14 Pontos)
                        </CardTitle>
                        <CardDescription>
                          Marque os problemas identificados durante a inspeção do telhado com vazamento
                        </CardDescription>
                      </CardHeader>
                      
                      {/* Instrução para técnicos */}
                      <div className="bg-amber-50 border-b border-amber-200 p-4">
                        <h3 className="text-amber-800 font-semibold flex items-center mb-2">
                          <Info className="h-4 w-4 mr-2" />
                          Guia de Inspeção
                        </h3>
                        <p className="text-amber-700 text-sm">
                          Este checklist contém os 14 pontos técnicos que devem ser verificados em toda inspeção de telhado com vazamento.
                          Marque apenas os problemas encontrados e capture fotos das não conformidades como evidência.
                        </p>
                      </div>
                      
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {watchNaoConformidades.map((nc, index) => {
                            const naoConformidadeCompleta = naoConformidadesDisponiveis.find(item => item.id === nc.id);
                            return (
                              <div 
                                key={nc.id} 
                                className={`flex items-start space-x-3 p-4 border rounded-md transition-all ${
                                  nc.selecionado ? 'bg-red-50 border-red-200' : 'hover:border-gray-300'
                                }`}
                              >
                                <Checkbox 
                                  id={`nc-${nc.id}`} 
                                  checked={nc.selecionado}
                                  onCheckedChange={() => toggleNaoConformidade(nc.id)}
                                  className="mt-1"
                                />
                                <div>
                                  <label 
                                    htmlFor={`nc-${nc.id}`}
                                    className={`font-medium cursor-pointer ${nc.selecionado ? 'text-red-700' : ''}`}
                                  >
                                    {index + 1}. {naoConformidadeCompleta?.titulo}
                                  </label>
                                  
                                  <details className="text-sm mt-1">
                                    <summary className="cursor-pointer text-primary-600 hover:text-primary">
                                      Ver descrição detalhada
                                    </summary>
                                    <p className="text-sm text-muted-foreground mt-2 p-2 bg-gray-50 rounded-md">
                                      {naoConformidadeCompleta?.descricao}
                                    </p>
                                  </details>
                                  
                                  {nc.selecionado && (
                                    <div className="mt-3">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        className="w-full text-sm"
                                        onClick={() => {
                                          const input = document.getElementById('foto-upload');
                                          if (input) input.click();
                                        }}
                                      >
                                        <Camera className="h-3.5 w-3.5 mr-1" />
                                        Adicionar Foto da Evidência
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('responsaveis')}
                        >
                          <span className="sr-only sm:not-sr-only sm:mr-2">Voltar para</span> Responsáveis
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('fotos')}
                        >
                          Continuar <span className="sr-only sm:not-sr-only sm:ml-2">para Fotos</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Tab 4: Fotos */}
                <TabsContent value="fotos">
                  <div className="max-w-3xl mx-auto">
                    <Card>
                      <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                          <Camera className="h-5 w-5 text-primary" />
                          Registro Fotográfico
                        </CardTitle>
                        <CardDescription>
                          Adicione fotos das não conformidades identificadas
                        </CardDescription>
                      </CardHeader>
                      
                      {/* Instrução para documentação fotográfica */}
                      <div className="bg-blue-50 border-b border-blue-200 p-4">
                        <h3 className="text-blue-800 font-semibold flex items-center mb-2">
                          <Info className="h-4 w-4 mr-2" />
                          Documentação de Evidências
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Para cada problema identificado no checklist, adicione pelo menos uma foto clara que evidencie a não conformidade.
                          Fotos bem documentadas são essenciais para justificar as conclusões do relatório técnico.
                        </p>
                      </div>
                      
                      <CardContent className="space-y-6 pt-6">
                        {/* Lista de não conformidades selecionadas */}
                        {watchNaoConformidades.filter(nc => nc.selecionado).length > 0 && (
                          <div className="space-y-4 mb-6">
                            <h3 className="font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              Problemas identificados ({watchNaoConformidades.filter(nc => nc.selecionado).length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {watchNaoConformidades
                                .filter(nc => nc.selecionado)
                                .map((nc, index) => {
                                  const naoConformidadeCompleta = naoConformidadesDisponiveis.find(item => item.id === nc.id);
                                  return (
                                    <div key={nc.id} className="flex items-center p-3 rounded-md bg-amber-50 border border-amber-200">
                                      <Check className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                                      <span className="text-sm">{naoConformidadeCompleta?.titulo}</span>
                                    </div>
                                  );
                              })}
                            </div>
                          </div>
                        )}
                      
                        <div className="flex justify-center p-6 border-2 border-dashed rounded-md relative overflow-hidden">
                          <div className="text-center">
                            <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-2 font-medium">Arraste as imagens ou clique para selecionar</p>
                            <p className="text-sm text-muted-foreground">Cada foto deve estar relacionada a um problema identificado</p>
                            <Button
                              type="button"
                              variant="secondary"
                              className="mt-4"
                              onClick={() => {
                                const input = document.getElementById('foto-upload');
                                if (input) input.click();
                              }}
                            >
                              Adicionar Fotos
                            </Button>
                            <Input
                              type="file"
                              id="foto-upload"
                              accept="image/*"
                              capture="environment"
                              multiple
                              onChange={handleFotoUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                        
                        {/* Lista de fotos */}
                        {fotos.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Fotos adicionadas ({fotos.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fotos.map((foto) => (
                                <div key={foto.id} className="border rounded-md p-3 space-y-2">
                                  <div className="aspect-video relative rounded overflow-hidden bg-gray-100">
                                    <img 
                                      src={foto.dataUrl} 
                                      alt="Foto da vistoria" 
                                      className="absolute inset-0 w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      value={foto.descricao || ''}
                                      onChange={(e) => handleFotoDescricaoChange(foto.id, e.target.value)}
                                      placeholder="Descrição da foto"
                                      className="w-full"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRemoverFoto(foto.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" /> Remover Foto
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('nao-conformidades')}
                        >
                          <span className="sr-only sm:not-sr-only sm:mr-2">Voltar para</span> Não Conformidades
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            gerarPreviewRelatorio();
                            setActiveTab('preview');
                          }}
                        >
                          Gerar <span className="sr-only sm:not-sr-only sm:ml-2">Preview</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Tab 5: Preview */}
                <TabsContent value="preview">
                  <div className="max-w-4xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Visualização do Relatório</CardTitle>
                        <CardDescription>
                          Visualize como ficará o relatório final e faça o download
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isGeneratingPreview ? (
                          <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="mt-4 text-center text-muted-foreground">
                              Gerando visualização do relatório...
                            </p>
                          </div>
                        ) : previewHTML ? (
                          <div>
                            <div className="border rounded-md p-4 bg-white">
                              <iframe
                                srcDoc={previewHTML}
                                className="w-full min-h-[500px] border-0"
                                title="Preview do Relatório"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">Nenhuma visualização disponível</h3>
                            <p className="text-muted-foreground">
                              Clique em "Gerar Visualização" para ver como ficará o relatório final.
                            </p>
                            <Button
                              type="button"
                              onClick={gerarPreviewRelatorio}
                              className="mt-6"
                              variant="secondary"
                            >
                              Gerar Visualização
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('fotos')}
                          className="sm:w-auto w-full"
                        >
                          <span className="sr-only sm:not-sr-only sm:mr-2">Voltar para</span> Fotos
                        </Button>
                        <div className="flex gap-2 sm:w-auto w-full">
                          <Button
                            type="button"
                            variant="outline"
                            className="sm:w-auto w-full"
                            onClick={gerarPreviewRelatorio}
                          >
                            <FileText className="h-4 w-4 mr-2" /> Atualizar Preview
                          </Button>
                          <Button
                            type="button"
                            onClick={baixarRelatorioDocx}
                            disabled={isGeneratingDocx}
                            className="sm:w-auto w-full"
                          >
                            {isGeneratingDocx ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" /> Exportar DOCX
                              </>
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

              </form>
            </Form>
          </Tabs>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}