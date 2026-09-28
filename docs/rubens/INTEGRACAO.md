# Integração do front-end de Rubens

## O que foi seguido do HARR-main

O README indica Ruby 3.4, Rails 8.1, PostgreSQL 17, autenticação nativa e notas de
1 a 5. O código usa Propshaft, importmap, Turbo e Stimulus. Por isso:

- HTML foi convertido em templates ERB e partials dentro de `app/views`.
- Imagens usam `asset_path`, incluindo o mapa de URLs disponibilizado ao JavaScript.
- CSS fica em `app/assets/stylesheets/rubens`; cada seletor tem o escopo
  `.rubens-frontend`, evitando alterar as telas já existentes quando Rails carrega `:app`.
- JavaScript usa módulos ES e um controller Stimulus. Não existem variáveis globais
  `filmes`, `usuario`, `perfil` ou `icone` compartilhadas com o código dos colegas.
- Eventos usam AbortController; diálogos e avisos são removidos antes do cache do
  Turbo e no disconnect. Retornar a uma tela não acumula handlers.
- Links usam os helpers existentes: `root_path`, `movies_path`, `watchlist_path`,
  `user_path` e `new_session_path`.

Não altere Gemfile, banco, importmap ou application.js para instalar estes arquivos.
O `pin_all_from "app/javascript/controllers", under: "controllers"` existente já
inclui os módulos novos; o loader Stimulus existente registra `rubens-frontend`.

## Ativação coordenada — alterações em arquivos compartilhados

Estes trechos são instruções, **não substituições dos arquivos completos**. Aplique
na branch de integração após revisão dos colegas. O pacote não altera nenhum desses
arquivos. Não substitua rotas, autenticação ou consultas existentes.

### MoviesController#index

Ao final da ação `index` existente em `app/controllers/movies_controller.rb`, depois
de definir `@results`, acrescente:

```ruby
screen = request.path == root_path ? "rubens/inicio" : "rubens/filmes"
render template: screen, layout: "rubens"
```

No ZIP recebido, `/` e `/movies` já usam `movies#index`. A seleção acima permite
exibir Início em `/` e Filmes em `/movies` sem criar rotas ou controllers novos.
A busca do protótipo continua local; `@results` ainda não é consumido por ela.
Não altere `show`: os detalhes reais do backend permanecem na view atual.

### WatchlistItemsController#index

Ao final da ação `index`, depois da consulta atual, acrescente:

```ruby
render template: "rubens/listas", layout: "rubens"
```

O `before_action :require_login` continua igual. A tela entregue ainda mostra
listas demonstrativas locais; a consulta `@watchlist_items` fica disponível para
uma próxima ligação com os dados reais.

### UsersController#show

Ao final da ação `show`, depois das consultas atuais, acrescente:

```ruby
if @user == current_user
  render template: "rubens/perfil", layout: "rubens"
end
```

O perfil de outros usuários continua usando a view original. O perfil de Rubens é
uma demonstração editável localmente, sem escrita no banco. O link Perfil manda
visitantes para o login existente. Não crie `update` ou migrations só para exibir
essas telas.

Para testar primeiro sem ativar tudo, aplique somente o trecho de MoviesController.
As demais abas continuarão abrindo as páginas atuais dos colegas até sua ativação.

## Arquivos JavaScript

| Módulo | Responsabilidade |
| --- | --- |
| `movies.js` | Catálogo demonstrativo |
| `icons.js` | SVGs usados nas interações |
| `state.js` | Preferências locais, avisos e persistência |
| `catalog.js` | Cartazes, busca e filtros combinados |
| `movie_dialog.js` | Detalhes, notas, listas e comentários no modal |
| `comments.js` | Comentários reunidos no perfil |
| `home.js` | Banner e curtidas demonstrativas |
| `profile.js` | Edição, validação e prévia da foto |

As chaves locais agora começam com `harr-rubens-demo-`, separadas de possíveis dados
dos colegas. Os dados do protótipo anterior não são importados automaticamente.
Não carregue os scripts antigos junto com estes módulos.

## Ligação futura com o backend

| Interface | O que existe no backend recebido | Trabalho futuro |
| --- | --- | --- |
| Filmes | `@results` do TMDB; `Movie#tmdb_id` | Adaptar o catálogo e usar IDs do TMDB, não os slugs demonstrativos |
| Avaliações/comentários | `reviews` com `rating`, `body`, `contains_spoilers` | Formulários Rails com CSRF e validação do servidor |
| Quero assistir | `watchlist_items` | Usar as rotas create/destroy existentes |
| Perfil | `username`, `bio`, `avatar_url`; ação show | Combinar endpoint autorizado de atualização com os colegas |
| Foto | Coluna `avatar_url`; sem endpoint de upload de perfil | Backend deve validar e armazenar o arquivo; a prévia local não faz upload |
| Favoritos/curtidas | Sem implementação equivalente identificada | Definir modelo/rotas com a equipe antes de persistir |

O README fala em múltiplas reviews por filme, mas o model Review recebido valida
unicidade de usuário/filme. Essa divergência deve ser resolvida pela equipe; este
pacote não altera a regra. Os comentários locais do protótipo não definem o
contrato do banco.

## Como conferir

Depois de copiar os arquivos e aplicar os trechos de ativação:

```sh
bundle install
bin/rails server
```

Use o banco e `.env` já configurados pela equipe. Esta entrega não exige migrations.
Em ambiente de validação, confira também:

```sh
bin/rails zeitwerk:check
bin/rails assets:precompile
```

Teste busca combinada com filtros, banner, modal/Escape, notas, comentários,
listas, edição de foto e retorno pelo navegador/Turbo. Teste também uma tela
antiga para confirmar que seus estilos continuam os mesmos.

O ambiente desta adaptação não possui Ruby nem navegador executável. Foram feitos
checks estáticos e testes isolados de JavaScript, descritos em VALIDACAO.md. A
execução completa no Rails e a inspeção visual ainda devem ser feitas pelo grupo.
