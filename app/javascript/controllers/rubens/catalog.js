import { filmes } from "controllers/rubens/movies"

export function catalog(context) {
    const { root, on, asset, usuario } = context
    /* 2. CARTAZES E COLEÇÕES — dados do catálogo são definidos em movies.js. */
    function cartaz(filme) {
        return `<article class="movie-card">
            <button type="button" class="movie-open" data-filme="${filme.id}" aria-label="Abrir ${filme.titulo}">
                <span class="poster-wrapper">
                    <img src="${asset(`${filme.id}.jpg`)}" alt="Cartaz de ${filme.titulo}" width="500" height="750" loading="lazy">
                    <span class="poster-hint">Abrir ficha +</span>
                </span>
                <span class="movie-title">${filme.titulo}</span>
                <span class="movie-meta">${filme.ano} <span class="movie-rating">★ ${filme.nota.toFixed(1)}</span></span>
            </button>
        </article>`;
    }
    function atualizarColecoes() {
        for (const [seletor, ids] of [['#favoritos .movies-grid', usuario.favoritos], ['#watchlist .movies-grid', usuario.assistir]]) {
            const grade = root.querySelector(seletor);
            if (!grade) continue;
            grade.innerHTML = filmes.filter(f => ids.includes(f.id)).map(cartaz).join('');
            if (!grade.children.length) grade.innerHTML = '<p class="empty-state">Nenhum filme aqui ainda. Abra um filme na aba Filmes para adicioná-lo.</p>';
        }
    }
    
    /* 3. PESQUISA, FILTROS E ORDENAÇÃO — todos funcionam juntos. */
    const pesquisa = root.querySelector('#pesquisa');
    function normalizar(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    function filtrarFilmes() {
        if (!pesquisa) return;
        const termo = normalizar(pesquisa.value.trim());
        const ano = root.querySelector('#filtro-ano').value;
        const nota = Number(root.querySelector('#filtro-avaliacao').value);
        const genero = root.querySelector('#filtro-genero').value;
        const popular = root.querySelector('#filtro-popular').value;
        const resultado = filmes.filter(f =>
            normalizar(`${f.titulo} ${f.diretor} ${f.sinopse}`).includes(termo)
            && (!ano || f.ano === Number(ano))
            && f.nota >= nota
            && (!genero || f.generos.includes(genero))
        );
        if (popular) resultado.sort((a, b) => popular === 'Mais populares'
            ? b.popularidade - a.popularidade : a.popularidade - b.popularidade);
        root.querySelector('#filmes .movies-grid').innerHTML = resultado.map(cartaz).join('')
            || '<p class="empty-state">Nenhum filme encontrado. Tente outra busca ou limpe os filtros.</p>';
        root.querySelector('#resultados').textContent = `${resultado.length} de ${filmes.length} filmes encontrados`;
    }
    if (pesquisa) {
        on(pesquisa, 'input', filtrarFilmes);
        root.querySelectorAll('.filter-grid select').forEach(campo => on(campo, 'change', filtrarFilmes));
        on(root.querySelector('#limpar-filtros'), 'click', () => {
            pesquisa.value = '';
            root.querySelectorAll('.filter-grid select').forEach(campo => campo.value = '');
            filtrarFilmes();
            pesquisa.focus();
        });
        filtrarFilmes();
    }
    
    return { atualizarColecoes, filtrarFilmes }
}
