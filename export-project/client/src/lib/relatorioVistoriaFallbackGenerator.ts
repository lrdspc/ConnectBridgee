/**
 * Gerador de relatórios de vistoria em formato HTML
 * Como solução de emergência quando os métodos DOCX falham
 */

import { saveAs } from 'file-saver';
import { RelatorioVistoria } from '@shared/relatorioVistoriaSchema';
import { aplicarTemplateIntroducao, aplicarTemplateConclusao, TEMPLATE_ANALISE_TECNICA } from './relatorioVistoriaTemplates';

// Interface estendida para compatibilidade
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

/**
 * Gera um arquivo HTML como solução de emergência quando DOCX falha
 * @param relatorio Dados do relatório de vistoria
 * @returns Promise<void> - Não retorna um Blob, salva diretamente
 */
export async function gerarRelatorioVistoriaHTML(relatorio: ExtendedRelatorioVistoria): Promise<void> {
  try {
    console.log('Iniciando geração de documento HTML como fallback');
    
    // Garantir que o resultado é sempre IMPROCEDENTE
    relatorio.resultado = "IMPROCEDENTE";
    
    // Gerar textos a partir dos templates
    const introducaoTexto = aplicarTemplateIntroducao({
      modeloTelha: relatorio.modeloTelha,
      espessura: relatorio.espessura,
      protocolo: relatorio.protocolo,
      anosGarantia: relatorio.anosGarantia,
      anosGarantiaSistemaCompleto: relatorio.anosGarantiaSistemaCompleto
    });
    
    const conclusaoTexto = aplicarTemplateConclusao({
      resultado: "IMPROCEDENTE",
      modeloTelha: relatorio.modeloTelha,
      anosGarantiaTotal: relatorio.anosGarantiaTotal
    });
    
    // Filtrar não conformidades selecionadas
    const naoConformidadesSelecionadas = relatorio.naoConformidades
      .filter((nc: any) => nc.selecionado)
      .map((nc: any) => {
        const completa = relatorio.naoConformidadesDisponiveis?.find((item: any) => item.id === nc.id) || 
          { titulo: nc.titulo || '', descricao: nc.descricao || '' };
        return {
          titulo: completa.titulo || nc.titulo || '',
          descricao: completa.descricao || nc.descricao || ''
        };
      });
    
    // Montar a lista de não conformidades com descrições completas (para a seção 2.1)
    const listaNaoConformidades = naoConformidadesSelecionadas.length > 0
      ? `<ul>${naoConformidadesSelecionadas.map((nc: any) => 
          `<li>
            <strong>${nc.titulo}</strong>
            <p style="margin-left: 20px; margin-top: 5px; margin-bottom: 15px;">${nc.descricao}</p>
          </li>`).join('')}</ul>`
      : '<p>Não foram identificadas não conformidades.</p>';
      
    // Montar a lista de não conformidades apenas com títulos (para a conclusão)
    const listaNaoConformidadesTitulos = naoConformidadesSelecionadas.length > 0
      ? `<ul>${naoConformidadesSelecionadas.map((nc: any) => 
          `<li>
            <strong>${nc.titulo}</strong>
          </li>`).join('')}</ul>`
      : '<p>Não foram identificadas não conformidades.</p>';
    
    // Preparar HTML para fotos
    let fotosHTML = '';
    if (relatorio.fotos && relatorio.fotos.length > 0) {
      fotosHTML = `
        <h2>ANEXO: REGISTRO FOTOGRÁFICO</h2>
        <div style="display: block; width: 100%;">
          ${relatorio.fotos.map((foto: any, index: number) => `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <img src="${foto.dataUrl}" style="width: 100%; max-width: 500px; height: auto; object-fit: contain;" />
              <p><strong>Imagem ${index + 1}:</strong> ${foto.descricao || 'Sem descrição'}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Construir o HTML completo para o documento
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Vistoria - ${relatorio.protocolo || 'Novo'}</title>
        <style>
          @media print {
            body { 
              font-family: 'Times New Roman', Times, serif;
              font-size: 12pt;
              line-height: 1.5;
              margin: 2.5cm 2.5cm 2.5cm 3cm;
            }
            h1, h2, h3 { 
              break-after: avoid;
            }
            table, figure, img { 
              page-break-inside: avoid; 
            }
            img { max-width: 100% !important; }
          }
          
          body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 12pt; 
            line-height: 1.5;
            margin: 20px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          }
          h1, h2, h3 { 
            font-weight: bold; 
            margin-top: 20px;
            margin-bottom: 10px;
          }
          h1 { font-size: 16pt; text-align: center; }
          h2 { font-size: 14pt; margin-top: 15px; }
          h3 { font-size: 12pt; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
          }
          td { 
            padding: 8px; 
            border: 1px solid #ddd; 
          }
          .td-header {
            font-weight: bold;
            width: 40%;
          }
          p { margin: 10px 0; text-align: justify; }
          ul { margin-left: 20px; }
          li { margin-bottom: 10px; }
          .signature {
            margin-top: 50px;
            border-top: 1px solid #000;
            width: 60%;
            padding-top: 10px;
            font-weight: bold;
          }
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .print-button:hover {
            background-color: #0052a3;
          }
          @media print {
            .print-button { 
              display: none; 
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">Imprimir</button>
        
        <h1>RELATÓRIO DE VISTORIA TÉCNICA</h1>
        
        <h2>IDENTIFICAÇÃO DO PROJETO</h2>
        <table>
          <tr>
            <td class="td-header">Protocolo/FAR:</td>
            <td>${relatorio.protocolo || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Data de vistoria:</td>
            <td>${relatorio.dataVistoria || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Cliente:</td>
            <td>${relatorio.cliente || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Empreendimento:</td>
            <td>${relatorio.empreendimento || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Endereço:</td>
            <td>${relatorio.endereco || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Cidade/UF:</td>
            <td>${relatorio.cidade || ''} - ${relatorio.uf || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Assunto:</td>
            <td>${relatorio.assunto || ''}</td>
          </tr>
        </table>
        
        <h2>RESPONSÁVEIS TÉCNICOS</h2>
        <table>
          <tr>
            <td class="td-header">Elaborado por:</td>
            <td>${relatorio.elaboradoPor || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Departamento:</td>
            <td>${relatorio.departamento || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Unidade:</td>
            <td>${relatorio.unidade || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Coordenador:</td>
            <td>${relatorio.coordenador || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Gerente:</td>
            <td>${relatorio.gerente || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Regional:</td>
            <td>${relatorio.regional || ''}</td>
          </tr>
        </table>
        
        <h2>1. INTRODUÇÃO</h2>
        <p>${introducaoTexto || ''}</p>
        
        <h3>1.1 DADOS DO PRODUTO</h3>
        <table>
          <tr>
            <td class="td-header">Quantidade:</td>
            <td>${relatorio.quantidade || ''}</td>
          </tr>
          <tr>
            <td class="td-header">Modelo:</td>
            <td>${relatorio.modeloTelha || ''} ${relatorio.espessura || ''}mm CRFS</td>
          </tr>
          <tr>
            <td class="td-header">Área coberta:</td>
            <td>${relatorio.area || ''}m² (aproximadamente)</td>
          </tr>
        </table>
        
        <h2>2. ANÁLISE TÉCNICA</h2>
        <p>${TEMPLATE_ANALISE_TECNICA || ''}</p>
        
        <h3>2.1 NÃO CONFORMIDADES IDENTIFICADAS</h3>
        ${listaNaoConformidades}
        
        <h2>3. CONCLUSÃO</h2>
        <p>Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:</p>
        ${listaNaoConformidadesTitulos}
        <p>${conclusaoTexto || ''}</p>
        
        <p>${relatorio.recomendacao || ''}</p>
        
        <p>Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.</p>
        
        <p>Atenciosamente,</p>
        
        <p><strong>Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.</strong><br>
        <strong>Divisão Produtos Para Construção</strong><br>
        <strong>Departamento de Assistência Técnica</strong></p>
        
        <div class="signature">
          ${relatorio.elaboradoPor || ''}<br>
          ${relatorio.departamento || ''} - ${relatorio.unidade || ''}<br>
          CREA/CAU ${relatorio.numeroRegistro || ''}
        </div>
        
        ${fotosHTML}
        
        <script>
          // Auto print em 2 segundos para facilitar a experiência do usuário
          setTimeout(function() {
            window.print();
          }, 2000);
        </script>
      </body>
      </html>
    `;
    
    // Criar um Blob com o HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    
    // Salvar como arquivo HTML
    saveAs(blob, `relatorio-${relatorio.protocolo || 'vistoria'}.html`);
    
    console.log('Documento HTML gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar documento HTML:', error);
    throw new Error(`Não foi possível gerar o documento HTML: ${error}`);
  }
}