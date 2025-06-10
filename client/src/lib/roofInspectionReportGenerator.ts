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
  Footer
} from "docx";
import { Inspection } from "@shared/schema";

// Converte dataURL para um Buffer que pode ser usado pelo docx
async function dataUrlToBuffer(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

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
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "RELATÓRIO DE INSPEÇÃO TÉCNICA",
            bold: true,
            size: 24,
          }),
        ],
      }),
    ],
  });
}

// Função para gerar o rodapé
function generateFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Brasilit Saint-Gobain © " + new Date().getFullYear(),
            size: 18,
          }),
        ],
      }),
    ],
  });
}

// Função para gerar a seção de informações do cliente
function generateClientSection(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "1. INFORMAÇÕES DO CLIENTE",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Cliente: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.clientName || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Endereço: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.address || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Cidade: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.city || "Não informada",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Data da Inspeção: ",
          bold: true,
        }),
        new TextRun({
          text: format(new Date(inspection.dateInspected), "dd/MM/yyyy"),
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Tipo de Construção: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.customConstructionType || inspection.constructionType || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Protocolo: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.protocolNumber || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Assunto da Inspeção: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.inspectionSubject || "Não informado",
        }),
      ],
    }),
  ];
}

// Função para gerar a seção de informações do técnico
function generateTechnicianSection(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "2. INFORMAÇÕES DO TÉCNICO",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Técnico Responsável: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.technicianName || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Departamento: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.department || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Unidade: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.unit || "Não informada",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Região: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.region || "Não informada",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Coordenador: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.coordinatorName || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Gerente: ",
          bold: true,
        }),
        new TextRun({
          text: inspection.managerName || "Não informado",
        }),
      ],
    }),
  ];
}

// Função para gerar a tabela de especificações de telhas
function generateTileSpecsTable(inspection: Inspection): Paragraph[] {
  if (!inspection.tileSpecs || inspection.tileSpecs.length === 0) {
    return [
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: "3. ESPECIFICAÇÕES DAS TELHAS",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: "Nenhuma especificação de telha registrada.",
            italics: true,
          }),
        ],
      }),
    ];
  }

  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Modelo",
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Espessura",
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Dimensões",
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Quantidade",
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    ...inspection.tileSpecs.map(
      (spec) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: spec.model === "Outro" ? spec.customModel || "Outro" : spec.model,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: spec.thickness || "Não informada",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: spec.dimensions || "Não informadas",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: spec.count || "Não informada",
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  ];

  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "3. ESPECIFICAÇÕES DAS TELHAS",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      },
      rows: tableRows,
      layout: TableLayoutType.FIXED,
    }),
  ];
}

// Função para gerar a seção de não conformidades
function generateIssuesSection(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "4. NÃO CONFORMIDADES IDENTIFICADAS",
          bold: true,
          size: 24,
        }),
      ],
    }),
    ...(inspection.issues && inspection.issues.length > 0
      ? inspection.issues.map(
          (issue) =>
            new Paragraph({
              spacing: { before: 100, after: 100 },
              bullet: {
                level: 0,
              },
              children: [
                new TextRun({
                  text: issue,
                }),
              ],
            })
        )
      : [
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "Nenhuma não conformidade identificada.",
                italics: true,
              }),
            ],
          }),
        ]),
  ];
}

// Função para gerar a seção de conclusão e recomendações
function generateConclusionSection(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "5. CONCLUSÃO E RECOMENDAÇÕES",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Conclusão: ",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: inspection.conclusion || "Não informada.",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Recomendações: ",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: inspection.recommendations || "Não informadas.",
        }),
      ],
    }),
  ];
}

// Função para gerar a seção de fotos
async function generatePhotosSection(inspection: Inspection): Promise<Paragraph[]> {
  if (!inspection.photos || inspection.photos.length === 0) {
    return [
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: "6. REGISTRO FOTOGRÁFICO",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: "Nenhuma foto registrada.",
            italics: true,
          }),
        ],
      }),
    ];
  }

  const photoParagraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "6. REGISTRO FOTOGRÁFICO",
          bold: true,
          size: 24,
        }),
      ],
    }),
  ];

  // Agrupar fotos por categoria
  const photosByCategory: Record<string, typeof inspection.photos> = {};
  
  for (const photo of inspection.photos) {
    if (!photosByCategory[photo.category]) {
      photosByCategory[photo.category] = [];
    }
    photosByCategory[photo.category].push(photo);
  }

  // Mapear nomes amigáveis para as categorias
  const categoryNames: Record<string, string> = {
    general: "Fotos Gerais",
    tiles: "Fotos das Telhas",
    issues: "Fotos dos Problemas",
  };

  // Processar cada categoria de fotos
  for (const [category, photos] of Object.entries(photosByCategory)) {
    photoParagraphs.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1),
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    // Processar cada foto na categoria
    for (const photo of photos) {
      try {
        const imageBuffer = await dataUrlToBuffer(photo.dataUrl);
        
        photoParagraphs.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 400,
                  height: 300,
                },
              }),
            ],
          })
        );

        if (photo.notes) {
          photoParagraphs.push(
            new Paragraph({
              spacing: { before: 50, after: 200 },
              children: [
                new TextRun({
                  text: "Observação: " + photo.notes,
                  italics: true,
                }),
              ],
            })
          );
        }
      } catch (error) {
        console.error("Erro ao processar foto:", error);
        photoParagraphs.push(
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: "[Erro ao processar imagem]",
                color: "red",
              }),
            ],
          })
        );
      }
    }
  }

  return photoParagraphs;
}

// Função para gerar a assinatura
function generateSignature(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "______________________________",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: inspection.technicianName || "Nome do Técnico",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 50, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: inspection.department || "Departamento",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 50, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: inspection.unit || "Unidade",
        }),
      ],
    }),
  ];
}

// Função principal para gerar o relatório
export async function generateRoofInspectionReport(inspection: Inspection): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        headers: {
          default: generateHeader(),
        },
        footers: {
          default: generateFooter(),
        },
        children: [
          ...generateClientSection(inspection),
          ...generateTechnicianSection(inspection),
          ...generateTileSpecsTable(inspection),
          ...generateIssuesSection(inspection),
          ...generateConclusionSection(inspection),
          ...(await generatePhotosSection(inspection)),
          ...generateSignature(inspection),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}