const SUPABASE_URL = 'https://mrzhseelzlfrdhdrmtcy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dErYTyFdVx6V5v4f-1DhGw_r08SIYey';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dadosWiki = { segmentos: [] };
let usuarioLogado = null;
let idParaDeletar = null;
let modoEdicao = false;
let toastTimer = null;

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

_supabase.auth.onAuthStateChange((event, session) => {
    usuarioLogado = session ? session.user : null;
    atualizarBotaoAdmin();

    const footer = document.getElementById('sidebarFooter');
    if (footer) footer.style.display = usuarioLogado ? 'block' : 'none';

    if (dadosWiki.segmentos.length > 0) renderizarSidebar();
});

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

function clicouAdmin() {
    if (usuarioLogado) {
        abrirModal('modalLogout');
    } else {
        window.location.href = 'login.html';
    }
}

async function fazerLogout() {
    await _supabase.auth.signOut();
    fecharModal();
    toast('Você saiu do modo admin', 'sucesso');
    setTimeout(() => location.reload(), 800);
}

function resetarWiki() {
    document.getElementById('painelConteudo').style.display = 'none';
    document.getElementById('conteudoVazio').style.display = 'flex';
    document.getElementById('resultadosPesquisa').style.display = 'none';
    limparPesquisa();
    marcarAtivo(null);
}

function abrirDrawer(dadosEdicao = null) {
    modoEdicao = !!dadosEdicao;
    const titulo = document.getElementById('drawerTitulo');
    const btnSalvar = document.getElementById('btnSalvar');

    if (modoEdicao) {
        titulo.textContent = 'Editar conteúdo';
        btnSalvar.textContent = 'Salvar alterações';
        preencherDrawerEdicao(dadosEdicao);
    } else {
        titulo.textContent = 'Adicionar conteúdo';
        btnSalvar.textContent = 'Salvar';
        limparDrawer();
        preencherDropdownSegmentos('selectSegmento');
    }

    document.getElementById('drawer').classList.add('aberto');
    document.getElementById('drawerOverlay').classList.add('aberto');
    document.getElementById('selectSegmento').focus();
}

function fecharDrawer() {
    document.getElementById('drawer').classList.remove('aberto');
    document.getElementById('drawerOverlay').classList.remove('aberto');
}

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

function preencherDropdownSegmentos(idSelect) {
    const select = document.getElementById(idSelect);
    select.innerHTML = '<option value="">selecione...</option><option value="novo">+ criar novo segmento</option>';
    [...new Set(dadosWiki.segmentos.map(s => s.titulo))].sort().forEach(nome => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = nome;
        select.appendChild(opt);
    });
}

function preencherDropdownTopicos(idSelect, nomeSegmento) {
    const select = document.getElementById(idSelect);
    select.innerHTML = '<option value="">selecione...</option><option value="novo">+ criar novo tópico</option>';
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
            document.getElementById('selectTopico').innerHTML = '<option value="novo">+ criar novo tópico</option>';
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

async function salvarConteudo() {
    const btn = document.getElementById('btnSalvar');
    const segSel = document.getElementById('selectSegmento').value;
    const topSel = document.getElementById('selectTopico').value;
    const seg = segSel === 'novo' ? document.getElementById('addSegmentoNovo').value.trim() : segSel;
    const top = topSel === 'novo' ? document.getElementById('addTopicoNovo').value.trim() : topSel;
    const sub = document.getElementById('addSubtopico').value.trim();
    const txt = document.getElementById('addTexto').value.trim();

    if (!seg || !top || !txt) {
        toast('Preencha segmento, tópico e o conteúdo', 'erro');
        return;
    }

    btn.textContent = 'Salvando...';
    btn.disabled = true;

    let error;

    if (modoEdicao) {
        const id = document.getElementById('editId').value;
        ({ error } = await _supabase.from('wiki_conteudos').update({
            segmento: seg, topico: top, subtopico: sub, texto: txt
        }).eq('id', id));
    } else {
        ({ error } = await _supabase.from('wiki_conteudos').insert([{
            segmento: seg, topico: top, subtopico: sub, texto: txt
        }]));
    }

    if (error) {
        toast('Erro ao salvar: ' + error.message, 'erro');
        btn.textContent = modoEdicao ? 'Salvar alterações' : 'Salvar';
        btn.disabled = false;
    } else {
        toast(modoEdicao ? 'Conteúdo atualizado' : 'Conteúdo salvo', 'sucesso');
        fecharDrawer();
        setTimeout(() => location.reload(), 700);
    }
}

function confirmarDelete(id) {
    idParaDeletar = id;
    abrirModal('modalDelete');

    document.getElementById('btnConfirmarDelete').onclick = async () => {
        const { error } = await _supabase.from('wiki_conteudos').delete().eq('id', idParaDeletar);
        fecharModal();
        if (!error) {
            toast('Conteúdo apagado', 'sucesso');
            setTimeout(() => location.reload(), 700);
        } else {
            toast('Erro ao apagar', 'erro');
        }
    };
}

function abrirModal(id) {
    document.getElementById(id).classList.add('aberto');
}

function fecharModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('aberto'));
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) fecharModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
});

