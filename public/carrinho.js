// =========================================================================
// CARRINHO.JS — ITENS, QUANTIDADES E CÁLCULOS
// =========================================================================

export function adicionarAoCarrinho(id) {
    if (!window.AppState) {
        console.error('AppState não foi inicializado.');
        return false;
    }

    const produto = window.AppState.listaProdutosAtual.find(
        item => Number(item.id) === Number(id)
    );

    if (!produto) {
        console.error(`Produto com ID ${id} não encontrado.`);
        return false;
    }

    const campoNome = document.getElementById(`nome-${id}`);
    const campoTamanho = document.getElementById(`tam-${id}`);

    if (
        produto.tamanho &&
        campoTamanho &&
        !campoTamanho.value
    ) {
        alert('Selecione o tamanho antes de adicionar o produto.');
        campoTamanho.focus();
        return false;
    }

    const nomePersonalizado =
        campoNome?.value.trim() || '';

    const numeroPersonalizado =
        campoTamanho?.value || '';

    const itemExistente =
        window.AppState.carrinho.find(item => {
            return (
                Number(item.id) === Number(id) &&
                String(item.nomePersonalizado || '') === nomePersonalizado &&
                String(item.numeroPersonalizado || '') === numeroPersonalizado
            );
        });

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        window.AppState.carrinho.push({
            ...produto,
            quantidade: 1,
            nomePersonalizado,
            numeroPersonalizado
        });
    }

    if (campoNome) {
        campoNome.value = '';
    }

    if (campoTamanho) {
        campoTamanho.value = '';
    }

    return true;
}

export function alterarQuantidade(index, delta) {
    if (!window.AppState) {
        return;
    }

    const item = window.AppState.carrinho[index];

    if (!item) {
        return;
    }

    item.quantidade =
        Number(item.quantidade || 0) +
        Number(delta || 0);

    if (item.quantidade <= 0) {
        window.AppState.carrinho.splice(index, 1);
    }
}

export function removerItemCarrinho(index) {
    if (
        !window.AppState ||
        !window.AppState.carrinho[index]
    ) {
        return;
    }

    window.AppState.carrinho.splice(index, 1);
}

/**
 * Calcula os totais do carrinho.
 *
 * Não existem promoções automáticas ou combos fixos.
 *
 * A promoção PIX somente será aplicada quando o produto possuir:
 *
 * - precoPromocional válido;
 * - quantidadeMinimaPromo atingida.
 *
 * @param {Array} carrinho
 * @returns {{totalPix: number, totalCartao: number}}
 */
export function calcularTotal(
    carrinho = window.AppState?.carrinho || []
) {
    let totalPix = 0;
    let totalCartao = 0;

    carrinho.forEach(item => {
        const quantidade = Math.max(
            1,
            Number(item.quantidade) || 1
        );

        const precoNormal =
            Number(item.preco) || 0;

        const precoPromocional =
            item.precoPromocional !== undefined &&
            item.precoPromocional !== null &&
            item.precoPromocional !== ''
                ? Number(item.precoPromocional)
                : null;

        const quantidadeMinima = Math.max(
            1,
            Number(item.quantidadeMinimaPromo) || 1
        );

        const promocaoValida =
            precoPromocional !== null &&
            Number.isFinite(precoPromocional) &&
            precoPromocional >= 0 &&
            precoPromocional < precoNormal &&
            quantidade >= quantidadeMinima;

        const precoUnitarioPix =
            promocaoValida
                ? precoPromocional
                : precoNormal;

        totalPix +=
            quantidade * precoUnitarioPix;

        totalCartao +=
            quantidade * precoNormal;
    });

    return {
        totalPix,
        totalCartao
    };
}

export function renderizarCarrinho() {
    const container = document.getElementById(
        'conteudo-carrinho'
    );

    if (
        !container ||
        !window.AppState
    ) {
        return;
    }

    const carrinho =
        window.AppState.carrinho;

    atualizarBadgeCarrinho(carrinho);

    if (carrinho.length === 0) {
        container.innerHTML = `
            <p class="mensagem-vazia">
                Seu carrinho está vazio.
            </p>
        `;

        return;
    }

    const {
        totalPix,
        totalCartao
    } = calcularTotal(carrinho);

    container.innerHTML = `
        <div class="lista-itens-carrinho">
            ${carrinho
                .map(criarItemCarrinho)
                .join('')}
        </div>

        <div class="bloco-batalhao">
            <label for="input-batalhao">
                Batalhão / OM / Unidade
            </label>

            <input
                type="text"
                id="input-batalhao"
                placeholder="Ex.: 11º BPM/I, C-Choque"
                value="${escaparHtml(
                    window.AppState.usuarioLogado?.batalhao || ''
                )}"
            >
        </div>

        <div id="painel-total">
            <p>
                Total PIX:
                <span class="valor-destaque">
                    R$ ${totalPix.toFixed(2)}
                </span>
            </p>

            <p>
                Total cartão:
                <span class="valor-destaque">
                    R$ ${totalCartao.toFixed(2)}
                </span>
            </p>

            <button
                type="button"
                id="btn-finalizar"
                onclick="finalizarPedidoWhatsApp()"
            >
                Finalizar via WhatsApp
            </button>
        </div>
    `;
}

function criarItemCarrinho(item, index) {
    const nomeHtml = item.nomePersonalizado
        ? `
            <small>
                Nome: ${escaparHtml(item.nomePersonalizado)}
            </small>
        `
        : '';

    const tamanhoHtml = item.numeroPersonalizado
        ? `
            <small>
                Tamanho: ${escaparHtml(item.numeroPersonalizado)}
            </small>
        `
        : '';

    return `
        <div class="item-carrinho">
            <div class="item-carrinho-info">
                <strong>
                    ${escaparHtml(item.titulo)}
                </strong>

                ${nomeHtml}
                ${tamanhoHtml}
            </div>

            <div class="item-carrinho-qtd">
                <button
                    type="button"
                    class="btn-qtd"
                    onclick="alterarQuantidade(${index}, -1)"
                >
                    −
                </button>

                <span>
                    ${Number(item.quantidade) || 1}x
                </span>

                <button
                    type="button"
                    class="btn-qtd"
                    onclick="alterarQuantidade(${index}, 1)"
                >
                    +
                </button>

                <button
                    type="button"
                    class="btn-remover-item"
                    onclick="removerItemCarrinho(${index})"
                >
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function atualizarBadgeCarrinho(carrinho) {
    const badge = document.getElementById(
        'contador-carrinho-badge'
    );

    if (!badge) {
        return;
    }

    const totalItens = carrinho.reduce(
        (total, item) => {
            return total +
                (Number(item.quantidade) || 0);
        },
        0
    );

    badge.textContent = String(totalItens);
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}