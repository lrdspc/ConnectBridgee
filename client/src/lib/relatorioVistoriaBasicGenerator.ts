/**
 * Gerador básico de relatórios de vistoria em formato DOCX
 * Abordagem simplificada para evitar problemas de importação
 */

import { Document, Packer, Paragraph } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";

/**
 * Gera um documento DOCX simples sem formatação avançada
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaBasico(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    console.log('✅ Usando gerador BÁSICO para DOCX');
    
    // Criar parágrafos para cabeçalho
    const paragrafos: Paragraph[] = [];
    
    // Título
    paragrafos.push(new Paragraph({
      text: "RELATÓRIO DE VISTORIA TÉCNICA",
      heading: "Heading1"
    }));
    
    // Informações do cliente
    paragrafos.push(new Paragraph({ text: "IDENTIFICAÇÃO DO PROJETO", heading: "Heading2" }));
    paragrafos.push(new Paragraph({ text: `Cliente: ${relatorio.cliente || ""}` }));
    paragrafos.push(new Paragraph({ text: `Empreendimento: ${relatorio.empreendimento || ""}` }));
    paragrafos.push(new Paragraph({ text: `Endereço: ${relatorio.endereco || ""}` }));
    paragrafos.push(new Paragraph({ text: `Cidade/UF: ${relatorio.cidade || ""} - ${relatorio.uf || ""}` }));
    paragrafos.push(new Paragraph({ text: `Protocolo: ${relatorio.protocolo || ""}` }));
    paragrafos.push(new Paragraph({ text: `Data da vistoria: ${relatorio.dataVistoria || ""}` }));
    
    // Responsáveis técnicos
    paragrafos.push(new Paragraph({ text: "RESPONSÁVEIS TÉCNICOS", heading: "Heading2" }));
    paragrafos.push(new Paragraph({ text: `Elaborado por: ${relatorio.elaboradoPor || ""}` }));
    paragrafos.push(new Paragraph({ text: `Departamento: ${relatorio.departamento || ""}` }));
    paragrafos.push(new Paragraph({ text: `Unidade: ${relatorio.unidade || ""}` }));
    
    // Introdução
    paragrafos.push(new Paragraph({ text: "1. INTRODUÇÃO", heading: "Heading2" }));
    paragrafos.push(new Paragraph({ 
      text: `A Brasilit foi contatada para analisar telhas ${relatorio.modeloTelha} ${relatorio.espessura}mm em ${relatorio.cliente}.` 
    }));
    
    // Dados do produto
    paragrafos.push(new Paragraph({ text: "1.1 DADOS DO PRODUTO", heading: "Heading3" }));
    paragrafos.push(new Paragraph({ text: `Modelo: ${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS` }));
    paragrafos.push(new Paragraph({ text: `Quantidade: ${relatorio.quantidade || ""}` }));
    paragrafos.push(new Paragraph({ text: `Área coberta: ${relatorio.area || ""}m² (aproximadamente)` }));
    
    // Análise Técnica
    paragrafos.push(new Paragraph({ text: "2. ANÁLISE TÉCNICA", heading: "Heading2" }));
    paragrafos.push(new Paragraph({ 
      text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma análise detalhada das telhas instaladas e seu sistema de fixação." 
    }));
    
    // Não conformidades
    paragrafos.push(new Paragraph({ text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS", heading: "Heading3" }));
    
    // Listar não conformidades selecionadas
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      const selecionadas = relatorio.naoConformidades.filter((nc: any) => nc.selecionado);
      
      if (selecionadas.length > 0) {
        selecionadas.forEach((nc: any, index: number) => {
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          paragrafos.push(new Paragraph({ 
            text: `${index + 1}. ${completa?.titulo || nc.titulo || ""}` 
          }));
          paragrafos.push(new Paragraph({ 
            text: `${completa?.descricao || nc.descricao || ""}` 
          }));
        });
      } else {
        paragrafos.push(new Paragraph({ 
          text: "Não foram identificadas não conformidades." 
        }));
      }
    } else {
      paragrafos.push(new Paragraph({ 
        text: "Não foram identificadas não conformidades." 
      }));
    }
    
    // Conclusão
    paragrafos.push(new Paragraph({ text: "3. CONCLUSÃO", heading: "Heading2" }));
    paragrafos.push(new Paragraph({ 
      text: `Com base na análise técnica realizada, concluímos que a reclamação é IMPROCEDENTE.` 
    }));
    paragrafos.push(new Paragraph({ 
      text: `Período de garantia total: ${relatorio.anosGarantiaTotal} anos.` 
    }));
    
    // Assinatura
    paragrafos.push(new Paragraph({ text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda." }));
    paragrafos.push(new Paragraph({ text: "Departamento de Assistência Técnica" }));
    paragrafos.push(new Paragraph({ text: relatorio.elaboradoPor || "" }));
    paragrafos.push(new Paragraph({ text: `CREA/CAU ${relatorio.numeroRegistro || ""}` }));

    // Criar documento
    const doc = new Document({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica",
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
          children: paragrafos
        }
      ]
    });
    
    // Gerar arquivo
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Erro no gerador básico:", error);
    throw new Error(`Falha no gerador de documento básico: ${error}`);
  }
}