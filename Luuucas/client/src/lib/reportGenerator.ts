import { Visit, VisitPhoto, ChecklistItem } from "./db";
import { format } from "date-fns";
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  Header,
  Footer,
  BorderStyle,
  SectionType,
  PageOrientation,
  PageNumber,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  Media,
  WidthType,
  ImageRun,
} from "docx";

const FONTS = {
  primary: "Arial",
  secondary: "Arial",
};

// Fontes de texto e estilos
const TITLE_STYLE = {
  font: FONTS.primary,
  size: 32,
  bold: true,
};

const HEADING_STYLE = {
  font: FONTS.primary,
  size: 28,
  bold: true,
};

const SUBHEADING_STYLE = {
  font: FONTS.primary,
  size: 24,
  bold: true,
};

const NORMAL_TEXT = {
  font: FONTS.primary,
  size: 24,
};

const NORMAL_BOLD = {
  font: FONTS.primary,
  size: 24,
  bold: true,
};

// Gerador de informações iniciais
function generateInitialInfo(visit: Visit): Paragraph[] {
  return [
    // Título do Relatório
    new Paragraph({
      spacing: { before: 240, after: 240 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "RELATÓRIO DE VISITA TÉCNICA",
          ...TITLE_STYLE,
        }),
      ],
    }),

    // Data e Cliente
    new Paragraph({
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: "Data da visita: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: format(new Date(visit.date), 'dd/MM/yyyy'),
          ...NORMAL_TEXT,
        }),
        new TextRun({
          text: visit.time ? ` - ${visit.time}` : "",
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Cliente: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: visit.clientName,
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Endereço: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: visit.address,
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 240 },
      children: [
        new TextRun({
          text: "Contato: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: visit.contactInfo || "Não informado",
          ...NORMAL_TEXT,
        }),
      ],
    }),
  ];
}

function generateVisitDetails(visit: Visit): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 360, after: 240 },
      alignment: AlignmentType.LEFT,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "DETALHES DA VISITA",
          ...HEADING_STYLE,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Tipo de Visita: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: getVisitTypeName(visit.type),
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Prioridade: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: getVisitPriorityName(visit.priority),
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Status: ",
          ...NORMAL_BOLD,
        }),
        new TextRun({
          text: getVisitStatusName(visit.status),
          ...NORMAL_TEXT,
        }),
      ],
    }),
    
    // Descrição
    ...(visit.description ? [
      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Descrição:",
            ...SUBHEADING_STYLE,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: visit.description,
            ...NORMAL_TEXT,
          }),
        ],
      }),
    ] : []),
  ];
}

function generateChecklist(visit: Visit): Paragraph[] {
  if (!visit.checklist || visit.checklist.length === 0) {
    return [];
  }

  const result: Paragraph[] = [
    new Paragraph({
      spacing: { before: 360, after: 240 },
      alignment: AlignmentType.LEFT,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "CHECKLIST DE INSPEÇÃO",
          ...HEADING_STYLE,
        }),
      ],
    }),
  ];

  // Adicionar cada item do checklist
  visit.checklist.forEach((item, index) => {
    result.push(
      new Paragraph({
        spacing: { before: 120, after: 0 },
        bullet: {
          level: 0,
        },
        children: [
          new TextRun({
            text: item.text + ": ",
            ...NORMAL_BOLD,
          }),
          new TextRun({
            text: item.completed ? "Concluído" : "Pendente",
            ...NORMAL_TEXT,
          }),
        ],
      })
    );

    // Se tiver descrição, adicionar
    if (item.description) {
      result.push(
        new Paragraph({
          spacing: { before: 60, after: 120 },
          indent: {
            left: 360,
          },
          children: [
            new TextRun({
              text: item.description,
              ...NORMAL_TEXT,
            }),
          ],
        })
      );
    }
  });

  return result;
}

function generateNotes(visit: Visit): Paragraph[] {
  if (!visit.notes) {
    return [];
  }

  return [
    new Paragraph({
      spacing: { before: 360, after: 240 },
      alignment: AlignmentType.LEFT,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "OBSERVAÇÕES",
          ...HEADING_STYLE,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: visit.notes,
          ...NORMAL_TEXT,
        }),
      ],
    }),
  ];
}

