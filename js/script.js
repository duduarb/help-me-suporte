// config supabase
const SUPABASE_URL = 'https://mrzhseelzlfrdhdrmtcy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dErYTyFdVx6V5v4f-1DhGw_r08SIYey';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dadosWiki = { segmentos: [] };
let usuarioLogado = null;
let idParaDeletar = null; // guarda o id do item que vai ser deletado

// verifica estado de autenticacao
_supabase.auth.onAuthStateChange((event, session) => {
    usuarioLogado = session ? session.user : null;
    atualizarBotaoAdmin();

    const footer = document.getElementById('sidebarFooter');
    if (footer) footer.style.display = usuarioLogado ? 'block' : 'none';

    // rerenderiza pra mostrar/esconder botoes de editar
    if (dadosWiki.segmentos.length > 0) renderizarSidebar();
});

// atualiza o botao de admin no header
function atualizarBotaoAdmin() {
    const btn = document.getElementById('btnAdminHeader');
    const label = document.getElementById('adminLabel');
    if (!btn) return;

    if (usuarioLogado) {
        btn.classList.add('logado');
        label.textContent = 'Sair';
    } else {
        btn.classList.remove('logado');
        label.textContent = 'Login';
    }
}

// clicou no botao admin do header
function clicouAdmin() {
    if (usuarioLogado) {
        // pede confirmacao antes de sair
        abrirModal('modalLogout');
    } else {
        // manda pra pagina de login
        window.location.href = 'login.html';
    }
}

async function fazerLogout() {
    await _supabase.auth.signOut();
    fecharModal();
    toast('saiu do modo admin', 'sucesso');
    setTimeout(() => location.reload(), 800);
}

// reseta a wiki pro estado inicial
function resetarWiki() {
    document.getElementById('painelConteudo').style.display = 'none';
    document.getElementById('conteudoVazio').style.display = 'flex';
    document.getElementById('resultadosPesquisa').style.display = 'none';
    limparPesquisa();
    marcarAtivo(null);
}

// ----- drawer de adicionar/editar -----

let modoEdicao = false; // controla se ta adicionando ou editando

function abrirDrawer(dadosEdicao = null) {
    modoEdicao = !!dadosEdicao;
    const titulo = document.getElementById('drawerTitulo');
    const btnSalvar = document.getElementById('btnSalvar');

    if (modoEdicao) {
        titulo.textContent = 'Editar Conteúdo';
        btnSalvar.textContent = 'Salvar Alterações';
        preencherDrawerEdicao(dadosEdicao);
    } else {
        titulo.textContent = 'Adicionar Conteúdo';
        btnSalvar.textContent = 'Salvar';
        limparDrawer();
        preencherDropdownSegmentos('selectSegmento');
    }

    document.getElementById('drawer').classList.add('aberto');
    document.getElementById('drawerOverlay').classList.add('aberto');
}

function fecharDrawer() {
    document.getElementById('drawer').classList.remove('aberto');
    document.getElementById('drawerOverlay').classList.remove('aberto');
}

// limpa os campos do drawer
function limparDrawer() {
    document.getElementById('editId').value = '';
    document.getElementById('selectSegmento').value = '';
    document.getElementById('selectTopico').innerHTML = '<option value="">selecione um segmento primeiro...</option>';
    document.getElementById('addSegmentoNovo').style.display = 'none';
    document.getElementById('addSegmentoNovo').value = '';
    document.getElementById('addTopicoNovo').style.display = 'none';
    document.getElementById('addTopicoNovo').value = '';
    document.getElementById('addSubtopico').value = '';
    document.getElementById('addTexto').value = '';
}

// preenche o drawer com dados pra edicao
function preencherDrawerEdicao(d) {
    document.getElementById('editId').value = d.id;
    preencherDropdownSegmentos('selectSegmento');
    document.getElementById('selectSegmento').value = d.segmento;
    preencherDropdownTopicos('selectTopico', d.segmento);
    document.getElementById('selectTopico').value = d.topico;
    document.getElementById('addSubtopico').value = d.subtopico || '';
    document.getElementById('addTexto').value = d.texto || '';
    document.getElementById('addSegmentoNovo').style.display = 'none';
    document.getElementById('addTopicoNovo').style.display = 'none';
}

// ----- dropdowns dinâmicos -----

