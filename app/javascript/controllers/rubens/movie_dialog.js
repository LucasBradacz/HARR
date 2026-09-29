import { filmes } from "controllers/rubens/movies"
import { icone } from "controllers/rubens/icons"

export function movie_dialog(context) {
    const { root, on, onCleanup, asset, usuario, salvar, atualizarColecoes, atualizarComentariosPerfil, aviso } = context
    /* 4. JANELA DO FILME — dialog cuida do foco, Escape e navegação por teclado. */
    const janela = document.createElement('dialog');
    janela.className = 'film-popup';
    janela.setAttribute('aria-labelledby', 'titulo-filme');
    root.append(janela);
    let filmeAtual;
    let ultimoBotao;
    function abrirFilme(id, botao) {
        const filme = filmes.find(f => f.id === id);
        if (!filme) return;
        filmeAtual = filme;
        ultimoBotao = botao;
        root.append(aviso);
        janela.innerHTML = `
            <button type="button" class="popup-close" aria-label="Fechar ficha" autofocus>${icone("close")}</button>
            <div class="popup-body">
                <div class="film-overview">
                    <img class="popup-poster" src="${asset(`${filme.id}.jpg`)}" alt="Cartaz de ${filme.titulo}">
                    <div>
                        <p class="eyebrow">SOBRE O FILME</p>
                        <h2 id="titulo-filme">${filme.titulo}</h2>
                        <p class="film-facts">${filme.ano} · ${filme.generos.join(' / ')}</p>
                        <p class="muted">Direção: ${filme.diretor}</p>
                        <p class="movie-rating">★ ${filme.nota.toFixed(1)} / 5 · nota demonstrativa</p>
                        <h3>Sinopse</h3><p>${filme.sinopse}</p>
                    </div>
                </div>
                <div class="film-actions">
                    <fieldset><legend>Minhas listas</legend>
                        <label class="list-choice"><input type="checkbox" data-lista="assistir" ${usuario.assistir.includes(id) ? 'checked' : ''}> Quero assistir</label>
                        <label class="list-choice"><input type="checkbox" data-lista="favoritos" ${usuario.favoritos.includes(id) ? 'checked' : ''}> Favoritos</label>
                    </fieldset>
                    <fieldset><legend>Minha avaliação</legend><div class="star-options">
                        ${[1, 2, 3, 4, 5].map(n => `<label class="star-choice"><input type="radio" name="nota" value="${n}" ${usuario.notas[id] === n ? 'checked' : ''}><span aria-hidden="true">★</span><span class="visually-hidden">${n} de 5 estrelas</span></label>`).join('')}
                    </div><button type="button" class="clear-rating">Limpar avaliação</button></fieldset>
                </div>
                <p class="prototype-note">Suas listas, notas e comentários ficam salvos apenas neste navegador.</p>
                <section class="public-comments">
                    <h3>Comentários do público</h3>
                    <p class="muted small">Comentário de exemplo + seus comentários locais.</p>
                    <article class="public-comment"><span class="mini-avatar">L</span><div><strong>Luiza · exemplo</strong><p>Uma história que continua na cabeça depois dos créditos.</p></div></article>
                    <div class="local-comments"></div>
                    <form class="comment-form">
                        <label class="comment-label" for="novo-comentario">Seu comentário</label>
                        <textarea id="novo-comentario" maxlength="1000" rows="3" required placeholder="Escreva seu comentário..."></textarea>
                        <button type="submit" class="button">Publicar no meu navegador</button>
                    </form>
                </section>
            </div>`;
        mostrarComentarios();
        janela.append(aviso);
        janela.showModal();
        janela.scrollTop = 0;
        root.classList.add('modal-open');
    }
    function fecharFilme() {
        janela.close();
    }
    on(janela, 'close', () => {
        root.append(aviso);
        root.classList.remove('modal-open');
        if (ultimoBotao?.isConnected) ultimoBotao.focus();
        else root.querySelector('main h1')?.focus();
    });
    on(janela, 'click', evento => {
        if (evento.target.closest('.popup-close')) fecharFilme();
        if (evento.target === janela) {
            const area = janela.getBoundingClientRect();
            if (evento.clientX < area.left || evento.clientX > area.right || evento.clientY < area.top || evento.clientY > area.bottom) fecharFilme();
        }
        if (evento.target.closest('.clear-rating')) {
            delete usuario.notas[filmeAtual.id];
            janela.querySelectorAll('[name="nota"]').forEach(r => r.checked = false);
            salvar('Avaliação removida.');
        }
    });
    on(root, 'click', evento => {
        const botao = evento.target.closest('[data-filme]');
        if (botao) abrirFilme(botao.dataset.filme, botao);
    });
    on(janela, 'change', evento => {
        const campo = evento.target;
        if (campo.dataset.lista) {
            const lista = campo.dataset.lista;
            usuario[lista] = usuario[lista].filter(id => id !== filmeAtual.id);
            if (campo.checked) usuario[lista].push(filmeAtual.id);
            atualizarColecoes();
            salvar(campo.checked ? 'Filme adicionado à lista!' : 'Filme removido da lista.');
        }
        if (campo.name === 'nota') {
            usuario.notas[filmeAtual.id] = Number(campo.value);
            salvar('Avaliação salva!');
        }
    });
    
    /* 5. COMENTÁRIOS — texto do usuário é inserido com textContent, nunca como HTML. */
    function mostrarComentarios() {
        const area = janela.querySelector('.local-comments');
        area.replaceChildren();
        const comentarios = usuario.comentarios[filmeAtual.id] || [];
        comentarios.forEach(texto => {
            const item = document.createElement('article');
            item.className = 'public-comment';
            const conteudo = document.createElement('div');
            const autor = document.createElement('strong');
            autor.textContent = `${root.querySelector('[data-profile-name]')?.textContent || 'Monique'} · neste navegador`;
            const paragrafo = document.createElement('p');
            paragrafo.textContent = texto;
            conteudo.append(autor, paragrafo);
            item.append(conteudo);
            area.append(item);
        });
    }
    on(janela, 'submit', evento => {
        if (!evento.target.matches('.comment-form')) return;
        evento.preventDefault();
        const campo = janela.querySelector('textarea');
        const texto = campo.value.trim();
        if (!texto) {
            campo.setCustomValidity('Escreva seu comentário antes de publicar.');
            campo.reportValidity();
            return;
        }
        const id = filmeAtual.id;
        if (!usuario.comentarios[id]) usuario.comentarios[id] = [];
        usuario.comentarios[id].push(texto.slice(0, 1000));
        salvar('Comentário salvo neste navegador!');
        mostrarComentarios();
        atualizarComentariosPerfil();
        campo.value = '';
    });
    on(janela, 'input', evento => {
        if (evento.target.matches('textarea')) evento.target.setCustomValidity('');
    });
    root.querySelector('main h1')?.setAttribute('tabindex', '-1');
    atualizarColecoes();
    
    onCleanup(() => { if (janela.open) janela.close(); janela.remove(); root.classList.remove("modal-open") })
}
