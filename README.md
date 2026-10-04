# HARR.

Plataforma para registrar, avaliar e compartilhar filmes assistidos. Projeto acadêmico desenvolvido em Ruby on Rails.

---

## 🎬 Vídeo de apresentação

> https://youtu.be/1kVMa1YvvQI

## 🌐 Projeto deployado

> https://harr-esd9.onrender.com/

---

## Funcionalidades

- Cadastro e autenticação de usuários (sem Devise — `has_secure_password`)
- Busca de filmes via API do TMDB com cache automático no banco
- Reviews com nota (1–5 estrelas) e texto opcional
- Diário de exibições — gerado automaticamente ao publicar uma review, ou criado manualmente
- Watchlist pessoal (adicionar/remover filmes)
- Perfil público com histórico de reviews e diário
- Sistema de seguidores/seguindo
- Upload de avatar de perfil
- Feed de atividade recente na home (reviews da comunidade)

---

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Linguagem | Ruby 3.4 |
| Framework | Ruby on Rails 8.1 |
| Banco de dados | PostgreSQL 17 |
| Frontend | HTML/ERB, CSS puro, Stimulus (Hotwire) |
| Asset pipeline | Propshaft |
| Upload de arquivos | Active Storage |
| Autenticação | `has_secure_password` (bcrypt) |
| API externa | TMDB (The Movie Database) |
| Segurança | Rack::Attack, Rack::CORS, CSP nativo do Rails |
| Deploy — servidor | Render (Web Service) |
| Deploy — banco | Render (PostgreSQL gerenciado) |
| Gerenciamento de env | dotenv-rails |

---

## Arquitetura do sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        Navegador                            │
│              HTML/ERB + CSS + Stimulus (JS)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                    Render Web Service                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Ruby on Rails 8.1 (Puma)               │   │
│   │                                                     │   │
│   │  Routes → Controllers → Models → Views (ERB)        │   │
│   │                                                     │   │
│   │  ApplicationController                              │   │
│   │  ├── MoviesController     (index, show)             │   │
│   │  ├── ReviewsController    (create, edit, update,    │   │
│   │  │                         destroy)                 │   │
│   │  ├── DiaryEntriesController (create, edit, update,  │   │
│   │  │                           destroy)               │   │
│   │  ├── UsersController      (show, edit, update,      │   │
│   │  │                         followers, following)    │   │
│   │  ├── HomeController       (index — feed)            │   │
│   │  ├── WatchlistItemsController (index, create,       │   │
│   │  │                             destroy)             │   │
│   │  ├── FollowsController    (create, destroy)         │   │
│   │  ├── SessionsController   (new, create, destroy)    │   │
│   │  └── RegistrationsController (new, create)          │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│   ┌──────────────────────▼──────────────────────────────┐   │
│   │               TmdbClient (Service)                  │   │
│   │   Net::HTTP + Rails.cache (cache de filmes)         │   │
│   └──────────────────────┬──────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
┌─────────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
│ Render         │ │ TMDB API     │ │ Active       │
│ PostgreSQL 17  │ │ (filmes,     │ │ Storage      │
│                │ │  pôsteres,   │ │ (avatars)    │
│                │ │  gêneros)    │ │              │
└────────────────┘ └──────────────┘ └──────────────┘
```

---

## Arquitetura do banco de dados

```
┌──────────────────┐         ┌──────────────────┐
│      users       │         │      movies       │
├──────────────────┤         ├──────────────────┤
│ id               │         │ id               │
│ username (uniq)  │         │ tmdb_id (uniq)   │
│ email (uniq)     │         │ title            │
│ password_digest  │         │ synopsis         │
│ bio              │         │ poster_url       │
│ avatar_url       │         │ release_year     │
│ created_at       │         │ cached_at        │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │         ┌──────────────────┘
         │         │
         │   ┌─────▼──────────────┐         ┌──────────────┐
         │   │     reviews        │         │   genres     │
         │   ├────────────────────┤         ├──────────────┤
         ├──►│ user_id (FK)       │         │ id           │
         │   │ movie_id (FK)      │◄───┐    │ name         │
         │   │ rating (decimal)   │    │    └──────┬───────┘
         │   │ body               │    │           │
         │   │ contains_spoilers  │    │    ┌──────▼───────┐
         │   └────────┬───────────┘    │    │ movie_genres │
         │            │                │    ├──────────────┤
         │   ┌────────▼───────────┐    │    │ movie_id (FK)│
         │   │   diary_entries    │    │    │ genre_id (FK)│
         │   ├────────────────────┤    │    └──────────────┘
         ├──►│ user_id (FK)       │    │
         │   │ movie_id (FK)      │────┘
         │   │ review_id (FK, opt)│  (criado automaticamente
         │   │ rating (decimal)   │   ao publicar review)
         │   │ watched_on         │
         │   └────────────────────┘
         │
         │   ┌────────────────────┐
         │   │  watchlist_items   │
         │   ├────────────────────┤
         ├──►│ user_id (FK)       │
         │   │ movie_id (FK)      │
         │   │ UNIQUE(user,movie) │
         │   └────────────────────┘
         │
         │   ┌────────────────────┐
         │   │      follows       │
         │   ├────────────────────┤
         ├──►│ follower_id (FK)   │
         └──►│ followed_id (FK)   │
             │ UNIQUE(flwr,flwd)  │
             │ CHECK flwr≠flwd    │
             └────────────────────┘
```

---

## Configuração local

### Pré-requisitos

- Ruby 3.4
- PostgreSQL 17
- Bundler

### Instalação

```bash
git clone https://github.com/LucasBradacz/HARR
cd HARR
bundle install
cp .env.example .env
# preencha .env com suas credenciais
rails db:create db:migrate
rails server
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `HARR_DATABASE_PASSWORD` | Senha do PostgreSQL local |
| `TMDB_API_KEY` | Chave da API do TMDB — obtenha em [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `RAILS_MASTER_KEY` | Necessário apenas em produção (valor em `config/master.key`) |

---

## Deploy

O projeto é deployado no [Render](https://render.com) usando o arquivo `render.yaml` na raiz do repositório.

**Serviços provisionados automaticamente:**
- Web Service (Ruby/Puma)
- PostgreSQL 17 gerenciado

**Variáveis que precisam ser configuradas manualmente no dashboard do Render:**
- `RAILS_MASTER_KEY`
- `TMDB_API_KEY`

---

## Equipe

Projeto acadêmico desenvolvido por Eric Camini, Lucas Bradacz, Matheus Henrique, Móises Zilles, Rubens Garcia.
