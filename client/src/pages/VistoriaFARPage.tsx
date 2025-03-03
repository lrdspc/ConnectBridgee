import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Header from "../components/layout/Header";
import { useVisits } from "../hooks/useVisits";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus, VisitPhoto } from "../lib/db";
import { Card } from "@/components/ui/card";
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
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { 
  problemasPredefinidosFAR, 
  modelosTelhasFAR, 
  espessurasTelhasFAR,
  FARReport
} from "../../../shared/farReportSchema";
import { generateFARReport } from "../lib/farReportGenerator";

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
    
    problemas: problemasPredefinidosFAR.map((problema: {id: string, tipo: string, descricao: string}) => ({
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
        
        // Pré-carregar dados de visitas para garantir que estamos com dados atualizados
        console.log('Pré-carregando dados de visitas...');
        await queryClient.prefetchQuery({ queryKey: ["visits"] });
        console.log('Dados de visitas pré-carregados com sucesso');
      } catch (error) {
        console.error("Erro na inicialização da página:", error);
      }
    };
    
    inicializarPagina();
  }, [queryClient]);
  
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
        
        // Verificar o tamanho da imagem comprimida
        const sizeInMB = (compressedDataUrl.length * 0.75) / (1024 * 1024);
        console.log(`Tamanho da imagem após compressão: ${sizeInMB.toFixed(2)}MB`);
        
        // Se ainda for muito grande, tentar comprimir mais
        let finalDataUrl = compressedDataUrl;
        if (sizeInMB > 1.5) {
          console.log('Comprimindo mais a imagem...');
          finalDataUrl = await compressImage(compressedDataUrl, 800, 0.5);
          const newSizeInMB = (finalDataUrl.length * 0.75) / (1024 * 1024);
          console.log(`Novo tamanho após compressão adicional: ${newSizeInMB.toFixed(2)}MB`);
        }
        
        dataUrls.push(finalDataUrl);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        toast({
          title: "Erro ao processar imagem",
          description: error instanceof Error ? error.message : "Erro desconhecido ao processar imagem",
          variant: "destructive"
        });
      }
    }
    
    if (dataUrls.length === 0) return;
    
    setFormData(prev => {
      const problemas = prev.problemas.map(problema => {
        if (problema.id === id) {
          // Garantir que não estejamos excedendo o limite de 3 imagens por problema
          const currentImages = problema.imagens;
          const availableSlots = 3 - currentImages.length;
          const imagesToAdd = dataUrls.slice(0, availableSlots);
          
          return { 
            ...problema, 
            imagens: [...currentImages, ...imagesToAdd] 
          };
        }
        return problema;
      });
      
      return { ...prev, problemas };
    });
    
    // Limpar o input após o upload
    event.target.value = '';
    
    toast({
      title: "Imagens adicionadas",
      description: `${dataUrls.length} ${dataUrls.length === 1 ? 'imagem adicionada' : 'imagens adicionadas'} com sucesso.`
    });
  };
  
  const removerImagem = (problemaId: string, index: number) => {
    setFormData(prev => {
      const problemas = prev.problemas.map(problema => {
        if (problema.id === problemaId) {
          const imagens = [...problema.imagens];
          imagens.splice(index, 1);
          return { ...problema, imagens };
        }
        return problema;
      });
      
      return { ...prev, problemas };
    });
  };
  
  const openImagePreview = (problemaId: string, imageUrl: string) => {
    const problema = formData.problemas.find(p => p.id === problemaId);
    if (problema) {
      setPreviewProblema(problema.tipo);
      setPreviewImage(imageUrl);
      setPreviewDialogOpen(true);
    }
  };
  
  // Função para gerar dados de teste
  const preencherDadosTeste = async () => {
    // Gera uma imagem de teste simples (um retângulo colorido)
    const gerarImagemTeste = (cor: string = '#3B82F6'): string => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Desenhar fundo
        ctx.fillStyle = cor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar texto
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Imagem de Teste', 20, 30);
        ctx.fillText('Brasilit', 20, 60);
        
        // Desenhar padrão para simular textura
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * 20);
          ctx.lineTo(300, i * 20);
          ctx.stroke();
        }
      }
      return canvas.toDataURL('image/png');
    };
    
    // Dados para teste
    const dadosTeste: FormData = {
      dataVistoria: new Date().toISOString().split('T')[0],
      cliente: "Construtora Horizonte LTDA",
      empreendimento: "Residencial",
      cidade: "São Paulo",
      uf: "SP",
      endereco: "Av. Paulista, 1578, Bela Vista",
      farProtocolo: "FAR-2025-00734",
      assunto: "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
      
      elaboradoPor: formData.elaboradoPor || "Carlos Silva",
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
          quantidade: 120,
          area: 322.08 // 2.44 * 1.10 * 120
        },
        {
          id: uuidv4(),
          modelo: "Kalhetão",
          espessura: "8mm",
          comprimento: "3,05m",
          largura: "0,92m",
          quantidade: 45,
          area: 126.17 // 3.05 * 0.92 * 45
        }
      ],
      
      problemas: formData.problemas.map((problema, index) => {
        // Selecionar alguns problemas aleatoriamente
        const selecionado = index % 3 === 0;
        const imagens = selecionado ? 
          [gerarImagemTeste('#3B82F6'), gerarImagemTeste('#EF4444')] : 
          [];
        
        return {
          ...problema,
          observacoes: selecionado ? 
            `Observação para o problema ${problema.tipo}: Foi identificado durante a inspeção que houve falha na instalação.` : 
            "",
          imagens,
          selecionado
        };
      }),
      
      introducao: textoIntroducao,
      analiseTecnica: textoAnaliseTecnica,
      
      conclusao: "As telhas apresentam danos causados principalmente por instalação inadequada.",
      recomendacao: "Recomenda-se a substituição das telhas danificadas e reforço da estrutura.",
      observacoesGerais: "Inspeção realizada em condições climáticas normais. Cliente acompanhou a vistoria.",
      
      anosGarantia: "5",
      anosGarantiaSistemaCompleto: "10",
      anosGarantiaTotal: "10",
      
      resultado: "IMPROCEDENTE"
    };
    
    // Atualizar o formulário com os dados de teste
    setFormData(dadosTeste);
    
    // Exibir notificação
    toast({
      title: "Dados de teste preenchidos",
      description: "O formulário foi preenchido com dados fictícios para teste.",
    });
  };
  
  const validarFormulario = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    // Validar dados básicos
    if (!formData.dataVistoria) errors.dataVistoria = "Data de vistoria é obrigatória";
    if (!formData.cliente.trim()) errors.cliente = "Nome do cliente é obrigatório";
    if (!formData.empreendimento.trim()) errors.empreendimento = "Tipo de empreendimento é obrigatório";
    if (!formData.cidade.trim()) errors.cidade = "Cidade é obrigatória";
    if (!formData.uf) errors.uf = "UF é obrigatória";
    if (!formData.endereco.trim()) errors.endereco = "Endereço é obrigatório";
    if (!formData.farProtocolo.trim()) errors.farProtocolo = "Número FAR/Protocolo é obrigatório";
    
    // Validar dados do responsável
    if (!formData.elaboradoPor.trim()) errors.elaboradoPor = "Nome do responsável é obrigatório";
    if (!formData.departamento.trim()) errors.departamento = "Departamento é obrigatório";
    if (!formData.regional) errors.regional = "Regional é obrigatória";
    if (!formData.unidade) errors.unidade = "Unidade é obrigatória";
    
    // Validar telhas
    if (formData.telhas.length === 0) {
      errors.telhas = "Adicione pelo menos um tipo de telha";
    } else {
      const telhasInvalidas = formData.telhas.some(telha => 
        !telha.modelo || !telha.espessura || !telha.comprimento || 
        !telha.largura || telha.quantidade <= 0
      );
      
      if (telhasInvalidas) {
        errors.telhas = "Preencha corretamente todos os dados das telhas";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Função para gerar o relatório em formato Word
  const handleGenerateDocxReport = async () => {
    try {
      setIsSubmitting(true);
      
      if (!validarFormulario()) {
        // Exibir erro ao usuário
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha os campos obrigatórios para gerar o relatório.",
          variant: "destructive"
        });
        return;
      }
      
      // Converter os dados do formulário para o formato esperado pelo gerador de relatórios
      const farReport: FARReport = {
        dataVistoria: formData.dataVistoria,
        farProtocolo: formData.farProtocolo,
        assunto: formData.assunto,
        cliente: formData.cliente,
        empreendimento: formData.empreendimento,
        cidade: formData.cidade,
        uf: formData.uf,
        endereco: formData.endereco,
        elaboradoPor: formData.elaboradoPor,
        departamento: formData.departamento,
        regional: formData.regional,
        unidade: formData.unidade,
        coordenador: formData.coordenador,
        gerente: formData.gerente,
        telhas: formData.telhas,
        problemas: formData.problemas,
        introducao: formData.introducao,
        analiseTecnica: formData.analiseTecnica,
        conclusao: formData.conclusao,
        recomendacao: formData.recomendacao,
        observacoesGerais: formData.observacoesGerais,
        anosGarantia: formData.anosGarantia,
        anosGarantiaSistemaCompleto: formData.anosGarantiaSistemaCompleto,
        anosGarantiaTotal: formData.anosGarantiaTotal,
        resultado: formData.resultado as "PROCEDENTE" | "IMPROCEDENTE",
        status: "draft"
      };
      
      // Gerar o relatório
      const docBlob = await generateFARReport(farReport);
      
      // Criar um URL para o blob e fazer download
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatório FAR - ${formData.cliente} - ${formData.farProtocolo}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório gerado com sucesso",
        description: "O documento Word foi gerado e está sendo baixado.",
      });
    } catch (error) {
      console.error("Erro ao gerar relatório Word:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o documento Word.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      // Exibir erro ao usuário
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Processar as imagens antes de criar o objeto de visita
      // Limitar o tamanho das imagens para evitar problemas de armazenamento
      const processedPhotos: VisitPhoto[] = [];
      
      // Verificar o número total de imagens a serem processadas
      const totalImagens = formData.problemas
        .filter(p => p.selecionado)
        .reduce((total, p) => total + p.imagens.length, 0);
      
      console.log(`Total de imagens a processar: ${totalImagens}`);
      
      // Limitar o número total de imagens para evitar problemas de tamanho
      const MAX_TOTAL_IMAGES = 12;
      if (totalImagens > MAX_TOTAL_IMAGES) {
        throw new Error(`Muitas imagens (${totalImagens}). O limite é de ${MAX_TOTAL_IMAGES} imagens no total. Remova algumas imagens e tente novamente.`);
      }
      
      for (const problema of formData.problemas) {
        if (problema.selecionado && problema.imagens.length > 0) {
          // Limitar a 3 imagens por problema para reduzir o peso total
          const limitedImages = problema.imagens.slice(0, 3);
          
          for (let i = 0; i < limitedImages.length; i++) {
            try {
              // Verificar se a URL da imagem é válida
              if (!limitedImages[i] || !limitedImages[i].startsWith('data:image/')) {
                console.warn(`Imagem inválida para o problema ${problema.tipo}`);
                continue;
              }
              
              // Verificar se o tamanho da string da imagem não é excessivo
              const tamanhoAprox = limitedImages[i].length * 0.75 / (1024 * 1024);
              if (tamanhoAprox > 2) {
                console.warn(`Imagem muito grande (~${tamanhoAprox.toFixed(1)}MB) para o problema ${problema.tipo}`);
                throw new Error(`Uma das imagens é muito grande (~${tamanhoAprox.toFixed(1)}MB). O limite é de 2MB por imagem.`);
              }
              
              processedPhotos.push({
                id: uuidv4(),
                dataUrl: limitedImages[i],
                timestamp: new Date().toISOString(),
                notes: `${problema.tipo} - Imagem ${i + 1}`
              });
            } catch (imgError) {
              console.error('Erro ao processar imagem:', imgError);
              throw new Error(`Erro ao processar imagem do problema "${problema.tipo}": ${imgError instanceof Error ? imgError.message : 'formato inválido'}`);
            }
          }
        }
      }
      
      console.log(`Processadas ${processedPhotos.length} imagens para salvar`);
      
      // Preparar dados da visita a partir dos dados do formulário
      const newVisit: Omit<Visit, "id"> = {
        clientName: formData.cliente,
        address: `${formData.endereco}, ${formData.cidade} - ${formData.uf}`,
        date: formData.dataVistoria || new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        type: "inspection",
        status: "completed",
        priority: "normal",
        description: `${formData.empreendimento} - ${formData.assunto}`,
        contactInfo: formData.farProtocolo,
        checklist: [
          { id: '1', text: 'Vistoria realizada', description: 'Vistoria técnica FAR concluída', completed: true }
        ],
        photos: processedPhotos,
        documents: [],
        notes: `Vistoria Técnica FAR
Data: ${formData.dataVistoria}
Cliente: ${formData.cliente}
Empreendimento: ${formData.empreendimento}
Endereço: ${formData.endereco}, ${formData.cidade} - ${formData.uf}
Protocolo FAR: ${formData.farProtocolo}
Assunto: ${formData.assunto}

Responsável: ${formData.elaboradoPor}
Departamento: ${formData.departamento}
Regional: ${formData.regional}
Unidade: ${formData.unidade}

Especificações das Telhas:
${formData.telhas.map(t => 
  `- Modelo: ${t.modelo}, Espessura: ${t.espessura}, Dimensões: ${t.comprimento} x ${t.largura}, Quantidade: ${t.quantidade}`
).join('\n')}

Problemas Identificados:
${formData.problemas.filter(p => p.selecionado).map(p => 
  `- ${p.tipo}: ${p.descricao}\n  Observações: ${p.observacoes || 'Nenhuma'}`
).join('\n')}

Conclusão: ${formData.resultado}
Recomendação: ${formData.recomendacao}
Observações Gerais: ${formData.observacoesGerais}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        synced: false
      };
      
      console.log('Iniciando salvamento da vistoria...');
      
      // Salvar visita no sistema
      try {
        // Converter o objeto para string JSON para verificar se é serializável
        try {
          const jsonString = JSON.stringify(newVisit);
          console.log(`Tamanho da visita em JSON: ${(jsonString.length / (1024 * 1024)).toFixed(2)}MB`);
          
          // Se o JSON for muito grande, rejeitar
          if (jsonString.length > 15 * 1024 * 1024) {
            throw new Error(`Dados muito grandes (${(jsonString.length / (1024 * 1024)).toFixed(2)}MB). O limite é de 15MB.`);
          }
        } catch (jsonError) {
          console.error('Erro ao serializar visita:', jsonError);
          throw new Error('Falha ao converter dados para JSON. Verifique se as imagens estão em formato válido.');
        }
        
        console.log('Chamando createVisit.mutateAsync...');
        const result = await createVisit.mutateAsync(newVisit);
        
        // Verificar se a visita foi criada corretamente
        if (result && result.id) {
          console.log('Visita criada com sucesso, ID:', result.id);
          
          toast({
            title: "Vistoria salva",
            description: "A vistoria FAR foi registrada com sucesso!",
          });
          
          // Invalidar queries para forçar atualização de dados
          console.log('Atualizando cache de dados...');
          await queryClient.invalidateQueries({ queryKey: ["visits"] });
          
          // Buscar proativamente os dados atualizados antes de redirecionar
          console.log('Pré-carregando dados atualizados...');
          await queryClient.fetchQuery({ queryKey: ["visits"] });
          
          console.log('Redirecionando para /reports...');
          // Redirecionar para relatórios após garantir que o cache está atualizado
          setLocation("/relatorios");
        } else {
          throw new Error("Resultado de createVisit está incompleto. ID não gerado.");
        }
      } catch (error: any) {
        console.error("Erro específico ao salvar vistoria:", error?.message || error);
        
        // Verificar se é um erro por tamanho excessivo
        const errorMsg = error?.message || String(error);
        if (errorMsg.toLowerCase().includes("size") || errorMsg.toLowerCase().includes("tamanho")) {
          throw new Error("Imagens muito grandes. Tente reduzir a quantidade ou tamanho das fotos.");
        } else if (errorMsg.includes("Unexpected token")) {
          throw new Error("Erro de formatação JSON. Alguma imagem pode estar em formato inválido.");
        } else if (errorMsg.includes("network") || errorMsg.includes("rede")) {
          throw new Error("Erro de rede ao salvar. Verifique sua conexão e tente novamente.");
        } else {
          throw error; // Re-throw para ser capturado pelo catch externo
        }
      }
    } catch (error: any) {
      console.error("Erro ao salvar vistoria:", error);
      
      // Mensagem de erro mais específica para o usuário
      const errorMessage = error?.message || "Ocorreu um erro ao salvar a vistoria. Tente novamente.";
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Se for um erro relacionado a imagens, sugerir solução
      if (
        errorMessage.toLowerCase().includes("imagem") || 
        errorMessage.toLowerCase().includes("foto") ||
        errorMessage.toLowerCase().includes("size") || 
        errorMessage.toLowerCase().includes("tamanho")
      ) {
        setTimeout(() => {
          toast({
            title: "Dica",
            description: "Tente limitar o número de fotos ou usar imagens de menor resolução.",
          });
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="page page-transition" id="vistoriaFAR">
      <Header title="Vistoria Técnica FAR" showBackButton={true} />
      
      <div className="p-4">
        <Tabs defaultValue="dados" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="telhas">Telhas</TabsTrigger>
              <TabsTrigger value="problemas">Problemas</TabsTrigger>
            </TabsList>
            
            <Button
              type="button"
              variant="secondary"
              className="text-sm flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={preencherDadosTeste}
            >
              <span className="hidden sm:inline">Preencher</span> Dados de Teste
            </Button>
          </div>
          
          <form id="vistoriaFARForm" onSubmit={handleSubmit}>
            <TabsContent value="dados">
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Dados da Vistoria</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
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
                      <p className="text-red-500 text-xs mt-1">{formErrors.dataVistoria}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="farProtocolo">Protocolo FAR</Label>
                    <Input
                      id="farProtocolo"
                      name="farProtocolo"
                      value={formData.farProtocolo}
                      onChange={handleInputChange}
                      placeholder="Ex: FAR-2025-00123"
                      className={formErrors.farProtocolo ? "border-red-500" : ""}
                    />
                    {formErrors.farProtocolo && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.farProtocolo}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    placeholder="Nome do cliente"
                    className={formErrors.cliente ? "border-red-500" : ""}
                  />
                  {formErrors.cliente && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cliente}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="empreendimento">Tipo de Empreendimento</Label>
                  <Select
                    value={formData.empreendimento}
                    onValueChange={(value) => handleSelectChange("empreendimento", value)}
                  >
                    <SelectTrigger className={formErrors.empreendimento ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residencial">Residencial</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Institucional">Institucional</SelectItem>
                      <SelectItem value="Misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.empreendimento && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.empreendimento}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Nome da cidade"
                      className={formErrors.cidade ? "border-red-500" : ""}
                    />
                    {formErrors.cidade && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.cidade}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="uf">UF</Label>
                    <Select
                      value={formData.uf}
                      onValueChange={(value) => handleSelectChange("uf", value)}
                    >
                      <SelectTrigger className={formErrors.uf ? "border-red-500" : ""}>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {ufs.map(uf => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.uf && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.uf}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    placeholder="Endereço completo"
                    className={formErrors.endereco ? "border-red-500" : ""}
                  />
                  {formErrors.endereco && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.endereco}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleInputChange}
                    placeholder="Ex: AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"
                  />
                </div>
              </Card>
              
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Dados do Responsável</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="elaboradoPor">Elaborado por</Label>
                    <Input
                      id="elaboradoPor"
                      name="elaboradoPor"
                      value={formData.elaboradoPor}
                      onChange={handleInputChange}
                      placeholder="Nome do técnico"
                      className={formErrors.elaboradoPor ? "border-red-500" : ""}
                    />
                    {formErrors.elaboradoPor && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.elaboradoPor}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      placeholder="Departamento"
                      className={formErrors.departamento ? "border-red-500" : ""}
                    />
                    {formErrors.departamento && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.departamento}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="regional">Regional</Label>
                    <Select
                      value={formData.regional}
                      onValueChange={(value) => handleSelectChange("regional", value)}
                    >
                      <SelectTrigger className={formErrors.regional ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione a regional" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionais.map(regional => (
                          <SelectItem key={regional} value={regional}>{regional}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.regional && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.regional}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select
                      value={formData.unidade}
                      onValueChange={(value) => handleSelectChange("unidade", value)}
                      disabled={!formData.regional}
                    >
                      <SelectTrigger className={formErrors.unidade ? "border-red-500" : ""}>
                        <SelectValue placeholder={formData.regional ? "Selecione a unidade" : "Selecione primeiro a regional"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.regional && unidadesPorRegional[formData.regional]?.map(unidade => (
                          <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.unidade && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.unidade}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coordenador">Coordenador</Label>
                    <Input
                      id="coordenador"
                      name="coordenador"
                      value={formData.coordenador}
                      onChange={handleInputChange}
                      placeholder="Nome do coordenador"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gerente">Gerente</Label>
                    <Input
                      id="gerente"
                      name="gerente"
                      value={formData.gerente}
                      onChange={handleInputChange}
                      placeholder="Nome do gerente"
                    />
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('telhas')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="telhas">
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Informações sobre Telhas</h2>
                
                {formErrors.telhas && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
                    <p>{formErrors.telhas}</p>
                  </div>
                )}
                
                {formData.telhas.map((telha, index) => (
                  <div key={telha.id} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
                    <div className="absolute -top-3 left-2 bg-white px-2">
                      <Badge variant="secondary">Telha {index + 1}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`modelo-${telha.id}`}>Modelo</Label>
                        <Select
                          value={telha.modelo}
                          onValueChange={(value) => handleTelhaChange(telha.id, "modelo", value)}
                        >
                          <SelectTrigger id={`modelo-${telha.id}`}>
                            <SelectValue placeholder="Selecione o modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            {modelosTelhasFAR.map((modelo: { valor: string; nome: string }) => (
                              <SelectItem key={modelo.valor} value={modelo.valor}>{modelo.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`espessura-${telha.id}`}>Espessura</Label>
                        <Select
                          value={telha.espessura}
                          onValueChange={(value) => handleTelhaChange(telha.id, "espessura", value)}
                        >
                          <SelectTrigger id={`espessura-${telha.id}`}>
                            <SelectValue placeholder="Selecione a espessura" />
                          </SelectTrigger>
                          <SelectContent>
                            {espessurasTelhasFAR.map((espessura: { valor: string; nome: string }) => (
                              <SelectItem key={espessura.valor} value={espessura.valor}>{espessura.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`comprimento-${telha.id}`}>Comprimento</Label>
                        <Select
                          value={telha.comprimento}
                          onValueChange={(value) => handleTelhaChange(telha.id, "comprimento", value)}
                        >
                          <SelectTrigger id={`comprimento-${telha.id}`}>
                            <SelectValue placeholder="Selecione o comprimento" />
                          </SelectTrigger>
                          <SelectContent>
                            {(telha.espessura === "5mm" ? comprimentos5mm : comprimentos6e8mm).map(comprimento => (
                              <SelectItem key={comprimento} value={comprimento}>{comprimento}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`largura-${telha.id}`}>Largura</Label>
                        <Select
                          value={telha.largura}
                          onValueChange={(value) => handleTelhaChange(telha.id, "largura", value)}
                        >
                          <SelectTrigger id={`largura-${telha.id}`}>
                            <SelectValue placeholder="Selecione a largura" />
                          </SelectTrigger>
                          <SelectContent>
                            {larguras.map(largura => (
                              <SelectItem key={largura} value={largura}>{largura}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <Label htmlFor={`quantidade-${telha.id}`}>Quantidade</Label>
                        <Input
                          id={`quantidade-${telha.id}`}
                          type="number"
                          min="1"
                          value={telha.quantidade || ""}
                          onChange={(e) => handleTelhaChange(telha.id, "quantidade", parseInt(e.target.value) || 0)}
                          placeholder="Quantidade de telhas"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`area-${telha.id}`}>Área Total (m²)</Label>
                        <Input
                          id={`area-${telha.id}`}
                          type="number"
                          value={telha.area?.toFixed(2) || ""}
                          readOnly
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Calculado automaticamente</p>
                      </div>
                    </div>
                    
                    {formData.telhas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removerTelha(telha.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={adicionarTelha}
                >
                  + Adicionar outro tipo de telha
                </Button>
              </Card>
              
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Garantia</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="anosGarantia">Anos de Garantia</Label>
                    <Input
                      id="anosGarantia"
                      name="anosGarantia"
                      value={formData.anosGarantia}
                      onChange={handleInputChange}
                      placeholder="Anos"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="anosGarantiaSistemaCompleto">Garantia Sistema Completo</Label>
                    <Input
                      id="anosGarantiaSistemaCompleto"
                      name="anosGarantiaSistemaCompleto"
                      value={formData.anosGarantiaSistemaCompleto}
                      onChange={handleInputChange}
                      placeholder="Anos"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="anosGarantiaTotal">Garantia Total</Label>
                    <Input
                      id="anosGarantiaTotal"
                      name="anosGarantiaTotal"
                      value={formData.anosGarantiaTotal}
                      onChange={handleInputChange}
                      placeholder="Anos"
                    />
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('dados')}
                >
                  Anterior
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('problemas')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="problemas">
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Problemas Identificados</h2>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Identificado
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Problema
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fotos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.problemas.map((problema) => (
                        <tr key={problema.id} className={problema.selecionado ? "bg-blue-50" : ""}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <Checkbox 
                              id={`problema-${problema.id}`}
                              checked={problema.selecionado}
                              onCheckedChange={(checked) => handleProblemaToggle(problema.id, checked === true)}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <label 
                              htmlFor={`problema-${problema.id}`} 
                              className="font-medium cursor-pointer hover:text-blue-600"
                            >
                              {problema.tipo}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{problema.descricao}</p>
                            
                            {problema.selecionado && (
                              <div className="mt-2">
                                <Textarea
                                  placeholder="Observações adicionais sobre este problema..."
                                  value={problema.observacoes}
                                  onChange={(e) => handleProblemaObservacao(problema.id, e.target.value)}
                                  className="text-sm"
                                  rows={2}
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {problema.selecionado && (
                              <div>
                                <div className="flex flex-wrap gap-2 my-2">
                                  {problema.imagens.map((img, index) => (
                                    <div 
                                      key={index} 
                                      className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden group"
                                      onClick={() => openImagePreview(problema.id, img)}
                                    >
                                      <img 
                                        src={img} 
                                        alt={`Foto ${index + 1} - ${problema.tipo}`} 
                                        className="w-full h-full object-cover cursor-pointer"
                                      />
                                      <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removerImagem(problema.id, index);
                                        }}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => captureImage(problema.id)}
                                    className="text-xs"
                                  >
                                    <Camera className="w-3 h-3 mr-1" />
                                    Foto
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      const fileInput = document.getElementById(`file-${problema.id}`) as HTMLInputElement;
                                      if (fileInput) fileInput.click();
                                    }}
                                    className="text-xs"
                                  >
                                    <ImageIcon className="w-3 h-3 mr-1" />
                                    Galeria
                                  </Button>
                                  
                                  {/* Input oculto para seleção de arquivo */}
                                  <input
                                    id={`file-${problema.id}`}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(problema.id, e)}
                                  />
                                  
                                  {/* Input oculto para captura de câmera */}
                                  <input
                                    id={`camera-${problema.id}`}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(problema.id, e)}
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              
              <Card className="p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Conclusão e Recomendações</h2>
                
                <div className="mb-4">
                  <Label htmlFor="resultado">Resultado da Reclamação</Label>
                  <Select
                    value={formData.resultado}
                    onValueChange={(value: "PROCEDENTE" | "IMPROCEDENTE") => handleSelectChange("resultado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCEDENTE">PROCEDENTE</SelectItem>
                      <SelectItem value="IMPROCEDENTE">IMPROCEDENTE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="conclusao">Conclusão</Label>
                  <Textarea
                    id="conclusao"
                    name="conclusao"
                    value={formData.conclusao}
                    onChange={handleInputChange}
                    placeholder="Conclusão da análise técnica"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="recomendacao">Recomendações</Label>
                  <Textarea
                    id="recomendacao"
                    name="recomendacao"
                    value={formData.recomendacao}
                    onChange={handleInputChange}
                    placeholder="Recomendações técnicas"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="observacoesGerais">Observações Gerais</Label>
                  <Textarea
                    id="observacoesGerais"
                    name="observacoesGerais"
                    value={formData.observacoesGerais}
                    onChange={handleInputChange}
                    placeholder="Observações adicionais"
                    rows={3}
                  />
                </div>
              </Card>
              
              <div className="flex justify-between gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('telhas')}
                >
                  Anterior
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingAnimation size="sm" className="mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Vistoria
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </div>
      
      {/* Modal de visualização de imagem */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>{previewProblema}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex items-center justify-center">
              <img 
                src={previewImage} 
                alt={previewProblema} 
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VistoriaFARPage;