# HARR 🏴‍☠️

Clone do Letterboxd — plataforma para registrar, avaliar e comentar filmes assistidos, com tema visual pirata.

## Stack

- **Ruby** 3.4
- **Rails** 8.1
- **PostgreSQL** 17
- Dados de filmes via API externa (TMDB)

## Pré-requisitos

Antes de rodar o projeto, tenha instalado na sua máquina:

- Ruby 3.4 (confira com `ruby -v`)
- Rails 8.1 (`rails -v`)
- PostgreSQL 17, rodando localmente
- Bundler (`gem install bundler`)

## Setup do projeto

### 1. Clone o repositório

```bash
git clone https://github.com/LucasBradacz/HARR.git
cd HARR
```

### 2. Instale as dependências

```bash
bundle install
```

### 3. Configure as variáveis de ambiente

O projeto usa a gem `dotenv-rails` para manter credenciais fora do controle de versão. Crie um arquivo `.env` na raiz do projeto (esse arquivo **não é commitado**, cada dev tem o seu):

```
HARR_DATABASE_PASSWORD=sua_senha_do_postgres_local
```

> Peça a senha combinada da instância local do Postgres pro resto do time, ou use a senha que você mesmo configurou ao instalar o Postgres na sua máquina.

### 4. Confira o `config/database.yml`

O arquivo já está configurado para usar `127.0.0.1` como host (em vez de `localhost`), evitando problemas comuns de IPv6 no Windows. Confirme que o `username` corresponde ao seu usuário do Postgres (por padrão, `postgres`):

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  host: 127.0.0.1
  username: postgres
  password: <%= ENV['HARR_DATABASE_PASSWORD'] %>
```

### 5. Crie e migre o banco de dados

```bash
rails db:create
rails db:migrate
```

Isso vai criar todas as tabelas na ordem correta: `users`, `movies`, `genres`, `movie_genres`, `reviews`, `diary_entries`, `watchlist_items` e `follows`.

### 6. (Opcional) Popule dados iniciais

Se houver seeds configuradas:

```bash
rails db:seed
```

### 7. Rode o servidor

```bash
rails server
```

Acesse em [http://localhost:3000](http://localhost:3000).

## Problemas comuns

### `PG::ConnectionBad: connection to server at "localhost" ... fe_sendauth: no password supplied`

Confirme que:
- Seu `.env` existe e tem a variável `HARR_DATABASE_PASSWORD` preenchida
- O `database.yml` está usando `127.0.0.1`, não `localhost`

### `PG::UndefinedTable` durante uma migration

Geralmente indica que o banco ficou em estado parcial de uma tentativa anterior. Rode:

```bash
rails db:drop db:create db:migrate
```

⚠️ Isso apaga todos os dados locais — use só em ambiente de desenvolvimento.

### Avisos do tipo `VIPS-WARNING ... unable to load vips-*.dll`

São avisos inofensivos do `libvips` (usado pelo Active Storage para processar imagens) sobre módulos opcionais ausentes no Windows. Não impedem o funcionamento do projeto.

## Modelo de dados (resumo)

- **users** — contas e autenticação
- **movies** — cache local dos dados vindos da API do TMDB
- **genres** / **movie_genres** — gêneros dos filmes (N:N)
- **reviews** — críticas de texto escritas pelos usuários
- **diary_entries** — registro de cada exibição de um filme (pode repetir o mesmo filme várias vezes, com nota e data)
- **watchlist_items** — lista de "quero assistir" de cada usuário
- **follows** — relação de seguir entre usuários (self-referential)

## Convenções do projeto

- Autenticação nativa do Rails (`has_secure_password`), sem Devise
- Rating de 1 a 5
- Cada usuário pode ter múltiplas reviews e diary entries do mesmo filme
