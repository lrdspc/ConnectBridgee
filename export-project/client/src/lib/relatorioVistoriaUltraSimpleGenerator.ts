/**
 * Gerador ultra simples de documentos para relatórios de vistoria 
 * Sem herança de classes, apenas funcionalidade básica
 */

// Importações diretas 
import { 
  Document, Packer, Paragraph, TextRun, 
  AlignmentType, BorderStyle 
} from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

// Log para debug
function log(...args: any[]) {
  console.log("[UltraSimpleGenerator]", ...args);
}

/**
 * Versão ultra simplificada do gerador de relatórios DOCX
 * Sem extensão de classes, importações diretas
 */
export async function gerarRelatorioVistoriaUltraSimples(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    log("Iniciando geração de relatório ultra simples");
    
    // Preparar texto de introdução
    const introducaoTexto = aplicarTemplateIntroducao({
      modeloTelha: relatorio.modeloTelha,
      espessura: relatorio.espessura,
      protocolo: relatorio.protocolo,
      anosGarantia: relatorio.anosGarantia,
      anosGarantiaSistemaCompleto: relatorio.anosGarantiaSistemaCompleto
    });
    
    // Preparar conclusão - sempre como IMPROCEDENTE
    const conclusaoTexto = aplicarTemplateConclusao({
      resultado: "IMPROCEDENTE",
      modeloTelha: relatorio.modeloTelha,
      anosGarantiaTotal: relatorio.anosGarantiaTotal
    });
    
    // Criar todos os parágrafos
    const paragrafos: Paragraph[] = [];
    
    // Título
    paragrafos.push(new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: "Heading1",
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }));
    
    // 1. IDENTIFICAÇÃO
    paragrafos.push(new Paragraph({
      text: "1. IDENTIFICAÇÃO DO PROJETO",
      heading: "Heading2",
      spacing: { before: 400, after: 200 }
    }));
    
    paragrafos.push(new Paragraph({
      children: [
        new TextRun({ text: "Protocolo/FAR: ", bold: true }),
        new TextRun(relatorio.protocolo || "N/A")
      ]
    }));
    
    paragrafos.push(new Paragraph({
      children: [
        new TextRun({ text: "Data de vistoria: ", bold: true }),
        new TextRun(relatorio.dataVistoria || "N/A")
      ]
    }));
    
    paragrafos.push(new Paragraph({
      children: [
        new TextRun({ text: "Cliente: ", bold: true }),
        new TextRun(relatorio.cliente || "N/A")
      ]
    }));
    
    paragrafos.push(new Paragraph({
      children: [
        new TextRun({ text: "Endereço: ", bold: true }),
        new TextRun(relatorio.endereco || "N/A")
      ]
    }));
    
    paragrafos.push(new Paragraph({
      children: [
        new TextRun({ text: "Cidade/UF: ", bold: true }),
        new TextRun(`${relatorio.cidade || ""} - ${relatorio.uf || ""}`)
      ]
    }));
    
    // 2. INTRODUÇÃO
    paragrafos.push(new Paragraph({
      text: "2. INTRODUÇÃO",
      heading: "Heading2",
      spacing: { before: 400, after: 200 }
    }));
    
    paragrafos.push(new Paragraph({
      text: introducaoTexto,
      alignment: AlignmentType.JUSTIFIED
    }));
    
    // 3. ANÁLISE TÉCNICA
    paragrafos.push(new Paragraph({
      text: "3. ANÁLISE TÉCNICA",
      heading: "Heading2",
      spacing: { before: 400, after: 200 }
    }));
    
    paragrafos.push(new Paragraph({
      text: TEMPLATE_ANALISE_TECNICA,
      alignment: AlignmentType.JUSTIFIED
    }));
    
    // 3.1 NÃO CONFORMIDADES
    paragrafos.push(new Paragraph({
      text: "3.1 NÃO CONFORMIDADES IDENTIFICADAS",
      heading: "Heading3",
      spacing: { before: 300, after: 200 }
    }));
    
    // Adicionar não conformidades
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      // Filtrar selecionadas
      const selecionadas = relatorio.naoConformidades
        .filter((nc: any) => nc.selecionado)
        .map((nc: any) => {
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            id: nc.id,
            titulo: completa?.titulo || nc.titulo || "",
            descricao: completa?.descricao || nc.descricao || ""
          };
        });
      
      if (selecionadas.length > 0) {
        selecionadas.forEach((nc, index) => {
          paragrafos.push(new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ${nc.titulo}`, bold: true })
            ],
            spacing: { after: 100 }
          }));
          
          paragrafos.push(new Paragraph({
            text: nc.descricao,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 }
          }));
        });
      } else {
        paragrafos.push(new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 200 }
        }));
      }
    } else {
      paragrafos.push(new Paragraph({
        text: "Não foram identificadas não conformidades.",
        spacing: { after: 200 }
      }));
    }
    
    // 4. CONCLUSÃO
    paragrafos.push(new Paragraph({
      text: "4. CONCLUSÃO",
      heading: "Heading2",
      spacing: { before: 400, after: 200 }
    }));
    
    paragrafos.push(new Paragraph({
      text: conclusaoTexto,
      alignment: AlignmentType.JUSTIFIED
    }));
    
    // 5. PARECER FINAL
    paragrafos.push(new Paragraph({
      text: "5. PARECER FINAL",
      heading: "Heading2",
      spacing: { before: 400, after: 200 }
    }));
    
    paragrafos.push(new Paragraph({
      text: "Conforme as análises realizadas, os danos apresentados não são cobertos pela garantia do fabricante.",
      alignment: AlignmentType.JUSTIFIED
    }));
    
    // Assinatura
    paragrafos.push(new Paragraph({
      text: "Responsável Técnico",
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 }
    }));
    
    paragrafos.push(new Paragraph({
      text: relatorio.elaboradoPor || "Técnico Brasilit",
      alignment: AlignmentType.CENTER
    }));
    
    paragrafos.push(new Paragraph({
      text: "Brasilit Saint-Gobain",
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }));
    
    // Criar documento
    const doc = new Document({
      creator: "Brasilit Sistema",
      title: `Relatório de Vistoria - ${relatorio.protocolo || ""}`,
      description: "Relatório de vistoria técnica",
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 32,
              bold: true,
              font: "Arial"
            },
            paragraph: {
              spacing: { 
                before: 240, 
                after: 120 
              }
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 28,
              bold: true,
              font: "Arial"
            },
            paragraph: {
              spacing: { 
                before: 240, 
                after: 120 
              }
            }
          },
          {
            id: "Heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 26,
              bold: true,
              font: "Arial"
            },
            paragraph: {
              spacing: { 
                before: 240, 
                after: 120 
              }
            }
          },
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Arial",
              size: 24
            },
            paragraph: {
              spacing: {
                line: 360,
                before: 120,
                after: 120
              }
            }
          }
        ]
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,      // 2,5 cm = ~720 twips (padrão ABNT)
                right: 720,    // 2,5 cm = ~720 twips
                bottom: 720,   // 2,5 cm = ~720 twips
                left: 864      // 3,0 cm = ~864 twips (padrão ABNT para encadernação)
              }
            }
          },
          children: paragrafos
        }
      ]
    });
    
    // Gerar arquivo
    log("Gerando arquivo DOCX...");
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("❌ Erro na geração ultra simples:", error);
    throw error;
  }
}