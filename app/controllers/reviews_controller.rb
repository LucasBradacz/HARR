class ReviewsController < ApplicationController
  before_action :require_login
  before_action :set_movie

  def create
    @review = @movie.reviews.build(review_params)
    @review.user = current_user
    if @review.save
      redirect_to movie_path(@movie), notice: "Review publicada."
    else
      redirect_to movie_path(@movie), alert: @review.errors.full_messages.to_sentence
    end
  end

  def edit
    @review = current_user.reviews.find(params[:id])
  end

  def update
    @review = current_user.reviews.find(params[:id])
    if @review.update(review_params)
      redirect_to movie_path(@movie), notice: "Review atualizada."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.reviews.find(params[:id]).destroy
    redirect_to movie_path(@movie), notice: "Review removida."
  end

  private

  def set_movie
    @movie = Movie.find_by!(tmdb_id: params[:movie_id])
  end

  def review_params
    params.require(:review).permit(:rating, :body, :contains_spoilers)
  end
end