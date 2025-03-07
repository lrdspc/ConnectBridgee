/**
 * Gerador SIMPLIFICADO de Relatórios DOCX com formatação ABNT
 * 
 * Esta versão foi desenvolvida para resolver problemas com a biblioteca docx
 * Implementação limpa e direta, sem dependências desnecessárias
 * 
 * Características:
 * - Importações corretas e diretas da biblioteca docx
 * - Sem herança de classes problemática
 * - Código mais claro e manutenível
 * - Formatação ABNT conforme requisitos
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType, 
  BorderStyle,
  Header,
  Footer
} from "docx";

import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

// Ativação de logs detalhados para diagnóstico
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[RelatorioSimples]", ...args);
}

/**
 * Gera um documento DOCX para o relatório de vistoria técnica
 * 
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioSimples(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    log("Iniciando geração de relatório simples");
    
    // === PREPARAÇÃO DOS TEXTOS ===
    
    // Converter não conformidades em parágrafos
    const naoConformidadesParagrafos: Paragraph[] = [];
    
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      // Filtrar apenas as selecionadas
      const naoConformidadesSelecionadas = relatorio.naoConformidades
        .filter((nc: any) => nc.selecionado)
        .map((nc: any) => {
          // Buscar a descrição completa da não conformidade
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            id: nc.id,
            titulo: completa?.titulo || nc.titulo || "",
            descricao: completa?.descricao || nc.descricao || ""
          };
        });
      
      if (naoConformidadesSelecionadas.length > 0) {
        // Adicionar cada uma como um parágrafo separado
        naoConformidadesSelecionadas.forEach((nc, index) => {
          naoConformidadesParagrafos.push(
            new Paragraph({
              text: `${index + 1}. ${nc.titulo}`,
              spacing: { after: 200 },
              heading: HeadingLevel.HEADING_4
            })
          );
          
          naoConformidadesParagrafos.push(
            new Paragraph({
              text: nc.descricao,
              spacing: { after: 300 },
              alignment: AlignmentType.JUSTIFIED
            })
          );
        });
      } else {
        naoConformidadesParagrafos.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades.",
            spacing: { after: 300 }
          })
        );
      }
    } else {
      naoConformidadesParagrafos.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 300 }
        })
      );
    }
    
    // Gerar textos a partir dos templates
    const introducaoTexto = aplicarTemplateIntroducao({
      modeloTelha: relatorio.modeloTelha,
      espessura: relatorio.espessura,
      protocolo: relatorio.protocolo,
      anosGarantia: relatorio.anosGarantia,
      anosGarantiaSistemaCompleto: relatorio.anosGarantiaSistemaCompleto
    });
    
    // Conclusão - sempre como IMPROCEDENTE
    const conclusaoTexto = aplicarTemplateConclusao({
      resultado: "IMPROCEDENTE",
      modeloTelha: relatorio.modeloTelha,
      anosGarantiaTotal: relatorio.anosGarantiaTotal
    });
    
    // === CRIAÇÃO DO DOCUMENTO ===

    // Cabeçalho simplificado
    const header = new Header({
      children: [
        new Paragraph({
          text: "BRASILIT SAINT-GOBAIN",
          alignment: AlignmentType.RIGHT
        })
      ]
    });

    // Rodapé simplificado
    const footer = new Footer({
      children: [
        new Paragraph({
          text: "Página ",
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              children: ["Página ", { type: "page-number" }]
            })
          ]
        })
      ]
    });
    
    // Criar o documento com configurações ABNT
    const doc = new Document({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica realizada em telhas e produtos Brasilit",
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Arial",
              size: 24 // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 de espaçamento (padrão ABNT)
                before: 0,
                after: 200 // 10pt de espaçamento após parágrafo
              }
            }
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial",
              size: 28, // 14pt
              bold: true
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt
                after: 120 // 6pt
              },
              alignment: AlignmentType.CENTER
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial",
              size: 26, // 13pt
              bold: true
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt
                after: 120 // 6pt
              }
            }
          },
          {
            id: "Heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial",
              size: 24, // 12pt
              bold: true
            },
            paragraph: {
              spacing: {
                before: 200, // 10pt
                after: 100 // 5pt
              }
            }
          },
          {
            id: "Heading4",
            name: "Heading 4",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial",
              size: 24, // 12pt
              bold: true
            },
            paragraph: {
              spacing: {
                before: 160, // 8pt
                after: 80 // 4pt
              }
            }
          },
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial",
              size: 32, // 16pt
              bold: true
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt
                after: 240 // 12pt
              },
              alignment: AlignmentType.CENTER
            }
          }
        ]
      },
      sections: [
        {
          headers: {
            default: header
          },
          footers: {
            default: footer
          },
          properties: {
            page: {
              margin: {
                top: 720,      // 2,5 cm = ~720 twips (padrão ABNT)
                right: 720,    // 2,5 cm = ~720 twips
                bottom: 720,   // 2,5 cm = ~720 twips
                left: 864      // 3,0 cm = ~864 twips (padrão ABNT para encadernação)
              }
            }
          },
          children: [
            // Título principal
            new Paragraph({
              text: "RELATÓRIO DE VISTORIA TÉCNICA",
              style: "Title",
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6
                }
              }
            }),
            
            // 1. IDENTIFICAÇÃO DO PROJETO
            new Paragraph({
              text: "1. IDENTIFICAÇÃO DO PROJETO",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            // Dados do projeto
            new Paragraph({
              children: [
                new TextRun({ text: "Protocolo/FAR: ", bold: true }),
                new TextRun(relatorio.protocolo || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Data de vistoria: ", bold: true }),
                new TextRun(relatorio.dataVistoria || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cliente: ", bold: true }),
                new TextRun(relatorio.cliente || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Empreendimento: ", bold: true }),
                new TextRun(relatorio.empreendimento || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true }),
                new TextRun(relatorio.endereco || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cidade/UF: ", bold: true }),
                new TextRun(`${relatorio.cidade || ""} - ${relatorio.uf || ""}`)
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Assunto: ", bold: true }),
                new TextRun(relatorio.assunto || "")
              ]
            }),
            
            // 2. RESPONSÁVEIS TÉCNICOS
            new Paragraph({
              text: "2. RESPONSÁVEIS TÉCNICOS",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            // Dados dos responsáveis
            new Paragraph({
              children: [
                new TextRun({ text: "Elaborado por: ", bold: true }),
                new TextRun(relatorio.elaboradoPor || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Departamento: ", bold: true }),
                new TextRun(relatorio.departamento || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Unidade: ", bold: true }),
                new TextRun(relatorio.unidade || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Coordenador: ", bold: true }),
                new TextRun(relatorio.coordenador || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Gerente: ", bold: true }),
                new TextRun(relatorio.gerente || "")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Regional: ", bold: true }),
                new TextRun(relatorio.regional || "")
              ]
            }),
            
            // 3. INTRODUÇÃO
            new Paragraph({
              text: "3. INTRODUÇÃO",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            new Paragraph({
              text: introducaoTexto,
              alignment: AlignmentType.JUSTIFIED
            }),
            
            // 3.1 DADOS DO PRODUTO
            new Paragraph({
              text: "3.1 DADOS DO PRODUTO",
              heading: HeadingLevel.HEADING_2
            }),
            
            // Dados do produto
            new Paragraph({
              children: [
                new TextRun({ text: "Quantidade: ", bold: true }),
                new TextRun(relatorio.quantidade ? relatorio.quantidade.toString() : "Não informada")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Modelo de telha: ", bold: true }),
                new TextRun(relatorio.modeloTelha ? 
                  `${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS` : 
                  "Não informado")
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Área coberta: ", bold: true }),
                new TextRun(relatorio.area ? 
                  `${relatorio.area.toString()}m² (aproximadamente)` : 
                  "Não informada")
              ]
            }),
            
            // 4. ANÁLISE TÉCNICA
            new Paragraph({
              text: "4. ANÁLISE TÉCNICA",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            new Paragraph({
              text: TEMPLATE_ANALISE_TECNICA,
              alignment: AlignmentType.JUSTIFIED
            }),
            
            // 4.1 NÃO CONFORMIDADES
            new Paragraph({
              text: "4.1 NÃO CONFORMIDADES IDENTIFICADAS",
              heading: HeadingLevel.HEADING_2
            }),
            
            // Adicionar não conformidades
            ...naoConformidadesParagrafos,
            
            // 5. CONCLUSÃO
            new Paragraph({
              text: "5. CONCLUSÃO",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            new Paragraph({
              text: conclusaoTexto,
              alignment: AlignmentType.JUSTIFIED
            }),
            
            // 6. OBSERVAÇÕES FINAIS
            new Paragraph({
              text: "6. OBSERVAÇÕES FINAIS",
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: false
            }),
            
            new Paragraph({
              text: relatorio.observacoesGerais || 
                "Este relatório foi elaborado com base na inspeção técnica realizada no local, seguindo os procedimentos padrão da Brasilit.",
              alignment: AlignmentType.JUSTIFIED
            }),
            
            // Assinatura
            new Paragraph({
              text: "Responsável Técnico",
              alignment: AlignmentType.CENTER,
              spacing: { before: 480, after: 240 }
            }),
            
            new Paragraph({
              text: relatorio.elaboradoPor || "Técnico Brasilit",
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Brasilit Saint-Gobain",
                  bold: true
                })
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        }
      ]
    });
    
    // Gerar arquivo DOCX em formato blob
    log("Gerando arquivo DOCX...");
    return await Packer.toBlob(doc);
  } catch (error) {
    log("Erro ao gerar relatório:", error);
    throw new Error(`Falha ao gerar o relatório: ${error instanceof Error ? error.message : String(error)}`);
  }
}