# BrasilitFieldTech - Instruções para StackBlitz

Este guia descreve como usar o StackBlitz para clonar e trabalhar com o projeto BrasilitFieldTech diretamente no navegador, sem necessidade de download ou instalação local.

## O que é StackBlitz?

StackBlitz é um IDE online que permite abrir, editar e executar projetos diretamente no navegador. É uma excelente alternativa quando:

- Você não pode instalar dependências localmente
- Está trabalhando em um dispositivo com restrições
- Quer visualizar rapidamente o código sem configurar um ambiente local
- Precisa compartilhar o projeto de forma fácil com outras pessoas

## Métodos de Uso

### 1. Link Direto para o StackBlitz

Você pode abrir o projeto diretamente no StackBlitz clicando neste link:

[Abrir no StackBlitz](https://stackblitz.com/github/lrdspc/Luuucas)

### 2. Usando o Arquivo HTML Fornecido

O arquivo `stackblitz-launcher.html` incluído neste projeto oferece botões para:
- Abrir o projeto em uma nova aba do StackBlitz
- Incorporar o projeto diretamente na página

Para usar:
1. Abra o arquivo `stackblitz-launcher.html` em qualquer navegador
2. Clique em um dos botões disponíveis

### 3. Incorporando em Seu Próprio Site

Para incorporar o projeto em seu próprio site ou aplicativo:

1. Inclua o SDK do StackBlitz:
```html
<script src="https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js"></script>
```

2. Adicione um container:
```html
<div id="brasilitFieldTechContainer"></div>
```

3. Use o script para carregar o projeto:
```html
<script>
  window.StackBlitzSDK.embedGithubProject(
    'brasilitFieldTechContainer',
    'lrdspc/Luuucas',
    {
      height: 600,
      openFile: 'README.md'
    }
  );
</script>
```

Alternativamente, inclua o arquivo `stackblitz-embed.js` fornecido.

### 4. Usando a API do StackBlitz

Para desenvolvedores que desejam mais controle, o SDK do StackBlitz oferece uma API completa.

Exemplo básico:
```javascript
import sdk from '@stackblitz/sdk';

// Abrir em nova janela
sdk.openGithubProject('lrdspc/Luuucas');

// Incorporar na página
sdk.embedGithubProject('containerId', 'lrdspc/Luuucas', {
  height: 600,
  openFile: 'README.md'
});
```

## Recursos Adicionais

- [Documentação do StackBlitz SDK](https://developer.stackblitz.com/docs/platform/api)
- [Opções de incorporação](https://developer.stackblitz.com/docs/platform/embed-options)

## Notas Importantes

- O StackBlitz funciona melhor em navegadores baseados em Chromium (Chrome, Edge)
- Algumas funcionalidades mais avançadas podem não estar disponíveis no ambiente do StackBlitz
- Para desenvolvimento intensivo, ainda recomendamos clonar o repositório localmente