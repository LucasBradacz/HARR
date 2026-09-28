# Validação desta entrega

- Comparação com HARR-main(1).zip recebido: nenhum arquivo da entrega ocupa um
  caminho já existente naquele ZIP. Não foram incluídos arquivos de backend.
- Sintaxe de todos os módulos JavaScript verificada com Node.
- Imports locais, caminhos de imagens/CSS e referências a partials conferidos.
- Quatro testes isolados passaram: busca sem acentos e filtros combinados; limpeza
  dos filtros; banner circular com URLs de assets; conexão/desconexão repetida sem
  acumular diálogos, avisos ou listeners de uma conexão anterior.

Para repetir os testes, com Node instalado na máquina:

```sh
node --test test/javascript/rubens_frontend_test.mjs
```

Os testes usam pequenas simulações do DOM. Não substituem execução no navegador.
Não foi possível rodar Rails, compilar os assets no Rails nem inspecionar as telas
visualmente neste ambiente, pois Ruby e um navegador executável não estão instalados.

A comparação de caminhos vale para o ZIP recebido, não para alterações posteriores
no GitHub. Antes do commit, atualize sua branch e confira os arquivos alterados.
