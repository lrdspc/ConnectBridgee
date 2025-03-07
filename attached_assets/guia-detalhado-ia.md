# GUIA SUPER DETALHADO PARA IMPLEMENTAÇÃO POR IA

## INTRODUÇÃO

Você deve criar um sistema web que gere relatórios de vistoria técnica em formato DOCX. O sistema consiste em um formulário HTML para coletar dados e um backend para processar esses dados e gerar o documento final.

## ORDEM EXATA DE LEITURA DOS ARQUIVOS

1. **especificacao-sistema.md** - Contém os requisitos gerais do sistema
2. **exemplo-relatorio-preenchido.txt** - Mostra exatamente como deve ser o documento final
3. **banco-nao-conformidades.json** - Contém os textos completos das 14 não conformidades
4. **template-relatorio.txt** - Contém o template do relatório com marcadores para substituição
5. **campos-do-formulario-detalhados.md** - Lista exata de todos os campos do formulário
6. **formatacao-documento-word-detalhada.md** - Especificações detalhadas de formatação
7. **instrucoes-formulario-claras.md** - Instruções sobre o que NÃO incluir no formulário

## ESTRUTURA COMPLETA DO PROJETO

```
/projeto
  /public
    index.html           - Página principal com o formulário
    styles.css           - Estilos para o formulário
    script.js            - Lógica de validação e envio de dados
  /data
    nao-conformidades.json - Banco de dados de não conformidades
  /templates
    template-relatorio.docx - Template do relatório em formato DOCX
  /src
    server.js            - Arquivo principal do servidor
    /controllers
      relatorioController.js - Controlador para geração de relatórios
    /services
      relatorioService.js    - Serviço para processamento de dados e formatação
      docxService.js         - Serviço para geração de documentos DOCX
    /utils
      dataFormatter.js       - Utilitários para formatação de dados
  package.json           - Configuração do projeto e dependências
```

## DEPENDÊNCIAS NECESSÁRIAS