function preencherDropdownSegmentos(idSelect) {
    const select = document.getElementById(idSelect);
    select.innerHTML = `<option value="">selecione...</option><option value="novo">+ criar novo segmento</option>`;
    [...new Set(dadosWiki.segmentos.map(s => s.titulo))].sort().forEach(nome => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = nome;
        select.appendChild(opt);
    });
}

function preencherDropdownTopicos(idSelect, nomeSegmento) {
    const select = document.getElementById(idSelect);
    select.innerHTML = `<option value="">selecione...</option><option value="novo">+ criar novo topico</option>`;
    if (!nomeSegmento) return;
    const seg = dadosWiki.segmentos.find(s => s.titulo === nomeSegmento);
    if (seg) {
        [...new Set(seg.topicos.map(t => t.titulo))].sort().forEach(nome => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = nome;
            select.appendChild(opt);
        });
    }
}

function ajustarInputsDinamicos(nivel) {
    if (nivel === 'segmento') {
        const segSel = document.getElementById('selectSegmento');
        const inputSeg = document.getElementById('addSegmentoNovo');
        if (segSel.value === 'novo') {
            inputSeg.style.display = 'block';
            document.getElementById('selectTopico').innerHTML = '<option value="novo">+ criar novo topico</option>';
            ajustarInputsDinamicos('topico');
        } else {
            inputSeg.style.display = 'none';
            preencherDropdownTopicos('selectTopico', segSel.value);
            document.getElementById('addTopicoNovo').style.display = 'none';
        }
    } else {
        const topSel = document.getElementById('selectTopico');
        document.getElementById('addTopicoNovo').style.display = topSel.value === 'novo' ? 'block' : 'none';
    }
}

// ----- salvar conteudo (add ou edit) -----

async function salvarConteudo() {
    const btn = document.getElementById('btnSalvar');
    const segSel = document.getElementById('selectSegmento').value;
    const topSel = document.getElementById('selectTopico').value;
    const seg = segSel === 'novo' ? document.getElementById('addSegmentoNovo').value.trim() : segSel;
    const top = topSel === 'novo' ? document.getElementById('addTopicoNovo').value.trim() : topSel;
    const sub = document.getElementById('addSubtopico').value.trim();
    const txt = document.getElementById('addTexto').value.trim();

    if (!seg || !top || !txt) {
        toast('preenche segmento, tópico e o texto', 'erro');
        return;
    }

    btn.textContent = 'salvando...';
    btn.disabled = true;

    let error;

    if (modoEdicao) {
        // edita o registro existente
        const id = document.getElementById('editId').value;
        ({ error } = await _supabase.from('wiki_conteudos').update({
            segmento: seg, topico: top, subtopico: sub, texto: txt
        }).eq('id', id));
    } else {
        // insere novo registro
        ({ error } = await _supabase.from('wiki_conteudos').insert([{
            segmento: seg, topico: top, subtopico: sub, texto: txt
        }]));
    }

    if (error) {
        toast('erro ao salvar: ' + error.message, 'erro');
        btn.textContent = modoEdicao ? 'Salvar Alterações' : 'Salvar';
        btn.disabled = false;
    } else {
        toast(modoEdicao ? 'atualizado!' : 'salvo!', 'sucesso');
        fecharDrawer();
        setTimeout(() => location.reload(), 700);
    }
}

// ----- deletar -----

function confirmarDelete(id) {
    idParaDeletar = id;
    abrirModal('modalDelete');

    // configura o botao de confirmar
    document.getElementById('btnConfirmarDelete').onclick = async () => {
        const { error } = await _supabase.from('wiki_conteudos').delete().eq('id', idParaDeletar);
        fecharModal();
        if (!error) {
            toast('apagado!', 'sucesso');
            setTimeout(() => location.reload(), 700);
        } else {
            toast('erro ao apagar', 'erro');
        }
    };
}

// ----- modais simples -----

function abrirModal(id) {
    document.getElementById(id).classList.add('aberto');
}

function fecharModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('aberto'));
}

// clique fora fecha o modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) fecharModal();
});

// ----- toast -----

let toastTimer = null;

function toast(msg, tipo = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast visivel ' + tipo;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove('visivel');
    }, 2800);
}

// ----- carregar e renderizar -----

