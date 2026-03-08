// config supabase
const SUPABASE_URL = 'https://mrzhseelzlfrdhdrmtcy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dErYTyFdVx6V5v4f-1DhGw_r08SIYey';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dadosWiki = { segmentos: [] };
let usuarioLogado = null;

// autenticação  

_supabase.auth.onAuthStateChange((event, session) => {
    usuarioLogado = session ? session.user : null;
    
    const btnAddContainer = document.getElementById('containerAdicionarLateral');
    if (btnAddContainer) btnAddContainer.style.display = usuarioLogado ? 'flex' : 'none';

    if (dadosWiki.segmentos.length > 0) carregarSegmentos();
});

async function realizarLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginSenha').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Erro no login: " + error.message);
    } else {
        fecharModais();
        alert("Bem-vindo, Admin!");
    }
}

async function realizarLogout() {
    await _supabase.auth.signOut();
    fecharModais();
    alert("Você saiu do modo administrativo.");
    location.reload();
}

function gerenciarPainelAdmin() {
    if (usuarioLogado) {
        document.getElementById('modalOpcoesAdmin').style.display = 'flex';
    } else {
        document.getElementById('modalLogin').style.display = 'flex';
    }
}

function fecharModais() {
    const modais = ['modalLogin', 'modalOpcoesAdmin', 'modalAdmin', 'modalEditar'];
    modais.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });
}

// add e edit

function abrirModalAdicionar() {
    preencherDropdownSegmentos('selectSegmento');
    document.getElementById('modalOpcoesAdmin').style.display = 'none';
    document.getElementById('modalAdmin').style.display = 'flex';
}

function preencherDropdownSegmentos(idSelect) {
    const select = document.getElementById(idSelect);
    const labelNovo = idSelect === 'selectSegmento' ? '+ Criar Novo Segmento' : '+ Mudar nome do Segmento';
    select.innerHTML = `<option value="">Selecione...</option><option value="novo">${labelNovo}</option>`;
    
    const nomesSegmentos = [...new Set(dadosWiki.segmentos.map(s => s.titulo))].sort();
    nomesSegmentos.forEach(nome => {
        const option = document.createElement('option');
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
    });
}

function preencherDropdownTopicos(idSelect, nomeSegmento) {
    const select = document.getElementById(idSelect);
    const labelNovo = idSelect === 'selectTopico' ? '+ Criar Novo Tópico' : '+ Mudar nome do Tópico';
    select.innerHTML = `<option value="">Selecione...</option><option value="novo">${labelNovo}</option>`;
    
    if (!nomeSegmento) return;

    const segmento = dadosWiki.segmentos.find(s => s.titulo === nomeSegmento);
    if (segmento) {
        const nomesTopicos = [...new Set(segmento.topicos.map(t => t.titulo))].sort();
        nomesTopicos.forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            option.textContent = nome;
            select.appendChild(option);
        });
    }
}

function ajustarInputsDinamicos(nivel) {
    if (nivel === 'segmento') {
        const selectSeg = document.getElementById('selectSegmento');
        const inputNovoSeg = document.getElementById('addSegmentoNovo');
        if (selectSeg.value === 'novo') {
            inputNovoSeg.style.display = 'block';
            const selectTop = document.getElementById('selectTopico');
            selectTop.innerHTML = '<option value="novo">+ Criar Novo Tópico</option>';
            selectTop.value = 'novo';
            ajustarInputsDinamicos('topico');
        } else {
            inputNovoSeg.style.display = 'none';
            preencherDropdownTopicos('selectTopico', selectSeg.value);
        }
    } else {
        const selectTop = document.getElementById('selectTopico');
        document.getElementById('addTopicoNovo').style.display = (selectTop.value === 'novo') ? 'block' : 'none';
    }
}

function ajustarInputsEdicao(nivel) {
    if (nivel === 'segmento') {
        const selectSeg = document.getElementById('editSelectSegmento');
        const inputNovoSeg = document.getElementById('editSegmentoNovo');
        if (selectSeg.value === 'novo') {
            inputNovoSeg.style.display = 'block';
            const selectTop = document.getElementById('editSelectTopico');
            selectTop.innerHTML = '<option value="novo">+ Mudar nome do Tópico</option>';
            selectTop.value = 'novo';
            ajustarInputsEdicao('topico');
        } else {
            inputNovoSeg.style.display = 'none';
            preencherDropdownTopicos('editSelectTopico', selectSeg.value);
        }
    } else {
        const selectTop = document.getElementById('editSelectTopico');
        document.getElementById('editTopicoNovo').style.display = (selectTop.value === 'novo') ? 'block' : 'none';
    }
}

