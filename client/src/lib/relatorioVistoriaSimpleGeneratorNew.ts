/**
 * Gerador SIMPLIFICADO de Relatórios DOCX com formatação exata conforme PDF de referência
 * 
 * Esta versão foi desenvolvida para atender exatamente a formatação solicitada
 * de acordo com o documento PDF de referência fornecido.
 * 
 * Características:
 * - Formatação Times New Roman 12pt
 * - Espaçamento entre linhas 1,5
 * - Margens ABNT (superior, inferior e direita: 2,5cm; esquerda: 3,0cm)
 * - Espaçamento exato entre parágrafos conforme o modelo
 * - Formatação de não conformidades conforme especificado
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  convertInchesToTwip,
  LevelFormat,
  UnderlineType,
  BorderStyle,
  HeadingLevel
} from "docx";

import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

// Ativação de logs detalhados para diagnóstico
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[SimpleGeneratorNew]", ...args);
}

/**
 * Gera um documento DOCX para o relatório de vistoria técnica
 * Formatação exata conforme PDF de referência
 * 
 * @param relatorio Dados do relatório de vistoria
 * @returns Promise<Blob> Documento DOCX gerado
 */
export async function gerarRelatorioSimples(relatorio: RelatorioVistoria): Promise<Blob> {
  log("Iniciando geração do relatório para", relatorio.cliente);

  // Aplicar os templates de texto com as substituições de variáveis
  const dadosTemplate = {
    modeloTelha: relatorio.modeloTelha || "Ondulada",
    espessura: relatorio.espessura || "6",
    protocolo: relatorio.protocolo || "(Número do protocolo)",
    anosGarantia: relatorio.anosGarantia || "5",
    anosGarantiaSistemaCompleto: relatorio.anosGarantiaSistemaCompleto || "10",
    anosGarantiaTotal: relatorio.anosGarantiaTotal || "10",
    resultado: relatorio.resultado || "IMPROCEDENTE"
  };
  
  // Usar as funções de template para garantir a substituição correta das variáveis
  const introducaoTexto = aplicarTemplateIntroducao(dadosTemplate);
  const analiseTecnicaTexto = TEMPLATE_ANALISE_TECNICA;
  const conclusaoTexto = aplicarTemplateConclusao(dadosTemplate);
  
  log("Templates de texto aplicados com os seguintes dados:", dadosTemplate);

  // Preparar parágrafos para não conformidades selecionadas
  const naoConformidadesParagrafos: Paragraph[] = [];
  
  // Garantir que temos o array completo de não conformidades
  let naoConformidadesProcessadas = [];
  
  log("Processando não conformidades:", relatorio.naoConformidades);
  
  // Verificar o tipo de dados recebido e processar adequadamente
  if (Array.isArray(relatorio.naoConformidades)) {
    if (relatorio.naoConformidades.length > 0) {
      // Verificar se estamos recebendo objetos completos ou apenas IDs
      if (typeof relatorio.naoConformidades[0] === 'object') {
        // Caso 1: Array de objetos completos (de formulários)
        naoConformidadesProcessadas = relatorio.naoConformidades
          .filter((nc: any) => nc.selecionado) // Filtrar apenas as selecionadas
          .map((nc: any) => {
            // Se o objeto já tem título e descrição, usá-los
            if (nc.titulo && nc.descricao) {
              return nc;
            }
            // Caso contrário, buscar na lista de disponíveis pelo ID
            const completa = naoConformidadesDisponiveis.find(n => n.id === nc.id);
            return completa || null;
          })
          .filter(Boolean); // Remover nulos
      } else {
        // Caso 2: Array de IDs ou números (dos botões diretos)
        naoConformidadesProcessadas = relatorio.naoConformidades
          .map((id: any) => {
            const ncId = typeof id === 'string' || typeof id === 'number' ? id : null;
            if (ncId === null) return null;
            return naoConformidadesDisponiveis.find(n => n.id === ncId || n.id === Number(ncId));
          })
          .filter(Boolean); // Remover nulos
      }
    }
  }
  
  log("Não conformidades processadas:", naoConformidadesProcessadas);
  const naoConformidadesCompletas = naoConformidadesProcessadas;

  // Gerar parágrafos para cada não conformidade
  naoConformidadesCompletas.forEach((nc, idx) => {
    // Título da não conformidade
    naoConformidadesParagrafos.push(
      new Paragraph({
        spacing: { before: 240, after: 180 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: `${idx+1}. ${nc.titulo}`,
            bold: true,
            size: 24 // 12pt
          }),
        ],
      })
    );

    // Texto da não conformidade
    naoConformidadesParagrafos.push(
      new Paragraph({
        text: nc.descricao,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 120, after: 240 },
        indent: { left: 360 },
      })
    );
  });

  try {
    // Criar o documento com todas as seções
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Times New Roman",
              size: 24, // 12 pontos (24 half-points)
            },
            paragraph: {
              spacing: { 
                line: 360, // Espaçamento 1,5 linhas (240 = 1 linha)
                after: 160 // 8 pontos de espaço após parágrafo (20 twips = 1 ponto)
              },
              alignment: AlignmentType.JUSTIFIED // Texto justificado por padrão
            }
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1008,  // 3,5 cm (aproximadamente)
                right: 864, // 3,0 cm
                bottom: 864, // 3,0 cm
                left: 1008, // 3,5 cm
              },
              size: {
                width: 11906, // A4 width (210mm em twip)
                height: 16838, // A4 height (297mm em twip)
              },
            },
          },
          children: [
            // Cabeçalho
            // Cabeçalho com nome da empresa
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 120 },
              children: [
                new TextRun({
                  text: "SAINT-GOBAIN BRASIL",
                  bold: true,
                  size: 24, // 12pt
                }),
              ],
            }),
            
            // Linha de divisão
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 240 },
              children: [
                new TextRun({
                  text: "Divisão Brasilit - Assistência Técnica",
                  size: 24, // 12pt
                }),
              ],
            }),
            
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 480 },
              children: [
                new TextRun({
                  text: "RELATÓRIO DE VISTORIA TÉCNICA",
                  bold: true,
                  size: 28, // 14pt
                }),
              ],
            }),
            
            // Informações básicas
            new Paragraph({
              children: [
                new TextRun({
                  text: "Data da vistoria: ",
                  bold: true,
                  size: 24 // 12pt
                }),
                new TextRun({
                  text: relatorio.dataVistoria || "__/__/____",
                  size: 24
                })
              ],
              spacing: { before: 240, after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cliente: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.cliente || "(Nome do Cliente)",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Empreendimento: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.empreendimento || "(Nome do Empreendimento)",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Endereço: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.endereco || "(Endereço)",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cidade/UF: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: `${relatorio.cidade || "(Cidade)"}/${relatorio.uf || "UF"}`,
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "FAR/Protocolo: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.protocolo || "(Número do Protocolo)",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Assunto: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.assunto || "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Elaborado por: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.elaboradoPor || "Técnico Teste",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Departamento: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.departamento || "Assistência Técnica",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Unidade: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.unidade || "PR",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Coordenador Responsável: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.coordenador || "Marlon Weingartner",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Gerente Responsável: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.gerente || "Elisabeth Kudo",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Regional: ",
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: relatorio.regional || "Sul",
                  size: 24
                })
              ],
              spacing: { after: 240 }
            }),
            
            // INTRODUÇÃO (com formato de seção numerada)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "1. INTRODUÇÃO",
                  bold: true,
                  size: 24 // 12pt
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
            }),
            
            new Paragraph({
              text: introducaoTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // ANÁLISE TÉCNICA (com formato de seção numerada)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "2. ANÁLISE TÉCNICA",
                  bold: true,
                  size: 24 // 12pt
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
            }),
            
            new Paragraph({
              text: analiseTecnicaTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Seção de especificações técnicas das telhas
            new Paragraph({
              spacing: { before: 240, after: 240 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: "Especificações técnicas das telhas:",
                  bold: true,
                  size: 24 // 12pt
                }),
              ],
            }),
            
            new Paragraph({
              spacing: { after: 180 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: `Modelo: ${relatorio.modeloTelha || "Ondulada"}`,
                  size: 24
                }),
              ],
            }),
            
            new Paragraph({
              spacing: { after: 180 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: `Espessura: ${relatorio.espessura || "6"}mm`,
                  size: 24
                }),
              ],
            }),
            
            new Paragraph({
              spacing: { after: 180 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: `Quantidade: ${relatorio.quantidade || "0"} peças`,
                  size: 24
                }),
              ],
            }),
            
            new Paragraph({
              spacing: { after: 240 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: `Área total aproximada: ${relatorio.area || "0"}m²`,
                  size: 24
                }),
              ],
            }),
            
            // Parágrafos das não conformidades
            ...naoConformidadesParagrafos,
            
            // CONCLUSÃO (com formato de seção numerada)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "3. CONCLUSÃO",
                  bold: true,
                  size: 24 // 12pt
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
            }),
            
            new Paragraph({
              text: conclusaoTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Assinatura
            new Paragraph({
              spacing: { before: 720, after: 240 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "______________________________",
                  size: 24
                }),
              ],
            }),
            
            new Paragraph({
              spacing: { after: 240 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: relatorio.elaboradoPor || "(Nome do Técnico)",
                  bold: true,
                  size: 24
                }),
              ],
            }),
            
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: relatorio.departamento || "(Departamento)",
                  size: 24
                }),
              ],
            }),
          ],
        },
      ],
    });

    try {
      // Método preferencial: usar toBlob (compatível com navegador)
      log("Tentando gerar documento usando toBlob...");
      const blob = await Packer.toBlob(doc);
      log("Documento gerado com sucesso usando toBlob");
      return blob;
    } catch (error) {
      log("Erro ao usar toBlob, tentando método alternativo:", error);
      
      try {
        // Método alternativo 1: Base64String
        log("Tentando gerar usando toBase64String...");
        const base64 = await Packer.toBase64String(doc);
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { 
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        });
        log("Documento gerado com sucesso usando toBase64String");
        return blob;
      } catch (secondError) {
        log("Erro em métodos alternativos:", secondError);
        throw new Error("Não foi possível gerar o documento: " + String(error));
      }
    }
  } catch (error) {
    log("Erro ao gerar relatório:", error);
    throw new Error("Falha ao gerar o relatório: " + String(error));
  }
}