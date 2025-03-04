import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Calendar, 
  FileText, 
  MapPin, 
  Building, 
  User, 
  Package, 
  PlusCircle,
  Trash2, 
  Save, 
  FileCheck, 
  Image, 
  ChevronRight
} from 'lucide-react';

import SmartLayout from '../components/layout/SmartLayout';
import { 
  SmartForm, 
  SmartFormGroup, 
  SmartLabel, 
  SmartInput, 
  SmartTextarea, 
  SmartSelect 
} from '../components/ui/SmartForm';
import SmartButton from '../components/ui/SmartButton';
import { SmartCard, SmartCardContent, SmartCardHeader } from '../components/ui/SmartCard';

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

const modelosTelhas = [
  "Telha Ondulada",
  "Telha Romana",
  "Telha Portuguesa",
  "Telha Colonial",
  "Telha Americana",
  "Telha Francesa",
  "Telha Esmaltada",
  "Telha Plana",
  "Telha Germânica",
  "Telha Coppo",
  "Telha Metálica"
];

const espessurasTelhas = [
  "4mm",
  "5mm",
  "6mm",
  "8mm",
  "10mm",
  "12mm"
];

const problemasPredefinidos = [
  {
    tipo: "Vazamento",
    descricao: "Infiltrações visíveis causadas por falhas na instalação ou material"
  },
  {
    tipo: "Trincas",
    descricao: "Trincas ou fissuras na superfície das telhas"
  },
  {
    tipo: "Empenamento",
    descricao: "Telhas com deformações ou empenamento"
  },
  {
    tipo: "Quebra",
    descricao: "Telhas quebradas ou com danos estruturais"
  },
  {
    tipo: "Desalinhamento",
    descricao: "Telhas desalinhadas comprometendo a vedação do telhado"
  },
  {
    tipo: "Manchas",
    descricao: "Manchas de umidade ou mofo na superfície"
  },
  {
    tipo: "Desgaste",
    descricao: "Desgaste prematuro do material"
  },
  {
    tipo: "Corrosão",
    descricao: "Corrosão em telhas metálicas ou componentes"
  },
  {
    tipo: "Despigmentação",
    descricao: "Perda de cor ou despigmentação da telha"
  },
  {
    tipo: "Eflorescência",
    descricao: "Formação de depósitos salinos na superfície"
  }
];

