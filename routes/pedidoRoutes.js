// =========================================================================
// PEDIDOROUTES.JS — ROTAS DE PEDIDOS
// =========================================================================

const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

/**
 * Valida IDs numéricos antes de chamar o controller.
 */
function validarUsuarioId(req, res, next) {
    const usuarioId = Number(req.params.usuarioId);

    if (
        !Number.isInteger(usuarioId) ||
        usuarioId <= 0
    ) {
        return res.status(400).json({
            erro: 'O ID do usuário é inválido.'
        });
    }

    req.params.usuarioId = usuarioId;

    next();
}

/*
 * Cria um pedido.
 *
 * POST /api/pedidos
 */
router.post(
    '/',
    pedidoController.criarPedido
);

/*
 * Lista os pedidos de determinado usuário.
 *
 * GET /api/pedidos/usuario/1
 */
router.get(
    '/usuario/:usuarioId',
    validarUsuarioId,
    pedidoController.listarPorUsuario
);

module.exports = router;