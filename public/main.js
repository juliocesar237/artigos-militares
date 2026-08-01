// =========================================================================
// MAIN.JS — ORQUESTRADOR PRINCIPAL
// =========================================================================

import {
    verificarAutenticacao,
    obterUsuarioLogado,
    fazerLogout
} from './auth.js';

import {
    renderizarLogin,
    renderizarCadastro,
    realizarLogin,
    salvarCadastro
} from './login.js';

import {
    carregarProdutos,
    renderizarProdutos,
    renderizarGaleriaFotos,
    voltarParaLoja,
    alternarPainelAdmin,
    adicionarNovoProdutoAdmin,
    removerProdutoAdmin,
    salvarNovosPrecos,
    atualizarPreviaImagemAdmin
} from './produtos.js';

import {
    filtrar
} from './filtros.js';

import {
    adicionarAoCarrinho,
    alterarQuantidade,
    removerItemCarrinho,
    renderizarCarrinho
} from './carrinho.js';

import {
    finalizarPedidoWhatsApp
} from './whatsapp.js';


// =========================================================================
// ESTADO ÚNICO DA APLICAÇÃO
// =========================================================================

window.AppState = {
    categoriaAtual: 'todos',
    patenteAtual: 'todos',
    textoBusca: '',
    carrinho: [],
    listaProdutosAtual: [],
    usuarioLogado: null
};


// =========================================================================
// INICIALIZAÇÃO
// =========================================================================

document.addEventListener(
    'DOMContentLoaded',
    iniciarAplicacao
);

async function iniciarAplicacao() {
    let usuario = null;

    try {
        usuario = verificarAutenticacao();
    } catch (erro) {
        console.error(
            'Erro ao verificar autenticação:',
            erro
        );
    }

    if (usuario) {
        await inicializarSistema(usuario);
        return;
    }

    ocultarLoja();

    renderizarLogin(
        'conteudo-principal'
    );

    atualizarBotaoLogin();
}


/**
 * Inicializa catálogo, carrinho e controles da conta.
 *
 * @param {object} usuario
 */
async function inicializarSistema(usuario) {
    window.AppState.usuarioLogado =
        usuario;

    try {
        const produtos = await carregarProdutos();
        window.AppState.listaProdutosAtual = Array.isArray(produtos) ? produtos : [];
    } catch (erro) {
        console.error('Erro ao carregar produtos na inicialização:', erro);
        window.AppState.listaProdutosAtual = [];
    }

    renderizarEstruturaLoja(usuario);
    mostrarLoja();
    atualizarInterface();
    atualizarBotaoLogin();
}


// =========================================================================
// ESTRUTURA DA ÁREA DO USUÁRIO
// =========================================================================

function renderizarEstruturaLoja(usuario) {
    const container =
        document.getElementById(
            'conteudo-principal'
        );

    if (!container) {
        console.error(
            'Elemento #conteudo-principal não encontrado.'
        );

        return;
    }

    const botaoAdmin =
        usuario?.isAdmin
            ? `
                <button
                    type="button"
                    class="btn-tatico btn-primario"
                    id="btn-painel-admin"
                >
                    ⚙️ Painel administrativo
                </button>
            `
            : '';

    container.innerHTML = `
        <div class="controles-usuario">
            <button
                type="button"
                class="btn-tatico btn-secundario"
                id="btn-galeria-produtos"
            >
                📷 Fotos dos produtos
            </button>

            ${botaoAdmin}

            <button
                type="button"
                class="btn-tatico btn-secundario"
                id="btn-sair-conta"
            >
                Sair
            </button>
        </div>

        <section
            id="painel-admin-container"
            class="painel-admin-container"
            hidden
        ></section>
    `;

    document
        .getElementById(
            'btn-galeria-produtos'
        )
        ?.addEventListener(
            'click',
            abrirGaleria
        );

    document
        .getElementById(
            'btn-painel-admin'
        )
        ?.addEventListener(
            'click',
            alternarPainel
        );

    document
        .getElementById(
            'btn-sair-conta'
        )
        ?.addEventListener(
            'click',
            sairDaConta
        );
}


