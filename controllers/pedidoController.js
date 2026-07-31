// =========================================================================
// PEDIDOCONTROLLER.JS — PEDIDOS E ITENS
// =========================================================================

const db = require('../database');

// =========================================================================
// CRIAR PEDIDO
// =========================================================================

exports.criarPedido = (req, res) => {
    try {
        const validacao = validarPedido(req.body);

        if (!validacao.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: validacao.erro
            });
        }

        const {
            usuarioId,
            formaPagamento,
            totalPix,
            totalCartao,
            batalhao,
            itens
        } = validacao.pedido;

        const usuarioExiste = db.prepare(`
            SELECT id
            FROM usuarios
            WHERE id = ?
        `).get(usuarioId);

        if (!usuarioExiste) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Usuário não encontrado.'
            });
        }

        const salvarPedido = db.transaction(() => {
            const resultadoPedido = db.prepare(`
                INSERT INTO pedidos (
                    usuario_id,
                    status,
                    forma_pagamento,
                    total_pix,
                    total_cartao,
                    batalhao
                )
                VALUES (?, 'pendente', ?, ?, ?, ?)
            `).run(
                usuarioId,
                formaPagamento,
                totalPix,
                totalCartao,
                batalhao
            );

            const pedidoId = Number(
                resultadoPedido.lastInsertRowid
            );

            const inserirItem = db.prepare(`
                INSERT INTO pedido_itens (
                    pedido_id,
                    produto_id,
                    quantidade,
                    tamanho,
                    personalizacao,
                    valor_unitario
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            for (const item of itens) {
                inserirItem.run(
                    pedidoId,
                    item.produtoId,
                    item.quantidade,
                    item.tamanho,
                    item.personalizacao,
                    item.valorUnitario
                );
            }

            return pedidoId;
        });

        const pedidoId = salvarPedido();

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido realizado com sucesso.',
            pedidoId
        });
    } catch (erro) {
        console.error('Erro ao registrar pedido:', erro);

        if (
            erro.code === 'SQLITE_CONSTRAINT_FOREIGNKEY'
        ) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Usuário ou produto inválido.'
            });
        }

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao registrar o pedido.'
        });
    }
};

// =========================================================================
// LISTAR PEDIDOS DO USUÁRIO
// =========================================================================

exports.listarPorUsuario = (req, res) => {
    try {
        const usuarioId = Number(
            req.params.usuarioId
        );

        const pedidos = db.prepare(`
            SELECT *
            FROM pedidos
            WHERE usuario_id = ?
            ORDER BY created_at DESC
        `).all(usuarioId);

        const buscarItens = db.prepare(`
            SELECT
                pi.*,
                p.titulo AS produto_titulo
            FROM pedido_itens pi
            LEFT JOIN produtos p
                ON p.id = pi.produto_id
            WHERE pi.pedido_id = ?
            ORDER BY pi.id ASC
        `);

        const resultado = pedidos.map(pedido => ({
            id: pedido.id,
            usuarioId: pedido.usuario_id,
            status: pedido.status,
            formaPagamento: pedido.forma_pagamento,
            totalPix: Number(pedido.total_pix) || 0,
            totalCartao: Number(pedido.total_cartao) || 0,
            batalhao: pedido.batalhao,
            criadoEm: pedido.created_at,

            itens: buscarItens
                .all(pedido.id)
                .map(item => ({
                    id: item.id,
                    produtoId: item.produto_id,
                    titulo: item.produto_titulo,
                    quantidade: item.quantidade,
                    tamanho: item.tamanho,
                    personalizacao: item.personalizacao,
                    valorUnitario:
                        Number(item.valor_unitario)
                }))
        }));

        return res.status(200).json(resultado);
    } catch (erro) {
        console.error('Erro ao buscar pedidos:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar pedidos.'
        });
    }
};

// =========================================================================
// FUNÇÕES AUXILIARES
// =========================================================================

function validarPedido(body) {
    const usuarioId = Number(
        body.usuario_id ??
        body.usuarioId
    );

    const itensRecebidos = body.itens;

    if (
        !Number.isInteger(usuarioId) ||
        usuarioId <= 0
    ) {
        return {
            valido: false,
            erro: 'O usuário do pedido é inválido.'
        };
    }

    if (
        !Array.isArray(itensRecebidos) ||
        itensRecebidos.length === 0
    ) {
        return {
            valido: false,
            erro: 'O carrinho está vazio.'
        };
    }

    const itens = [];

    for (const item of itensRecebidos) {
        const produtoId = Number(
            item.produto_id ??
            item.produtoId
        );

        const quantidade = Number.parseInt(
            item.quantidade,
            10
        );

        const valorUnitario = Number(
            item.valor_unitario ??
            item.valorUnitario
        );

        if (
            !Number.isInteger(produtoId) ||
            produtoId <= 0
        ) {
            return {
                valido: false,
                erro: 'Um dos produtos é inválido.'
            };
        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade <= 0
        ) {
            return {
                valido: false,
                erro: 'A quantidade de um item é inválida.'
            };
        }

        if (
            !Number.isFinite(valorUnitario) ||
            valorUnitario < 0
        ) {
            return {
                valido: false,
                erro: 'O valor de um item é inválido.'
            };
        }

        itens.push({
            produtoId,
            quantidade,
            tamanho:
                String(item.tamanho || '').trim() ||
                null,
            personalizacao:
                String(item.personalizacao || '').trim() ||
                null,
            valorUnitario
        });
    }

    const totalPix = Number(
        body.total_pix ??
        body.totalPix ??
        0
    );

    const totalCartao = Number(
        body.total_cartao ??
        body.totalCartao ??
        0
    );

    if (
        !Number.isFinite(totalPix) ||
        totalPix < 0 ||
        !Number.isFinite(totalCartao) ||
        totalCartao < 0
    ) {
        return {
            valido: false,
            erro: 'Os totais do pedido são inválidos.'
        };
    }

    return {
        valido: true,
        pedido: {
            usuarioId,
            formaPagamento:
                String(
                    body.forma_pagamento ??
                    body.formaPagamento ??
                    ''
                ).trim() || null,
            totalPix,
            totalCartao,
            batalhao:
                String(body.batalhao || '').trim() ||
                null,
            itens
        }
    };
}