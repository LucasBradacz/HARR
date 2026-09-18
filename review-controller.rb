class ReviewsController < ApplicationController
  before_action :set_movie, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :authorize_user!, only: [:update, :destroy]

  # GET /movies/:movie_id/reviews
  def index
    @reviews = @movie.reviews.includes(:user)
    render json: @reviews, status: :ok
  end

  # GET /reviews/:id
  def show
    render json: @review, status: :ok
  end

  # POST /movies/:movie_id/reviews
  def create
    @review = @movie.reviews.build(review_params)
    @review.user = current_user

    if @review.save
      render json: @review, status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /reviews/:id
  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /reviews/:id
  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_movie
    @movie = Movie.find(params[:movie_id])
  end

  def set_review
    @review = Review.find(params[:id])
  end

  # garantir que o user só pode apagar/editar a própria review
  def authorize_user!
    unless @review.user_id == current_user.id
      render json: { error: 'Acesso não autorizado.' }, status: :forbidden
    end
  end

  # permite só os campos que são autorizados
  def review_params
    params.require(:review).permit(:content, :rating)
  end
end