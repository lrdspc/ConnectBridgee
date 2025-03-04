import { Inspection } from "@shared/schema";
import { format } from "date-fns";
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  Header,
  Footer,
  BorderStyle,
  SectionType,
  PageOrientation,
  PageNumber,
  convertInchesToTwip,
} from "docx";

const FONTS = {
  primary: "Arial",
  secondary: "Arial",
};

// Gerador de informações iniciais
function generateInitialInfo(inspection: Inspection): Paragraph[] {
  return [
    // Título do Relatório
    new Paragraph({
      spacing: { before: 240, after: 240 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "RELATÓRIO DE VISTORIA TÉCNICA",
          font: FONTS.primary,
          size: 32,
          bold: true,
        }),
      ],
    }),

    // Data e Cliente
    new Paragraph({
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: "Data de vistoria: ",
          font: FONTS.primary,
          size: 24,
          bold: true,
        }),
        new TextRun({
          text: inspection.dateInspected ? format(new Date(inspection.dateInspected), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy'),
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    // ... [resto do código de geração do relatório permanece igual]
  ];
}

// Função principal para gerar o documento
export async function generateInspectionReport(inspection: Inspection): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
          size: {
            orientation: PageOrientation.PORTRAIT,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: "SAINT-GOBAIN BRASIL",
                  font: FONTS.primary,
                  size: 32,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...generateInitialInfo(inspection),
        ...generateTechnicalSection(inspection),
        ...generateConclusion(inspection),
        ...generateSignatures(inspection),
      ],
    }],
  });

  return await Packer.toBlob(doc);
}