Adicione estas dependências exatas no package.json:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "docxtemplater": "^3.37.12",
    "pizzip": "^3.1.4"
  }
}
```

## IMPLEMENTAÇÃO PASSO A PASSO

### 1. CONFIGURAÇÃO INICIAL

#### 1.1 Arquivo package.json

Crie o arquivo com o conteúdo:

```json
{
  "name": "sistema-relatorio-vistoria",
  "version": "1.0.0",
  "description": "Sistema para geração de relatórios de vistoria técnica",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "docxtemplater": "^3.37.12",
    "pizzip": "^3.1.4"
  }
}
```

#### 1.2 Copie o Banco de Dados

Copie o conteúdo de `banco-nao-conformidades.json` para `/data/nao-conformidades.json`

#### 1.3 Prepare o Template DOCX

Converta o conteúdo de `template-relatorio.txt` para um arquivo DOCX com a formatação especificada em `formatacao-documento-word-detalhada.md`.

### 2. IMPLEMENTAÇÃO DO FORMULÁRIO HTML

Crie o arquivo `/public/index.html` com o conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário de Relatório de Vistoria Técnica</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Formulário de Relatório de Vistoria Técnica</h1>
        <form id="relatorioForm">
            <!-- SEÇÃO 1: INFORMAÇÕES BÁSICAS -->
            <div class="section">
                <h2>Informações Básicas</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="dataVistoria">Data de Vistoria: <span class="required">*</span></label>
                        <input type="date" id="dataVistoria" name="dataVistoria" required>
                    </div>
                    <div class="form-group">
                        <label for="cliente">Nome do Cliente: <span class="required">*</span></label>
                        <input type="text" id="cliente" name="cliente" required>
                    </div>
                    <div class="form-group">
                        <label for="empreendimento">Tipo de Empreendimento: <span class="required">*</span></label>
                        <select id="empreendimento" name="empreendimento" required>
                            <option value="">Selecione...</option>
                            <option value="Residencial">Residencial</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Industrial">Industrial</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cidade">Cidade: <span class="required">*</span></label>
                        <input type="text" id="cidade" name="cidade" required>
                    </div>
                    <div class="form-group">
                        <label for="estado">Estado: <span class="required">*</span></label>
                        <input type="text" id="estado" name="estado" value="PR" required>
                    </div>
                    <div class="form-group">
                        <label for="endereco">Endereço: <span class="required">*</span></label>
                        <input type="text" id="endereco" name="endereco" required>
                    </div>
                    <div class="form-group">
                        <label for="protocolo">FAR/Protocolo: <span class="required">*</span></label>
                        <input type="text" id="protocolo" name="protocolo" required>
                    </div>
                    <div class="form-group">
                        <label for="assunto">Assunto: <span class="required">*</span></label>
                        <input type="text" id="assunto" name="assunto" required>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO 2: INFORMAÇÕES DA EQUIPE -->
            <div class="section">
                <h2>Informações da Equipe</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="tecnico">Técnico Responsável: <span class="required">*</span></label>
                        <input type="text" id="tecnico" name="tecnico" required>
                    </div>
                    <div class="form-group">
                        <label for="departamento">Departamento: <span class="required">*</span></label>
                        <input type="text" id="departamento" name="departamento" value="Assistência Técnica" required>
                    </div>
                    <div class="form-group">
                        <label for="unidade">Unidade: <span class="required">*</span></label>
                        <input type="text" id="unidade" name="unidade" value="PR" required>
                    </div>
                    <div class="form-group">
                        <label for="coordenador">Coordenador Responsável: <span class="required">*</span></label>
                        <input type="text" id="coordenador" name="coordenador" value="Marlon Weingartner" required>
                    </div>
                    <div class="form-group">
                        <label for="gerente">Gerente Responsável: <span class="required">*</span></label>
                        <input type="text" id="gerente" name="gerente" value="Elisabete Kudo" required>
                    </div>
                    <div class="form-group">
                        <label for="regional">Regional: <span class="required">*</span></label>
                        <input type="text" id="regional" name="regional" value="Sul" required>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO 3: INFORMAÇÕES DO PRODUTO -->
            <div class="section">
                <h2>Informações do Produto</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="modeloTelha">Modelo da Telha: <span class="required">*</span></label>
                        <select id="modeloTelha" name="modeloTelha" required>
                            <option value="Ondulada 5mm CRFS">Ondulada 5mm CRFS</option>
                            <option value="Ondulada 6mm CRFS" selected>Ondulada 6mm CRFS</option>
                            <option value="Ondulada 8mm CRFS">Ondulada 8mm CRFS</option>
                            <option value="Estrutural">Estrutural</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quantidadeTelhas">Quantidade de Telhas: <span class="required">*</span></label>
                        <input type="number" id="quantidadeTelhas" name="quantidadeTelhas" required>
                    </div>
                    <div class="form-group">
                        <label for="areaCoberta">Área Coberta (m²): <span class="required">*</span></label>
                        <input type="text" id="areaCoberta" name="areaCoberta" required>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO 4: NÃO CONFORMIDADES -->
            <div class="section">
                <h2>Não Conformidades Identificadas</h2>
                <p>Selecione todas as não conformidades identificadas na vistoria (pelo menos uma):</p>
                <div id="naoConformidadesContainer" class="checkbox-grid">
                    <!-- Os checkboxes serão adicionados via JavaScript -->
                </div>
            </div>

            <div class="button-container">
                <button type="submit" id="submitBtn">Gerar Relatório</button>
                <button type="reset" id="resetBtn">Limpar Formulário</button>
            </div>
        </form>
        
        <div id="downloadContainer" class="download-container" style="display: none;">
            <h3>Relatório Gerado com Sucesso!</h3>
            <p>Clique no botão abaixo para baixar o relatório:</p>
            <a id="downloadLink" class="download-button" href="#" download>Baixar Relatório</a>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### 3. ESTILIZAÇÃO DO FORMULÁRIO

Crie o arquivo `/public/styles.css` com o conteúdo:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    background-color: #f5f5f5;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #00519e;
}

h2 {
    color: #00519e;
    margin-bottom: 15px;
}

.section {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    border-left: 4px solid #00519e;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.required {
    color: red;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 10px;
    margin-top: 15px;
}

.checkbox-item {
    display: flex;
    padding: 10px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #eee;
}

.checkbox-item:hover {
    background-color: #f0f7ff;
}

.checkbox-item input {
    width: auto;
    margin-right: 10px;
    margin-top: 3px;
}

.checkbox-content {
    flex: 1;
}

.checkbox-title {
    font-weight: bold;
    margin-bottom: 5px;
}

.checkbox-desc {
    font-size: 0.85em;
    color: #666;
}

.button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

button {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

#submitBtn {
    background-color: #00519e;
    color: white;
}

#resetBtn {
    background-color: #f0f0f0;
    color: #333;
}

.download-container {
    margin-top: 30px;
    padding: 20px;
    background-color: #e9f7ef;
    border-radius: 5px;
    text-align: center;
}

.download-button {
    display: inline-block;
    margin-top: 15px;
    padding: 12px 24px;
    background-color: #00519e;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
}
```

