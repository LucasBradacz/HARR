#!/usr/bin/env bash
# Script de build para o Render — apenas instala dependências e compila assets
# db:migrate roda no startCommand onde DATABASE_URL já está disponível
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean
