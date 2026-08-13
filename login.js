const SUPABASE_URL = 'https://mrzhseelzlfrdhdrmtcy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dErYTyFdVx6V5v4f-1DhGw_r08SIYey';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

_supabase.auth.getSession().then(({ data }) => {
    if (data.session) window.location.href = 'index.html';
});

function mostrarErro(msg) {
    const erro = document.getElementById('erroMsg');
    erro.textContent = msg;
    erro.style.display = 'block';
}

async function fazerLogin() {
    const btn = document.getElementById('btnEntrar');
    const erro = document.getElementById('erroMsg');
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    if (!email || !senha) {
        mostrarErro('Preencha e-mail e senha para continuar');
        return;
    }

    btn.textContent = 'Entrando...';
    btn.disabled = true;
    erro.style.display = 'none';

    const { error } = await _supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
        mostrarErro('E-mail ou senha inválidos');
        btn.textContent = 'Entrar';
        btn.disabled = false;
    } else {
        btn.textContent = 'Redirecionando...';
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tema') === 'escuro') {
        document.body.classList.add('dark-mode');
    }

    document.getElementById('btnEntrar').onclick = fazerLogin;

    document.getElementById('loginSenha').onkeydown = (e) => {
        if (e.key === 'Enter') fazerLogin();
    };

    document.getElementById('loginEmail').focus();
});
