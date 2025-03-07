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
  
  // Título
  mainContent.push(
    new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );
  
  // Seção de informações gerais
  mainContent.push(
    new Paragraph({
      text: "Informações Gerais",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );
  
  // Lista de informações gerais com bullets
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Data de vistoria: " }),
        new TextRun({ text: relatorio.dataVistoria || "[Data da Vistoria]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Cliente: " }),
        new TextRun({ text: relatorio.cliente || "[Nome do Cliente]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Empreendimento: " }),
        new TextRun({ text: relatorio.empreendimento || "[Nome do Empreendimento]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Cidade: " }),
        new TextRun({ text: relatorio.cidade || "[Cidade]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Endereço: " }),
        new TextRun({ text: relatorio.endereco || "[Endereço]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "FAR/Protocolo: " }),
        new TextRun({ text: relatorio.protocolo || "[Número do Protocolo]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Assunto: " }),
        new TextRun({ text: relatorio.assunto || "[Assunto]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Elaborado por: " }),
        new TextRun({ text: relatorio.elaboradoPor || "[Nome do Técnico]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Departamento: " }),
        new TextRun({ text: relatorio.departamento || "[Nome do Departamento]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Unidade: " }),
        new TextRun({ text: relatorio.unidade || "[Unidade]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Coordenador Responsável: " }),
        new TextRun({ text: relatorio.coordenador || "[Nome do Coordenador]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Gerente Responsável: " }),
        new TextRun({ text: relatorio.gerente || "[Nome do Gerente]" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Regional: " }),
        new TextRun({ text: relatorio.regional || "[Nome da Regional]" })
      ]
    })
  );
  
  // Seção de introdução
  mainContent.push(
    new Paragraph({
      text: "Introdução",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
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
  
  // Informações sobre quantidade e área
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Quantidade e modelo:" })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      indent: { left: 720 },
      children: [
        new TextRun({ text: `${relatorio.quantidade || "[Número]"}: ${relatorio.modeloTelha || "Ondulada"} ${relatorio.espessura || "6"}mm CRFS.` })
      ]
    })
  );
  
  mainContent.push(
    new Paragraph({
      bullet: { level: 0 },
      indent: { left: 720 },
      children: [
        new TextRun({ text: `Área coberta: ${relatorio.area || "[Área]"}m² aproximadamente.` })
      ]
    })
  );
  
  // Análise técnica
  mainContent.push(
    new Paragraph({
      text: "Análise Técnica",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
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
  
  // Filtrar não conformidades selecionadas para usar em várias seções do documento
  const naosConformidadesSelecionadas = relatorio.naoConformidades.filter(nc => nc.selecionado);
  
  if (naosConformidadesSelecionadas.length > 0) {
    // Usar as descrições completas das não conformidades disponíveis (importadas no topo do arquivo)
    naosConformidadesSelecionadas.forEach((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
      // Buscar a não conformidade completa a partir dos dados disponíveis
      const ncCompleta = naoConformidadesDisponiveis.find((item: {id: number, titulo: string, descricao: string}) => item.id === nc.id);
      
      // Título com formatação numérica
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${index + 1}. ${ncCompleta?.titulo || nc.titulo || ""}`, 
              bold: true
            })
          ],
          spacing: { before: 200, after: 100 }
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
          spacing: { after: 200 }
        })
      );
    });
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
  
  // Conclusão
  mainContent.push(
    new Paragraph({
      text: "Conclusão",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
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
  
  // Lista numerada das não conformidades na conclusão
  if (naosConformidadesSelecionadas.length > 0) {
    // Lista com os títulos das não conformidades com formatação numerada
    naosConformidadesSelecionadas.forEach((nc: {id: number, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
      mainContent.push(
        new Paragraph({
          numbering: {
            reference: "naoConformidades",
            level: 0,
          },
          children: [
            new TextRun({ text: nc.titulo || "" })
          ],
          spacing: { after: 80 }
        })
      );
    });
    
    // Parágrafo de conclusão com base no resultado
    if (relatorio.resultado === "IMPROCEDENTE") {
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
    } else {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: "Após análise das evidências técnicas coletadas, finalizamos o atendimento considerando a reclamação como PROCEDENTE. Recomendamos o seguinte procedimento para resolução do problema apresentado.",
              bold: false
            })
          ],
          spacing: { before: 200, after: 200 }
        })
      );
    }
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
            format: "decimal",
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