// =========================================================================
// PRODUTOROUTES.JS
// =========================================================================

const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

function validarProdutoId(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            sucesso: false,
            erro: 'O ID do produto é inválido.'
        });
    }

    req.params.id = id;
    next();
}

router.get(
    '/',
    produtoController.listarProdutos
);

router.get(
    '/:id',
    validarProdutoId,
    produtoController.buscarPorId
);

router.post(
    '/',
    produtoController.criarProduto
);

router.put(
    '/:id',
    validarProdutoId,
    produtoController.atualizarProduto
);

router.delete(
    '/:id',
    validarProdutoId,
    produtoController.removerProduto
);

module.exports = router;