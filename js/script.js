// ADICIONAR CONTEÚDOS DO SITE
// Configuração do Supabase
const SUPABASE_URL = 'https://mrzhseelzlfrdhdrmtcy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dErYTyFdVx6V5v4f-1DhGw_r08SIYey';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dadosWiki = { segmentos: [] };

// FUNÇÃO AUXILIAR PARA VALIDAR SENHA NA VERCEL (A MÁGICA DA SEGURANÇA)
async function validarSenhaVercel(senhaDigitada) {
    try {
        const resposta = await fetch('/api/validar-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senhaDigitada })
        });
        const resultado = await resposta.json();
        return resultado.autorizado;
    } catch (error) {
        console.error("Erro ao validar senha:", error);
        return false;
    }
}

// NOVIDADE: FUNÇÃO PARA IDENTIFICAR LINKS E TORNAR CLICÁVEIS
function formatarLinks(texto) {
    if (!texto) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return texto.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" style="color: #00a859; text-decoration: underline; font-weight: bold;">${url}</a>`;
    });
}

// FUNÇÃO PARA BUSCAR DO BANCO
async function carregarDados() {
    const { data, error } = await _supabase.from('wiki_conteudos').select('*');
    
    if (data) {
        const organizado = { segmentos: [] };
        
        data.forEach(item => {
            let seg = organizado.segmentos.find(s => s.titulo === item.segmento);
            if (!seg) {
                seg = { id: item.segmento.toLowerCase(), titulo: item.segmento, topicos: [] };
                organizado.segmentos.push(seg);
            }
            
            let top = seg.topicos.find(t => t.titulo === item.topico);
            if (!top) {
                top = { 
                    id_banco: item.id, 
                    id: item.topico.toLowerCase().replace(/ /g, '-'), 
                    titulo: item.topico, 
                    texto: item.subtopico ? '' : item.texto, 
                    subtopicos: [] 
                };
                seg.topicos.push(top);
            }
            
            if (item.subtopico) {
                top.subtopicos.push({
                    id_banco: item.id, 
                    id: item.subtopico.toLowerCase().replace(/ /g, '-'),
                    titulo: item.subtopico,
                    texto: item.texto
                });
            }
        });
        
        dadosWiki = organizado;
        carregarSegmentos(); 
        configurarCliques(); 
    }
}

// FUNÇÃO PARA SALVAR NO BANCO (ATUALIZADA COM SEGURANÇA)
async function salvarNoBanco() {
    const senha = document.getElementById('chaveMestra').value;
    
    // Chama a API da Vercel em vez de conferir aqui
    const autorizado = await validarSenhaVercel(senha);
    
    if (!autorizado) {
        return alert("Senha incorreta! Você não tem permissão para salvar.");
    }

    const novoItem = {
        segmento: document.getElementById('addSegmento').value,
        topico: document.getElementById('addTopico').value,
        subtopico: document.getElementById('addSubtopico').value,
        texto: document.getElementById('addTexto').value
    };

    const { error } = await _supabase.from('wiki_conteudos').insert([novoItem]);

    if (!error) {
        alert("Salvo com sucesso!");
        location.reload();
    } else {
        alert("Erro ao salvar: " + error.message);
    }
}

// FUNÇÃO PARA EXCLUIR DADOS (ATUALIZADA COM SEGURANÇA)
async function excluirDoBanco(id) {
    const senha = prompt("Digite a senha mestra para confirmar a exclusão:");
    
    if (!senha) return;

    // Chama a API da Vercel em vez de conferir aqui
    const autorizado = await validarSenhaVercel(senha);

    if (!autorizado) {
        alert("Senha incorreta! Operação cancelada.");
        return;
    }

    if (confirm("Tem certeza que deseja apagar esse conteúdo permanentemente?")) {
        const { error } = await _supabase
            .from('wiki_conteudos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao excluir.");
        } else {
            alert("Conteúdo removido com sucesso!");
            location.reload();
        }
    }
}

