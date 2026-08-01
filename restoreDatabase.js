// =========================================================================
// RESTOREDATABASE.JS
// Restaura produtos do PostgreSQL local para a API online do Render.
// =========================================================================

require('dotenv').config();

const { Pool } = require('pg');

const API_BASE_URL = String(
    process.env.API_BASE_URL || ''
).replace(/\/+$/, '');

if (!API_BASE_URL) {
    console.error(
        '❌ A variável API_BASE_URL não foi definida no .env.'
    );

    process.exit(1);
}

const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl:
        process.env.PGSSL === 'true'
            ? { rejectUnauthorized: false }
            : false
});

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function converterNumero(valor, padrao = 0) {
    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : padrao;
}

function converterBooleano(valor) {
    return (
        valor === true ||
        valor === 1 ||
        valor === '1' ||
        valor === 'true'
    );
}

function aguardar(milissegundos) {
    return new Promise(resolve => {
        setTimeout(resolve, milissegundos);
    });
}

async function requisicaoApi(
    caminho,
    opcoes = {},
    tentativas = 3
) {
    const url = `${API_BASE_URL}${caminho}`;

    let ultimoErro = null;

    for (
        let tentativa = 1;
        tentativa <= tentativas;
        tentativa += 1
    ) {
        try {
            const resposta = await fetch(url, {
                ...opcoes,
                headers: {
                    Accept: 'application/json',
                    ...(opcoes.body
                        ? {
                            'Content-Type':
                                'application/json'
                        }
                        : {}),
                    ...(opcoes.headers || {})
                },
                signal: AbortSignal.timeout(60000)
            });

            return resposta;
        } catch (erro) {
            ultimoErro = erro;

            if (tentativa < tentativas) {
                console.warn(
                    `⚠️ Tentativa ${tentativa} falhou. ` +
                    'Tentando novamente...'
                );

                await aguardar(
                    tentativa * 2000
                );
            }
        }
    }

    throw ultimoErro;
}

async function buscarProdutosPostgres() {
    const resultado = await pool.query(`
        SELECT
            id,
            titulo,
            descricao,
            categoria,
            patente,
            preco,
            preco_promocional,
            quantidade_minima_promo,
            imagem,
            estoque,
            personalizavel,
            tamanho,
            ativo,
            created_at
        FROM produtos
        WHERE ativo = TRUE
        ORDER BY id ASC
    `);

    return resultado.rows;
}

async function buscarProdutosOnline() {
    const resposta = await requisicaoApi(
        '/api/produtos',
        {
            method: 'GET'
        }
    );

    if (!resposta.ok) {
        const texto = await resposta.text();

        throw new Error(
            `Erro ao consultar Render: ` +
            `HTTP ${resposta.status} - ${texto}`
        );
    }

    const resultado = await resposta.json();

    if (Array.isArray(resultado)) {
        return resultado;
    }

    if (Array.isArray(resultado?.produtos)) {
        return resultado.produtos;
    }

    if (Array.isArray(resultado?.dados)) {
        return resultado.dados;
    }

    throw new Error(
        'A API não retornou uma lista válida de produtos.'
    );
}

function montarPayload(produto) {
    const preco = converterNumero(
        produto.preco,
        0
    );

    const promocionalOriginal =
        produto.preco_promocional ??
        produto.precoPromocional ??
        null;

    let precoPromocional = null;

    if (
        promocionalOriginal !== null &&
        promocionalOriginal !== ''
    ) {
        const promocional = Number(
            promocionalOriginal
        );

        if (
            Number.isFinite(promocional) &&
            promocional >= 0 &&
            promocional < preco
        ) {
            precoPromocional = promocional;
        }
    }

    return {
        titulo: String(
            produto.titulo ||
            'Produto sem título'
        ).trim(),

        descricao:
            produto.descricao || '',

        categoria:
            produto.categoria ||
            'Acessórios',

        patente:
            produto.patente ||
            'geral',

        preco,

        precoPromocional,

        quantidadeMinimaPromo:
            Math.max(
                1,
                Math.trunc(
                    converterNumero(
                        produto.quantidade_minima_promo ??
                        produto.quantidadeMinimaPromo,
                        1
                    )
                )
            ),

        imagem:
            produto.imagem || '',

        estoque:
            Math.max(
                0,
                Math.trunc(
                    converterNumero(
                        produto.estoque,
                        0
                    )
                )
            ),

        personalizavel:
            converterBooleano(
                produto.personalizavel
            ),

        tamanho:
            converterBooleano(
                produto.tamanho
            ),

        ativo:
            produto.ativo === undefined
                ? true
                : converterBooleano(
                    produto.ativo
                )
    };
}

