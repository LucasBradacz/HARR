class UsersController < ApplicationController
  def show
    @user = User.find_by!(username: params[:username])
    @reviews = @user.reviews.includes(:movie).order(created_at: :desc)
    @diary_entries = @user.diary_entries.includes(:movie).order(watched_on: :desc)
  end
end