function formatarLinks(texto) {
    if (!texto) return '';
    return texto.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);
}

function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');
}

async function carregarDados() {
    const loading = document.getElementById('sidebarLoading');
    const { data, error } = await _supabase.from('wiki_conteudos').select('*').order('segmento', { ascending: true });

    if (loading) loading.style.display = 'none';

    if (error || !data) {
        if (loading) { loading.style.display = 'block'; loading.textContent = 'erro ao carregar :('; }
        return;
    }

    const organizado = { segmentos: [] };

    data.forEach(item => {
        let seg = organizado.segmentos.find(s => s.titulo === item.segmento);
        if (!seg) {
            seg = { id: slugify(item.segmento), titulo: item.segmento, topicos: [] };
            organizado.segmentos.push(seg);
        }

        let top = seg.topicos.find(t => t.titulo === item.topico);
        if (!top) {
            top = {
                id_banco: item.id,
                id: slugify(item.topico),
                titulo: item.topico,
                texto: item.subtopico ? '' : item.texto,
                subtopicos: []
            };
            seg.topicos.push(top);
        }

        if (item.subtopico) {
            top.subtopicos.push({
                id_banco: item.id,
                id: slugify(item.subtopico),
                titulo: item.subtopico,
                texto: item.texto
            });
        }
    });

    dadosWiki = organizado;
    renderizarSidebar();
}

// monta a sidebar
function renderizarSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    nav.innerHTML = '';

    dadosWiki.segmentos.forEach(seg => {
        const segEl = document.createElement('div');
        segEl.className = 'sidebar-segmento';
        segEl.dataset.id = seg.id;

        const titulo = document.createElement('button');
        titulo.className = 'sidebar-seg-titulo';
        titulo.innerHTML = `<span class="seta">▸</span> ${seg.titulo}`;
        titulo.onclick = () => segEl.classList.toggle('aberto');

        const lista = document.createElement('div');
        lista.className = 'sidebar-topicos';

        seg.topicos.forEach(top => {
            const topEl = document.createElement('div');
            topEl.className = 'sidebar-topico';
            topEl.dataset.topId = top.id;
            topEl.textContent = top.titulo;
            topEl.onclick = () => abrirTopico(seg, top, topEl);
            lista.appendChild(topEl);

            // subtopicos aparecem embaixo do topico na sidebar
            top.subtopicos.forEach(sub => {
                const subEl = document.createElement('div');
                subEl.className = 'sidebar-subtopico';
                subEl.dataset.subId = sub.id;
                subEl.textContent = sub.titulo;
                subEl.onclick = () => abrirSubtopico(seg, top, sub, subEl);
                lista.appendChild(subEl);
            });
        });

        segEl.appendChild(titulo);
        segEl.appendChild(lista);
        nav.appendChild(segEl);
    });
}

