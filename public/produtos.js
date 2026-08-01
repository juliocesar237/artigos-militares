// =========================================================================
// PRODUTOS.JS — CATÁLOGO, GALERIA E PAINEL ADMINISTRATIVO (VIA API BACKEND)
// =========================================================================

/**
 * Carrega todos os produtos diretamente da API do backend.
 * Substitui a antiga lógica síncrona do localStorage.
 * 
 * @returns {Promise<Array>} Lista de produtos obtida do servidor
 */
export async function carregarProdutos() {
    try {
        const resposta = await fetch('/api/produtos');
        
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar produtos: ${resposta.statusText}`);
        }

        const produtos = await resposta.json();
        
        if (window.AppState) {
            window.AppState.listaProdutosAtual = Array.isArray(produtos) ? produtos : [];
        }

        return window.AppState ? window.AppState.listaProdutosAtual : produtos;
    } catch (erro) {
        console.error('Falha ao carregar produtos do servidor:', erro);
        alert('Não foi possível carregar os produtos do servidor.');
        return [];
    }
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
// FUNÇÕES AUXILIARES DE UPLOAD DE IMAGEM
// =========================================================================

function validarArquivoImagem(arquivo) {
    if (!arquivo) {
        return 'Nenhuma imagem foi selecionada.';
    }

    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
        return 'Use somente imagens JPG, JPEG, PNG ou WEBP.';
    }

    if (arquivo.size > 5 * 1024 * 1024) {
        return 'A imagem deve ter no máximo 5 MB.';
    }

    return null;
}

async function fazerUploadImagem(arquivo) {
    const formData = new FormData();
    formData.append('imagem', arquivo);

    const resposta = await fetch('/api/upload-imagem', {
        method: 'POST',
        body: formData
    });

    if (resposta.status === 403) {
        throw new Error('O upload direto está disponível somente no ambiente local.');
    }

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
        throw new Error(
            resultado.erro ||
            resultado.mensagem ||
            'Erro ao enviar imagem.'
        );
    }

    return resultado;
}

export async function enviarImagemNovoProduto(arquivo) {
    const erroValidacao = validarArquivoImagem(arquivo);
    const statusDiv = document.getElementById('upload-status-novo-produto');
    const previaDiv = document.getElementById('upload-previa-novo-produto');
    const inputUrl = document.getElementById('adm-imagem-produto');

    if (erroValidacao) {
        if (statusDiv) statusDiv.textContent = erroValidacao;
        throw new Error(erroValidacao);
    }

    if (statusDiv) statusDiv.textContent = 'Enviando imagem...';

    try {
        const resultado = await fazerUploadImagem(arquivo);

        if (inputUrl) {
            inputUrl.value = resultado.url;
        }

        if (previaDiv) {
            previaDiv.innerHTML = `
                <img
                    src="${escaparAtributo(resultado.url)}"
                    alt="Prévia da imagem"
                    loading="lazy"
                    decoding="async"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='block';
                    "
                >
                <span class="admin-imagem-invalida" style="display:none;">
                    Imagem inválida
                </span>
            `;
        }

        if (statusDiv) {
            statusDiv.textContent = 'Imagem enviada com sucesso.';
        }

        return resultado.url;
    } catch (erro) {
        if (statusDiv) {
            statusDiv.textContent = erro.message;
        }
        throw erro;
    }
}

export async function enviarImagemProdutoExistente(id, arquivo) {
    const erroValidacao = validarArquivoImagem(arquivo);
    if (erroValidacao) {
        alert(erroValidacao);
        throw new Error(erroValidacao);
    }

    try {
        const resultado = await fazerUploadImagem(arquivo);
        const inputUrl = document.getElementById(`admin-imagem-${id}`);

        if (inputUrl) {
            inputUrl.value = resultado.url;
        }

        atualizarPreviaImagemAdmin(id);

        if (window.AppState && Array.isArray(window.AppState.listaProdutosAtual)) {
            const produtoEncontrado = window.AppState.listaProdutosAtual.find(
                item => Number(item.id) === Number(id)
            );
            if (produtoEncontrado) {
                produtoEncontrado.imagem = resultado.url;
            }
        }

        return resultado.url;
    } catch (erro) {
        alert(erro.message);
        throw erro;
    }
}

function configurarUploadNovoProduto() {
    const area = document.getElementById('upload-area-novo-produto');
    const inputArquivo = document.getElementById('upload-arquivo-novo-produto');

    if (!area || !inputArquivo) {
        return;
    }

    if (area.dataset.configurado === 'true') {
        return;
    }
    area.dataset.configurado = 'true';

    area.addEventListener('click', () => {
        inputArquivo.click();
    });

    area.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputArquivo.click();
        }
    });

    inputArquivo.addEventListener('change', (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            enviarImagemNovoProduto(arquivo).catch(erro => {
                console.error('Erro no upload:', erro);
            });
        }
    });

    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('arrastando');
    });

    area.addEventListener('dragleave', () => {
        area.classList.remove('arrastando');
    });

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('arrastando');
        const arquivo = e.dataTransfer?.files?.[0];
        if (arquivo) {
            enviarImagemNovoProduto(arquivo).catch(erro => {
                console.error('Erro no upload:', erro);
            });
        }
    });
}


// =========================================================================
// CADASTRO DE NOVO PRODUTO (VIA POST /api/produtos)
// =========================================================================

export async function adicionarNovoProdutoAdmin(event) {
    event?.preventDefault();

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
        titulo,
        categoria,
        patente,
        preco,
        precoPromocional,
        quantidadeMinimaPromo: quantidadeMinima,
        imagem,
        personalizavel,
        tamanho
    };

    try {
        const resposta = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar produto no servidor.');
        }

        // Recarrega os produtos atualizados do backend
        await carregarProdutos();

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
    } catch (erro) {
        console.error('Erro ao adicionar produto:', erro);
        alert('Não foi possível cadastrar o produto.');
        return false;
    }
}


// =========================================================================
// REMOÇÃO DE PRODUTO (VIA DELETE /api/produtos/:id)
// =========================================================================

export async function removerProdutoAdmin(id) {
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

    try {
        const resposta = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao remover produto no servidor.');
        }

        // Atualiza a lista após a exclusão
        await carregarProdutos();
        renderizarConteudoAdmin();

        if (
            typeof window.atualizarInterface ===
            'function'
        ) {
            window.atualizarInterface();
        }

        return true;
    } catch (erro) {
        console.error('Erro ao remover produto:', erro);
        alert('Não foi possível remover o produto.');
        return false;
    }
}


// =========================================================================
// SALVAMENTO DAS ALTERAÇÕES DO PAINEL (VIA PUT /api/produtos/:id)
// =========================================================================

export async function salvarNovosPrecos() {
    if (!window.AppState) {
        console.error(
            'AppState não foi inicializado.'
        );

        return false;
    }

    try {
        const promessasAtualizacao = window.AppState.listaProdutosAtual.map(async produto => {
            const inputPreco = document.getElementById(`admin-preco-${produto.id}`);
            const inputPromocional = document.getElementById(`admin-promo-${produto.id}`);
            const inputQtdMinima = document.getElementById(`admin-qtdmin-${produto.id}`);
            const inputImagem = document.getElementById(`admin-imagem-${produto.id}`);

            // Clona o produto atual para ajustar os valores modificados no DOM
            const produtoAtualizado = { ...produto };

            if (inputPreco) {
                const preco = Number(inputPreco.value);
                if (Number.isFinite(preco) && preco >= 0) {
                    produtoAtualizado.preco = preco;
                }
            }

            if (inputPromocional) {
                const texto = inputPromocional.value.trim();
                if (texto === '') {
                    produtoAtualizado.precoPromocional = null;
                } else {
                    const valor = Number(texto);
                    if (Number.isFinite(valor) && valor >= 0 && valor < produtoAtualizado.preco) {
                        produtoAtualizado.precoPromocional = valor;
                    }
                }
            }

            if (inputQtdMinima) {
                const qtd = parseInt(inputQtdMinima.value, 10);
                produtoAtualizado.quantidadeMinimaPromo = Number.isInteger(qtd) ? Math.max(1, qtd) : 1;
            }

            if (inputImagem) {
                produtoAtualizado.imagem = inputImagem.value.trim();
            }

            // Envia cada alteração de produto via PUT para a API
            const resposta = await fetch(`/api/produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoAtualizado)
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao atualizar produto ID ${produto.id}`);
            }
        });

        // Aguarda todas as requisições PUT terminarem
        await Promise.all(promessasAtualizacao);

        // Recarrega a lista oficial do banco via backend
        await carregarProdutos();

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
    } catch (erro) {
        console.error('Erro ao salvar alterações:', erro);
        alert('Ocorreu um erro ao salvar as alterações no servidor.');
        return false;
    }
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

<div class="admin-upload-imagem">
    <input
        id="adm-imagem-produto"
        type="text"
        placeholder="/assets/produtos/imagem.jpg ou URL completa"
    >

    <div
        id="upload-area-novo-produto"
        class="upload-area"
        tabindex="0"
        role="button"
    >
        <strong>Arraste uma imagem aqui</strong>
        <span>ou clique para escolher</span>

        <input
            id="upload-arquivo-novo-produto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
        >
    </div>

    <div
        id="upload-status-novo-produto"
        class="upload-status"
    ></div>

    <div
        id="upload-previa-novo-produto"
        class="admin-previa-imagem"
    ></div>
</div>

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
        <div style="display: flex; flex-direction: column; gap: 6px;">
            <input
                id="admin-imagem-${produto.id}"
                class="admin-input-imagem"
                type="text"
                value="${escaparAtributo(imagem)}"
                placeholder="assets/produto.webp ou URL completa"
                oninput="atualizarPreviaImagemAdmin(${produto.id})"
                aria-label="Imagem de ${escaparAtributo(produto.titulo)}"
            >
            <label
                class="btn-upload-produto"
                for="upload-produto-${produto.id}">
                Escolher imagem</label>
            <input
                id="upload-produto-${produto.id}"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onchange="enviarImagemProdutoExistente(${produto.id}, this.files[0])">
        </div>
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

    configurarUploadNovoProduto();
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
        />

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

function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escaparAtributo(valor) {
    return escaparHtml(valor)
        .replaceAll('`', '&#096;');
}