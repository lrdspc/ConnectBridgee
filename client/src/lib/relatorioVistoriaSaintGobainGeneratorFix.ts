/**
 * Gerador de Relatórios DOCX com formatação exata conforme modelo Brasilit
 *
 * Esta versão foi corrigida para corresponder ao formato exato do documento de referência
 * com a estrutura de textos correta para validação jurídica.
 *
 * Características:
 * - Formatação Times New Roman 12pt
 * - Espaçamento de linha 1,5 conforme ABNT
 * - Textos justificados
 * - Cabeçalho Brasilit
 * - Cores e estrutura exatas do modelo fornecido
 * - Sem bordas em tabelas (layout limpo)
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  Packer,
  HeadingLevel,
  VerticalAlign,
} from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";

function log(...args: any[]) {
  console.log("[BrasilitGenerator]", ...args);
}

/**
 * Gera um documento DOCX para o relatório de vistoria técnica
 * Formatação exata conforme modelo Brasilit
 *
 * @param relatorio Dados do relatório de vistoria
 * @returns Promise<Blob> Documento DOCX gerado
 */
export async function gerarRelatorioSaintGobainFix(
  relatorio: RelatorioVistoria | any,
): Promise<Blob> {
  log("Iniciando geração de relatório Brasilit...");
  try {
    // Extração segura dos dados do relatório com valores padrão
    const dataVistoria =
      relatorio.dataVistoria || new Date().toLocaleDateString("pt-BR");
    const cliente = relatorio.cliente || "Cliente Não Informado";
    const empreendimento =
      relatorio.empreendimento || "Empreendimento Não Informado";
    const endereco = relatorio.endereco || "Endereço Não Informado";
    const cidade = relatorio.cidade || "Cidade Não Informada";
    const uf = relatorio.uf || "UF";
    const farProtocolo = relatorio.farProtocolo || "Não Informado";
    const assunto = relatorio.assunto || "Vistoria Técnica";

    const elaboradoPor = relatorio.elaboradoPor || "Técnico Não Informado";
    const departamento = relatorio.departamento || "Assistência Técnica";
    const unidade = relatorio.unidade || "Não Informada";
    const coordenador = relatorio.coordenador || "Não Informado";
    const gerente = relatorio.gerente || "Não Informado";
    const regional = relatorio.regional || "Não Informada";

    const modeloTelha =
      relatorio.telhas && relatorio.telhas.length > 0
        ? relatorio.telhas[0].modelo
        : "ONDULADA";

    const espessuraTelha =
      relatorio.telhas && relatorio.telhas.length > 0
        ? relatorio.telhas[0].espessura
        : "6mm";

    const quantidadeTelha =
      relatorio.telhas && relatorio.telhas.length > 0
        ? relatorio.telhas[0].quantidade || "0"
        : "0";

    const areaTelha =
      relatorio.telhas &&
      relatorio.telhas.length > 0 &&
      relatorio.telhas[0].area
        ? relatorio.telhas[0].area
        : "0";

    const anosGarantia = relatorio.anosGarantia || "10";
    const anosGarantiaSistemaCompleto =
      relatorio.anosGarantiaSistemaCompleto || "15";
    const anosGarantiaTotal = relatorio.anosGarantiaTotal || "10";

    const resultado = relatorio.resultado || "IMPROCEDENTE";

    // Tabela com dados básicos
    const tabelaDadosBasicos = new Table({
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
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "RELATÓRIO DE VISTORIA TÉCNICA",
                      bold: true,
                      size: 24, // 12pt
                    }),
                  ],
                  spacing: { after: 240 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Data de vistoria: ${dataVistoria}`,
                      size: 24, // 10pt
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Cliente: ${cliente}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Empreendimento: ${empreendimento}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Cidade: ${cidade} - ${uf}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Endereço: ${endereco}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `FAR/Protocolo: ${farProtocolo}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Assunto: ${assunto}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Tabela dos responsáveis técnicos
    const tabelaResponsaveisTecnicos = new Table({
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
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Elaborado por: ${elaboradoPor}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Departamento: ${departamento}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Unidade: ${unidade}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Coordenador Responsável: ${coordenador}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Gerente Responsável: ${gerente}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Regional: ${regional}`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Tabela de Introdução
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
                      text: `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de ${espessuraTelha}, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${farProtocolo}.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `O modelo de telha escolhido para a edificação foi: ${modeloTelha} de ${espessuraTelha}. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${anosGarantia} anos (ou ${anosGarantiaSistemaCompleto} anos para sistema completo).`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Quantidade e modelo:`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `${quantidadeTelha}: ${modeloTelha} ${espessuraTelha} CRFS.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Área coberta: ${areaTelha}m² aproximadamente.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Preparar parágrafos para não conformidades encontradas
    const naoConformidadesParagrafos: Paragraph[] = [];
    
    // Processar as não conformidades do relatório ou usar as padrões
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      relatorio.naoConformidades.forEach(
        (
          naoConf: { selecionado: boolean; titulo: string; descricao: string },
          index: number,
        ) => {
          if (naoConf.selecionado) {
            naoConformidadesParagrafos.push(
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: `${naoConf.titulo}: `,
                    size: 24,
                    bold: true,
                  }),
                  new TextRun({
                    text: naoConf.descricao,
                    size: 24,
                  }),
                ],
              }),
            );
          }
        },
      );
    } else {
      // Adicionar não conformidades padrão do modelo conforme o texto original
      naoConformidadesParagrafos.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Armazenagem Incorreta: ",
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: "Durante a inspeção, foi constatado que as telhas foram armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme.",
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Inclinação da Telha Inferior ao Recomendado: ",
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira.",
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Balanço Livre do Beiral Incorreto: ",
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura.",
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Recobrimento Incorreto: ",
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura.",
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Sentido de Montagem Incorreto: ",
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos.",
              size: 24,
            }),
          ],
        }),
      );
    }

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
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                ...naoConformidadesParagrafos,
              ],
            }),
          ],
        }),
      ],
    });

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
                      text: "Com base na análise técnica realizada, foram identificadas as não conformidades listadas acima.",
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `Em função das não conformidades constatadas na montagem e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como ${resultado}, tendo em vista que os problemas apresentados são relacionados à instalação das telhas e não a problemas relacionados à qualidade do material.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: `As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem ${anosGarantiaTotal} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada à correta aplicação do produto, seguindo sempre as instruções de instalação contidas no Manual de Montagem das Telhas Onduladas. Este manual pode ser encontrado no site Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.`,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Ratificamos que os produtos Brasilit atendem às Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.",
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessários.",
                      size: 24,
                    }),
                  ],
                  spacing: { after: 240 },
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: "Atenciosamente,",
                      size: 24,
                    }),
                  ],
                  spacing: { after: 240 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Brasilit - Divisão de Produtos para Construção",
                      size: 24,
                      bold: true,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Departamento de Assistência Técnica",
                      size: 24,
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

    // Criação do documento final com formatação correta
    const doc = new Document({
      title: "Relatório de Vistoria Técnica",
      description: "Relatório de Vistoria Técnica gerado pelo sistema Brasilit",
      creator: "Brasilit",
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 24, // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5x line spacing
              },
              alignment: AlignmentType.JUSTIFIED,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // 2.5cm em twips (1cm ≈ 567 twips)
                right: 1134, // 2.5cm em twips
                bottom: 1134, // 2.5cm em twips
                left: 1361, // 3.0cm em twips para margem esquerda ABNT
              },
            },
          },
          children: [
            // Cabeçalho com logo Brasilit
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "BRASILIT",
                  bold: true,
                  size: 28, // 14pt
                  color: "ff0000", // vermelho para o logo
                }),
              ],
            }),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
              children: [
                new TextRun({
                  text: "SOLUÇÕES PARA CONSTRUÇÃO",
                  size: 24, // 12pt
                  color: "0070c0", // azul para a descrição sob o logo
                }),
              ],
            }),

            // Tabela de dados
            tabelaDadosBasicos,

            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 200, after: 200 },
            }),

            // Tabela de responsáveis
            tabelaResponsaveisTecnicos,

            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 200, after: 200 },
            }),

            // Tabela de introdução
            tabelaIntroducao,

            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 200, after: 200 },
            }),

            // Tabela de análise técnica
            tabelaAnaliseTecnica,

            // Espaçamento entre tabelas
            new Paragraph({
              spacing: { before: 200, after: 200 },
            }),

            // Tabela de conclusão
            tabelaConclusao,

            // Assinaturas já incluídas na seção de conclusão
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
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
