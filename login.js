// --- RENDERIZACAO DA TELA DE LOGIN ---
function renderizarLogin(containerId = 'conteudo-principal') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Recupera dados salvos do "Lembrar-me", se existirem
    const salvoEmail = localStorage.getItem('lembrarEmail') || '';
    const salvoSenha = localStorage.getItem('lembrarSenha') || '';
    const estavaMarcado = salvoEmail ? 'checked' : '';

    container.innerHTML = `
        <div class="bloco-login" style="max-width: 400px; margin: 40px auto; padding: 25px; border: 1px solid #ddd; border-radius: 8px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: left;">
            <h3 style="margin-top: 0; text-align: center; margin-bottom: 20px;">Acesso Restrito - Tropa</h3>
            
            <form id="form-login" onsubmit="realizarLogin(event)">
                <div style="margin-bottom: 15px;">
                    <label for="login-email" style="display: block; margin-bottom: 5px; font-weight: bold;">E-mail Funcional:</label>
                    <input type="text" id="login-email" value="${salvoEmail}" required placeholder="Digite seu e-mail funcional" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="login-senha" style="display: block; margin-bottom: 5px; font-weight: bold;">Senha:</label>
                    <input type="password" id="login-senha" value="${salvoSenha}" required placeholder="Sua senha" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="lembrar-me" ${estavaMarcado} style="cursor: pointer;">
                    <label for="lembrar-me" style="font-size: 14px; cursor: pointer; user-select: none;">Lembrar-me neste dispositivo</label>
                </div>

                <button type="submit" style="width: 100%; padding: 10px; background-color: #2c3e50; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">ENTRAR</button>
            </form>

            <div style="margin-top: 15px; text-align: center;">
                <a href="#" onclick="renderizarCadastro()" style="color: #2980b9; text-decoration: none; font-size: 14px;">Nao tem cadastro? Clique aqui</a>
            </div>
        </div>
    `;
}

// --- RENDERIZACAO DA TELA DE CADASTRO ---
function renderizarCadastro(containerId = 'conteudo-principal') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="bloco-cadastro" style="max-width: 400px; margin: 40px auto; padding: 25px; border: 1px solid #ddd; border-radius: 8px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: left;">
            <h3 style="margin-top: 0; text-align: center; margin-bottom: 20px;">Cadastro Institucional</h3>
            
            <form id="form-cadastro" onsubmit="salvarCadastro(event)">
                <div style="margin-bottom: 15px;">
                    <label for="cad-nome" style="display: block; margin-bottom: 5px; font-weight: bold;">Nome Completo / Guerra:</label>
                    <input type="text" id="cad-nome" required placeholder="Seu nome" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="cad-batalhao" style="display: block; margin-bottom: 5px; font-weight: bold;">Batalhao / Unidade:</label>
                    <input type="text" id="cad-batalhao" required placeholder="Ex: 11 BPM/I" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="cad-email" style="display: block; margin-bottom: 5px; font-weight: bold;">E-mail Funcional:</label>
                    <input type="text" id="cad-email" required placeholder="Digite seu e-mail funcional" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="cad-senha" style="display: block; margin-bottom: 5px; font-weight: bold;">Senha:</label>
                    <input type="password" id="cad-senha" required placeholder="Crie uma senha" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <button type="submit" style="width: 100%; padding: 10px; background-color: #27ae60; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">CADASTRAR</button>
            </form>

            <div style="margin-top: 15px; text-align: center;">
                <a href="#" onclick="renderizarLogin()" style="color: #2980b9; text-decoration: none; font-size: 14px;">Ja tem uma conta? Faça login</a>
            </div>
        </div>
    `;
}

// --- FUNCAO DE CADASTRO COM VALIDACAO ---
function salvarCadastro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('cad-nome').value.trim();
    const batalhao = document.getElementById('cad-batalhao').value.trim();
    const email = document.getElementById('cad-email').value.trim().toLowerCase();
    const senha = document.getElementById('cad-senha').value.trim();

    const dominioPermitido = "@policiamilitar.sp.gov.br";
    const ehDev = (email === "msi" && senha === "msi");
    
    if (!ehDev && !email.endsWith(dominioPermitido)) {
        alert("Acesso restrito! O e-mail informado precisa ser o funcional oficial (@policiamilitar.sp.gov.br).");
        document.getElementById('cad-email').focus();
        return;
    }

    const dadosCliente = {
        nome: nome,
        batalhao: batalhao,
        email: email,
        isAdmin: ehDev
    };

    localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosCliente));
    
    alert("Cadastro realizado com sucesso!");
    window.location.reload();
}

// --- FUNCAO DE LOGIN COM CHAVE MESTRA E LEMBRAR-ME ---
function realizarLogin(event) {
    event.preventDefault();
    
    // Mantém exatamente o que foi digitado (sem converter para lowercase no login do dev se preferir, mas .toLowerCase() ajuda)
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const senha = document.getElementById('login-senha').value.trim();
    const lembrarCheckbox = document.getElementById('lembrar-me');

    const dominioPermitido = "@policiamilitar.sp.gov.br";
    
    // Chave mestra exclusiva do dono
    const ehDev = (email === "msi" && senha === "msi");

    if (!ehDev && !email.endsWith(dominioPermitido)) {
        alert("Atenção: Utilize o seu e-mail funcional para acessar.");
        document.getElementById('login-email').focus();
        return;
    }

    if (email && senha) {
        if (lembrarCheckbox && lembrarCheckbox.checked) {
            localStorage.setItem('lembrarEmail', email);
            localStorage.setItem('lembrarSenha', senha);
        } else {
            localStorage.removeItem('lembrarEmail');
            localStorage.removeItem('lembrarSenha');
        }

        const dadosUsuario = {
            email: email,
            isAdmin: ehDev
        };

        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        
        alert("Login efetuado com sucesso!");
        window.location.reload();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}