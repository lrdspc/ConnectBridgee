
import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import { RelatorioVistoria, naoConformidadesDisponiveis } from "../../shared/relatorioVistoriaSchema";
import { aplicarTemplateIntroducao, aplicarTemplateConclusao, TEMPLATE_ANALISE_TECNICA } from "./relatorioVistoriaTemplates";

// Converte dataURL para um Buffer que pode ser usado pelo docx
async function dataUrlToBuffer(dataUrl: string): Promise<Uint8Array> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Erro ao converter dataURL para buffer:", error);
    throw error;
  }
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
            text: "RELATÓRIO DE VISTORIA TÉCNICA",
            bold: true,
            size: 24,
          }),
        ],
      }),
    ],
  });
}

// Função para gerar o rodapé do relatório
function generateFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
            size: 18,
          }),
        ],
      }),
    ],
  });
}

// Função para gerar a seção de informações básicas
function generateInformacoesBasicas(relatorio: RelatorioVistoria): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.dataVistoria || "Não informada",
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
          text: relatorio.cliente || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Empreendimento: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.empreendimento || "Não informado",
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
          text: `${relatorio.cidade || "Não informada"}${relatorio.uf ? ` - ${relatorio.uf}` : ""}`,
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
          text: relatorio.endereco || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "FAR/Protocolo: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.protocolo || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Assunto: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.assunto || "Não informado",
        }),
      ],
    }),
  ];
}

// Função para gerar a seção de responsáveis técnicos
function generateResponsaveisTecnicos(relatorio: RelatorioVistoria): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Elaborado por: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.elaboradoPor || "Não informado",
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
          text: relatorio.departamento || "Não informado",
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
          text: relatorio.unidade || "Não informada",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Coordenador Responsável: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.coordenador || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Gerente Responsável: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.gerente || "Não informado",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Regional: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.regional || "Não informada",
        }),
      ],
    }),
  ];
}

// Função para gerar a seção de introdução
function generateIntroducao(relatorio: RelatorioVistoria): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Introdução",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo || "[Protocolo não informado]"}.`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha || "Não informado"} ${relatorio.espessura || ""}mm. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia || "5"} anos (ou ${relatorio.anosGarantiaSistemaCompleto || "10"} anos para sistema completo).`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Quantidade e modelo:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: `• ${relatorio.quantidade || "Não informado"}: ${relatorio.modeloTelha || "Não informado"} ${relatorio.espessura || ""}mm.`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `• Área coberta: ${relatorio.area || "Não informada"}m² aproximadamente.`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.",
        }),
      ],
    }),
  ];
}

// Função para gerar a seção de análise técnica com não conformidades
function generateAnaliseTecnica(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Análise Técnica",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:",
        }),
      ],
    }),
  ];

  // Adicionar não conformidades selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .sort((a, b) => a.id - b.id);

  naoConformidadesSelecionadas.forEach(nc => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: `${nc.id}. ${nc.titulo}`,
            bold: true,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({
            text: nc.descricao || "",
          }),
        ],
      })
    );
  });

  return paragraphs;
}

// Função para gerar a seção de conclusão
function generateConclusao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Conclusão",
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
        }),
      ],
    }),
  ];

  // Adicionar lista de títulos das não conformidades
  const naoConformidadesSelecionadas = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .sort((a, b) => a.id - b.id);

  naoConformidadesSelecionadas.forEach(nc => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: `${nc.id}. ${nc.titulo}`,
          }),
        ],
      })
    );
  });

  // Texto de conclusão padrão
  paragraphs.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: `Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como ${relatorio.resultado === "PROCEDENTE" ? "PROCEDENTE" : "IMPROCEDENTE"}, onde os problemas reclamados se dão pelo ${relatorio.resultado === "PROCEDENTE" ? "defeito do material" : "incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material"}.`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `As telhas BRASILIT modelo FIBROCIMENTO ${relatorio.modeloTelha?.toUpperCase() || "ONDULADA"} possuem ${relatorio.anosGarantiaTotal || "dez"} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.`,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas — ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de fotos
async function generateFotosSection(relatorio: RelatorioVistoria): Promise<Paragraph[]> {
  if (!relatorio.fotos || relatorio.fotos.length === 0) {
    return [];
  }

  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Registro Fotográfico",
          bold: true,
          size: 24,
        }),
      ],
    }),
  ];

  // Processa as fotos
  for (let i = 0; i < relatorio.fotos.length; i++) {
    const foto = relatorio.fotos[i];
    try {
      const imageBuffer = await dataUrlToBuffer(foto.dataUrl);
      
      paragraphs.push(
        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({
              text: `Figura ${i + 1}${foto.descricao ? ': ' + foto.descricao : ''}`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 200 },
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
    } catch (error) {
      console.error(`Erro ao processar imagem ${i + 1}:`, error);
      
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 200 },
          children: [
            new TextRun({
              text: `[Erro ao carregar a imagem ${i + 1}]`,
              color: "FF0000",
            }),
          ],
        })
      );
    }
  }

  return paragraphs;
}

// Função para gerar a assinatura
function generateAssinatura(relatorio: RelatorioVistoria): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Atenciosamente,",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Divisão Produtos Para Construção",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Departamento de Assistência Técnica",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 400, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "_______________________________",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.elaboradoPor || "Responsável Técnico",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.departamento || "Departamento",
        }),
      ],
    }),
  ];
}

// Função principal para gerar o relatório
export async function generateRelatorioVistoria(relatorio: RelatorioVistoria): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        headers: {
          default: generateHeader(),
        },
        footers: {
          default: generateFooter(),
        },
        properties: {
          page: {
            margin: {
              top: 1000,  // Margens em twips (1440 twips = 1 polegada)
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: [
          // Título principal
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: "RELATÓRIO DE VISTORIA TÉCNICA",
                bold: true,
                size: 28,
              }),
            ],
          }),
          
          // Informações básicas
          ...generateInformacoesBasicas(relatorio),
          
          // Responsáveis técnicos
          ...generateResponsaveisTecnicos(relatorio),
          
          // Introdução
          ...generateIntroducao(relatorio),
          
          // Análise Técnica
          ...generateAnaliseTecnica(relatorio),
          
          // Conclusão
          ...generateConclusao(relatorio),
          
          // Fotos
          ...(await generateFotosSection(relatorio)),
          
          // Assinatura
          ...generateAssinatura(relatorio),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
