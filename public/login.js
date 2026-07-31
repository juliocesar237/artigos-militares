// =========================================================================
// LOGIN.JS — TELAS DE LOGIN E CADASTRO
// =========================================================================

import {
    autenticarUsuario,
    cadastrarUsuario
} from './auth.js';

export function renderizarLogin(
    containerId = 'conteudo-principal'
) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const emailSalvo =
        localStorage.getItem('lembrarEmail') || '';

    const senhaSalva =
        localStorage.getItem('lembrarSenha') || '';

    container.innerHTML = `
        <div class="auth-card">
            <h3>Acesso restrito — Tropa</h3>

            <form id="form-login">
                <label for="login-email">
                    E-mail funcional
                </label>

                <input
                    type="text"
                    id="login-email"
                    value="${escaparHtml(emailSalvo)}"
                    placeholder="Digite seu e-mail funcional"
                    autocomplete="username"
                    required
                >

                <label for="login-senha">
                    Senha
                </label>

                <input
                    type="password"
                    id="login-senha"
                    value="${escaparHtml(senhaSalva)}"
                    placeholder="Digite sua senha"
                    autocomplete="current-password"
                    required
                >

                <label class="auth-checkbox">
                    <input
                        type="checkbox"
                        id="lembrar-me"
                        ${emailSalvo ? 'checked' : ''}
                    >

                    Lembrar-me neste dispositivo
                </label>

                <button
                    type="submit"
                    class="btn-tatico btn-primario"
                >
                    Entrar
                </button>
            </form>

            <button
                type="button"
                id="btn-abrir-cadastro"
                class="auth-link"
            >
                Não tem cadastro? Criar conta
            </button>
        </div>
    `;

    document
        .getElementById('form-login')
        ?.addEventListener(
            'submit',
            realizarLogin
        );

    document
        .getElementById('btn-abrir-cadastro')
        ?.addEventListener(
            'click',
            () => renderizarCadastro(containerId)
        );
}

export function renderizarCadastro(
    containerId = 'conteudo-principal'
) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="auth-card">
            <h3>Cadastro institucional</h3>

            <form id="form-cadastro">
                <label for="cad-nome">
                    Nome completo / nome de guerra
                </label>

                <input
                    type="text"
                    id="cad-nome"
                    placeholder="Seu nome"
                    autocomplete="name"
                    required
                >

                <label for="cad-batalhao">
                    Batalhão / unidade
                </label>

                <input
                    type="text"
                    id="cad-batalhao"
                    placeholder="Ex.: 11º BPM/I"
                    required
                >

                <label for="cad-email">
                    E-mail funcional
                </label>

                <input
                    type="text"
                    id="cad-email"
                    placeholder="Seu e-mail funcional"
                    autocomplete="email"
                    required
                >

                <label for="cad-senha">
                    Senha
                </label>

                <input
                    type="password"
                    id="cad-senha"
                    placeholder="Crie uma senha"
                    autocomplete="new-password"
                    minlength="3"
                    required
                >

                <button
                    type="submit"
                    class="btn-tatico btn-primario"
                >
                    Cadastrar
                </button>
            </form>

            <button
                type="button"
                id="btn-voltar-login"
                class="auth-link"
            >
                Já possui uma conta? Entrar
            </button>
        </div>
    `;

    document
        .getElementById('form-cadastro')
        ?.addEventListener(
            'submit',
            salvarCadastro
        );

    document
        .getElementById('btn-voltar-login')
        ?.addEventListener(
            'click',
            () => renderizarLogin(containerId)
        );
}

export function realizarLogin(event) {
    event.preventDefault();

    const email = document
        .getElementById('login-email')
        ?.value.trim()
        .toLowerCase();

    const senha = document
        .getElementById('login-senha')
        ?.value.trim();

    const lembrar = Boolean(
        document.getElementById('lembrar-me')
            ?.checked
    );

    const resultado = autenticarUsuario({
        email,
        senha,
        lembrar
    });

    if (!resultado.sucesso) {
        alert(resultado.mensagem);

        if (resultado.campo) {
            document
                .getElementById(resultado.campo)
                ?.focus();
        }

        return;
    }

    alert('Login realizado com sucesso.');
    window.location.reload();
}

export function salvarCadastro(event) {
    event.preventDefault();

    const dados = {
        nome: document
            .getElementById('cad-nome')
            ?.value.trim(),

        batalhao: document
            .getElementById('cad-batalhao')
            ?.value.trim(),

        email: document
            .getElementById('cad-email')
            ?.value.trim()
            .toLowerCase(),

        senha: document
            .getElementById('cad-senha')
            ?.value.trim()
    };

    const resultado = cadastrarUsuario(dados);

    if (!resultado.sucesso) {
        alert(resultado.mensagem);

        if (resultado.campo) {
            document
                .getElementById(resultado.campo)
                ?.focus();
        }

        return;
    }

    alert('Cadastro realizado com sucesso.');
    window.location.reload();
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}