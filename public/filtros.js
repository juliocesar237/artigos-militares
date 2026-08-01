// =========================================================================
// FILTROS.JS — CONTROLE DE CATEGORIA E PATENTE
// =========================================================================

/**
 * Atualiza os filtros de categoria ou patente.
 *
 * @param {'categoria'|'patente'} tipo
 * @param {string} valor
 * @param {HTMLElement|null} botao
 */
export function filtrar(tipo, valor, botao = null) {
    if (!window.AppState) {
        console.error(
            'AppState não foi inicializado antes dos filtros.'
        );

        return false;
    }

    const tipoNormalizado = String(tipo || '')
        .trim()
        .toLowerCase();

    let valorNormalizado = String(valor || '')
        .trim()
        .toLowerCase();

    /*
     * Padroniza todas/todos para "todos".
     */
    if (
        valorNormalizado === 'todas' ||
        valorNormalizado === ''
    ) {
        valorNormalizado = 'todos';
    }

    if (tipoNormalizado === 'categoria') {
        window.AppState.categoriaAtual =
            valorNormalizado;
    } else if (tipoNormalizado === 'patente') {
        window.AppState.patenteAtual =
            valorNormalizado;
    } else {
        console.warn(
            `Tipo de filtro inválido: ${tipo}`
        );

        return false;
    }

    atualizarEstadoVisual(botao);

    /*
     * Renderiza novamente os produtos.
     */
    if (
        typeof window.atualizarInterface ===
        'function'
    ) {
        window.atualizarInterface();
    }

    return true;
}

/**
 * Atualiza visualmente o botão selecionado.
 *
 * @param {HTMLElement|null} botao
 */
function atualizarEstadoVisual(botao) {
    if (!botao) {
        return;
    }

    /*
     * Procura o grupo mais próximo para não depender
     * apenas do elemento pai imediato.
     */
    const grupo =
        botao.closest(
            '#container-categorias, #container-patentes'
        ) ||
        botao.parentElement;

    if (!grupo) {
        return;
    }

    grupo
        .querySelectorAll('.filtro-btn')
        .forEach(item => {
            item.classList.remove('ativo');

            item.setAttribute(
                'aria-pressed',
                'false'
            );
        });

    botao.classList.add('ativo');

    botao.setAttribute(
        'aria-pressed',
        'true'
    );
}

/**
 * Limpa categoria, patente e texto pesquisado.
 */
export function limparFiltros() {
    if (!window.AppState) {
        return false;
    }

    window.AppState.categoriaAtual = 'todos';
    window.AppState.patenteAtual = 'todos';
    window.AppState.textoBusca = '';

    const campoBusca =
        document.getElementById(
            'input-busca-global'
        );

    if (campoBusca) {
        campoBusca.value = '';
    }

    restaurarBotoesFiltro(
        'container-categorias'
    );

    restaurarBotoesFiltro(
        'container-patentes'
    );

    if (
        typeof window.atualizarInterface ===
        'function'
    ) {
        window.atualizarInterface();
    }

    return true;
}

/**
 * Ativa o primeiro botão de determinado grupo.
 *
 * @param {string} containerId
 */
function restaurarBotoesFiltro(containerId) {
    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    const botoes =
        container.querySelectorAll(
            '.filtro-btn'
        );

    botoes.forEach((botao, indice) => {
        const ativo = indice === 0;

        botao.classList.toggle(
            'ativo',
            ativo
        );

        botao.setAttribute(
            'aria-pressed',
            String(ativo)
        );
    });
}