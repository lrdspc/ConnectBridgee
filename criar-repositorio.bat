@echo off
echo.
echo ========================================
echo    CRIANDO REPOSITORIO NO GITHUB
echo ========================================
echo.

REM Configurar variáveis
set REPO_NAME=ConnectBridgee
set DESCRIPTION=Sistema de Relatórios de Vistoria Técnica para telhas Brasilit/Saint-Gobain

echo 🚀 PASSO 1: Abrindo GitHub para criar repositório...
echo.
echo Nome sugerido: %REPO_NAME%
echo Descrição: %DESCRIPTION%
echo.

REM Abrir GitHub no navegador
start https://github.com/new

echo ⏰ Aguardando você criar o repositório no navegador...
echo.
echo 📋 INSTRUÇÕES:
echo 1. Use o nome: %REPO_NAME%
echo 2. Descrição: %DESCRIPTION%
echo 3. Escolha Public ou Private
echo 4. NÃO marque: README, .gitignore, License (já temos)
echo 5. Clique em "Create repository"
echo.

pause

echo.
echo 📝 Agora vou precisar do seu nome de usuário do GitHub...
echo.
set /p GITHUB_USER="Digite seu nome de usuário do GitHub: "

echo.
echo 🔗 PASSO 2: Conectando repositório local ao GitHub...
echo.

REM Adicionar remote
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

REM Verificar se deu certo
if %ERRORLEVEL% neq 0 (
    echo ❌ Erro ao adicionar remote. Verificando se já existe...
    git remote remove origin
    git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
)

echo ✅ Remote adicionado com sucesso!
echo.

echo 🔒 PASSO 3: Removendo arquivo .env do controle de versão...
echo.
echo Removendo arquivo .env (mantendo-o localmente)...
git rm --cached .env 2>nul
if %ERRORLEVEL% equ 0 (
    echo ✅ Arquivo .env removido do controle de versão com sucesso!
) else (
    echo ℹ️ Arquivo .env não estava no controle de versão ou não existe.
)
echo.

echo 📤 PASSO 4: Enviando código para o GitHub...
echo.

REM Configurar branch principal
git branch -M main

echo 🚀 Fazendo push para o GitHub...
git push -u origin main

if %ERRORLEVEL% eq 0 (
    echo.
    echo ========================================
    echo       ✅ SUCESSO! 
    echo ========================================
    echo.
    echo 🎉 Seu repositório foi criado com sucesso!
    echo.
    echo 📍 URL do repositório:
    echo https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo 🌐 Abrindo repositório no navegador...
    start https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo 📋 Próximos passos recomendados:
    echo 1. Configurar topics: react, typescript, nodejs, docx, vistoria-tecnica, brasilit
    echo 2. Configurar branch protection se necessário
    echo 3. Verificar se todos os arquivos foram enviados
    echo.
) else (
    echo.
    echo ========================================
    echo       ❌ ERRO NO PUSH
    echo ========================================
    echo.
    echo 🔧 Possíveis soluções:
    echo 1. Verificar se o repositório foi criado corretamente
    echo 2. Verificar suas credenciais do GitHub
    echo 3. Tentar push forçado: git push -f origin main
    echo.
    echo 💡 Comandos manuais se necessário:
    echo git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
    echo git branch -M main
    echo git push -u origin main
    echo.
)

echo.
pause
