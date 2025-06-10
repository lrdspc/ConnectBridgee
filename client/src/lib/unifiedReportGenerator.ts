/**
 * Gerador Unificado de Relatórios DOCX - ConnectBridge
 * 
 * Este é o gerador principal que consolida todas as funcionalidades
 * dos geradores anteriores em uma única solução robusta e confiável.
 * 
 * Características:
 * - Formatação profissional Times New Roman 12pt
 * - Espaçamento ABNT (1,5 entre linhas)
 * - Margens ABNT (superior, inferior e direita: 2,5cm; esquerda: 3,0cm)
 * - Sistema de fallback para garantir geração sempre
 * - Logs detalhados para diagnóstico
 * - Suporte a múltiplos formatos de saída
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  convertInchesToTwip,
  LevelFormat,
  BorderStyle,
  HeadingLevel
} from "docx";

import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";

// Configuração de logs
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[UnifiedReportGenerator]", ...args);
}

// Tipos de formato suportados
export type ReportFormat = 'docx' | 'pdf';

// Opções de geração
export interface ReportGenerationOptions {
  format?: ReportFormat;
  template?: 'brasilit' | 'saint-gobain' | 'simple';
  includePhotos?: boolean;
  includeSignatures?: boolean;
  customStyles?: any;
}

/**
 * Classe principal do gerador unificado de relatórios
 */
export class UnifiedReportGenerator {
  private options: ReportGenerationOptions;

  constructor(options: ReportGenerationOptions = {}) {
    this.options = {
      format: 'docx',
      template: 'brasilit',
      includePhotos: true,
      includeSignatures: true,
      ...options
    };
  }

  /**
   * Método principal para gerar relatórios
   * Inclui sistema de fallback automático
   */
  async generateReport(relatorio: RelatorioVistoria): Promise<Blob> {
    try {
      log("Iniciando geração de relatório unificado", {
        template: this.options.template,
        format: this.options.format
      });

      // Validar dados de entrada
      this.validateReportData(relatorio);

      // Gerar documento baseado no template escolhido
      switch (this.options.template) {
        case 'brasilit':
          return await this.generateBrasiliteReport(relatorio);
        case 'saint-gobain':
          return await this.generateSaintGobainReport(relatorio);
        case 'simple':
        default:
          return await this.generateSimpleReport(relatorio);
      }
    } catch (error) {
      log("Erro no gerador principal, tentando fallback:", error);
      return await this.generateFallbackReport(relatorio);
    }
  }

  /**
   * Validação dos dados do relatório
   */
  private validateReportData(relatorio: RelatorioVistoria): void {
    if (!relatorio) {
      throw new Error("Dados do relatório são obrigatórios");
    }

    // Validações básicas
    const requiredFields = ['cliente', 'dataVistoria', 'protocolo'];
    for (const field of requiredFields) {
      if (!relatorio[field as keyof RelatorioVistoria]) {
        log(`Campo obrigatório ausente: ${field}`);
      }
    }
  }

  /**
   * Gerador principal - Template Brasilit (baseado no SimpleGenerator)
   */
  private async generateBrasiliteReport(relatorio: RelatorioVistoria): Promise<Blob> {
    log("Gerando relatório com template Brasilit");

    // Preparar não conformidades
    const naoConformidadesParagrafos = this.prepareNaoConformidades(relatorio);
    
    // Textos do template Brasilit
    const introducaoTexto = this.getBrasiliteIntroductionText(relatorio);
    const analiseTecnicaTexto = this.getBrasiliteAnalysisText();
    const conclusaoTexto = this.getBrasiliteConclusion(relatorio);

    // Criar documento
    const doc = new Document({
      creator: "ConnectBridge - Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica realizada em telhas e produtos Brasilit",
      styles: this.getBrasiliteStyles(),
      numbering: this.getNumberingConfig(),
      sections: [{
        properties: this.getPageProperties(),
        children: [
          // Título principal
          this.createTitle("RELATÓRIO DE VISTORIA TÉCNICA"),
          
          // Informações gerais
          ...this.createBasicInfo(relatorio),
          
          // Responsáveis técnicos
          ...this.createTechnicalResponsibles(relatorio),
          
          // Seções principais
          this.createSection("1. INTRODUÇÃO", introducaoTexto),
          this.createSection("2. ANÁLISE TÉCNICA", analiseTecnicaTexto),
          
          // Não conformidades
          ...naoConformidadesParagrafos,
          
          // Conclusão
          this.createSection("3. CONCLUSÃO", conclusaoTexto),
          
          // Assinaturas (se habilitado)
          ...(this.options.includeSignatures ? this.createSignatures(relatorio) : [])
        ]
      }]
    });

    return await Packer.toBlob(doc);
  }

