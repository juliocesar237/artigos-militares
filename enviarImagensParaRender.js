require('dotenv').config();

const db = require('./database');

const API_BASE_URL =
    process.env.API_BASE_URL ||
    'https://artigos-militares-pmsp-rkym.onrender.com';

async function executar() {
    const produtos = db
        .prepare(`
            SELECT *
            FROM produtos
            WHERE imagem IS NOT NULL
              AND TRIM(imagem) <> ''
            ORDER BY id
        `)
        .all();

    console.log(
        `📦 ${produtos.length} produto(s) com imagem encontrados no SQLite.`
    );

    let atualizados = 0;
    let erros = 0;

    for (const produto of produtos) {
        try {
            const respostaAtual = await fetch(
                `${API_BASE_URL}/api/produtos/${produto.id}`
            );

            if (!respostaAtual.ok) {
                throw new Error(
                    `Não foi possível consultar o produto ID ${produto.id}.`
                );
            }

            const produtoRender = await respostaAtual.json();

            const produtoAtualizado = {
                ...produtoRender,
                imagem: produto.imagem
            };

            const resposta = await fetch(
                `${API_BASE_URL}/api/produtos/${produto.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(produtoAtualizado)
                }
            );

            if (!resposta.ok) {
                const texto = await resposta.text();

                throw new Error(
                    `HTTP ${resposta.status}: ${texto}`
                );
            }

            atualizados++;

            console.log(
                `✅ ${produto.titulo} → ${produto.imagem}`
            );
        } catch (erro) {
            erros++;

            console.error(
                `❌ Erro no produto ID ${produto.id} (${produto.titulo}):`,
                erro.message
            );
        }
    }

    console.log('\n====================================');
    console.log(`✅ Atualizados: ${atualizados}`);
    console.log(`❌ Erros: ${erros}`);
    console.log('====================================');

    if (erros > 0) {
        process.exitCode = 1;
    }
}

executar().catch(erro => {
    console.error('❌ Falha geral:', erro);
    process.exit(1);
});