import { format } from "date-fns";
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  Header,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  ImageRun,
  WidthType,
  HeightRule,
  TableLayoutType,
  Footer,
  PageNumber,
  SectionType,
  convertInchesToTwip,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  PageOrientation
} from "docx";
import { FARReport } from "../../shared/farReportSchema";

// Converte dataURL para um Buffer que pode ser usado pelo docx
async function dataUrlToBuffer(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// Estilos consistentes para o documento
const STYLES = {
  title: {
    size: 32,
    bold: true,
    font: "Arial",
  },
  heading1: {
    size: 28,
    bold: true,
    font: "Arial",
  },
  heading2: {
    size: 24,
    bold: true,
    font: "Arial",
  },
  heading3: {
    size: 18,
    bold: true,
    font: "Arial",
  },
  normalText: {
    size: 12,
    font: "Arial",
  },
  bold: {
    size: 12,
    bold: true,
    font: "Arial",
  },
  tableHeader: {
    size: 12,
    bold: true,
    font: "Arial",
  },
  tableBorders: {
    top: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "000000",
    },
    bottom: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "000000",
    },
    left: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "000000",
    },
    right: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "000000",
    },
  },
};

// Função para gerar o cabeçalho do relatório
function generateHeader() {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: "BRASILIT - SAINT-GOBAIN",
            ...STYLES.title,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "RELATÓRIO DE VISTORIA TÉCNICA FAR",
            ...STYLES.heading2,
          }),
        ],
      }),
    ],
  });
}

// Função para gerar o rodapé do relatório
function generateFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Página ",
            ...STYLES.normalText,
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            ...STYLES.normalText,
          }),
          new TextRun({
            text: " de ",
            ...STYLES.normalText,
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            ...STYLES.normalText,
          }),
        ],
      }),
    ],
  });
}

// Gera a tabela de identificação do projeto
function generateProjectTable(report: FARReport): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: STYLES.tableBorders,
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
                    text: "IDENTIFICAÇÃO DO PROJETO",
                    ...STYLES.tableHeader,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "DDDDDD",
            },
          }),
        ],
      }),
      createTableRow("Protocolo/FAR:", report.farProtocolo || ""),
      createTableRow("Data de vistoria:", formatDate(report.dataVistoria)),
      createTableRow("Cliente:", report.cliente),
      createTableRow("Empreendimento:", report.empreendimento),
      createTableRow("Endereço:", report.endereco),
      createTableRow("Cidade/UF:", `${report.cidade} - ${report.uf}`),
      createTableRow("Assunto:", report.assunto),
    ],
  });
}

// Gera a tabela de responsáveis técnicos
function generateResponsiblesTable(report: FARReport): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: STYLES.tableBorders,
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
                    text: "RESPONSÁVEIS TÉCNICOS",
                    ...STYLES.tableHeader,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "DDDDDD",
            },
          }),
        ],
      }),
      createTableRow("Elaborado por:", report.elaboradoPor),
      createTableRow("Departamento:", report.departamento),
      createTableRow("Unidade:", report.unidade),
      createTableRow("Coordenador:", report.coordenador),
      createTableRow("Gerente:", report.gerente),
      createTableRow("Regional:", report.regional),
    ],
  });
}

// Função auxiliar para criar uma linha de tabela
function createTableRow(label: string, value: string): TableRow {
  return new TableRow({
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
                text: label,
                ...STYLES.bold,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: {
          size: 70,
          type: WidthType.PERCENTAGE,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                ...STYLES.normalText,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Gera a seção de introdução
function generateIntroductionSection(report: FARReport): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      heading: 1,
      children: [
        new TextRun({
          text: "1. INTRODUÇÃO",
          ...STYLES.heading1,
        }),
      ],
      spacing: {
        before: 400,
        after: 200,
      },
    })
  );

  const introText = `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ${report.telhas[0]?.modelo?.toUpperCase() || 'ONDULADA'} de ${report.telhas[0]?.espessura || '6mm'}, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${report.farProtocolo}.

O modelo de telha escolhido para a edificação foi: ${report.telhas[0]?.modelo || 'Ondulada'} de ${report.telhas[0]?.espessura || '6mm'}. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${report.anosGarantia || '5'} anos (ou ${report.anosGarantiaSistemaCompleto || '10'} anos para sistema completo).`;

  introText.split('\n\n').forEach((paragraph) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: paragraph,
            ...STYLES.normalText,
          }),
        ],
        spacing: {
          before: 200,
          after: 200,
        },
      })
    );
  });

  // Subseção de dados do produto
  paragraphs.push(
    new Paragraph({
      heading: 2,
      children: [
        new TextRun({
          text: "1.1 DADOS DO PRODUTO",
          ...STYLES.heading3,
        }),
      ],
      spacing: {
        before: 300,
        after: 200,
      },
    })
  );

  // Tabela de especificações do produto
  const productTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: STYLES.tableBorders,
    rows: [
      createTableRow("Quantidade:", report.telhas.reduce((sum, telha) => sum + (telha.quantidade || 0), 0).toString()),
      createTableRow("Modelo:", `${report.telhas[0]?.modelo || 'Ondulada'} ${report.telhas[0]?.espessura || '6mm'} CRFS`),
      createTableRow("Área coberta:", `${calculateTotalArea(report.telhas).toFixed(2)}m² (aproximadamente)`),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [productTable],
      spacing: {
        before: 200,
        after: 200,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.",
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 200,
        after: 200,
      },
    })
  );

  return paragraphs;
}

