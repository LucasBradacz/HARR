class HomeController < ApplicationController
  def index
    @recent_reviews = Review.includes(:user, :movie)
                            .order(created_at: :desc)
                            .limit(20)
  end
end
