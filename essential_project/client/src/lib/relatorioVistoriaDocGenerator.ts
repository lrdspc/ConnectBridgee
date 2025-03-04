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
import { RelatorioVistoria, naoConformidadesDisponiveis } from '@shared/relatorioVistoriaSchema';

// Função auxiliar para trabalhar com imagens (não utilizada diretamente)
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
  // Criar conteúdo principal
  const mainContent: Paragraph[] = [];
  
  // Título
  mainContent.push(
    new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );
  
  // Seção de identificação
  mainContent.push(
    new Paragraph({
      text: "IDENTIFICAÇÃO DO PROJETO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  // Adicionar tabelas e outros conteúdos
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Cliente: " }),
        new TextRun({ text: relatorio.cliente || "", bold: true })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Protocolo: " }),
        new TextRun({ text: relatorio.protocolo || "", bold: true })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Data da Vistoria: " }),
        new TextRun({ text: relatorio.dataVistoria || "", bold: true })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Endereço: " }),
        new TextRun({ text: relatorio.endereco || "", bold: true })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Cidade/UF: " }),
        new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`, bold: true })
      ]
    })
  );
  
  // Seção de responsáveis técnicos
  mainContent.push(
    new Paragraph({
      text: "RESPONSÁVEIS TÉCNICOS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Elaborado por: " }),
        new TextRun({ text: relatorio.elaboradoPor || "", bold: true })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Unidade/Departamento: " }),
        new TextRun({ text: `${relatorio.unidade || ""} / ${relatorio.departamento || ""}`, bold: true })
      ]
    })
  );
  
  // Seção de introdução
  mainContent.push(
    new Paragraph({
      text: "1. INTRODUÇÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.introducao || "Não informado." })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Dados do produto
  mainContent.push(
    new Paragraph({
      text: "1.1 DADOS DO PRODUTO",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Modelo: " }),
        new TextRun({ 
          text: `${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS`, 
          bold: true 
        })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Quantidade: " }),
        new TextRun({ 
          text: relatorio.quantidade?.toString() || "0", 
          bold: true 
        })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Área coberta: " }),
        new TextRun({ 
          text: `${relatorio.area || "0"}m² (aproximadamente)`, 
          bold: true 
        })
      ]
    })
  );
  
  // Análise técnica
  mainContent.push(
    new Paragraph({
      text: "2. ANÁLISE TÉCNICA",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.analiseTecnica || "Não informado." })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Não conformidades
  mainContent.push(
    new Paragraph({
      text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 }
    })
  );
  
  // Filtrar não conformidades selecionadas para usar em várias seções do documento
  const naosConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);
  
  if (naosConformidadesSelecionadas.length > 0) {
    // Usar as descrições completas das não conformidades disponíveis (importadas no topo do arquivo)
    
    naosConformidadesSelecionadas.forEach((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}) => {
      // Buscar a não conformidade completa a partir dos dados disponíveis
      const ncCompleta = naoConformidadesDisponiveis.find((item: {id: number, titulo: string, descricao: string}) => item.id === nc.id);
      
      // Título com formatação em negrito
      mainContent.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ 
              text: ncCompleta?.titulo || nc.titulo || "", 
              bold: true
            })
          ],
          spacing: { after: 100 }
        })
      );
      
      // Descrição com recuo, garantindo que sempre apareça
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: ncCompleta?.descricao || nc.descricao || "Descrição não disponível" 
            })
          ],
          indent: { left: 720 },
          spacing: { after: 200 }
        })
      );
    });
  } else {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram identificadas não conformidades." })
        ],
        spacing: { after: 200 }
      })
    );
  }
  
  // Conclusão
  mainContent.push(
    new Paragraph({
      text: "3. CONCLUSÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );
  
  if (relatorio.conclusao) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: relatorio.conclusao })
        ],
        spacing: { after: 200 }
      })
    );
  }
  
  // Lista de não conformidades na conclusão (apenas títulos)
  // Usamos a mesma lista filtrada anteriormente
  if (naosConformidadesSelecionadas.length > 0) {
    // Texto introdutório para a lista de não conformidades
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: "Não conformidades identificadas que comprometem a reclamação:", 
            bold: true 
          })
        ],
        spacing: { before: 200, after: 120 }
      })
    );
    
    // Lista apenas com os títulos das não conformidades
    naosConformidadesSelecionadas.forEach((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}) => {
      mainContent.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: nc.titulo || "" })
          ],
          spacing: { after: 80 }
        })
      );
    });
    
    mainContent.push(
      new Paragraph({
        spacing: { after: 200 }
      })
    );
  }
  
  // Resultado
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Resultado da análise: ${relatorio.resultado}`,
          bold: true
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Garantia
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `As telhas BRASILIT modelo ${relatorio.modeloTelha?.toUpperCase() || ""} ` +
                `possuem ${relatorio.anosGarantiaTotal || ""} anos de garantia total.`
        })
      ],
      spacing: { after: 200 }
    })
  );
  
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
  
  // Se houver fotos, adicionar uma segunda seção no documento
  if (relatorio.fotos && relatorio.fotos.length > 0) {
    const fotosContent: Paragraph[] = [
      // Título da seção de fotos
      new Paragraph({
        text: "ANEXO: REGISTRO FOTOGRÁFICO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 400 }
      })
    ];
    
    // Adicionar as fotos (processadas assincronamente mais acima)
    for (let i = 0; i < relatorio.fotos.length; i++) {
      const foto = relatorio.fotos[i];
      
      fotosContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Foto ${i+1}: ${foto.descricao || "Sem descrição"}`,
              bold: true
            })
          ],
          spacing: { before: 200, after: 100 }
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
    }
    
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
  const doc = new Document({ sections });
  
  // Retornar o blob
  return Packer.toBlob(doc);
}