// Gera a seção de análise técnica
function generateTechnicalAnalysisSection(report: FARReport): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      heading: 1,
      children: [
        new TextRun({
          text: "2. ANÁLISE TÉCNICA",
          ...STYLES.heading1,
        }),
      ],
      spacing: {
        before: 400,
        after: 200,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: report.analiseTecnica || "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos os seguintes desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante:",
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 200,
        after: 200,
      },
    })
  );

  // Subseção de não conformidades
  paragraphs.push(
    new Paragraph({
      heading: 2,
      children: [
        new TextRun({
          text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
          ...STYLES.heading3,
        }),
      ],
      spacing: {
        before: 300,
        after: 200,
      },
    })
  );

  // Adicionar problemas identificados
  const selectedProblems = report.problemas.filter(problema => problema.selecionado);
  
  if (selectedProblems.length > 0) {
    selectedProblems.forEach((problema, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${problema.tipo}: ${problema.descricao}`,
              ...STYLES.bold,
            }),
          ],
          spacing: {
            before: 200,
            after: 100,
          },
        })
      );

      if (problema.observacoes) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: problema.observacoes,
                ...STYLES.normalText,
              }),
            ],
            spacing: {
              before: 100,
              after: 200,
            },
            indent: {
              left: 720, // 0.5 inches em twips
            },
          })
        );
      }
    });
  } else {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Não foram identificadas não conformidades durante a vistoria.",
            ...STYLES.normalText,
          }),
        ],
        spacing: {
          before: 200,
          after: 200,
        },
      })
    );
  }

  return paragraphs;
}

// Gera a seção de conclusão
function generateConclusionSection(report: FARReport): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      heading: 1,
      children: [
        new TextRun({
          text: "3. CONCLUSÃO",
          ...STYLES.heading1,
        }),
      ],
      spacing: {
        before: 400,
        after: 200,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 200,
        after: 200,
      },
    })
  );

  // Lista de não conformidades identificadas
  const selectedProblems = report.problemas.filter(problema => problema.selecionado);
  
  if (selectedProblems.length > 0) {
    selectedProblems.forEach((problema, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${problema.tipo}`,
              ...STYLES.normalText,
            }),
          ],
          spacing: {
            before: 100,
            after: 100,
          },
          bullet: {
            level: 0,
          },
        })
      );
    });
  } else {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Não foram identificadas não conformidades significativas durante a vistoria.",
            ...STYLES.normalText,
          }),
        ],
        spacing: {
          before: 100,
          after: 200,
        },
      })
    );
  }

  const conclusionText = `Em função ${selectedProblems.length > 0 ? 'das não conformidades constatadas no manuseio e instalação das chapas Brasilit' : 'da análise técnica realizada'}, finalizamos o atendimento considerando a reclamação como ${report.resultado}, ${report.resultado === 'IMPROCEDENTE' ? 'onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.' : 'necessitando correções conforme indicado neste relatório.'

}As telhas BRASILIT modelo FIBROCIMENTO ${report.telhas[0]?.modelo?.toUpperCase() || 'ONDULADA'} possuem ${report.anosGarantiaTotal || '10'} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.${report.recomendacao ? `\n\nRecomendações: ${report.recomendacao}` : ''}${report.observacoesGerais ? `\n\nObservações gerais: ${report.observacoesGerais}` : ''}

Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.

Atenciosamente,`;

  conclusionText.split('\n\n').forEach((paragraph) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: paragraph,
            ...STYLES.normalText,
          }),
        ],
        spacing: {
          before: 200,
          after: 200,
        },
      })
    );
  });

  return paragraphs;
}