// save, edit e delete

async function salvarNoBanco() {
    if (!usuarioLogado) return;

    const segSel = document.getElementById('selectSegmento').value;
    const segNovo = document.getElementById('addSegmentoNovo').value;
    const topSel = document.getElementById('selectTopico').value;
    const topNovo = document.getElementById('addTopicoNovo').value;

    const finalSegmento = segSel === 'novo' ? segNovo : segSel;
    const finalTopico = topSel === 'novo' ? topNovo : topSel;
    const finalSubtopico = document.getElementById('addSubtopico').value;
    const finalTexto = document.getElementById('addTexto').value;

    if (!finalSegmento || !finalTopico || !finalTexto) {
        alert("Por favor, preencha Segmento, Tópico e Texto.");
        return;
    }

    const { error } = await _supabase.from('wiki_conteudos').insert([{
        segmento: finalSegmento,
        topico: finalTopico,
        subtopico: finalSubtopico,
        texto: finalTexto
    }]);

    if (!error) {
        alert("Salvo com sucesso!");
        location.reload();
    } else {
        alert("Erro ao salvar: " + error.message);
    }
}

function prepararEdicao(id, segmentoAtual, topicoAtual, subtopico, texto) {
    document.getElementById('editId').value = id;
    preencherDropdownSegmentos('editSelectSegmento');
    document.getElementById('editSelectSegmento').value = segmentoAtual;
    preencherDropdownTopicos('editSelectTopico', segmentoAtual);
    document.getElementById('editSelectTopico').value = topicoAtual;
    document.getElementById('editSubtopico').value = subtopico || '';
    document.getElementById('editTexto').value = texto;
    document.getElementById('editSegmentoNovo').style.display = 'none';
    document.getElementById('editTopicoNovo').style.display = 'none';
    document.getElementById('modalEditar').style.display = 'flex';
}

async function confirmarEdicao() {
    if (!usuarioLogado) return;
    const id = document.getElementById('editId').value;
    const segSel = document.getElementById('editSelectSegmento').value;
    const topSel = document.getElementById('editSelectTopico').value;
    const finalSeg = segSel === 'novo' ? document.getElementById('editSegmentoNovo').value : segSel;
    const finalTop = topSel === 'novo' ? document.getElementById('editTopicoNovo').value : topSel;

    if (!finalSeg || !finalTop) {
        alert("Segmento e Tópico são obrigatórios.");
        return;
    }

    const dadosAtualizados = {
        segmento: finalSeg,
        topico: finalTop,
        subtopico: document.getElementById('editSubtopico').value,
        texto: document.getElementById('editTexto').value
    };

    const { error } = await _supabase.from('wiki_conteudos').update(dadosAtualizados).eq('id', id);

    if (!error) {
        alert("Atualizado com sucesso!");
        location.reload();
    } else {
        alert("Erro ao atualizar: " + error.message);
    }
}

async function excluirDoBanco(id) {
    if (!usuarioLogado) return;
    if (confirm("Tem certeza que deseja apagar esse conteúdo?")) {
        const { error } = await _supabase.from('wiki_conteudos').delete().eq('id', id);
        if (!error) location.reload();
    }
}

// loading e renderização

function formatarLinks(texto) {
    if (!texto) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return texto.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
}

