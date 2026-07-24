// --- ESTADO GLOBAL ---
let categoriaAtual = 'todas';
let patenteAtual = 'todas';
let carrinho = [];

let listaProdutosAtual = [];

document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
});

function verificarAutenticacao() {
    const usuarioLogadoStr = localStorage.getItem('usuarioLogado');

    if (!usuarioLogadoStr) {
        if (typeof renderizarLogin === 'function') {
            renderizarLogin('conteudo-principal');
        } else {
            console.error("Função renderizarLogin não encontrada.");
        }
    } else {
        const usuario = JSON.parse(usuarioLogadoStr);
        inicializarSistema(usuario);
    }
}

function inicializarSistema(usuario) {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtosCadastradosPersonalizados'));
    
    if (produtosSalvos && typeof produtos !== 'undefined') {
        listaProdutosAtual = produtosSalvos;
    } else {
        listaProdutosAtual = typeof produtos !== 'undefined' ? [...produtos] : [];
    }

    renderizarEstruturaLoja(usuario.isAdmin);
    renderizarLoja();
}

function renderizarEstruturaLoja(isAdmin) {
    const container = document.getElementById('conteudo-principal');
    if (!container) return;

    let botaoAdminHtml = '';
    if (isAdmin) {
        botaoAdminHtml = `
            <div style="text-align: right; margin-bottom: 15px;">
                <button onclick="alternarPainelAdmin()" style="background: #e74c3c; color: white; border: none; padding: 10px 15px; border-radius: 4px; font-weight: bold; cursor: pointer;">
                    ⚙️ PAINEL ADMIN: GERENCIAR PRODUTOS
                </button>
                <button onclick="fazerLogout()" style="background: #7f8c8d; color: white; border: none; padding: 10px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-left: 5px;">
                    Sair
                </button>
            </div>
            <div id="painel-admin-container" style="display: none; background: #f9f9f9; padding: 20px; border: 1px solid #ddd; margin-bottom: 20px; border-radius: 8px;"></div>
        `;
    } else {
        botaoAdminHtml = `
            <div style="text-align: right; margin-bottom: 15px;">
                <button onclick="fazerLogout()" style="background: #7f8c8d; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Sair da Conta</button>
            </div>
        `;
    }

    container.innerHTML = `
        ${botaoAdminHtml}
        <section id="filtros">
            <div id="container-categorias">
                <button class="filtro-btn ativo" onclick="filtrar('categoria', 'todos', this)">TODAS CATEGORIAS</button>
                <button class="filtro-btn" onclick="filtrar('categoria', 'Bordados', this)">BORDADOS</button>
                <button class="filtro-btn" onclick="filtrar('categoria', 'Emborrachados', this)">EMBORRACHADOS</button>
                <button class="filtro-btn" onclick="filtrar('categoria', 'Uniformes', this)">UNIFORMES</button>
                <button class="filtro-btn" onclick="filtrar('categoria', 'Acessórios', this)">ACESSÓRIOS</button>
            </div>

            <div id="container-patentes">
                <button class="filtro-btn ativo" onclick="filtrar('patente', 'todas', this)">TODAS PATENTES</button>
                <button class="filtro-btn" onclick="filtrar('patente', 'sd', this)">SD</button>
                <button class="filtro-btn" onclick="filtrar('patente', 'cb', this)">CB</button>
                <button class="filtro-btn" onclick="filtrar('patente', 'sgt', this)">SGT</button>
            </div>
        </section>

        <div id="lista-produtos"></div>
        
        <section id="resumo-carrinho">
            <div id="conteudo-carrinho"><p>Seu carrinho está vazio.</p></div>
        </section>
    `;
}

