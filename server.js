// =========================================================================
// SERVER.JS — SERVIDOR PRINCIPAL
// =========================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { criarTabelas } = require('./database/schema');

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// =========================================================================
// INICIALIZAÇÃO DO BANCO
// =========================================================================

try {
    criarTabelas();
    console.log('✅ Banco de dados inicializado.');
} catch (erro) {
    console.error('❌ Erro ao inicializar o banco:', erro);
    process.exit(1);
}

// =========================================================================
// MIDDLEWARES
// =========================================================================

app.disable('x-powered-by');

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({
    limit: '1mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '1mb'
}));

// =========================================================================
// STATUS DA API
// =========================================================================

app.get('/api/status', (req, res) => {
    res.status(200).json({
        sucesso: true,
        mensagem: 'Servidor Artigos Militares operacional.',
        ambiente: process.env.NODE_ENV || 'development',
        data: new Date().toISOString()
    });
});

// =========================================================================
// ROTAS
// =========================================================================

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// =========================================================================
// RESPOSTA PARA ROTAS DE API INEXISTENTES
// =========================================================================

app.use('/api', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota da API não encontrada.'
    });
});

// =========================================================================
// FRONTEND
// =========================================================================

app.use(express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: process.env.NODE_ENV === 'production'
        ? '1h'
        : 0
}));

// Qualquer rota que não seja /api retorna o index.html.
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    res.sendFile(
        path.join(PUBLIC_DIR, 'index.html'),
        erro => {
            if (erro) {
                next(erro);
            }
        }
    );
});

// =========================================================================
// TRATAMENTO GLOBAL DE ERROS
// =========================================================================

app.use((erro, req, res, next) => {
    console.error('Erro não tratado:', erro);

    if (res.headersSent) {
        return next(erro);
    }

    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor.'
    });
});

// =========================================================================
// INICIALIZAÇÃO
// =========================================================================

const servidor = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);

    if (process.env.NODE_ENV !== 'production') {
        console.log(`👉 http://localhost:${PORT}`);
    }
});

// =========================================================================
// ENCERRAMENTO SEGURO
// =========================================================================

function encerrarServidor(sinal) {
    console.log(`\n${sinal} recebido. Encerrando servidor...`);

    servidor.close(() => {
        console.log('✅ Servidor encerrado.');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Encerramento forçado.');
        process.exit(1);
    }, 10000).unref();
}

process.on('SIGTERM', () => encerrarServidor('SIGTERM'));
process.on('SIGINT', () => encerrarServidor('SIGINT'));