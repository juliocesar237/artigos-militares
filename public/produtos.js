// =========================================================================
// PRODUTOS.JS — CATÁLOGO, GALERIA E PAINEL ADMINISTRATIVO
// =========================================================================

export const produtosPadrao = [
    { id: 1, categoria: "Bordados", patente: "sd", titulo: "Curso de SD", preco: 8.0, precoPromocional: null, quantidadeMinimaPromo: 1, imagem: "" },
    { id: 2, categoria: "Bordados", patente: "sgt", titulo: "Curso de SGT", preco: 8.0, precoPromocional: null, quantidadeMinimaPromo: 1, imagem: "" },
    { id: 3, categoria: "Bordados", patente: "geral", titulo: "Curso CAIS", preco: 8.0, imagem: "" },
    { id: 4, categoria: "Bordados", patente: "geral", titulo: "Bandeira Paulista Bordada", preco: 10.0, imagem: "" },
    { id: 5, categoria: "Bordados", patente: "geral", titulo: "Targeta operacional", preco: 8.0, personalizavel: true, imagem: "" },
    { id: 6, categoria: "Bordados", patente: "geral", titulo: "Targeta ed fisica", preco: 8.0, personalizavel: true, imagem: "" },

    { id: 7, categoria: "Emborrachados", patente: "geral", titulo: "Listel", preco: 20.0, imagem: "" },
    { id: 8, categoria: "Emborrachados", patente: "geral", titulo: "Logo Colorido", preco: 20.0, imagem: "" },
    { id: 9, categoria: "Emborrachados", patente: "geral", titulo: "Polícia Militar Emborrachado (Costas)", preco: 30.0, imagem: "" },
    { id: 10, categoria: "Emborrachados", patente: "geral", titulo: "Láureas de Garrafão Emborrachados", preco: 20.0, imagem: "" },
    { id: 11, categoria: "Emborrachados", patente: "geral", titulo: "Cursos Emborrachados", preco: 20.0, imagem: "" },
    { id: 12, categoria: "Emborrachados", patente: "geral", titulo: "Patrulheiro Emborrachado", preco: 20.0, imagem: "" },
    { id: 13, categoria: "Emborrachados", patente: "geral", titulo: "Direção Defensiva", preco: 20.0, imagem: "" },
    { id: 14, categoria: "Emborrachados", patente: "geral", titulo: "Trânsito Urbano", preco: 20.0, imagem: "" },
    { id: 15, categoria: "Emborrachados", patente: "geral", titulo: "Bandeira Paulista Emborrachada", preco: 20.0, imagem: "" },
    { id: 16, categoria: "Emborrachados", patente: "geral", titulo: "Brasões dos Batalhões Emborrachados", preco: 30.0, imagem: "" },
    { id: 17, categoria: "Emborrachados", patente: "sd", titulo: "Divisa Emborrachada (Colete Modular) - SD", preco: 20.0, imagem: "" },
    { id: 18, categoria: "Emborrachados", patente: "cb", titulo: "Divisa Emborrachada (Colete Modular) - CB", preco: 20.0, imagem: "" },
    { id: 19, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa Emborrachada (Colete Modular) - 3º SGT", preco: 20.0, imagem: "" },
    { id: 20, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa Emborrachada (Colete Modular) - 2º SGT", preco: 20.0, imagem: "" },
    { id: 21, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa Emborrachada (Colete Modular) - 1º SGT", preco: 20.0, imagem: "" },
    { id: 22, categoria: "Emborrachados", patente: "sd", titulo: "Divisa para Gandola (Emborrachada) - SD", preco: 5.0, imagem: "" },
    { id: 23, categoria: "Emborrachados", patente: "cb", titulo: "Divisa para Gandola (Emborrachada) - CB", preco: 5.0, imagem: "" },
    { id: 24, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa para Gandola (Emborrachada) - 3º SGT", preco: 5.0, imagem: "" },
    { id: 25, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa para Gandola (Emborrachada) - 2º SGT", preco: 5.0, imagem: "" },
    { id: 26, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa para Gandola (Emborrachada) - 1º SGT", preco: 5.0, imagem: "" },
    { id: 27, categoria: "Emborrachados", patente: "sgt", titulo: "Divisa para Gandola (Emborrachada) - Sub-Tenente", preco: 5.0, imagem: "" },
    { id: 28, categoria: "Emborrachados", patente: "geral", titulo: "Divisa para Gandola (Emborrachada) - Bucaneiro", preco: 5.0, imagem: "" },
    { id: 29, categoria: "Emborrachados", patente: "geral", titulo: "Divisa para Gandola (Emborrachada) - Bomboneiro", preco: 5.0, imagem: "" },

    { id: 30, categoria: "Uniformes", patente: "geral", titulo: "Agasalho", preco: 120.0, tamanho: true, imagem: "" },
    { id: 31, categoria: "Uniformes", patente: "geral", titulo: "Camisetas Ed física", preco: 32.0, tamanho: true, imagem: "" },
    { id: 32, categoria: "Uniformes", patente: "geral", titulo: "Camisetas cinzas", preco: 40.0, tamanho: true, imagem: "" },
    { id: 33, categoria: "Uniformes", patente: "geral", titulo: "Shorts Ed física", preco: 30.0, tamanho: true, imagem: "" },
    { id: 34, categoria: "Uniformes", patente: "geral", titulo: "Shorts térmico", preco: 30.0, tamanho: true, imagem: "" },
    { id: 35, categoria: "Uniformes", patente: "geral", titulo: "Sunga box", preco: 40.0, tamanho: true, imagem: "" },

    { id: 36, categoria: "Acessórios", patente: "geral", titulo: "Faixa refletiva", preco: 25.0, imagem: "" },
    { id: 37, categoria: "Acessórios", patente: "geral", titulo: "Coldre da DM", preco: 100.0, imagem: "" },
    { id: 38, categoria: "Acessórios", patente: "geral", titulo: "Carregador da Bélica de polímero", preco: 120.0, imagem: "" },
    { id: 39, categoria: "Acessórios", patente: "geral", titulo: "Porta carregador de fuzil", preco: 75.0, imagem: "" },
    { id: 40, categoria: "Acessórios", patente: "geral", titulo: "Capa modular", preco: 520.0, imagem: "" },
    { id: 41, categoria: "Acessórios", patente: "geral", titulo: "Adaptador de perna para o coldre da PM", preco: 55.0, imagem: "" },
    { id: 42, categoria: "Acessórios", patente: "geral", titulo: "Bandoleira", preco: 50.0, imagem: "" },
    { id: 43, categoria: "Acessórios", patente: "geral", titulo: "Lanterna USB", preco: 35.0, imagem: "" },
    { id: 44, categoria: "Acessórios", patente: "geral", titulo: "Abafador auricular", preco: 30.0, imagem: "" },
    { id: 45, categoria: "Acessórios", patente: "geral", titulo: "Alicate multiuso", preco: 45.0, imagem: "" },
    { id: 46, categoria: "Acessórios", patente: "geral", titulo: "Faca padrão da polícia (Modelo 1)", preco: 50.0, imagem: "" },
    { id: 47, categoria: "Acessórios", patente: "geral", titulo: "Faca padrão da polícia (Modelo 2)", preco: 60.0, imagem: "" },
    { id: 48, categoria: "Acessórios", patente: "geral", titulo: "Verniz (250ml)", preco: 40.0, imagem: "" },
    { id: 49, categoria: "Acessórios", patente: "geral", titulo: "Verniz (100ml)", preco: 25.0, imagem: "" },
    { id: 50, categoria: "Acessórios", patente: "geral", titulo: "Graxa", preco: 40.0, imagem: "" },
    { id: 51, categoria: "Acessórios", patente: "geral", titulo: "Kit escova de sapato", preco: 25.0, imagem: "" },
    { id: 52, categoria: "Acessórios", patente: "geral", titulo: "Cadeado de segredo", preco: 30.0, imagem: "" },
    { id: 53, categoria: "Acessórios", patente: "geral", titulo: "Cadeado de chave", preco: 30.0, imagem: "" },
    { id: 54, categoria: "Acessórios", patente: "geral", titulo: "Organizador de armário", preco: 50.0, imagem: "" },
    { id: 55, categoria: "Acessórios", patente: "geral", titulo: "Transportador de farda", preco: 50.0, imagem: "" },
    { id: 56, categoria: "Acessórios", patente: "geral", titulo: "Prancheta personalizada", preco: 60.0, imagem: "" },
    { id: 57, categoria: "Acessórios", patente: "geral", titulo: "Elástico de prancheta personalizada", preco: 15.0, imagem: "" },
    { id: 58, categoria: "Acessórios", patente: "geral", titulo: "Priscila (Emborrachada ou Pano)", preco: 20.0, imagem: "" },
    { id: 59, categoria: "Acessórios", patente: "geral", titulo: "Touca de natação", preco: 20.0, imagem: "" }
];

const CHAVE_PRODUTOS = 'meus_produtos_tropa';

function salvarProdutos() {
    if (!window.AppState) {
        console.error('AppState não foi inicializado.');
        return;
    }

    localStorage.setItem(
        CHAVE_PRODUTOS,
        JSON.stringify(window.AppState.listaProdutosAtual)
    );
}

export function carregarProdutos() {
    try {
        const salvos = JSON.parse(
            localStorage.getItem(CHAVE_PRODUTOS)
        );

        if (Array.isArray(salvos) && salvos.length > 0) {
            return salvos;
        }
    } catch (erro) {
        console.warn(
            'Não foi possível carregar os produtos salvos.',
            erro
        );
    }

    return produtosPadrao.map(produto => ({
        ...produto
    }));
}

export function renderizarProdutos() {
    const container = document.getElementById(
        'lista-produtos'
    );

    if (!container || !window.AppState) {
        return;
    }

    const {
        categoriaAtual,
        patenteAtual,
        textoBusca,
        listaProdutosAtual
    } = window.AppState;

    const produtosFiltrados =
        listaProdutosAtual.filter(produto => {
            const categoria = String(
                produto.categoria || ''
            )
                .trim()
                .toLowerCase();

            const patente = String(
                produto.patente || 'geral'
            )
                .trim()
                .toLowerCase();

            const titulo = String(
                produto.titulo || ''
            )
                .trim()
                .toLowerCase();

            const categoriaOk =
                categoriaAtual === 'todos' ||
                categoria === categoriaAtual;

            const patenteOk =
                patenteAtual === 'todos' ||
                patente === patenteAtual ||
                patente === 'geral';

            const buscaOk =
                !textoBusca ||
                titulo.includes(textoBusca);

            return (
                categoriaOk &&
                patenteOk &&
                buscaOk
            );
        });

    if (produtosFiltrados.length === 0) {
        container.innerHTML = `
            <p class="mensagem-vazia">
                Nenhum produto encontrado.
            </p>
        `;

        return;
    }

    container.innerHTML =
        produtosFiltrados
            .map(criarCardProduto)
            .join('');
}

function criarCardProduto(produto) {
    const tituloLower = String(
        produto.titulo || ''
    ).toLowerCase();

    const preco =
        Number(produto.preco) || 0;

    const precoPromocional =
        Number(produto.precoPromocional) || 0;

    const quantidadeMinima =
        Math.max(
            1,
            Number(produto.quantidadeMinimaPromo) || 1
        );

    const temPromocao =
        precoPromocional > 0 &&
        precoPromocional < preco;
		    const ehTermico =
        tituloLower.includes('térmico') ||
        tituloLower.includes('termico');

    const aceitaXG =
        tituloLower.includes('agasalho') ||
        tituloLower.includes('camiseta') ||
        (
            tituloLower.includes('short') &&
            !ehTermico
        );

    const tamanhos = aceitaXG
        ? ['P', 'M', 'G', 'GG', 'XG']
        : ['P', 'M', 'G', 'GG'];

    const campoTamanho = produto.tamanho
        ? `
            <select
                id="tam-${produto.id}"
                aria-label="Selecione o tamanho de ${escaparHtml(
                    produto.titulo
                )}"
            >
                <option
                    value=""
                    disabled
                    selected
                >
                    Selecione o tamanho
                </option>

                ${tamanhos
                    .map(tamanho => `
                        <option value="${tamanho}">
                            ${tamanho}
                            ${
                                tamanho === 'XG'
                                    ? ' (por encomenda)'
                                    : ''
                            }
                        </option>
                    `)
                    .join('')}
            </select>
        `
        : '';

    const ehTargeta =
        tituloLower.includes('targeta') ||
        tituloLower.includes('tarjeta');

    const campoPersonalizacao =
        produto.personalizavel
            ? `
                <input
                    type="text"
                    id="nome-${produto.id}"
                    placeholder="${
                        ehTargeta
                            ? 'Ex: CB PM BELTRAME'
                            : 'Nome / identificação'
                    }"
                    aria-label="Personalização de ${escaparHtml(
                        produto.titulo
                    )}"
                >
            `
            : '';

    const precoHtml = temPromocao
        ? `
            <div class="preco">
                R$ ${precoPromocional.toFixed(2)}

                <span class="preco-antigo">
                    R$ ${preco.toFixed(2)}
                </span>
            </div>

            <div class="card-pagamento-tags">
                <span class="tag-pagto">
                    Pix promocional — mínimo
                    ${quantidadeMinima} un.
                </span>
            </div>
        `
        : `
            <div class="preco">
                R$ ${preco.toFixed(2)}
            </div>

            <div class="card-pagamento-tags">
                <span class="tag-pagto">
                    Pix / cartão
                </span>
            </div>
        `;

    const imagemHtml = produto.imagem
        ? `
            <img
                src="${escaparAtributo(
                    produto.imagem
                )}"
                alt="${escaparAtributo(
                    produto.titulo
                )}"
                loading="lazy"
                decoding="async"
                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                "
            >

            <div
                class="produto-sem-imagem"
                style="display:none;"
            >
                Imagem indisponível
            </div>
        `
        : `
            <div class="produto-sem-imagem">
                Sem imagem
            </div>
        `;

    return `
        <article
            class="card-produto ${
                temPromocao
                    ? 'promocao'
                    : ''
            }"
            data-id="${produto.id}"
        >
            ${imagemHtml}

            <div>
                <h4>
                    ${escaparHtml(
                        produto.titulo
                    )}
                </h4>

                <div
                    class="card-estrelas"
                    aria-label="Avaliação 4,9 de 5"
                >
                    ⭐ 4.9 (127)
                </div>

                ${precoHtml}
            </div>

            <div>
                ${campoPersonalizacao}
                ${campoTamanho}

                <button
                    type="button"
                    class="btn-tatico btn-primario btn-acao"
                    onclick="adicionarAoCarrinho(${produto.id})"
                    aria-label="Adicionar ${escaparAtributo(
                        produto.titulo
                    )} ao carrinho"
                >
                    Adicionar
                </button>
            </div>
        </article>
    `;
}


// =========================================================================
// CADASTRO DE NOVO PRODUTO
// =========================================================================

export function adicionarNovoProdutoAdmin(event) {
    event?.preventDefault();

    if (!window.AppState) {
        console.error(
            'AppState não foi inicializado.'
        );

        return false;
    }

    const titulo = document
        .getElementById(
            'adm-titulo-produto'
        )
        ?.value.trim() || '';

    const categoria = document
        .getElementById(
            'adm-categoria-produto'
        )
        ?.value || '';

    const patente = document
        .getElementById(
            'adm-patente-produto'
        )
        ?.value || 'geral';

    const preco = Number(
        document.getElementById(
            'adm-preco-produto'
        )?.value
    );

    const precoPromocionalTexto =
        document
            .getElementById(
                'adm-preco-promocional'
            )
            ?.value.trim() || '';

    const quantidadeMinimaTexto =
        document
            .getElementById(
                'adm-qtd-minima'
            )
            ?.value.trim() || '';

    const imagem = document
        .getElementById(
            'adm-imagem-produto'
        )
        ?.value.trim() || '';

    const personalizavel = Boolean(
        document.getElementById(
            'adm-personalizavel'
        )?.checked
    );

    const tamanho = Boolean(
        document.getElementById(
            'adm-tamanho'
        )?.checked
    );

    if (
        !titulo ||
        !categoria ||
        !Number.isFinite(preco) ||
        preco < 0
    ) {
        alert(
            'Preencha o nome, a categoria e o preço corretamente.'
        );

        return false;
    }

    const precoPromocional =
        precoPromocionalTexto === ''
            ? null
            : Number(
                precoPromocionalTexto
            );

    if (
        precoPromocional !== null &&
        (
            !Number.isFinite(
                precoPromocional
            ) ||
            precoPromocional < 0 ||
            precoPromocional >= preco
        )
    ) {
        alert(
            'O preço promocional precisa ser menor que o preço normal.'
        );

        return false;
    }

    const quantidadeMinima =
        quantidadeMinimaTexto === ''
            ? 1
            : Math.max(
                1,
                Number.parseInt(
                    quantidadeMinimaTexto,
                    10
                ) || 1
            );

    const novoProduto = {
        id: Date.now(),
        titulo,
        categoria,
        patente,
        preco,
        precoPromocional,
        quantidadeMinimaPromo:
            quantidadeMinima,
        imagem,
        personalizavel,
        tamanho
    };

    window.AppState.listaProdutosAtual.push(
        novoProduto
    );

    salvarProdutos();

    document
        .getElementById(
            'form-adicionar-produto'
        )
        ?.reset();

    renderizarConteudoAdmin();

    if (
        typeof window.atualizarInterface ===
        'function'
    ) {
        window.atualizarInterface();
    }

    alert(
        'Produto cadastrado com sucesso.'
    );

    return true;
}


// =========================================================================
// REMOÇÃO DE PRODUTO
// =========================================================================

export function removerProdutoAdmin(id) {
    if (!window.AppState) {
        return false;
    }

    const produto =
        window.AppState.listaProdutosAtual.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!produto) {
        alert(
            'Produto não encontrado.'
        );

        return false;
    }

    const confirmou = confirm(
        `Tem certeza que deseja remover "${produto.titulo}"?`
    );

    if (!confirmou) {
        return false;
    }

    window.AppState.listaProdutosAtual =
        window.AppState.listaProdutosAtual.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );

    salvarProdutos();
    renderizarConteudoAdmin();

    if (
        typeof window.atualizarInterface ===
        'function'
    ) {
        window.atualizarInterface();
    }

    return true;
}
// =========================================================================
// SALVAMENTO DAS ALTERAÇÕES DO PAINEL
// =========================================================================

export function salvarNovosPrecos() {

    if (!window.AppState) {
        console.error(
            'AppState não foi inicializado.'
        );

        return false;
    }

    window.AppState.listaProdutosAtual.forEach(produto => {

        const inputPreco =
            document.getElementById(
                `admin-preco-${produto.id}`
            );

        const inputPromocional =
            document.getElementById(
                `admin-promo-${produto.id}`
            );

        const inputQtdMinima =
            document.getElementById(
                `admin-qtdmin-${produto.id}`
            );

        const inputImagem =
            document.getElementById(
                `admin-imagem-${produto.id}`
            );

        if (inputPreco) {

            const preco =
                Number(inputPreco.value);

            if (
                Number.isFinite(preco) &&
                preco >= 0
            ) {
                produto.preco = preco;
            }

        }

        if (inputPromocional) {

            const texto =
                inputPromocional.value.trim();

            if (texto === '') {

                produto.precoPromocional = null;

            } else {

                const valor =
                    Number(texto);

                if (
                    Number.isFinite(valor) &&
                    valor >= 0 &&
                    valor < produto.preco
                ) {

                    produto.precoPromocional =
                        valor;

                }

            }

        }

        if (inputQtdMinima) {

            const qtd =
                parseInt(
                    inputQtdMinima.value,
                    10
                );

            produto.quantidadeMinimaPromo =
                Number.isInteger(qtd)
                    ? Math.max(1, qtd)
                    : 1;

        }

        if (inputImagem) {

            produto.imagem =
                inputImagem.value.trim();

        }

    });

    salvarProdutos();

    renderizarConteudoAdmin();

    if (
        typeof window.atualizarInterface ===
        'function'
    ) {

        window.atualizarInterface();

    }

    alert(
        'Produtos atualizados com sucesso.'
    );

    return true;

}


// =========================================================================
// PAINEL ADMINISTRATIVO
// =========================================================================

export function alternarPainelAdmin() {

    const painel =
        document.getElementById(
            'painel-admin-container'
        );

    if (!painel) {
        return;
    }

    painel.hidden =
        !painel.hidden;

    if (!painel.hidden) {

        renderizarConteudoAdmin();

    }

}


// =========================================================================
// RENDERIZAÇÃO DO PAINEL
// =========================================================================

export function renderizarConteudoAdmin() {

    const painel =
        document.getElementById(
            'painel-admin-container'
        );

    if (
        !painel ||
        !window.AppState
    ) {
        return;
    }

    painel.innerHTML = `

<div class="admin-card">

<h3>Painel Administrativo</h3>

<form
id="form-adicionar-produto"
class="admin-form"
onsubmit="adicionarNovoProdutoAdmin(event)"
>

<input
id="adm-titulo-produto"
type="text"
placeholder="Nome do produto"
required
>

<select id="adm-categoria-produto">

<option value="Bordados">
Bordados
</option>

<option value="Emborrachados">
Emborrachados
</option>

<option value="Uniformes">
Uniformes
</option>

<option value="Acessórios">
Acessórios
</option>

</select>

<select id="adm-patente-produto">

<option value="geral">
Geral
</option>

<option value="sd">
SD
</option>

<option value="cb">
CB
</option>

<option value="sgt">
SGT
</option>

</select>

<input
id="adm-preco-produto"
type="number"
step="0.01"
placeholder="Preço normal"
required
>

<input
id="adm-preco-promocional"
type="number"
step="0.01"
placeholder="Preço promocional"
>

<input
id="adm-qtd-minima"
type="number"
min="1"
value="1"
placeholder="Qtd mínima"
>

<input
id="adm-imagem-produto"
type="text"
placeholder="URL ou assets/imagem.webp"
>

<label>

<input
id="adm-personalizavel"
type="checkbox"
>

Personalizável

</label>

<label>

<input
id="adm-tamanho"
type="checkbox"
>

Possui tamanho

</label>

<button
type="submit"
class="btn-tatico btn-primario"
>

Cadastrar produto

</button>

</form>

<div class="admin-tabela-wrapper">

<table class="admin-tabela">

<thead>

<tr>

<th>Produto</th>

<th>Preço</th>

<th>Promo</th>

<th>Qtd Min.</th>

<th>Imagem</th>

<th>Prévia</th>

<th>Ação</th>

</tr>

</thead>

<tbody>

${window.AppState.listaProdutosAtual.map(produto => {

const imagem =
produto.imagem || '';

return `
<tr>
    <td>
        ${escaparHtml(produto.titulo)}
    </td>

    <td>
        <input
            id="admin-preco-${produto.id}"
            type="number"
            min="0"
            step="0.01"
            value="${Number(produto.preco || 0).toFixed(2)}"
            aria-label="Preço normal de ${escaparAtributo(produto.titulo)}"
        >
    </td>

    <td>
        <input
            id="admin-promo-${produto.id}"
            type="number"
            min="0"
            step="0.01"
            value="${
                produto.precoPromocional !== null &&
                produto.precoPromocional !== undefined
                    ? produto.precoPromocional
                    : ''
            }"
            placeholder="Sem promoção"
            aria-label="Preço promocional de ${escaparAtributo(produto.titulo)}"
        >
    </td>

    <td>
        <input
            id="admin-qtdmin-${produto.id}"
            type="number"
            min="1"
            value="${
                Number(produto.quantidadeMinimaPromo) || 1
            }"
            aria-label="Quantidade mínima da promoção de ${escaparAtributo(produto.titulo)}"
        >
    </td>

    <td>
        <input
            id="admin-imagem-${produto.id}"
            class="admin-input-imagem"
            type="text"
            value="${escaparAtributo(imagem)}"
            placeholder="assets/produto.webp ou URL completa"
            oninput="atualizarPreviaImagemAdmin(${produto.id})"
            aria-label="Imagem de ${escaparAtributo(produto.titulo)}"
        >
    </td>

    <td>
        <div
            id="admin-previa-${produto.id}"
            class="admin-previa-imagem"
        >
            ${
                imagem
                    ? `
                        <img
                            src="${escaparAtributo(imagem)}"
                            alt="Prévia de ${escaparAtributo(produto.titulo)}"
                            loading="lazy"
                            decoding="async"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='block';
                            "
                        >

                        <span
                            class="admin-imagem-invalida"
                            style="display:none;"
                        >
                            Imagem inválida
                        </span>
                    `
                    : `
                        <span>
                            Sem imagem
                        </span>
                    `
            }
        </div>
    </td>

    <td>
        <button
            type="button"
            class="btn-remover"
            onclick="removerProdutoAdmin(${produto.id})"
            aria-label="Remover ${escaparAtributo(produto.titulo)}"
        >
            Remover
        </button>
    </td>
</tr>
`;

}).join('')}

</tbody>

</table>

</div>

<button
    type="button"
    class="btn-tatico btn-secundario"
    onclick="salvarNovosPrecos()"
>
    Salvar alterações
</button>

</div>
`;
}


// =========================================================================
// PRÉVIA DA IMAGEM NO PAINEL
// =========================================================================

export function atualizarPreviaImagemAdmin(id) {
    const input = document.getElementById(
        `admin-imagem-${id}`
    );

    const container = document.getElementById(
        `admin-previa-${id}`
    );

    if (!input || !container) {
        return;
    }

    const imagem = input.value.trim();

    if (!imagem) {
        container.innerHTML = `
            <span>
                Sem imagem
            </span>
        `;

        return;
    }

    container.innerHTML = `
        <img
            src="${escaparAtributo(imagem)}"
            alt="Prévia da imagem"
            loading="lazy"
            decoding="async"
            onerror="
                this.style.display='none';
                this.nextElementSibling.style.display='block';
            "
        >

        <span
            class="admin-imagem-invalida"
            style="display:none;"
        >
            Imagem inválida
        </span>
    `;
}
// =========================================================================
// GALERIA DE PRODUTOS
// =========================================================================

export function renderizarGaleriaFotos() {
    const areaLoja = document.getElementById(
        'area-dinamica-loja'
    );

    const galeria = document.getElementById(
        'conteudo-galeria-fotos'
    );

    if (
        !areaLoja ||
        !galeria ||
        !window.AppState
    ) {
        return;
    }

    areaLoja.hidden = true;
    areaLoja.style.display = 'none';

    galeria.hidden = false;
    galeria.style.display = 'block';

    const produtos =
        window.AppState.listaProdutosAtual;

    const conteudoProdutos =
        produtos.length > 0
            ? produtos
                .map(criarCardGaleria)
                .join('')
            : `
                <p class="mensagem-vazia">
                    Nenhum produto cadastrado.
                </p>
            `;

    galeria.innerHTML = `
        <div class="galeria-header">
            <h2>
                📷 Galeria de produtos
            </h2>

            <button
                type="button"
                class="btn-tatico btn-secundario"
                onclick="voltarParaLoja()"
            >
                ← Voltar para a loja
            </button>
        </div>

        <div class="galeria-grid">
            ${conteudoProdutos}
        </div>
    `;
}


/**
 * Cria um card da galeria.
 *
 * @param {object} produto
 * @returns {string}
 */
function criarCardGaleria(produto) {
    const preco =
        Number(produto.preco) || 0;

    const imagem = String(
        produto.imagem || ''
    ).trim();

    const imagemHtml = imagem
        ? `
            <img
                src="${escaparAtributo(imagem)}"
                alt="${escaparAtributo(produto.titulo)}"
                loading="lazy"
                decoding="async"
                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                "
            >

            <div
                class="produto-sem-imagem"
                style="display:none;"
            >
                Imagem indisponível
            </div>
        `
        : `
            <div class="produto-sem-imagem">
                Sem imagem
            </div>
        `;

    return `
        <article class="galeria-card">
            ${imagemHtml}

            <h4>
                ${escaparHtml(produto.titulo)}
            </h4>

            <strong class="valor-destaque">
                R$ ${preco.toFixed(2)}
            </strong>
        </article>
    `;
}


/**
 * Fecha a galeria e volta para o catálogo.
 */
export function voltarParaLoja() {
    const areaLoja = document.getElementById(
        'area-dinamica-loja'
    );

    const galeria = document.getElementById(
        'conteudo-galeria-fotos'
    );

    if (galeria) {
        galeria.hidden = true;
        galeria.style.display = 'none';
        galeria.innerHTML = '';
    }

    if (areaLoja) {
        areaLoja.hidden = false;
        areaLoja.style.display = 'block';

        areaLoja.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
// =========================================================================
// FUNÇÕES AUXILIARES
// =========================================================================

/**
 * Protege textos exibidos dentro do HTML.
 *
 * @param {unknown} valor
 * @returns {string}
 */
function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/**
 * Protege valores inseridos em atributos HTML.
 *
 * @param {unknown} valor
 * @returns {string}
 */
function escaparAtributo(valor) {
    return escaparHtml(valor)
        .replaceAll('`', '&#096;');
}
