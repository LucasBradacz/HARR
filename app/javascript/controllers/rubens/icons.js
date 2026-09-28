// Ícones vetoriais locais, sem bibliotecas ou chamadas externas.
const desenhosIcones = {
    "home": "<path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z\"/>",
    "film": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4\"/>",
    "list": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/>",
    "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21v-2a8 8 0 0 1 16 0v2\"/>",
    "left": "<path d=\"m15 5-7 7 7 7\"/>",
    "right": "<path d=\"m9 5 7 7-7 7\"/>",
    "close": "<path d=\"m6 6 12 12M18 6 6 18\"/>",
    "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 5 5\"/>",
    "edit": "<path d=\"m15 5 4 4M4 20l4-1L20 7a3 3 0 0 0-4-4L4 15Z\"/>",
    "down": "<path d=\"m6 9 6 6 6-6\"/>"
};

export function icone(nome) {
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${desenhosIcones[nome] || ""}</svg>`;
}
