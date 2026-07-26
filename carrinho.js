// 1. Função de Cálculo Corrigida (Respeita Preço Promocional no PIX e Normal no Cartão)
function calcularTotal(carrinho) {
    let totalPix = 0, totalCartao = 0;
    let qtdBordados = 0, qtdTargetas = 0;

    carrinho.forEach(item => {
        const qtd = item.quantidade || 1;
        const categoria = (item.categoria || '').trim().toLowerCase();
        const titulo = (item.titulo || '').trim().toLowerCase();

        const precoNormal = Number(item.preco) || 0;
        const precoPromo = (item.precoPromocional !== undefined && item.precoPromocional !== null && item.precoPromocional !== '') 
            ? Number(item.precoPromocional) 
            : null;

        const valorUnitarioPix = (precoPromo && precoPromo > 0 && precoPromo < precoNormal) ? precoPromo : precoNormal;
        const valorUnitarioCartao = precoNormal;

        if (categoria === 'bordados' || categoria === 'emborrachados') {
            if (titulo.includes('targeta') || titulo.includes('tarjeta')) {
                qtdTargetas += qtd;
            } else {
                qtdBordados += qtd;
            }
        } else {
            totalCartao += (qtd * valorUnitarioCartao);
            
            if (titulo.includes('agasalho')) {
                totalPix += (qtd * 100);
            } else if (titulo.includes('camiseta ed') || titulo.includes('ed fisica') || titulo.includes('shorts')) {
                totalPix += (qtd >= 4) ? (Math.floor(qtd / 4) * 100) + ((qtd % 4) * 28) : (qtd == 3) ? 85 : (qtd == 2) ? 55 : qtd * 32;
            } else if (titulo.includes('camiseta') && titulo.includes('cinza')) {
                totalPix += (qtd >= 3) ? (Math.floor(qtd / 3) * 90) + ((qtd % 3) * 32) : (qtd == 2) ? 65 : qtd * 35;
            } else {
                totalPix += (qtd * valorUnitarioPix);
            }
        }
    });

    totalPix += (Math.floor(qtdTargetas / 3) * 20) + ((qtdTargetas % 3) * 8);
    totalPix += (Math.floor(qtdBordados / 3) * 12) + ((qtdBordados % 3) * 8);
    totalCartao += ((qtdTargetas + qtdBordados) * 8);
    
    return { totalPix, totalCartao };
}

// 2. Função de Renderização (Atualizada com o campo de Batalhão)
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
            ${carrinho.map((item, index) => `
                <div class="item-carrinho">
                    <span>
                        ${item.titulo}
                        ${item.nomePersonalizado ? `<br><small>Nome: ${item.nomePersonalizado}</small>` : ''}
                        ${item.numeroPersonalizado ? `<br><small>Num: ${item.numeroPersonalizado}</small>` : ''}
                    </span>
                    <div>
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, -1)">-</button>
                        <span style="margin: 0 10px;">${item.quantidade}x</span>
                        <button class="btn-qtd" onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                    <span>R$ ${(item.quantidade * item.preco).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>

        <!-- Campo adicionado para o Batalhão -->
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

// 3. Função de Finalizar Pedido (Atualizada para capturar o Batalhão)
function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Captura o valor digitado no campo de batalhão
    const inputBatalhao = document.getElementById('input-batalhao');
    const batalhaoCliente = inputBatalhao ? inputBatalhao.value.trim() : "";

    if (!batalhaoCliente) {
        alert("Por favor, informe o seu Batalhão antes de finalizar o pedido.");
        if (inputBatalhao) inputBatalhao.focus();
        return;
    }

    const { totalPix, totalCartao } = calcularTotal(carrinho);
    
    let itensFormatados = carrinho.map(item => {
        let texto = `\n- ${item.titulo} (${item.quantidade}x)`;
        if (item.nomePersonalizado) texto += ` | Nome: ${item.nomePersonalizado}`;
        if (item.numeroPersonalizado) texto += ` | Num: ${item.numeroPersonalizado}`;
        texto += ` | R$ ${(item.quantidade * item.preco).toFixed(2)}`;
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