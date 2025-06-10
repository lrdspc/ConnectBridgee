import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useVisits } from "../hooks/useVisits";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus, VisitPhoto } from "../lib/db";
import { v4 as uuidv4 } from 'uuid';
import { DashboardLayoutNew } from '@/layouts/DashboardLayoutNew';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { X, Camera, Image as ImageIcon, Trash2, Save, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { PageTransition } from '@/components/ui/loading-animation';

import {
  problemasPredefinidosFAR,
  modelosTelhasFAR,
  espessurasTelhasFAR,
  FARReport
} from "@shared/farReportSchema";

type TelhaSpec = {
  id: string;
  modelo: string;
  espessura: string;
  comprimento: string;
  largura: string;
  quantidade: number;
  area?: number;
};

type ProblemaIdentificado = {
  id: string;
  tipo: string;
  descricao: string;
  observacoes: string;
  imagens: string[]; // dataUrls das imagens
  selecionado: boolean;
};

// Usando a interface VisitPhoto do arquivo db.ts

type FormData = {
  // Dados Básicos
  dataVistoria: string;
  cliente: string;
  empreendimento: string;
  cidade: string;
  uf: string;
  endereco: string;
  farProtocolo: string;
  assunto: string;
  
  // Dados do Responsável
  elaboradoPor: string;
  departamento: string;
  regional: string;
  unidade: string;
  coordenador: string;
  gerente: string;
  
  // Informações sobre Telhas
  telhas: TelhaSpec[];
  
  // Problemas Identificados
  problemas: ProblemaIdentificado[];
  
  // Textos do relatório
  introducao: string;
  analiseTecnica: string;
  
  // Informações adicionais
  conclusao: string;
  recomendacao: string;
  observacoesGerais: string;
  
  // Anos de garantia
  anosGarantia: string;
  anosGarantiaSistemaCompleto: string;
  anosGarantiaTotal: string;
  
  // Resultado
  resultado: "PROCEDENTE" | "IMPROCEDENTE";
};

const comprimentos5mm = ["1,22m", "1,53m", "1,83m", "2,13m", "2,44m"];
const comprimentos6e8mm = [...comprimentos5mm, "3,05m", "3,66m"];
const larguras = ["0,92m", "1,10m"];
const regionais = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
const unidadesPorRegional: Record<string, string[]> = {
  "Norte": ["AM", "RR", "AP", "PA", "TO", "RO", "AC"],
  "Nordeste": ["MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA"],
  "Centro-Oeste": ["MT", "MS", "GO", "DF"],
  "Sudeste": ["MG", "ES", "RJ", "SP"],
  "Sul": ["PR", "SC", "RS"]
};
const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

// Texto padrão de introdução
const textoIntroducao = "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 6mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.\n\nEm atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR indicado.\n\nO modelo de telha escolhido para a edificação foi o indicado neste relatório. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto.";

// Texto padrão de análise técnica
const textoAnaliseTecnica = "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos os seguintes desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante:";

const VistoriaFARPage = () => {
  const [, setLocation] = useLocation();
  const { createVisit } = useVisits();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  // Estado para o modal de visualização de imagens
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewProblema, setPreviewProblema] = useState<string>("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Referência para o input de arquivo para facilitar testes
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    dataVistoria: new Date().toISOString().split("T")[0],
    cliente: "",
    empreendimento: "",
    cidade: "",
    uf: "",
    endereco: "",
    farProtocolo: "",
    assunto: "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
    
    elaboradoPor: "",
    departamento: "Assistência Técnica",
    regional: "",
    unidade: "",
    coordenador: "João Silva",
    gerente: "Maria Oliveira",
    
    telhas: [
      {
        id: uuidv4(),
        modelo: "Ondulada",
        espessura: "6mm",
        comprimento: "2,44m",
        largura: "1,10m",
        quantidade: 0,
        area: 0
      }
    ],
    
    problemas: problemasPredefinidosFAR.map((problema) => ({
      id: problema.id,
      tipo: problema.tipo,
      descricao: problema.descricao,
      observacoes: "",
      imagens: [],
      selecionado: false
    })),
    
    introducao: textoIntroducao,
    analiseTecnica: textoAnaliseTecnica,
    
    conclusao: "",
    recomendacao: "",
    observacoesGerais: "",
    
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "10",
    anosGarantiaTotal: "10",
    
    resultado: "IMPROCEDENTE"
  });
  
  // Carregar dados do usuário logado e preparar o contexto da aplicação
  useEffect(() => {
    const inicializarPagina = async () => {
      try {
        // Carregar dados do usuário
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setFormData(prev => ({
            ...prev,
            elaboradoPor: user.name
          }));
        }
      } catch (error) {
        console.error("Erro na inicialização da página:", error);
      }
    };
    
    inicializarPagina();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro para este campo
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // Caso especial para regional, que afeta unidade
      if (name === 'regional') {
        return {
          ...prev, 
          [name]: value,
          unidade: "" // Reset unidade quando regional muda
        };
      }
      return { ...prev, [name]: value };
    });
    
    // Limpar erro para este campo
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };
  
  const handleTelhaChange = (id: string, field: keyof TelhaSpec, value: string | number) => {
    setFormData(prev => {
      const telhas = prev.telhas.map(telha => {
        if (telha.id === id) {
          const updatedTelha = { ...telha, [field]: value };
          
          // Recalcular área se necessário
          if (['comprimento', 'largura', 'quantidade'].includes(field as string)) {
            const comprimento = parseFloat(updatedTelha.comprimento.replace('m', '').replace(',', '.'));
            const largura = parseFloat(updatedTelha.largura.replace('m', '').replace(',', '.'));
            updatedTelha.area = comprimento * largura * updatedTelha.quantidade;
          }
          
          return updatedTelha;
        }
        return telha;
      });
      
      return { ...prev, telhas };
    });
  };
  
  const adicionarTelha = () => {
    setFormData(prev => ({
      ...prev,
      telhas: [
        ...prev.telhas,
        {
          id: uuidv4(),
          modelo: "Ondulada",
          espessura: "6mm",
          comprimento: "2,44m",
          largura: "1,10m",
          quantidade: 0,
          area: 0
        }
      ]
    }));
  };
  
  const removerTelha = (id: string) => {
    setFormData(prev => ({
      ...prev,
      telhas: prev.telhas.filter(telha => telha.id !== id)
    }));
  };
  
  const handleProblemaToggle = (id: string, checked: boolean) => {
    setFormData(prev => {
      const problemas = prev.problemas.map(problema => {
        if (problema.id === id) {
          return { ...problema, selecionado: checked };
        }
        return problema;
      });
      
      return { ...prev, problemas };
    });
  };
  
  const handleProblemaObservacao = (id: string, observacoes: string) => {
    setFormData(prev => {
      const problemas = prev.problemas.map(problema => {
        if (problema.id === id) {
          return { ...problema, observacoes };
        }
        return problema;
      });
      
      return { ...prev, problemas };
    });
  };
  
  const captureImage = (id: string) => {
    // Aciona o input de câmera para o problema específico
    const cameraInput = document.getElementById(`camera-${id}`) as HTMLInputElement;
    if (cameraInput) {
      cameraInput.click();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera neste dispositivo.",
        variant: "destructive"
      });
    }
  };
  
  // Função para comprimir imagens
  const compressImage = (dataUrl: string, maxWidth = 1280, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calcular as dimensões mantendo a proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Criar canvas para a compressão
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar a imagem redimensionada
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto 2D'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para formato comprimido
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem para compressão'));
      };
      
      img.src = dataUrl;
    });
  };

  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    const dataUrls: string[] = [];
    
    // Verificar se já há muitas imagens
    const problemaAtual = formData.problemas.find(p => p.id === id);
    
    if (problemaAtual && problemaAtual.imagens.length >= 3) {
      toast({
        title: "Limite de imagens",
        description: "Máximo de 3 imagens por problema. Remova algumas antes de adicionar mais.",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }
    
    // Verificar o número total de imagens
    const totalExistingImages = formData.problemas.reduce((total, p) => total + p.imagens.length, 0);
    const maxRemainingImages = 12 - totalExistingImages;
    
    if (maxRemainingImages <= 0) {
      toast({
        title: "Limite de imagens atingido",
        description: "Você já atingiu o limite máximo de 12 imagens no relatório.",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }
    
    const maxImagesToAdd = Math.min(files.length, maxRemainingImages, 3 - (problemaAtual?.imagens.length || 0));
    
    // Mostrar aviso de limitação
    if (files.length > maxImagesToAdd) {
      toast({
        title: "Limitando número de imagens",
        description: `Serão adicionadas apenas ${maxImagesToAdd} das ${files.length} imagens selecionadas.`,
      });
    }
    
    // Processar somente as primeiras X imagens permitidas
    const filesToProcess = files.slice(0, maxImagesToAdd);
    
    for (const file of filesToProcess) {
      try {
        // Verificar se o arquivo é uma imagem
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Arquivo inválido",
            description: "Por favor, selecione apenas arquivos de imagem.",
            variant: "destructive"
          });
          continue;
        }
        
        // Limitar tamanho do arquivo (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Comprimindo imagem grande",
            description: "A imagem será redimensionada para otimizar o tamanho.",
          });
        }
        
        // Ler o arquivo como data URL
        const reader = new FileReader();
        
        const originalDataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
        
        // Comprimir e redimensionar a imagem
        const compressedDataUrl = await compressImage(originalDataUrl, 1280, 0.7);
        dataUrls.push(compressedDataUrl);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        toast({
          title: "Erro ao processar imagem",
          description: "Não foi possível processar essa imagem. Tente outra.",
          variant: "destructive"
        });
      }
    }
    
    // Atualizar o estado do formulário com as novas imagens
    if (dataUrls.length > 0) {
      setFormData(prev => {
        const updatedProblemas = prev.problemas.map(p => {
          if (p.id === id) {
            return {
              ...p,
              imagens: [...p.imagens, ...dataUrls]
            };
          }
          return p;
        });
        
        return {
          ...prev,
          problemas: updatedProblemas
        };
      });
      
      toast({
        title: "Imagens adicionadas",
        description: `${dataUrls.length} ${dataUrls.length === 1 ? 'imagem foi adicionada' : 'imagens foram adicionadas'} com sucesso.`,
      });
    }
    
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (event.target) {
      event.target.value = '';
    }
  };
  
  // Função para remover uma imagem de um problema
  const handleRemoveImage = (problemaId: string, imageIndex: number) => {
    setFormData(prev => {
      const problemas = prev.problemas.map(p => {
        if (p.id === problemaId) {
          const updatedImagens = [...p.imagens];
          updatedImagens.splice(imageIndex, 1);
          return {
            ...p,
            imagens: updatedImagens
          };
        }
        return p;
      });
      
      return {
        ...prev,
        problemas
      };
    });
  };
  
  // Abrir o preview de uma imagem
  const openImagePreview = (problemaId: string, imageUrl: string) => {
    const problema = formData.problemas.find(p => p.id === problemaId);
    setPreviewProblema(problema ? problema.tipo : "");
    setPreviewImage(imageUrl);
    setPreviewDialogOpen(true);
  };
  
  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    // Validar campos básicos
    if (!formData.cliente.trim()) errors.cliente = "Nome do cliente é obrigatório";
    if (!formData.endereco.trim()) errors.endereco = "Endereço é obrigatório";
    if (!formData.cidade.trim()) errors.cidade = "Cidade é obrigatória";
    if (!formData.uf.trim()) errors.uf = "UF é obrigatório";
    if (!formData.dataVistoria.trim()) errors.dataVistoria = "Data da vistoria é obrigatória";
    
    // Validar responsável técnico
    if (!formData.elaboradoPor.trim()) errors.elaboradoPor = "Nome do responsável é obrigatório";
    if (!formData.departamento.trim()) errors.departamento = "Departamento é obrigatório";
    
    // Validar telhas
    const hasValidTelha = formData.telhas.some(telha => telha.quantidade > 0);
    if (!hasValidTelha) errors.telhas = "Adicione ao menos uma telha com quantidade válida";
    
    // Validar problemas selecionados
    const hasSelectedProblema = formData.problemas.some(problema => problema.selecionado);
    if (!hasSelectedProblema && formData.resultado === "IMPROCEDENTE") {
      errors.problemas = "Selecione ao menos um problema para justificar a improcedência";
    }
    
    // Definir os erros e retornar se formulário é válido
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Função para o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validar o formulário antes de enviar
      if (!validateForm()) {
        const firstErrorField = Object.keys(formErrors)[0];
        if (firstErrorField) {
          // Verificar a qual tab pertence o primeiro erro
          const fieldToTabMap: Record<string, string> = {
            cliente: 'dados',
            endereco: 'dados',
            cidade: 'dados',
            uf: 'dados',
            dataVistoria: 'dados',
            elaboradoPor: 'dados',
            departamento: 'dados',
            telhas: 'telhas',
            problemas: 'problemas',
            introducao: 'textos',
            analiseTecnica: 'textos',
            conclusao: 'conclusao',
            recomendacao: 'conclusao'
          };
          
          const tabToFocus = fieldToTabMap[firstErrorField] || 'dados';
          setActiveTab(tabToFocus);
          
          toast({
            title: "Formulário incompleto",
            description: "Por favor, corrija os campos destacados antes de continuar.",
            variant: "destructive"
          });
          
          setIsSubmitting(false);
          return;
        }
      }
      
      // Em um cenário real, aqui enviaríamos os dados para a API
      console.log("Enviando relatório FAR:", formData);
      
      // Dados para criar uma visita relacionada
      const visitData = {
        clientName: formData.cliente,
        address: `${formData.endereco}, ${formData.cidade} - ${formData.uf}`,
        date: formData.dataVistoria,
        type: "inspection" as const,
        priority: "normal" as const,
        status: "completed" as const,
        description: `Vistoria técnica FAR - ${formData.farProtocolo}. ${formData.empreendimento ? `Empreendimento: ${formData.empreendimento}.` : ''} Resultado: ${formData.resultado}`,
        contactInfo: "",
        notes: `Relatório de vistoria técnica FAR realizado em ${formData.dataVistoria}. Elaborado por: ${formData.elaboradoPor}. ${formData.problemas.filter(p => p.selecionado).length} problemas identificados.`,
      };
      
      // Simulação de criação de visita
      toast({
        title: "Relatório salvo com sucesso!",
        description: "O relatório de vistoria FAR foi registrado no sistema.",
      });
      
      // Redirecionar para a página de relatórios após 2 segundos
      setTimeout(() => {
        setLocation('/relatorios');
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao enviar relatório:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível salvar o relatório. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Dados para exemplo pré-preenchidos (para desenvolvimento)
  const preencherDadosTeste = () => {
    const dadosTeste: FormData = {
      dataVistoria: new Date().toISOString().split("T")[0],
      cliente: "Construtora Horizonte LTDA",
      empreendimento: "Condomínio Residencial Vista Verde",
      cidade: "São Paulo",
      uf: "SP",
      endereco: "Av. Paulista, 1578",
      farProtocolo: `FAR-${Math.floor(1000 + Math.random() * 9000)}/2025`,
      assunto: "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
      
      elaboradoPor: "Carlos Silva",
      departamento: "Assistência Técnica",
      regional: "Sudeste",
      unidade: "SP",
      coordenador: "João Silva",
      gerente: "Maria Oliveira",
      
      telhas: [
        {
          id: uuidv4(),
          modelo: "Ondulada",
          espessura: "6mm",
          comprimento: "2,44m",
          largura: "1,10m",
          quantidade: 150,
          area: 150 * 2.44 * 1.1
        },
        {
          id: uuidv4(),
          modelo: "Kalhetão",
          espessura: "8mm",
          comprimento: "3,66m",
          largura: "0,92m",
          quantidade: 75,
          area: 75 * 3.66 * 0.92
        }
      ],
      
      problemas: problemasPredefinidosFAR.map((problema, index) => ({
        id: problema.id,
        tipo: problema.tipo,
        descricao: problema.descricao,
        observacoes: index % 3 === 0 ? "Problema identificado em vários pontos da cobertura. Cliente já havia tentado corrigir sem sucesso." : "",
        imagens: [],
        selecionado: index % 4 === 0 // Seleciona alguns problemas aleatoriamente
      })),
      
      introducao: textoIntroducao,
      analiseTecnica: textoAnaliseTecnica,
      
      conclusao: "Após análise técnica, constatamos que os problemas de vazamento são decorrentes de falhas na instalação das telhas, principalmente devido ao recobrimento incorreto e à fixação irregular. As telhas em si não apresentam defeitos de fabricação, estando dentro dos padrões de qualidade da Brasilit.",
      recomendacao: "Recomenda-se a correção da instalação por equipe especializada, seguindo rigorosamente as especificações técnicas do fabricante. É necessário refazer a fixação das telhas e corrigir o recobrimento, além de revisar toda a estrutura de apoio.",
      observacoesGerais: "O cliente foi orientado sobre os procedimentos corretos de instalação e manutenção das telhas.",
      
      anosGarantia: "5",
      anosGarantiaSistemaCompleto: "10",
      anosGarantiaTotal: "10",
      
      resultado: "IMPROCEDENTE"
    };
    
    setFormData(dadosTeste);
    
    toast({
      title: "Dados de demonstração carregados",
      description: "O formulário foi preenchido com dados de exemplo para fins de demonstração.",
    });
  };
  
  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Novo Relatório FAR</h1>
            <p className="text-muted-foreground">Preencha os dados da vistoria técnica para gerar o relatório.</p>
          </div>
          <Button variant="outline" onClick={preencherDadosTeste}>
            Carregar Dados Exemplo
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="telhas">Telhas</TabsTrigger>
              <TabsTrigger value="problemas">Problemas</TabsTrigger>
              <TabsTrigger value="conclusao">Conclusão</TabsTrigger>
            </TabsList>
            
            {/* Aba 1: Dados Básicos */}
            <TabsContent value="dados" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dados da Vistoria</CardTitle>
                  <CardDescription>
                    Informações básicas sobre o cliente e a vistoria.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataVistoria">Data da Vistoria</Label>
                      <Input
                        id="dataVistoria"
                        name="dataVistoria"
                        type="date"
                        value={formData.dataVistoria}
                        onChange={handleInputChange}
                        className={formErrors.dataVistoria ? "border-red-500" : ""}
                      />
                      {formErrors.dataVistoria && (
                        <p className="text-sm text-red-500">{formErrors.dataVistoria}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="farProtocolo">Protocolo FAR</Label>
                      <Input
                        id="farProtocolo"
                        name="farProtocolo"
                        placeholder="Ex: FAR-12345/2023"
                        value={formData.farProtocolo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Nome do Cliente/Empresa</Label>
                    <Input
                      id="cliente"
                      name="cliente"
                      placeholder="Ex: Construtora Horizonte LTDA"
                      value={formData.cliente}
                      onChange={handleInputChange}
                      className={formErrors.cliente ? "border-red-500" : ""}
                    />
                    {formErrors.cliente && (
                      <p className="text-sm text-red-500">{formErrors.cliente}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="empreendimento">Nome do Empreendimento (opcional)</Label>
                    <Input
                      id="empreendimento"
                      name="empreendimento"
                      placeholder="Ex: Condomínio Residencial Vista Verde"
                      value={formData.empreendimento}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Ex: Av. Paulista, 1578"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      className={formErrors.endereco ? "border-red-500" : ""}
                    />
                    {formErrors.endereco && (
                      <p className="text-sm text-red-500">{formErrors.endereco}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Ex: São Paulo"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className={formErrors.cidade ? "border-red-500" : ""}
                      />
                      {formErrors.cidade && (
                        <p className="text-sm text-red-500">{formErrors.cidade}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Select
                        value={formData.uf}
                        onValueChange={(value) => handleSelectChange("uf", value)}
                      >
                        <SelectTrigger className={formErrors.uf ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {ufs.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.uf && (
                        <p className="text-sm text-red-500">{formErrors.uf}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto</Label>
                    <Input
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Responsável Técnico</CardTitle>
                  <CardDescription>
                    Dados do responsável pela vistoria e elaboração do relatório.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="elaboradoPor">Elaborado por</Label>
                      <Input
                        id="elaboradoPor"
                        name="elaboradoPor"
                        value={formData.elaboradoPor}
                        onChange={handleInputChange}
                        className={formErrors.elaboradoPor ? "border-red-500" : ""}
                      />
                      {formErrors.elaboradoPor && (
                        <p className="text-sm text-red-500">{formErrors.elaboradoPor}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        className={formErrors.departamento ? "border-red-500" : ""}
                      />
                      {formErrors.departamento && (
                        <p className="text-sm text-red-500">{formErrors.departamento}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regional">Regional</Label>
                      <Select
                        value={formData.regional}
                        onValueChange={(value) => handleSelectChange("regional", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a regional" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionais.map((regional) => (
                            <SelectItem key={regional} value={regional}>
                              {regional}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unidade">Unidade</Label>
                      <Select
                        value={formData.unidade}
                        onValueChange={(value) => handleSelectChange("unidade", value)}
                        disabled={!formData.regional}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.regional ? "Selecione a unidade" : "Selecione a regional primeiro"} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.regional && unidadesPorRegional[formData.regional]?.map((unidade) => (
                            <SelectItem key={unidade} value={unidade}>
                              {unidade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coordenador">Coordenador</Label>
                      <Input
                        id="coordenador"
                        name="coordenador"
                        value={formData.coordenador}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gerente">Gerente</Label>
                      <Input
                        id="gerente"
                        name="gerente"
                        value={formData.gerente}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab("telhas")}
                  className="w-full md:w-auto"
                >
                  Próximo: Telhas <span className="ml-2">&rarr;</span>
                </Button>
              </div>
            </TabsContent>
            
            {/* Aba 2: Telhas */}
            <TabsContent value="telhas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes das Telhas</CardTitle>
                  <CardDescription>
                    Especificações das telhas utilizadas no empreendimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formErrors.telhas && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-4">
                      <p className="text-sm text-red-600">{formErrors.telhas}</p>
                    </div>
                  )}
                  
                  {formData.telhas.map((telha, index) => (
                    <div key={telha.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Telha {index + 1}</h3>
                        {formData.telhas.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerTelha(telha.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`modelo-${telha.id}`}>Modelo</Label>
                          <Select
                            value={telha.modelo}
                            onValueChange={(value) => handleTelhaChange(telha.id, "modelo", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o modelo" />
                            </SelectTrigger>
                            <SelectContent>
                              {modelosTelhasFAR.map((modelo) => (
                                <SelectItem key={modelo.valor} value={modelo.valor}>
                                  {modelo.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`espessura-${telha.id}`}>Espessura</Label>
                          <Select
                            value={telha.espessura}
                            onValueChange={(value) => handleTelhaChange(telha.id, "espessura", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a espessura" />
                            </SelectTrigger>
                            <SelectContent>
                              {espessurasTelhasFAR.map((espessura) => (
                                <SelectItem key={espessura.valor} value={espessura.valor}>
                                  {espessura.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`comprimento-${telha.id}`}>Comprimento</Label>
                          <Select
                            value={telha.comprimento}
                            onValueChange={(value) => handleTelhaChange(telha.id, "comprimento", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o comprimento" />
                            </SelectTrigger>
                            <SelectContent>
                              {(telha.espessura === "5mm" ? comprimentos5mm : comprimentos6e8mm).map((comprimento) => (
                                <SelectItem key={comprimento} value={comprimento}>
                                  {comprimento}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`largura-${telha.id}`}>Largura</Label>
                          <Select
                            value={telha.largura}
                            onValueChange={(value) => handleTelhaChange(telha.id, "largura", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a largura" />
                            </SelectTrigger>
                            <SelectContent>
                              {larguras.map((largura) => (
                                <SelectItem key={largura} value={largura}>
                                  {largura}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`quantidade-${telha.id}`}>Quantidade (unidades)</Label>
                          <Input
                            id={`quantidade-${telha.id}`}
                            type="number"
                            min="0"
                            value={telha.quantidade.toString()}
                            onChange={(e) => handleTelhaChange(telha.id, "quantidade", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`area-${telha.id}`}>Área Total (m²)</Label>
                          <Input
                            id={`area-${telha.id}`}
                            type="number"
                            value={telha.area?.toFixed(2) || "0.00"}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={adicionarTelha}
                    className="w-full"
                  >
                    Adicionar Outro Tipo de Telha
                  </Button>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("dados")}
                >
                  <span className="mr-2">&larr;</span> Voltar: Dados
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("problemas")}
                >
                  Próximo: Problemas <span className="ml-2">&rarr;</span>
                </Button>
              </div>
            </TabsContent>
            
            {/* Aba 3: Problemas */}
            <TabsContent value="problemas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Problemas Identificados</CardTitle>
                  <CardDescription>
                    Selecione os problemas encontrados durante a vistoria técnica.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formErrors.problemas && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-4">
                      <p className="text-sm text-red-600">{formErrors.problemas}</p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {formData.problemas.map((problema) => (
                      <div key={problema.id} className="border rounded-md p-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`problema-${problema.id}`}
                            checked={problema.selecionado}
                            onCheckedChange={(checked) => 
                              handleProblemaToggle(problema.id, checked === true)
                            }
                          />
                          <Label htmlFor={`problema-${problema.id}`} className="font-medium">
                            {problema.tipo}
                          </Label>
                        </div>
                        
                        <div className="mt-2 pl-7 text-sm text-muted-foreground">
                          {problema.descricao}
                        </div>
                        
                        {problema.selecionado && (
                          <div className="mt-4 pl-7 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`observacoes-${problema.id}`}>Observações Específicas</Label>
                              <Textarea
                                id={`observacoes-${problema.id}`}
                                placeholder="Descreva detalhes adicionais sobre este problema..."
                                value={problema.observacoes}
                                onChange={(e) => handleProblemaObservacao(problema.id, e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Evidências Fotográficas</Label>
                              <div className="flex flex-wrap gap-2">
                                {problema.imagens.map((img, imgIndex) => (
                                  <div 
                                    key={`img-${problema.id}-${imgIndex}`} 
                                    className="relative border rounded-md overflow-hidden"
                                    style={{ width: "100px", height: "100px" }}
                                  >
                                    <img 
                                      src={img} 
                                      alt={`Evidência ${imgIndex + 1}`} 
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => openImagePreview(problema.id, img)}
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-1 right-1 h-6 w-6 p-0"
                                      onClick={() => handleRemoveImage(problema.id, imgIndex)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                
                                {problema.imagens.length < 3 && (
                                  <>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="border-dashed border-2 flex flex-col items-center justify-center gap-1 p-0"
                                      style={{ width: "100px", height: "100px" }}
                                      onClick={() => captureImage(problema.id)}
                                    >
                                      <Camera className="h-4 w-4" />
                                      <span className="text-xs">Câmera</span>
                                    </Button>
                                    
                                    <input
                                      id={`camera-${problema.id}`}
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      className="hidden"
                                      onChange={(e) => handleFileUpload(problema.id, e)}
                                    />
                                    
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="border-dashed border-2 flex flex-col items-center justify-center gap-1 p-0"
                                      style={{ width: "100px", height: "100px" }}
                                      onClick={() => {
                                        const input = document.getElementById(`file-${problema.id}`);
                                        if (input) input.click();
                                      }}
                                    >
                                      <ImageIcon className="h-4 w-4" />
                                      <span className="text-xs">Galeria</span>
                                    </Button>
                                    
                                    <input
                                      id={`file-${problema.id}`}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      multiple
                                      onChange={(e) => handleFileUpload(problema.id, e)}
                                    />
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Máximo de 3 imagens por problema e 12 no total.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("telhas")}
                >
                  <span className="mr-2">&larr;</span> Voltar: Telhas
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("conclusao")}
                >
                  Próximo: Conclusão <span className="ml-2">&rarr;</span>
                </Button>
              </div>
            </TabsContent>
            
            {/* Aba 4: Conclusão */}
            <TabsContent value="conclusao" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Técnica</CardTitle>
                  <CardDescription>
                    Textos de introdução e análise técnica para o relatório.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="introducao">Introdução</Label>
                    <Textarea
                      id="introducao"
                      name="introducao"
                      value={formData.introducao}
                      onChange={handleInputChange}
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="analiseTecnica">Análise Técnica</Label>
                    <Textarea
                      id="analiseTecnica"
                      name="analiseTecnica"
                      value={formData.analiseTecnica}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conclusões e Recomendações</CardTitle>
                  <CardDescription>
                    Finalize seu relatório com conclusões e recomendações técnicas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conclusao">Conclusão</Label>
                    <Textarea
                      id="conclusao"
                      name="conclusao"
                      placeholder="Descreva as conclusões da vistoria técnica..."
                      value={formData.conclusao}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recomendacao">Recomendações</Label>
                    <Textarea
                      id="recomendacao"
                      name="recomendacao"
                      placeholder="Recomendações para o cliente..."
                      value={formData.recomendacao}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoesGerais">Observações Gerais</Label>
                    <Textarea
                      id="observacoesGerais"
                      name="observacoesGerais"
                      placeholder="Observações adicionais..."
                      value={formData.observacoesGerais}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label>Garantia</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="anosGarantia">Anos de Garantia (Básica)</Label>
                        <Select
                          value={formData.anosGarantia}
                          onValueChange={(value) => handleSelectChange("anosGarantia", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {["1", "2", "3", "4", "5"].map((ano) => (
                              <SelectItem key={ano} value={ano}>
                                {ano} {parseInt(ano) === 1 ? "ano" : "anos"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="anosGarantiaSistemaCompleto">Garantia (Sistema Completo)</Label>
                        <Select
                          value={formData.anosGarantiaSistemaCompleto}
                          onValueChange={(value) => handleSelectChange("anosGarantiaSistemaCompleto", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {["5", "7", "10", "15"].map((ano) => (
                              <SelectItem key={ano} value={ano}>
                                {ano} anos
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="anosGarantiaTotal">Garantia (Total)</Label>
                        <Select
                          value={formData.anosGarantiaTotal}
                          onValueChange={(value) => handleSelectChange("anosGarantiaTotal", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {["5", "7", "10", "15"].map((ano) => (
                              <SelectItem key={ano} value={ano}>
                                {ano} anos
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="resultado">Parecer Final</Label>
                    <div className="pt-2 flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="resultado-improcedente"
                          name="resultado"
                          value="IMPROCEDENTE"
                          className="h-4 w-4 text-blue-600"
                          checked={formData.resultado === "IMPROCEDENTE"}
                          onChange={() => handleSelectChange("resultado", "IMPROCEDENTE")}
                        />
                        <label
                          htmlFor="resultado-improcedente"
                          className="ml-2 block text-sm"
                        >
                          IMPROCEDENTE (não é problema do produto)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="resultado-procedente"
                          name="resultado"
                          value="PROCEDENTE"
                          className="h-4 w-4 text-blue-600"
                          checked={formData.resultado === "PROCEDENTE"}
                          onChange={() => handleSelectChange("resultado", "PROCEDENTE")}
                        />
                        <label
                          htmlFor="resultado-procedente"
                          className="ml-2 block text-sm"
                        >
                          PROCEDENTE (problema relacionado ao produto)
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-6 flex flex-col md:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={() => setActiveTab("problemas")}
                  >
                    <span className="mr-2">&larr;</span> Voltar: Problemas
                  </Button>
                  
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingAnimation size="sm" className="mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Relatório
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
        
        {/* Modal para visualização de imagens */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewProblema}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Visualização da imagem"
                  className="max-w-full h-auto mx-auto"
                  style={{ maxHeight: "calc(90vh - 200px)" }}
                />
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Fechar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayoutNew>
    </PageTransition>
  );
};

export default VistoriaFARPage;