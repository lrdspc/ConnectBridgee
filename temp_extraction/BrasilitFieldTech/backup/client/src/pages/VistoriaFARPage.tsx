import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Header from "../components/layout/Header";
import { useVisits } from "../hooks/useVisits";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus } from "../lib/db";
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
import { X, Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

type VisitType = 'installation' | 'maintenance' | 'inspection' | 'repair' | 'emergency';
type VisitPriority = 'normal' | 'high' | 'urgent';

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
  
  // Informações sobre Telhas
  telhas: TelhaSpec[];
  
  // Problemas Identificados
  problemas: ProblemaIdentificado[];
};

const modelosTelha = ["Ondulada", "Kalhetão", "Maxiplac", "Outro"];
const espessuras = ["5mm", "6mm", "8mm"];
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

const tiposProblemas = [
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

const VistoriaFARPage = () => {
  const [, setLocation] = useLocation();
  const { createVisit } = useVisits();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'telhas' | 'problemas'>('dados');
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
    assunto: "",
    
    elaboradoPor: "",
    departamento: "Assistência Técnica",
    regional: "",
    unidade: "",
    
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
    
    problemas: tiposProblemas.map(problema => ({
      ...problema,
      observacoes: "",
      imagens: [],
      selecionado: false
    }))
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
  
  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    const dataUrls: string[] = [];
    
    for (const file of files) {
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
          title: "Arquivo muito grande",
          description: "O tamanho máximo da imagem é de 5MB.",
          variant: "destructive"
        });
        continue;
      }
      
      const reader = new FileReader();
      
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
      
      dataUrls.push(dataUrl);
    }
    
    if (dataUrls.length === 0) return;
    
    setFormData(prev => {
      const problemas = prev.problemas.map(problema => {
        if (problema.id === id) {
          return { 
            ...problema, 
            imagens: [...problema.imagens, ...dataUrls] 
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
      })
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      // Determinar para qual aba devemos redirecionar com base nos erros
      if (formErrors.telhas) {
        setActiveTab('telhas');
      } else if (Object.keys(formErrors).some(key => 
        ['dataVistoria', 'cliente', 'empreendimento', 'cidade', 'uf', 'endereco', 'farProtocolo', 
         'elaboradoPor', 'departamento', 'regional', 'unidade'].includes(key)
      )) {
        setActiveTab('dados');
      }
      
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Preparar dados da visita
      const newVisit: Omit<Visit, "id"> = {
        clientName: formData.cliente,
        address: `${formData.endereco}, ${formData.cidade} - ${formData.uf}`,
        date: formData.dataVistoria,
        time: new Date().toTimeString().substring(0, 5),
        type: "inspection" as VisitType,
        status: "completed" as VisitStatus,
        priority: "normal" as VisitPriority,
        description: `${formData.empreendimento} - ${formData.assunto}`,
        contactInfo: formData.farProtocolo,
        checklist: [
          { id: '1', text: 'Vistoria realizada', description: 'Vistoria técnica FAR concluída', completed: true }
        ],
        photos: formData.problemas
          .filter(p => p.selecionado && p.imagens.length > 0)
          .flatMap(p => p.imagens.map((img, index) => ({
            id: uuidv4(),
            dataUrl: img,
            timestamp: new Date().toISOString(),
            notes: `${p.tipo} - Imagem ${index + 1}`
          }))),
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

Conclusão: IMPROCEDENTE
Motivo: Incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        synced: false
      };
      
      console.log('Iniciando salvamento da vistoria...');
      
      // Salvar visita com melhor tratamento de erros e status de progresso
      try {
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
          setLocation("/reports");
        } else {
          throw new Error("Resultado de createVisit está incompleto. ID não gerado.");
        }
      } catch (error: any) {
        console.error("Erro específico ao salvar vistoria:", error?.message || error);
        throw error; // Re-throw para ser capturado pelo catch externo
      }
    } catch (error) {
      console.error("Erro ao salvar vistoria:", error);
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a vistoria. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="page page-transition" id="vistoriaFAR">
      <Header title="Vistoria Técnica FAR" showBackButton={true} />
      
      <div className="p-4">
        <form id="vistoriaFARForm" onSubmit={handleSubmit}>
          {/* Navegação entre abas */}
          <div className="flex mb-4 border-b border-neutral-200">
            <button
              type="button"
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'dados' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}
              onClick={() => setActiveTab('dados')}
            >
              Dados Básicos
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'telhas' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}
              onClick={() => setActiveTab('telhas')}
            >
              Telhas
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'problemas' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}
              onClick={() => setActiveTab('problemas')}
            >
              Problemas
            </button>
          </div>
          
          {/* Botão para preencher dados de teste */}
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="secondary"
              className="text-sm flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={preencherDadosTeste}
            >
              <span className="hidden sm:inline">Preencher</span> Dados de Teste
            </Button>
          </div>
          
          {/* Aba Dados Básicos */}
          {activeTab === 'dados' && (
            <>
              <Card className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <h2 className="font-semibold mb-3 text-lg">Dados Básicos</h2>
                
                <div className="mb-4">
                  <Label htmlFor="dataVistoria" className="block text-sm font-medium text-neutral-700 mb-1">
                    Data de Vistoria*
                  </Label>
                  <Input
                    type="date"
                    id="dataVistoria"
                    name="dataVistoria"
                    className={`w-full border ${formErrors.dataVistoria ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    value={formData.dataVistoria}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.dataVistoria && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dataVistoria}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="cliente" className="block text-sm font-medium text-neutral-700 mb-1">
                    Cliente*
                  </Label>
                  <Input
                    type="text"
                    id="cliente"
                    name="cliente"
                    className={`w-full border ${formErrors.cliente ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    placeholder="Nome do cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.cliente && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cliente}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="empreendimento" className="block text-sm font-medium text-neutral-700 mb-1">
                    Empreendimento*
                  </Label>
                  <Select
                    value={formData.empreendimento}
                    onValueChange={(value) => handleSelectChange("empreendimento", value)}
                  >
                    <SelectTrigger className={`w-full border ${formErrors.empreendimento ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}>
                      <SelectValue placeholder="Selecione o tipo de empreendimento" />
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
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="cidade" className="block text-sm font-medium text-neutral-700 mb-1">
                      Cidade*
                    </Label>
                    <Input
                      type="text"
                      id="cidade"
                      name="cidade"
                      className={`w-full border ${formErrors.cidade ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.cidade && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.cidade}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="uf" className="block text-sm font-medium text-neutral-700 mb-1">
                      UF*
                    </Label>
                    <Select
                      value={formData.uf}
                      onValueChange={(value) => handleSelectChange("uf", value)}
                    >
                      <SelectTrigger className={`w-full border ${formErrors.uf ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}>
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
                  <Label htmlFor="endereco" className="block text-sm font-medium text-neutral-700 mb-1">
                    Endereço*
                  </Label>
                  <Input
                    type="text"
                    id="endereco"
                    name="endereco"
                    className={`w-full border ${formErrors.endereco ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    placeholder="Endereço completo"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.endereco && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.endereco}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="farProtocolo" className="block text-sm font-medium text-neutral-700 mb-1">
                    FAR/Protocolo*
                  </Label>
                  <Input
                    type="text"
                    id="farProtocolo"
                    name="farProtocolo"
                    className={`w-full border ${formErrors.farProtocolo ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    placeholder="Número do protocolo de atendimento"
                    value={formData.farProtocolo}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.farProtocolo && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.farProtocolo}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="assunto" className="block text-sm font-medium text-neutral-700 mb-1">
                    Assunto
                  </Label>
                  <Input
                    type="text"
                    id="assunto"
                    name="assunto"
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm"
                    placeholder="Ex: AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"
                    value={formData.assunto}
                    onChange={handleInputChange}
                  />
                </div>
              </Card>
              
              <Card className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <h2 className="font-semibold mb-3 text-lg">Dados do Responsável</h2>
                
                <div className="mb-4">
                  <Label htmlFor="elaboradoPor" className="block text-sm font-medium text-neutral-700 mb-1">
                    Elaborado por*
                  </Label>
                  <Input
                    type="text"
                    id="elaboradoPor"
                    name="elaboradoPor"
                    className={`w-full border ${formErrors.elaboradoPor ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    placeholder="Nome do técnico responsável"
                    value={formData.elaboradoPor}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.elaboradoPor && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.elaboradoPor}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="departamento" className="block text-sm font-medium text-neutral-700 mb-1">
                    Departamento*
                  </Label>
                  <Input
                    type="text"
                    id="departamento"
                    name="departamento"
                    className={`w-full border ${formErrors.departamento ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}
                    placeholder="Departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.departamento && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.departamento}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="regional" className="block text-sm font-medium text-neutral-700 mb-1">
                    Regional*
                  </Label>
                  <Select
                    value={formData.regional}
                    onValueChange={(value) => handleSelectChange("regional", value)}
                  >
                    <SelectTrigger className={`w-full border ${formErrors.regional ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}>
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
                
                <div className="mb-4">
                  <Label htmlFor="unidade" className="block text-sm font-medium text-neutral-700 mb-1">
                    Unidade*
                  </Label>
                  <Select
                    value={formData.unidade}
                    onValueChange={(value) => handleSelectChange("unidade", value)}
                    disabled={!formData.regional}
                  >
                    <SelectTrigger className={`w-full border ${formErrors.unidade ? 'border-red-500' : 'border-neutral-300'} rounded-lg p-3 text-sm`}>
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
              </Card>
            </>
          )}
          
          {/* Aba Telhas */}
          {activeTab === 'telhas' && (
            <Card className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h2 className="font-semibold mb-3 text-lg">Informações sobre as Telhas</h2>
              
              {formErrors.telhas && (
                <p className="text-red-500 text-xs mb-2">{formErrors.telhas}</p>
              )}
              
              {formData.telhas.map((telha, index) => (
                <div 
                  key={telha.id} 
                  className={`border ${index > 0 ? 'mt-6' : ''} p-3 rounded-lg mb-4`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Telha {index + 1}</h3>
                    {formData.telhas.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removerTelha(telha.id)}
                        className="text-red-500 h-7 border-red-200 hover:bg-red-50"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor={`modelo-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Modelo de Telha*
                      </Label>
                      <Select
                        value={telha.modelo}
                        onValueChange={(value) => handleTelhaChange(telha.id, 'modelo', value)}
                      >
                        <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelosTelha.map(modelo => (
                            <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {telha.modelo === "Outro" && (
                        <Input
                          type="text"
                          className="mt-2 w-full border border-neutral-300 rounded-lg p-2 text-sm"
                          placeholder="Especifique o modelo"
                          value={telha.modelo === "Outro" ? "" : telha.modelo}
                          onChange={(e) => handleTelhaChange(telha.id, 'modelo', e.target.value)}
                        />
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`espessura-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Espessura*
                      </Label>
                      <Select
                        value={telha.espessura}
                        onValueChange={(value) => handleTelhaChange(telha.id, 'espessura', value)}
                      >
                        <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
                          <SelectValue placeholder="Selecione a espessura" />
                        </SelectTrigger>
                        <SelectContent>
                          {espessuras.map(espessura => (
                            <SelectItem key={espessura} value={espessura}>{espessura}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor={`comprimento-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Comprimento*
                      </Label>
                      <Select
                        value={telha.comprimento}
                        onValueChange={(value) => handleTelhaChange(telha.id, 'comprimento', value)}
                      >
                        <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
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
                      <Label htmlFor={`largura-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Largura*
                      </Label>
                      <Select
                        value={telha.largura}
                        onValueChange={(value) => handleTelhaChange(telha.id, 'largura', value)}
                      >
                        <SelectTrigger className="w-full border border-neutral-300 rounded-lg p-3 text-sm">
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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`quantidade-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Quantidade*
                      </Label>
                      <Input
                        type="number"
                        id={`quantidade-${telha.id}`}
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm"
                        min="1"
                        value={telha.quantidade || ''}
                        onChange={(e) => handleTelhaChange(telha.id, 'quantidade', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`area-${telha.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Área coberta (m²)
                      </Label>
                      <Input
                        type="text"
                        id={`area-${telha.id}`}
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-neutral-50"
                        value={telha.area ? telha.area.toFixed(2) : '0.00'}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-dashed"
                onClick={adicionarTelha}
              >
                + Adicionar outro tipo de telha
              </Button>
            </Card>
          )}
          
          {/* Aba Problemas */}
          {activeTab === 'problemas' && (
            <Card className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h2 className="font-semibold mb-3 text-lg">Problemas Identificados</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Selecione os problemas encontrados durante a vistoria:
              </p>
              
              {formData.problemas.map((problema) => (
                <div key={problema.id} className="mb-6 border-b pb-4">
                  <div className="flex items-start mb-2">
                    <Checkbox
                      id={`problema-${problema.id}`}
                      className="mt-1 mr-3 h-4 w-4 rounded"
                      checked={problema.selecionado}
                      onCheckedChange={(checked) => handleProblemaToggle(problema.id, checked as boolean)}
                    />
                    <div>
                      <label
                        htmlFor={`problema-${problema.id}`}
                        className="text-sm font-medium text-neutral-800 cursor-pointer"
                      >
                        {problema.tipo}
                      </label>
                      <p className="text-xs text-neutral-500">{problema.descricao}</p>
                    </div>
                  </div>
                  
                  {problema.selecionado && (
                    <div className="ml-8 mt-3">
                      <Label htmlFor={`observacoes-${problema.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
                        Observações
                      </Label>
                      <Textarea
                        id={`observacoes-${problema.id}`}
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm h-20"
                        placeholder="Adicione observações específicas deste problema..."
                        value={problema.observacoes}
                        onChange={(e) => handleProblemaObservacao(problema.id, e.target.value)}
                      />
                      
                      <div className="mt-3">
                        <Label className="block text-sm font-medium text-neutral-700 mb-2">
                          Imagens
                        </Label>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {problema.imagens.map((imagem, index) => (
                            <div key={index} className="relative w-24 h-24">
                              <div className="relative group cursor-pointer" onClick={() => openImagePreview(problema.id, imagem)}>
                                <img 
                                  src={imagem} 
                                  alt={`Foto ${index + 1} - ${problema.tipo}`} 
                                  className="w-24 h-24 object-cover rounded transition-all duration-200 group-hover:brightness-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                                  <span className="text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                      <path d="M11 8v6"></path>
                                      <path d="M8 11h6"></path>
                                    </svg>
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removerImagem(problema.id, index);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              onClick={() => captureImage(problema.id)}
                            >
                              Câmera
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => document.getElementById(`imagens-${problema.id}`)?.click()}
                            >
                              Galeria
                            </Button>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            id={`imagens-${problema.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(problema.id, e)}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            id={`camera-${problema.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(problema.id, e)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
          
          <div className="flex space-x-3 mb-8">
            {activeTab !== 'dados' && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setActiveTab(activeTab === 'telhas' ? 'dados' : 'telhas')}
              >
                Anterior
              </Button>
            )}
            
            {activeTab !== 'problemas' ? (
              <Button
                type="button"
                className="flex-1 bg-primary text-white"
                onClick={() => setActiveTab(activeTab === 'dados' ? 'telhas' : 'problemas')}
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-primary text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Salvando...
                  </>
                ) : (
                  "Salvar Vistoria"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
      
      {/* Modal de visualização de imagem */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              {previewProblema}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            {previewImage && (
              <>
                <img 
                  src={previewImage} 
                  alt="Imagem ampliada" 
                  className="max-w-full max-h-[65vh] object-contain rounded-md border border-gray-200 shadow-sm"
                />
                <p className="mt-3 text-center text-gray-600 text-sm italic">
                  Problema: {previewProblema}
                </p>
              </>
            )}
          </div>
          
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