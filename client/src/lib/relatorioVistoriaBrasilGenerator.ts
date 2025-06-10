import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, ImageRun, IImageOptions } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { 
  TEMPLATE_INTRODUCAO, 
  TEMPLATE_ANALISE_TECNICA,
  TEMPLATE_CONCLUSAO, 
  aplicarTemplateIntroducao, 
  aplicarTemplateConclusao 
} from "./relatorioVistoriaTemplates";

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
        spacing: { before: 120, after: 120 },
        border: {
          bottom: {
            color: "999999",
            size: 6,
            style: BorderStyle.SINGLE,
            space: 1,
          },
        },
        children: [
          new TextRun({
            text: "BRASILIT - SAINT-GOBAIN",
            bold: true,
            size: 26, // 13pt
            font: "Times New Roman",
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
        spacing: { before: 120, after: 60 },
        border: {
          top: {
            color: "999999",
            size: 6,
            style: BorderStyle.SINGLE,
            space: 1,
          },
        },
        children: [
          new TextRun({
            text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
            size: 18, // 9pt
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: "Divisão Produtos Para Construção",
            size: 18, // 9pt
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: "Departamento de Assistência Técnica",
            size: 18, // 9pt
            font: "Times New Roman",
          }),
        ],
      }),
    ],
  });
}

// Função para gerar a seção de título
function generateTitulo(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 480 }, // Duas linhas em branco após o título (240 twips = 1 linha)
    children: [
      new TextRun({
        text: "RELATÓRIO DE VISTORIA TÉCNICA",
        bold: true,
        size: 24, // Tamanho 12pt (24 half-points = 12pt)
        font: "Times New Roman",
      }),
    ],
  });
}

