
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  HeadingLevel,
  PageNumber,
  Header,
  Footer,
  ImageRun,
  TabStopPosition,
  TabStopType,
  HorizontalPositionAlign,
  SectionType,
  PageOrientation,
  convertInchesToTwip
} from "docx";

import { RelatorioVistoria } from "shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "shared/relatorioVistoriaSchema";

// Constantes para formatação
const SPACING = {
  after: 200,
  before: 200
};

const BORDER = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "000000"
};

// Função principal para gerar o documento
export async function gerarRelatorioVistoria(relatorio: RelatorioVistoria): Promise<Blob> {
  // Criar documento
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new ImageRun({
                    data: await fetch('/brasilit-logo.png').then(res => res.arrayBuffer()),
                    transformation: {
                      width: 120,
                      height: 40
                    }
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Página ",
                    size: 18
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18
                  }),
                  new TextRun({
                    text: " de ",
                    size: 18
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18
                  })
                ]
              })
            ]
          })
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
          createInfoTable("IDENTIFICAÇÃO DO PROJETO", [
            { label: "Protocolo/FAR:", value: relatorio.protocolo || "[PROTOCOLO]" },
            { label: "Data de vistoria:", value: relatorio.dataVistoria || "[DATA_VISTORIA]" },
            { label: "Cliente:", value: relatorio.cliente || "[NOME_CLIENTE]" },
            { label: "Empreendimento:", value: relatorio.empreendimento || "[TIPO_EMPREENDIMENTO]" },
            { label: "Endereço:", value: relatorio.endereco || "[ENDERECO]" },
            { label: "Cidade/UF:", value: `${relatorio.cidade || "[CIDADE]"} - ${relatorio.uf || "[UF]"}` },
            { label: "Assunto:", value: relatorio.assunto || "[ASSUNTO]" }
          ]),
          
          // Espaçamento entre tabelas
          new Paragraph({
            spacing: { before: 200, after: 200 }
          }),
          
          // Tabela de Responsáveis Técnicos
          createInfoTable("RESPONSÁVEIS TÉCNICOS", [
            { label: "Elaborado por:", value: relatorio.elaboradoPor || "[NOME_TECNICO]" },
            { label: "Departamento:", value: relatorio.departamento || "[DEPARTAMENTO]" },
            { label: "Unidade:", value: relatorio.unidade || "[UNIDADE]" },
            { label: "Coordenador:", value: relatorio.coordenador || "[NOME_COORDENADOR]" },
            { label: "Gerente:", value: relatorio.gerente || "[NOME_GERENTE]" },
            { label: "Regional:", value: relatorio.regional || "[REGIONAL]" }
          ]),
          
          // Seção de Introdução
          ...gerarSecaoIntroducao(relatorio),
          
          // Seção de Análise Técnica
          ...gerarSecaoAnaliseTecnica(relatorio),
          
          // Seção de Conclusão
          ...gerarSecaoConclusao(relatorio),
          
          // Assinatura
          ...gerarSecaoAssinatura(relatorio)
        ]
      }
    ]
  });

  // Retornar o documento como Blob
  return await Packer.toBlob(doc);
}

// Função para criar tabelas de informações
function createInfoTable(title: string, rows: { label: string; value: string }[]): Table {
  const tableRows = rows.map(row => 
    new TableRow({
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
                  text: row.label,
                  bold: true,
                  size: 24
                })
              ]
            })
          ],
          borders: {
            top: BORDER,
            bottom: BORDER,
            left: BORDER,
            right: BORDER
          }
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
                  text: row.value,
                  size: 24
                })
              ]
            })
          ],
          borders: {
            top: BORDER,
            bottom: BORDER,
            left: BORDER,
            right: BORDER
          }
        })
      ]
    })
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            columnSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 24
                  })
                ]
              })
            ],
            borders: {
              top: BORDER,
              bottom: BORDER,
              left: BORDER,
              right: BORDER
            }
          })
        ]
      }),
      ...tableRows
    ]
  });
}

