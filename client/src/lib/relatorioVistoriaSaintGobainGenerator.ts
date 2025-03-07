/**
 * Gerador de Relatórios DOCX com formatação exata conforme modelo Saint-Gobain Brasilit
 * 
 * Esta versão foi desenvolvida para atender exatamente a formatação solicitada
 * de acordo com o documento de referência fornecido.
 * 
 * Características:
 * - Formatação Arial 10pt
 * - Layout em tabelas conforme modelo original
 * - Cabeçalho com logo da Saint-Gobain
 * - Rodapé com logotipos das marcas
 * - Formatação de não conformidades conforme especificado
 */

import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Packer,
  BorderStyle,
  PageOrientation,
  VerticalAlign,
  Header,
  Footer,
  ImageRun,
  Tab,
  TabStopPosition,
  TabStopType,
  ExternalHyperlink,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  TableRow,
  TableCell,
  Table,
  WidthType,
  ShadingType
} from "docx";
import type { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";

function log(...args: any[]) {
  console.log("[RelatorioVistoriaSaintGobainGenerator]", ...args);
}

/**
 * Gera um documento DOCX para o relatório de vistoria técnica
 * Formatação exata conforme modelo Saint-Gobain
 * 
 * @param relatorio Dados do relatório de vistoria
 * @returns Promise<Blob> Documento DOCX gerado
 */
export async function gerarRelatorioSaintGobain(relatorio: RelatorioVistoria | any): Promise<Blob> {
  try {
    log("Iniciando geração do relatório com formatação exata Saint-Gobain...");
    
    // Preparar textos do relatório (aplicar templates padronizados para textos fixos)
    const introducaoTexto = relatorio.introducao || 
      `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada à permeabilidade de telhas de fibrocimento. As telhas instaladas são do modelo BRASILIT FIBROCIMENTO ONDULADA de 6 mm e instaladas com elementos complementares CBP3 - Cumeeira Articulada e parafusos. Tudo feito conforme segue especificações técnicas e norma institucional ISO 9001, bem como as normas técnicas da ABNT: NBR 15210-1, NBR15210-2 e NBR-7581/03.`;
    
    // Criar tabela de informações básicas
    const tabelaDadosBasicos = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
      rows: [
        // Linha do título
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              shading: {
                fill: "0070C0", // Cor azul conforme modelo
                type: ShadingType.CLEAR,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "RELATÓRIO TÉCNICO",
                      bold: true,
                      color: "FFFFFF",
                      size: 24, // 12pt
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha da Data de Vistoria
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Data de Vistoria:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.dataVistoria || "05/05/2024",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do Cliente
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Cliente:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.cliente || "Rafael Onesti de Souza",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do Empreendimento
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 4,
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Endereço:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.empreendimento || "Associação Vida",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do Endereço
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.endereco || "Rua Domingos",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha da Cidade
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.cidade || "Chapecó",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha da UF
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.uf || "SC - PR",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do FAR/Protocolo
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "FAR/Protocolo:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.protocolo || "FAR-629349",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do Assunto
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Assunto:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.assunto || "AT - BRA - PERMEABILIDADE - Telhas com vazamento Geral",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Tabela de responsáveis técnicos
    const tabelaResponsaveisTecnicos = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
      rows: [
        // Linha do Elaborado por
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Elaborado por:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Departamento:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Unidade:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Valores dos responsáveis
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.elaboradoPor || "Lucas Henrique da Silva",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.departamento || "Assistência Técnica",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.unidade || "PR/SC",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Linha do Coordenador
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Coordenador Responsável:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Gerente Responsável:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Regional:",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Valores dos gerentes
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.coordenador || "Marlon Weingartner",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.gerente || "Elisabeth Kudo",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: relatorio.regional || "Sul",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Tabela de Análise/Introdução
    const tabelaIntroducao = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
      rows: [
        // Cabeçalho da tabela
        new TableRow({
          children: [
            new TableCell({
              shading: {
                fill: "c00000", // Cor vermelha conforme modelo
                type: ShadingType.CLEAR,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "ANÁLISE",
                      bold: true,
                      color: "FFFFFF",
                      size: 24, // 12pt
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Conteúdo da análise
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: introducaoTexto,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
              ],
            }),
          ],
        }),
      ],
    });
    
    // Preparar parágrafos para não conformidades encontradas
    const naoConformidadesParagrafos: Paragraph[] = [];
    
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      relatorio.naoConformidades.forEach((naoConf: { selecionado: boolean; titulo: string; descricao: string }, index: number) => {
        if (naoConf.selecionado) {
          naoConformidadesParagrafos.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120 },
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text: `${naoConf.titulo}: `,
                  size: 20,
                  bold: true
                }),
                new TextRun({
                  text: naoConf.descricao,
                  size: 20
                })
              ]
            })
          );
        }
      });
    } else {
      // Adicionar não conformidades padrão do modelo
      naoConformidadesParagrafos.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "CORTE DE CANTO NÃO REALIZADO: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "ERVA INDICAÇÃO DO FABRICANTE (CACHIMBO/CARANGEJO);",
              size: 20
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "FIXAÇÃO IRREGULAR DAS TELHAS; ",
              size: 20,
              bold: true
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "CAMINHAMENTO DIRETO NO TELHADO.",
              size: 20,
              bold: true
            })
          ]
        })
      );
    }
    
    // Tabela da conclusão  
    const tabelaConclusao = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
      rows: [
        // Cabeçalho da tabela
        new TableRow({
          children: [
            new TableCell({
              shading: {
                fill: "c00000", // Cor vermelha conforme modelo
                type: ShadingType.CLEAR,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "CONCLUSÃO",
                      bold: true,
                      color: "FFFFFF",
                      size: 24, // 12pt
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Conteúdo da conclusão
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "A patologia reclamante da infiltração das telhas de fibrocimento modelo 6 mm CRFS se deve a erros construtivos e irregularidades nas telhas causadas pelo seguinte fator de instalação:",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "CORTE DE CANTO NÃO REALIZADO:",
                      size: 20,
                      bold: true,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                ...naoConformidadesParagrafos,
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Em função das não conformidades constatadas na montagem e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, tendo em vista que os problemas apresentados são relacionados à instalação das telhas e não a problemas relacionados à qualidade do material.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de garantia com relação a problemas de fabricação. A garantia Brasil está condicionada à correta aplicação do produto, seguindo sempre as instruções de instalação contidas no Manual de Montagem das Telhas Onduladas. Este manual pode ser encontrado no site Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Ratificamos que os produtos Brasilit atendem às Normas da Associação Brasileira de Normas Técnicas (ABNT) e são devidamente certificados e cumprem os requisitos legais de garantia de produtos conforme a legislação em vigor.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Desde já agradecemos o nos colocamos à disposição para esclarecer quaisquer esclarecimentos que se fizeram necessários.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Atenciosamente,",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Saint-Gobain do Brasil Prod. Ind. e para Const. Civil Ltda.",
                      size: 20,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Divisão Produtos Para Construção",
                      size: 20,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Departamento de Assistência Técnica",
                      size: 20,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    
    // Criação do documento final
    const doc = new Document({
      title: "Relatório de Vistoria Técnica",
      description: "Relatório de Vistoria Técnica gerado pelo sistema Brasilit",
      creator: "Saint-Gobain Brasil",
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 20 // 10pt
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15x line spacing
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
                top: 567, // 1cm em twips
                right: 567, // 1cm em twips
                bottom: 567, // 1cm em twips
                left: 567 // 1cm em twips
              }
            }
          },
          children: [
            // Cabeçalho com logo Saint-Gobain
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
              children: [
                new TextRun({
                  text: "SAINT-GOBAIN",
                  bold: true,
                  size: 24, // 12pt
                  color: "ff0000" // vermelho para simular o logo
                })
              ]
            }),
            
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
              children: [
                new TextRun({
                  text: "PRODUTOS PARA CONSTRUÇÃO",
                  size: 20, 
                  color: "0070c0" // azul para simular a descrição sob o logo
                })
              ]
            }),
            
            // Tabela de dados
            tabelaDadosBasicos,
            
            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 120, after: 120 }
            }),
            
            // Tabela de responsáveis
            tabelaResponsaveisTecnicos,
            
            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 120, after: 120 }
            }),
            
            // Tabela de análise/introdução
            tabelaIntroducao,
            
            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 120, after: 120 }
            }),
            
            // Tabela de conclusão
            tabelaConclusao,
            
            // Rodapé com logos
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 360 },
              children: [
                new TextRun({
                  text: "[Logos das marcas Saint-Gobain]",
                  size: 16,
                  color: "808080"
                })
              ]
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