// =========================================================================
// ATUALIZAÇÃO CENTRAL
// =========================================================================

function atualizarInterface() {
    if (!window.AppState) {
        return;
    }

    if (!Array.isArray(window.AppState.listaProdutosAtual)) {
        window.AppState.listaProdutosAtual = [];
    }

    renderizarProdutos();
    renderizarCarrinho();
    atualizarContadorCarrinho();
}


/**
 * Atualiza o número mostrado no botão do carrinho.
 */
function atualizarContadorCarrinho() {
    const badge =
        document.getElementById(
            'contador-carrinho-badge'
        );

    if (!badge) {
        return;
    }

    const totalItens =
        window.AppState.carrinho.reduce(
            (total, item) => {
                return total +
                    (
                        Number(
                            item.quantidade
                        ) || 0
                    );
            },
            0
        );

    badge.textContent =
        String(totalItens);
}


// =========================================================================
// FILTROS
// =========================================================================

function aplicarFiltro(
    tipo,
    valor,
    botao
) {
    const tipoNormalizado =
        String(tipo || '')
            .trim()
            .toLowerCase();

    const valorNormalizado =
        String(valor || '')
            .trim()
            .toLowerCase();

    /*
     * Atualiza diretamente o AppState.
     * Isso garante compatibilidade mesmo que filtros.js
     * mantenha estado interno separado.
     */
    if (tipoNormalizado === 'categoria') {
        window.AppState.categoriaAtual =
            valorNormalizado === 'todas'
                ? 'todos'
                : valorNormalizado;
    }

    if (tipoNormalizado === 'patente') {
        window.AppState.patenteAtual =
            valorNormalizado === 'todas'
                ? 'todos'
                : valorNormalizado;
    }

    /*
     * Mantém o controle visual do botão ativo.
     */
    if (botao?.parentElement) {
        botao.parentElement
            .querySelectorAll('.filtro-btn')
            .forEach(item => {
                item.classList.remove('ativo');
            });

        botao.classList.add('ativo');
    }

    /*
     * Executa também a função do módulo de filtros.
     */
    try {
        filtrar(
            tipo,
            valor,
            botao
        );
    } catch (erro) {
        console.warn(
            'O filtro foi aplicado pelo AppState, mas filtros.js apresentou erro:',
            erro
        );
    }

    atualizarInterface();
}


// =========================================================================
// BUSCA
// =========================================================================

function executarBuscaInstantanea(termo) {
    const texto =
        String(termo || '');

    window.AppState.textoBusca =
        texto
            .trim()
            .toLowerCase();

    const input =
        document.getElementById(
            'input-busca-global'
        );

    if (
        input &&
        input.value !== texto
    ) {
        input.value = texto;
    }

    atualizarInterface();
}


// =========================================================================
// CARRINHO
// =========================================================================

function adicionarProdutoAoCarrinho(id) {
    const foiAdicionado =
        adicionarAoCarrinho(
            Number(id)
        );

    if (foiAdicionado) {
        atualizarInterface();
    }

    return foiAdicionado;
}


function mudarQuantidade(
    index,
    delta
) {
    alterarQuantidade(
        Number(index),
        Number(delta)
    );

    atualizarInterface();
}


function removerProdutoDoCarrinho(index) {
    removerItemCarrinho(
        Number(index)
    );

    atualizarInterface();
}


