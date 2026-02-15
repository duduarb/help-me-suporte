// ADICIONAR CONTEÚDOS DO SITE
const dadosWiki = {
    segmentos: [
        {
            id: 'redes',
            titulo: 'Redes',
            topicos: [
                {
                    id: 'switch',
                    titulo: 'Switches',
                    texto: 'Os switches Intelbras sao equipamentos de rede que permitem a conexao de varios dispositivos em uma rede local (LAN). Eles operam na camada 2 do modelo OSI e utilizam enderecos MAC para encaminhar os dados apenas para a porta de destino correta.',
                    subtopicos: [
                        {
                            id: 'switch-nao-gerenciavel',
                            titulo: 'Switches Nao Gerenciaveis',
                            texto: 'Modelos plug-and-play que nao permitem configuracoes avancadas. Ideais para residencias e pequenas empresas. Exemplos: Switch 5 Portas, Switch 8 Portas.'
                        },
                        {
                            id: 'switch-gerenciavel',
                            titulo: 'Switches Gerenciaveis',
                            texto: 'Permitem configuracoes avancadas como VLANs, QoS, SNMP e agregacao de links. Indicados para empresas que precisam de maior controle da rede. Exemplos: Switch 24 Portas Gerenciavel, Switch 48 Portas com PoE.'
                        }
                    ]
                },
                {
                    id: 'roteador',
                    titulo: 'Roteadores',
                    texto: 'Os roteadores Intelbras conectam diferentes redes e permitem o compartilhamento de internet. Possuem funcoes como NAT, DHCP, firewall e, em alguns modelos, Wi-Fi.',
                    subtopicos: [
                        {
                            id: 'roteador-wireless',
                            titulo: 'Roteadores Wireless',
                            texto: 'Modelos com Wi-Fi integrado para conexao sem fio. Disponiveis nas frequencias 2.4GHz e 5GHz (dual band).'
                        },
                        {
                            id: 'roteador-empresarial',
                            titulo: 'Roteadores Empresariais',
                            texto: 'Equipamentos com maior capacidade de processamento e recursos avancados de seguranca, ideais para ambientes corporativos.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'fechaduras',
            titulo: 'Fechaduras',
            topicos: [
                {
                    id: 'fechadura-biometrica',
                    titulo: 'Fechaduras Biometricas',
                    texto: 'Fechaduras que utilizam a digital do usuario para liberar o acesso. Podem armazenar multiplas digitais e oferecem diferentes niveis de permissao.',
                    subtopicos: [
                        {
                            id: 'cadastro-digital',
                            titulo: 'Cadastro de Digitais',
                            texto: 'Processo para adicionar novas digitais: 1. Acesse o modo de programacao 2. Selecione "Cadastrar Usuario" 3. Escolha a posicao 4. Leia a digital 3 vezes 5. Confirme.'
                        },
                        {
                            id: 'exclusao-digital',
                            titulo: 'Exclusao de Digitais',
                            texto: 'Para remover digitais: 1. Modo programacao 2. Selecione "Excluir Usuario" 3. Escolha a posicao a remover ou selecione "Excluir Todos" para reset completo.'
                        }
                    ]
                },
                {
                    id: 'fechadura-eletronica',
                    titulo: 'Fechaduras Eletronicas',
                    texto: 'Modelos que utilizam senha, cartao de proximidade ou controle remoto para acesso. Ideais para ambientes comerciais e residenciais.',
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
                segmento: segmento.titulo,
                topico: null,
                subtopico: null,
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
                    segmento: segmento.titulo,
                    topico: topico.titulo,
                    subtopico: null,
                    titulo: topico.titulo,
                    texto: topico.texto || '',
                    caminho: `${segmento.titulo} > ${topico.titulo}`
                });
            }
            
            // pesquisa no texto do topico
            if (topico.texto && normalizarTexto(topico.texto).includes(termoNormalizado)) {
                resultados.push({
                    tipo: 'topico-texto',
                    segmento: segmento.titulo,
                    topico: topico.titulo,
                    subtopico: null,
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
                        segmento: segmento.titulo,
                        topico: topico.titulo,
                        subtopico: subtopico.titulo,
                        titulo: subtopico.titulo,
                        texto: subtopico.texto || '',
                        caminho: `${segmento.titulo} > ${topico.titulo} > ${subtopico.titulo}`
                    });
                }
                
                // pesquisa no texto do subtopico
                if (subtopico.texto && normalizarTexto(subtopico.texto).includes(termoNormalizado)) {
                    resultados.push({
                        tipo: 'subtopico-texto',
                        segmento: segmento.titulo,
                        topico: topico.titulo,
                        subtopico: subtopico.titulo,
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
    
    resultados.forEach(result => {
        html += `
            <li class="resultado-item" data-caminho="${result.caminho}">
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
            const caminho = this.dataset.caminho;
            navegarParaResultado(caminho);
        });
    });
}

// FUNÇÃO PARA NAVEGAR ATÉ O RESULTADO CLICADO
function navegarParaResultado(caminho) {
    const areaResultados = document.getElementById('resultadosPesquisa');
    const segmentosContainer = document.getElementById('segmentosContainer');
    
    // esconde resultados e mostra segmentos
    areaResultados.style.display = 'none';
    segmentosContainer.style.display = 'block';
    
    // limpa a barra de pesquisa
    const barraPesquisa = document.querySelector('.barra-pesquisa');
    barraPesquisa.value = '';
    
    // aqui poderia expandir automaticamente o item encontrado
    // por enquanto so volta pra visualizacao normal
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
                    textoSubtopico.textContent = subtopico.texto;
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