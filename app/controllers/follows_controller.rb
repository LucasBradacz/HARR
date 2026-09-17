class FollowsController < ApplicationController
  before_action :require_login

  def create
    followed = User.find(params[:followed_id])
    current_user.active_follows.find_or_create_by(followed: followed) unless followed == current_user
    redirect_back fallback_location: root_path, notice: "Agora você segue #{followed.username}."
  end

  def destroy
    followed = User.find(params[:followed_id])
    current_user.active_follows.find_by(followed: followed)&.destroy
    redirect_back fallback_location: root_path, notice: "Você deixou de seguir #{followed.username}."
  end
end