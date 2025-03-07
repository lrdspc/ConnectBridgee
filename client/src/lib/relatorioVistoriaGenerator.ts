
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, TableBorders, LevelFormat, ShadingType, ITableCellMarginOptions, TableCell as DocxTableCell } from "docx";
import { saveAs } from 'file-saver';
import { RelatorioVistoria } from "../../shared/relatorioVistoriaSchema";

// Exportação principal para gerar o relatório
export async function generateRelatorioVistoria(relatorio: RelatorioVistoria): Promise<void> {
  try {
    // Criar o documento
    const doc = createDocumentWithContent(relatorio);
    
    // Gerar o arquivo
    const buffer = await doc.save();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Determinar nome do arquivo
    const fileName = `relatorio-vistoria-${relatorio.protocolo || 'sem-protocolo'}.docx`;
    
    // Baixar arquivo
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw error;
  }
}

// Função que cria o documento com todo o conteúdo
function createDocumentWithContent(relatorio: RelatorioVistoria): Document {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1270, // 2.54 cm em twips (1 cm = 500 twips)
              right: 1270,
              bottom: 1270,
              left: 1270
            }
          }
        },
        children: [
          // Título principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "RELATÓRIO DE VISTORIA TÉCNICA",
                bold: true,
                size: 32
              })
            ]
          }),
          
          // Linha horizontal
          new Paragraph({
            children: [
              new TextRun({
                text: "                                                                                                           ",
                border: {
                  bottom: {
                    color: "000000",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6,
                  }
                }
              })
            ],
            spacing: { after: 300 }
          }),

          // Tabela de Identificação do Projeto
          ...createProjetoTable(relatorio),
          
          // Tabela de Responsáveis Técnicos
          ...createResponsaveisTable(relatorio),
          
          // Seção de Introdução
          ...createIntroducaoSection(relatorio),
          
          // Seção de Análise Técnica
          ...createAnaliseTecnicaSection(relatorio),
          
          // Seção de Conclusão
          ...createConclusaoSection(relatorio),
          
          // Assinatura
          ...createAssinaturaSection(relatorio)
        ]
      }
    ]
  });
}

// Função para criar tabela de identificação do projeto
function createProjetoTable(relatorio: RelatorioVistoria): Paragraph[] {
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            columnSpan: 2,
            shading: {
              fill: "DDDDDD",
              type: ShadingType.CLEAR
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "IDENTIFICAÇÃO DO PROJETO",
                    bold: true
                  })
                ]
              })
            ],
            margins: getDefaultCellMargins()
          })
        ]
      }),
      createTableRow("Protocolo/FAR:", relatorio.protocolo || "[PROTOCOLO]"),
      createTableRow("Data de vistoria:", relatorio.dataVistoria || "[DATA_VISTORIA]"),
      createTableRow("Cliente:", relatorio.cliente || "[NOME_CLIENTE]"),
      createTableRow("Empreendimento:", relatorio.empreendimento || "[TIPO_EMPREENDIMENTO]"),
      createTableRow("Endereço:", relatorio.endereco || "[ENDERECO]"),
      createTableRow("Cidade/UF:", `${relatorio.cidade || "[CIDADE]"} - ${relatorio.uf || "[UF]"}`),
      createTableRow("Assunto:", relatorio.assunto || "[ASSUNTO]")
    ]
  });

  return [
    new Paragraph({ children: [table], spacing: { after: 300 } })
  ];
}

// Função para criar tabela de responsáveis técnicos
function createResponsaveisTable(relatorio: RelatorioVistoria): Paragraph[] {
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            columnSpan: 2,
            shading: {
              fill: "DDDDDD",
              type: ShadingType.CLEAR
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "RESPONSÁVEIS TÉCNICOS",
                    bold: true
                  })
                ]
              })
            ],
            margins: getDefaultCellMargins()
          })
        ]
      }),
      createTableRow("Elaborado por:", relatorio.elaboradoPor || "[NOME_TECNICO]"),
      createTableRow("Departamento:", relatorio.departamento || "[DEPARTAMENTO]"),
      createTableRow("Unidade:", relatorio.unidade || "[UNIDADE]"),
      createTableRow("Coordenador:", relatorio.coordenador || "[NOME_COORDENADOR]"),
      createTableRow("Gerente:", relatorio.gerente || "[NOME_GERENTE]"),
      createTableRow("Regional:", relatorio.regional || "[REGIONAL]")
    ]
  });

  return [
    new Paragraph({ children: [table], spacing: { after: 300 } })
  ];
}

// Função para criar a seção de introdução
function createIntroducaoSection(relatorio: RelatorioVistoria): Paragraph[] {
  // Texto padrão da introdução se não houver personalizado
  const textoIntroducao = relatorio.introducao || 
  `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de ${relatorio.espessura}mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo}.

O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha} de ${relatorio.espessura}mm. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto} anos para sistema completo).`;

  // Cabeçalho da seção
  const header = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 200 },
    children: [
      new TextRun({
        text: "1. INTRODUÇÃO",
        bold: true,
        size: 28
      })
    ]
  });

  // Texto da introdução
  const paragrafos = textoIntroducao.split('\n\n').map(paragrafo => 
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: paragrafo,
          size: 24
        })
      ]
    })
  );

  // Seção de Dados do Produto
  const dadosProdutoHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 200 },
    children: [
      new TextRun({
        text: "1.1 DADOS DO PRODUTO",
        bold: true,
        size: 26
      })
    ]
  });

  // Tabela de Dados do Produto
  const dadosProdutoTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Especificação",
                    bold: true
                  })
                ]
              })
            ],
            margins: getDefaultCellMargins()
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Detalhe",
                    bold: true
                  })
                ]
              })
            ],
            margins: getDefaultCellMargins()
          })
        ]
      }),
      createTableRow("Quantidade:", relatorio.quantidade.toString() || "[QUANTIDADE]"),
      createTableRow("Modelo:", `${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS` || "[MODELO_TELHA] [ESPESSURA]mm CRFS"),
      createTableRow("Área coberta:", `${relatorio.area}m² (aproximadamente)` || "[AREA]m² (aproximadamente)")
    ]
  });

  // Texto após a tabela
  const textoAnaliseNormas = new Paragraph({
    spacing: { before: 200, after: 300 },
    children: [
      new TextRun({
        text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.",
        size: 24
      })
    ]
  });

  return [
    header,
    ...paragrafos,
    dadosProdutoHeader,
    new Paragraph({ children: [dadosProdutoTable], spacing: { after: 200 } }),
    textoAnaliseNormas
  ];
}

