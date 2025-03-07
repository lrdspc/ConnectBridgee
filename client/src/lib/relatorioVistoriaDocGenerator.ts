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
  Packer,
  LevelFormat,
  NumberFormat
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
  
  // ===== TÍTULO PRINCIPAL =====
  mainContent.push(
    new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 200 },
      border: {
        bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 1 }
      }
    })
  );
  
  // ===== SEÇÃO DE IDENTIFICAÇÃO DO PROJETO =====
  mainContent.push(
    new Paragraph({
      text: "IDENTIFICAÇÃO DO PROJETO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      bold: true
    })
  );
  
  // Criar tabela de informações do projeto
  const tabelaIdentificacao = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
    },
    rows: [
      // Protocolo/FAR
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Protocolo/FAR:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.protocolo || "" })],
              }),
            ],
          }),
        ],
      }),
      // Data de vistoria
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Data de vistoria:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.dataVistoria || "" })],
              }),
            ],
          }),
        ],
      }),
      // Cliente
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Cliente:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.cliente || "" })],
              }),
            ],
          }),
        ],
      }),
      // Empreendimento
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Empreendimento:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.empreendimento || "" })],
              }),
            ],
          }),
        ],
      }),
      // Endereço
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Endereço:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.endereco || "" })],
              }),
            ],
          }),
        ],
      }),
      // Cidade/UF
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Cidade/UF:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}` })],
              }),
            ],
          }),
        ],
      }),
      // Assunto
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Assunto:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.assunto || "" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  
  mainContent.push(tabelaIdentificacao);
  
  // ===== SEÇÃO DE RESPONSÁVEIS TÉCNICOS =====
  mainContent.push(
    new Paragraph({
      text: "RESPONSÁVEIS TÉCNICOS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      bold: true
    })
  );
  
  // Criar tabela de responsáveis técnicos
  const tabelaResponsaveis = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
    },
    rows: [
      // Elaborado por
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Elaborado por:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.elaboradoPor || "" })],
              }),
            ],
          }),
        ],
      }),
      // Departamento
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Departamento:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.departamento || "" })],
              }),
            ],
          }),
        ],
      }),
      // Unidade
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Unidade:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.unidade || "" })],
              }),
            ],
          }),
        ],
      }),
      // Coordenador
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Coordenador:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.coordenador || "" })],
              }),
            ],
          }),
        ],
      }),
      // Gerente
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Gerente:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.gerente || "" })],
              }),
            ],
          }),
        ],
      }),
      // Regional
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Regional:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.regional || "" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  
  mainContent.push(tabelaResponsaveis);
  
  // ===== SEÇÃO DE INTRODUÇÃO =====
  mainContent.push(
    new Paragraph({
      text: "1. INTRODUÇÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      bold: true
    })
  );
  
  // Texto padrão de introdução com detalhes sobre a tecnologia das telhas
  const textoIntroducao = relatorio.introducao || 
    `A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ${relatorio.modeloTelha?.toUpperCase() || "ONDULADA"} de ${relatorio.espessura || "6"}mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo || "[Número do Protocolo]"}.

