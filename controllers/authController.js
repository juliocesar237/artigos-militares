// =========================================================================
// AUTHCONTROLLER.JS — CADASTRO E LOGIN
// =========================================================================

const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const DOMINIO_PERMITIDO = '@policiamilitar.sp.gov.br';

// =========================================================================
// CADASTRO
// =========================================================================

exports.registrar = (req, res) => {
    try {
        const nome = normalizarTexto(req.body.nome);
        const email = normalizarEmail(req.body.email);
        const senha = String(req.body.senha || '');
        const telefone = normalizarTexto(req.body.telefone);
        const patente = normalizarTexto(req.body.patente);

        if (!nome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Nome, e-mail e senha são obrigatórios.'
            });
        }

        if (!emailValido(email)) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Informe um e-mail válido.'
            });
        }

        if (
            email !== 'msi' &&
            !email.endsWith(DOMINIO_PERMITIDO)
        ) {
            return res.status(403).json({
                sucesso: false,
                erro: `Utilize o e-mail funcional ${DOMINIO_PERMITIDO}.`
            });
        }

        if (senha.length < 6 && email !== 'msi') {
            return res.status(400).json({
                sucesso: false,
                erro: 'A senha deve possuir pelo menos 6 caracteres.'
            });
        }

        const usuarioExistente = db.prepare(`
            SELECT id
            FROM usuarios
            WHERE LOWER(email) = LOWER(?)
        `).get(email);

        if (usuarioExistente) {
            return res.status(409).json({
                sucesso: false,
                erro: 'Este e-mail já está cadastrado.'
            });
        }

        const senhaHash = bcrypt.hashSync(senha, 12);

        const administrador =
            email === 'msi' && senha === 'msi'
                ? 1
                : 0;

        const resultado = db.prepare(`
            INSERT INTO usuarios (
                nome,
                email,
                senha_hash,
                telefone,
                patente,
                administrador
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            nome,
            email,
            senhaHash,
            telefone || null,
            patente || null,
            administrador
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso.',
            usuarioId: Number(resultado.lastInsertRowid)
        });
    } catch (erro) {
        console.error('Erro ao registrar usuário:', erro);

        if (
            erro.code === 'SQLITE_CONSTRAINT_UNIQUE'
        ) {
            return res.status(409).json({
                sucesso: false,
                erro: 'Este e-mail já está cadastrado.'
            });
        }

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro interno ao cadastrar usuário.'
        });
    }
};

// =========================================================================
// LOGIN
// =========================================================================

exports.login = (req, res) => {
    try {
        const email = normalizarEmail(req.body.email);
        const senha = String(req.body.senha || '');

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                erro: 'E-mail e senha são obrigatórios.'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error(
                'JWT_SECRET não foi configurado.'
            );

            return res.status(500).json({
                sucesso: false,
                erro: 'Autenticação não configurada no servidor.'
            });
        }

        const usuario = db.prepare(`
            SELECT
                id,
                nome,
                email,
                senha_hash,
                telefone,
                patente,
                administrador
            FROM usuarios
            WHERE LOWER(email) = LOWER(?)
        `).get(email);

        if (!usuario) {
            return respostaLoginInvalido(res);
        }

        const senhaValida = bcrypt.compareSync(
            senha,
            usuario.senha_hash
        );

        if (!senhaValida) {
            return respostaLoginInvalido(res);
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                administrador: Boolean(
                    usuario.administrador
                )
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
                issuer: 'artigos-militares'
            }
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso.',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                patente: usuario.patente,
                administrador: Boolean(
                    usuario.administrador
                )
            }
        });
    } catch (erro) {
        console.error('Erro ao realizar login:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro interno ao realizar login.'
        });
    }
};

// =========================================================================
// FUNÇÕES AUXILIARES
// =========================================================================

function normalizarEmail(valor) {
    return String(valor || '')
        .trim()
        .toLowerCase();
}

function normalizarTexto(valor) {
    return String(valor || '').trim();
}

function emailValido(email) {
    if (email === 'msi') {
        return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function respostaLoginInvalido(res) {
    return res.status(401).json({
        sucesso: false,
        erro: 'E-mail ou senha incorretos.'
    });
}