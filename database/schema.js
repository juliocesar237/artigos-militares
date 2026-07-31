const db = require('./index');

function criarTabelas() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            telefone TEXT,
            patente TEXT,
            administrador INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            categoria TEXT NOT NULL,
            patente TEXT,
            preco REAL NOT NULL,
            preco_promocional REAL,
            quantidade_minima_promo INTEGER DEFAULT 1,
            imagem TEXT,
            estoque INTEGER DEFAULT 0,
            personalizavel INTEGER DEFAULT 0,
            tamanho INTEGER DEFAULT 1,
            ativo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            status TEXT DEFAULT 'pendente',
            forma_pagamento TEXT,
            total_pix REAL,
            total_cartao REAL,
            batalhao TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS pedido_itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER,
            produto_id INTEGER,
            quantidade INTEGER NOT NULL,
            tamanho TEXT,
            personalizacao TEXT,
            valor_unitario REAL NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        );
    `);

    console.log("✅ Tabelas criadas/verificadas com sucesso.");
}

module.exports = { criarTabelas };