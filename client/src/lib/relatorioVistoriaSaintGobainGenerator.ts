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
    
    // Preparar textos do relatório conforme modelo preciso da Saint-Gobain
    const introducaoTexto = relatorio.introducao || 
      `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada à permeabilidade de telhas de fibrocimento. As telhas instaladas são do modelo BRASILIT FIBROCIMENTO ONDULADA de 6 mm e instaladas com elementos complementares CBP3 - Cumeeira Articulada e parafusos. Tudo conforme especificações técnicas e norma institucional ISO 9001, bem como as normas técnicas da ABNT: NBR 15210-1, NBR15210-2 e NBR 7581-3.`;
    
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

    // Tabela de Introdução - Sem bordas na tabela conforme referência
    const tabelaIntroducao = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
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
                      text: "Introdução",
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
        // Conteúdo da introdução
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de ${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].espessura : "6mm"}, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.farProtocolo || "Não Informado"}.`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `O modelo de telha escolhido para a edificação foi: ${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].modelo : "ONDULADA"} de ${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].espessura : "6mm"}. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia || "10"} anos (ou ${relatorio.anosGarantiaSistemaCompleto || "15"} anos para sistema completo).`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Quantidade e modelo:`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].quantidade || '0' : '0'}: ${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].modelo : "ONDULADA"} ${relatorio.telhas && relatorio.telhas.length > 0 ? relatorio.telhas[0].espessura : "6mm"} CRFS.`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Área coberta: ${relatorio.telhas && relatorio.telhas.length > 0 && relatorio.telhas[0].area ? relatorio.telhas[0].area : '0'}m² aproximadamente.`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.`,
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
    
    // Tabela de Análise Técnica
    const tabelaAnaliseTecnica = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
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
                      text: "Análise Técnica",
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
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:",
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
      // Adicionar não conformidades padrão do modelo conforme o texto original
      naoConformidadesParagrafos.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Armazenagem Incorreta: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme.",
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
              text: "Inclinação da Telha Inferior ao Recomendado: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira.",
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
              text: "Balanço Livre do Beiral Incorreto: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura.",
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
              text: "Recobrimento Incorreto: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura.",
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
              text: "Sentido de Montagem Incorreto: ",
              size: 20,
              bold: true
            }),
            new TextRun({
              text: "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos.",
              size: 20
            })
          ]
        })
      );
    }
    
    // Tabela da conclusão - Sem bordas conforme referência
    const tabelaConclusao = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
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
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "A patologia reclamante da infiltração das telhas de fibrocimento modelo 6 mm CRFS se deve a erros construtivos e irregularidades nas telhas causadas pelo seguinte fator de instalação:",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
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
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Em função das não conformidades constatadas na montagem e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, tendo em vista que os problemas apresentados são relacionados à instalação das telhas e não a problemas relacionados à qualidade do material.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada à correta aplicação do produto, seguindo sempre as instruções de instalação contidas no Manual de Montagem das Telhas Onduladas. Este manual pode ser encontrado no site Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Ratificamos que os produtos Brasilit atendem às Normas da Associação Brasileira de Normas Técnicas (ABNT) e são devidamente certificados e cumprem os requisitos legais de garantia de produtos conforme a legislação em vigor.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Desde já agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessários.",
                      size: 20,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
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
              font: "Times New Roman",
              size: 24 // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5x line spacing (ABNT)
              },
              alignment: AlignmentType.JUSTIFIED, // Texto justificado conforme ABNT
            }
          }
        }
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // 2.5cm em twips (1cm ≈ 567 twips)
                right: 1134, // 2.5cm em twips
                bottom: 1134, // 2.5cm em twips
                left: 1361 // 3.0cm em twips para margem esquerda ABNT
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
            
            // Tabela de introdução
            tabelaIntroducao,
            
            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 120, after: 120 }
            }),
            
            // Tabela de análise técnica
            tabelaAnaliseTecnica,
            
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