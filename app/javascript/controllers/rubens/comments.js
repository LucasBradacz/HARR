import { filmes } from "controllers/rubens/movies"

export function comments(context) {
    const { root, on, asset, moviesUrl, usuario } = context
    /* 7. COMENTÁRIOS NO PERFIL
       Mantém compatibilidade com os comentários de texto já salvos. */
    function atualizarComentariosPerfil() {
        const area = root.querySelector('#lista-comentarios');
        if (!area) return;
        area.replaceChildren();
        let total = 0;
        filmes.forEach(filme => {
            const comentarios = usuario.comentarios[filme.id];
            if (!Array.isArray(comentarios) || !comentarios.length) return;
            const grupo = document.createElement('article');
            grupo.className = 'profile-comment-group';
            const abrir = document.createElement('button');
            abrir.type = 'button';
            abrir.className = 'review-film';
            abrir.dataset.filme = filme.id;
            abrir.setAttribute('aria-label', `Abrir ${filme.titulo}`);
            const imagem = document.createElement('img');
            imagem.src = asset(`${filme.id}.jpg`);
            imagem.alt = `Cartaz de ${filme.titulo}`;
            imagem.loading = 'lazy';
            abrir.append(imagem);
            const conteudo = document.createElement('div');
            conteudo.className = 'profile-comment-content';
            const titulo = document.createElement('h3');
            const link = document.createElement('button');
            link.type = 'button';
            link.className = 'title-button';
            link.dataset.filme = filme.id;
            link.textContent = filme.titulo;
            titulo.append(link);
            conteudo.append(titulo);
            comentarios.forEach(texto => {
                if (typeof texto !== 'string') return;
                const comentario = document.createElement('p');
                comentario.className = 'profile-comment-text';
                comentario.textContent = texto;
                conteudo.append(comentario);
                total++;
            });
            grupo.append(abrir, conteudo);
            area.append(grupo);
        });
        root.querySelector('#total-comentarios').textContent = `${total} ${total === 1 ? 'comentário' : 'comentários'}`;
        if (!total) {
            const vazio = document.createElement('p');
            vazio.className = 'empty-state';
            vazio.append('Você ainda não publicou comentários. ');
            const link = document.createElement('a');
            link.href = moviesUrl;
            link.textContent = 'Escolher um filme';
            vazio.append(link);
            area.append(vazio);
        }
    }
    atualizarComentariosPerfil();
    return { atualizarComentariosPerfil }
}