// Gera a seção de assinatura
function generateSignatureSection(report: FARReport): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          ...STYLES.bold,
        }),
      ],
      spacing: {
        before: 400,
        after: 100,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Divisão Produtos Para Construção",
          ...STYLES.bold,
        }),
      ],
      spacing: {
        before: 100,
        after: 100,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Departamento de Assistência Técnica",
          ...STYLES.bold,
        }),
      ],
      spacing: {
        before: 100,
        after: 300,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "_______________________________",
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 400,
        after: 100,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: report.elaboradoPor,
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 100,
        after: 100,
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${report.departamento} - ${report.unidade}`,
          ...STYLES.normalText,
        }),
      ],
      spacing: {
        before: 100,
        after: 100,
      },
    })
  );

  // Se houver número de registro CREA/CAU
  if (report.numeroRegistro) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `CREA/CAU ${report.numeroRegistro}`,
            ...STYLES.normalText,
          }),
        ],
        spacing: {
          before: 100,
          after: 100,
        },
      })
    );
  }

  return paragraphs;
}

// Função auxiliar para calcular a área total
function calculateTotalArea(telhas: any[]): number {
  return telhas.reduce((total, telha) => {
    if (!telha || !telha.comprimento || !telha.largura || !telha.quantidade) return total;
    
    const comprimento = parseFloat(telha.comprimento.replace('m', '').replace(',', '.'));
    const largura = parseFloat(telha.largura.replace('m', '').replace(',', '.'));
    
    return total + (comprimento * largura * telha.quantidade);
  }, 0);
}

// Função auxiliar para formatar datas
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    return dateString;
  }
}

// Função auxiliar para processar imagens
async function processImages(report: FARReport): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];
  const selectedProblems = report.problemas.filter(problema => problema.selecionado && problema.imagens && problema.imagens.length > 0);
  
  if (selectedProblems.length === 0) return paragraphs;
  
  paragraphs.push(
    new Paragraph({
      heading: 1,
      children: [
        new TextRun({
          text: "4. REGISTRO FOTOGRÁFICO",
          ...STYLES.heading1,
        }),
      ],
      spacing: {
        before: 400,
        after: 200,
      },
    })
  );

  for (const problema of selectedProblems) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Problema: ${problema.tipo}`,
            ...STYLES.heading3,
          }),
        ],
        spacing: {
          before: 300,
          after: 200,
        },
      })
    );

    for (let i = 0; i < problema.imagens.length; i++) {
      try {
        const imageBuffer = await dataUrlToBuffer(problema.imagens[i]);
        
        paragraphs.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 400,
                  height: 300,
                },
              }),
            ],
            spacing: {
              before: 200,
              after: 100,
            },
          })
        );
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Imagem ${i + 1}: ${problema.tipo}`,
                ...STYLES.normalText,
              }),
            ],
            spacing: {
              before: 100,
              after: 200,
            },
          })
        );
      } catch (error) {
        console.error(`Erro ao processar imagem ${i + 1} do problema ${problema.tipo}:`, error);
      }
    }
  }

  return paragraphs;
}

// Função principal para gerar o relatório FAR em formato docx
export async function generateFARReport(report: FARReport): Promise<Blob> {
  // Garantir que temos arrays válidos para evitar erros
  if (!report.telhas) report.telhas = [];
  if (!report.problemas) report.problemas = [];

  // Calcular a lista de problemas para o relatório final
  const sections = [];
  const childrenElements = [];

  // Tabelas de identificação do projeto e responsáveis
  childrenElements.push(
    new Paragraph({
      children: [generateProjectTable(report)],
      spacing: { after: 400 },
    })
  );

  childrenElements.push(
    new Paragraph({
      children: [generateResponsiblesTable(report)],
      spacing: { after: 400 },
    })
  );

  // Seções do relatório
  childrenElements.push(...generateIntroductionSection(report));
  childrenElements.push(...generateTechnicalAnalysisSection(report));
  childrenElements.push(...generateConclusionSection(report));
  
  // Processar imagens se houver
  const imagesParagraphs = await processImages(report);
  if (imagesParagraphs.length > 0) {
    childrenElements.push(...imagesParagraphs);
  }
  
  // Seção de assinatura
  childrenElements.push(...generateSignatureSection(report));

  // Criar o documento
  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: generateHeader(),
        },
        footers: {
          default: generateFooter(),
        },
        children: childrenElements,
      },
    ],
  });

  return await Packer.toBlob(doc);
}