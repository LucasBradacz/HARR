class ReviewsController < ApplicationController
  before_action :require_login
  before_action :set_movie, only: [:create]
  before_action :set_user_review, only: [:edit, :update, :destroy]

  def create
    @review = @movie.reviews.build(review_params)
    @review.user = current_user

    if @review.save
      redirect_to movie_path(@movie), notice: "Review publicada com sucesso."
    else
      # preserva o formulário preenchido e exibe os erros na página do filme
      render 'movies/show', status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @review.update(review_params)
      # usa a associação do model para redirecionar de volta ao filme correto
      redirect_to movie_path(@review.movie), notice: "Review atualizada com sucesso."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    movie = @review.movie
    @review.destroy
    redirect_to movie_path(movie), notice: "Review removida com sucesso."
  end

  private

  def set_movie
    # Busca pelo tmdb_id na rota aninhada (ex: /movies/:movie_id/reviews)
    @movie = Movie.find_by!(tmdb_id: params[:movie_id])
  end

  # o usuário só consegue buscar, editar ou apagar as proprias reviews
  def set_user_review
    @review = current_user.reviews.find(params[:id])
  end

  def review_params
    params.require(:review).permit(:rating, :body, :contains_spoilers)
  end
end