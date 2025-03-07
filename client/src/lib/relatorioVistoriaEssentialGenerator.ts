/**
 * Gerador minimalista de relatórios de vistoria em formato DOCX (implementação simplificada)
 * Usa a biblioteca docx diretamente, sem dependências complexas
 */

import { Document, Packer, Paragraph, AlignmentType, BorderStyle } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

/**
 * Gera um documento DOCX minimalista sem fotos ou tabelas
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaMinimal(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    console.log('✅ Usando gerador minimalista para DOCX com formatação ABNT [ESSENCIAL]');
    
    // Gerar textos a partir dos templates
    const introducaoTexto = aplicarTemplateIntroducao({
      modeloTelha: relatorio.modeloTelha,
      espessura: relatorio.espessura,
      protocolo: relatorio.protocolo,
      anosGarantia: relatorio.anosGarantia,
      anosGarantiaSistemaCompleto: relatorio.anosGarantiaSistemaCompleto
    });
    
    // Conclusão - sempre usando IMPROCEDENTE 
    const conclusaoTexto = aplicarTemplateConclusao({
      resultado: "IMPROCEDENTE",
      modeloTelha: relatorio.modeloTelha,
      anosGarantiaTotal: relatorio.anosGarantiaTotal
    });

    // Criar um documento simples com formatação mínima
    const doc = new Document({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica realizada em telhas e produtos Brasilit [ABNT]",
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 24, // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 espaçamento entre linhas (ABNT)
              },
            }
          }
        }
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,     // 2,5 cm (ABNT)
                right: 720,   // 2,5 cm (ABNT)
                bottom: 720,  // 2,5 cm (ABNT)
                left: 864     // 3,0 cm (ABNT para encadernação)
              }
            }
          },
          children: [
            // Título
            new Paragraph({
              text: "RELATÓRIO DE VISTORIA TÉCNICA [VERSÃO ABNT]", 
              heading: "Heading1",
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              border: {
                bottom: { color: "000000", size: 10, space: 1, style: BorderStyle.SINGLE }
              }
            }),
            
            // Informações do cliente
            new Paragraph({
              text: "IDENTIFICAÇÃO DO PROJETO",
              heading: "Heading2",
              spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
              text: `Cliente: ${relatorio.cliente || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Empreendimento: ${relatorio.empreendimento || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Endereço: ${relatorio.endereco || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Cidade/UF: ${relatorio.cidade || ""} - ${relatorio.uf || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Protocolo: ${relatorio.protocolo || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Data da vistoria: ${relatorio.dataVistoria || ""}`,
              spacing: { after: 240 }
            }),
            
            // Responsáveis técnicos
            new Paragraph({
              text: "RESPONSÁVEIS TÉCNICOS",
              heading: "Heading2",
              spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
              text: `Elaborado por: ${relatorio.elaboradoPor || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Departamento: ${relatorio.departamento || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Unidade: ${relatorio.unidade || ""}`,
              spacing: { after: 240 }
            }),
            
            // Introdução
            new Paragraph({
              text: "1. INTRODUÇÃO",
              heading: "Heading2",
              spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
              text: introducaoTexto,
              spacing: { after: 240 }
            }),
            
            // Dados do produto
            new Paragraph({
              text: "1.1 DADOS DO PRODUTO",
              heading: "Heading3",
              spacing: { before: 200, after: 200 }
            }),
            
            new Paragraph({
              text: `Modelo: ${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Quantidade: ${relatorio.quantidade || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `Área coberta: ${relatorio.area || ""}m² (aproximadamente)`,
              spacing: { after: 240 }
            }),
            
            // Análise técnica
            new Paragraph({
              text: "2. ANÁLISE TÉCNICA",
              heading: "Heading2",
              spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
              text: TEMPLATE_ANALISE_TECNICA,
              spacing: { after: 240 }
            }),
            
            // Não conformidades
            new Paragraph({
              text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS",
              heading: "Heading3",
              spacing: { before: 200, after: 200 }
            }),
            
            ...(relatorio.naoConformidades?.filter((nc: any) => nc.selecionado).length > 0 
              ? relatorio.naoConformidades
                  .filter((nc: any) => nc.selecionado)
                  .map((nc: any, index: number) => {
                    const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
                    return [
                      new Paragraph({
                        text: `${index + 1}. ${completa?.titulo || nc.titulo || ""}`,
                        spacing: { after: 120 },
                        bullet: { level: 0 }
                      }),
                      new Paragraph({
                        text: completa?.descricao || nc.descricao || "",
                        spacing: { after: 200 }
                      })
                    ];
                  }).flat()
              : [new Paragraph({
                  text: "Não foram identificadas não conformidades.",
                  spacing: { after: 240 }
                })]),
            
            // Conclusão
            new Paragraph({
              text: "3. CONCLUSÃO",
              heading: "Heading2",
              spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
              text: conclusaoTexto,
              spacing: { after: 240 }
            }),
            
            // Assinatura
            new Paragraph({
              text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
              spacing: { before: 400, after: 120 }
            }),
            
            new Paragraph({
              text: "Divisão Produtos Para Construção",
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: "Departamento de Assistência Técnica",
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              text: relatorio.elaboradoPor || "",
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `${relatorio.departamento || ""} - ${relatorio.unidade || ""}`,
              spacing: { after: 120 }
            }),
            
            new Paragraph({
              text: `CREA/CAU ${relatorio.numeroRegistro || ""}`,
              spacing: { after: 120 }
            }),
          ]
        }
      ]
    });

    // Gerar blob do documento
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Erro no gerador minimalista:", error);
    throw new Error(`Falha no gerador de documento essencial: ${error}`);
  }
}