async function carregarDados() {
    const { data, error } = await _supabase.from('wiki_conteudos').select('*').order('segmento', { ascending: true });
    
    if (data) {
        const organizado = { segmentos: [] };
        data.forEach(item => {
            let seg = organizado.segmentos.find(s => s.titulo === item.segmento);
            if (!seg) {
                seg = { id: item.segmento.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-'), titulo: item.segmento, topicos: [] };
                organizado.segmentos.push(seg);
            }
            let top = seg.topicos.find(t => t.titulo === item.topico);
            if (!top) {
                top = { 
                    id_banco: item.id, 
                    id: item.topico.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-'), 
                    titulo: item.topico, 
                    texto: item.subtopico ? '' : item.texto, 
                    subtopicos: [] 
                };
                seg.topicos.push(top);
            }
            if (item.subtopico) {
                top.subtopicos.push({
                    id_banco: item.id, 
                    id: item.subtopico.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-'),
                    titulo: item.subtopico,
                    texto: item.texto
                });
            }
        });
        dadosWiki = organizado;
        carregarSegmentos(); 
    }
}

function carregarSegmentos() {
    const container = document.getElementById('segmentosContainer');
    if (!container) return;
    container.innerHTML = ''; 
    
    dadosWiki.segmentos.forEach(segmento => {
        const segmentoEl = document.createElement('div');
        segmentoEl.className = 'segmento';
        segmentoEl.dataset.id = segmento.id;
        
        const tituloSegmento = document.createElement('h2');
        tituloSegmento.className = 'segmento-titulo';
        tituloSegmento.textContent = segmento.titulo;
        segmentoEl.appendChild(tituloSegmento);
        
        const topicosContainer = document.createElement('div');
        topicosContainer.className = 'topicos-container';
        topicosContainer.style.display = 'none';
        
        segmento.topicos.forEach(topico => {
            const topicoEl = document.createElement('div');
            topicoEl.className = 'topico';
            topicoEl.dataset.id = topico.id;
            
            const tituloTopico = document.createElement('h3');
            tituloTopico.className = 'topico-titulo';
            tituloTopico.innerHTML = `<span>${topico.titulo}</span>`;

            if (usuarioLogado) {
                const bts = criarBotoesAdmin(topico.id_banco, segmento.titulo, topico.titulo, '', topico.texto);
                tituloTopico.appendChild(bts);
            }

            topicoEl.appendChild(tituloTopico);
            
            if (topico.texto) {
                const textoTopico = document.createElement('div');
                textoTopico.className = 'topico-texto';
                textoTopico.innerHTML = formatarLinks(topico.texto).replace(/\n/g, '<br>');
                textoTopico.style.display = 'none';
                topicoEl.appendChild(textoTopico);
            }
            
            if (topico.subtopicos.length > 0) {
                const subContainer = document.createElement('div');
                subContainer.className = 'subtopicos-container';
                subContainer.style.display = 'none';
                
                topico.subtopicos.forEach(sub => {
                    const subEl = document.createElement('div');
                    subEl.className = 'subtopico';
                    subEl.dataset.id = sub.id; // IMPORTANTE: Adicionado ID no subtopico
                    const h4 = document.createElement('h4');
                    h4.className = 'subtopico-titulo';
                    h4.innerHTML = `<span>${sub.titulo}</span>`;

                    if (usuarioLogado) {
                        const btsS = criarBotoesAdmin(sub.id_banco, segmento.titulo, topico.titulo, sub.titulo, sub.texto);
                        h4.appendChild(btsS);
                    }

                    subEl.appendChild(h4);
                    const stxt = document.createElement('div');
                    stxt.className = 'subtopico-texto';
                    stxt.innerHTML = formatarLinks(sub.texto).replace(/\n/g, '<br>');
                    stxt.style.display = 'none';
                    subEl.appendChild(stxt);
                    subContainer.appendChild(subEl);
                });
                topicoEl.appendChild(subContainer);
            }
            topicosContainer.appendChild(topicoEl);
        });
        segmentoEl.appendChild(topicosContainer);
        container.appendChild(segmentoEl);
    });
    configurarCliques(); 
}

function criarBotoesAdmin(id, seg, top, sub, txt) {
    const div = document.createElement('div');
    div.className = 'botoes-admin';
    div.style.display = 'inline-block';
    div.style.marginLeft = '15px';

    const edit = document.createElement('span');
    edit.innerHTML = '✏️';
    edit.className = 'btn-editar';
    edit.onclick = (e) => { 
        e.stopPropagation(); 
        prepararEdicao(id, seg, top, sub, txt); 
    };
    
    const del = document.createElement('span');
    del.innerHTML = '🗑️';
    del.className = 'btn-excluir';
    del.onclick = (e) => { 
        e.stopPropagation(); 
        excluirDoBanco(id); 
    };

    div.appendChild(edit);
    div.appendChild(del);
    return div;
}



// pesquisa
function normalizarTexto(t) { 
    return t ? t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''; 
}

function pesquisar(termo) {
    const t = normalizarTexto(termo);
    const res = [];
    dadosWiki.segmentos.forEach(s => {
        if (normalizarTexto(s.titulo).includes(t)) res.push({ tipo: 'seg', segmentoId: s.id, titulo: s.titulo, caminho: s.titulo });
        
        s.topicos.forEach(top => {
            if (normalizarTexto(top.titulo).includes(t) || normalizarTexto(top.texto).includes(t)) {
                res.push({ tipo: 'top', segmentoId: s.id, topicoId: top.id, titulo: top.titulo, caminho: `${s.titulo} > ${top.titulo}` });
            }
            top.subtopicos.forEach(sub => {
                if (normalizarTexto(sub.titulo).includes(t) || normalizarTexto(sub.texto).includes(t)) {
                    res.push({ tipo: 'sub', segmentoId: s.id, topicoId: top.id, subtopicoId: sub.id, titulo: sub.titulo, caminho: `${s.titulo} > ${top.titulo} > ${sub.titulo}` });
                }
            });
        });
    });
    return res;
}

function mostrarResultados(resultados, termo) {
    const area = document.getElementById('resultadosPesquisa');
    const cont = document.getElementById('segmentosContainer');
    area.innerHTML = '';

    if (resultados.length === 0) {
        area.innerHTML = `<p style="padding:20px">Nenhum resultado para "${termo}"</p>`;
    } else {
        let h = `<h3 style="padding:10px 20px">Resultados (${resultados.length})</h3><ul class="resultados-lista">`;
        resultados.forEach((r) => {
            // Transformamos o objeto em string segura para o onclick
            const rString = JSON.stringify(r).replace(/'/g, "&apos;");
            h += `<li class="resultado-item" onclick='navegarParaResultado(${rString})'>
                    <strong>${r.titulo}</strong><br><small>${r.caminho}</small>
                  </li>`;
        });
        area.innerHTML = h + '</ul>';
    }
    area.style.display = 'block';
    cont.style.display = 'none';
}

function navegarParaResultado(r) {
    limparPesquisa();
    
    // 1. Abrir Segmento
    const segEl = document.querySelector(`.segmento[data-id="${r.segmentoId}"]`);
    if (!segEl) return;
    segEl.classList.add('aberto');
    segEl.querySelector('.topicos-container').style.display = 'block';

    // 2. Abrir Tópico (se existir)
    if (r.topicoId) {
        const topEl = segEl.querySelector(`.topico[data-id="${r.topicoId}"]`);
        if (topEl) {
            topEl.classList.add('aberto');
            const txt = topEl.querySelector('.topico-texto');
            const sub = topEl.querySelector('.subtopicos-container');
            if (txt) txt.style.display = 'block';
            if (sub) sub.style.display = 'block';

            // 3. Abrir Subtópico (se existir)
            if (r.subtopicoId) {
                const subEl = topEl.querySelector(`.subtopico[data-id="${r.subtopicoId}"]`);
                if (subEl) {
                    subEl.classList.add('aberto');
                    subEl.querySelector('.subtopico-texto').style.display = 'block';
                    // Scroll suave para o subtópico
                    setTimeout(() => subEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }
            } else {
                // Scroll suave para o tópico
                setTimeout(() => topEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        }
    } else {
        setTimeout(() => segEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
}

function limparPesquisa() {
    document.getElementById('resultadosPesquisa').style.display = 'none';
    document.getElementById('segmentosContainer').style.display = 'block';
    document.querySelector('.barra-pesquisa').value = '';
}

function alternarTema() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.querySelector('.icone-tema').textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('tema', isDark ? 'escuro' : 'claro');
}

function configurarCliques() {
    document.querySelectorAll('.segmento-titulo').forEach(t => {
        t.onclick = () => {
            const c = t.nextElementSibling;
            t.parentElement.classList.toggle('aberto');
            c.style.display = c.style.display === 'none' ? 'block' : 'none';
        };
    });
    document.querySelectorAll('.topico-titulo').forEach(t => {
        t.onclick = (e) => {
            if(e.target.tagName === 'SPAN' || e.target.classList.contains('topico-titulo')){
               const top = t.closest('.topico');
               top.classList.toggle('aberto');
               const tx = top.querySelector('.topico-texto');
               const sb = top.querySelector('.subtopicos-container');
               if (tx) tx.style.display = tx.style.display === 'none' ? 'block' : 'none';
               if (sb) sb.style.display = sb.style.display === 'none' ? 'block' : 'none';
            }
        };
    });
    document.querySelectorAll('.subtopico-titulo').forEach(t => {
        t.onclick = (e) => {
            if(e.target.tagName === 'SPAN' || e.target.classList.contains('subtopico-titulo')){
                const sub = t.closest('.subtopico');
                sub.classList.toggle('aberto');
                const tx = sub.querySelector('.subtopico-texto');
                if (tx) tx.style.display = tx.style.display === 'none' ? 'block' : 'none';
            }
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    if (localStorage.getItem('tema') === 'escuro') {
        document.body.classList.add('dark-mode');
        document.querySelector('.icone-tema').textContent = '🌙';
    }
    document.getElementById('botaoTema').onclick = alternarTema;
    
    const barra = document.querySelector('.barra-pesquisa');
    barra.oninput = () => {
        const termo = barra.value.trim();
        if (!termo) { limparPesquisa(); return; }
        mostrarResultados(pesquisar(termo), termo);
    };
});