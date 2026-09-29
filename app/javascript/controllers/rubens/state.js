export function state(context) {
    const { root, on, onCleanup } = context
    /* 1. DADOS DO USUÁRIO
       localStorage guarda apenas neste navegador. Não existe servidor neste projeto. */
    const chave = 'harr-rubens-demo-preferencias-v1';
    const padrao = {
        favoritos: ['interstellar', 'whiplash', 'spirited', 'parasite'],
        assistir: ['dune', 'grand'],
        notas: {},
        comentarios: {}
    };
    let usuario = structuredClone(padrao);
    try {
        const salvo = JSON.parse(localStorage.getItem(chave));
        if (salvo && Array.isArray(salvo.favoritos) && Array.isArray(salvo.assistir)
            && salvo.notas && salvo.comentarios) usuario = salvo;
    } catch (erro) {
        // Sem acesso ao armazenamento, as ações continuam funcionando nesta sessão.
    }
    
    const aviso = document.createElement('div');
    aviso.className = 'toast';
    aviso.setAttribute('role', 'status');
    root.append(aviso);
    let tempoAviso;
    function notificar(texto) {
        aviso.textContent = texto;
        aviso.classList.add('visible');
        clearTimeout(tempoAviso);
        tempoAviso = setTimeout(() => aviso.classList.remove('visible'), 3000);
    }
    function salvar(mensagem) {
        try {
            localStorage.setItem(chave, JSON.stringify(usuario));
            notificar(mensagem);
        } catch (erro) {
            notificar('Alteração nesta sessão. O navegador não permitiu salvar.');
        }
    }
    
    onCleanup(() => { clearTimeout(tempoAviso); aviso.remove() })
    return { usuario, salvar, notificar, aviso }
}
