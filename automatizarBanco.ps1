$ErrorActionPreference = "Stop"

$Projeto = "C:\Users\julio\Downloads\artigos-militares\artigos-militares"
$PastaLogs = Join-Path $Projeto "logs"
$ArquivoLog = Join-Path $PastaLogs "sincronizacao-banco.log"

if (-not (Test-Path $PastaLogs)) {
    New-Item -ItemType Directory -Path $PastaLogs | Out-Null
}

Set-Location $Projeto

$Data = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Add-Content $ArquivoLog ""
Add-Content $ArquivoLog "========================================"
Add-Content $ArquivoLog "Início: $Data"
Add-Content $ArquivoLog "========================================"

try {
    Add-Content $ArquivoLog "Sincronizando Render → PostgreSQL..."

    & node ".\syncDatabase.js" 2>&1 |
        Tee-Object -FilePath $ArquivoLog -Append

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar syncDatabase.js"
    }

    Add-Content $ArquivoLog "Criando backup SQL..."

    & node ".\backupDatabase.js" 2>&1 |
        Tee-Object -FilePath $ArquivoLog -Append

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar backupDatabase.js"
    }

    Add-Content $ArquivoLog "Processo concluído com sucesso."
}
catch {
    Add-Content $ArquivoLog "ERRO: $($_.Exception.Message)"
}
finally {
    $Fim = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content $ArquivoLog "Finalizado: $Fim"
}