// FUNÇÃO PARA REMOVER ACENTOS
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// FUNÇÃO DE PESQUISA
function pesquisar(termo) {
    if (!termo || termo.trim() === '') return [];
    
    const termoNormalizado = normalizarTexto(termo);
    const resultados = [];
    
    dadosWiki.segmentos.forEach(segmento => {
        if (normalizarTexto(segmento.titulo).includes(termoNormalizado)) {
            resultados.push({ tipo: 'segmento', segmentoId: segmento.id, titulo: segmento.titulo, texto: segmento.titulo, caminho: segmento.titulo });
        }
        
        segmento.topicos.forEach(topico => {
            if (normalizarTexto(topico.titulo).includes(termoNormalizado)) {
                resultados.push({ tipo: 'topico', segmentoId: segmento.id, topicoId: topico.id, titulo: topico.titulo, texto: topico.texto || '', caminho: `${segmento.titulo} > ${topico.titulo}` });
            }
            if (topico.texto && normalizarTexto(topico.texto).includes(termoNormalizado)) {
                resultados.push({ tipo: 'topico-texto', segmentoId: segmento.id, topicoId: topico.id, titulo: `Texto: ${topico.titulo}`, texto: topico.texto, caminho: `${segmento.titulo} > ${topico.titulo} (texto)` });
            }
            topico.subtopicos.forEach(subtopico => {
                if (normalizarTexto(subtopico.titulo).includes(termoNormalizado)) {
                    resultados.push({ tipo: 'subtopico', segmentoId: segmento.id, topicoId: topico.id, subtopicoId: subtopico.id, titulo: subtopico.titulo, texto: subtopico.texto || '', caminho: `${segmento.titulo} > ${topico.titulo} > ${subtopico.titulo}` });
                }
                if (subtopico.texto && normalizarTexto(subtopico.texto).includes(termoNormalizado)) {
                    resultados.push({ tipo: 'subtopico-texto', segmentoId: segmento.id, topicoId: topico.id, subtopicoId: subtopico.id, titulo: `Texto: ${subtopico.titulo}`, texto: subtopico.texto, caminho: `${segmento.titulo} > ${topico.titulo} > ${subtopico.titulo} (texto)` });
                }
            });
        });
    });
    return resultados;
}

function mostrarResultados(resultados, termo) {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    if (!areaResultados) return;
    
    if (resultados.length === 0) {
        areaResultados.style.display = 'block';
        areaResultados.innerHTML = `<p>Nenhum resultado encontrado para "${termo}"</p>`;
        return;
    }
    
    let html = `<h3>Resultados para "${termo}" (${resultados.length})</h3><ul class="resultados-lista">`;
    resultados.forEach((result, index) => {
        html += `<li class="resultado-item" data-index="${index}"><strong>${result.titulo}</strong><br><small>${result.caminho}</small><br><span class="resultado-preview">${result.texto.substring(0, 100)}...</span></li>`;
    });
    html += '</ul>';
    areaResultados.innerHTML = html;
    areaResultados.style.display = 'block';
    segmentosContainer.style.display = 'none';
    
    document.querySelectorAll('.resultado-item').forEach(item => {
        item.addEventListener('click', function() {
            navegarParaResultado(resultados[this.dataset.index]);
        });
    });
}

