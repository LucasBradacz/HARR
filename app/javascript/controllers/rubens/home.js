import { filmes } from "controllers/rubens/movies"

export function home(context) {
    const { root, on, asset, filtrarFilmes } = context
    /* 6. BANNER DA PÁGINA INICIAL — seleção local, sem rotação automática. */
    const banner = root.querySelector('#banner-content');
    if (banner) {
        const destaques = ['dune', 'interstellar', 'inception'];
        let indice = 0;
        function atualizarBanner() {
            const filme = filmes.find(f => f.id === destaques[indice]);
            banner.innerHTML = `<div class="banner-slide">
                <img class="banner-background" src="${asset(`${filme.id}.jpg`)}" alt="">
                <div class="banner-copy"><p class="eyebrow">FILMES POPULARES · SELEÇÃO DEMONSTRATIVA</p>
                    <h2>${filme.titulo}</h2><p class="film-facts">${filme.ano} · ${filme.generos.join(' / ')}</p>
                    <p>${filme.sinopse}</p><button type="button" class="button" data-filme="${filme.id}">Ver filme</button>
                </div><img class="banner-poster" src="${asset(`${filme.id}.jpg`)}" alt="Cartaz de ${filme.titulo}">
            </div>`;
            root.querySelector('#banner-position').textContent = `${indice + 1} / ${destaques.length}`;
        }
        on(root.querySelector('#banner-prev'), 'click', () => {
            indice = (indice + destaques.length - 1) % destaques.length;
            atualizarBanner();
        });
        on(root.querySelector('#banner-next'), 'click', () => {
            indice = (indice + 1) % destaques.length;
            atualizarBanner();
        });
        atualizarBanner();
    }
    root.querySelectorAll('.like-review').forEach(botao => {
        on(botao, 'click', () => {
            const ativo = botao.getAttribute('aria-pressed') !== 'true';
            botao.setAttribute('aria-pressed', String(ativo));
            const total = Number(botao.dataset.count) + (ativo ? 1 : 0);
            botao.querySelector('span').textContent = `${total.toLocaleString('pt-BR')} curtidas`;
        });
    });
    on(root.querySelector('#buscar-filmes'), 'click', () => {
        filtrarFilmes();
        root.querySelector('#filmes').scrollIntoView({ behavior: 'smooth' });
    });
    
    

}