// Dados de teste para formulário
const dadosTeste: FormData = {
  dataVistoria: "2025-03-01",
  cliente: "Construtora Silva & Filho",
  empreendimento: "Residencial Vale Verde",
  cidade: "São Paulo",
  uf: "SP",
  endereco: "Rua das Palmeiras, 1500 - Jardim Botânico",
  farProtocolo: "FAR-630048",
  assunto: "Análise técnica de reclamação sobre vazamentos no telhado",
  
  elaboradoPor: "Eng. Carlos Sampaio",
  departamento: "Engenharia de Aplicação",
  regional: "Sudeste",
  unidade: "São Paulo",
  coordenador: "Maria Oliveira",
  gerente: "João Ferreira",
  
  telhas: [
    {
      id: "1",
      modelo: "Telha Ondulada",
      espessura: "6mm",
      comprimento: "1,83",
      largura: "1,10",
      quantidade: 320,
      area: 640
    }
  ],
  
  problemas: [
    {
      id: "1",
      tipo: "Vazamento",
      descricao: "Infiltrações visíveis causadas por falhas na instalação ou material",
      observacoes: "Verificado presença de infiltrações nas junções de telhas próximas às cumeeiras",
      imagens: [],
      selecionado: true
    },
    {
      id: "2",
      tipo: "Trincas",
      descricao: "Trincas ou fissuras na superfície das telhas",
      observacoes: "Identificadas trincas em aproximadamente 5% das telhas inspecionadas",
      imagens: [],
      selecionado: true
    }
  ],
  
  introducao: `O presente relatório tem como objetivo documentar a vistoria técnica realizada no dia 01/03/2025 no empreendimento Residencial Vale Verde, em atendimento à solicitação da Construtora Silva & Filho, referente à análise de problemas de vazamento no telhado.`,
  
  analiseTecnica: `Após inspeção detalhada no local, foram identificados problemas de instalação que comprometem a vedação adequada do telhado. As telhas onduladas foram instaladas com sobreposição insuficiente e alguns parafusos de fixação estão mal posicionados, criando pontos de entrada para água durante chuvas.`,
  
  conclusao: `Com base na inspeção realizada e nas evidências coletadas, conclui-se que os problemas apresentados são decorrentes de falhas no processo de instalação das telhas, não havendo indícios de defeitos de fabricação nos produtos.`,
  
  recomendacao: `Recomenda-se o reposicionamento das telhas nas áreas identificadas com problemas, garantindo a sobreposição mínima de 20cm entre peças, além da correta aplicação de parafusos com vedação adequada nos pontos especificados pelo manual técnico de instalação.`,
  
  observacoesGerais: `Durante a vistoria, foi identificado que o sistema de calhas e rufos apresenta dimensionamento adequado, não contribuindo para os problemas relatados.`,
  
  anosGarantia: "5",
  anosGarantiaSistemaCompleto: "10",
  anosGarantiaTotal: "25",
  
  resultado: "PROCEDENTE"
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const VistoriaFARPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(dadosTeste);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const adicionarTelha = () => {
    const novaTelha: TelhaSpec = {
      id: uuidv4(),
      modelo: modelosTelhas[0],
      espessura: espessurasTelhas[0],
      comprimento: "",
      largura: "",
      quantidade: 0
    };
    
    setFormData({
      ...formData,
      telhas: [...formData.telhas, novaTelha]
    });
  };
  
  const removerTelha = (id: string) => {
    setFormData({
      ...formData,
      telhas: formData.telhas.filter(telha => telha.id !== id)
    });
  };
  
  const atualizarTelha = (id: string, campo: keyof TelhaSpec, valor: string | number) => {
    setFormData({
      ...formData,
      telhas: formData.telhas.map(telha => 
        telha.id === id ? { ...telha, [campo]: valor } : telha
      )
    });
  };
  
  const adicionarProblema = () => {
    // Pegar um problema predefinido aleatório que ainda não foi selecionado
    const problemasJaAdicionados = formData.problemas.map(p => p.tipo);
    const problemasDisponiveis = problemasPredefinidos.filter(
      p => !problemasJaAdicionados.includes(p.tipo)
    );
    
    if (problemasDisponiveis.length === 0) {
      return; // Todos os problemas já foram adicionados
    }
    
    const problemaAleatorio = problemasDisponiveis[Math.floor(Math.random() * problemasDisponiveis.length)];
    
    const novoProblema: ProblemaIdentificado = {
      id: uuidv4(),
      tipo: problemaAleatorio.tipo,
      descricao: problemaAleatorio.descricao,
      observacoes: "",
      imagens: [],
      selecionado: true
    };
    
    setFormData({
      ...formData,
      problemas: [...formData.problemas, novoProblema]
    });
  };
  
  const removerProblema = (id: string) => {
    setFormData({
      ...formData,
      problemas: formData.problemas.filter(problema => problema.id !== id)
    });
  };
  
  const atualizarProblema = (id: string, campo: keyof ProblemaIdentificado, valor: string | boolean | string[]) => {
    setFormData({
      ...formData,
      problemas: formData.problemas.map(problema => 
        problema.id === id ? { ...problema, [campo]: valor } : problema
      )
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    // Aqui você poderia enviar os dados para a API ou gerar o PDF
    alert("Relatório de vistoria salvo com sucesso!");
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <SmartLayout title="Relatório de Vistoria Técnica - FAR">
      <div className="steps-progress mb-3">
        <div className="steps-container">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`step ${currentStep > index ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentStep(index + 1)}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">
                {index === 0 && "Informações Básicas"}
                {index === 1 && "Especificações Técnicas"}
                {index === 2 && "Análise Técnica"}
                {index === 3 && "Resultado e Conclusão"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <SmartForm onSubmit={handleSubmit}>
        {/* Passo 1: Informações Básicas */}
        {currentStep === 1 && (
          <div className="form-step">
            <div className="form-columns">
              <div className="form-column">
                <SmartCard>
                  <SmartCardHeader title="Dados da Vistoria" icon={<Calendar size={18} />} />
                  <SmartCardContent>
                    <SmartFormGroup>
                      <SmartLabel htmlFor="dataVistoria" required>Data da Vistoria</SmartLabel>
                      <SmartInput
                        id="dataVistoria"
                        name="dataVistoria"
                        type="date"
                        value={formData.dataVistoria}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                    
                    <SmartFormGroup>
                      <SmartLabel htmlFor="farProtocolo" required>Protocolo FAR</SmartLabel>
                      <SmartInput
                        id="farProtocolo"
                        name="farProtocolo"
                        value={formData.farProtocolo}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                    
                    <SmartFormGroup>
                      <SmartLabel htmlFor="assunto" required>Assunto</SmartLabel>
                      <SmartInput
                        id="assunto"
                        name="assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                  </SmartCardContent>
                </SmartCard>
                
                <SmartCard className="mt-3">
                  <SmartCardHeader title="Dados do Cliente" icon={<User size={18} />} />
                  <SmartCardContent>
                    <SmartFormGroup>
                      <SmartLabel htmlFor="cliente" required>Nome do Cliente</SmartLabel>
                      <SmartInput
                        id="cliente"
                        name="cliente"
                        value={formData.cliente}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                    
                    <SmartFormGroup>
                      <SmartLabel htmlFor="empreendimento" required>Empreendimento</SmartLabel>
                      <SmartInput
                        id="empreendimento"
                        name="empreendimento"
                        value={formData.empreendimento}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                  </SmartCardContent>
                </SmartCard>
              </div>
              
              <div className="form-column">
                <SmartCard>
                  <SmartCardHeader title="Localização" icon={<MapPin size={18} />} />
                  <SmartCardContent>
                    <SmartFormGroup>
                      <SmartLabel htmlFor="endereco" required>Endereço Completo</SmartLabel>
                      <SmartInput
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                    
                    <div className="form-row">
                      <SmartFormGroup>
                        <SmartLabel htmlFor="cidade" required>Cidade</SmartLabel>
                        <SmartInput
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          required
                        />
                      </SmartFormGroup>
                      
                      <SmartFormGroup>
                        <SmartLabel htmlFor="uf" required>UF</SmartLabel>
                        <SmartSelect
                          id="uf"
                          name="uf"
                          value={formData.uf}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </SmartSelect>
                      </SmartFormGroup>
                    </div>
                  </SmartCardContent>
                </SmartCard>
                
                <SmartCard className="mt-3">
                  <SmartCardHeader title="Responsável Técnico" icon={<FileText size={18} />} />
                  <SmartCardContent>
                    <SmartFormGroup>
                      <SmartLabel htmlFor="elaboradoPor" required>Elaborado por</SmartLabel>
                      <SmartInput
                        id="elaboradoPor"
                        name="elaboradoPor"
                        value={formData.elaboradoPor}
                        onChange={handleChange}
                        required
                      />
                    </SmartFormGroup>
                    
                    <SmartFormGroup>
                      <SmartLabel htmlFor="departamento">Departamento</SmartLabel>
                      <SmartInput
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                      />
                    </SmartFormGroup>
                    
                    <div className="form-row">
                      <SmartFormGroup>
                        <SmartLabel htmlFor="regional">Regional</SmartLabel>
                        <SmartInput
                          id="regional"
                          name="regional"
                          value={formData.regional}
                          onChange={handleChange}
                        />
                      </SmartFormGroup>
                      
                      <SmartFormGroup>
                        <SmartLabel htmlFor="unidade">Unidade</SmartLabel>
                        <SmartInput
                          id="unidade"
                          name="unidade"
                          value={formData.unidade}
                          onChange={handleChange}
                        />
                      </SmartFormGroup>
                    </div>
                  </SmartCardContent>
                </SmartCard>
              </div>
            </div>
          </div>
        )}
        
        {/* Passo 2: Especificações Técnicas */}
        {currentStep === 2 && (
          <div className="form-step">
            <SmartCard>
              <SmartCardHeader 
                title="Especificações das Telhas" 
                icon={<Building size={18} />} 
                action={
                  <SmartButton
                    variant="ghost"
                    color="primary"
                    icon={<PlusCircle size={16} />}
                    onClick={adicionarTelha}
                  >
                    Adicionar Telha
                  </SmartButton>
                }
              />
              <SmartCardContent>
                {formData.telhas.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhuma especificação de telha adicionada.</p>
                  </div>
                ) : (
                  formData.telhas.map((telha, index) => (
                    <div className="telha-spec-card" key={telha.id}>
                      <div className="telha-spec-header">
                        <h4>Telha {index + 1}</h4>
                        <button 
                          type="button" 
                          className="btn-icon-delete"
                          onClick={() => removerTelha(telha.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="telha-spec-content">
                        <div className="form-row">
                          <SmartFormGroup>
                            <SmartLabel>Modelo</SmartLabel>
                            <SmartSelect
                              value={telha.modelo}
                              onChange={(e) => atualizarTelha(telha.id, 'modelo', e.target.value)}
                            >
                              {modelosTelhas.map(modelo => (
                                <option key={modelo} value={modelo}>{modelo}</option>
                              ))}
                            </SmartSelect>
                          </SmartFormGroup>
                          
                          <SmartFormGroup>
                            <SmartLabel>Espessura</SmartLabel>
                            <SmartSelect
                              value={telha.espessura}
                              onChange={(e) => atualizarTelha(telha.id, 'espessura', e.target.value)}
                            >
                              {espessurasTelhas.map(espessura => (
                                <option key={espessura} value={espessura}>{espessura}</option>
                              ))}
                            </SmartSelect>
                          </SmartFormGroup>
                        </div>
                        
                        <div className="form-row">
                          <SmartFormGroup>
                            <SmartLabel>Comprimento (m)</SmartLabel>
                            <SmartInput
                              type="text"
                              value={telha.comprimento}
                              onChange={(e) => atualizarTelha(telha.id, 'comprimento', e.target.value)}
                            />
                          </SmartFormGroup>
                          
                          <SmartFormGroup>
                            <SmartLabel>Largura (m)</SmartLabel>
                            <SmartInput
                              type="text"
                              value={telha.largura}
                              onChange={(e) => atualizarTelha(telha.id, 'largura', e.target.value)}
                            />
                          </SmartFormGroup>
                          
                          <SmartFormGroup>
                            <SmartLabel>Quantidade</SmartLabel>
                            <SmartInput
                              type="number"
                              value={telha.quantidade.toString()}
                              onChange={(e) => atualizarTelha(telha.id, 'quantidade', parseInt(e.target.value) || 0)}
                            />
                          </SmartFormGroup>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </SmartCardContent>
            </SmartCard>
            
            <SmartCard className="mt-3">
              <SmartCardHeader 
                title="Problemas Identificados" 
                icon={<Package size={18} />} 
                action={
                  <SmartButton
                    variant="ghost"
                    color="primary"
                    icon={<PlusCircle size={16} />}
                    onClick={adicionarProblema}
                  >
                    Adicionar Problema
                  </SmartButton>
                }
              />
              <SmartCardContent>
                {formData.problemas.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhum problema identificado.</p>
                  </div>
                ) : (
                  formData.problemas.map(problema => (
                    <div className="problema-card" key={problema.id}>
                      <div className="problema-header">
                        <h4>{problema.tipo}</h4>
                        <button 
                          type="button" 
                          className="btn-icon-delete"
                          onClick={() => removerProblema(problema.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="problema-content">
                        <p className="problema-descricao">{problema.descricao}</p>
                        
                        <SmartFormGroup>
                          <SmartLabel>Observações</SmartLabel>
                          <SmartTextarea
                            value={problema.observacoes}
                            onChange={(e) => atualizarProblema(problema.id, 'observacoes', e.target.value)}
                            rows={3}
                          />
                        </SmartFormGroup>
                        
                        <div className="problema-images">
                          <div className="problema-images-header">
                            <h5>Imagens</h5>
                            <button type="button" className="btn-add-image">
                              <Image size={16} />
                              <span>Adicionar Imagem</span>
                            </button>
                          </div>
                          
                          {problema.imagens.length === 0 ? (
                            <p className="no-images">Nenhuma imagem adicionada.</p>
                          ) : (
                            <div className="images-grid">
                              {problema.imagens.map((img, idx) => (
                                <div key={idx} className="image-thumbnail">
                                  <img src={img} alt={`Problema ${idx + 1}`} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </SmartCardContent>
            </SmartCard>
          </div>
        )}
        
        {/* Passo 3: Análise Técnica */}
        {currentStep === 3 && (
          <div className="form-step">
            <SmartCard>
              <SmartCardHeader title="Introdução" icon={<FileText size={18} />} />
              <SmartCardContent>
                <SmartFormGroup>
                  <SmartTextarea
                    name="introducao"
                    value={formData.introducao}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
            
            <SmartCard className="mt-3">
              <SmartCardHeader title="Análise Técnica" icon={<FileText size={18} />} />
              <SmartCardContent>
                <SmartFormGroup>
                  <SmartTextarea
                    name="analiseTecnica"
                    value={formData.analiseTecnica}
                    onChange={handleChange}
                    rows={8}
                    required
                  />
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
            
            <SmartCard className="mt-3">
              <SmartCardHeader title="Observações Gerais" icon={<FileText size={18} />} />
              <SmartCardContent>
                <SmartFormGroup>
                  <SmartTextarea
                    name="observacoesGerais"
                    value={formData.observacoesGerais}
                    onChange={handleChange}
                    rows={4}
                  />
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
          </div>
        )}
        
        {/* Passo 4: Conclusão e Recomendações */}
        {currentStep === 4 && (
          <div className="form-step">
            <SmartCard>
              <SmartCardHeader title="Conclusão" icon={<FileCheck size={18} />} />
              <SmartCardContent>
                <SmartFormGroup>
                  <SmartTextarea
                    name="conclusao"
                    value={formData.conclusao}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
            
            <SmartCard className="mt-3">
              <SmartCardHeader title="Recomendações" icon={<FileCheck size={18} />} />
              <SmartCardContent>
                <SmartFormGroup>
                  <SmartTextarea
                    name="recomendacao"
                    value={formData.recomendacao}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
            
            <SmartCard className="mt-3">
              <SmartCardHeader title="Garantias e Resultado" icon={<FileCheck size={18} />} />
              <SmartCardContent>
                <div className="form-row">
                  <SmartFormGroup>
                    <SmartLabel htmlFor="anosGarantia">Anos de Garantia</SmartLabel>
                    <SmartInput
                      id="anosGarantia"
                      name="anosGarantia"
                      type="number"
                      value={formData.anosGarantia}
                      onChange={handleChange}
                    />
                  </SmartFormGroup>
                  
                  <SmartFormGroup>
                    <SmartLabel htmlFor="anosGarantiaSistemaCompleto">Garantia do Sistema Completo</SmartLabel>
                    <SmartInput
                      id="anosGarantiaSistemaCompleto"
                      name="anosGarantiaSistemaCompleto"
                      type="number"
                      value={formData.anosGarantiaSistemaCompleto}
                      onChange={handleChange}
                    />
                  </SmartFormGroup>
                  
                  <SmartFormGroup>
                    <SmartLabel htmlFor="anosGarantiaTotal">Garantia Total</SmartLabel>
                    <SmartInput
                      id="anosGarantiaTotal"
                      name="anosGarantiaTotal"
                      type="number"
                      value={formData.anosGarantiaTotal}
                      onChange={handleChange}
                    />
                  </SmartFormGroup>
                </div>
                
                <SmartFormGroup>
                  <SmartLabel htmlFor="resultado" required>Resultado da Análise</SmartLabel>
                  <SmartSelect
                    id="resultado"
                    name="resultado"
                    value={formData.resultado}
                    onChange={handleChange as any}
                    required
                  >
                    <option value="PROCEDENTE">PROCEDENTE</option>
                    <option value="IMPROCEDENTE">IMPROCEDENTE</option>
                  </SmartSelect>
                </SmartFormGroup>
              </SmartCardContent>
            </SmartCard>
          </div>
        )}
        
        <div className="form-navigation mt-3">
          {currentStep > 1 && (
            <SmartButton
              type="button"
              variant="outlined"
              color="secondary"
              onClick={prevStep}
            >
              Voltar
            </SmartButton>
          )}
          
          {currentStep < totalSteps ? (
            <SmartButton
              type="button"
              color="primary"
              onClick={nextStep}
            >
              Próximo
            </SmartButton>
          ) : (
            <SmartButton
              type="submit"
              color="primary"
              icon={<Save size={16} />}
            >
              Salvar Relatório
            </SmartButton>
          )}
        </div>
      </SmartForm>
    </SmartLayout>
  );
};

export default VistoriaFARPage;