function toggleCarrinhoLateral() {
    const carrinho =
        document.getElementById(
            'resumo-carrinho'
        );

    if (!carrinho) {
        return;
    }

    carrinho.classList.toggle(
        'ativo'
    );

    carrinho.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


// =========================================================================
// GALERIA
// =========================================================================

function abrirGaleria() {
    renderizarGaleriaFotos();

    document
        .getElementById(
            'conteudo-galeria-fotos'
        )
        ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
}


function fecharGaleria() {
    voltarParaLoja();
}


// =========================================================================
// PAINEL ADMINISTRATIVO
// =========================================================================

function alternarPainel() {
    alternarPainelAdmin();
}


function cadastrarProduto(event) {
    const cadastrado =
        adicionarNovoProdutoAdmin(
            event
        );

    if (cadastrado) {
        atualizarInterface();
    }

    return cadastrado;
}


function removerProduto(id) {
    const removido =
        removerProdutoAdmin(
            Number(id)
        );

    if (removido) {
        atualizarInterface();
    }

    return removido;
}


function salvarAlteracoesProdutos() {
    const salvo =
        salvarNovosPrecos();

    if (salvo) {
        atualizarInterface();
    }

    return salvo;
}


function atualizarPreviaImagem(id) {
    atualizarPreviaImagemAdmin(
        Number(id)
    );
}


// =========================================================================
// AUTENTICAÇÃO
// =========================================================================

function abrirAreaLogin() {
    let usuario = null;

    try {
        usuario =
            obterUsuarioLogado();
    } catch (erro) {
        console.error(
            'Erro ao obter usuário:',
            erro
        );
    }

    if (usuario) {
        document
            .getElementById(
                'conteudo-principal'
            )
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        return;
    }

    ocultarLoja();

    renderizarLogin(
        'conteudo-principal'
    );

    document
        .getElementById(
            'conteudo-principal'
        )
        ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
}


function sairDaConta() {
    fazerLogout();
}


function atualizarBotaoLogin() {
    const botao =
        document.getElementById(
            'btn-login-header'
        );

    if (!botao) {
        return;
    }

    let usuario = null;

    try {
        usuario =
            obterUsuarioLogado();
    } catch {
        usuario =
            window.AppState.usuarioLogado;
    }

    if (usuario) {
        botao.innerHTML =
            '👤 Minha conta';

        botao.setAttribute(
            'aria-label',
            'Abrir área da conta'
        );

        return;
    }

    botao.innerHTML =
        '👤 Entrar';

    botao.setAttribute(
        'aria-label',
        'Abrir área de acesso'
    );
}


// =========================================================================
// VISIBILIDADE
// =========================================================================

function mostrarLoja() {
    const areaLoja =
        document.getElementById(
            'area-dinamica-loja'
        );

    if (!areaLoja) {
        return;
    }

    areaLoja.hidden = false;
    areaLoja.style.display = 'block';
}


function ocultarLoja() {
    const areaLoja =
        document.getElementById(
            'area-dinamica-loja'
        );

    if (!areaLoja) {
        return;
    }

    areaLoja.hidden = true;
    areaLoja.style.display = 'none';
}


// =========================================================================
// FUNÇÕES GLOBAIS USADAS PELO HTML
// =========================================================================

window.atualizarInterface =
    atualizarInterface;

window.verificarAutenticacao =
    abrirAreaLogin;

window.executarBuscaInstantanea =
    executarBuscaInstantanea;

window.filtrar =
    aplicarFiltro;

window.toggleCarrinhoLateral =
    toggleCarrinhoLateral;

window.adicionarAoCarrinho =
    adicionarProdutoAoCarrinho;

window.alterarQuantidade =
    mudarQuantidade;

window.removerItemCarrinho =
    removerProdutoDoCarrinho;

window.finalizarPedidoWhatsApp =
    finalizarPedidoWhatsApp;

window.renderizarGaleriaFotos =
    abrirGaleria;

window.voltarParaLoja =
    fecharGaleria;

window.alternarPainelAdmin =
    alternarPainel;

window.adicionarNovoProdutoAdmin =
    cadastrarProduto;

window.removerProdutoAdmin =
    removerProduto;

window.salvarNovosPrecos =
    salvarAlteracoesProdutos;

window.atualizarPreviaImagemAdmin =
    atualizarPreviaImagem;

window.fazerLogout =
    sairDaConta;

window.renderizarLogin =
    renderizarLogin;

window.renderizarCadastro =
    renderizarCadastro;

window.realizarLogin =
    realizarLogin;

window.salvarCadastro =
    salvarCadastro;