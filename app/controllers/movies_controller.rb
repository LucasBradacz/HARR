# app/controllers/movies_controller.rb
class MoviesController < ApplicationController
  rescue_from TmdbClient::Error, with: :tmdb_unavailable

  def index
    @results = params[:q].present? ? TmdbClient.search_movies(params[:q]) : []
  end

  def show
    @movie = Movie.find_or_fetch(params[:id])
  end

  private

  def tmdb_unavailable
    redirect_to movies_path, alert: "Não foi possível buscar dados de filmes no momento. Tente novamente em instantes."
  end
end