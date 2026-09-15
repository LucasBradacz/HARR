class MoviesController < ApplicationController
  def index
    @results = params[:q].present? ? TmdbClient.search_movies(params[:q]) : []
  end

  def show
    @movie = Movie.find_or_fetch(params[:id])
  end
end