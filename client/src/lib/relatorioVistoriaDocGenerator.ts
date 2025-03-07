import { 
  Document, Paragraph, TextRun, HeadingLevel, AlignmentType, 
  BorderStyle, Tab, TabStopPosition, TabStopType, NumberFormat, LevelFormat,
  convertInchesToTwip, PageOrientation, WidthType, Table, TableRow, TableCell,
  SectionType, Header, Footer, PageNumber, IBorderOptions as BorderOptions, ShadingType,
  UnderlineType, Media, ExternalHyperlink, PageBreak,
  SimpleField, ImageRun, FileChild
} from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";

// Interface estendida para compatibilidade com versões anteriores do código
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

// Configurações de estilo para manter consistência com a especificação
const FONTE_PRINCIPAL = "Times New Roman";
const TAMANHO_FONTE = 24; // 12pt = 24 half-points

// Função para gerar o documento Word
export async function gerarRelatorioVistoriaDoc(relatorio: ExtendedRelatorioVistoria): Promise<Blob> {
  // Criar conjunto de parágrafos do documento
  const children: FileChild[] = [];

  // ==== TÍTULO DO DOCUMENTO ====
  children.push(
    new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      alignment: AlignmentType.CENTER,
      spacing: { after: 480, before: 0 }, // 240 = 1 linha (12pt)
      children: [
        new TextRun({
          text: "RELATÓRIO DE VISTORIA TÉCNICA",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        })
      ]
    })
  );

  // ==== INFORMAÇÕES BÁSICAS ====
  // Data de vistoria
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.dataVistoria || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Cliente
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Cliente: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.cliente || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Empreendimento
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Empreendimento: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.empreendimento || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Cidade
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Cidade: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`,
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Endereço
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Endereço: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.endereco || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // FAR/Protocolo
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "FAR/Protocolo: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.protocolo || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Assunto
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Assunto: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.assunto || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Elaborado por
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Elaborado por: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.elaboradoPor || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Departamento
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Departamento: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.departamento || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Unidade
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Unidade: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.unidade || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Coordenador Responsável
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Coordenador Responsável: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.coordenador || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Gerente Responsável
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Gerente Responsável: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.gerente || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Regional
  children.push(
    new Paragraph({
      spacing: { after: 480 }, // Espaço duplo após a última informação
      children: [
        new TextRun({
          text: "Regional: ",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        }),
        new TextRun({
          text: relatorio.regional || "",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // ==== INTRODUÇÃO ====
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Introdução",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        })
      ]
    })
  );

  // Texto da introdução - dividir por parágrafos
  const paragrafosIntroducao = relatorio.introducao?.split('\n\n') || [];
  paragrafosIntroducao.forEach((paragrafo: string, index: number) => {
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: paragrafo,
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE
          })
        ]
      })
    );
  });

  // ==== QUANTIDADE E MODELO ====
  if (relatorio.quantidadeTelhas || relatorio.modeloTelha || relatorio.areaCoberta) {
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "Quantidade e modelo:",
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE,
            bold: true
          })
        ]
      })
    );

    // Item 1 - Quantidade e modelo de telhas
    if (relatorio.quantidadeTelhas && relatorio.modeloTelha) {
      children.push(
        new Paragraph({
          spacing: { after: 240 },
          indent: { left: 360 }, // ~0.5 inch = 360 twips
          children: [
            new TextRun({
              text: "• ",
              font: FONTE_PRINCIPAL,
              size: TAMANHO_FONTE
            }),
            new TextRun({
              text: `${relatorio.quantidadeTelhas}: ${relatorio.modeloTelha}.`,
              font: FONTE_PRINCIPAL,
              size: TAMANHO_FONTE
            })
          ]
        })
      );
    }

    // Item 2 - Área coberta
    if (relatorio.areaCoberta) {
      children.push(
        new Paragraph({
          spacing: { after: 240 },
          indent: { left: 360 }, // ~0.5 inch = 360 twips
          children: [
            new TextRun({
              text: "• ",
              font: FONTE_PRINCIPAL,
              size: TAMANHO_FONTE
            }),
            new TextRun({
              text: `Área coberta: ${relatorio.areaCoberta}m² aproximadamente.`,
              font: FONTE_PRINCIPAL,
              size: TAMANHO_FONTE
            })
          ]
        })
      );
    }
  }

  // Parágrafo final da introdução
  children.push(
    new Paragraph({
      spacing: { after: 480 }, // Espaço duplo antes da próxima seção
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto --- Execução de coberturas e fechamentos laterais ---Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit.",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // ==== ANÁLISE TÉCNICA ====
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Análise Técnica",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        })
      ]
    })
  );

  // Texto introdutório da análise técnica
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Não conformidades
  const naoConformidades = relatorio.naoConformidades?.filter(nc => nc.selecionado) || [];

  naoConformidades.forEach((nc: {id: number|string, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
    // Título da não conformidade (numerado de acordo com o ID original)
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `${nc.id}. ${nc.titulo}`,
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE,
            bold: true
          })
        ]
      })
    );

    // Descrição da não conformidade
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: nc.descricao || "",
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE
          })
        ]
      })
    );
  });

  // ==== CONCLUSÃO ====
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Conclusão",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE,
          bold: true
        })
      ]
    })
  );

  // Texto introdutório da conclusão
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Lista de não conformidades na conclusão (apenas os títulos, numerados sequencialmente)
  naoConformidades.forEach((nc: {id: number|string, titulo: string, descricao?: string, selecionado: boolean}, index: number) => {
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `${index + 1}. ${nc.titulo}`,
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE
          })
        ]
      })
    );
  });

  // Parágrafos da conclusão
  const paragrafosConclusao = relatorio.conclusao?.split('\n\n') || [];
  paragrafosConclusao.forEach((paragrafo: string) => {
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: paragrafo,
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE
          })
        ]
      })
    );
  });

  // ==== ASSINATURA E FECHAMENTO ====
  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Atenciosamente,",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Divisão Produtos Para Construção",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "Departamento de Assistência Técnica",
          font: FONTE_PRINCIPAL,
          size: TAMANHO_FONTE
        })
      ]
    })
  );

  // Criar o documento com as configurações de página definidas
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,      // 2,5 cm = ~720 twips
              right: 720,    // 2,5 cm = ~720 twips
              bottom: 720,   // 2,5 cm = ~720 twips
              left: 864      // 3,0 cm = ~864 twips
            },
            size: {
              width: 11906,  // A4 width
              height: 16838  // A4 height
            }
          }
        },
        children: children
      }
    ],
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: FONTE_PRINCIPAL,
            size: TAMANHO_FONTE
          },
          paragraph: {
            spacing: { line: 360 } // 1.5 linhas = 360
          }
        }
      ]
    }
  });

  // Gerar o documento e retornar como Blob
  // Usamos o Packer da importação de cima, sem precisar do require
  try {
    // Converte para blob e retorna
    return await Document.save(doc, {
      fileName: `relatorio-vistoria-${relatorio.protocolo || 'novo'}.docx`
    });
  } catch (error) {
    console.error("Erro ao gerar documento DOCX:", error);
    throw new Error("Não foi possível gerar o documento Word: " + error);
  }
}