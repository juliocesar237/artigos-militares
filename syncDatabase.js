// =========================================================================
// SYNCDATABASE.JS
// Copia os produtos da API online do Render para o PostgreSQL local.
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

/**
 * Converte diferentes formatos booleanos para true/false.
 */
function converterBooleano(valor) {
    return (
        valor === true ||
        valor === 1 ||
        valor === '1' ||
        valor === 'true'
    );
}

/**
 * Converte um valor para número ou usa o padrão.
 */
function converterNumero(valor, padrao = 0) {
    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : padrao;
}

/**
 * Busca os produtos atualmente salvos no Render.
 */
async function buscarProdutosOnline() {
    const url = `${API_BASE_URL}/api/produtos`;

    console.log(`🌐 Buscando produtos em ${url}`);

    const resposta = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
        signal: AbortSignal.timeout(60000)
    });

    if (!resposta.ok) {
        const textoErro = await resposta.text();

        throw new Error(
            `A API retornou HTTP ${resposta.status}: ${textoErro}`
        );
    }

    const resultado = await resposta.json();

    /*
     * Aceita tanto uma lista direta quanto respostas no formato:
     * { produtos: [...] } ou { dados: [...] }
     */
    const produtos = Array.isArray(resultado)
        ? resultado
        : Array.isArray(resultado?.produtos)
            ? resultado.produtos
            : Array.isArray(resultado?.dados)
                ? resultado.dados
                : null;

    if (!Array.isArray(produtos)) {
        throw new Error(
            'A resposta da API não contém uma lista de produtos.'
        );
    }

    return produtos;
}

/**
 * Insere ou atualiza os produtos no PostgreSQL.
 *
 * O ID original do Render é preservado para permitir
 * uma restauração posterior.
 */
async function sincronizarProdutos(produtos) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const idsRecebidos = [];

        for (const produto of produtos) {
            const id = converterNumero(produto.id, 0);

            if (!Number.isInteger(id) || id <= 0) {
                console.warn(
                    '⚠️ Produto ignorado por possuir ID inválido:',
                    produto
                );

                continue;
            }

            idsRecebidos.push(id);

            await client.query(
                `
                    INSERT INTO produtos (
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
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6, $7,
                        $8, $9, $10, $11, $12, $13,
                        COALESCE($14, CURRENT_TIMESTAMP)
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        titulo = EXCLUDED.titulo,
                        descricao = EXCLUDED.descricao,
                        categoria = EXCLUDED.categoria,
                        patente = EXCLUDED.patente,
                        preco = EXCLUDED.preco,
                        preco_promocional =
                            EXCLUDED.preco_promocional,
                        quantidade_minima_promo =
                            EXCLUDED.quantidade_minima_promo,
                        imagem = EXCLUDED.imagem,
                        estoque = EXCLUDED.estoque,
                        personalizavel =
                            EXCLUDED.personalizavel,
                        tamanho = EXCLUDED.tamanho,
                        ativo = EXCLUDED.ativo
                `,
                [
                    id,
                    String(
                        produto.titulo ||
                        produto.nome ||
                        'Produto sem título'
                    ),
                    produto.descricao || null,
                    produto.categoria || 'Acessórios',
                    produto.patente || 'geral',
                    converterNumero(produto.preco, 0),
                    produto.preco_promocional ??
                        produto.precoPromocional ??
                        null,
                    converterNumero(
                        produto.quantidade_minima_promo ??
                        produto.quantidadeMinimaPromo,
                        1
                    ),
                    produto.imagem || null,
                    converterNumero(produto.estoque, 0),
                    converterBooleano(
                        produto.personalizavel
                    ),
                    converterBooleano(
                        produto.tamanho
                    ),
                    produto.ativo === undefined
                        ? true
                        : converterBooleano(produto.ativo),
                    produto.created_at ||
                        produto.createdAt ||
                        null
                ]
            );
        }

        /*
         * Ajusta a sequência do PostgreSQL para que novos
         * registros não tentem reutilizar IDs existentes.
         */
        await client.query(`
            SELECT setval(
                pg_get_serial_sequence(
                    'produtos',
                    'id'
                ),
                COALESCE(
                    (
                        SELECT MAX(id)
                        FROM produtos
                    ),
                    1
                ),
                true
            )
        `);

        await client.query('COMMIT');

        return idsRecebidos.length;
    } catch (erro) {
        await client.query('ROLLBACK');
        throw erro;
    } finally {
        client.release();
    }
}

async function executarSincronizacao() {
    try {
        console.log(
            '🔄 Iniciando backup dos produtos do Render...'
        );

        const produtos =
            await buscarProdutosOnline();

        console.log(
            `📦 ${produtos.length} produto(s) recebido(s).`
        );

        const totalSincronizado =
            await sincronizarProdutos(produtos);

        console.log(
            `✅ Sincronização concluída. ` +
            `${totalSincronizado} produto(s) salvo(s) ` +
            `no PostgreSQL local.`
        );
    } catch (erro) {
        console.error(
            '❌ Erro durante a sincronização:',
            erro.message
        );

        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

executarSincronizacao();