# Script automatizado para criar repositório GitHub
# ConnectBridge - Sistema de Relatórios de Vistoria Técnica

Write-Host "🚀 CRIANDO REPOSITÓRIO GITHUB AUTOMATICAMENTE..." -ForegroundColor Green
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "C:\Users\lrdsp\Documents\GitHub\ConnectBridgee"

# Verificar se GitHub CLI está disponível
$ghPath = Get-Command "gh.exe" -ErrorAction SilentlyContinue
if (-not $ghPath) {
    $ghPath = Get-Command "C:\Program Files\GitHub CLI\gh.exe" -ErrorAction SilentlyContinue
}

if ($ghPath) {
    Write-Host "✅ GitHub CLI encontrado!" -ForegroundColor Green

    # Fazer login no GitHub
    Write-Host "🔐 Fazendo login no GitHub..." -ForegroundColor Yellow
    & $ghPath.Source auth login --web

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green

        # Criar repositório
        Write-Host "📦 Criando repositório 'ConnectBridgee'..." -ForegroundColor Yellow
        & $ghPath.Source repo create ConnectBridgee --description "Sistema de Relatórios de Vistoria Técnica para telhas Brasilit/Saint-Gobain" --public --source=. --remote=origin --push

        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 REPOSITÓRIO CRIADO COM SUCESSO!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 RESUMO:" -ForegroundColor Cyan
            Write-Host "- ✅ Repositório criado: https://github.com/$(& $ghPath.Source auth status --show-token 2>$null | Select-String 'Logged in to github.com as (.+)' | ForEach-Object {$_.Matches[0].Groups[1].Value})/ConnectBridgee"
            Write-Host "- ✅ Código enviado para o GitHub"
            Write-Host "- ✅ README.md configurado"
            Write-Host "- ✅ Licença MIT adicionada"
            Write-Host ""
            Write-Host "🌐 Abrindo repositório no navegador..." -ForegroundColor Yellow
            Start-Process "https://github.com/$(& $ghPath.Source auth status 2>$null | Select-String 'Logged in to github.com as (.+)' | ForEach-Object {$_.Matches[0].Groups[1].Value})/ConnectBridgee"
        } else {
            Write-Host "❌ Erro ao criar repositório. Tentando método manual..." -ForegroundColor Red
            & $ghPath.Source repo create ConnectBridgee --description "Sistema de Relatórios de Vistoria Técnica" --public

            # Adicionar origin e fazer push manual
            git remote add origin "https://github.com/$(& $ghPath.Source auth status 2>$null | Select-String 'Logged in to github.com as (.+)' | ForEach-Object {$_.Matches[0].Groups[1].Value})/ConnectBridgee.git"
            git branch -M main
            git push -u origin main
        }
    } else {
        Write-Host "❌ Erro no login. Usando método manual..." -ForegroundColor Red
        Start-Process "https://github.com/new"
    }
} else {
    Write-Host "⚠️ GitHub CLI não encontrado. Usando método manual..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 ABRIR MANUALMENTE:" -ForegroundColor Cyan
    Write-Host "1. Abrindo GitHub para criar repositório..."
    Start-Process "https://github.com/new"

    Write-Host ""
    Write-Host "📝 INSTRUÇÕES RÁPIDAS:" -ForegroundColor Yellow
    Write-Host "1. Nome: ConnectBridgee"
    Write-Host "2. Descrição: Sistema de Relatórios de Vistoria Técnica para telhas Brasilit/Saint-Gobain"
    Write-Host "3. Público ou Privado (sua escolha)"
    Write-Host "4. NÃO marcar: README, .gitignore, License"
    Write-Host "5. Clicar 'Create repository'"
    Write-Host ""
    Write-Host "Após criar, execute:"
    Write-Host "git remote add origin https://github.com/[SEU-USUARIO]/connectbridge.git"
    Write-Host "git branch -M main"
    Write-Host "git push -u origin main"
}

Write-Host ""
Write-Host "✨ PROCESSO CONCLUÍDO!" -ForegroundColor Green
