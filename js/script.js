// dados dos segmentos (estrutura escalavel)
const dadosWiki = {
    segmentos: [
        {
            id: 'redes',
            titulo: 'Redes',
            topicos: [
                {
                    id: 'switch',
                    titulo: 'Switches',
                    texto: 'Os switches Intelbras são equipamentos de rede que permitem a conexão de vários dispositivos em uma rede local (LAN). Eles operam na camada 2 do modelo OSI e utilizam endereços MAC para encaminhar os dados apenas para a porta de destino correta.',
                    subtopicos: [
                        {
                            id: 'switch-nao-gerenciavel',
                            titulo: 'Switches Não Gerenciáveis',
                            texto: 'Modelos plug-and-play que não permitem configurações avançadas. Ideais para residências e pequenas empresas. Exemplos: Switch 5 Portas, Switch 8 Portas.'
                        },
                        {
                            id: 'switch-gerenciavel',
                            titulo: 'Switches Gerenciáveis',
                            texto: 'Permitem configurações avançadas como VLANs, QoS, SNMP e agregação de links. Indicados para empresas que precisam de maior controle da rede. Exemplos: Switch 24 Portas Gerenciável, Switch 48 Portas com PoE.'
                        }
                    ]
                },
                {
                    id: 'roteador',
                    titulo: 'Roteadores',
                    texto: 'Os roteadores Intelbras conectam diferentes redes e permitem o compartilhamento de internet. Possuem funções como NAT, DHCP, firewall e, em alguns modelos, Wi-Fi.',
                    subtopicos: [
                        {
                            id: 'roteador-wireless',
                            titulo: 'Roteadores Wireless',
                            texto: 'Modelos com Wi-Fi integrado para conexão sem fio. Disponíveis nas frequências 2.4GHz e 5GHz (dual band).'
                        },
                        {
                            id: 'roteador-empresarial',
                            titulo: 'Roteadores Empresariais',
                            texto: 'Equipamentos com maior capacidade de processamento e recursos avançados de segurança, ideais para ambientes corporativos.'
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
                    titulo: 'Fechaduras Biométricas',
                    texto: 'Fechaduras que utilizam a digital do usuário para liberar o acesso. Podem armazenar múltiplas digitais e oferecem diferentes níveis de permissão.',
                    subtopicos: [
                        {
                            id: 'cadastro-digital',
                            titulo: 'Cadastro de Digitais',
                            texto: 'Processo para adicionar novas digitais: 1. Acesse o modo de programação 2. Selecione "Cadastrar Usuário" 3. Escolha a posição 4. Leia a digital 3 vezes 5. Confirme.'
                        },
                        {
                            id: 'exclusao-digital',
                            titulo: 'Exclusão de Digitais',
                            texto: 'Para remover digitais: 1. Modo programação 2. Selecione "Excluir Usuário" 3. Escolha a posição a remover ou selecione "Excluir Todos" para reset completo.'
                        }
                    ]
                },
                {
                    id: 'fechadura-eletronica',
                    titulo: 'Fechaduras Eletrônicas',
                    texto: 'Modelos que utilizam senha, cartão de proximidade ou controle remoto para acesso. Ideais para ambientes comerciais e residenciais.',
                    subtopicos: []
                }
            ]
        }
    ]
};

// funcao para carregar os segmentos na pagina
function carregarSegmentos() {
    const container = document.getElementById('segmentosContainer');
    if (!container) return;
    
    container.innerHTML = ''; // limpa o container
    
    dadosWiki.segmentos.forEach(segmento => {
        // cria o elemento do segmento
        const segmentoEl = document.createElement('div');
        segmentoEl.className = 'segmento';
        segmentoEl.dataset.id = segmento.id;
        
        // titulo do segmento
        const tituloSegmento = document.createElement('h2');
        tituloSegmento.className = 'segmento-titulo';
        tituloSegmento.textContent = segmento.titulo;
        segmentoEl.appendChild(tituloSegmento);
        
        // container dos topicos (inicialmente escondido)
        const topicosContainer = document.createElement('div');
        topicosContainer.className = 'topicos-container';
        topicosContainer.style.display = 'none';
        
        // adiciona os topicos
        segmento.topicos.forEach(topico => {
            const topicoEl = document.createElement('div');
            topicoEl.className = 'topico';
            topicoEl.dataset.id = topico.id;
            
            const tituloTopico = document.createElement('h3');
            tituloTopico.className = 'topico-titulo';
            tituloTopico.textContent = topico.titulo;
            topicoEl.appendChild(tituloTopico);
            
            // texto do topico (se existir)
            if (topico.texto) {
                const textoTopico = document.createElement('div');
                textoTopico.className = 'topico-texto';
                textoTopico.textContent = topico.texto;
                textoTopico.style.display = 'none';
                topicoEl.appendChild(textoTopico);
            }
            
            // subtopicos
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

// inicializacao
document.addEventListener('DOMContentLoaded', () => {
    carregarSegmentos();
});