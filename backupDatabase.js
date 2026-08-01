// =========================================================================
// BACKUPDATABASE.JS
// Cria backup SQL completo do PostgreSQL local.
// Mantém somente os 30 backups mais recentes.
// =========================================================================

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {
    spawnSync
} = require('child_process');

const LIMITE_BACKUPS = 30;

function preencher(valor) {
    return String(valor).padStart(2, '0');
}

function gerarDataArquivo() {
    const agora = new Date();

    return [
        agora.getFullYear(),
        preencher(agora.getMonth() + 1),
        preencher(agora.getDate())
    ].join('-') +
    '_' +
    [
        preencher(agora.getHours()),
        preencher(agora.getMinutes()),
        preencher(agora.getSeconds())
    ].join('-');
}

function localizarPgDump() {
    const caminhoConfigurado =
        process.env.PG_DUMP_PATH;

    const candidatos = [
        caminhoConfigurado,

        'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe',

        'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',

        'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',

        'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe'
    ].filter(Boolean);

    for (const caminho of candidatos) {
        if (fs.existsSync(caminho)) {
            return caminho;
        }
    }

    throw new Error(
        'pg_dump.exe não encontrado. ' +
        'Defina PG_DUMP_PATH no arquivo .env.'
    );
}

function removerBackupsAntigos(
    pastaBackups
) {
    const arquivos = fs
        .readdirSync(pastaBackups)
        .filter(nome => {
            return (
                nome.startsWith(
                    'artigos_militares_'
                ) &&
                nome.endsWith('.sql')
            );
        })
        .map(nome => {
            const caminhoCompleto =
                path.join(
                    pastaBackups,
                    nome
                );

            const estatisticas =
                fs.statSync(
                    caminhoCompleto
                );

            return {
                nome,
                caminhoCompleto,
                data: estatisticas.mtimeMs
            };
        })
        .sort((a, b) => {
            return b.data - a.data;
        });

    const antigos =
        arquivos.slice(LIMITE_BACKUPS);

    for (const arquivo of antigos) {
        fs.unlinkSync(
            arquivo.caminhoCompleto
        );

        console.log(
            `🗑️ Backup antigo removido: ` +
            `${arquivo.nome}`
        );
    }
}

function criarBackup() {
    let arquivoSaida = null;

    try {
        const pgDump =
            localizarPgDump();

        const pastaBackups =
            path.resolve(
                __dirname,
                process.env.BACKUP_DIR ||
                'backups'
            );

        fs.mkdirSync(
            pastaBackups,
            {
                recursive: true
            }
        );

        const nomeArquivo =
            `artigos_militares_` +
            `${gerarDataArquivo()}.sql`;

        arquivoSaida =
            path.join(
                pastaBackups,
                nomeArquivo
            );

        const descritorArquivo =
            fs.openSync(
                arquivoSaida,
                'w'
            );

        console.log(
            '💾 Criando backup do PostgreSQL...'
        );

        console.log(
            `📁 Destino: ${arquivoSaida}`
        );

        const argumentos = [
            '--host',
            process.env.PGHOST ||
                '127.0.0.1',

            '--port',
            String(
                Number(
                    process.env.PGPORT
                ) || 5432
            ),

            '--username',
            process.env.PGUSER ||
                'postgres',

            '--dbname',
            process.env.PGDATABASE ||
                'artigos_militares',

            '--format',
            'plain',

            '--encoding',
            'UTF8',

            '--clean',

            '--if-exists',

            '--no-owner',

            '--no-privileges'
        ];

        const resultado = spawnSync(
            pgDump,
            argumentos,
            {
                env: {
                    ...process.env,

                    PGPASSWORD:
                        process.env.PGPASSWORD ||
                        ''
                },

                stdio: [
                    'ignore',
                    descritorArquivo,
                    'pipe'
                ],

                encoding: 'utf8',

                windowsHide: true
            }
        );

        fs.closeSync(
            descritorArquivo
        );

        if (resultado.error) {
            throw resultado.error;
        }

        if (resultado.status !== 0) {
            const mensagem =
                resultado.stderr ||
                'O pg_dump terminou com erro.';

            throw new Error(
                mensagem.trim()
            );
        }

        const tamanho =
            fs.statSync(
                arquivoSaida
            ).size;

        if (tamanho <= 0) {
            throw new Error(
                'O arquivo de backup foi criado vazio.'
            );
        }

        removerBackupsAntigos(
            pastaBackups
        );

        console.log(
            '✅ Backup criado com sucesso.'
        );

        console.log(
            `📦 Arquivo: ${nomeArquivo}`
        );

        console.log(
            `📏 Tamanho: ` +
            `${(tamanho / 1024).toFixed(2)} KB`
        );
    } catch (erro) {
        console.error(
            '❌ Erro ao criar backup:',
            erro.message
        );

        if (
            arquivoSaida &&
            fs.existsSync(arquivoSaida)
        ) {
            try {
                const tamanho =
                    fs.statSync(
                        arquivoSaida
                    ).size;

                if (tamanho === 0) {
                    fs.unlinkSync(
                        arquivoSaida
                    );
                }
            } catch {
                // Não interrompe o tratamento do erro principal.
            }
        }

        process.exitCode = 1;
    }
}

criarBackup();