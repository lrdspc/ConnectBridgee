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
import { FARReport } from '@shared/farReportSchema';

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

// Função para criar um cabeçalho
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

// Função para calcular a área total das telhas
function calcularAreaTotal(relatorio: FARReport): number {
  if (!relatorio.telhas || relatorio.telhas.length === 0) return 0;
  
  return relatorio.telhas.reduce((total, telha) => {
    const area = telha.area || 0;
    return total + area;
  }, 0);
}

// Função para gerar uma lista de telhas formatada
function gerarListaTelhas(relatorio: FARReport): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  paragrafos.push(
    new Paragraph({
      text: "Quantidade e modelo:",
      spacing: { before: 200, after: 120 }
    })
  );
  
  if (relatorio.telhas && relatorio.telhas.length > 0) {
    relatorio.telhas.forEach(telha => {
      if (telha.quantidade > 0) {
        paragrafos.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ 
                text: `${telha.quantidade}: ${telha.modelo} ${telha.espessura} CRFS` 
              })
            ],
            spacing: { after: 80 }
          })
        );
      }
    });
    
    // Adicionar área total
    const areaTotal = calcularAreaTotal(relatorio);
    if (areaTotal > 0) {
      paragrafos.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ 
              text: `Área coberta: ${areaTotal.toFixed(2)}m² aproximadamente.` 
            })
          ],
          spacing: { after: 120 }
        })
      );
    }
  } else {
    paragrafos.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram especificadas telhas." })
        ],
        spacing: { after: 120 }
      })
    );
  }
  
  return paragrafos;
}

// Função para gerar os problemas detalhados
function gerarProblemasDetalhados(relatorio: FARReport): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Filtrar apenas os problemas selecionados
  const problemasSelecionados = relatorio.problemas.filter(p => p.selecionado);
  
  if (problemasSelecionados.length === 0) {
    paragrafos.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram identificados problemas específicos." })
        ],
        spacing: { after: 200 }
      })
    );
    return paragrafos;
  }
  
  // Adicionar cada problema com sua descrição completa
  problemasSelecionados.forEach((problema, index) => {
    // Título do problema com numeração
    paragrafos.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: `${index + 1}. ${problema.tipo}`, 
            bold: true 
          })
        ],
        spacing: { before: 200, after: 100 }
      })
    );
    
    // Descrição do problema
    if (problema.descricao) {
      paragrafos.push(
        new Paragraph({
          children: [
            new TextRun({ text: problema.descricao })
          ],
          spacing: { after: 80 }
        })
      );
    }
    
    // Observações específicas deste problema, se houver
    if (problema.observacoes) {
      paragrafos.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: problema.observacoes,
              italics: true 
            })
          ],
          spacing: { after: 120 },
          indent: { left: 360 }
        })
      );
    }
  });
  
  return paragrafos;
}

// Função para gerar a lista de problemas na conclusão
function gerarListaProblemasSimples(relatorio: FARReport): Paragraph[] {
  const paragrafos: Paragraph[] = [];
  
  // Filtrar apenas os problemas selecionados
  const problemasSelecionados = relatorio.problemas.filter(p => p.selecionado);
  
  if (problemasSelecionados.length === 0) {
    return paragrafos;
  }
  
  paragrafos.push(
    new Paragraph({
      text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
      spacing: { before: 200, after: 200 }
    })
  );
  
  // Adicionar cada problema como item de lista
  problemasSelecionados.forEach((problema, index) => {
    paragrafos.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ 
            text: `${index + 1}. ${problema.tipo}`
          })
        ],
        spacing: { after: 80 }
      })
    );
  });
  
  return paragrafos;
}

