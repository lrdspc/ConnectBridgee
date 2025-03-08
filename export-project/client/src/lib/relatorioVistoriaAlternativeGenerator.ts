/**
 * Gerador alternativo de relatórios de vistoria em formato DOCX
 * Usa abordagem simplificada para evitar problemas com a biblioteca docx
 */

import { 
  Document as DocxDocument, 
  Packer as DocxPacker, 
  Paragraph as DocxParagraph,
  AlignmentType
} from "docx";
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
    const naoConformidadesParags: DocxParagraph[] = [];
    
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
            new DocxParagraph({
              text: `${index + 1}. ${nc.titulo}`
            })
          );
          
          naoConformidadesParags.push(
            new DocxParagraph({
              text: nc.descricao
            })
          );
        });
      } else {
        naoConformidadesParags.push(
          new DocxParagraph({
            text: "Não foram identificadas não conformidades."
          })
        );
      }
    } else {
      naoConformidadesParags.push(
        new DocxParagraph({
          text: "Não foram identificadas não conformidades."
        })
      );
    }

    // Criar um documento simples com formatação mínima
    const doc = new DocxDocument({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      sections: [
        {
          properties: {},
          children: [
            new DocxParagraph({ text: "RELATÓRIO DE VISTORIA TÉCNICA", heading: "Heading1" }),
            
            new DocxParagraph({ text: "IDENTIFICAÇÃO DO PROJETO", heading: "Heading2" }),
            new DocxParagraph({ text: `Cliente: ${relatorio.cliente || ""}` }),
            new DocxParagraph({ text: `Empreendimento: ${relatorio.empreendimento || ""}` }),
            new DocxParagraph({ text: `Endereço: ${relatorio.endereco || ""}` }),
            new DocxParagraph({ text: `Cidade/UF: ${relatorio.cidade || ""} - ${relatorio.uf || ""}` }),
            new DocxParagraph({ text: `Protocolo: ${relatorio.protocolo || ""}` }),
            new DocxParagraph({ text: `Data da vistoria: ${relatorio.dataVistoria || ""}` }),
            
            new DocxParagraph({ text: "RESPONSÁVEIS TÉCNICOS", heading: "Heading2" }),
            new DocxParagraph({ text: `Elaborado por: ${relatorio.elaboradoPor || ""}` }),
            new DocxParagraph({ text: `Departamento: ${relatorio.departamento || ""}` }),
            new DocxParagraph({ text: `Unidade: ${relatorio.unidade || ""}` }),
            
            new DocxParagraph({ text: "1. INTRODUÇÃO", heading: "Heading2" }),
            new DocxParagraph({ text: introducaoTexto }),
            
            new DocxParagraph({ text: "1.1 DADOS DO PRODUTO", heading: "Heading3" }),
            new DocxParagraph({ text: `Modelo: ${relatorio.modeloTelha || ""} ${relatorio.espessura || ""}mm CRFS` }),
            new DocxParagraph({ text: `Quantidade: ${relatorio.quantidade || ""}` }),
            new DocxParagraph({ text: `Área coberta: ${relatorio.area || ""}m² (aproximadamente)` }),
            
            new DocxParagraph({ text: "2. ANÁLISE TÉCNICA", heading: "Heading2" }),
            new DocxParagraph({ text: TEMPLATE_ANALISE_TECNICA }),
            
            new DocxParagraph({ text: "2.1 NÃO CONFORMIDADES IDENTIFICADAS", heading: "Heading3" }),
            ...naoConformidadesParags,
            
            new DocxParagraph({ text: "3. CONCLUSÃO", heading: "Heading2" }),
            new DocxParagraph({ text: conclusaoTexto }),
            
            new DocxParagraph({ text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda." }),
            new DocxParagraph({ text: "Divisão Produtos Para Construção" }),
            new DocxParagraph({ text: "Departamento de Assistência Técnica" }),
            
            new DocxParagraph({ text: relatorio.elaboradoPor || "" }),
            new DocxParagraph({ text: `${relatorio.departamento || ""} - ${relatorio.unidade || ""}` }),
            new DocxParagraph({ text: `CREA/CAU ${relatorio.numeroRegistro || ""}` }),
          ]
        }
      ]
    });

    // Gerar blob do documento
    return await DocxPacker.toBlob(doc);
  } catch (error) {
    console.error("Erro no gerador alternativo:", error);
    throw new Error(`Falha no gerador de documento alternativo: ${error}`);
  }
}