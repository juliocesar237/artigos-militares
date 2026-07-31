// =========================================================================
// WHATSAPP.JS — FINALIZAÇÃO DO PEDIDO
// =========================================================================

import { calcularTotal } from './carrinho.js';

const NUMERO_WHATSAPP = '5511971113924';

/**
 * Valida o carrinho e abre o pedido no WhatsApp.
 */
export function finalizarPedidoWhatsApp() {
    if (!window.AppState) {
        console.error('AppState não foi inicializado.');
        return;
    }

    const carrinho = window.AppState.carrinho || [];

    if (!Array.isArray(carrinho) || carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    const usuarioLogado =
        window.AppState.usuarioLogado ||
        obterUsuarioSalvo();

    const inputBatalhao =
        document.getElementById('input-batalhao');

    const batalhaoInformado =
        inputBatalhao?.value.trim() ||
        usuarioLogado.batalhao ||
        '';

    if (!batalhaoInformado) {
        alert(
            'Informe o seu Batalhão / OM / Unidade antes de finalizar o pedido.'
        );

        inputBatalhao?.focus();
        return;
    }

    const {
        totalPix,
        totalCartao
    } = calcularTotal(carrinho);

    const mensagem = criarMensagemPedido({
        carrinho,
        usuarioLogado,
        batalhaoInformado,
        totalPix,
        totalCartao
    });

    const urlWhatsApp =
        `https://wa.me/${NUMERO_WHATSAPP}` +
        `?text=${encodeURIComponent(mensagem)}`;

    const novaJanela = window.open(
        urlWhatsApp,
        '_blank',
        'noopener,noreferrer'
    );

    if (!novaJanela) {
        window.location.href = urlWhatsApp;
    }
}

/**
 * Cria o texto enviado ao WhatsApp.
 */
function criarMensagemPedido({
    carrinho,
    usuarioLogado,
    batalhaoInformado,
    totalPix,
    totalCartao
}) {
    const cliente =
        usuarioLogado.nome ||
        usuarioLogado.email ||
        'Não informado';

    const itens = carrinho
        .map(item => {
            const quantidade =
                Number(item.quantidade) || 1;

            let linha =
                `- ${quantidade}x ${item.titulo}`;

            if (item.nomePersonalizado) {
                linha +=
                    ` | Nome: ${item.nomePersonalizado}`;
            }

            if (item.numeroPersonalizado) {
                linha +=
                    ` | Tamanho: ${item.numeroPersonalizado}`;
            }

            return linha;
        })
        .join('\n');

    return [
        '*NOVO PEDIDO — ARTIGOS MILITARES*',
        '',
        `*Cliente:* ${cliente}`,
        `*E-mail:* ${usuarioLogado.email || 'Não informado'}`,
        `*Batalhão / OM:* ${batalhaoInformado}`,
        '',
        '*ITENS DO PEDIDO*',
        itens,
        '',
        '*VALORES TOTAIS*',
        `*Total PIX:* R$ ${totalPix.toFixed(2)}`,
        `*Total cartão:* R$ ${totalCartao.toFixed(2)}`,
        '',
        'Por favor, informe os dados para pagamento.'
    ].join('\n');
}

/**
 * Recupera o usuário salvo caso o AppState ainda não contenha os dados.
 */
function obterUsuarioSalvo() {
    try {
        return JSON.parse(
            localStorage.getItem('usuarioLogado')
        ) || {};
    } catch {
        return {};
    }
}