// abre o topico no painel da direita
function abrirTopico(seg, top, elClicado) {
    marcarAtivo(elClicado);

    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';

    // breadcrumb
    let html = `
        <div class="painel-breadcrumb">
            <span class="breadcrumb-link" onclick="abrirSegmento('${seg.id}')">${seg.titulo}</span>
            <span class="sep">›</span>
            <span>${top.titulo}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${top.titulo}</h2>
            ${usuarioLogado ? btnsAdminHtml(top.id_banco, seg.titulo, top.titulo, '', top.texto) : ''}
        </div>
    `;

    if (top.texto) {
        html += `<div class="painel-texto">${formatarLinks(top.texto).replace(/\n/g, '<br>')}</div>`;
    }

    // subtopicos
    top.subtopicos.forEach(sub => {
        html += `
            <div class="painel-sub" id="sub-${sub.id}">
                <div class="painel-sub-topo">
                    <div class="painel-sub-titulo">${sub.titulo}</div>
                    ${usuarioLogado ? btnsAdminHtml(sub.id_banco, seg.titulo, top.titulo, sub.titulo, sub.texto) : ''}
                </div>
                <div class="painel-sub-texto">${formatarLinks(sub.texto).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    });

    painel.innerHTML = html;
    document.getElementById('areaConteudo').scrollTop = 0;
}

// abre o topico e da scroll pro subtopico
function abrirSubtopico(seg, top, sub, elClicado) {
    marcarAtivo(elClicado);

    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';

    // mostra so o subtopico selecionado, nao o topico inteiro
    painel.innerHTML = `
        <div class="painel-breadcrumb">
            <span class="breadcrumb-link" onclick="abrirSegmento('${seg.id}')">${seg.titulo}</span>
            <span class="sep">›</span>
            <span class="breadcrumb-link" onclick="reabrirTopico('${seg.id}', '${top.id}')">${top.titulo}</span>
            <span class="sep">›</span>
            <span>${sub.titulo}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${sub.titulo}</h2>
            ${usuarioLogado ? btnsAdminHtml(sub.id_banco, seg.titulo, top.titulo, sub.titulo, sub.texto) : ''}
        </div>
        <div class="painel-texto">${formatarLinks(sub.texto).replace(/\n/g, '<br>')}</div>
    `;

    document.getElementById('areaConteudo').scrollTop = 0;
}

// abre o topico pai quando clica no breadcrumb
function reabrirTopico(segId, topId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;
    const top = seg.topicos.find(t => t.id === topId);
    if (!top) return;
    const topEl = document.querySelector(`.sidebar-topico[data-top-id="${topId}"]`);
    abrirTopico(seg, top, topEl);
}

// expande o segmento na sidebar e mostra os topicos dele no painel
function abrirSegmento(segId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;

    // abre na sidebar
    const segEl = document.querySelector(`.sidebar-segmento[data-id="${segId}"]`);
    if (segEl) segEl.classList.add('aberto');

    // mostra lista de topicos do segmento no painel em vez de tela em branco
    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';
    marcarAtivo(null);

    let html = `
        <div class="painel-breadcrumb">
            <span>${seg.titulo}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${seg.titulo}</h2>
        </div>
        <ul class="lista-topicos-seg">
    `;

    seg.topicos.forEach(top => {
        html += `<li class="item-topico-seg" onclick="abrirTopicoById('${seg.id}', '${top.id}')">
            ${top.titulo}
            ${top.subtopicos.length > 0 ? `<small>${top.subtopicos.length} subtópico(s)</small>` : ''}
        </li>`;
    });

    html += '</ul>';
    painel.innerHTML = html;
    document.getElementById('areaConteudo').scrollTop = 0;
}

// abre topico pelo id - usado na lista de topicos do segmento
function abrirTopicoById(segId, topId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;
    const top = seg.topicos.find(t => t.id === topId);
    if (!top) return;
    const topEl = document.querySelector(`.sidebar-topico[data-top-id="${topId}"]`);
    abrirTopico(seg, top, topEl);
}

// gera o html dos botoes de editar/deletar no painel
function btnsAdminHtml(id, seg, top, sub, txt) {
    // dados em base64 pra evitar problema com aspas especiais
    const dados = btoa(unescape(encodeURIComponent(JSON.stringify({ id, seg, top, sub, txt }))));
    return `<div class="btns-admin">
        <button class="btn-edit" onclick="editarItem('${dados}')">editar</button>
        <button class="btn-del" onclick="confirmarDelete(${id})">apagar</button>
    </div>`;
}

// decodifica os dados e abre o drawer de edicao
function editarItem(dadosBase64) {
    const dados = JSON.parse(decodeURIComponent(escape(atob(dadosBase64))));
    abrirDrawer({
        id: dados.id,
        segmento: dados.seg,
        topico: dados.top,
        subtopico: dados.sub,
        texto: dados.txt
    });
}

// marca item ativo na sidebar
function marcarAtivo(el) {
    document.querySelectorAll('.sidebar-topico, .sidebar-subtopico').forEach(e => e.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}

// ----- pesquisa -----

function normalizar(t) {
    return t ? t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
}

// pega um trecho do texto em volta da palavra encontrada
function extrairTrecho(texto, termo) {
    if (!texto || !termo) return '';
    const tNorm = normalizar(texto);
    const idx = tNorm.indexOf(normalizar(termo));
    if (idx === -1) return '';

    const inicio = Math.max(0, idx - 40);
    const fim = Math.min(texto.length, idx + termo.length + 60);
    let trecho = texto.slice(inicio, fim).replace(/\n/g, ' ');
    if (inicio > 0) trecho = '...' + trecho;
    if (fim < texto.length) trecho = trecho + '...';

    // destaca o termo encontrado no trecho
    const regex = new RegExp(`(${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return trecho.replace(regex, '<mark>$1</mark>');
}

function pesquisar(termo) {
    const t = normalizar(termo);
    if (!t) return [];
    const res = [];

    dadosWiki.segmentos.forEach(s => {
        s.topicos.forEach(top => {
            const noTitulo = normalizar(top.titulo).includes(t);
            const noTexto = normalizar(top.texto).includes(t);

            if (noTitulo || noTexto) {
                res.push({
                    seg: s, top, sub: null,
                    titulo: top.titulo,
                    caminho: `${s.titulo} › ${top.titulo}`,
                    trecho: noTexto ? extrairTrecho(top.texto, termo) : '',
                    relevancia: noTitulo ? 2 : 1 // titulo tem peso maior
                });
            }

            top.subtopicos.forEach(sub => {
                const noSubTitulo = normalizar(sub.titulo).includes(t);
                const noSubTexto = normalizar(sub.texto).includes(t);

                if (noSubTitulo || noSubTexto) {
                    res.push({
                        seg: s, top, sub,
                        titulo: sub.titulo,
                        caminho: `${s.titulo} › ${top.titulo} › ${sub.titulo}`,
                        trecho: noSubTexto ? extrairTrecho(sub.texto, termo) : '',
                        relevancia: noSubTitulo ? 2 : 1
                    });
                }
            });
        });
    });

    // ordena por relevancia (titulo > texto)
    return res.sort((a, b) => b.relevancia - a.relevancia);
}

function mostrarResultados(resultados, termo) {
    const area = document.getElementById('resultadosPesquisa');
    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');

    painel.style.display = 'none';
    vazio.style.display = 'none';

    if (resultados.length === 0) {
        area.innerHTML = `<p style="color:var(--texto3); font-size:0.85rem; padding: 0.5rem 0">nenhum resultado pra "<strong>${termo}</strong>"</p>`;
    } else {
        let html = `<h3>${resultados.length} resultado(s) para "<strong>${termo}</strong>"</h3><ul class="resultados-lista">`;
        resultados.forEach((r, i) => {
            html += `<li class="resultado-item" onclick="navegarResultado(${i})">
                        <strong>${r.titulo}</strong>
                        <small>${r.caminho}</small>
                        ${r.trecho ? `<div class="resultado-trecho">${r.trecho}</div>` : ''}
                     </li>`;
        });
        area.innerHTML = html + '</ul>';
    }

    area.style.display = 'block';
    window._resultadosPesquisa = resultados;
}

function navegarResultado(i) {
    const r = window._resultadosPesquisa[i];
    if (!r) return;
    limparPesquisa();

    // abre o segmento correto na sidebar
    const segEl = document.querySelector(`.sidebar-segmento[data-id="${r.seg.id}"]`);
    if (segEl) segEl.classList.add('aberto');

    if (r.sub) {
        abrirSubtopico(r.seg, r.top, r.sub, null);
    } else {
        const topEl = document.querySelector(`.sidebar-topico[data-top-id="${r.top.id}"]`);
        abrirTopico(r.seg, r.top, topEl);
    }
}

function limparPesquisa() {
    document.getElementById('resultadosPesquisa').style.display = 'none';
    document.querySelector('.barra-pesquisa').value = '';
}

// ----- tema -----

function alternarTema() {
    const dark = document.body.classList.toggle('dark-mode');
    document.querySelector('.icone-tema').textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('tema', dark ? 'escuro' : 'claro');
}

// ----- init -----

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();

    // aplica tema salvo
    if (localStorage.getItem('tema') === 'escuro') {
        document.body.classList.add('dark-mode');
        document.querySelector('.icone-tema').textContent = '🌙';
    }

    document.getElementById('botaoTema').onclick = alternarTema;

    // pesquisa em tempo real
    const barra = document.querySelector('.barra-pesquisa');
    barra.oninput = (e) => {
        const termo = e.target.value.trim();
        if (!termo) {
            limparPesquisa();
            resetarWiki();
            return;
        }
        mostrarResultados(pesquisar(termo), termo);
    };

    // esc limpa a pesquisa
    barra.onkeydown = (e) => {
        if (e.key === 'Escape') {
            limparPesquisa();
            resetarWiki();
            barra.blur();
        }
    };
});