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

// FUNÇÕES DO TEMA CLARO/ESCURO
function alternarTema() {
    const body = document.body;
    const iconeTema = document.querySelector('.icone-tema');
    
    // alterna a classe dark-mode
    body.classList.toggle('dark-mode');
    
    // troca o icone (sol ☀️ ou lua 🌙)
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
        // se nao tiver tema salvo, verifica a preferencia do sistema
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
            
            // alterna a classe "aberto" no segmento
            segmento.classList.toggle('aberto');
            
            // mostra ou esconde o container de topicos
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
            
            // alterna a classe "aberto" no topico
            topico.classList.toggle('aberto');
            
            // mostra ou esconde o texto do topico (se tiver)
            const textoTopico = topico.querySelector('.topico-texto');
            if (textoTopico) {
                if (textoTopico.style.display === 'none') {
                    textoTopico.style.display = 'block';
                } else {
                    textoTopico.style.display = 'none';
                }
            }
            
            // mostra ou esconde os subtopicos (se tiver)
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
            
            // alterna a classe "aberto" no subtopico
            subtopico.classList.toggle('aberto');
            
            // mostra ou esconde o texto do subtopico
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
});