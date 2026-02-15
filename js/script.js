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
                            texto: '1. Segure o botão de cadastro continuamente<br>2. Aguarde até ouvir os bips e o teclado apagar<br>3. Solte o botão APENAS quando o teclado acender novamente<br>4. Digite o código: 123578951<br>5. Pressione e segure a tecla de engrenagem (⚙️) ou # (conforme o modelo)<br>6. Mantenha pressionado até o teclado apagar completamente<br>7. Quando apagar, teste abrir com a senha: 1234<br><br>Vídeo tutorial: <a href="https://www.youtube.com/watch?v=o0dvOdV0gIE" target="_blank">https://www.youtube.com/watch?v=o0dvOdV0gIE</a>'
                        },
                        {
                            id: 'alterar-senha-adm',
                            titulo: 'Alterar senha de Adm',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. O teclado abrirá o menu → todas as teclas acenderão EXCETO a tecla 5<br>4. Pressione a tecla 0<br>5. Digite a nova senha de administrador<br>6. Pressione a tecla CONFIRMA (geralmente # ou a tecla de check)<br>7. Digite novamente a mesma senha<br>8. Pressione CONFIRMA novamente'
                        },
                        {
                            id: 'adicionar-senha-usuario',
                            titulo: 'Adicionar Senha de Usuário',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. O teclado abrirá o menu → todas as teclas acenderão EXCETO a tecla 5<br>4. Aperte a tecla 1<br>5. Digite a senha que deseja colocar<br>6. Pressione CONFIRMA<br>7. Digite novamente a senha<br>8. Pressione CONFIRMA novamente<br><br>Vídeo tutorial: <a href="https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s" target="_blank">https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s</a>'
                        },
                        {
                            id: 'adicionar-senha-visitante',
                            titulo: 'Adicionar Senha de Visitante',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. O teclado abrirá o menu → todas as teclas acenderão EXCETO a tecla 5<br>4. Aperte a tecla 4<br>5. Digite a senha que deseja colocar<br>6. Pressione CONFIRMA<br>7. Digite novamente a senha<br>8. Pressione CONFIRMA novamente<br><br>Vídeo tutorial: <a href="https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s" target="_blank">https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s</a>'
                        },
                        {
                            id: 'adicionar-tag',
                            titulo: 'Adicionar Tag',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. O teclado abrirá o menu → todas as teclas acenderão EXCETO a tecla 5<br>4. Aperte a tecla 2<br>5. Aproxime a tag da fechadura e aguarde o bip<br>6. Pressione CONFIRMA para salvar a tag<br><br>Vídeo tutorial: <a href="https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s" target="_blank">https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s</a>'
                        },
                        {
                            id: 'adicionar-biometria',
                            titulo: 'Adicionar Biometria',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. O teclado abrirá o menu → todas as teclas acenderão EXCETO a tecla 5<br>4. Aperte CONFIRMA para acessar a opção de biometria<br>5. Encoste o dedo 3 vezes na área de biometria até ouvir os bips<br>6. Pressione CONFIRMA para salvar a leitura<br><br>Vídeo tutorial: <a href="https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s" target="_blank">https://www.youtube.com/watch?v=XHm2DoU-2DY&t=1s</a>'
                        },
                        {
                            id: 'continuar-cadastrando',
                            titulo: 'Continuar cadastrando + senhas/tags/biometrias',
                            texto: 'Para continuar cadastrando mais senhas, biometrias ou tags, NÃO pressione CONFIRMA para sair; em vez disso, prossiga cadastrando o próximo item até atingir a quantidade desejada ou o limite suportado pela fechadura'
                        },
                        {
                            id: 'excluir-senha-usuario',
                            titulo: 'Excluir Senha de Usuário',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. Aperte a tecla 3 para Excluir Usuário<br>4. Selecione o número da senha do usuário que deseja excluir (ordem de cadastro)<br>5. Digite a senha de administrador para confirmar<br>6. Usuário excluído com sucesso (a conta de admin NÃO pode ser excluída)'
                        },
                        {
                            id: 'excluir-senha-visitante',
                            titulo: 'Excluir Senha de Visitante',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. Aperte a tecla 6 para Excluir Visitante<br>4. Selecione o número da senha do visitante que deseja excluir (ordem de cadastro)<br>5. Digite a senha de administrador para confirmar'
                        },
                        {
                            id: 'excluir-tag',
                            titulo: 'Excluir Tag',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. Aperte a tecla 8 para Excluir Tag<br>4. Selecione o número da tag que deseja excluir (ordem de cadastro)<br>5. Digite a senha de administrador para confirmar'
                        },
                        {
                            id: 'excluir-biometria',
                            titulo: 'Excluir Biometria',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. Aperte o botão de ENGRENAGEM para acessar exclusão de biometria<br>4. Selecione o número da biometria que deseja excluir (ordem de cadastro)<br>5. Digite a senha de administrador para confirmar'
                        },
                        {
                            id: 'excluir-todas-senhas-classe',
                            titulo: 'Excluir Todas as Senhas de Uma Classe',
                            texto: '1. Clique UMA VEZ no botão de cadastro<br>2. Digite a senha de administrador (padrão: 1234)<br>3. Selecione a opção correspondente à classe que deseja apagar (Usuário=3, Visitante=6, Tag=8 ou Biometria=Engrenagem)<br>4. Segure o botão de ENGRENAGEM até confirmar que todas foram excluídas'
                        }
                    ]
                },
                {
                    id: 'nao-perturbe',
                    titulo: 'Não Perturbe',
                    texto: 'Ativar (lado interno): segure o botão de abrir (lado de dentro da casa da fechadura).<br>Desativar (lado interno): segure o botão de abrir novamente.<br>Desativar por fora: digite a senha de administrador (padrão: 1234), segure o botão de ENGRENAGEM e pressione 9.',
                    subtopicos: []
                },
                {
                    id: 'menu-simples',
                    titulo: 'Menu Externo',
                    texto: '1. Digite a senha de administrador (padrão: 1234)<br>2. Segure o botão de ENGRENAGEM para entrar no Menu Externo<br>3. Pressione 3 para AUMENTAR o volume<br>4. Pressione 6 para DIMINUIR o volume<br>5. Pressione 4 para ATIVAR a tranca automática<br>6. Pressione 7 para DESATIVAR a tranca automática',
                    subtopicos: []
                },
                {
                    id: 'erros',
                    titulo: 'Erros',
                    texto: '',
                    subtopicos: [
                        {
                            id: 'erro-6',
                            titulo: 'Erro 6 - Senha Incorreta',
                            texto: 'Senha digitada não corresponde a nenhuma senha cadastrada.'
                        },
                        {
                            id: 'erro-9',
                            titulo: 'Erro 9 - Modo Não Perturbe Ativado',
                            texto: 'A fechadura está em modo Não Perturbe. Desative pelo lado interno ou com senha de admin.'
                        },
                        {
                            id: 'erro-5-0',
                            titulo: 'Erro 5:0 - Modo de Pareamento',
                            texto: 'Fechadura em modo de pareamento com o app.<br>Para desativar: remova a placa Zigbee ou realize o reset inverso (verificar manual do modelo).'
                        },
                        {
                            id: 'erro-percurso',
                            titulo: 'Erro X/4 - Erro de Percurso / Travamento',
                            texto: 'Descrição: Código X ou 4 indica problema no percurso (movimento) ou travamento mecânico.<br><br>Verificação: tente destrancar a porta; se a porta destrancar e permanecer aberta, o erro pode continuar sendo reportado.<br><br>Travamento: verifique se há obstrução física impedindo o movimento de abrir/fechar (ex.: sujeira, folga, batente mal ajustado).<br><br>Correção: remova obstruções, alinhe batentes e componentes; em último caso, abra a fechadura e verifique a instalação e peças internas.'
                        }
                    ]
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
                textoTopico.innerHTML = topico.texto.replace(/\n/g, '<br>');
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