// Exporta as variáveis de estado para que outros arquivos possam acessá-las
export let categoriaAtual = 'todas';
export let patenteAtual = 'todas';

/**
 * @param {string} tipo - 'categoria' ou 'patente'
 * @param {string} valor - O nome da categoria/patente selecionada
 * @param {HTMLElement} btn - O botão clicado para aplicar a classe 'ativo'
 * @param {Function} renderCallback - Função chamada para atualizar a tela
 */
export function filtrar(tipo, valor, btn, renderCallback) {
    if (tipo === 'categoria') {
        categoriaAtual = valor.toLowerCase();  
    } else if (tipo === 'patente') {
        patenteAtual = valor.toLowerCase();
    }

    // Gerenciamento visual: remove a classe ativo apenas dos botões do mesmo grupo/container
    const container = btn.parentElement;
    const botoes = container.querySelectorAll('.filtro-btn');
    botoes.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');

    // Executa a função de renderização passada como callback
    if (typeof renderCallback === 'function') {
        renderCallback();
    }
}