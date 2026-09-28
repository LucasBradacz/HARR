import { filmes } from "controllers/rubens/movies"
import { icone } from "controllers/rubens/icons"

export function profile(context) {
    const { root, on, onCleanup, notificar } = context
    /* PERFIL: interface e ponto de integração com o backend.
       Substitua somente carregarPerfil() e salvarPerfil() pelas chamadas à API.
       Consulte docs/rubens/INTEGRACAO.md. */
    const perfilPadrao = {
        nome: 'Monique',
        bio: 'Gosto de descobrir novos filmes e revisitar meus clássicos favoritos.',
        foto: ''
    };
    function carregarPerfil() {
        try {
            const dados = JSON.parse(localStorage.getItem('harr-rubens-demo-perfil-v1'));
            if (dados && typeof dados.nome === 'string' && typeof dados.bio === 'string') {
                return { nome: dados.nome, bio: dados.bio, foto: typeof dados.foto === 'string' ? dados.foto : '' };
            }
        } catch (erro) { /* Usa o perfil inicial se não houver dados válidos. */ }
        return { ...perfilPadrao };
    }
    async function salvarPerfil(dados, arquivoFoto, removerFoto) {
        // BACKEND: envie nome, bio, arquivoFoto (File) e removerFoto via FormData.
        // Aqui a foto é data URL; na API, retorne a URL pública da imagem em foto.
        localStorage.setItem('harr-rubens-demo-perfil-v1', JSON.stringify(dados));
        return dados;
    }
    let perfil = carregarPerfil();
    function aplicarPerfil() {
        root.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = perfil.nome);
        root.querySelectorAll('[data-profile-bio]').forEach(el => el.textContent = perfil.bio);
        root.querySelectorAll('[data-profile-avatar]').forEach(el => {
            el.replaceChildren();
            if (perfil.foto && /^(data:image\/(png|jpeg|webp);base64,|https?:\/\/)/.test(perfil.foto)) {
                const imagem = document.createElement('img');
                imagem.src = perfil.foto;
                imagem.alt = `Foto de ${perfil.nome}`;
                on(imagem, 'error', () => el.textContent = perfil.nome.charAt(0).toUpperCase());
                el.append(imagem);
            } else el.textContent = perfil.nome.charAt(0).toUpperCase();
        });
    }
    aplicarPerfil();
    
    const editarPerfil = root.querySelector('#editar-perfil');
    if (editarPerfil) {
        const editor = document.createElement('dialog');
        editor.className = 'profile-editor film-popup';
        editor.setAttribute('aria-labelledby', 'editor-titulo');
        editor.innerHTML = `
            <form id="form-perfil" class="profile-form">
                <div class="editor-heading"><h2 id="editor-titulo">Editar perfil</h2>
                    <button type="button" class="editor-close" aria-label="Fechar edição">${icone("close")}</button></div>
                <div class="photo-settings"><div class="photo-preview" aria-label="Prévia da foto"></div>
                    <div><label class="button secondary" for="foto-perfil">Escolher foto</label>
                        <input id="foto-perfil" type="file" accept="image/jpeg,image/png,image/webp">
                        <p class="muted small">JPG, PNG ou WebP · até 2 MB</p>
                        <button class="clear-rating" type="button" id="remover-foto">Remover foto</button></div></div>
                <label for="nome-perfil">Nome</label>
                <input id="nome-perfil" name="nome" maxlength="50" required autocomplete="name">
                <label for="bio-perfil">Descrição</label>
                <textarea id="bio-perfil" name="bio" rows="3" maxlength="300"></textarea>
                <p class="small muted">As alterações ficam neste navegador até a integração com o backend.</p>
                <p id="perfil-status" role="status"></p>
                <div class="editor-actions"><button type="button" class="button secondary editor-cancel">Cancelar</button>
                    <button type="submit" class="button">Salvar alterações</button></div>
            </form>`;
        root.append(editor);
        let fotoTemporaria = '';
        let arquivo = null;
        let remover = false;
        let leitura = 0;
        onCleanup(() => { leitura++; editor.remove(); root.classList.remove("modal-open") });
        const status = editor.querySelector('#perfil-status');
        const enviar = editor.querySelector('[type="submit"]');
        function atualizarPrevia() {
            const area = editor.querySelector('.photo-preview');
            area.replaceChildren();
            if (fotoTemporaria) {
                const img = document.createElement('img');
                img.src = fotoTemporaria;
                img.alt = 'Prévia da nova foto';
                area.append(img);
            } else area.textContent = 'Foto';
        }
        function fecharEditor() {
            leitura++;
            editor.close();
        }
        on(editarPerfil, 'click', () => {
            fotoTemporaria = perfil.foto;
            arquivo = null;
            remover = false;
            editor.querySelector('#foto-perfil').value = '';
            editor.querySelector('#nome-perfil').value = perfil.nome;
            editor.querySelector('#bio-perfil').value = perfil.bio;
            status.textContent = '';
            enviar.disabled = false;
            atualizarPrevia();
            editor.showModal();
            root.classList.add('modal-open');
        });
        on(editor.querySelector('.editor-close'), 'click', fecharEditor);
        on(editor.querySelector('.editor-cancel'), 'click', fecharEditor);
        on(editor, 'close', () => {
            leitura++;
            root.classList.remove('modal-open');
            editarPerfil.focus();
        });
        on(editor.querySelector('#remover-foto'), 'click', () => {
            leitura++;
            fotoTemporaria = '';
            arquivo = null;
            remover = true;
            enviar.disabled = false;
            editor.querySelector('#foto-perfil').value = '';
            status.textContent = 'Foto removida da prévia. Salve para confirmar.';
            atualizarPrevia();
        });
        on(editor.querySelector('#foto-perfil'), 'change', evento => {
            const selecionado = evento.target.files[0];
            if (!selecionado) return;
            const versao = ++leitura;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(selecionado.type) || selecionado.size > 2 * 1024 * 1024) {
                status.textContent = 'Escolha uma imagem JPG, PNG ou WebP de até 2 MB.';
                evento.target.value = '';
                enviar.disabled = false;
                return;
            }
            enviar.disabled = true;
            status.textContent = 'Carregando foto...';
            const leitor = new FileReader();
            function falhar() {
                if (versao !== leitura) return;
                status.textContent = 'Não foi possível abrir essa imagem. Escolha outro arquivo.';
                enviar.disabled = false;
            }
            leitor.onerror = falhar;
            leitor.onload = () => {
                const imagem = new Image();
                imagem.onerror = falhar;
                imagem.onload = () => {
                    if (versao !== leitura) return;
                    arquivo = selecionado;
                    fotoTemporaria = leitor.result;
                    remover = false;
                    atualizarPrevia();
                    enviar.disabled = false;
                    status.textContent = 'Foto pronta. Salve para confirmar.';
                };
                imagem.src = leitor.result;
            };
            leitor.readAsDataURL(selecionado);
        });
        on(editor.querySelector('form'), 'submit', async evento => {
            evento.preventDefault();
            const nome = editor.querySelector('#nome-perfil').value.trim();
            if (!nome) { status.textContent = 'Informe seu nome.'; return; }
            const dados = { nome, bio: editor.querySelector('#bio-perfil').value.trim(), foto: fotoTemporaria };
            enviar.disabled = true;
            try {
                perfil = await salvarPerfil(dados, arquivo, remover);
                aplicarPerfil();
                fecharEditor();
                notificar('Perfil atualizado!');
            } catch (erro) {
                status.textContent = 'Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado.';
            } finally { enviar.disabled = false; }
        });
    }

}
