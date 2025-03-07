/**
 * Gerador básico de relatórios DOCX
 * Implementação simplificada e confiável usando o mínimo de recursos da biblioteca docx
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun,
  Header, 
  Footer, 
  AlignmentType,
  HeadingLevel
} from "docx";

import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";

// Ativa logs para diagnóstico
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[BasicReport]", ...args);
}

/**
 * Gera um documento DOCX básico, sem formatação avançada
 * Usa o mínimo de recursos da biblioteca para garantir compatibilidade
 */
export async function gerarRelatorioBasico(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    log("Gerando relatório básico...");
    
    // Criar documento com configuração mínima
    const doc = new Document({
      title: "Relatório de Vistoria Técnica",
      creator: "Brasilit",
      description: "Relatório de vistoria técnica para produtos Brasilit",
      sections: [
        {
          children: [
            // Título
            new Paragraph({
              text: "RELATÓRIO DE VISTORIA TÉCNICA",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER
            }),
            
            // Informações gerais
            new Paragraph({
              text: `Data: ${relatorio.dataVistoria || ""}`,
              spacing: { before: 200, after: 200 }
            }),
            new Paragraph({
              text: `Cliente: ${relatorio.cliente || ""}`,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: `Protocolo: ${relatorio.protocolo || ""}`,
              spacing: { after: 200 }
            }),
            
            // Introdução
            new Paragraph({
              text: "1. INTRODUÇÃO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento."
            }),
            
            // Análise Técnica
            new Paragraph({
              text: "2. ANÁLISE TÉCNICA",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação."
            }),
            
            // Não conformidades
            ...(relatorio.naoConformidades?.filter(nc => nc.selecionado).map((nc, index) => 
              new Paragraph({
                text: `${index + 1}. ${nc.titulo || "Não conformidade"}`,
                spacing: { before: 200, after: 100 }
              })
            ) || []),
            
            // Conclusão
            new Paragraph({
              text: "3. CONCLUSÃO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "Finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material."
            }),
            
            // Assinatura
            new Paragraph({
              text: `Elaborado por: ${relatorio.elaboradoPor || ""}`,
              spacing: { before: 600, after: 200 }
            })
          ]
        }
      ]
    });
    
    // Gerar arquivo de forma básica, garantindo compatibilidade
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { 
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    
    log("Documento gerado com sucesso");
    return blob;
  } catch (error) {
    console.error("Erro ao gerar relatório básico:", error);
    throw new Error(`Falha ao gerar relatório básico: ${error}`);
  }
}