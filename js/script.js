// ADICIONAR CONTEÚDOS DO SITE
const dadosWiki = {
    segmentos: [
        {
            id: 'redes',
            titulo: 'Redes',
            topicos: [
                {
                    id: 'em-breve-redes',
                    titulo: 'Em breve',
                    texto: 'Conteúdo de redes será adicionado em breve.',
                    subtopicos: []
                }
            ]
        },
        {
            id: 'fechaduras',
            titulo: 'Fechaduras',
            topicos: [
                {
                    id: 'configuracoes',
                    titulo: 'Configurações',
                    texto: '',
                    subtopicos: [
                        {
                            id: 'reset-fechadura',
                            titulo: 'Reset da Fechadura',
                            texto: '1. Segure o botão de cadastro continuamente\n2. Aguarde até ouvir os bips e o teclado apagar\n3. Solte o botão APENAS quando o teclado acender novamente\n4. Digite o código: 123578951\n5. Pressione e segure a tecla de engrenagem (⚙️) ou # (conforme o modelo)\n6. Mantenha pressionado até o teclado apagar completamente\n7. Quando apagar, teste abrir com a senha: 1234'
                        }
                    ]
                },
                {
                    id: 'nao-perturbe',
                    titulo: 'Não Perturbe',
                    texto: '',
                    subtopicos: []
                },
                {
                    id: 'menu-simples',
                    titulo: 'Menu Simples',
                    texto: '',
                    subtopicos: []
                },
                {
                    id: 'erros',
                    titulo: 'Erros',
                    texto: '',
                    subtopicos: []
                },
                {
                    id: 'instalacao',
                    titulo: 'Instalação',
                    texto: '',
                    subtopicos: []
                }
            ]
        }
    ]
};

// FUNÇÃO PARA REMOVER ACENTOS E DEIXAR TUDO MINUSCULO
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// FUNÇÃO DE PESQUISA
function pesquisar(termo) {
    if (!termo || termo.trim() === '') {
        return [];
    }
    
    const termoNormalizado = normalizarTexto(termo);
    const resultados = [];
    
    dadosWiki.segmentos.forEach(segmento => {
        // pesquisa no titulo do segmento
        if (normalizarTexto(segmento.titulo).includes(termoNormalizado)) {
            resultados.push({
                tipo: 'segmento',
                segmentoId: segmento.id,
                topicoId: null,
                subtopicoId: null,
                titulo: segmento.titulo,
                texto: segmento.titulo,
                caminho: segmento.titulo
            });
        }
        
        segmento.topicos.forEach(topico => {
            // pesquisa no titulo do topico
            if (normalizarTexto(topico.titulo).includes(termoNormalizado)) {
                resultados.push({
                    tipo: 'topico',
                    segmentoId: segmento.id,
                    topicoId: topico.id,
                    subtopicoId: null,
                    titulo: topico.titulo,
                    texto: topico.texto || '',
                    caminho: `${segmento.titulo} > ${topico.titulo}`
                });
            }
            
            // pesquisa no texto do topico
            if (topico.texto && normalizarTexto(topico.texto).includes(termoNormalizado)) {
                resultados.push({
                    tipo: 'topico-texto',
                    segmentoId: segmento.id,
                    topicoId: topico.id,
                    subtopicoId: null,
                    titulo: `Texto: ${topico.titulo}`,
                    texto: topico.texto,
                    caminho: `${segmento.titulo} > ${topico.titulo} (texto)`
                });
            }
            
            topico.subtopicos.forEach(subtopico => {
                // pesquisa no titulo do subtopico
                if (normalizarTexto(subtopico.titulo).includes(termoNormalizado)) {
                    resultados.push({
                        tipo: 'subtopico',
                        segmentoId: segmento.id,
                        topicoId: topico.id,
                        subtopicoId: subtopico.id,
                        titulo: subtopico.titulo,
                        texto: subtopico.texto || '',
                        caminho: `${segmento.titulo} > ${topico.titulo} > ${subtopico.titulo}`
                    });
                }
                
                // pesquisa no texto do subtopico
                if (subtopico.texto && normalizarTexto(subtopico.texto).includes(termoNormalizado)) {
                    resultados.push({
                        tipo: 'subtopico-texto',
                        segmentoId: segmento.id,
                        topicoId: topico.id,
                        subtopicoId: subtopico.id,
                        titulo: `Texto: ${subtopico.titulo}`,
                        texto: subtopico.texto,
                        caminho: `${segmento.titulo} > ${topico.titulo} > ${subtopico.titulo} (texto)`
                    });
                }
            });
        });
    });
    
    return resultados;
}