function toast(msg, tipo = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast visivel ' + tipo;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove('visivel');
    }, 2800);
}

function formatarLinks(texto) {
    if (!texto) return '';
    return escapeHtml(texto).replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
}

function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');
}

async function carregarDados() {
    const loading = document.getElementById('sidebarLoading');
    const { data, error } = await _supabase.from('wiki_conteudos').select('*').order('segmento', { ascending: true });

    if (loading) loading.style.display = 'none';

    if (error || !data) {
        if (loading) { loading.style.display = 'block'; loading.textContent = 'Não foi possível carregar o conteúdo'; }
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
        titulo.innerHTML = `<span class="seta" aria-hidden="true">▸</span> ${escapeHtml(seg.titulo)}`;
        titulo.setAttribute('aria-expanded', 'false');
        titulo.onclick = () => {
            const aberto = segEl.classList.toggle('aberto');
            titulo.setAttribute('aria-expanded', String(aberto));
        };

        const lista = document.createElement('div');
        lista.className = 'sidebar-topicos';

        seg.topicos.forEach(top => {
            const topEl = document.createElement('button');
            topEl.className = 'sidebar-topico';
            topEl.dataset.topId = top.id;
            topEl.textContent = top.titulo;
            topEl.onclick = () => abrirTopico(seg, top, topEl);
            lista.appendChild(topEl);

            top.subtopicos.forEach(sub => {
                const subEl = document.createElement('button');
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

function abrirTopico(seg, top, elClicado) {
    marcarAtivo(elClicado);

    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';

    let html = `
        <div class="painel-breadcrumb">
            <button class="breadcrumb-link" onclick="abrirSegmento('${seg.id}')">${escapeHtml(seg.titulo)}</button>
            <span class="sep">›</span>
            <span>${escapeHtml(top.titulo)}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${escapeHtml(top.titulo)}</h2>
            ${usuarioLogado ? btnsAdminHtml(top.id_banco, seg.titulo, top.titulo, '', top.texto) : ''}
        </div>
    `;

    if (top.texto) {
        html += `<div class="painel-texto">${formatarLinks(top.texto).replace(/\n/g, '<br>')}</div>`;
    }

    top.subtopicos.forEach(sub => {
        html += `
            <div class="painel-sub" id="sub-${sub.id}">
                <div class="painel-sub-topo">
                    <div class="painel-sub-titulo">${escapeHtml(sub.titulo)}</div>
                    ${usuarioLogado ? btnsAdminHtml(sub.id_banco, seg.titulo, top.titulo, sub.titulo, sub.texto) : ''}
                </div>
                <div class="painel-sub-texto">${formatarLinks(sub.texto).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    });

    painel.innerHTML = html;
    document.getElementById('areaConteudo').scrollTop = 0;
}

function abrirSubtopico(seg, top, sub, elClicado) {
    marcarAtivo(elClicado);

    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';

    painel.innerHTML = `
        <div class="painel-breadcrumb">
            <button class="breadcrumb-link" onclick="abrirSegmento('${seg.id}')">${escapeHtml(seg.titulo)}</button>
            <span class="sep">›</span>
            <button class="breadcrumb-link" onclick="reabrirTopico('${seg.id}', '${top.id}')">${escapeHtml(top.titulo)}</button>
            <span class="sep">›</span>
            <span>${escapeHtml(sub.titulo)}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${escapeHtml(sub.titulo)}</h2>
            ${usuarioLogado ? btnsAdminHtml(sub.id_banco, seg.titulo, top.titulo, sub.titulo, sub.texto) : ''}
        </div>
        <div class="painel-texto">${formatarLinks(sub.texto).replace(/\n/g, '<br>')}</div>
    `;

    document.getElementById('areaConteudo').scrollTop = 0;
}

function reabrirTopico(segId, topId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;
    const top = seg.topicos.find(t => t.id === topId);
    if (!top) return;
    const topEl = document.querySelector(`.sidebar-topico[data-top-id="${topId}"]`);
    abrirTopico(seg, top, topEl);
}

function abrirSegmento(segId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;

    const segEl = document.querySelector(`.sidebar-segmento[data-id="${segId}"]`);
    if (segEl) segEl.classList.add('aberto');

    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');
    const resultados = document.getElementById('resultadosPesquisa');

    vazio.style.display = 'none';
    resultados.style.display = 'none';
    painel.style.display = 'block';
    marcarAtivo(null);

    let html = `
        <div class="painel-breadcrumb">
            <span>${escapeHtml(seg.titulo)}</span>
        </div>
        <div class="painel-topo">
            <h2 class="painel-titulo">${escapeHtml(seg.titulo)}</h2>
        </div>
        <ul class="lista-topicos-seg">
    `;

    seg.topicos.forEach(top => {
        html += `<li>
            <button class="item-topico-seg" onclick="abrirTopicoById('${seg.id}', '${top.id}')">
                ${escapeHtml(top.titulo)}
                ${top.subtopicos.length > 0 ? `<small>${top.subtopicos.length} subtópico(s)</small>` : ''}
            </button>
        </li>`;
    });

    html += '</ul>';
    painel.innerHTML = html;
    document.getElementById('areaConteudo').scrollTop = 0;
}

function abrirTopicoById(segId, topId) {
    const seg = dadosWiki.segmentos.find(s => s.id === segId);
    if (!seg) return;
    const top = seg.topicos.find(t => t.id === topId);
    if (!top) return;
    const topEl = document.querySelector(`.sidebar-topico[data-top-id="${topId}"]`);
    abrirTopico(seg, top, topEl);
}

function btnsAdminHtml(id, seg, top, sub, txt) {
    const dados = btoa(unescape(encodeURIComponent(JSON.stringify({ id, seg, top, sub, txt }))));
    return `<div class="btns-admin">
        <button class="btn-edit" onclick="editarItem('${dados}')">Editar</button>
        <button class="btn-del" onclick="confirmarDelete('${id}')">Apagar</button>
    </div>`;
}

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

function marcarAtivo(el) {
    document.querySelectorAll('.sidebar-topico, .sidebar-subtopico').forEach(e => e.classList.remove('ativo'));
    if (el) el.classList.add('ativo');
}

function normalizar(t) {
    return t ? t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
}

function extrairTrecho(texto, termo) {
    if (!texto || !termo) return '';
    const tNorm = normalizar(texto);
    const idx = tNorm.indexOf(normalizar(termo));
    if (idx === -1) return '';

    const inicio = Math.max(0, idx - 40);
    const fim = Math.min(texto.length, idx + termo.length + 60);
    let trecho = escapeHtml(texto.slice(inicio, fim).replace(/\n/g, ' '));
    if (inicio > 0) trecho = '...' + trecho;
    if (fim < texto.length) trecho = trecho + '...';

    const termoEscapado = escapeHtml(termo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${termoEscapado})`, 'gi');
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
                    relevancia: noTitulo ? 2 : 1
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

    return res.sort((a, b) => b.relevancia - a.relevancia);
}

function mostrarResultados(resultados, termo) {
    const area = document.getElementById('resultadosPesquisa');
    const painel = document.getElementById('painelConteudo');
    const vazio = document.getElementById('conteudoVazio');

    painel.style.display = 'none';
    vazio.style.display = 'none';

    const termoSeguro = escapeHtml(termo);

    if (resultados.length === 0) {
        area.innerHTML = `<p class="resultado-vazio">Nenhum resultado para "<strong>${termoSeguro}</strong>"</p>`;
    } else {
        let html = `<h3>${resultados.length} resultado(s) para "<strong>${termoSeguro}</strong>"</h3><ul class="resultados-lista">`;
        resultados.forEach((r, i) => {
            html += `<li>
                        <button class="resultado-item" onclick="navegarResultado(${i})">
                            <strong>${escapeHtml(r.titulo)}</strong>
                            <small>${escapeHtml(r.caminho)}</small>
                            ${r.trecho ? `<div class="resultado-trecho">${r.trecho}</div>` : ''}
                        </button>
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

function alternarTema() {
    const dark = document.body.classList.toggle('dark-mode');
    document.querySelector('.icone-tema').textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('tema', dark ? 'escuro' : 'claro');
}

let debouncePesquisa = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();

    if (localStorage.getItem('tema') === 'escuro') {
        document.body.classList.add('dark-mode');
        document.querySelector('.icone-tema').textContent = '🌙';
    }

    document.getElementById('botaoTema').onclick = alternarTema;

    const barra = document.querySelector('.barra-pesquisa');
    barra.oninput = (e) => {
        const termo = e.target.value.trim();
        clearTimeout(debouncePesquisa);
        debouncePesquisa = setTimeout(() => {
            if (!termo) {
                limparPesquisa();
                resetarWiki();
                return;
            }
            mostrarResultados(pesquisar(termo), termo);
        }, 150);
    };

    barra.onkeydown = (e) => {
        if (e.key === 'Escape') {
            limparPesquisa();
            resetarWiki();
            barra.blur();
        }
    };
});
