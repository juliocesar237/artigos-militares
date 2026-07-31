// =========================================================================
// FILTROS.JS — CONTROLE DE CATEGORIA E PATENTE
// =========================================================================

/**
 * Atualiza o filtro selecionado no estado global da aplicação.
 *
 * @param {'categoria'|'patente'} tipo
 * @param {string} valor
 * @param {HTMLElement|null} botao
 */
export function filtrar(tipo, valor, botao = null) {
    if (!window.AppState) {
        console.error(
            'AppState não foi inicializado antes da execução dos filtros.'
        );

        return;
    }

    const valorNormalizado = String(valor || '')
        .trim()
        .toLowerCase();

    if (tipo === 'categoria') {
        window.AppState.categoriaAtual =
            valorNormalizado || 'todos';
    } else if (tipo === 'patente') {
        window.AppState.patenteAtual =
            valorNormalizado || 'todos';
    } else {
        console.warn(
            `Tipo de filtro inválido: ${tipo}`
        );

        return;
    }

    atualizarEstadoVisual(botao);
}

/**
 * Remove a classe "ativo" dos botões do mesmo grupo
 * e aplica no botão selecionado.
 *
 * @param {HTMLElement|null} botao
 */
function atualizarEstadoVisual(botao) {
    if (
        !botao ||
        !botao.parentElement
    ) {
        return;
    }

    const botoesDoGrupo =
        botao.parentElement.querySelectorAll(
            '.filtro-btn'
        );

    botoesDoGrupo.forEach(item => {
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
 * Restaura todos os filtros ao estado inicial.
 */
export function limparFiltros() {
    if (!window.AppState) {
        return;
    }

    window.AppState.categoriaAtual = 'todos';
    window.AppState.patenteAtual = 'todos';
    window.AppState.textoBusca = '';

    const campoBusca = document.getElementById(
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
}

/**
 * Ativa o primeiro botão de um grupo de filtros.
 *
 * @param {string} containerId
 */
function restaurarBotoesFiltro(containerId) {
    const container = document.getElementById(
        containerId
    );

    if (!container) {
        return;
    }

    const botoes = container.querySelectorAll(
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