/**
 * Gerador minimalista de relatórios de vistoria em formato DOCX
 * Usa a biblioteca docx diretamente, sem dependências complexas
 */

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

// Logs para debug
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[MinimalGenerator]", ...args);
}

// Interface estendida para compatibilidade
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

/**
 * Gera um documento DOCX minimalista sem fotos ou tabelas
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaMinimal(relatorio: ExtendedRelatorioVistoria): Promise<Blob> {
  try {
    console.log('Usando gerador minimalista para DOCX com formatação ABNT');
    
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
                  bold: true
                })
              ]
            })
          );
          
          naoConformidadesParags.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: nc.descricao
                })
              ],
              spacing: { after: 300 }
            })
          );
        });
      } else {
        naoConformidadesParags.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades.",
            spacing: { after: 300 }
          })
        );
      }
    } else {
      naoConformidadesParags.push(
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
    
    // Conclusão - sempre usando IMPROCEDENTE 
    const conclusaoTexto = aplicarTemplateConclusao({
      resultado: "IMPROCEDENTE",
      modeloTelha: relatorio.modeloTelha,
      anosGarantiaTotal: relatorio.anosGarantiaTotal
    });
    
    // Criar um documento seguindo as normas ABNT e usar fonte Arial
    const doc = new Document({
      // Configurações globais do documento de acordo com ABNT
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 24, // 12pt (24 half-points)
              color: "000000"
            },
            paragraph: {
              spacing: {
                line: 360, // Espaçamento entre linhas (1.5 de acordo com ABNT)
                after: 240 // Espaçamento após cada parágrafo (padrão ABNT)
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
                before: 360,
                after: 240
              },
              alignment: AlignmentType.CENTER
            }
          },
          heading2: {
            run: {
              font: "Arial",
              size: 26, // 13pt
              bold: true,
              color: "000000"
            },
            paragraph: {
              spacing: {
                before: 360,
                after: 240
              }
            }
          },
          heading3: {
            run: {
              font: "Arial",
              size: 24, // 12pt
              bold: true,
              color: "000000"
            },
            paragraph: {
              spacing: {
                before: 360,
                after: 240
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
                top: 1133, // 2cm - convertido para TWIPs (567 TWIPs = 1cm)
                right: 850, // 1.5cm
                bottom: 1133, // 2cm
                left: 1700 // 3cm (norma ABNT para borda da esquerda)
              }
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
              text: "IDENTIFICAÇÃO DO PROJETO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            
            // Dados do projeto
            new Paragraph({
              children: [
                new TextRun({ text: "Protocolo/FAR: ", bold: true }),
                new TextRun(relatorio.protocolo || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Data de vistoria: ", bold: true }),
                new TextRun(relatorio.dataVistoria || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cliente: ", bold: true }),
                new TextRun(relatorio.cliente || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Empreendimento: ", bold: true }),
                new TextRun(relatorio.empreendimento || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true }),
                new TextRun(relatorio.endereco || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cidade/UF: ", bold: true }),
                new TextRun(`${relatorio.cidade || ""} - ${relatorio.uf || ""}`)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Assunto: ", bold: true }),
                new TextRun(relatorio.assunto || "")
              ],
              spacing: { after: 300 }
            }),
            
            // 2. RESPONSÁVEIS TÉCNICOS
            new Paragraph({
              text: "RESPONSÁVEIS TÉCNICOS",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Elaborado por: ", bold: true }),
                new TextRun(relatorio.elaboradoPor || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Departamento: ", bold: true }),
                new TextRun(relatorio.departamento || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Unidade: ", bold: true }),
                new TextRun(relatorio.unidade || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Coordenador: ", bold: true }),
                new TextRun(relatorio.coordenador || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Gerente: ", bold: true }),
                new TextRun(relatorio.gerente || "")
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Regional: ", bold: true }),
                new TextRun(relatorio.regional || "")
              ],
              spacing: { after: 300 }
            }),
            
            // 3. INTRODUÇÃO
            new Paragraph({
              text: "1. INTRODUÇÃO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              text: introducaoTexto,
              spacing: { after: 200 }
            }),
            
            // 3.1 DADOS DO PRODUTO
            new Paragraph({
              text: "1.1 DADOS DO PRODUTO",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Quantidade: ", bold: true, font: "Arial" }),
                new TextRun({ 
                  text: relatorio.quantidade ? relatorio.quantidade.toString() : "Não informada",
                  font: "Arial"
                })
              ],
              spacing: { after: 100 }
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
              spacing: { after: 100 }
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
              spacing: { after: 300 }
            }),
            
            // 4. ANÁLISE TÉCNICA
            new Paragraph({
              text: "2. ANÁLISE TÉCNICA",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              text: TEMPLATE_ANALISE_TECNICA,
              spacing: { after: 200 }
            }),
            
            // 4.1 NÃO CONFORMIDADES
            new Paragraph({
              text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 200 }
            }),
            
            ...naoConformidadesParags,
            
            // 5. CONCLUSÃO
            new Paragraph({
              text: "3. CONCLUSÃO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
              spacing: { after: 200 }
            }),
            
            ...naoConformidadesParags.filter((_, i) => i % 2 === 0), // Apenas os títulos (parágrafos pares)
            
            new Paragraph({
              text: conclusaoTexto,
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              text: relatorio.recomendacao || '',
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              text: "Atenciosamente,",
              spacing: { after: 400 }
            }),
            
            // Assinatura
            new Paragraph({
              text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
              spacing: { before: 400, after: 100 }
            }),
            
            new Paragraph({
              text: "Divisão Produtos Para Construção",
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              text: "Departamento de Assistência Técnica",
              spacing: { after: 400 }
            }),
            
            new Paragraph({
              text: `${relatorio.elaboradoPor}`,
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              text: `${relatorio.departamento} - ${relatorio.unidade}`,
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              text: `CREA/CAU ${relatorio.numeroRegistro || ""}`,
              spacing: { after: 100 }
            }),
          ]
        }
      ]
    });
    
    // Gerar o documento como blob
    const blob = await Packer.toBlob(doc);
    console.log('Documento DOCX gerado com sucesso!');
    return blob;
    
  } catch (error) {
    console.error('Erro ao gerar documento DOCX minimalista:', error);
    throw new Error(`Não foi possível gerar o documento DOCX: ${error}`);
  }
}