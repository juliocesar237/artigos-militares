// =========================================================================
// SEEDPRODUTOS.JS — CATÁLOGO INICIAL
// =========================================================================

const db = require('./database');
const {
    criarTabelas
} = require('./database/schema');

/**
 * Cria as tabelas e insere o catálogo inicial
 * somente quando a tabela produtos estiver vazia.
 */
function executarSeed() {
    try {
        // Garante que a tabela produtos exista antes do SELECT.
        criarTabelas();

        const resultadoContagem = db
            .prepare(`
                SELECT COUNT(*) AS total
                FROM produtos
            `)
            .get();

        const totalExistente =
            Number(resultadoContagem?.total) || 0;

        if (totalExistente > 0) {
            console.log(
                `O banco já possui ${totalExistente} produto(s). Seed cancelado.`
            );

            return;
        }

        const produtos = [
            // =============================================================
            // UNIFORMES
            // =============================================================

            {
                titulo: 'Agasalho — SD',
                categoria: 'Uniformes',
                patente: 'sd',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Agasalho — CB',
                categoria: 'Uniformes',
                patente: 'cb',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Agasalho — SGT',
                categoria: 'Uniformes',
                patente: 'sgt',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Camiseta de Educação Física — SD',
                categoria: 'Uniformes',
                patente: 'sd',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Camiseta de Educação Física — CB',
                categoria: 'Uniformes',
                patente: 'cb',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Camiseta de Educação Física — SGT',
                categoria: 'Uniformes',
                patente: 'sgt',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Camiseta Cinza',
                categoria: 'Uniformes',
                patente: 'geral',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Short de Educação Física — SD',
                categoria: 'Uniformes',
                patente: 'sd',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Short de Educação Física — CB',
                categoria: 'Uniformes',
                patente: 'cb',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Short de Educação Física — SGT',
                categoria: 'Uniformes',
                patente: 'sgt',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Short Térmico',
                categoria: 'Uniformes',
                patente: 'geral',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Sunga Box — SD',
                categoria: 'Uniformes',
                patente: 'sd',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Sunga Box — CB',
                categoria: 'Uniformes',
                patente: 'cb',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Sunga Box — SGT',
                categoria: 'Uniformes',
                patente: 'sgt',
                tamanho: 1,
                personalizavel: 0
            },
            {
                titulo: 'Sunga Box — Oficiais',
                categoria: 'Uniformes',
                patente: 'geral',
                tamanho: 1,
                personalizavel: 0
            },

            // =============================================================
            // BORDADOS
            // =============================================================

            {
                titulo: 'Curso de SD',
                categoria: 'Bordados',
                patente: 'sd',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Curso de SGT',
                categoria: 'Bordados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Curso CAIS',
                categoria: 'Bordados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Bandeira Paulista Bordada',
                categoria: 'Bordados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },

            // =============================================================
            // EMBORRACHADOS
            // =============================================================

            {
                titulo: 'Listel',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Logo Colorido',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Polícia Militar Emborrachado para as Costas',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Láureas de Garrafão Emborrachadas',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Cursos Emborrachados',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Patrulheiro Emborrachado',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Direção Defensiva',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Trânsito Urbano',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Bandeira Paulista Emborrachada',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Brasões dos Batalhões Emborrachados',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Colete Modular — SD',
                categoria: 'Emborrachados',
                patente: 'sd',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Colete Modular — CB',
                categoria: 'Emborrachados',
                patente: 'cb',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Colete Modular — 3º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Colete Modular — 2º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Colete Modular — 1º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — SD',
                categoria: 'Emborrachados',
                patente: 'sd',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — CB',
                categoria: 'Emborrachados',
                patente: 'cb',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — 3º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — 2º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — 1º SGT',
                categoria: 'Emborrachados',
                patente: 'sgt',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — Subtenente',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — Bucaneiro',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Divisa Emborrachada para Gandola — Bomboneiro',
                categoria: 'Emborrachados',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },

            // =============================================================
            // ACESSÓRIOS
            // =============================================================

            {
                titulo: 'Faixa Refletiva',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Coldre da DM',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Carregador Bélica de Polímero',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Alicate Multiuso',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Porta-Carregador de Fuzil',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Faca Padrão da Polícia — Modelo 1',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Faca Padrão da Polícia — Modelo 2',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Lanterna USB',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Verniz 250 ml',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Verniz 100 ml',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Graxa',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Cadeado com Segredo',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Cadeado com Chave',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Organizador de Armário',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Transportador de Farda',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Prancheta Personalizada',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 1
            },
            {
                titulo: 'Elástico para Prancheta Personalizada',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 1
            },
            {
                titulo: 'Kit Escova de Sapato',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Bandoleira — 1 Ponta',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Bandoleira — 2 Pontas',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Bandoleira — 3 Pontas',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Capa Modular',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Abafador Auricular',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Adaptador de Perna para Coldre da PM',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Priscila Emborrachada',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Priscila de Pano',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Touca de Natação',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            },
            {
                titulo: 'Protetor Lombar',
                categoria: 'Acessórios',
                patente: 'geral',
                tamanho: 0,
                personalizavel: 0
            }
        ];

        const inserirProduto = db.prepare(`
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
            VALUES (
                @titulo,
                @descricao,
                @categoria,
                @patente,
                @preco,
                @precoPromocional,
                @quantidadeMinimaPromo,
                @imagem,
                @estoque,
                @personalizavel,
                @tamanho,
                @ativo
            )
        `);

        const inserirTodos = db.transaction(itens => {
            for (const item of itens) {
                inserirProduto.run({
                    titulo: item.titulo,
                    descricao: '',
                    categoria: item.categoria,
                    patente: item.patente,
                    preco: 0,
                    precoPromocional: null,
                    quantidadeMinimaPromo: 1,
                    imagem: null,
                    estoque: 0,
                    personalizavel:
                        Number(item.personalizavel) === 1
                            ? 1
                            : 0,
                    tamanho:
                        Number(item.tamanho) === 1
                            ? 1
                            : 0,
                    ativo: 1
                });
            }
        });

        inserirTodos(produtos);

        console.log(
            `Seed concluído com sucesso. ${produtos.length} produtos inseridos.`
        );
    } catch (erro) {
        console.error(
            'Erro ao executar seed:',
            erro
        );

        // Faz o comando "node seedProdutos.js && node server.js"
        // parar quando o seed falhar.
        process.exitCode = 1;
    } finally {
        if (
            db &&
            typeof db.close === 'function' &&
            db.open
        ) {
            db.close();
        }
    }
}

executarSeed();