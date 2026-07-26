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
                    ⚙️ PAINEL ADMIN: GERENCIAR PRODUTOS E PROMOÇÕES
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

            const ehTargeta = (tituloLower.includes('targeta') || tituloLower.includes('tarjeta')) && !tituloLower.includes('curso');
            const placeholderTexto = ehTargeta ? 'Ex: CB PM BELTRAME' : 'Nome';

            let htmlPreco = '';
            const precoNum = Number(p.preco) || 0;
            const precoPromoNum = p.precoPromocional ? Number(p.precoPromocional) : null;
            const qtdMinima = p.quantidadeMinimaPromo ? Number(p.quantidadeMinimaPromo) : 1;

            if (precoPromoNum && precoPromoNum > 0 && precoPromoNum < precoNum) {
                htmlPreco = `
                    <div class="preco" style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
                        <div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
                            <span style="text-decoration: line-through; color: #999; font-size: 0.85em;">R$ ${precoNum.toFixed(2)}</span>
                            <span style="color: #e74c3c; font-weight: bold;">R$ ${precoPromoNum.toFixed(2)} (Pix)</span>
                        </div>
                        <small style="color: #27ae60; font-weight: bold; font-size: 0.75em;">
                            ${qtdMinima > 1 ? `Leve a partir de ${qtdMinima} un.` : 'Preço promocional no Pix'}
                        </small>
                    </div>
                `;
            } else {
                htmlPreco = `<div class="preco">R$ ${precoNum.toFixed(2)}</div>`;
            }

            container.innerHTML += `
            <div class="card-produto" data-id="${p.id}">
                ${p.imagem ? `<img src="${p.imagem}" alt="${p.titulo}">` : ''}
                <h4>${p.titulo}</h4>
                ${htmlPreco}
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
                <input type="number" step="0.01" id="novo-preco" placeholder="Preço Normal (R$)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="number" step="0.01" id="novo-preco-promo" placeholder="Preço Promocional Pix (Opcional)" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <input type="number" id="novo-qtd-minima" placeholder="Qtd Mínima para Promo (Ex: 3)" value="1" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
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

        <h4 style="color: #2c3e50; margin-bottom: 5px;">Gerenciamento de Preços e Promoções</h4>
        <p style="font-size: 13px; color: #333; margin-bottom: 10px;">Altere o preço normal, preço promocional no Pix e a quantidade mínima exigida.</p>
        <div style="max-height: 280px; overflow-y: auto; margin-bottom: 15px; background: #fff; border: 1px solid #ccc; border-radius: 4px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #2c3e50; color: white; text-align: left;">
                        <th style="padding: 10px;">Produto</th>
                        <th style="padding: 10px; width: 100px;">Preço Normal</th>
                        <th style="padding: 10px; width: 100px;">Preço Pix Promo</th>
                        <th style="padding: 10px; width: 90px;">Qtd Mín.</th>
                    </tr>
                </thead>
                <tbody>
    `;

    listaProdutosAtual.forEach(p => {
        const qtdMin = p.quantidadeMinimaPromo !== undefined && p.quantidadeMinimaPromo !== null ? p.quantidadeMinimaPromo : 1;
        html += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-size: 14px; color: #2c3e50; font-weight: bold;">${p.titulo}</td>
                <td style="padding: 10px;">
                    <input type="number" step="0.01" id="admin-preco-${p.id}" value="${p.preco}" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                </td>
                <td style="padding: 10px;">
                    <input type="number" step="0.01" id="admin-promo-${p.id}" value="${p.precoPromocional !== undefined && p.precoPromocional !== null ? p.precoPromocional : ''}" placeholder="Vazio = Sem" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #e74c3c;">
                </td>
                <td style="padding: 10px;">
                    <input type="number" id="admin-qtdmin-${p.id}" value="${qtdMin}" min="1" style="width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #2980b9;">
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <button onclick="salvarNovosPrecos()" style="background: #2980b9; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar Alterações de Preços e Promoções</button>
    `;

    painel.innerHTML = html;
}

function adicionarNovoProdutoAdmin() {
    const titulo = document.getElementById('novo-titulo').value.trim();
    const preco = parseFloat(document.getElementById('novo-preco').value);
    const precoPromoInput = document.getElementById('novo-preco-promo').value.trim();
    const qtdMinimaInput = document.getElementById('novo-qtd-minima').value.trim();
    const categoria = document.getElementById('novo-categoria').value.trim();
    const patente = document.getElementById('novo-patente').value.trim();
    const imagem = document.getElementById('novo-imagem').value.trim();
    const personalizavel = document.getElementById('novo-personalizavel').checked;
    const tamanho = document.getElementById('novo-tamanho').checked;

    if (!titulo || isNaN(preco) || !categoria) {
        alert("Preencha pelo menos o Título, o Preço Normal e a Categoria do produto!");
        return;
    }

    const novoId = Date.now();
    const precoPromocional = precoPromoInput !== '' ? parseFloat(precoPromoInput) : null;
    const quantidadeMinimaPromo = qtdMinimaInput !== '' ? parseInt(qtdMinimaInput) : 1;

    const novoProduto = {
        id: novoId,
        titulo: titulo,
        preco: preco,
        precoPromocional: isNaN(precoPromocional) ? null : precoPromocional,
        quantidadeMinimaPromo: isNaN(quantidadeMinimaPromo) ? 1 : quantidadeMinimaPromo,
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
        const inputPreco = document.getElementById(`admin-preco-${p.id}`);
        const inputPromo = document.getElementById(`admin-promo-${p.id}`);
        const inputQtdMin = document.getElementById(`admin-qtdmin-${p.id}`);

        if (inputPreco) {
            const novoValor = parseFloat(inputPreco.value);
            if (!isNaN(novoValor)) {
                p.preco = novoValor;
            }
        }

        if (inputPromo) {
            const valorPromoText = inputPromo.value.trim();
            if (valorPromoText === '') {
                p.precoPromocional = null;
            } else {
                const novoPromoValor = parseFloat(valorPromoText);
                p.precoPromocional = isNaN(novoPromoValor) ? null : novoPromoValor;
            }
        }

        if (inputQtdMin) {
            const novaQtdMin = parseInt(inputQtdMin.value);
            p.quantidadeMinimaPromo = isNaN(novaQtdMin) || novaQtdMin < 1 ? 1 : novaQtdMin;
        }
    });

    localStorage.setItem('produtosCadastradosPersonalizados', JSON.stringify(listaProdutosAtual));

    alert("Preços e promoções atualizados com sucesso!");
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

function calcularTotal(carrinho) {
    let totalPix = 0, totalCartao = 0;

    carrinho.forEach(item => {
        const qtd = item.quantidade || 1;
        const precoNormal = Number(item.preco) || 0;
        const precoPromo = (item.precoPromocional !== undefined && item.precoPromocional !== null && item.precoPromocional !== '') 
            ? Number(item.precoPromocional) 
            : null;
        
        const qtdMinima = item.quantidadeMinimaPromo ? Number(item.quantidadeMinimaPromo) : 1;

        const temDireitoPromo = (precoPromo && precoPromo > 0 && precoPromo < precoNormal && qtd >= qtdMinima);
        const valorUnitarioPix = temDireitoPromo ? precoPromo : precoNormal;
        const valorUnitarioCartao = precoNormal;

        totalPix += (qtd * valorUnitarioPix);
        totalCartao += (qtd * valorUnitarioCartao);
    });

    return { totalPix, totalCartao };
}

function renderizarCarrinho(carrinho) {
    const container = document.getElementById('conteudo-carrinho');
    if (!container) return;
    
    const { totalPix, totalCartao } = calcularTotal(carrinho);

    if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    container.innerHTML = `
        <div class="lista-itens-carrinho">
            ${carrinho.map((item, index) => {
                const qtd = item.quantidade || 1;
                const precoNormal = Number(item.preco) || 0;
                const precoPromo = (item.precoPromocional !== undefined && item.precoPromocional !== null && item.precoPromocional !== '') 
                    ? Number(item.precoPromocional) 
                    : null;
                const qtdMinima = Number(item.quantidadeMinimaPromo) || 1;

                const temPromo = (precoPromo && precoPromo > 0 && precoPromo < precoNormal && qtd >= qtdMinima);
                const subtotalItemPix = qtd * (temPromo ? precoPromo : precoNormal);

                return `
                <div class="item-carrinho">
                    <span>
                        ${item.titulo}
                        ${item.nomePersonalizado ? `<br><small>Nome: ${item.nomePersonalizado}</small>` : ''}
                        ${item.numeroPersonalizado ? `<br><small>Num: ${item.numeroPersonalizado}</small>` : ''}
                    </span>
                    <div>
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, -1)">-</button>
                        <span style="margin: 0 10px;">${qtd}x</span>
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                    <span>R$ ${subtotalItemPix.toFixed(2)}</span>
                </div>
            `;
            }).join('')}
        </div>

        <div class="bloco-batalhao" style="margin: 15px 0; text-align: left;">
            <label for="input-batalhao" style="display: block; margin-bottom: 5px; font-weight: bold;">Informe seu Batalhão (OM / Unidade):</label>
            <input type="text" id="input-batalhao" class="input-batalhao" placeholder="Ex: 11º BPM/I, C-Choque, etc." style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
        </div>

        <div id="painel-total">
            <p>Total PIX: <span class="valor-destaque">R$ ${totalPix.toFixed(2)}</span></p>
            <p>Total Cartão: <span class="valor-destaque">R$ ${totalCartao.toFixed(2)}</span></p>
            <button id="btn-finalizar" onclick="finalizarPedidoWhatsApp()">FINALIZAR PEDIDO VIA WHATSAPP</button>
        </div>
    `;
}

function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const inputBatalhao = document.getElementById('input-batalhao');
    const batalhaoCliente = inputBatalhao ? inputBatalhao.value.trim() : "";

    if (!batalhaoCliente) {
        alert("Por favor, informe o seu Batalhão antes de finalizar o pedido.");
        if (inputBatalhao) inputBatalhao.focus();
        return;
    }

    const { totalPix, totalCartao } = calcularTotal(carrinho);
    
    let itensFormatados = carrinho.map(item => {
        const qtd = item.quantidade || 1;
        const precoNormal = Number(item.preco) || 0;
        const precoPromo = (item.precoPromocional !== undefined && item.precoPromocional !== null && item.precoPromocional !== '') 
            ? Number(item.precoPromocional) 
            : null;
        const qtdMinima = Number(item.quantidadeMinimaPromo) || 1;

        const temPromo = (precoPromo && precoPromo > 0 && precoPromo < precoNormal && qtd >= qtdMinima);
        const subtotalItemPix = qtd * (temPromo ? precoPromo : precoNormal);

        let texto = `\n- ${item.titulo} (${qtd}x)`;
        if (item.nomePersonalizado) texto += ` | Nome: ${item.nomePersonalizado}`;
        if (item.numeroPersonalizado) texto += ` | Num: ${item.numeroPersonalizado}`;
        texto += ` | R$ ${subtotalItemPix.toFixed(2)}`;
        return texto;
    }).join('');

    const mensagem = `Olá! Gostaria de realizar o seguinte pedido:` +
                     `\n\n*Batalhão / Unidade:* ${batalhaoCliente}` +
                     `\n*Itens do Pedido:*${itensFormatados}` +
                     `\n\n*Total PIX (com desconto aplicado):* R$ ${totalPix.toFixed(2)}` +
                     `\n*Total Cartão:* R$ ${totalCartao.toFixed(2)}` +
                     `\n\nPor favor, informe os dados para pagamento.`;

    const numeroWhatsApp = "5511971113924"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}