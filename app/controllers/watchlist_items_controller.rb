class WatchlistItemsController < ApplicationController
  before_action :require_login
  before_action :set_movie, only: [:create, :destroy]

  def index
    @watchlist_items = current_user.watchlist_items.includes(:movie).order(created_at: :desc)
  end

  def create
    @movie.watchlist_items.find_or_create_by(user: current_user)
    redirect_to movie_path(@movie), notice: "Adicionado à watchlist."
  end

  def destroy
    current_user.watchlist_items.find_by(movie: @movie)&.destroy
    redirect_to movie_path(@movie), notice: "Removido da watchlist."
  end

  private

  def set_movie
    @movie = Movie.find_by!(tmdb_id: params[:movie_id])
  end
end