async function generatePhotosSection(visit: Visit): Promise<Paragraph[]> {
  if (!visit.photos || visit.photos.length === 0) {
    return [];
  }

  const result: Paragraph[] = [
    new Paragraph({
      spacing: { before: 360, after: 240 },
      alignment: AlignmentType.LEFT,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "REGISTRO FOTOGRÁFICO",
          ...HEADING_STYLE,
        }),
      ],
    }),
  ];

  // Agrupando as fotos em pares para uma tabela de 2 colunas
  const photos = visit.photos;
  for (let i = 0; i < photos.length; i += 2) {
    const photo1 = photos[i];
    const photo2 = i + 1 < photos.length ? photos[i + 1] : null;
    
    // É necessário fazer uma tabela com 2 colunas para as imagens
    const tables: Table[] = [];
    
    try {
      const table = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 50,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: await fetchImageData(photo1.dataUrl),
                        transformation: {
                          width: 250,
                          height: 250,
                        },
                        type: "png", // Especifica o tipo de imagem
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: formatPhotoDate(photo1.timestamp),
                        ...NORMAL_TEXT,
                      }),
                    ],
                  }),
                  ...(photo1.notes ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: photo1.notes,
                          ...NORMAL_TEXT,
                        }),
                      ],
                    }),
                  ] : []),
                ],
              }),
              ...(photo2 ? [
                new TableCell({
                  width: {
                    size: 50,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: await fetchImageData(photo2.dataUrl),
                          transformation: {
                            width: 250,
                            height: 250,
                          },
                          type: "png", // Especifica o tipo de imagem
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: formatPhotoDate(photo2.timestamp),
                          ...NORMAL_TEXT,
                        }),
                      ],
                    }),
                    ...(photo2.notes ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: photo2.notes,
                            ...NORMAL_TEXT,
                          }),
                        ],
                      }),
                    ] : []),
                  ],
                }),
              ] : [
                new TableCell({
                  width: {
                    size: 50,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph("")],
                }),
              ]),
            ],
          }),
        ],
      });
      
      result.push(new Paragraph({ children: [new TextRun("")] }));
      tables.push(table);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      result.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Erro ao processar imagem",
              ...NORMAL_TEXT,
            }),
          ],
        })
      );
    }
    
    // Adicionando as tabelas ao documento
    for (const table of tables) {
      // @ts-ignore - O tipo Table não está sendo reconhecido corretamente pelo TS
      result.push(table);
    }
  }

  return result;
}

// Função para buscar dados da imagem a partir do dataURL
async function fetchImageData(dataUrl: string): Promise<Uint8Array> {
  try {
    // Remover o prefixo "data:image/jpeg;base64," ou similar
    const base64Data = dataUrl.split(',')[1];
    // Converter base64 para Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error("Erro ao processar dataURL:", error);
    throw error;
  }
}

function formatPhotoDate(timestamp: string): string {
  try {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  } catch (e) {
    return timestamp;
  }
}

// Função para obter o nome amigável do tipo de visita
function getVisitTypeName(type: string): string {
  const types: Record<string, string> = {
    'installation': 'Instalação',
    'maintenance': 'Manutenção',
    'inspection': 'Inspeção',
    'repair': 'Reparo',
    'emergency': 'Emergência',
  };
  return types[type] || type;
}

// Função para obter o nome amigável da prioridade
function getVisitPriorityName(priority: string): string {
  const priorities: Record<string, string> = {
    'normal': 'Normal',
    'high': 'Alta',
    'urgent': 'Urgente',
  };
  return priorities[priority] || priority;
}

// Função para obter o nome amigável do status
function getVisitStatusName(status: string): string {
  const statuses: Record<string, string> = {
    'scheduled': 'Agendada',
    'in-progress': 'Em Andamento',
    'pending': 'Pendente',
    'completed': 'Concluída',
    'urgent': 'Urgente',
  };
  return statuses[status] || status;
}

// Função para gerar a seção de assinatura
function generateSignature(): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 720, after: 360 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "_________________________________",
          ...NORMAL_TEXT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 360 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Assinatura do Técnico",
          ...NORMAL_TEXT,
        }),
      ],
    }),
  ];
}

// Função principal para gerar o documento
export async function generateVisitReport(visit: Visit): Promise<Blob> {
  // Configurações do documento
  const doc = new Document({
    sections: [{
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
        default: new Header({
          children: [
            new Paragraph({
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: "BRASILIT - SAINT-GOBAIN",
                  ...TITLE_STYLE,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Página ",
                  ...NORMAL_TEXT,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  ...NORMAL_TEXT,
                }),
                new TextRun({
                  text: " de ",
                  ...NORMAL_TEXT,
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  ...NORMAL_TEXT,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...generateInitialInfo(visit),
        ...generateVisitDetails(visit),
        ...generateChecklist(visit),
        ...generateNotes(visit),
        ...(await generatePhotosSection(visit)),
        ...generateSignature(),
      ],
    }],
  });

  return await Packer.toBlob(doc);
}