O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha || "Ondulada"} de ${relatorio.espessura || "6"}mm. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia || "5"} anos (ou ${relatorio.anosGarantiaSistemaCompleto || "dez"} anos para sistema completo).`;
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: textoIntroducao })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Subseção de dados do produto
  mainContent.push(
    new Paragraph({
      text: "1.1 DADOS DO PRODUTO",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 },
      bold: true
    })
  );
  
  // Tabela com os dados do produto
  const tabelaDadosProduto = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
    },
    rows: [
      // Quantidade
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Quantidade:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: relatorio.quantidade ? relatorio.quantidade.toString() : "" })],
              }),
            ],
          }),
        ],
      }),
      // Modelo
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Modelo:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS` })],
              }),
            ],
          }),
        ],
      }),
      // Área coberta
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Área coberta:", bold: true })],
              }),
            ],
            shading: { fill: "FFFFFF" }
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${relatorio.area || ""}m² (aproximadamente)` })],
              }),
            ],
          }),
        ],
      }),
    ]
  });
  
  mainContent.push(tabelaDadosProduto);
  
  // ===== SEÇÃO DE ANÁLISE TÉCNICA =====
  mainContent.push(
    new Paragraph({
      text: "2. ANÁLISE TÉCNICA",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Texto padrão da análise técnica
  const textoAnaliseTecnica = relatorio.analiseTecnica || 
    `Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:`;
  
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: textoAnaliseTecnica })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Subseção de Não Conformidades
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
    // Criar a tabela de não conformidades
    const rowsNaoConformidades = naosConformidadesSelecionadas.map((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
      // Buscar a não conformidade completa a partir dos dados disponíveis
      const ncCompleta = naoConformidadesDisponiveis.find((item: {id: number, titulo: string, descricao: string}) => item.id === nc.id);
      
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: `${index + 1}. ${ncCompleta?.titulo || nc.titulo || ""}`, 
                    bold: true 
                  })
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: ncCompleta?.descricao || nc.descricao || "Descrição não disponível" 
                  })
                ],
                spacing: { before: 100 }
              })
            ],
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100
            }
          })
        ]
      });
    });
    
    const tabelaNaoConformidades = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
      },
      rows: rowsNaoConformidades
    });
    
    // Adicionar a tabela como um elemento
    const tableElement = {
      type: 'table',
      value: tabelaNaoConformidades
    };
    
    // Adicionar a tabela ao conteúdo principal usando JavaScript
    (mainContent as any).push(tabelaNaoConformidades);
  } else {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Não foram identificadas não conformidades durante a análise técnica." })
        ],
        spacing: { after: 200 }
      })
    );
  }
  
  // ===== SEÇÃO DE CONCLUSÃO =====
  mainContent.push(
    new Paragraph({
      text: "3. CONCLUSÃO",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Texto introdutório da conclusão
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:" })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Lista das não conformidades em tabela
  if (naosConformidadesSelecionadas.length > 0) {
    // Tabela com listagem de não conformidades
    const rowsListaNaoConformidades = naosConformidadesSelecionadas.map((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: `${index + 1}.`, 
                    bold: true 
                  })
                ],
              }),
            ],
            width: { size: 5, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: nc.titulo || "" 
                  })
                ],
              }),
            ],
            width: { size: 95, type: WidthType.PERCENTAGE }
          })
        ]
      });
    });
    
    const tabelaListaNaoConformidades = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: rowsListaNaoConformidades
    });
    
    // Adicionar a tabela ao conteúdo principal usando JavaScript
    (mainContent as any).push(tabelaListaNaoConformidades);
    
    // Parágrafo de conclusão com base no resultado
    // SEMPRE USAR IMPROCEDENTE AQUI
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: "Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.",
            bold: false
          })
        ],
        spacing: { before: 200, after: 200 }
      })
    );
  }
  
  // Informações sobre garantia
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `As telhas BRASILIT modelo ${relatorio.modeloTelha?.toUpperCase() || "FIBROCIMENTO ONDULADA"} possuem ${relatorio.anosGarantiaTotal || "dez"} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: [URL].`
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Texto final
  mainContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor."
        })
      ],
      spacing: { after: 200 }
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
      spacing: { after: 150 }
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
  
  // Preparar seções do documento
  const sections = [];
  
  // Definir a numeração para as não conformidades
  const numbering = {
    config: [
      {
        reference: "naoConformidades",
        levels: [
          {
            level: 0,
            format: "decimal" as "decimal",
            text: "%1.",
            alignment: AlignmentType.START,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 260 }
              }
            }
          }
        ]
      }
    ]
  };
  
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
  const doc = new Document({ 
    sections,
    numbering
  });
  
  // Retornar o blob
  return Packer.toBlob(doc);
}