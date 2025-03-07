/**
 * Gerador SIMPLIFICADO de Relatórios DOCX com formatação exata conforme PDF de referência
 * 
 * Esta versão foi desenvolvida para atender exatamente a formatação solicitada
 * de acordo com o documento PDF de referência fornecido.
 * 
 * Características:
 * - Formatação Times New Roman 12pt
 * - Espaçamento entre linhas 1,5
 * - Margens ABNT (superior, inferior e direita: 2,5cm; esquerda: 3,0cm)
 * - Espaçamento exato entre parágrafos conforme o modelo
 * - Formatação de não conformidades conforme especificado
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  convertInchesToTwip,
  LevelFormat,
  UnderlineType
} from "docx";

import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { naoConformidadesDisponiveis } from "@shared/relatorioVistoriaSchema";

// Ativação de logs detalhados para diagnóstico
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[RelatorioSimples]", ...args);
}

/**
 * Gera um documento DOCX para o relatório de vistoria técnica
 * Formatação exata conforme PDF de referência
 * 
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioSimples(relatorio: RelatorioVistoria): Promise<Blob> {
  try {
    log("Iniciando geração de relatório conforme PDF de referência");
    
    // === PREPARAÇÃO DOS TEXTOS ===
    
    // Converter não conformidades em parágrafos
    const naoConformidadesParagrafos: Paragraph[] = [];
    
    // Lista de não conformidades para a conclusão (apenas títulos)
    const naoConformidadesListaConclusao: Paragraph[] = [];
    
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
        // Adicionar cada não conformidade com a formatação exata conforme especificação
        naoConformidadesSelecionadas.forEach((nc, index) => {
          // Título da não conformidade em negrito
          naoConformidadesParagrafos.push(
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `${index + 1}. ${nc.titulo}`,
                  bold: true
                })
              ],
              spacing: { after: 240 } // 8pt = linha em branco após título
            })
          );
          
          // Texto completo da não conformidade (sem negrito, justificado)
          naoConformidadesParagrafos.push(
            new Paragraph({
              text: nc.descricao,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 } // 8pt = linha em branco após texto
            })
          );
          
          // Adicionar à lista de não conformidades para a conclusão (apenas títulos)
          naoConformidadesListaConclusao.push(
            new Paragraph({
              text: `${index + 1}. ${nc.titulo}`,
              spacing: { after: 240 }, // 8pt = linha em branco após item
              bullet: {
                level: 0
              }
            })
          );
        });
      } else {
        naoConformidadesParagrafos.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades.",
            spacing: { after: 240 }
          })
        );
        
        naoConformidadesListaConclusao.push(
          new Paragraph({
            text: "Não foram identificadas não conformidades.",
            spacing: { after: 240 }
          })
        );
      }
    } else {
      naoConformidadesParagrafos.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 240 }
        })
      );
      
      naoConformidadesListaConclusao.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 240 }
        })
      );
    }
    
    // Textos fixos com substituição de variáveis
    const introducaoTexto = `A Área de Assistência Técnica foi solicitada para atender uma reclamação
relacionada ao surgimento de infiltrações nas telhas de fibrocimento: -
Telha da marca BRASILIT modelo ${relatorio.modeloTelha} de ${relatorio.espessura}mm, produzidas com
tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem
amianto - cuja fabricação segue a norma internacional ISO 9933, bem como
as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas,
para avaliar as manifestações patológicas reclamadas em telhas de nossa
marca aplicada em sua cobertura conforme registro de reclamação
protocolo FAR ${relatorio.protocolo}.

O modelo de telha escolhido para a edificação foi: ${relatorio.modeloTelha}. Esse
modelo, como os demais, possui a necessidade de seguir rigorosamente as
orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento
e Acessórios para Telhado - Brasilit para o melhor desempenho do
produto, assim como a garantia do produto coberta por ${relatorio.anosGarantia} anos (ou ${relatorio.anosGarantiaSistemaCompleto}
anos para sistema completo).`;
    
    // Texto fixo da análise técnica
    const analiseTecnicaTexto = `Durante a visita técnica realizada no local, nossa equipe conduziu uma
vistoria minuciosa da cobertura, documentando e analisando as condições
de instalação e o estado atual das telhas. Após criteriosa avaliação das
evidências coletadas em campo, identificamos alguns desvios nos
procedimentos de manuseio e instalação em relação às especificações
técnicas do fabricante, os quais são detalhados a seguir.`;
    
    // Conclusão - sempre como IMPROCEDENTE
    const conclusaoTexto = `Com base na análise técnica realizada, foram identificadas as não conformidades listadas acima.

Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, 
finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados 
se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ${relatorio.modeloTelha} possuem ${relatorio.anosGarantiaTotal} anos de garantia 
com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, 
seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento 
e Acessórios para Telhado - Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas - ABNT, 
específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos
conforme a legislação em vigor.`;
    
    // === CRIAÇÃO DO DOCUMENTO ===
    
    // Criar o documento com configurações ABNT exatas
    const doc = new Document({
      creator: "Brasilit Assistência Técnica",
      title: `Relatório de Vistoria Técnica - ${relatorio.cliente || ""}`,
      description: "Relatório de Vistoria Técnica realizada em telhas e produtos Brasilit",
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Arial", // Utilizando Arial conforme solicitado pelo cliente
              size: 24 // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 de espaçamento (padrão ABNT)
                before: 0,
                after: 240 // 8pt de espaçamento após parágrafo (padrão especificado)
              },
              alignment: AlignmentType.JUSTIFIED
            }
          }
        ]
      },
      numbering: {
        config: [
          {
            reference: "naoConformidadesLista",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) }
                  }
                }
              }
            ]
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
          children: [
            // Título principal
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "RELATÓRIO DE VISTORIA TÉCNICA",
                  bold: true,
                  size: 24 // 12pt - mesmo tamanho do texto principal conforme especificação
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 } // Duas linhas em branco após o título
            }),
            
            // INFORMAÇÕES GERAIS (sem título numerado)
            
            // Dados do projeto
            new Paragraph({
              children: [
                new TextRun({ text: "Data de vistoria: ", bold: true }),
                new TextRun(relatorio.dataVistoria || "")
              ],
              spacing: { after: 240 } // 8pt = linha em branco após parágrafo
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cliente: ", bold: true }),
                new TextRun(relatorio.cliente || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Empreendimento: ", bold: true }),
                new TextRun(relatorio.empreendimento || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Cidade/UF: ", bold: true }),
                new TextRun(`${relatorio.cidade || ""} - ${relatorio.uf || ""}`)
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true }),
                new TextRun(relatorio.endereco || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Protocolo/FAR: ", bold: true }),
                new TextRun(relatorio.protocolo || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Assunto: ", bold: true }),
                new TextRun(relatorio.assunto || "")
              ],
              spacing: { after: 480 } // Duas linhas em branco após as informações básicas
            }),
            
            // RESPONSÁVEIS TÉCNICOS (sem numeração)
            
            // Dados dos responsáveis
            new Paragraph({
              children: [
                new TextRun({ text: "Elaborado por: ", bold: true }),
                new TextRun(relatorio.elaboradoPor || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Departamento: ", bold: true }),
                new TextRun(relatorio.departamento || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Regional: ", bold: true }),
                new TextRun(relatorio.regional || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Unidade: ", bold: true }),
                new TextRun(relatorio.unidade || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Coordenador: ", bold: true }),
                new TextRun(relatorio.coordenador || "")
              ],
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Gerente: ", bold: true }),
                new TextRun(relatorio.gerente || "")
              ],
              spacing: { after: 480 } // Duas linhas em branco após responsáveis técnicos
            }),
            
            // INTRODUÇÃO (sem numeração)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Introdução", 
                  bold: true
                })
              ],
              spacing: { before: 240, after: 240 }
            }),
            
            new Paragraph({
              text: introducaoTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Quantidade e modelo (sem subtítulo numerado)
            new Paragraph({
              children: [
                new TextRun({ text: "Quantidade e modelo: ", bold: true })
              ],
              spacing: { after: 240 }
            }),
            
            // Lista com marcadores para dados do produto
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun(`Modelo de telha: ${relatorio.modeloTelha || "Não informado"}`)
              ],
              indent: { left: convertInchesToTwip(0.5) },
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun(`Espessura: ${relatorio.espessura || "Não informada"}mm`)
              ],
              indent: { left: convertInchesToTwip(0.5) },
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun(`Quantidade: ${relatorio.quantidade ? relatorio.quantidade.toString() : "Não informada"}`)
              ],
              indent: { left: convertInchesToTwip(0.5) },
              spacing: { after: 240 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun(`Área coberta: ${relatorio.area ? relatorio.area.toString() + "m² (aproximadamente)" : "Não informada"}`)
              ],
              indent: { left: convertInchesToTwip(0.5) },
              spacing: { after: 240 }
            }),
            
            // ANÁLISE TÉCNICA (sem numeração)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Análise Técnica", 
                  bold: true
                })
              ],
              spacing: { before: 240, after: 240 }
            }),
            
            new Paragraph({
              text: analiseTecnicaTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Adicionar não conformidades
            ...naoConformidadesParagrafos,
            
            // CONCLUSÃO (sem numeração)
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Conclusão", 
                  bold: true
                })
              ],
              spacing: { before: 240, after: 240 }
            }),
            
            // Lista numerada de não conformidades (apenas títulos)
            ...naoConformidadesListaConclusao,
            
            new Paragraph({
              text: conclusaoTexto,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 240 }
            }),
            
            // Observações finais (sem título numerado)
            new Paragraph({
              text: relatorio.observacoesGerais || 
                "Este relatório foi elaborado com base na inspeção técnica realizada no local, seguindo os procedimentos padrão da Brasilit.",
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 480 } // Duas linhas em branco
            }),
            
            // Assinatura final
            new Paragraph({
              text: "Atenciosamente,",
              spacing: { after: 480 } // Duas linhas em branco
            }),
            
            new Paragraph({
              text: relatorio.elaboradoPor || "Técnico Brasilit",
              spacing: { after: 240 }
            }),
            
            new Paragraph({
              text: "Assistência Técnica Brasilit Saint-Gobain",
              spacing: { after: 240 }
            })
          ]
        }
      ]
    });
    
    // Gerar arquivo DOCX em formato blob
    log("Gerando arquivo DOCX...");
    return await Packer.toBlob(doc);
  } catch (error) {
    log("Erro ao gerar relatório:", error);
    throw new Error(`Falha ao gerar o relatório: ${error instanceof Error ? error.message : String(error)}`);
  }
}