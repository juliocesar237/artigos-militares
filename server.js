// =========================================================================
// SERVER.JS — SERVIDOR PRINCIPAL
// =========================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

require('dotenv').config();

const { criarTabelas } = require('./database/schema');

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// =========================================================================
// UPLOAD LOCAL DE IMAGENS
// =========================================================================

const PRODUTOS_UPLOAD_DIR = path.join(
    PUBLIC_DIR,
    'assets',
    'produtos'
);

fs.mkdirSync(PRODUTOS_UPLOAD_DIR, {
    recursive: true
});

function normalizarNomeArquivo(nome) {
    const extensao = path
        .extname(nome)
        .toLowerCase();

    const nomeSemExtensao = path
        .basename(nome, extensao)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${nomeSemExtensao || 'produto'}${extensao}`;
}

const armazenamentoUpload = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, PRODUTOS_UPLOAD_DIR);
    },

    filename: (req, file, callback) => {
        const nomeSolicitado = String(
            req.query.nome || file.originalname
        ).trim();

        const nomeSeguro =
            normalizarNomeArquivo(nomeSolicitado);

        const substituir =
            String(req.query.substituir || '') === 'true';

        if (substituir) {
            callback(null, nomeSeguro);
            return;
        }

        const extensao =
            path.extname(nomeSeguro);

        const base =
            path.basename(nomeSeguro, extensao);

        const nomeFinal =
            `${base}-${Date.now()}${extensao}`;

        callback(null, nomeFinal);
    }
});

const uploadImagem = multer({
    storage: armazenamentoUpload,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, callback) => {
        const tiposPermitidos = new Set([
            'image/jpeg',
            'image/png',
            'image/webp'
        ]);

        const extensoesPermitidas = new Set([
            '.jpg',
            '.jpeg',
            '.png',
            '.webp'
        ]);

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();

        if (
            !tiposPermitidos.has(file.mimetype) ||
            !extensoesPermitidas.has(extensao)
        ) {
            return callback(
                new Error(
                    'Use somente imagens JPG, JPEG, PNG ou WEBP.'
                )
            );
        }

        callback(null, true);
    }
});

// =========================================================================
// INICIALIZAÇÃO DO BANCO
// =========================================================================

try {
    criarTabelas();
    console.log('✅ Banco de dados inicializado.');
} catch (erro) {
    console.error(
        '❌ Erro ao inicializar o banco:',
        erro
    );

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
        mensagem:
            'Servidor Artigos Militares operacional.',
        ambiente:
            process.env.NODE_ENV || 'development',
        data:
            new Date().toISOString()
    });
});

// =========================================================================
// ROTAS PRINCIPAIS
// =========================================================================

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// =========================================================================
// ROTA DE UPLOAD DE IMAGEM
// =========================================================================

app.post(
    '/api/upload-imagem',

    (req, res, next) => {
        /*
         * O sistema de arquivos do Render não é persistente.
         * Portanto, o upload direto fica disponível apenas localmente.
         */
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                sucesso: false,
                erro:
                    'O upload direto está disponível somente no ambiente local.'
            });
        }

        return uploadImagem.single('imagem')(
            req,
            res,
            next
        );
    },

    (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                sucesso: false,
                erro:
                    'Nenhuma imagem foi enviada.'
            });
        }

        const urlImagem =
            `/assets/produtos/${req.file.filename}`;

        return res.status(201).json({
            sucesso: true,
            mensagem:
                'Imagem enviada com sucesso.',
            nomeArquivo:
                req.file.filename,
            url:
                urlImagem
        });
    }
);

// =========================================================================
// RESPOSTA PARA ROTAS DE API INEXISTENTES
// =========================================================================

app.use('/api', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro:
            'Rota da API não encontrada.'
    });
});

// =========================================================================
// FRONTEND
// =========================================================================

app.use(express.static(PUBLIC_DIR, {
    extensions: ['html'],

    maxAge:
        process.env.NODE_ENV === 'production'
            ? '1h'
            : 0
}));

// Qualquer rota GET que não seja /api retorna o index.html.
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    res.sendFile(
        path.join(
            PUBLIC_DIR,
            'index.html'
        ),

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
    console.error(
        'Erro não tratado:',
        erro
    );

    if (erro instanceof multer.MulterError) {
        if (erro.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                sucesso: false,
                erro:
                    'A imagem deve ter no máximo 5 MB.'
            });
        }

        return res.status(400).json({
            sucesso: false,
            erro:
                `Erro no upload: ${erro.message}`
        });
    }

    if (
        erro?.message?.includes(
            'Use somente imagens'
        )
    ) {
        return res.status(400).json({
            sucesso: false,
            erro:
                erro.message
        });
    }

    if (res.headersSent) {
        return next(erro);
    }

    res.status(500).json({
        sucesso: false,
        erro:
            'Erro interno do servidor.'
    });
});

// =========================================================================
// INICIALIZAÇÃO
// =========================================================================

const servidor = app.listen(
    PORT,
    '0.0.0.0',

    () => {
        console.log(
            `🚀 Servidor rodando na porta ${PORT}`
        );

        if (
            process.env.NODE_ENV !== 'production'
        ) {
            console.log(
                `👉 http://localhost:${PORT}`
            );
        }
    }
);

// =========================================================================
// ENCERRAMENTO SEGURO
// =========================================================================

function encerrarServidor(sinal) {
    console.log(
        `\n${sinal} recebido. Encerrando servidor...`
    );

    servidor.close(() => {
        console.log(
            '✅ Servidor encerrado.'
        );

        process.exit(0);
    });

    setTimeout(() => {
        console.error(
            'Encerramento forçado.'
        );

        process.exit(1);
    }, 10000).unref();
}

process.on(
    'SIGTERM',
    () => encerrarServidor('SIGTERM')
);

process.on(
    'SIGINT',
    () => encerrarServidor('SIGINT')
);