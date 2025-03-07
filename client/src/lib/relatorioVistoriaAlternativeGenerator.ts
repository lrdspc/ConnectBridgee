/**
 * Gerador alternativo de relatórios de vistoria em formato DOCX
 * Usa abordagem simplificada para evitar problemas com a biblioteca docx
 */

import { Document, Packer, Paragraph } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";
import { TEMPLATE_ANALISE_TECNICA } from '@/lib/relatorioVistoriaTemplates';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao } from '@/lib/relatorioVistoriaTemplates';

/**
 * Gera um documento DOCX essencial sem fotos
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaAlternativo(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    console.log('✅ Usando gerador ALTERNATIVO para DOCX com formatação ABNT');
    
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

    // Criar parágrafos para não conformidades
    const naoConformidadesParags: Paragraph[] = [];
    
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      // Filtrar apenas as selecionadas
      const naoConformidadesSelecionadas = relatorio.naoConformidades
        .filter((nc: any) => nc.selecionado)
        .map((nc: any) => {
          // Buscar a descrição completa da não conformidade
          const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
          return {
            id: nc.id,
            titulo: completa?.titulo || nc.titulo || "",
            descricao: completa?.descricao || nc.descricao || ""
          };
        });
      
      if (naoConformidadesSelecionadas.length > 0) {
        // Adicionar cada uma como um parágrafo separado
        naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
          naoConformidadesParags.push(
            new Paragraph({
              text: `${index + 1}. ${nc.titulo}`
            })
          );
          
          naoConformidadesParags.push(
            new Paragraph({
              text: nc.descricao
            })
          );
        });
      } else {
        naoConformidadesParags.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades."
          })
        );
      }
    } else {
      naoConformidadesParags.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades."
        })
      );
    }

    // Criar um documento simples com formatação mínima
    const doc = new Document({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "RELATÓRIO DE VISTORIA TÉCNICA", heading: "Heading1" }),
            
            new Paragraph({ text: "IDENTIFICAÇÃO DO PROJETO", heading: "Heading2" }),
            new Paragraph({ text: `Cliente: ${relatorio.cliente || ""}` }),
            new Paragraph({ text: `Empreendimento: ${relatorio.empreendimento || ""}` }),
            new Paragraph({ text: `Endereço: ${relatorio.endereco || ""}` }),
            new Paragraph({ text: `Cidade/UF: ${relatorio.cidade || ""} - ${relatorio.uf || ""}` }),
            new Paragraph({ text: `Protocolo: ${relatorio.protocolo || ""}` }),
            new Paragraph({ text: `Data da vistoria: ${relatorio.dataVistoria || ""}` }),
            
            new Paragraph({ text: "RESPONSÁVEIS TÉCNICOS", heading: "Heading2" }),
            new Paragraph({ text: `Elaborado por: ${relatorio.elaboradoPor || ""}` }),
            new Paragraph({ text: `Departamento: ${relatorio.departamento || ""}` }),
            new Paragraph({ text: `Unidade: ${relatorio.unidade || ""}` }),
            
            new Paragraph({ text: "1. INTRODUÇÃO", heading: "Heading2" }),
            new Paragraph({ text: introducaoTexto }),
            
            new Paragraph({ text: "1.1 DADOS DO PRODUTO", heading: "Heading3" }),
            new Paragraph({ text: `Modelo: ${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS` }),
            new Paragraph({ text: `Quantidade: ${relatorio.quantidade || ""}` }),
            new Paragraph({ text: `Área coberta: ${relatorio.area || ""}m² (aproximadamente)` }),
            
            new Paragraph({ text: "2. ANÁLISE TÉCNICA", heading: "Heading2" }),
            new Paragraph({ text: TEMPLATE_ANALISE_TECNICA }),
            
            new Paragraph({ text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS", heading: "Heading3" }),
            ...naoConformidadesParags,
            
            new Paragraph({ text: "3. CONCLUSÃO", heading: "Heading2" }),
            new Paragraph({ text: conclusaoTexto }),
            
            new Paragraph({ text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda." }),
            new Paragraph({ text: "Divisão Produtos Para Construção" }),
            new Paragraph({ text: "Departamento de Assistência Técnica" }),
            
            new Paragraph({ text: relatorio.elaboradoPor || "" }),
            new Paragraph({ text: `${relatorio.departamento || ""} - ${relatorio.unidade || ""}` }),
            new Paragraph({ text: `CREA/CAU ${relatorio.numeroRegistro || ""}` }),
          ]
        }
      ]
    });

    // Gerar blob do documento
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Erro no gerador alternativo:", error);
    throw new Error(`Falha no gerador de documento alternativo: ${error}`);
  }
}