// Função para gerar informações básicas do relatório
function generateInformacoesBasicas(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção (Informações Gerais)
  paragraphs.push(
    new Paragraph({
      spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Informações Gerais",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Data de vistoria
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.dataVistoria || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Cliente
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Cliente: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.cliente || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Empreendimento
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Empreendimento: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.empreendimento || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Cidade
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Cidade: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`,
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Endereço
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Endereço: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.endereco || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // FAR/Protocolo
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "FAR/Protocolo: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.protocolo || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Assunto
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Assunto: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.assunto || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função para gerar a seção de responsáveis técnicos
function generateResponsaveisTecnicos(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Responsáveis Técnicos",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Elaborado por
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Elaborado por: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.elaboradoPor || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Departamento
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Departamento: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.departamento || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Unidade
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Unidade: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.unidade || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Coordenador Responsável
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Coordenador Responsável: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.coordenador || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Gerente Responsável
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Gerente Responsável: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.gerente || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Regional
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Regional: ",
          bold: true,
          font: "Times New Roman",
        }),
        new TextRun({
          text: relatorio.regional || "",
          font: "Times New Roman",
        }),
      ],
    })
  );

  return paragraphs;
}

// Usando o template da nova biblioteca de templates

// Função para gerar a seção de introdução
function generateIntroducao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Introdução",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Substituir os placeholders no template
  const introducaoTexto = TEMPLATE_INTRODUCAO
    .replace(/{protocolo}/g, relatorio.protocolo || "")
    .replace(/{modeloTelha}/g, `${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS`)
    .replace(/{anosGarantia}/g, relatorio.anosGarantia)
    .replace(/{anosGarantiaSistemaCompleto}/g, relatorio.anosGarantiaSistemaCompleto);

  // Dividir o texto em parágrafos
  const paragrafos = introducaoTexto.split("\n\n");

  // Adicionar cada parágrafo
  paragrafos.forEach((paragrafoTexto) => {
    // Ignorar linhas em branco
    if (paragrafoTexto.trim()) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: paragrafoTexto.replace(/\n/g, " "), // Substituir quebras de linha por espaços
              font: "Times New Roman",
            }),
          ],
        })
      );
    }
  });

  // Seção de quantidade e modelo
  paragraphs.push(
    new Paragraph({
      spacing: { before: 180, after: 120 },
      children: [
        new TextRun({
          text: "Quantidade e modelo:",
          bold: true,
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Item quantidade de telhas
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      indent: { left: 360 }, // Indentação para itens de lista
      children: [
        new TextRun({
          text: `• ${relatorio.quantidade}: ${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS.`,
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Item área coberta
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      indent: { left: 360 }, // Indentação para itens de lista
      children: [
        new TextRun({
          text: `• Área coberta: ${relatorio.area}m² aproximadamente.`,
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Parágrafo final - referência à norma técnica
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto --- Execução de coberturas e fechamentos laterais ---Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit.",
          font: "Times New Roman",
        }),
      ],
    })
  );

  return paragraphs;
}

// Usando o template da nova biblioteca de templates

// Função para gerar a seção de análise técnica
function generateAnaliseTecnica(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Análise Técnica",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Texto introdutório da análise técnica - do template
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: TEMPLATE_ANALISE_TECNICA.replace(/\n/g, " "),
          font: "Times New Roman",
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
        spacing: { before: 180, after: 120 },
        children: [
          new TextRun({
            text: `${index+1}. ${nc.titulo}`,
            bold: true,
            font: "Times New Roman",
          }),
        ],
      })
    );

    // Dividir a descrição em parágrafos para garantir texto completo
    if (nc.descricao) {
      // Se a descrição for muito longa, pode ser melhor dividi-la em múltiplos parágrafos
      // para garantir que seja exibida corretamente
      const maxLength = 1500; // Tamanho máximo para cada parágrafo (ajustável)
      if (nc.descricao.length > maxLength) {
        // Dividir em chunks para garantir que o texto seja exibido na íntegra
        let descricao = nc.descricao;
        while (descricao.length > 0) {
          const chunk = descricao.slice(0, Math.min(maxLength, descricao.length));
          paragraphs.push(
            new Paragraph({
              spacing: { before: 120, after: 120 },
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 360 }, // Indentação para descrição de não conformidade
              children: [
                new TextRun({
                  text: chunk,
                  font: "Times New Roman",
                }),
              ],
            })
          );
          descricao = descricao.slice(chunk.length);
        }
      } else {
        // Descrição normal em um único parágrafo
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 360 }, // Indentação para descrição de não conformidade
            children: [
              new TextRun({
                text: nc.descricao,
                font: "Times New Roman",
              }),
            ],
          })
        );
      }
    }
  });

  return paragraphs;
}

// Texto fixo do template para a conclusão
const TEMPLATE_CONCLUSAO_INTRO = `Com base na análise técnica realizada, foram identificadas as seguintes
não conformidades:`;

const TEMPLATE_CONCLUSAO_RESULTADO_IMPROCEDENTE = `Em função das não conformidades constatadas no manuseio e instalação das
chapas Brasilit, finalizamos o atendimento considerando a reclamação
como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto
manuseio e instalação das telhas e não a problemas relacionados à
qualidade do material.`;

const TEMPLATE_CONCLUSAO_RESULTADO_PROCEDENTE = `Em função da análise técnica realizada, finalizamos o atendimento
considerando a reclamação como PROCEDENTE, onde os problemas reclamados
estão relacionados à qualidade do material fornecido pela Brasilit.`;

const TEMPLATE_CONCLUSAO_GARANTIA = `As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem {anosGarantiaTotal} anos de
garantia com relação a problemas de fabricação. A garantia Brasilit está
condicionada a correta aplicação do produto, seguindo rigorosamente as
instruções de instalação contidas no Guia Técnico de Telhas de
Fibrocimento e Acessórios para Telhado --- Brasilit. Este guia técnico
está sempre disponível em: http://www.brasilit.com.br.`;

const TEMPLATE_CONCLUSAO_NORMAS = `Ratificamos que os produtos Brasilit atendem as Normas da Associação
Brasileira de Normas Técnicas --- ABNT, específicas para cada linha de
produto, e cumprimos as exigências legais de garantia de produtos
conforme a legislação em vigor.`;

const TEMPLATE_CONCLUSAO_AGRADECIMENTO = `Desde já, agradecemos e nos colocamos à disposição para quaisquer
esclarecimentos que se fizerem necessário.`;

// Função para gerar a seção de conclusão
function generateConclusao(relatorio: RelatorioVistoria): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Título da seção
  paragraphs.push(
    new Paragraph({
      spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Conclusão",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Texto introdutório da conclusão - do template
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: TEMPLATE_CONCLUSAO_INTRO.replace(/\n/g, " "),
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Lista de não conformidades selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter((nc: any) => nc.selecionado);
  naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        indent: { left: 360 }, // Indentação para melhor formatação da lista
        children: [
          new TextRun({
            text: `${index+1}. ${nc.titulo}`,
            font: "Times New Roman",
          }),
        ],
      })
    );
  });

  // Resultado da reclamação - escolher o template conforme o resultado
  const templateResultado = relatorio.resultado === "PROCEDENTE" 
    ? TEMPLATE_CONCLUSAO_RESULTADO_PROCEDENTE 
    : TEMPLATE_CONCLUSAO_RESULTADO_IMPROCEDENTE;
  
  paragraphs.push(
    new Paragraph({
      spacing: { before: 180, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: templateResultado.replace(/\n/g, " "),
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Informação sobre garantia - do template
  const garantiaText = TEMPLATE_CONCLUSAO_GARANTIA
    .replace(/{anosGarantiaTotal}/g, relatorio.anosGarantiaTotal)
    .replace(/\n/g, " ");
  
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: garantiaText,
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Normas ABNT - do template
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: TEMPLATE_CONCLUSAO_NORMAS.replace(/\n/g, " "),
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Agradecimento - do template
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: TEMPLATE_CONCLUSAO_AGRADECIMENTO.replace(/\n/g, " "),
          font: "Times New Roman",
        }),
      ],
    })
  );

  // Atenciosamente
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "Atenciosamente,",
          font: "Times New Roman",
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
        spacing: { before: 240, after: 240 }, // Uma linha em branco antes e depois
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: "Anexo Fotográfico",
            bold: true,
            size: 24, // 12pt
            font: "Times New Roman",
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
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: `Foto ${i+1}: ${foto.descricao || "Registro fotográfico da vistoria"}`,
                bold: true,
                font: "Times New Roman",
              }),
            ],
          })
        );

        // Adicionar a imagem
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 180 },
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
            spacing: { before: 120, after: 180 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `[Não foi possível carregar a foto ${i+1}]`,
                color: "FF0000",
                font: "Times New Roman",
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
      spacing: { before: 500, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "______________________________",
          font: "Times New Roman",
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.elaboradoPor || "Técnico Responsável",
          bold: true,
          font: "Times New Roman",
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: relatorio.departamento || "Departamento",
          font: "Times New Roman",
        }),
      ],
    })
  );

  return paragraphs;
}

// Função principal para gerar o relatório
export async function generateRelatorioVistoriaBrasil(relatorio: RelatorioVistoria): Promise<Blob> {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: "Times New Roman",
            size: 24, // 12 pontos (24 half-points)
          },
          paragraph: {
            spacing: { 
              line: 360, // Espaçamento 1,5 linhas (240 = 1 linha)
              after: 160 // 8 pontos de espaço após parágrafo (20 twips = 1 ponto)
            },
            alignment: AlignmentType.JUSTIFIED // Texto justificado por padrão
          }
        },
      ],
    },
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
              top: 720,  // 2,5 cm (aproximadamente)
              right: 720, // 2,5 cm
              bottom: 720, // 2,5 cm
              left: 864, // 3,0 cm
            },
            size: {
              width: 11906, // A4 width (210mm em twip)
              height: 16838, // A4 height (297mm em twip)
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