### 4. JAVASCRIPT DO CLIENTE

Crie o arquivo `/public/script.js` com o conteúdo:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Carregar as não conformidades ao iniciar a página
    carregarNaoConformidades();
    
    // Adicionar eventos
    document.getElementById('relatorioForm').addEventListener('submit', enviarFormulario);
    document.getElementById('resetBtn').addEventListener('click', limparFormulario);
});

// Array com as descrições curtas das não conformidades
const naoConformidades = [
    { id: 1, titulo: "Armazenagem Incorreta", descricao: "Telhas armazenadas de forma inadequada, em desacordo com as recomendações técnicas." },
    { id: 2, titulo: "Carga Permanente sobre as Telhas", descricao: "Presença de cargas permanentes não previstas sobre as telhas." },
    { id: 3, titulo: "Corte de Canto Incorreto ou Ausente", descricao: "Cortes de canto das telhas não executados corretamente ou ausentes." },
    { id: 4, titulo: "Estrutura Desalinhada", descricao: "Estrutura de apoio das telhas apresenta desalinhamento significativo." },
    { id: 5, titulo: "Fixação Irregular das Telhas", descricao: "Fixação das telhas não atende às especificações técnicas do fabricante." },
    { id: 6, titulo: "Inclinação da Telha Inferior ao Recomendado", descricao: "Inclinação do telhado está abaixo do mínimo recomendado." },
    { id: 7, titulo: "Marcas de Caminhamento sobre o Telhado", descricao: "Marcas evidentes de caminhamento direto sobre as telhas." },
    { id: 8, titulo: "Balanço Livre do Beiral Incorreto", descricao: "Balanço livre do beiral está em desacordo com as especificações técnicas." },
    { id: 9, titulo: "Número de Apoios e Vão Livre Inadequados", descricao: "Quantidade de apoios e/ou vão livre entre eles está em desconformidade." },
    { id: 10, titulo: "Recobrimento Incorreto", descricao: "Recobrimento entre as telhas não atende às especificações mínimas." },
    { id: 11, titulo: "Sentido de Montagem Incorreto", descricao: "Montagem das telhas foi executada em sentido contrário ao recomendado." },
    { id: 12, titulo: "Uso de Cumeeira Cerâmica", descricao: "Utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento." },
    { id: 13, titulo: "Uso de Argamassa em Substituição a Peças Complementares", descricao: "Uso inadequado de argamassa em substituição às peças complementares originais." },
    { id: 14, titulo: "Fixação de Acessórios Complementares Inadequada", descricao: "Acessórios complementares não fixados de acordo com as especificações técnicas." }
];