// Função para criar a seção de análise técnica
function createAnaliseTecnicaSection(relatorio: RelatorioVistoria): Paragraph[] {
  // Texto padrão da análise se não houver personalizado
  const textoAnalise = relatorio.analiseTecnica || 
  `Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos os seguintes desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante:`;

  // Cabeçalho da seção
  const header = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 200 },
    children: [
      new TextRun({
        text: "2. ANÁLISE TÉCNICA",
        bold: true,
        size: 28
      })
    ]
  });

  // Texto da análise
  const paragrafoAnalise = new Paragraph({
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({
        text: textoAnalise,
        size: 24
      })
    ]
  });

  // Subseção de não conformidades
  const naoConformidadesHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({
        text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
        bold: true,
        size: 26
      })
    ]
  });

  // Lista de não conformidades selecionadas
  const naoConformidadesParagrafos = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .map((nc, index) => {
      const titulo = new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${index + 1}. ${nc.titulo}`,
            bold: true,
            size: 24
          })
        ]
      });

      const descricao = new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({
            text: nc.descricao || "",
            size: 24
          })
        ]
      });

      return [titulo, descricao];
    })
    .flat();

  return [
    header,
    paragrafoAnalise,
    naoConformidadesHeader,
    ...(naoConformidadesParagrafos.length > 0 ? naoConformidadesParagrafos : [
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: "Nenhuma não conformidade foi selecionada.",
            size: 24
          })
        ]
      })
    ])
  ];
}

// Função para criar a seção de conclusão
function createConclusaoSection(relatorio: RelatorioVistoria): Paragraph[] {
  // Preparar a lista de não conformidades para a conclusão
  const naoConformidadesSelecionadas = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .map((nc, index) => `${index + 1}. ${nc.titulo}`);

  const listaNaoConformidades = naoConformidadesSelecionadas.length > 0 
    ? naoConformidadesSelecionadas.join("\n") 
    : "Nenhuma não conformidade foi identificada.";

  // Texto da conclusão
  const textoConclusao = relatorio.conclusao || 
  `Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:

${listaNaoConformidades}

Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como ${relatorio.resultado}, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem ${relatorio.anosGarantiaTotal} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.

Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.

Atenciosamente,`;

  // Cabeçalho da seção
  const header = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 200 },
    children: [
      new TextRun({
        text: "3. CONCLUSÃO",
        bold: true,
        size: 28
      })
    ]
  });

  // Parágrafos da conclusão
  const paragrafosConclusao = textoConclusao.split('\n\n').map(paragrafo => 
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: paragrafo,
          size: 24
        })
      ]
    })
  );

  return [
    header,
    ...paragrafosConclusao
  ];
}

// Função para criar a seção de assinatura
function createAssinaturaSection(relatorio: RelatorioVistoria): Paragraph[] {
  // Linha horizontal antes da assinatura
  const linhaHorizontal = new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: "                                                                                                             ",
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          }
        }
      })
    ]
  });
  
  // Empresa
  const empresa = new Paragraph({
    spacing: { before: 300, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
        bold: true,
        size: 24
      })
    ]
  });
  
  const divisao = new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Divisão Produtos Para Construção",
        bold: true,
        size: 24
      })
    ]
  });
  
  const departamento = new Paragraph({
    spacing: { before: 100, after: 300 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Departamento de Assistência Técnica",
        bold: true,
        size: 24
      })
    ]
  });

  // Linha da assinatura
  const linhaAssinatura = new Paragraph({
    spacing: { before: 200, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "_______________________________",
        size: 24
      })
    ]
  });

  // Nome do técnico
  const nomeTecnico = new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: relatorio.elaboradoPor || "[NOME_TECNICO]",
        size: 24
      })
    ]
  });

  // Departamento e unidade
  const deptoUnidade = new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `${relatorio.departamento || "[DEPARTAMENTO]"} - ${relatorio.unidade || "[UNIDADE]"}`,
        size: 24
      })
    ]
  });

  // CREA/CAU
  const registro = new Paragraph({
    spacing: { before: 100, after: 300 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `CREA/CAU ${relatorio.numeroRegistro || "[NUMERO_REGISTRO]"}`,
        size: 24
      })
    ]
  });

  return [
    linhaHorizontal,
    empresa,
    divisao,
    departamento,
    linhaAssinatura,
    nomeTecnico,
    deptoUnidade,
    registro
  ];
}

// Função auxiliar para criar linhas de tabela
function createTableRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 30,
          type: WidthType.PERCENTAGE
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true
              })
            ]
          })
        ],
        margins: getDefaultCellMargins()
      }),
      new TableCell({
        width: {
          size: 70,
          type: WidthType.PERCENTAGE
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value
              })
            ]
          })
        ],
        margins: getDefaultCellMargins()
      })
    ]
  });
}

// Função para obter as margens padrão de células
function getDefaultCellMargins(): ITableCellMarginOptions {
  return {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
  };
}