async function atualizarProduto(
    idOnline,
    produtoBackup
) {
    const payload =
        montarPayload(produtoBackup);

    const resposta = await requisicaoApi(
        `/api/produtos/${idOnline}`,
        {
            method: 'PUT',
            body: JSON.stringify(payload)
        }
    );

    if (!resposta.ok) {
        const texto = await resposta.text();

        throw new Error(
            `Não foi possível atualizar o produto ` +
            `"${payload.titulo}" (ID ${idOnline}). ` +
            `HTTP ${resposta.status}: ${texto}`
        );
    }

    return resposta.json().catch(() => ({}));
}

async function criarProduto(produtoBackup) {
    const payload =
        montarPayload(produtoBackup);

    const resposta = await requisicaoApi(
        '/api/produtos',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );

    if (!resposta.ok) {
        const texto = await resposta.text();

        throw new Error(
            `Não foi possível criar o produto ` +
            `"${payload.titulo}". ` +
            `HTTP ${resposta.status}: ${texto}`
        );
    }

    return resposta.json().catch(() => ({}));
}

async function executarRestauracao() {
    let atualizados = 0;
    let criados = 0;
    let erros = 0;

    try {
        console.log(
            '🔄 Iniciando restauração para o Render...'
        );

        const produtosBackup =
            await buscarProdutosPostgres();

        if (produtosBackup.length === 0) {
            throw new Error(
                'O PostgreSQL local não possui produtos para restaurar.'
            );
        }

        console.log(
            `📦 ${produtosBackup.length} produto(s) ` +
            'encontrado(s) no PostgreSQL.'
        );

        const produtosOnline =
            await buscarProdutosOnline();

        console.log(
            `🌐 ${produtosOnline.length} produto(s) ` +
            'encontrado(s) no Render.'
        );

        const onlinePorId = new Map();
        const onlinePorTitulo = new Map();

        for (const produto of produtosOnline) {
            const id = Number(produto.id);

            if (
                Number.isInteger(id) &&
                id > 0
            ) {
                onlinePorId.set(id, produto);
            }

            const tituloNormalizado =
                normalizarTexto(
                    produto.titulo ||
                    produto.nome
                );

            if (tituloNormalizado) {
                onlinePorTitulo.set(
                    tituloNormalizado,
                    produto
                );
            }
        }

        for (const produtoBackup of produtosBackup) {
            const idBackup =
                Number(produtoBackup.id);

            const tituloNormalizado =
                normalizarTexto(
                    produtoBackup.titulo
                );

            const encontradoPorId =
                onlinePorId.get(idBackup);

            const encontradoPorTitulo =
                onlinePorTitulo.get(
                    tituloNormalizado
                );

            const produtoOnline =
                encontradoPorId ||
                encontradoPorTitulo;

            try {
                if (produtoOnline) {
                    await atualizarProduto(
                        Number(produtoOnline.id),
                        produtoBackup
                    );

                    atualizados += 1;

                    console.log(
                        `✅ Atualizado: ` +
                        `${produtoBackup.titulo}`
                    );
                } else {
                    const resultado =
                        await criarProduto(
                            produtoBackup
                        );

                    criados += 1;

                    console.log(
                        `➕ Criado: ` +
                        `${produtoBackup.titulo}`
                    );

                    const produtoCriado =
                        resultado?.produto ||
                        resultado?.dados ||
                        resultado;

                    if (produtoCriado?.id) {
                        onlinePorId.set(
                            Number(produtoCriado.id),
                            produtoCriado
                        );

                        onlinePorTitulo.set(
                            tituloNormalizado,
                            produtoCriado
                        );
                    }
                }
            } catch (erroProduto) {
                erros += 1;

                console.error(
                    `❌ Falha em ` +
                    `"${produtoBackup.titulo}":`,
                    erroProduto.message
                );
            }

            /*
             * Pequeno intervalo para não sobrecarregar
             * o serviço gratuito do Render.
             */
            await aguardar(100);
        }

        console.log('');
        console.log(
            '========================================'
        );
        console.log(
            '✅ RESTAURAÇÃO FINALIZADA'
        );
        console.log(
            `Produtos atualizados: ${atualizados}`
        );
        console.log(
            `Produtos criados: ${criados}`
        );
        console.log(
            `Erros: ${erros}`
        );
        console.log(
            '========================================'
        );

        if (erros > 0) {
            process.exitCode = 1;
        }
    } catch (erro) {
        console.error(
            '❌ Erro geral na restauração:',
            erro.message
        );

        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

executarRestauracao();