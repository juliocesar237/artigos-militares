// =========================================================================
// AUTH.JS — AUTENTICAÇÃO E ARMAZENAMENTO DO USUÁRIO
// =========================================================================

const CHAVE_USUARIO_LOGADO = 'usuarioLogado';
const CHAVE_CADASTRO = 'dadosCliente';
const DOMINIO_PERMITIDO = '@policiamilitar.sp.gov.br';

export function obterUsuarioLogado() {
    try {
        const texto = localStorage.getItem(CHAVE_USUARIO_LOGADO);

        return texto ? JSON.parse(texto) : null;
    } catch (erro) {
        console.error('Usuário salvo inválido:', erro);

        localStorage.removeItem(CHAVE_USUARIO_LOGADO);

        return null;
    }
}

export function verificarAutenticacao() {
    return obterUsuarioLogado();
}

export function autenticarUsuario({
    email,
    senha,
    lembrar
}) {
    if (!email || !senha) {
        return {
            sucesso: false,
            mensagem: 'Preencha o e-mail e a senha.',
            campo: !email ? 'login-email' : 'login-senha'
        };
    }

    const ehAdmin =
        email === 'msi' &&
        senha === 'msi';

    if (
        !ehAdmin &&
        !email.endsWith(DOMINIO_PERMITIDO)
    ) {
        return {
            sucesso: false,
            mensagem:
                `Utilize o e-mail funcional oficial (${DOMINIO_PERMITIDO}).`,
            campo: 'login-email'
        };
    }

    if (lembrar) {
        localStorage.setItem('lembrarEmail', email);
        localStorage.setItem('lembrarSenha', senha);
    } else {
        localStorage.removeItem('lembrarEmail');
        localStorage.removeItem('lembrarSenha');
    }

    const cadastro = lerCadastroSalvo();

    const pertenceAoCadastro =
        cadastro?.email === email;

    const usuario = {
        nome: pertenceAoCadastro
            ? cadastro.nome
            : '',

        batalhao: pertenceAoCadastro
            ? cadastro.batalhao
            : '',

        email,
        isAdmin: ehAdmin
    };

    salvarUsuarioLogado(usuario);

    return {
        sucesso: true,
        usuario
    };
}

export function cadastrarUsuario({
    nome,
    batalhao,
    email,
    senha
}) {
    if (!nome || !batalhao || !email || !senha) {
        return {
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        };
    }

    const ehAdmin =
        email === 'msi' &&
        senha === 'msi';

    if (
        !ehAdmin &&
        !email.endsWith(DOMINIO_PERMITIDO)
    ) {
        return {
            sucesso: false,
            mensagem:
                `O e-mail deve terminar com ${DOMINIO_PERMITIDO}.`,
            campo: 'cad-email'
        };
    }

    const cadastro = {
        nome,
        batalhao,
        email,
        isAdmin: ehAdmin
    };

    localStorage.setItem(
        CHAVE_CADASTRO,
        JSON.stringify(cadastro)
    );

    salvarUsuarioLogado(cadastro);

    return {
        sucesso: true,
        usuario: cadastro
    };
}

export function salvarUsuarioLogado(usuario) {
    localStorage.setItem(
        CHAVE_USUARIO_LOGADO,
        JSON.stringify(usuario)
    );
}

export function fazerLogout() {
    localStorage.removeItem(CHAVE_USUARIO_LOGADO);

    window.location.reload();
}

function lerCadastroSalvo() {
    try {
        const texto = localStorage.getItem(CHAVE_CADASTRO);

        return texto ? JSON.parse(texto) : null;
    } catch {
        return null;
    }
}