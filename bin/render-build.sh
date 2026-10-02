#!/usr/bin/env bash
# Script de build para o Render
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean
bundle exec rails db:migrate