// FUNÇÃO PARA MOSTRAR RESULTADOS
function mostrarResultados(resultados, termo) {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    
    if (!areaResultados) return;
    
    if (resultados.length === 0) {
        areaResultados.style.display = 'block';
        areaResultados.innerHTML = `<p>Nenhum resultado encontrado para "${termo}"</p>`;
        return;
    }
    
    let html = `<h3>Resultados para "${termo}" (${resultados.length})</h3>`;
    html += '<ul class="resultados-lista">';
    
    resultados.forEach((result, index) => {
        html += `
            <li class="resultado-item" data-index="${index}">
                <strong>${result.titulo}</strong><br>
                <small>${result.caminho}</small><br>
                <span class="resultado-preview">${result.texto.substring(0, 100)}${result.texto.length > 100 ? '...' : ''}</span>
            </li>
        `;
    });
    
    html += '</ul>';
    areaResultados.innerHTML = html;
    areaResultados.style.display = 'block';
    
    // esconde os segmentos enquanto mostra resultados
    segmentosContainer.style.display = 'none';
    
    // adiciona evento de clique nos resultados
    document.querySelectorAll('.resultado-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = this.dataset.index;
            navegarParaResultado(resultados[index]);
        });
    });
}

// FUNÇÃO PARA NAVEGAR ATÉ O RESULTADO CLICADO
function navegarParaResultado(resultado) {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    
    // mostra os segmentos
    segmentosContainer.style.display = 'block';
    
    // encontra o segmento
    const segmentoEl = document.querySelector(`.segmento[data-id="${resultado.segmentoId}"]`);
    if (!segmentoEl) return;
    
    // abre o segmento
    const topicosContainer = segmentoEl.querySelector('.topicos-container');
    if (topicosContainer.style.display === 'none') {
        segmentoEl.classList.add('aberto');
        topicosContainer.style.display = 'block';
    }
    
    // se for topico ou subtopico, abre o topico
    if (resultado.topicoId) {
        const topicoEl = segmentoEl.querySelector(`.topico[data-id="${resultado.topicoId}"]`);
        if (topicoEl) {
            const textoTopico = topicoEl.querySelector('.topico-texto');
            const subtopicosContainer = topicoEl.querySelector('.subtopicos-container');
            
            topicoEl.classList.add('aberto');
            
            if (textoTopico) textoTopico.style.display = 'block';
            if (subtopicosContainer) subtopicosContainer.style.display = 'block';
            
            // se for subtopico, abre o subtopico
            if (resultado.subtopicoId) {
                const subtopicoEl = topicoEl.querySelector(`.subtopico[data-id="${resultado.subtopicoId}"]`);
                if (subtopicoEl) {
                    const textoSubtopico = subtopicoEl.querySelector('.subtopico-texto');
                    subtopicoEl.classList.add('aberto');
                    if (textoSubtopico) textoSubtopico.style.display = 'block';
                    
                    // rola ate o subtopico
                    setTimeout(() => {
                        subtopicoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // destaca o item
                        subtopicoEl.style.transition = 'background-color 0.5s';
                        subtopicoEl.style.backgroundColor = 'rgba(0, 168, 89, 0.2)';
                        setTimeout(() => {
                            subtopicoEl.style.backgroundColor = '';
                        }, 1500);
                    }, 100);
                }
            } else {
                // rola ate o topico
                setTimeout(() => {
                    topicoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // destaca o item
                    topicoEl.style.transition = 'background-color 0.5s';
                    topicoEl.style.backgroundColor = 'rgba(0, 168, 89, 0.2)';
                    setTimeout(() => {
                        topicoEl.style.backgroundColor = '';
                    }, 1500);
                }, 100);
            }
        }
    } else {
        // rola ate o segmento
        setTimeout(() => {
            segmentoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // destaca o item
            segmentoEl.style.transition = 'box-shadow 0.5s';
            segmentoEl.style.boxShadow = '0 0 0 3px var(--verde-intelbras)';
            setTimeout(() => {
                segmentoEl.style.boxShadow = '';
            }, 1500);
        }, 100);
    }
    
    // esconde resultados e limpa pesquisa
    areaResultados.style.display = 'none';
    const barraPesquisa = document.querySelector('.barra-pesquisa');
    barraPesquisa.value = '';
}

// FUNÇÃO PARA LIMPAR PESQUISA
function limparPesquisa() {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    
    areaResultados.style.display = 'none';
    segmentosContainer.style.display = 'block';
}

// FUNÇÕES DO TEMA CLARO/ESCURO
function alternarTema() {
    const body = document.body;
    const iconeTema = document.querySelector('.icone-tema');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        iconeTema.textContent = '🌙';
        localStorage.setItem('tema', 'escuro');
    } else {
        iconeTema.textContent = '☀️';
        localStorage.setItem('tema', 'claro');
    }
}

function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema');
    const iconeTema = document.querySelector('.icone-tema');
    const body = document.body;
    
    if (temaSalvo === 'escuro') {
        body.classList.add('dark-mode');
        iconeTema.textContent = '🌙';
    } else if (temaSalvo === 'claro') {
        body.classList.remove('dark-mode');
        iconeTema.textContent = '☀️';
    } else {
        const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefereEscuro) {
            body.classList.add('dark-mode');
            iconeTema.textContent = '🌙';
        } else {
            body.classList.remove('dark-mode');
            iconeTema.textContent = '☀️';
        }
    }
}