function navegarParaResultado(resultado) {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    segmentosContainer.style.display = 'block';
    
    const segmentoEl = document.querySelector(`.segmento[data-id="${resultado.segmentoId}"]`);
    if (!segmentoEl) return;
    
    const topicosContainer = segmentoEl.querySelector('.topicos-container');
    segmentoEl.classList.add('aberto');
    topicosContainer.style.display = 'block';
    
    if (resultado.topicoId) {
        const topicoEl = segmentoEl.querySelector(`.topico[data-id="${resultado.topicoId}"]`);
        if (topicoEl) {
            topicoEl.classList.add('aberto');
            const txt = topicoEl.querySelector('.topico-texto');
            const sub = topicoEl.querySelector('.subtopicos-container');
            if (txt) txt.style.display = 'block';
            if (sub) sub.style.display = 'block';
            
            if (resultado.subtopicoId) {
                const subEl = topicoEl.querySelector(`.subtopico[data-id="${resultado.subtopicoId}"]`);
                if (subEl) {
                    subEl.classList.add('aberto');
                    const txtSub = subEl.querySelector('.subtopico-texto');
                    if (txtSub) txtSub.style.display = 'block';
                    subEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                topicoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    areaResultados.style.display = 'none';
    document.querySelector('.barra-pesquisa').value = '';
}

function limparPesquisa() {
    document.getElementById('resultadosPesquisa').style.display = 'none';
    document.getElementById('segmentosContainer').style.display = 'block';
}

function alternarTema() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.querySelector('.icone-tema').textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('tema', isDark ? 'escuro' : 'claro');
}

function carregarTemaSalvo() {
    const tema = localStorage.getItem('tema');
    if (tema === 'escuro') {
        document.body.classList.add('dark-mode');
        document.querySelector('.icone-tema').textContent = '🌙';
    }
}

// FUNÇÃO PARA CARREGAR OS SEGMENTOS 
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
            
            const spanTitulo = document.createElement('span');
            spanTitulo.textContent = topico.titulo;
            tituloTopico.appendChild(spanTitulo);

            const btnExcluir = document.createElement('span');
            btnExcluir.innerHTML = '🗑️';
            btnExcluir.className = 'btn-excluir'; 
            btnExcluir.onclick = (e) => { e.stopPropagation(); excluirDoBanco(topico.id_banco); };
            tituloTopico.appendChild(btnExcluir);

            topicoEl.appendChild(tituloTopico);
            
            if (topico.texto) {
                const textoTopico = document.createElement('div');
                textoTopico.className = 'topico-texto';
                textoTopico.innerHTML = formatarLinks(topico.texto).replace(/\n/g, '<br>');
                textoTopico.style.display = 'none';
                topicoEl.appendChild(textoTopico);
            }
            
            if (topico.subtopicos && topico.subtopicos.length > 0) {
                const subtopicosContainer = document.createElement('div');
                subtopicosContainer.className = 'subtopicos-container';
                subtopicosContainer.style.display = 'none';
                
                topico.subtopicos.forEach(subtopico => {
                    const subtopicoEl = document.createElement('div');
                    subtopicoEl.className = 'subtopico';
                    subtopicoEl.dataset.id = subtopico.id;
                    
                    const tituloSubtopico = document.createElement('h4');
                    tituloSubtopico.className = 'subtopico-titulo';
                    
                    const spanSub = document.createElement('span');
                    spanSub.textContent = subtopico.titulo;
                    tituloSubtopico.appendChild(spanSub);

                    const btnExcluirSub = document.createElement('span');
                    btnExcluirSub.innerHTML = '🗑️';
                    btnExcluirSub.className = 'btn-excluir';
                    btnExcluirSub.onclick = (e) => { e.stopPropagation(); excluirDoBanco(subtopico.id_banco); };
                    tituloSubtopico.appendChild(btnExcluirSub);

                    subtopicoEl.appendChild(tituloSubtopico);
                    
                    const textoSubtopico = document.createElement('div');
                    textoSubtopico.className = 'subtopico-texto';
                    textoSubtopico.innerHTML = formatarLinks(subtopico.texto).replace(/\n/g, '<br>');
                    textoSubtopico.style.display = 'none';
                    subtopicoEl.appendChild(textoSubtopico);
                    subtopicosContainer.appendChild(subtopicoEl);
                });
                topicoEl.appendChild(subtopicosContainer);
            }
            topicosContainer.appendChild(topicoEl);
        });
        segmentoEl.appendChild(topicosContainer);
        container.appendChild(segmentoEl);
    });
}

function configurarCliques() {
    document.querySelectorAll('.segmento-titulo').forEach(titulo => {
        titulo.onclick = function() {
            const container = this.nextElementSibling;
            this.parentElement.classList.toggle('aberto');
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        };
    });
    
    document.querySelectorAll('.topico-titulo').forEach(titulo => {
        titulo.onclick = function() {
            const topico = this.closest('.topico');
            topico.classList.toggle('aberto');
            const txt = topico.querySelector('.topico-texto');
            const sub = topico.querySelector('.subtopicos-container');
            if (txt) txt.style.display = txt.style.display === 'none' ? 'block' : 'none';
            if (sub) sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
        };
    });

    document.querySelectorAll('.subtopico-titulo').forEach(titulo => {
        titulo.onclick = function() {
            const subtopico = this.closest('.subtopico');
            subtopico.classList.toggle('aberto');
            const txt = subtopico.querySelector('.subtopico-texto');
            if (txt) txt.style.display = txt.style.display === 'none' ? 'block' : 'none';
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    carregarTemaSalvo();
    document.getElementById('botaoTema')?.addEventListener('click', alternarTema);
    
    const barra = document.querySelector('.barra-pesquisa');
    if (barra) {
        let timeout;
        barra.addEventListener('input', function() {
            clearTimeout(timeout);
            const termo = this.value.trim();
            if (termo === '') { limparPesquisa(); return; }
            timeout = setTimeout(() => { mostrarResultados(pesquisar(termo), termo); }, 300);
        });
        barra.addEventListener('keydown', (e) => { if (e.key === 'Escape') { barra.value = ''; limparPesquisa(); } });
    }
});