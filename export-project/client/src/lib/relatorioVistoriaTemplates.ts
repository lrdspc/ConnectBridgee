/**
 * Templates de texto para o Relatório de Vistoria Técnica
 * Estes textos são fixos e serão usados na geração do relatório,
 * substituindo os campos de texto livre no formulário.
 */

export const TEMPLATE_INTRODUCAO = `A Área de Assistência Técnica foi solicitada para atender uma reclamação
relacionada ao surgimento de infiltrações nas telhas de fibrocimento: -
Telha da marca BRASILIT modelo {modeloTelha} de {espessura}mm, produzidas com
tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem
amianto - cuja fabricação segue a norma internacional ISO 9933, bem como
as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas,
para avaliar as manifestações patológicas reclamadas em telhas de nossa
marca aplicada em sua cobertura conforme registro de reclamação
protocolo FAR {protocolo}.

O modelo de telha escolhido para a edificação foi: {modeloTelha}. Esse
modelo, como os demais, possui a necessidade de seguir rigorosamente as
orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento
e Acessórios para Telhado - Brasilit para o melhor desempenho do
produto, assim como a garantia do produto coberta por {anosGarantia} anos (ou {anosGarantiaSistemaCompleto}
anos para sistema completo).`;

export const TEMPLATE_ANALISE_TECNICA = `Durante a visita técnica realizada no local, nossa equipe conduziu uma
vistoria minuciosa da cobertura, documentando e analisando as condições
de instalação e o estado atual das telhas. Após criteriosa avaliação das
evidências coletadas em campo, identificamos alguns desvios nos
procedimentos de manuseio e instalação em relação às especificações
técnicas do fabricante, os quais são detalhados a seguir.`;

export const TEMPLATE_CONCLUSAO = `Com base na análise técnica realizada, foram identificadas as não conformidades listadas acima.

Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, 
finalizamos o atendimento considerando a reclamação como {resultado}, onde os problemas reclamados 
se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO {modeloTelha} possuem {anosGarantiaTotal} anos de garantia 
com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, 
seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento 
e Acessórios para Telhado - Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas - ABNT, 
específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos
conforme a legislação em vigor.`;

// Função para substituir as variáveis no template
export function aplicarTemplateIntroducao(dados: {
  modeloTelha: string;
  espessura: string;
  protocolo: string;
  anosGarantia: string;
  anosGarantiaSistemaCompleto: string;
}): string {
  let texto = TEMPLATE_INTRODUCAO;
  
  texto = texto.replace(/{modeloTelha}/g, dados.modeloTelha);
  texto = texto.replace(/{espessura}/g, dados.espessura);
  texto = texto.replace(/{protocolo}/g, dados.protocolo);
  texto = texto.replace(/{anosGarantia}/g, dados.anosGarantia);
  texto = texto.replace(/{anosGarantiaSistemaCompleto}/g, dados.anosGarantiaSistemaCompleto);
  
  return texto;
}

// Função para substituir as variáveis no template de conclusão
export function aplicarTemplateConclusao(dados: {
  resultado: string;
  modeloTelha: string;
  anosGarantiaTotal: string;
}): string {
  let texto = TEMPLATE_CONCLUSAO;
  
  texto = texto.replace(/{resultado}/g, dados.resultado);
  texto = texto.replace(/{modeloTelha}/g, dados.modeloTelha);
  texto = texto.replace(/{anosGarantiaTotal}/g, dados.anosGarantiaTotal);
  
  return texto;
}