function renderizarLoja() {
    const container = document.getElementById('lista-produtos');
    if (!container) return;
    container.innerHTML = '';
    
    if (listaProdutosAtual.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    listaProdutosAtual.forEach(p => {
        const catProduto = (p.categoria || '').trim().toLowerCase();
        const patProduto = (p.patente || '').trim().toLowerCase();
        const tituloLower = (p.titulo || '').toLowerCase();
        
        const catOk = (categoriaAtual === 'todas' || categoriaAtual === 'todos' || catProduto === categoriaAtual);
        const patOk = (patenteAtual === 'todas' || patProduto === patenteAtual || !p.patente);
        
        if (catOk && patOk) {
            let htmlTamanho = '';
            if (p.tamanho) {
                const ehTermico = tituloLower.includes('térmico') || tituloLower.includes('termico');
                const aceitaXG = tituloLower.includes('agasalho') || tituloLower.includes('camiseta') || (tituloLower.includes('short') && !ehTermico);

                if (aceitaXG) {
                    htmlTamanho = `
                        <select id="tam-${p.id}" class="input-numero" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px; background: #fff; color: #000; font-weight: bold;">
                            <option value="" disabled selected>Selecione o Tamanho</option>
                            <option value="P">P</option>
                            <option value="M">M</option>
                            <option value="G">G</option>
                            <option value="GG">GG</option>
                            <option value="XG">XG (Apenas por encomenda)</option>
                        </select>
                    `;
                } else {
                    htmlTamanho = `
                        <select id="tam-${p.id}" class="input-numero" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px; background: #fff; color: #000; font-weight: bold;">
                            <option value="" disabled selected>Selecione o Tamanho</option>
                            <option value="P">P</option>
                            <option value="M">M</option>
                            <option value="G">G</option>
                            <option value="GG">GG</option>
                        </select>
                    `;
                }
            }

            const ehTargeta = tituloLower.includes('targeta') || tituloLower.includes('tarjeta');
            const placeholderTexto = ehTargeta ? 'Ex: CB PM BELTRAME' : 'Nome';

            container.innerHTML += `
            <div class="card-produto" data-id="${p.id}">
                ${p.imagem ? `<img src="${p.imagem}" alt="${p.titulo}">` : ''}
                <h4>${p.titulo}</h4>
                <div class="preco">R$ ${p.preco ? Number(p.preco).toFixed(2) : "0.00"}</div>
                ${p.personalizavel ? `<input type="text" id="nome-${p.id}" class="input-nome" placeholder="${placeholderTexto}" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">` : ''}
                ${htmlTamanho}
                <button class="btn-acao" onclick="adicionarAoCarrinho(${p.id})">ADICIONAR</button>
            </div>`;
        }
    });
}

function alternarPainelAdmin() {
    const painel = document.getElementById('painel-admin-container');
    if (!painel) return;

    if (painel.style.display === 'none') {
        painel.style.display = 'block';
        renderizarConteudoAdmin();
    } else {
        painel.style.display = 'none';
    }
}

function renderizarConteudoAdmin() {
    const painel = document.getElementById('painel-admin-container');
    if (!painel) return;

    let html = `
        <h3 style="margin-top:0; color: #2c3e50;">Painel do Administrador</h3>
        
        <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 20px;">
            <h4 style="margin-top:0; color: #27ae60;">➕ Adicionar Novo Produto</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <input type="text" id="novo-titulo" placeholder="Nome do Produto" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="number" step="0.01" id="novo-preco" placeholder="Preço (R$)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="text" id="novo-categoria" placeholder="Categoria (ex: Bordados)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="text" id="novo-patente" placeholder="Patente (opcional, ex: sd)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="text" id="novo-imagem" placeholder="URL da Imagem (opcional)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; grid-column: span 2;">
            </div>
            <div style="margin-bottom: 10px; font-size: 13px; color: #555;">
                <label style="margin-right: 15px;"><input type="checkbox" id="novo-personalizavel"> Permite digitar nome/tarjeta?</label>
                <label><input type="checkbox" id="novo-tamanho" checked> Possui tamanhos (P, M, G...)?</label>
            </div>
            <button onclick="adicionarNovoProdutoAdmin()" style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; cursor: pointer;">Cadastrar Produto</button>
        </div>

        <h4 style="color: #2c3e50; margin-bottom: 5px;">Gerenciamento de Preços</h4>
        <p style="font-size: 13px; color: #333; margin-bottom: 10px;">Altere os valores abaixo e clique em salvar para atualizar os preços na loja instantaneamente.</p>
        <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px; background: #fff; border: 1px solid #ccc; border-radius: 4px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #2c3e50; color: white; text-align: left;">
                        <th style="padding: 10px;">Produto</th>
                        <th style="padding: 10px; width: 120px;">Preço (R$)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    listaProdutosAtual.forEach(p => {
        html += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-size: 14px; color: #2c3e50; font-weight: bold;">${p.titulo}</td>
                <td style="padding: 10px;">
                    <input type="number" step="0.01" id="admin-preco-${p.id}" value="${p.preco}" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <button onclick="salvarNovosPrecos()" style="background: #2980b9; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar Alterações de Preço</button>
    `;

    painel.innerHTML = html;
}

function adicionarNovoProdutoAdmin() {
    const titulo = document.getElementById('novo-titulo').value.trim();
    const preco = parseFloat(document.getElementById('novo-preco').value);
    const categoria = document.getElementById('novo-categoria').value.trim();
    const patente = document.getElementById('novo-patente').value.trim();
    const imagem = document.getElementById('novo-imagem').value.trim();
    const personalizavel = document.getElementById('novo-personalizavel').checked;
    const tamanho = document.getElementById('novo-tamanho').checked;

    if (!titulo || isNaN(preco) || !categoria) {
        alert("Preencha pelo menos o Título, o Preço e a Categoria do produto!");
        return;
    }

    const novoId = Date.now();

    const novoProduto = {
        id: novoId,
        titulo: titulo,
        preco: preco,
        categoria: categoria,
        patente: patente || "",
        imagem: imagem || "",
        personalizavel: personalizavel,
        tamanho: tamanho
    };

    listaProdutosAtual.push(novoProduto);
    localStorage.setItem('produtosCadastradosPersonalizados', JSON.stringify(listaProdutosAtual));

    alert("Produto cadastrado com sucesso!");
    renderizarLoja();
    renderizarConteudoAdmin();
}

function salvarNovosPrecos() {
    listaProdutosAtual.forEach(p => {
        const input = document.getElementById(`admin-preco-${p.id}`);
        if (input) {
            const novoValor = parseFloat(input.value);
            if (!isNaN(novoValor)) {
                p.preco = novoValor;
            }
        }
    });

    localStorage.setItem('produtosCadastradosPersonalizados', JSON.stringify(listaProdutosAtual));

    alert("Preços atualizados com sucesso!");
    renderizarLoja();
    alternarPainelAdmin();
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload();
}

function filtrar(tipo, valor, btn) {
    if (tipo === 'categoria') categoriaAtual = valor.toLowerCase();
    if (tipo === 'patente') patenteAtual = valor.toLowerCase();

    if (btn && btn.parentElement) {
        const botoes = btn.parentElement.querySelectorAll('.filtro-btn');
        botoes.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
    }

    renderizarLoja();
}

function adicionarAoCarrinho(id) {
    const p = listaProdutosAtual.find(item => item.id === id);
    if (!p) return;

    const inputNome = document.getElementById(`nome-${id}`);
    const inputNumero = document.getElementById(`tam-${id}`);

    const itemCarrinho = {
        ...p,
        quantidade: 1,
        nomePersonalizado: inputNome ? inputNome.value : null,
        numeroPersonalizado: inputNumero ? inputNumero.value : null
    };

    carrinho.push(itemCarrinho);
    
    if (typeof renderizarCarrinho === 'function') renderizarCarrinho(carrinho);
    
    if (inputNome) inputNome.value = '';
    if (inputNumero) inputNumero.value = '';
}

function alterarQuantidade(index, delta) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    
    if (typeof renderizarCarrinho === 'function') renderizarCarrinho(carrinho);
}