import { 
  Document, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun,
  Footer,
  Header,
  PageNumber,
  SectionType,
  Packer
} from 'docx';
import { RelatorioVistoria } from '../../../shared/relatorioVistoriaSchema';

// Converte dataURL para ArrayBuffer para inserção de imagem
async function dataUrlToArrayBuffer(dataUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return await blob.arrayBuffer();
}

// Função para criar um cabeçalho
function criarCabecalho(): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "BRASILIT - Relatório de Vistoria Técnica",
            size: 20,
            color: "808080"
          })
        ]
      })
    ]
  });
}

// Função para criar um rodapé com número de página
function criarRodape(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Página ",
            size: 18,
            color: "808080"
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 18,
            color: "808080"
          }),
          new TextRun({
            text: " de ",
            size: 18,
            color: "808080"
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 18,
            color: "808080"
          }),
        ]
      })
    ]
  });
}

// Função para gerar o documento Word
export async function gerarRelatorioVistoriaDoc(relatorio: RelatorioVistoria): Promise<Blob> {
  // Array para armazenar todos os elementos do documento
  const children: Paragraph[] = [];

  // Título
  children.push(
    new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400
      }
    })
  );

  // Seção de identificação do projeto
  children.push(
    new Paragraph({
      text: "IDENTIFICAÇÃO DO PROJETO",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  // Tabela de identificação
  const tabelaIdentificacao = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 40,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Protocolo/FAR:", bold: true })]
            })],
          }),
          new TableCell({
            width: {
              size: 60,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.protocolo || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Data de vistoria:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.dataVistoria || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Cliente:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.cliente || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Empreendimento:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.empreendimento || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Endereço:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.endereco || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Cidade/UF:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}` })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Assunto:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.assunto || "" })]
            })],
          }),
        ],
      }),
    ],
  });

  children.push(new Paragraph({ children: [tabelaIdentificacao] }));

  // Seção de Responsáveis Técnicos
  children.push(
    new Paragraph({
      text: "RESPONSÁVEIS TÉCNICOS",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  // Tabela de responsáveis técnicos
  const tabelaResponsaveis = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 40,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Elaborado por:", bold: true })]
            })],
          }),
          new TableCell({
            width: {
              size: 60,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.elaboradoPor || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Departamento:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.departamento || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Unidade:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.unidade || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Coordenador:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.coordenador || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Gerente:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.gerente || "" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Regional:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.regional || "" })]
            })],
          }),
        ],
      }),
    ],
  });

  children.push(new Paragraph({ children: [tabelaResponsaveis] }));

  // Seção de Introdução
  children.push(
    new Paragraph({
      text: "1. INTRODUÇÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.introducao || "Não informado." })
      ],
      spacing: {
        after: 200
      }
    })
  );

  // Subseção de Dados do Produto
  children.push(
    new Paragraph({
      text: "1.1 DADOS DO PRODUTO",
      heading: HeadingLevel.HEADING_3,
      spacing: {
        before: 200,
        after: 200
      }
    })
  );

  // Tabela de dados do produto
  const tabelaProduto = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 40,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Quantidade:", bold: true })]
            })],
          }),
          new TableCell({
            width: {
              size: 60,
              type: WidthType.PERCENTAGE
            },
            children: [new Paragraph({
              children: [new TextRun({ text: relatorio.quantidade?.toString() || "0" })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Modelo:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS` })]
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Área coberta:", bold: true })]
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${relatorio.area || "0"}m² (aproximadamente)` })]
            })],
          }),
        ],
      }),
    ],
  });

  children.push(new Paragraph({ children: [tabelaProduto] }));

  // Seção de Análise Técnica
  children.push(
    new Paragraph({
      text: "2. ANÁLISE TÉCNICA",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.analiseTecnica || "Não informado." })
      ],
      spacing: {
        after: 200
      }
    })
  );

  // Subseção de Não Conformidades
  children.push(
    new Paragraph({
      text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
      heading: HeadingLevel.HEADING_3,
      spacing: {
        before: 200,
        after: 200
      }
    })
  );

  // Listar não conformidades identificadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);

  if (naoConformidadesSelecionadas.length > 0) {
    naoConformidadesSelecionadas.forEach(nc => {
      children.push(
        new Paragraph({
          bullet: {
            level: 0
          },
          children: [
            new TextRun({ text: nc.titulo || "" })
          ],
          spacing: {
            after: 100
          }
        })
      );
      
      if (nc.descricao) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: nc.descricao })
            ],
            indent: {
              left: 720 // ~0.5 inch in twips
            },
            spacing: {
              after: 200
            }
          })
        );
      }
    });
  } else {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram identificadas não conformidades." })
        ],
        spacing: {
          after: 200
        }
      })
    );
  }

  // Seção de Conclusão
  children.push(
    new Paragraph({
      text: "3. CONCLUSÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:" })
      ],
      spacing: {
        after: 200
      }
    })
  );

  // Repetir a lista de não conformidades na conclusão
  if (naoConformidadesSelecionadas.length > 0) {
    naoConformidadesSelecionadas.forEach(nc => {
      children.push(
        new Paragraph({
          bullet: {
            level: 0
          },
          children: [
            new TextRun({ text: nc.titulo || "" })
          ],
          spacing: {
            after: 100
          }
        })
      );
    });
  } else {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram identificadas não conformidades." })
        ],
        spacing: {
          after: 200
        }
      })
    );
  }

  if (relatorio.conclusao) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: relatorio.conclusao })
        ],
        spacing: {
          before: 200,
          after: 200
        }
      })
    );
  }

  // Texto padrão de conclusão
  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, ` +
                `finalizamos o atendimento considerando a reclamação como ${relatorio.resultado}, ` +
                `onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a ` +
                `problemas relacionados à qualidade do material.`
        })
      ],
      spacing: {
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `As telhas BRASILIT modelo FIBROCIMENTO ${relatorio.modeloTelha?.toUpperCase() || ""} ` +
                `possuem ${relatorio.anosGarantiaTotal || ""} anos de garantia com relação a problemas de ` +
                `fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo ` +
                `rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento ` +
                `e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: ` +
                `http://www.brasilit.com.br.`
        })
      ],
      spacing: {
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, " +
                "específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a " +
                "legislação em vigor."
        })
      ],
      spacing: {
        after: 200
      }
    })
  );

  if (relatorio.recomendacao) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: relatorio.recomendacao })
        ],
        spacing: {
          after: 200
        }
      })
    );
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário."
        })
      ],
      spacing: {
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Atenciosamente," })
      ],
      spacing: {
        after: 400
      }
    })
  );

  // Assinatura
  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          bold: true
        })
      ],
      spacing: {
        after: 80
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Divisão Produtos Para Construção",
          bold: true
        })
      ],
      spacing: {
        after: 80
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Departamento de Assistência Técnica",
          bold: true
        })
      ],
      spacing: {
        after: 400
      }
    })
  );

  // Linha para assinatura
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "______________________________________________________",
        })
      ],
      spacing: {
        after: 200
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.elaboradoPor || "" })
      ],
      spacing: {
        after: 80
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${relatorio.departamento || ""} - ${relatorio.unidade || ""}` })
      ],
      spacing: {
        after: 80
      }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `CREA/CAU ${relatorio.numeroRegistro || ""}` })
      ],
      spacing: {
        after: 400
      }
    })
  );

  // Documento sem fotos (padrão)
  let doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: criarCabecalho(),
        },
        footers: {
          default: criarRodape(),
        },
        children: children,
      },
    ],
    features: {
      updateFields: true,
    },
  });

  // Se houver fotos, criar uma seção adicional
  if (relatorio.fotos && relatorio.fotos.length > 0) {
    try {
      // Criar uma nova seção para fotos
      const fotoSection = {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: "ANEXO: REGISTRO FOTOGRÁFICO",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 400
            }
          }),
        ],
      };

      // Adicionar a seção de fotos ao documento
      doc.addSection(fotoSection);

      // Processar e adicionar cada foto
      for (let i = 0; i < relatorio.fotos.length; i++) {
        const foto = relatorio.fotos[i];
        try {
          const imgBuffer = await dataUrlToArrayBuffer(foto.dataUrl);
          
          // Adicionar imagem
          doc.addParagraph(
            new Paragraph({
              spacing: {
                before: 200,
                after: 100
              },
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: {
                    width: 400,
                    height: 300
                  },
                  altText: {
                    title: `Imagem ${i + 1}`,
                    description: foto.descricao || "Sem descrição",
                    name: `imagem-${i + 1}`
                  }
                })
              ]
            })
          );
          
          // Adicionar legenda
          doc.addParagraph(
            new Paragraph({
              children: [
                new TextRun({ text: `Imagem ${i + 1}: ${foto.descricao || "Sem descrição"}` })
              ],
              spacing: {
                after: 400
              }
            })
          );
        } catch (error) {
          console.error("Erro ao processar imagem:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar fotos ao documento:", error);
    }
  }

  // Gerar o documento final
  return Packer.toBlob(doc);
}