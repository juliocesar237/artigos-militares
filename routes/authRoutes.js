// =========================================================================
// AUTHROUTES.JS — ROTAS DE AUTENTICAÇÃO
// =========================================================================

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/*
 * Cadastro de usuário.
 *
 * Mantemos as duas versões para evitar incompatibilidade:
 *
 * POST /api/auth/registrar
 * POST /api/auth/register
 */
router.post('/registrar', authController.registrar);
router.post('/register', authController.registrar);

/*
 * Login.
 *
 * POST /api/auth/login
 */
router.post('/login', authController.login);

module.exports = router;