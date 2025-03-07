
import { Document, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from "docx";
import { RelatorioVistoria } from "@/shared/relatorioVistoriaSchema";
import { formatDate } from "./dateUtils";

/**
 * Gera um documento DOCX para um relatório de vistoria.
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX
 */
export async function generateRelatorioVistoriaDocx(relatorio: RelatorioVistoria): Promise<Blob> {
  // Cabeçalho principal do documento
  const headerParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "RELATÓRIO DE VISTORIA TÉCNICA",
          bold: true,
          size: 28,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];

  // Identificação do projeto - OK
  const identificacaoProjeto = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Informações Gerais",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          bold: true,
        }),
        new TextRun(`${formatDate(relatorio.dataVistoria)}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Cliente: ",
          bold: true,
        }),
        new TextRun(`${relatorio.cliente}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Empreendimento: ",
          bold: true,
        }),
        new TextRun(`${relatorio.empreendimento}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Cidade: ",
          bold: true,
        }),
        new TextRun(`${relatorio.cidade}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Endereço: ",
          bold: true,
        }),
        new TextRun(`${relatorio.endereco}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "FAR/Protocolo: ",
          bold: true,
        }),
        new TextRun(`${relatorio.protocolo}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Assunto: ",
          bold: true,
        }),
        new TextRun(`${relatorio.assunto}`),
      ],
    }),
  ];

  // Responsáveis técnicos - OK
  const responsaveisTecnicos = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Responsáveis Técnicos",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Elaborado por: ",
          bold: true,
        }),
        new TextRun(`${relatorio.elaboradoPor}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Departamento: ",
          bold: true,
        }),
        new TextRun(`${relatorio.departamento}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Unidade: ",
          bold: true,
        }),
        new TextRun(`${relatorio.unidade}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Coordenador Responsável: ",
          bold: true,
        }),
        new TextRun(`${relatorio.coordenador}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Gerente Responsável: ",
          bold: true,
        }),
        new TextRun(`${relatorio.gerente}`),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Regional: ",
          bold: true,
        }),
        new TextRun(`${relatorio.regional}`),
      ],
    }),
  ];

  // Dados do produto - OK
  const dadosProduto = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Dados do Produto",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "O modelo de telha escolhido para a edificação foi: ",
          bold: true,
        }),
        new TextRun(`${relatorio.modeloTelha} de ${relatorio.espessura}mm. `),
        new TextRun(`Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto} anos para sistema completo).`),
      ],
      spacing: { before: 200, after: 200 },
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Quantidade e modelo:",
        }),
      ],
    }),
    new Paragraph({
      bullet: { level: 1 },
      children: [
        new TextRun(`${relatorio.quantidade}: ${relatorio.modeloTelha} ${relatorio.espessura}mm CRFS.`),
      ],
    }),
    new Paragraph({
      bullet: { level: 1 },
      children: [
        new TextRun(`Área coberta: ${relatorio.area}m² aproximadamente.`),
      ],
    }),
  ];

  // Introdução
  const introducaoParagrafo = relatorio.introducao ? [
    new Paragraph({
      children: [
        new TextRun({
          text: "Introdução",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.introducao),
      ],
    }),
  ] : [];

  // Análise Técnica
  const analiseTecnicaParagrafo = relatorio.analiseTecnica ? [
    new Paragraph({
      children: [
        new TextRun({
          text: "Análise Técnica",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.analiseTecnica),
      ],
    }),
  ] : [];

  // Não Conformidades
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(
    (nc) => nc.selecionado
  );

  const naoConformidadesParagrafos = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Não Conformidades Identificadas",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
  ];

  if (naoConformidadesSelecionadas.length === 0) {
    naoConformidadesParagrafos.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Nenhuma não conformidade foi identificada.",
          }),
        ],
      })
    );
  } else {
    naoConformidadesSelecionadas.forEach((nc) => {
      naoConformidadesParagrafos.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${nc.id}. ${nc.titulo}`,
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      if (nc.descricao) {
        naoConformidadesParagrafos.push(
          new Paragraph({
            children: [
              new TextRun(nc.descricao),
            ],
            spacing: { after: 200 },
          })
        );
      }
    });
  }

  // Conclusão
  const conclusaoParagrafo = relatorio.conclusao ? [
    new Paragraph({
      children: [
        new TextRun({
          text: "Conclusão",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.conclusao),
      ],
    }),
  ] : [];

  // Recomendações
  const recomendacaoParagrafo = relatorio.recomendacao ? [
    new Paragraph({
      children: [
        new TextRun({
          text: "Recomendações",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.recomendacao),
      ],
    }),
  ] : [];

  // Observações Gerais
  const observacoesParagrafo = relatorio.observacoesGerais ? [
    new Paragraph({
      children: [
        new TextRun({
          text: "Observações Gerais",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.observacoesGerais),
      ],
    }),
  ] : [];

  // Resultado
  const resultadoParagrafo = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Resultado da Análise",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `A reclamação é ${relatorio.resultado === "PROCEDENTE" ? "PROCEDENTE" : "IMPROCEDENTE"}.`,
          bold: true,
        }),
      ],
    }),
  ];

  // Data e Assinatura
  const dataAssinaturaParagrafo = [
    new Paragraph({
      children: [
        new TextRun(`${relatorio.cidade}, ${formatDate(new Date().toISOString())}`),
      ],
      spacing: { before: 600, after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun("_______________________________"),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun(relatorio.elaboradoPor),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun(`${relatorio.departamento} - ${relatorio.unidade}`),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ];

  // Montagem do documento
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...headerParagraphs,
          ...identificacaoProjeto,
          ...responsaveisTecnicos,
          ...dadosProduto,
          ...introducaoParagrafo,
          ...analiseTecnicaParagrafo,
          ...naoConformidadesParagrafos,
          ...conclusaoParagrafo,
          ...recomendacaoParagrafo,
          ...observacoesParagrafo,
          ...resultadoParagrafo,
          ...dataAssinaturaParagrafo,
        ],
      },
    ],
  });

  // Geração do arquivo
  const buffer = await docx.Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  
  return blob;
}
