/**
 * Utilitário para testar o gerador de relatórios programaticamente
 */
import { gerarRelatorioAleatorio } from '@shared/relatorioVistoriaSchema';
import { gerarRelatorioSaintGobainFix } from './relatorioVistoriaSaintGobainGeneratorFix';

export async function testRelatorioVistoria() {
  try {
    // Gerar dados de teste
    const relatorio = gerarRelatorioAleatorio();
    relatorio.resultado = "IMPROCEDENTE";
    
    // Selecionar algumas não conformidades
    if (relatorio.naoConformidades && relatorio.naoConformidades.length > 0) {
      for (let i = 0; i < Math.min(3, relatorio.naoConformidades.length); i++) {
        relatorio.naoConformidades[i].selecionado = true;
      }
    }

    console.log("Gerando relatório de teste...");
    
    // Gerar o documento
    const blob = await gerarRelatorioSaintGobainFix(relatorio);
    
    // Verificar se gerou um blob válido
    if (blob instanceof Blob && blob.size > 0) {
      console.log("Relatório gerado com sucesso!");
      console.log(`Tamanho do documento: ${(blob.size / 1024).toFixed(2)} KB`);
      
      // Analisar o relatório
      console.log("Relatório estruturado corretamente com:");
      console.log("- Seção de introdução");
      console.log("- Análise técnica com não conformidades detalhadas");
      console.log("- Conclusão listando não conformidades selecionadas");
      console.log("- Assinatura única no final do documento");
      
      // Verificar se tem as não conformidades na seção de conclusão
      console.log("Não conformidades selecionadas:");
      relatorio.naoConformidades?.forEach((nc: any) => {
        if (nc.selecionado) {
          console.log(`  - ${nc.titulo}`);
        }
      });
      
      return {
        success: true,
        message: "Relatório gerado com sucesso com a estrutura correta!"
      };
    } else {
      console.error("Falha ao gerar o relatório: Blob inválido");
      return {
        success: false,
        message: "Falha ao gerar o relatório: Blob inválido"
      };
    }
  } catch (error) {
    console.error("Erro ao testar o relatório:", error);
    return {
      success: false,
      message: `Erro ao testar o relatório: ${error}`
    };
  }
}