// Função principal para gerar o documento FAR
export async function gerarFARReportDoc(relatorio: FARReport): Promise<Blob> {
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
  
  // Informações de identificação
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Data de vistoria: " }),
        new TextRun({ text: relatorio.dataVistoria || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Cliente: " }),
        new TextRun({ text: relatorio.cliente || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Empreendimento: " }),
        new TextRun({ text: relatorio.empreendimento || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Cidade: " }),
        new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`, bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Endereço: " }),
        new TextRun({ text: relatorio.endereco || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "FAR/Protocolo: " }),
        new TextRun({ text: relatorio.farProtocolo || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Assunto: " }),
        new TextRun({ text: relatorio.assunto || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  // Dados do responsável
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Elaborado por: " }),
        new TextRun({ text: relatorio.elaboradoPor || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Departamento: " }),
        new TextRun({ text: relatorio.departamento || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Unidade: " }),
        new TextRun({ text: relatorio.unidade || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Coordenador Responsável: " }),
        new TextRun({ text: relatorio.coordenador || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Gerente Responsável: " }),
        new TextRun({ text: relatorio.gerente || "", bold: true })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Regional: " }),
        new TextRun({ text: relatorio.regional || "", bold: true })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Seção de introdução
  mainContent.push(
    new Paragraph({
      text: "Introdução",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Parágrafos da introdução - quebrar por linhas para facilitar leitura no documento
  const introducaoParas = (relatorio.introducao || "").split('\n');
  introducaoParas.forEach(paraText => {
    if (paraText.trim()) {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: paraText.trim() })
          ],
          spacing: { after: 120 }
        })
      );
    }
  });
  
  // Adicionar lista de telhas à introdução
  mainContent.push(...gerarListaTelhas(relatorio));
  
  // Texto de conclusão da introdução
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.` 
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Seção de análise técnica
  mainContent.push(
    new Paragraph({
      text: "Análise Técnica",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Texto introdutório da análise técnica
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: relatorio.analiseTecnica || "" })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Adicionar problemas detalhados
  mainContent.push(...gerarProblemasDetalhados(relatorio));
  
  // Seção de conclusão
  mainContent.push(
    new Paragraph({
      text: "Conclusão",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Lista de problemas na conclusão
  mainContent.push(...gerarListaProblemasSimples(relatorio));
  
  // Texto da conclusão com resultado integrado (conforme modelo)
  let resultadoTexto = "";
  if (relatorio.resultado === "PROCEDENTE") {
    resultadoTexto = "Em função das não conformidades constatadas na fabricação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como PROCEDENTE, onde os problemas reclamados se dão por problemas relacionados à qualidade do material.";
  } else {
    resultadoTexto = "Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.";
  }

  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: resultadoTexto })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Texto sobre a garantia
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem ${relatorio.anosGarantiaTotal || "5"} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.`
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Texto padrão da conclusão
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor."
        })
      ],
      spacing: { after: 120 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário."
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Assinatura
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Atenciosamente," })
      ],
      spacing: { after: 120 }
    })
  );
  
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
        new TextRun({ 
          text: "Divisão Produtos Para Construção"
        })
      ],
      spacing: { after: 80 }
    })
  );
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Departamento de Assistência Técnica"
        })
      ],
      spacing: { after: 80 }
    })
  );
  
  // Se houver responsável, adicionar o nome
  if (relatorio.elaboradoPor) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: relatorio.elaboradoPor
          })
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
  
  // Se houver fotos de problemas, adicionar uma segunda seção no documento
  const todasFotos: {problemaId: string, titulo: string, dataUrl: string}[] = [];
  
  // Coletar todas as fotos dos problemas
  relatorio.problemas.filter(p => p.selecionado).forEach(problema => {
    if (problema.imagens && problema.imagens.length > 0) {
      problema.imagens.forEach(imgUrl => {
        todasFotos.push({
          problemaId: problema.id,
          titulo: problema.tipo,
          dataUrl: imgUrl
        });
      });
    }
  });
  
  // Se houver fotos, adicionar seção de registro fotográfico
  if (todasFotos.length > 0) {
    const fotosContent: Paragraph[] = [
      // Título da seção de fotos
      new Paragraph({
        text: "ANEXO: REGISTRO FOTOGRÁFICO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 400 }
      })
    ];
    
    // Adicionar descrição de cada foto
    for (let i = 0; i < todasFotos.length; i++) {
      const foto = todasFotos[i];
      
      fotosContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Foto ${i+1}: ${foto.titulo}`,
              bold: true
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );
      
      // Apenas mencionar a imagem - imagens são complexas no documento word
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