// Função para gerar a seção de introdução
function gerarSecaoIntroducao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Título da seção
  paragrafos.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "1. INTRODUÇÃO",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Conteúdo da introdução
  const textoIntroducao = relatorio.introducao || 
    `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ${relatorio.modeloTelha} de ${relatorio.espessura}mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo}.

O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha} de ${relatorio.espessura}mm. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto} anos para sistema completo).`;

  // Adicionar os parágrafos da introdução
  textoIntroducao.split('\n\n').forEach(paragrafo => {
    paragrafos.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: paragrafo,
            size: 24
          })
        ]
      })
    );
  });
  
  // Subseção: Dados do Produto
  paragrafos.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: "1.1 DADOS DO PRODUTO",
          bold: true,
          size: 26
        })
      ]
    })
  );
  
  // Tabela com dados do produto
  paragrafos.push(
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "Especificação",
                      bold: true,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "Detalhe",
                      bold: true,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Quantidade:",
                      bold: true,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${relatorio.quantidade}`,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Modelo:",
                      bold: true,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS`,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Área coberta:",
                      bold: true,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${relatorio.area}m² (aproximadamente)`,
                      size: 24
                    })
                  ]
                })
              ],
              borders: {
                top: BORDER,
                bottom: BORDER,
                left: BORDER,
                right: BORDER
              }
            })
          ]
        })
      ]
    })
  );
  
  // Texto adicional após a tabela
  paragrafos.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.",
          size: 24
        })
      ]
    })
  );
  
  return paragrafos;
}

// Função para gerar a seção de análise técnica
function gerarSecaoAnaliseTecnica(relatorio: RelatorioVistoria): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Título da seção
  paragrafos.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "2. ANÁLISE TÉCNICA",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Conteúdo da análise técnica
  const textoAnalise = relatorio.analiseTecnica || 
    "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos os seguintes desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante:";
  
  // Adicionar os parágrafos da análise
  textoAnalise.split('\n\n').forEach(paragrafo => {
    paragrafos.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: paragrafo,
            size: 24
          })
        ]
      })
    );
  });
  
  // Subseção: Não Conformidades
  paragrafos.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
          bold: true,
          size: 26
        })
      ]
    })
  );
  
  // Listar não conformidades
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);
  
  if (naoConformidadesSelecionadas.length > 0) {
    naoConformidadesSelecionadas.forEach((nc, index) => {
      // Título da não conformidade
      paragrafos.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `${index + 1}. ${nc.titulo}`,
              bold: true,
              size: 24
            })
          ]
        })
      );
      
      // Descrição da não conformidade
      const descricao = nc.descricao || naoConformidadesDisponiveis.find(item => item.id === nc.id)?.descricao || "";
      
      paragrafos.push(
        new Paragraph({
          spacing: { before: 100, after: 200 },
          indent: {
            left: convertInchesToTwip(0.25)
          },
          children: [
            new TextRun({
              text: descricao,
              size: 24
            })
          ]
        })
      );
    });
  } else {
    paragrafos.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: "Não foram identificadas não conformidades durante a vistoria técnica.",
            size: 24
          })
        ]
      })
    );
  }
  
  // Adicionar imagens das fotos se existirem
  if (relatorio.fotos && relatorio.fotos.length > 0) {
    paragrafos.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: "2.2 REGISTRO FOTOGRÁFICO",
            bold: true,
            size: 26
          })
        ]
      })
    );
    
    // Esta parte será implementada se necessário para incluir as fotos no documento
    // Para simplicidade, não estamos incluindo o código para processar imagens
    // pois isso exigiria manipulação complexa de imagens no cliente
  }
  
  return paragrafos;
}

// Função para gerar a seção de conclusão
function gerarSecaoConclusao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Título da seção
  paragrafos.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "3. CONCLUSÃO",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Texto introdutório da conclusão
  paragrafos.push(
    new Paragraph({
      spacing: SPACING,
      children: [
        new TextRun({
          text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
          size: 24
        })
      ]
    })
  );
  
  // Lista de não conformidades na conclusão
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);
  
  if (naoConformidadesSelecionadas.length > 0) {
    // Criar lista de marcadores com não conformidades
    naoConformidadesSelecionadas.forEach((nc, index) => {
      paragrafos.push(
        new Paragraph({
          spacing: { before: 100, after: 100 },
          bullet: {
            level: 0
          },
          children: [
            new TextRun({
              text: nc.titulo,
              size: 24
            })
          ]
        })
      );
    });
  } else {
    paragrafos.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: "Não foram identificadas não conformidades durante a vistoria técnica.",
            size: 24
          })
        ]
      })
    );
  }
  
  // Texto da conclusão
  const textoConclusao = relatorio.conclusao || 
    `Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como ${relatorio.resultado}, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.
    
As telhas BRASILIT modelo FIBROCIMENTO ${relatorio.modeloTelha.toUpperCase()} possuem ${relatorio.anosGarantiaTotal} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.

Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.`;
  
  // Adicionar os parágrafos da conclusão
  textoConclusao.split('\n\n').forEach(paragrafo => {
    paragrafos.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: paragrafo.trim(),
            size: 24
          })
        ]
      })
    );
  });
  
  return paragrafos;
}

// Função para gerar a seção de assinatura
function gerarSecaoAssinatura(relatorio: RelatorioVistoria): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Linha de "Atenciosamente"
  paragrafos.push(
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Atenciosamente,",
          size: 24
        })
      ]
    })
  );
  
  // Linha horizontal para assinatura
  paragrafos.push(
    new Paragraph({
      spacing: { before: 800, after: 200 },
      children: [
        new TextRun({
          text: "___________________________________________",
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  );
  
  // Nome do técnico e informações
  paragrafos.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: relatorio.elaboradoPor || "[NOME_TECNICO]",
          size: 24
        })
      ]
    })
  );
  
  paragrafos.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${relatorio.departamento || "[DEPARTAMENTO]"} - ${relatorio.unidade || "[UNIDADE]"}`,
          size: 24
        })
      ]
    })
  );
  
  paragrafos.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `CREA/CAU ${relatorio.numeroRegistro || "[NUMERO_REGISTRO]"}`,
          size: 24
        })
      ]
    })
  );
  
  // Rodapé com informação da empresa
  paragrafos.push(
    new Paragraph({
      spacing: { before: 800, after: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          bold: true,
          size: 20
        })
      ]
    })
  );
  
  paragrafos.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Divisão Produtos Para Construção",
          size: 20
        })
      ]
    })
  );
  
  paragrafos.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Departamento de Assistência Técnica",
          size: 20
        })
      ]
    })
  );
  
  return paragrafos;
}
