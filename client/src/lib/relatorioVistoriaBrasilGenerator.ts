import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, ImageRun, IImageOptions } from "docx";
import { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";

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
      })
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
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Divisão Produtos Para Construção",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Departamento de Assistência Técnica",
          }),
        ],
      }),
    ],
  });
}

// Função para gerar a seção de título
function generateTitulo(): Paragraph {
  return new Paragraph({
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
  });
}

// Função para gerar informações básicas do relatório
function generateInformacoesBasicas(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Data de vistoria
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.dataVistoria || "",
        }),
      ],
    })
  );

  // Cliente
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Cliente: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.cliente || "",
        }),
      ],
    })
  );

  // Empreendimento
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Empreendimento: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.empreendimento || "",
        }),
      ],
    })
  );

  // Cidade
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Cidade: ",
          bold: true,
        }),
        new TextRun({
          text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`,
        }),
      ],
    })
  );

  // Endereço
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Endereço: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.endereco || "",
        }),
      ],
    })
  );

  // FAR/Protocolo
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "FAR/Protocolo: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.protocolo || "",
        }),
      ],
    })
  );

  // Assunto
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Assunto: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.assunto || "",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de responsáveis técnicos
function generateResponsaveisTecnicos(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Elaborado por
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Elaborado por: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.elaboradoPor || "",
        }),
      ],
    })
  );

  // Departamento
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Departamento: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.departamento || "",
        }),
      ],
    })
  );

  // Unidade
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Unidade: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.unidade || "",
        }),
      ],
    })
  );

  // Coordenador Responsável
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Coordenador Responsável: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.coordenador || "",
        }),
      ],
    })
  );

  // Gerente Responsável
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Gerente Responsável: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.gerente || "",
        }),
      ],
    })
  );

  // Regional
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Regional: ",
          bold: true,
        }),
        new TextRun({
          text: relatorio.regional || "",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de introdução
function generateIntroducao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Introdução",
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  // Texto padrão da introdução
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.",
        }),
      ],
    })
  );

  // Continuação do texto padrão
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${relatorio.protocolo}.`,
        }),
      ],
    })
  );

  // Modelo da telha
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto} anos para sistema completo).`,
        }),
      ],
    })
  );

  // Quantidade e modelo
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "Quantidade e modelo:",
          bold: true,
        }),
      ],
    })
  );

  // Quantidade específica
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: `• ${relatorio.quantidade}: ${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS.`,
        }),
      ],
    })
  );

  // Área coberta
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `• Área coberta: ${relatorio.area}m² aproximadamente.`,
        }),
      ],
    })
  );

  // Norma técnica
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 300 },
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto --- Execução de coberturas e fechamentos laterais ---Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit.",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de análise técnica
function generateAnaliseTecnica(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Análise Técnica",
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  // Texto introdutório da análise técnica
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:",
        }),
      ],
    })
  );

  // Adicionar as não conformidades selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter((nc: any) => nc.selecionado);
  naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
    // Título da não conformidade
    paragraphs.push(
      new Paragraph({
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: `${index+1}. ${nc.titulo}`,
            bold: true,
          }),
        ],
      })
    );

    // Descrição da não conformidade
    paragraphs.push(
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
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: "Conclusão",
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  // Texto introdutório da conclusão
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
        }),
      ],
    })
  );

  // Lista de não conformidades selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter((nc: any) => nc.selecionado);
  naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: `${index+1}. ${nc.titulo}`,
          }),
        ],
      })
    );
  });

  // Resultado da reclamação
  paragraphs.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: `Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como ${relatorio.resultado}, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.`,
        }),
      ],
    })
  );

  // Informação sobre garantia
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem ${relatorio.anosGarantiaTotal} anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.`,
        }),
      ],
    })
  );

  // Normas ABNT
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas --- ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.",
        }),
      ],
    })
  );

  // Agradecimento
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
        }),
      ],
    })
  );

  // Atenciosamente
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "Atenciosamente,",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de fotos
async function generateFotosSection(relatorio: RelatorioVistoria): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];

  // Verificar se há fotos para incluir
  if (relatorio.fotos && relatorio.fotos.length > 0) {
    // Título da seção
    paragraphs.push(
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: "Anexo Fotográfico",
            bold: true,
            size: 24,
          }),
        ],
      })
    );

    // Processar cada foto
    for (let i = 0; i < relatorio.fotos.length; i++) {
      const foto = relatorio.fotos[i];
      try {
        // Converter a dataURL para buffer
        const imageData = await dataUrlToBuffer(foto.dataUrl);

        // Adicionar a foto
        paragraphs.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: `Foto ${i+1}: ${foto.descricao || "Registro fotográfico da vistoria"}`,
                bold: true,
              }),
            ],
          })
        );

        // Adicionar a imagem
        paragraphs.push(
          new Paragraph({
            spacing: { before: 100, after: 200 },
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: imageData,
                transformation: {
                  width: 400,
                  height: 300,
                },
                type: "png",
              } as IImageOptions),
            ],
          })
        );
      } catch (error) {
        console.error(`Erro ao processar foto ${i+1}:`, error);
        // Adicionar mensagem de erro em vez da foto
        paragraphs.push(
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: `[Não foi possível carregar a foto ${i+1}]`,
                color: "FF0000",
              }),
            ],
          })
        );
      }
    }
  }

  return paragraphs;
}

// Função para gerar a assinatura
function generateAssinatura(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      spacing: { before: 500, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "______________________________",
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.elaboradoPor || "Técnico Responsável",
          bold: true,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.departamento || "Departamento",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função principal para gerar o relatório
export async function generateRelatorioVistoriaBrasil(relatorio: RelatorioVistoria): Promise<Blob> {
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
          generateTitulo(),
          
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