// Função para carregar as não conformidades no formulário
function carregarNaoConformidades() {
    const container = document.getElementById('naoConformidadesContainer');
    
    naoConformidades.forEach(nc => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        
        item.innerHTML = `
            <input type="checkbox" id="nc-${nc.id}" name="naoConformidades" value="${nc.id}">
            <div class="checkbox-content">
                <div class="checkbox-title">${nc.id}. ${nc.titulo}</div>
                <div class="checkbox-desc">${nc.descricao}</div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Função para validar o formulário
function validarFormulario() {
    // Validar todos os campos obrigatórios
    const camposObrigatorios = document.querySelectorAll('[required]');
    let valido = true;
    
    camposObrigatorios.forEach(campo => {
        if (!campo.value.trim()) {
            campo.style.borderColor = 'red';
            valido = false;
        } else {
            campo.style.borderColor = '#ddd';
        }
    });
    
    // Validar se pelo menos uma não conformidade foi selecionada
    const naoConformidadesSelecionadas = document.querySelectorAll('input[name="naoConformidades"]:checked');
    if (naoConformidadesSelecionadas.length === 0) {
        alert('Selecione pelo menos uma não conformidade.');
        valido = false;
    }
    
    return valido;
}

// Função para coletar os dados do formulário
function coletarDadosFormulario() {
    const formData = {
        dataVistoria: document.getElementById('dataVistoria').value,
        cliente: document.getElementById('cliente').value,
        empreendimento: document.getElementById('empreendimento').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        endereco: document.getElementById('endereco').value,
        protocolo: document.getElementById('protocolo').value,
        assunto: document.getElementById('assunto').value,
        
        tecnico: document.getElementById('tecnico').value,
        departamento: document.getElementById('departamento').value,
        unidade: document.getElementById('unidade').value,
        coordenador: document.getElementById('coordenador').value,
        gerente: document.getElementById('gerente').value,
        regional: document.getElementById('regional').value,
        
        modeloTelha: document.getElementById('modeloTelha').value,
        quantidadeTelhas: document.getElementById('quantidadeTelhas').value,
        areaCoberta: document.getElementById('areaCoberta').value,
        
        naoConformidades: Array.from(
            document.querySelectorAll('input[name="naoConformidades"]:checked')
        ).map(checkbox => parseInt(checkbox.value))
    };
    
    return formData;
}

// Função para enviar o formulário
function enviarFormulario(event) {
    event.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const formData = coletarDadosFormulario();
    
    // Exibir indicador de carregamento
    document.getElementById('submitBtn').textContent = 'Gerando relatório...';
    document.getElementById('submitBtn').disabled = true;
    
    // Enviar dados para o servidor
    fetch('/api/gerar-relatorio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao gerar relatório');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Exibir link de download
            document.getElementById('downloadLink').href = data.downloadUrl;
            document.getElementById('downloadContainer').style.display = 'block';
            
            // Scroll para o link de download
            document.getElementById('downloadContainer').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Erro ao gerar relatório: ' + data.error);
        }
    })
    .catch(error => {
        alert('Erro: ' + error.message);
    })
    .finally(() => {
        // Restaurar botão
        document.getElementById('submitBtn').textContent = 'Gerar Relatório';
        document.getElementById('submitBtn').disabled = false;
    });
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('relatorioForm').reset();
    document.getElementById('downloadContainer').style.display = 'none';
    
    // Restaurar bordas dos campos
    const camposObrigatorios = document.querySelectorAll('[required]');
    camposObrigatorios.forEach(campo => {
        campo.style.borderColor = '#ddd';
    });
    
    // Desmarcar todas as não conformidades
    document.querySelectorAll('input[name="naoConformidades"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}
```

### 5. SERVIDOR EXPRESS

Crie o arquivo `/src/server.js` com o conteúdo:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const relatorioController = require('./controllers/relatorioController');

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Criar pasta para downloads se não existir
const downloadsDir = path.join(__dirname, '../public/downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Rotas API
app.post('/api/gerar-relatorio', relatorioController.gerarRelatorio);

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

### 6. CONTROLLER PARA GERAÇÃO DE RELATÓRIOS

Crie o arquivo `/src/controllers/relatorioController.js` com o conteúdo:

```javascript
const relatorioService = require('../services/relatorioService');
const path = require('path');

/**
 * Controlador para geração de relatórios
 */
const relatorioController = {
    /**
     * Gera um relatório de vistoria técnica
     */
    gerarRelatorio: async (req, res) => {
        try {
            // Validar dados do formulário
            const dadosFormulario = req.body;
            
            if (!dadosFormulario || !Array.isArray(dadosFormulario.naoConformidades) || 
                dadosFormulario.naoConformidades.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Dados inválidos. Selecione pelo menos uma não conformidade.'
                });
            }
            
            // Processar relatório
            const resultado = await relatorioService.processarRelatorio(dadosFormulario);
            
            if (resultado.success) {
                // Retornar URL para download
                return res.json({
                    success: true,
                    message: 'Relatório gerado com sucesso',
                    downloadUrl: resultado.downloadUrl
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: resultado.error
                });
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro interno ao gerar relatório'
            });
        }
    }
};

module.exports = relatorioController;
```

### 7. SERVIÇO DE PROCESSAMENTO DE RELATÓRIOS

Crie o arquivo `/src/services/relatorioService.js` com o conteúdo:

```javascript
const fs = require('fs');
const path = require('path');
const docxService = require('./docxService');
const { formatarData } = require('../utils/dataFormatter');

/**
 * Serviço para processamento de relatórios
 */
const relatorioService = {
    /**
     * Processa os dados do formulário e gera o relatório
     */
    processarRelatorio: async (dadosFormulario) => {
        try {
            // Carregar banco de não conformidades
            const naoConformidades = carregarNaoConformidades();
            
            // Obter não conformidades selecionadas
            const naoConformidadesSelecionadas = obterNaoConformidadesSelecionadas(
                dadosFormulario.naoConformidades, 
                naoConformidades
            );
            
            // Formatar data
            const dataFormatada = formatarData(dadosFormulario.dataVistoria);
            
            // Preparar dados para o template
            const dadosProcessados = {
                // Informações básicas
                dataVistoria: dataFormatada,
                cliente: dadosFormulario.cliente,
                empreendimento: dadosFormulario.empreendimento,
                cidade: dadosFormulario.cidade,
                estado: dadosFormulario.estado,
                endereco: dadosFormulario.endereco,
                protocolo: dadosFormulario.protocolo,
                assunto: dadosFormulario.assunto,
                
                // Informações da equipe
                tecnico: dadosFormulario.tecnico,
                departamento: dadosFormulario.departamento,
                unidade: dadosFormulario.unidade,
                coordenador: dadosFormulario.coordenador,
                gerente: dadosFormulario.gerente,
                regional: dadosFormulario.regional,
                
                // Informações do produto
                modeloTelha: dadosFormulario.modeloTelha,
                quantidadeTelhas: dadosFormulario.quantidadeTelhas,
                areaCoberta: dadosFormulario.areaCoberta,
                
                // Seções dinâmicas
                SECAO_NAO_CONFORMIDADES: gerarSecaoNaoConformidades(naoConformidadesSelecionadas),
                LISTA_NAO_CONFORMIDADES: gerarListaNaoConformidades(naoConformidadesSelecionadas)
            };
            
            // Gerar documento
            const nomeArquivo = `Relatório de Vistoria - ${dadosFormulario.cliente}.docx`;
            const resultado = await docxService.gerarDocumento(dadosProcessados, nomeArquivo);
            
            return resultado;
        } catch (error) {
            console.error('Erro ao processar relatório:', error);
            return {
                success: false,
                error: 'Erro ao processar relatório: ' + error.message
            };
        }
    }
};

/**
 * Carrega o banco de dados de não conformidades
 */
function carregarNaoConformidades() {
    try {
        const jsonPath = path.join(__dirname, '../../data/nao-conformidades.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Erro ao carregar não conformidades:', error);
        throw new Error('Não foi possível carregar o banco de não conformidades');
    }
}

/**
 * Filtra as não conformidades selecionadas
 */
function obterNaoConformidadesSelecionadas(ids, todasNaoConformidades) {
    return todasNaoConformidades.filter(nc => ids.includes(nc.id));
}

/**
 * Gera a seção de não conformidades para a Análise Técnica
 */
function gerarSecaoNaoConformidades(naoConformidades) {
    return naoConformidades.map(nc => {
        return `**${nc.id}. ${nc.titulo}**\n\n${nc.textoCompleto}`;
    }).join('\n\n');
}

/**
 * Gera a lista de não conformidades para a Conclusão
 */
function gerarListaNaoConformidades(naoConformidades) {
    return naoConformidades.map((nc, index) => {
        return `${index + 1}. ${nc.titulo}`;
    }).join('\n\n');
}

module.exports = relatorioService;
```

### 8. SERVIÇO DE GERAÇÃO DE DOCUMENTOS DOCX

Crie o arquivo `/src/services/docxService.js` com o conteúdo:

```javascript
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

/**
 * Serviço para geração de documentos DOCX
 */
const docxService = {
    /**
     * Gera um documento DOCX com base nos dados processados
     */
    gerarDocumento: async (dadosProcessados, nomeArquivo) => {
        try {
            // Caminho do template
            const templatePath = path.join(__dirname, '../../templates/template-relatorio.docx');
            
            // Verificar se o template existe
            if (!fs.existsSync(templatePath)) {
                throw new Error('Template não encontrado: ' + templatePath);
            }
            
            // Carregar o template
            const conteudo = fs.readFileSync(templatePath, 'binary');
            
            // Criar instância do PizZip
            const zip = new PizZip(conteudo);
            
            // Criar instância do Docxtemplater
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true
            });
            
            // Definir os dados para o template
            doc.setData(dadosProcessados);
            
            // Renderizar o documento
            doc.render();
            
            // Gerar o buffer do documento
            const buffer = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE'
            });
            
            // Definir caminho do arquivo de saída
            const outputDir = path.join(__dirname, '../../public/downloads');
            const outputPath = path.join(outputDir, nomeArquivo);
            
            // Garantir que o diretório existe
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            // Salvar o documento
            fs.writeFileSync(outputPath, buffer);
            
            // Retornar URL para download
            return {
                success: true,
                fileName: nomeArquivo,
                downloadUrl: '/downloads/' + nomeArquivo
            };
        } catch (error) {
            console.error('Erro ao gerar documento DOCX:', error);
            return {
                success: false,
                error: 'Erro ao gerar documento: ' + error.message
            };
        }
    }
};

module.exports = docxService;
```

### 9. UTILITÁRIO PARA FORMATAÇÃO DE DATA

Crie o arquivo `/src/utils/dataFormatter.js` com o conteúdo:

```javascript
/**
 * Utilitários para formatação de dados
 */
const dataFormatter = {
    /**
     * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
     */
    formatarData: (dataString) => {
        try {
            const data = new Date(dataString);
            
            // Verificar se a data é válida
            if (isNaN(data.getTime())) {
                throw new Error('Data inválida');
            }
            
            // Formatar para DD/MM/AAAA
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            
            return `${dia}/${mes}/${ano}`;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dataString;
        }
    }
};

module.exports = dataFormatter;
```

## PASSOS PARA EXECUTAR O SISTEMA

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie o arquivo template-relatorio.docx:
   - Crie um novo documento Word
   - Copie o conteúdo de template-relatorio.txt
   - Formate-o conforme as especificações em formatacao-documento-word-detalhada.md
   - Salve como template-relatorio.docx na pasta /templates

3. Inicie o servidor:
   ```
   npm start
   ```

4. Acesse o sistema:
   - Abra http://localhost:3000 no navegador
   - Preencha o formulário
   - Selecione as não conformidades
   - Clique em "Gerar Relatório"

## PONTOS CRÍTICOS DE ATENÇÃO

1. **Formatação do documento**: O documento gerado DEVE seguir EXATAMENTE a formatação especificada. Isso inclui fontes, espaçamentos, quebras de linha, negritos, etc.

2. **Textos das não conformidades**: Os textos das não conformidades NÃO devem ser alterados. Use exatamente os textos fornecidos no arquivo JSON.

3. **Template DOCX**: O template deve ser convertido corretamente para DOCX, mantendo a formatação e todos os marcadores de substituição.

4. **Formatação das seções dinâmicas**:
   - Na seção "Análise Técnica", cada não conformidade deve começar com seu número e título em negrito, seguido pelo texto completo.
   - Na seção "Conclusão", deve haver uma lista numerada sequencialmente apenas com os títulos das não conformidades.

5. **Campos do formulário**: O formulário deve conter APENAS os campos especificados. NÃO adicione campos para textos fixos que já estão no template.

## VERIFICAÇÃO FINAL

1. O relatório gerado deve ser IDÊNTICO ao exemplo-relatorio-preenchido.txt, substituindo apenas as variáveis pelos valores do formulário.

2. Todos os textos fixos (introdução, conclusão, etc.) devem ser mantidos exatamente como no template.

3. A formatação do documento final deve seguir todas as especificações detalhadas em formatacao-documento-word-detalhada.md.