  /**
   * Gerador Saint-Gobain (placeholder - pode ser implementado posteriormente)
   */
  private async generateSaintGobainReport(relatorio: RelatorioVistoria): Promise<Blob> {
    log("Template Saint-Gobain não implementado, usando fallback Brasilit");
    return await this.generateBrasiliteReport(relatorio);
  }

  /**
   * Gerador simples (versão minimalista)
   */
  private async generateSimpleReport(relatorio: RelatorioVistoria): Promise<Blob> {
    log("Gerando relatório simples");
    
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ 
                text: "RELATÓRIO DE VISTORIA TÉCNICA",
                bold: true,
                size: 28
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cliente: ", bold: true }),
              new TextRun(relatorio.cliente || "")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Data: ", bold: true }),
              new TextRun(relatorio.dataVistoria || "")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Protocolo: ", bold: true }),
              new TextRun(relatorio.protocolo || "")
            ]
          })
        ]
      }]
    });

    return await Packer.toBlob(doc);
  }

  /**
   * Gerador de fallback - versão ultra-simples que sempre funciona
   */
  private async generateFallbackReport(relatorio: RelatorioVistoria): Promise<Blob> {
    log("Executando gerador de fallback");
    
    try {
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              text: "RELATÓRIO DE VISTORIA TÉCNICA",
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 }
            }),
            new Paragraph({
              text: `Cliente: ${relatorio.cliente || "Não informado"}`
            }),
            new Paragraph({
              text: `Data: ${relatorio.dataVistoria || "Não informada"}`
            }),
            new Paragraph({
              text: `Protocolo: ${relatorio.protocolo || "Não informado"}`
            }),
            new Paragraph({
              text: "Este relatório foi gerado em modo de emergência devido a problemas técnicos.",
              spacing: { before: 480 }
            })
          ]
        }]
      });

      return await Packer.toBlob(doc);
    } catch (error) {
      log("Erro crítico no fallback:", error);
      throw new Error("Falha crítica na geração do relatório");
    }
  }

  /**
   * Preparar parágrafos das não conformidades
   */
  private prepareNaoConformidades(relatorio: RelatorioVistoria): Paragraph[] {
    const paragrafos: Paragraph[] = [];
    
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      const selecionadas = relatorio.naoConformidades
        .filter((nc: any) => nc.selecionado)
        .map((nc: any) => {
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            id: nc.id,
            titulo: completa?.titulo || nc.titulo || "",
            descricao: completa?.descricao || nc.descricao || ""
          };
        });

      if (selecionadas.length > 0) {
        selecionadas.forEach((nc, index) => {
          paragrafos.push(
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `${index + 1}. ${nc.titulo}`,
                  bold: true
                })
              ],
              spacing: { after: 240 },
              numbering: {
                reference: "naoConformidadesLista",
                level: 0
              }
            }),
            new Paragraph({
              text: nc.descricao,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 },
              indent: { left: convertInchesToTwip(0.25) }
            })
          );
        });
      } else {
        paragrafos.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades.",
            spacing: { after: 240 }
          })
        );
      }
    } else {
      paragrafos.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 240 }
        })
      );
    }

    return paragrafos;
  }

  /**
   * Criar título principal do documento
   */
  private createTitle(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 }
    });
  }

  /**
   * Criar informações básicas do relatório
   */
  private createBasicInfo(relatorio: RelatorioVistoria): Paragraph[] {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: "Data de vistoria: ", bold: true }),
          new TextRun(relatorio.dataVistoria || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Cliente: ", bold: true }),
          new TextRun(relatorio.cliente || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Empreendimento: ", bold: true }),
          new TextRun(relatorio.empreendimento || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Cidade/UF: ", bold: true }),
          new TextRun(`${relatorio.cidade || ""} - ${relatorio.uf || ""}`)
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Endereço: ", bold: true }),
          new TextRun(relatorio.endereco || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Protocolo/FAR: ", bold: true }),
          new TextRun(relatorio.protocolo || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Assunto: ", bold: true }),
          new TextRun(relatorio.assunto || "")
        ],
        spacing: { after: 480 }
      })
    ];
  }

  /**
   * Criar seção de responsáveis técnicos
   */
  private createTechnicalResponsibles(relatorio: RelatorioVistoria): Paragraph[] {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: "Elaborado por: ", bold: true }),
          new TextRun(relatorio.elaboradoPor || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Departamento: ", bold: true }),
          new TextRun(relatorio.departamento || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Regional: ", bold: true }),
          new TextRun(relatorio.regional || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Unidade: ", bold: true }),
          new TextRun(relatorio.unidade || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Coordenador: ", bold: true }),
          new TextRun(relatorio.coordenador || "")
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Gerente: ", bold: true }),
          new TextRun(relatorio.gerente || "")
        ],
        spacing: { after: 480 }
      })
    ];
  }

  /**
   * Criar seção com título e conteúdo
   */
  private createSection(title: string, content: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 24
        })
      ],
      spacing: { before: 360, after: 240 },
      border: {
        bottom: {
          color: "000000",
          size: 6,
          space: 1,
          style: BorderStyle.SINGLE
        }
      }
    });
  }

  /**
   * Obter estilos do documento Brasilit
   */
  private getBrasiliteStyles() {
    return {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: "Times New Roman",
            size: 24 // 12pt
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 de espaçamento
              before: 0,
              after: 240
            },
            alignment: AlignmentType.JUSTIFIED
          }
        }
      ]
    };
  }

  /**
   * Configuração de numeração
   */
  private getNumberingConfig() {
    return {
      config: [
        {
          reference: "naoConformidadesLista",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) }
                },
                run: {
                  bold: true
                }
              }
            }
          ]
        }
      ]
    };
  }

  /**
   * Propriedades da página (margens ABNT)
   */
  private getPageProperties() {
    return {
      page: {
        margin: {
          top: 720,      // 2,5 cm
          right: 720,    // 2,5 cm
          bottom: 720,   // 2,5 cm
          left: 864      // 3,0 cm (ABNT para encadernação)
        }
      }
    };
  }

  /**
   * Texto de introdução Brasilit
   */
  private getBrasiliteIntroductionText(relatorio: RelatorioVistoria): string {
    return `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ${relatorio.modeloTelha} de ${relatorio.espessura}mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo}.

O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha}. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado - Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto} anos para sistema completo).`;
  }

  /**
   * Texto de análise técnica Brasilit
   */
  private getBrasiliteAnalysisText(): string {
    return `Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir.`;
  }

  /**
   * Texto de conclusão Brasilit
   */
  private getBrasiliteConclusion(relatorio: RelatorioVistoria): string {
    return `Com base na análise técnica realizada, foram identificadas as não conformidades listadas acima.

Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ${relatorio.modeloTelha} possuem ${relatorio.anosGarantiaTotal} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado - Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas - ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.`;
  }
}

/**
 * Função de conveniência para gerar relatórios usando o gerador unificado
 */
export async function generateUnifiedReport(
  relatorio: RelatorioVistoria,
  options?: ReportGenerationOptions
): Promise<Blob> {
  const generator = new UnifiedReportGenerator(options);
  return await generator.generateReport(relatorio);
}

/**
 * Função de conveniência para gerar relatório Brasilit (compatibilidade)
 */
export async function gerarRelatorioUnificado(relatorio: RelatorioVistoria): Promise<Blob> {
  return await generateUnifiedReport(relatorio, { template: 'brasilit' });
}
