/**
 * Gerador minimalista de relatórios de vistoria em formato DOCX
 * Usa a biblioteca docx diretamente, sem dependências complexas
 */

// Importação explícita com nomes diferentes para evitar conflitos
import { 
  Document as DocxDocument, 
  Packer as DocxPacker, 
  Paragraph as DocxParagraph, 
  TextRun as DocxTextRun, 
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
  if (DEBUG) console.log("[MinimalGenerator]", ...args);
}

// Aliases para as classes principais (para compatibilidade com código existente)
const Paragraph = DocxParagraph;
const TextRun = DocxTextRun;

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
    console.log('✅ Usando gerador minimalista para DOCX com formatação ABNT [ATIVO]');
    
    // Preparar não conformidades
    let naoConformidadesParags: DocxParagraph[] = [];
    
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
            new DocxParagraph({
              children: [
                new DocxTextRun({
                  text: `${index + 1}. ${nc.titulo}`,
                  bold: true,
                  font: "Arial"
                })
              ],
              spacing: { after: 20 } // Espaçamento reduzido
            })
          );
          
          naoConformidadesParags.push(
            new DocxParagraph({
              children: [
                new DocxTextRun({
                  text: nc.descricao,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 60 } // Espaçamento reduzido
            })
          );
        });
      } else {
        naoConformidadesParags.push(
          new DocxParagraph({
            children: [
              new DocxTextRun({
                text: "Não foram identificadas não conformidades.",
                font: "Arial"
              })
            ],
            spacing: { after: 80 }
          })
        );
      }
    } else {
      naoConformidadesParags.push(
        new DocxParagraph({
          children: [
            new DocxTextRun({
              text: "Não foram identificadas não conformidades.",
              font: "Arial"
            })
          ],
          spacing: { after: 80 }
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
    // Com espaçamento reduzido para caber mais informações na primeira página
    const doc = new DocxDocument({
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
                line: 276, // Espaçamento entre linhas (1.15 - reduzido para caber mais conteúdo)
                after: 100 // Espaçamento após cada parágrafo (reduzido ainda mais)
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
                before: 180,
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
                before: 120,
                after: 60
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
                  text: "RELATÓRIO DE VISTORIA TÉCNICA [VERSÃO ABNT]",
                  bold: true,
                  size: 30, // 15pt
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6
                }
              }
            }),
            
            // 1. IDENTIFICAÇÃO DO PROJETO - sem numeração para economizar espaço
            new Paragraph({
              children: [
                new TextRun({
                  text: "IDENTIFICAÇÃO DO PROJETO",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 120, after: 60 }
            }),
            
            // Dados do projeto com espaçamento reduzido
            new Paragraph({
              children: [
                new TextRun({ text: "Protocolo/FAR: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.protocolo || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Data de vistoria: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.dataVistoria || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cliente: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.cliente || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Empreendimento: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.empreendimento || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.endereco || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cidade/UF: ", bold: true, font: "Arial" }),
                new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`, font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Assunto: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.assunto || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            
            // RESPONSÁVEIS TÉCNICOS - sem numeração para economizar espaço
            new Paragraph({
              children: [
                new TextRun({
                  text: "RESPONSÁVEIS TÉCNICOS",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 120, after: 60 }
            }),
            
            // Dados dos responsáveis com espaçamento reduzido
            new Paragraph({
              children: [
                new TextRun({ text: "Elaborado por: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.elaboradoPor || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Departamento: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.departamento || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Unidade: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.unidade || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Coordenador: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.coordenador || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Gerente: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.gerente || "", font: "Arial" })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Regional: ", bold: true, font: "Arial" }),
                new TextRun({ text: relatorio.regional || "", font: "Arial" })
              ],
              spacing: { after: 120 }
            }),
            
            // 1. INTRODUÇÃO - Adicionamos a numeração correta
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. INTRODUÇÃO",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 120, after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: introducaoTexto,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120 }
            }),
            
            // 1.1 DADOS DO PRODUTO
            new Paragraph({
              children: [
                new TextRun({
                  text: "1.1 DADOS DO PRODUTO",
                  bold: true,
                  size: 22, // 11pt
                  font: "Arial"
                })
              ],
              spacing: { before: 80, after: 40 }
            }),
            
            // Dados do produto com espaçamento reduzido
            new Paragraph({
              children: [
                new TextRun({ text: "Quantidade: ", bold: true, font: "Arial" }),
                new TextRun({ 
                  text: relatorio.quantidade ? relatorio.quantidade.toString() : "Não informada",
                  font: "Arial"
                })
              ],
              spacing: { after: 40 }
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
              spacing: { after: 40 }
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
              spacing: { after: 120 }
            }),
            
            // 2. ANÁLISE TÉCNICA
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. ANÁLISE TÉCNICA",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 120, after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: TEMPLATE_ANALISE_TECNICA,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120 }
            }),
            
            // 2.1 NÃO CONFORMIDADES
            new Paragraph({
              children: [
                new TextRun({
                  text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
                  bold: true,
                  size: 22, // 11pt
                  font: "Arial"
                })
              ],
              spacing: { before: 80, after: 40 }
            }),
            
            ...naoConformidadesParags,
            
            // 3. CONCLUSÃO
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. CONCLUSÃO",
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial"
                })
              ],
              spacing: { before: 120, after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
                  font: "Arial"
                })
              ],
              spacing: { after: 80 }
            }),
            
            ...naoConformidadesParags.filter((_, i) => i % 2 === 0), // Apenas os títulos (parágrafos pares)
            
            new Paragraph({
              children: [
                new TextRun({
                  text: conclusaoTexto,
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: relatorio.recomendacao || '',
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
                  font: "Arial"
                })
              ],
              spacing: { after: 80 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Atenciosamente,",
                  font: "Arial"
                })
              ],
              spacing: { after: 120 }
            }),
            
            // Assinatura com espaçamento reduzido
            new Paragraph({
              children: [
                new TextRun({
                  text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
                  font: "Arial"
                })
              ],
              spacing: { before: 120, after: 40 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Divisão Produtos Para Construção",
                  font: "Arial"
                })
              ],
              spacing: { after: 40 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Departamento de Assistência Técnica",
                  font: "Arial"
                })
              ],
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `${relatorio.elaboradoPor}`,
                  font: "Arial",
                  bold: true
                })
              ],
              spacing: { after: 40 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `${relatorio.departamento} - ${relatorio.unidade}`,
                  font: "Arial"
                })
              ],
              spacing: { after: 40 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `CREA/CAU ${relatorio.numeroRegistro || ""}`,
                  font: "Arial"
                })
              ],
              spacing: { after: 40 }
            }),
          ]
        }
      ]
    });
    
    // Gerar o documento como blob
    const blob = await DocxPacker.toBlob(doc);
    console.log('Documento DOCX gerado com sucesso!');
    return blob;
    
  } catch (error) {
    console.error('Erro ao gerar documento DOCX minimalista:', error);
    throw new Error(`Não foi possível gerar o documento DOCX: ${error}`);
  }
}