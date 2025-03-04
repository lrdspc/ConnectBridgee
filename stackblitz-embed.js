/**
 * BrasilitFieldTech - Script para incorporação no StackBlitz
 * 
 * Instruções de uso:
 * 1. Inclua este script em sua página HTML
 * 2. Adicione um elemento div com id="brasilitFieldTechContainer"
 * 3. O script irá automaticamente abrir o projeto no container
 */

// Certifique-se de que o SDK do StackBlitz esteja carregado
function loadStackBlitzSDK() {
  if (window.StackBlitzSDK) {
    initStackBlitz();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
  script.onload = initStackBlitz;
  document.head.appendChild(script);
}

// Inicializa a visualização do StackBlitz
function initStackBlitz() {
  const container = document.getElementById('brasilitFieldTechContainer');
  if (!container) {
    console.error('Elemento com id "brasilitFieldTechContainer" não encontrado');
    return;
  }

  // Definição do repositório
  const repoOwner = 'lrdspc';
  const repoName = 'Luuucas';

  // Configura o projeto
  window.StackBlitzSDK.embedGithubProject(
    'brasilitFieldTechContainer',
    `${repoOwner}/${repoName}`,
    {
      height: 600,
      openFile: 'README.md',
      view: 'preview',
      hideNavigation: false,
      forceEmbedLayout: true
    }
  );
}

// Executar quando a página estiver carregada
if (document.readyState === 'complete') {
  loadStackBlitzSDK();
} else {
  window.addEventListener('load', loadStackBlitzSDK);
}