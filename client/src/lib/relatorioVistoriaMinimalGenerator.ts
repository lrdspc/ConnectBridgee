/**
 * Gerador minimalista de relatórios de vistoria em formato DOCX
 * Usa a biblioteca docx diretamente, sem dependências complexas
 */

import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";

// Logs para debug
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[MinimalGenerator]", ...args);
}

// Interface estendida para compatibilidade
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

/**
 * Gera um documento DOCX minimalista sem fotos ou tabelas
 * @param relatorio Dados do relatório de vistoria
 * @returns Blob do documento DOCX gerado
 */
export async function gerarRelatorioVistoriaMinimal(relatorio: ExtendedRelatorioVistoria): Promise<Blob> {
  try {
    console.log('Usando gerador minimalista para DOCX');
    
    // Criar um documento simples sem elementos complexos
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "RELATÓRIO DE VISTORIA TÉCNICA",
                  bold: true,
                  size: 32 // 16pt
                })
              ]
            }),
            
            new Paragraph({
              text: "",
              spacing: { before: 400, after: 400 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Protocolo: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.protocolo || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Data: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.dataVistoria || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cliente: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.cliente || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Empreendimento: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.empreendimento || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Endereço: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.endereco || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cidade/UF: ",
                  bold: true
                }),
                new TextRun({
                  text: `${relatorio.cidade || ""} - ${relatorio.uf || ""}`
                })
              ]
            }),
            
            new Paragraph({
              text: "",
              spacing: { before: 400, after: 400 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "DADOS DO RESPONSÁVEL",
                  bold: true,
                  size: 28 // 14pt
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Elaborado por: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.elaboradoPor || ""
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Departamento: ",
                  bold: true
                }),
                new TextRun({
                  text: relatorio.departamento || ""
                })
              ]
            }),
            
            new Paragraph({
              text: "",
              spacing: { before: 400, after: 400 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "NÃO CONFORMIDADES",
                  bold: true,
                  size: 28 // 14pt
                })
              ]
            })
          ]
        }
      ]
    });
    
    // Não podemos acessar as sections após a criação, então adicionamos
    // todos os conteúdos adicionais na criação inicial
    
    // Usar os children que já criamos
    // Inspecionar para debug
    log("Documento criado:", doc);
    
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      // Filtrar apenas as selecionadas
      const naoConformidadesSelecionadas = relatorio.naoConformidades
        .filter((nc: any) => nc.selecionado);
      
      // Adicionar cada uma como um parágrafo separado
      naoConformidadesSelecionadas.forEach((nc: any, index: number) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${nc.titulo || ""}`,
                bold: true
              })
            ]
          })
        );
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: nc.descricao || ""
              })
            ],
            spacing: { after: 300 }
          })
        );
      });
    } else {
      // Se não houver não conformidades
      children.push(
        new Paragraph({
          text: "Não foram identificadas não conformidades.",
          spacing: { after: 300 }
        })
      );
    }
    
    // Conclusão
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "CONCLUSÃO",
            bold: true,
            size: 28 // 14pt
          })
        ],
        spacing: { before: 400, after: 200 }
      })
    );
    
    children.push(
      new Paragraph({
        text: relatorio.conclusao || ""
      })
    );
    
    children.push(
      new Paragraph({
        text: "",
        spacing: { before: 400, after: 400 }
      })
    );
    
    children.push(
      new Paragraph({
        text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda."
      })
    );
    
    children.push(
      new Paragraph({
        text: "Divisão Produtos Para Construção"
      })
    );
    
    children.push(
      new Paragraph({
        text: "Departamento de Assistência Técnica"
      })
    );
    
    // Gerar o documento como blob
    const blob = await Packer.toBlob(doc);
    console.log('Documento DOCX gerado com sucesso!');
    return blob;
    
  } catch (error) {
    console.error('Erro ao gerar documento DOCX minimalista:', error);
    throw new Error(`Não foi possível gerar o documento DOCX: ${error}`);
  }
}