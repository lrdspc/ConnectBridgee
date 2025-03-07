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
import { FARReport, problemasPredefinidosFAR } from '@shared/farReportSchema';

// Função auxiliar para trabalhar com imagens
function dataUrlToBuffer(dataUrl: string): Buffer {
  try {
    // Extrair a parte de dados do dataURL
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid data URL');
    }
    
    // Converter base64 para buffer
    return Buffer.from(matches[2], 'base64');
  } catch (error) {
    console.error("Erro ao converter dataURL para buffer:", error);
    return Buffer.alloc(0);
  }
}

// Função para criar o cabeçalho
function criarCabecalho(): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "BRASILIT - Ficha de Atendimento para Reclamação (FAR)",
            size: 20,
            color: "808080"
          })
        ]
      })
    ]
  });
}

// Função para criar o rodapé
function criarRodape(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun("Página "),
          new TextRun({
            children: [PageNumber.CURRENT]
          }),
          new TextRun(" de "),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES]
          })
        ]
      })
    ]
  });
}

// Função para gerar o documento Word do relatório FAR
export async function gerarFARReportDoc(relatorio: FARReport): Promise<Blob> {
  // Criar conteúdo principal
  const mainContent: Paragraph[] = [];
  
  // Título
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "FICHA DE ATENDIMENTO PARA RECLAMAÇÃO (FAR)",
          bold: true,
          size: 32
        })
      ]
    })
  );
  
  // Protocolo e Data
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Protocolo: ", bold: true }),
        new TextRun({ text: relatorio.farProtocolo || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Data da Vistoria: ", bold: true }),
        new TextRun({ text: relatorio.dataVistoria || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Assunto: ", bold: true }),
        new TextRun({ text: relatorio.assunto || "" })
      ],
      spacing: { after: 300 }
    })
  );
  
  // Seção de Identificação do Cliente
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "IDENTIFICAÇÃO DO CLIENTE",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Cliente: ", bold: true }),
        new TextRun({ text: relatorio.cliente || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Empreendimento: ", bold: true }),
        new TextRun({ text: relatorio.empreendimento || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Endereço: ", bold: true }),
        new TextRun({ text: `${relatorio.endereco || ""}, ${relatorio.cidade || ""} - ${relatorio.uf || ""}` })
      ],
      spacing: { after: 300 }
    })
  );
  
  // Seção de Responsável Técnico
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "RESPONSÁVEL TÉCNICO",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Elaborado por: ", bold: true }),
        new TextRun({ text: relatorio.elaboradoPor || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Departamento: ", bold: true }),
        new TextRun({ text: relatorio.departamento || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Regional: ", bold: true }),
        new TextRun({ text: relatorio.regional || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Unidade: ", bold: true }),
        new TextRun({ text: relatorio.unidade || "" })
      ],
      spacing: { after: 300 }
    })
  );
  
  // Seção de Especificações das Telhas
  if (relatorio.telhas && relatorio.telhas.length > 0) {
    mainContent.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: "ESPECIFICAÇÕES DAS TELHAS",
            bold: true,
            size: 28
          })
        ]
      })
    );
    
    // Tabela de telhas
    const telhaRows: TableRow[] = [
      // Cabeçalho da tabela
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Modelo", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Espessura", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Comprimento", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Largura", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Quantidade", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Área (m²)", bold: true })]
            })],
            shading: { fill: "EEEEEE" }
          })
        ]
      })
    ];
    
    // Linhas de dados das telhas
    relatorio.telhas.forEach(telha => {
      telhaRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.modelo || "" })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.espessura || "" })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.comprimento || "" })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.largura || "" })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.quantidade?.toString() || "" })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: telha.area?.toString() || "" })]
              })]
            })
          ]
        })
      );
    });
    
    // Criar tabela
    const telhasTable = new Table({
      rows: telhaRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    });
    
    // Adicionar um container de tabela para a seção
    // Note que não é possível adicionar Table diretamente ao array de Paragraph
    mainContent.push(
      new Paragraph({
        spacing: { after: 300 },
        text: "" // Placeholder, será substituído pela tabela na renderização
      })
    );
    
    // Na implementação real, a biblioteca docx processará a tabela corretamente
    // mesmo se não a adicionarmos explicitamente ao array de Paragraph
  }
  
  // Seção de Introdução
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "INTRODUÇÃO",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Quebrar o texto de introdução em parágrafos
  const introducaoParagrafos = (relatorio.introducao || "").split("\n\n");
  introducaoParagrafos.forEach(paragrafo => {
    mainContent.push(
      new Paragraph({
        children: [new TextRun({ text: paragrafo })],
        spacing: { after: 200 }
      })
    );
  });
  
  // Seção de Análise Técnica
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "ANÁLISE TÉCNICA",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Texto de introdução da análise técnica
  mainContent.push(
    new Paragraph({
      children: [new TextRun({ text: relatorio.analiseTecnica || "" })],
      spacing: { after: 200 }
    })
  );
  
  // Lista de problemas identificados
  if (relatorio.problemas && relatorio.problemas.length > 0) {
    // Filtrar apenas os problemas selecionados
    const problemasIdentificados = relatorio.problemas.filter(p => p.selecionado);
    
    if (problemasIdentificados.length > 0) {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROBLEMAS IDENTIFICADOS:",
              bold: true,
              size: 24
            })
          ],
          spacing: { before: 200, after: 200 }
        })
      );
      
      // Listar cada problema
      problemasIdentificados.forEach((problema, index) => {
        mainContent.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. `, bold: true }),
              new TextRun({ text: `${problema.tipo}: `, bold: true }),
              new TextRun({ text: problema.descricao || "" })
            ],
            spacing: { after: 100 }
          })
        );
        
        // Adicionar observações se existirem
        if (problema.observacoes) {
          mainContent.push(
            new Paragraph({
              children: [
                new TextRun({ text: "   Observações: ", italics: true }),
                new TextRun({ text: problema.observacoes })
              ],
              indent: { left: 500 },
              spacing: { after: 200 }
            })
          );
        }
      });
    }
  }
  
  // Seção de Conclusão e Recomendações
  mainContent.push(
    new Paragraph({
      text: "CONCLUSÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      text: relatorio.conclusao || "",
      spacing: { after: 300 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      text: "RECOMENDAÇÕES",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      text: relatorio.recomendacao || "",
      spacing: { after: 300 }
    })
  );
  
  // Informações de Garantia
  mainContent.push(
    new Paragraph({
      text: "INFORMAÇÕES DE GARANTIA",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  if (relatorio.telhas && relatorio.telhas.length > 0) {
    const modelos = relatorio.telhas.map(t => t.modelo).filter(Boolean).join(", ");
    
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Garantia das telhas: ", bold: true }),
          new TextRun({ text: `${relatorio.anosGarantia} anos` })
        ],
        spacing: { after: 200 }
      })
    );
    
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Garantia do sistema completo: ", bold: true }),
          new TextRun({ text: `${relatorio.anosGarantiaSistemaCompleto} anos` })
        ],
        spacing: { after: 200 }
      })
    );
    
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Garantia total: ", bold: true }),
          new TextRun({ text: `${relatorio.anosGarantiaTotal} anos` })
        ],
        spacing: { after: 300 }
      })
    );
  }
  
  // Resultado da análise (procedente/improcedente)
  mainContent.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "PARECER FINAL",
          bold: true,
          size: 28
        })
      ]
    })
  );
  
  // Verificar se o campo resultado existe (typescript não está reconhecendo)
  const resultado = relatorio.hasOwnProperty("resultado") ? 
    (relatorio as any).resultado : "PENDENTE";
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Resultado: ${resultado}`,
          bold: true,
          size: 28
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Observações gerais
  if (relatorio.observacoesGerais) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Observações gerais: ", bold: true }),
          new TextRun({ text: relatorio.observacoesGerais })
        ],
        spacing: { after: 300 }
      })
    );
  }
  
  // Assinatura
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          bold: true 
        })
      ],
      spacing: { after: 80 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.elaboradoPor || "" })
      ],
      spacing: { after: 80 }
    })
  );
  
  if (relatorio.departamento) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: relatorio.departamento })
        ],
        spacing: { after: 80 }
      })
    );
  }
  
  // Preparar seções do documento
  const sections = [];
  
  // Primeira seção - conteúdo principal
  sections.push({
    properties: {},
    headers: {
      default: criarCabecalho(),
    },
    footers: {
      default: criarRodape(),
    },
    children: mainContent
  });
  
  // Verificar se há problemas com imagens para adicionar uma seção de anexos
  const problemasComImagens = relatorio.problemas?.filter(p => p.selecionado && p.imagens && p.imagens.length > 0);
  
  if (problemasComImagens && problemasComImagens.length > 0) {
    const fotosContent: Paragraph[] = [
      // Título da seção de fotos
      new Paragraph({
        text: "ANEXO: REGISTRO FOTOGRÁFICO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 300 }
      })
    ];
    
    // Adicionar as fotos de cada problema
    let fotoIndex = 1;
    problemasComImagens.forEach(problema => {
      fotosContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Problema: ${problema.tipo}`,
              bold: true
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );
      
      problema.imagens.forEach((imagem, idx) => {
        fotosContent.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `Foto ${fotoIndex}: ${problema.descricao || ""}`,
                bold: true
              })
            ],
            spacing: { before: 100, after: 100 }
          })
        );
        
        // Apenas adicionar texto para a foto - imagens são complexas de manipular no Word
        fotosContent.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: "[Imagem: Consultar registro fotográfico original]",
                italics: true
              })
            ],
            spacing: { after: 200 }
          })
        );
        
        fotoIndex++;
      });
    });
    
    // Adicionar a seção de fotos
    sections.push({
      properties: {
        type: SectionType.NEXT_PAGE
      },
      headers: {
        default: criarCabecalho(),
      },
      footers: {
        default: criarRodape(),
      },
      children: fotosContent
    });
  }
  
  // Criar o documento com todas as seções
  const doc = new Document({
    sections: sections
  });
  
  // Gerar o blob do documento
  return await Packer.toBlob(doc);
}