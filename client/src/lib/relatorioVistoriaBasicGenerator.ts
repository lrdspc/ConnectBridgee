/**
 * Gerador básico de relatórios de vistoria em formato DOCX
 * Abordagem simplificada para evitar problemas de importação
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  HeadingLevel, 
  BorderStyle 
} from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

// Logs para debug
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[BasicGenerator]", ...args);
}

// Interface estendida para compatibilidade
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

/**
 * Gera um documento DOCX simples sem formatação avançada
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaBasico(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    console.log('✅ Usando gerador básico para DOCX com formatação ABNT');
    
    // Preparar não conformidades
    let naoConformidadesParags: Paragraph[] = [];
    
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
        naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
          naoConformidadesParags.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${nc.titulo}`,
                  bold: true,
                  font: "Arial"
                })
              ],
              spacing: { after: 200 }
            })
          );
          
          naoConformidadesParags.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: nc.descricao,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 }
            })
          );
        });
      } else {
        naoConformidadesParags.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Não foram identificadas não conformidades.",
                font: "Arial"
              })
            ],
            spacing: { after: 300 }
          })
        );
      }
    } else {
      naoConformidadesParags.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Não foram identificadas não conformidades.",
              font: "Arial"
            })
          ],
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
    
    // Criar um documento seguindo as normas ABNT
    const doc = new Document({
      // Configurações globais do documento de acordo com ABNT
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica realizada em telhas e produtos Brasilit",
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 22, // 11pt (22 half-points)
              color: "000000"
            },
            paragraph: {
              spacing: {
                line: 360, // Espaçamento entre linhas (1.5 - padrão ABNT)
                after: 200 // Espaçamento após cada parágrafo
              },
              alignment: AlignmentType.JUSTIFIED // Texto justificado (ABNT)
            }
          },
          heading1: {
            run: {
              font: "Arial",
              size: 28, // 14pt
              bold: true,
              color: "000000"
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120
              },
              alignment: AlignmentType.CENTER
            }
          },
          heading2: {
            run: {
              font: "Arial",
              size: 24, // 12pt
              bold: true,
              color: "000000"
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120
              }
            }
          },
          heading3: {
            run: {
              font: "Arial",
              size: 22, // 11pt
              bold: true,
              color: "000000"
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120
              }
            }
          }
        }
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,      // 2,5 cm = ~720 twips (padrão ABNT)
                right: 720,    // 2,5 cm = ~720 twips
                bottom: 720,   // 2,5 cm = ~720 twips
                left: 864      // 3,0 cm = ~864 twips (padrão ABNT para encadernação)
              } // Margens padronizadas conforme ABNT NBR 14724
            }
          },
          children: [
            // Título principal (apenas uma vez)
            new Paragraph({
              children: [
                new TextRun({
                  text: "RELATÓRIO DE VISTORIA TÉCNICA",
                  bold: true,
                  size: 32, // 16pt
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
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
              children: [
                new TextRun({
                  text: "1. IDENTIFICAÇÃO DO PROJETO",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            // Dados do projeto
            new Paragraph({
              children: [
                new TextRun({ text: "Protocolo/FAR: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.protocolo || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Data de vistoria: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.dataVistoria || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cliente: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.cliente || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Empreendimento: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.empreendimento || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.endereco || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cidade/UF: ", bold: true, font: "Arial" }),
                new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`, font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Assunto: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.assunto || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            
            // 2. RESPONSÁVEIS TÉCNICOS
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. RESPONSÁVEIS TÉCNICOS",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            // Dados dos responsáveis
            new Paragraph({
              children: [
                new TextRun({ text: "Elaborado por: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.elaboradoPor || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Departamento: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.departamento || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Unidade: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.unidade || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Coordenador: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.coordenador || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Gerente: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.gerente || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Regional: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.regional || "", font: "Arial" })
              ],
              spacing: { after: 240 }
            }),
            
            // 3. INTRODUÇÃO
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. INTRODUÇÃO",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: introducaoTexto,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // 3.1 DADOS DO PRODUTO
            new Paragraph({
              children: [
                new TextRun({
                  text: "3.1 DADOS DO PRODUTO",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 240, after: 200 }
            }),
            
            // Dados do produto
            new Paragraph({
              children: [
                new TextRun({ text: "Quantidade: ", bold: true, font: "Arial" }),
                new TextRun({ 
                  text: relatorio.quantidade ? relatorio.quantidade.toString() : "Não informada",
                  font: "Arial"
                })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Modelo de telha: ", bold: true, font: "Arial" }),
                new TextRun({ 
                  text: relatorio.modeloTelha ? 
                    `${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS` : 
                    "Não informado",
                  font: "Arial"
                })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Área coberta: ", bold: true, font: "Arial" }),
                new TextRun({ 
                  text: relatorio.area ? 
                    `${relatorio.area.toString()}m² (aproximadamente)` : 
                    "Não informada",
                  font: "Arial"
                })
              ],
              spacing: { after: 240 }
            }),
            
            // 4. ANÁLISE TÉCNICA
            new Paragraph({
              children: [
                new TextRun({
                  text: "4. ANÁLISE TÉCNICA",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: TEMPLATE_ANALISE_TECNICA,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // 4.1 NÃO CONFORMIDADES
            new Paragraph({
              children: [
                new TextRun({
                  text: "4.1 NÃO CONFORMIDADES IDENTIFICADAS",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 240, after: 200 }
            }),
            
            ...naoConformidadesParags,
            
            // 5. CONCLUSÃO
            new Paragraph({
              children: [
                new TextRun({
                  text: "5. CONCLUSÃO",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: conclusaoTexto,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // 6. CONSIDERAÇÕES FINAIS
            new Paragraph({
              children: [
                new TextRun({
                  text: "6. CONSIDERAÇÕES FINAIS",
                  bold: true,
                  size: 28, // 14pt
                  font: "Arial"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: relatorio.observacoesGerais || 
                    "Este relatório foi elaborado com base na inspeção técnica realizada no local, seguindo os procedimentos padrão da Brasilit.",
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Assinatura
            new Paragraph({
              children: [
                new TextRun({
                  text: "Responsável Técnico",
                  bold: true,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600, after: 120 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: relatorio.elaboradoPor || "Técnico Brasilit",
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: relatorio.departamento || "Assistência Técnica",
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Brasilit Divisão Saint-Gobain",
                  bold: true,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 }
            }),
          ]
        }
      ]
    });
    
    // Gerar arquivo DOCX em formato blob
    log("🔄 Gerando arquivo DOCX...");
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("❌ Erro ao gerar documento:", error);
    throw new Error(`Não foi possível gerar o relatório em formato DOCX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}