// FUNÇÃO PARA CARREGAR OS SEGMENTOS
function carregarSegmentos() {
    const container = document.getElementById('segmentosContainer');
    if (!container) return;
    
    container.innerHTML = ''; 
    
    dadosWiki.segmentos.forEach(segmento => {
        // cria o card do segmento
        const segmentoEl = document.createElement('div');
        segmentoEl.className = 'segmento';
        segmentoEl.dataset.id = segmento.id;
        
        // titulo do segmento 
        const tituloSegmento = document.createElement('h2');
        tituloSegmento.className = 'segmento-titulo';
        tituloSegmento.textContent = segmento.titulo;
        segmentoEl.appendChild(tituloSegmento);
        
        // container dos topicos (comeca escondido)
        const topicosContainer = document.createElement('div');
        topicosContainer.className = 'topicos-container';
        topicosContainer.style.display = 'none';
        
        // cria cada topico dentro do segmento
        segmento.topicos.forEach(topico => {
            const topicoEl = document.createElement('div');
            topicoEl.className = 'topico';
            topicoEl.dataset.id = topico.id;
            
            const tituloTopico = document.createElement('h3');
            tituloTopico.className = 'topico-titulo';
            tituloTopico.textContent = topico.titulo;
            topicoEl.appendChild(tituloTopico);
            
            // se o topico tiver texto, coloca ele (escondido)
            if (topico.texto) {
                const textoTopico = document.createElement('div');
                textoTopico.className = 'topico-texto';
                textoTopico.textContent = topico.texto;
                textoTopico.style.display = 'none';
                topicoEl.appendChild(textoTopico);
            }
            
            // se tiver subtopicos, cria eles tambem
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
                    tituloSubtopico.textContent = subtopico.titulo;
                    subtopicoEl.appendChild(tituloSubtopico);
                    
                    const textoSubtopico = document.createElement('div');
                    textoSubtopico.className = 'subtopico-texto';
                    textoSubtopico.innerHTML = subtopico.texto.replace(/\n/g, '<br>');
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

// FUNÇÃO PARA CONFIGURAR OS CLIQUES (ABRIR/FECHAR)
function configurarCliques() {
    // clique nos titulos dos segmentos
    document.querySelectorAll('.segmento-titulo').forEach(titulo => {
        titulo.addEventListener('click', function(e) {
            e.stopPropagation();
            const segmento = this.closest('.segmento');
            const topicosContainer = segmento.querySelector('.topicos-container');
            
            segmento.classList.toggle('aberto');
            
            if (topicosContainer.style.display === 'none') {
                topicosContainer.style.display = 'block';
            } else {
                topicosContainer.style.display = 'none';
            }
        });
    });
    
    // clique nos titulos dos topicos
    document.querySelectorAll('.topico-titulo').forEach(titulo => {
        titulo.addEventListener('click', function(e) {
            e.stopPropagation();
            const topico = this.closest('.topico');
            
            topico.classList.toggle('aberto');
            
            const textoTopico = topico.querySelector('.topico-texto');
            if (textoTopico) {
                if (textoTopico.style.display === 'none') {
                    textoTopico.style.display = 'block';
                } else {
                    textoTopico.style.display = 'none';
                }
            }
            
            const subtopicosContainer = topico.querySelector('.subtopicos-container');
            if (subtopicosContainer) {
                if (subtopicosContainer.style.display === 'none') {
                    subtopicosContainer.style.display = 'block';
                } else {
                    subtopicosContainer.style.display = 'none';
                }
            }
        });
    });
    
    // clique nos titulos dos subtopicos
    document.querySelectorAll('.subtopico-titulo').forEach(titulo => {
        titulo.addEventListener('click', function(e) {
            e.stopPropagation();
            const subtopico = this.closest('.subtopico');
            
            subtopico.classList.toggle('aberto');
            
            const textoSubtopico = subtopico.querySelector('.subtopico-texto');
            if (textoSubtopico) {
                if (textoSubtopico.style.display === 'none') {
                    textoSubtopico.style.display = 'block';
                } else {
                    textoSubtopico.style.display = 'none';
                }
            }
        });
    });
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    carregarSegmentos();
    configurarCliques();
    carregarTemaSalvo();
    
    // evento do botao de tema
    const botaoTema = document.getElementById('botaoTema');
    if (botaoTema) {
        botaoTema.addEventListener('click', alternarTema);
    }
    
    // evento da barra de pesquisa
    const barraPesquisa = document.querySelector('.barra-pesquisa');
    if (barraPesquisa) {
        let timeoutId;
        
        barraPesquisa.addEventListener('input', function() {
            clearTimeout(timeoutId);
            
            const termo = this.value.trim();
            
            if (termo === '') {
                limparPesquisa();
                return;
            }
            
            // delay pra nao pesquisar a cada letra (melhor performance)
            timeoutId = setTimeout(() => {
                const resultados = pesquisar(termo);
                mostrarResultados(resultados, termo);
            }, 300);
        });
        
        // limpar pesquisa com ESC
        barraPesquisa.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                limparPesquisa();
            }
        });
    }
});