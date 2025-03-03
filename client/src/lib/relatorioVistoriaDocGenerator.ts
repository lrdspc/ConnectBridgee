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
  
  // Listar não conformidades
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);
  
  if (naoConformidadesSelecionadas.length > 0) {
    naoConformidadesSelecionadas.forEach(nc => {
      mainContent.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: nc.titulo || "" })
          ],
          spacing: { after: 100 }
        })
      );
      
      if (nc.descricao) {
        mainContent.push(
          new Paragraph({
            children: [
              new TextRun({ text: nc.descricao })
            ],
            indent: { left: 720 },
            spacing: { after: 200 }
          })
        );
      }
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
  
  // Criar documento
  const doc = new Document({
    sections: [{
      properties: {},
      headers: {
        default: criarCabecalho(),
      },
      footers: {
        default: criarRodape(),
      },
      children: mainContent
    }]
  });
  
  // Se houver fotos, adicionar seção de fotos
  if (relatorio.fotos && relatorio.fotos.length > 0) {
    // Criar seção de fotos
    const fotosSection = {
      properties: {
        type: SectionType.NEXT_PAGE
      },
      children: [
        new Paragraph({
          text: "ANEXO: REGISTRO FOTOGRÁFICO",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 400 }
        })
      ]
    };
    
    // @ts-ignore - Sabemos que a API permite adicionar seções
    doc.addSection(fotosSection);
    
    // Adicionar fotos
    for (let i = 0; i < relatorio.fotos.length; i++) {
      try {
        // Texto da foto
        doc.addParagraph(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `Foto ${i+1}: ${relatorio.fotos[i].descricao || "Sem descrição"}`,
                bold: true
              })
            ],
            spacing: { before: 200, after: 100 }
          })
        );
      } catch (error) {
        console.error("Erro ao processar foto:", error);
      }
    }
  }
  
  return Packer.toBlob(doc);
}