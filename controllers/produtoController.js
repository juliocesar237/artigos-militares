// =========================================================================
// PRODUTOCONTROLLER.JS — CRUD DE PRODUTOS
// =========================================================================

const db = require('../database');

// =========================================================================
// LISTAR
// =========================================================================

exports.listarProdutos = (req, res) => {
    try {
        const produtos = db.prepare(`
            SELECT *
            FROM produtos
            WHERE ativo = 1
            ORDER BY categoria ASC, titulo ASC
        `).all();

        return res.status(200).json(
            produtos.map(formatarProduto)
        );
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar produtos.'
        });
    }
};

// =========================================================================
// BUSCAR POR ID
// =========================================================================

exports.buscarPorId = (req, res) => {
    try {
        const id = Number(req.params.id);

        const produto = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
              AND ativo = 1
        `).get(id);

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Produto não encontrado.'
            });
        }

        return res.status(200).json(
            formatarProduto(produto)
        );
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar o produto.'
        });
    }
};

// =========================================================================
// CRIAR
// =========================================================================

exports.criarProduto = (req, res) => {
    try {
        const dados = validarProduto(req.body);

        if (!dados.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: dados.erro
            });
        }

        const produto = dados.produto;

        const resultado = db.prepare(`
            INSERT INTO produtos (
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
                ativo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
            produto.titulo,
            produto.descricao,
            produto.categoria,
            produto.patente,
            produto.preco,
            produto.precoPromocional,
            produto.quantidadeMinimaPromo,
            produto.imagem,
            produto.estoque,
            produto.personalizavel,
            produto.tamanho
        );

        const produtoCriado = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(resultado.lastInsertRowid);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso.',
            produto: formatarProduto(produtoCriado)
        });
    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao cadastrar produto.'
        });
    }
};

// =========================================================================
// ATUALIZAR
// =========================================================================

exports.atualizarProduto = (req, res) => {
    try {
        const id = Number(req.params.id);

        const produtoExistente = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        if (!produtoExistente) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Produto não encontrado.'
            });
        }

        const dados = validarProduto({
            ...produtoExistente,
            ...req.body
        });

        if (!dados.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: dados.erro
            });
        }

        const produto = dados.produto;

        db.prepare(`
            UPDATE produtos
            SET
                titulo = ?,
                descricao = ?,
                categoria = ?,
                patente = ?,
                preco = ?,
                preco_promocional = ?,
                quantidade_minima_promo = ?,
                imagem = ?,
                estoque = ?,
                personalizavel = ?,
                tamanho = ?
            WHERE id = ?
        `).run(
            produto.titulo,
            produto.descricao,
            produto.categoria,
            produto.patente,
            produto.preco,
            produto.precoPromocional,
            produto.quantidadeMinimaPromo,
            produto.imagem,
            produto.estoque,
            produto.personalizavel,
            produto.tamanho,
            id
        );

        const atualizado = db.prepare(`
            SELECT *
            FROM produtos
            WHERE id = ?
        `).get(id);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso.',
            produto: formatarProduto(atualizado)
        });
    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao atualizar produto.'
        });
    }
};

// =========================================================================
// DESATIVAR
// =========================================================================

exports.removerProduto = (req, res) => {
    try {
        const id = Number(req.params.id);

        const resultado = db.prepare(`
            UPDATE produtos
            SET ativo = 0
            WHERE id = ?
              AND ativo = 1
        `).run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Produto removido com sucesso.'
        });
    } catch (erro) {
        console.error('Erro ao remover produto:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao remover produto.'
        });
    }
};

// =========================================================================
// FUNÇÕES AUXILIARES
// =========================================================================

function validarProduto(body) {
    const titulo = String(body.titulo || '').trim();
    const descricao = String(body.descricao || '').trim();
    const categoria = String(body.categoria || '').trim();
    const patente = String(body.patente || 'geral').trim();

    const preco = Number(body.preco);

    const precoPromocionalBruto =
        body.preco_promocional ??
        body.precoPromocional;

    const precoPromocional =
        precoPromocionalBruto === '' ||
        precoPromocionalBruto === null ||
        precoPromocionalBruto === undefined
            ? null
            : Number(precoPromocionalBruto);

    const quantidadeMinimaPromo = Math.max(
        1,
        Number.parseInt(
            body.quantidade_minima_promo ??
            body.quantidadeMinimaPromo ??
            1,
            10
        ) || 1
    );

    const estoque = Math.max(
        0,
        Number.parseInt(body.estoque ?? 0, 10) || 0
    );

    if (!titulo || !categoria) {
        return {
            valido: false,
            erro: 'Título e categoria são obrigatórios.'
        };
    }

    if (!Number.isFinite(preco) || preco < 0) {
        return {
            valido: false,
            erro: 'O preço informado é inválido.'
        };
    }

    if (
        precoPromocional !== null &&
        (
            !Number.isFinite(precoPromocional) ||
            precoPromocional < 0
        )
    ) {
        return {
            valido: false,
            erro: 'O preço promocional é inválido.'
        };
    }

    return {
        valido: true,
        produto: {
            titulo,
            descricao,
            categoria,
            patente,
            preco,
            precoPromocional,
            quantidadeMinimaPromo,
            imagem: String(body.imagem || '').trim() || null,
            estoque,
            personalizavel: converterBooleanoInteiro(
                body.personalizavel
            ),
            tamanho: converterBooleanoInteiro(
                body.tamanho
            )
        }
    };
}

function converterBooleanoInteiro(valor) {
    return (
        valor === true ||
        valor === 1 ||
        valor === '1' ||
        valor === 'true'
    )
        ? 1
        : 0;
}

function formatarProduto(produto) {
    return {
        id: produto.id,
        titulo: produto.titulo,
        descricao: produto.descricao,
        categoria: produto.categoria,
        patente: produto.patente,
        preco: Number(produto.preco),
        precoPromocional:
            produto.preco_promocional === null
                ? null
                : Number(produto.preco_promocional),
        quantidadeMinimaPromo:
            Number(produto.quantidade_minima_promo) || 1,
        imagem: produto.imagem || '',
        estoque: Number(produto.estoque) || 0,
        personalizavel: Boolean(produto.personalizavel),
        tamanho: Boolean(produto.tamanho),
        ativo: Boolean(produto.ativo)
    };
}