class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  before_action :require_login, only: [:edit, :update]
  before_action :require_own_profile, only: [:edit, :update]

  def show
    @reviews = @user.reviews.includes(:movie).order(created_at: :desc)
    @diary_entries = @user.diary_entries.includes(:movie).order(watched_on: :desc)
  end

  def edit; end

  def update
    if @user.update(user_params)
      redirect_to user_path(@user.username), notice: "Perfil atualizado com sucesso."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by!(username: params[:username])
  end

  def require_own_profile
    redirect_to user_path(@user.username), alert: "Você só pode editar seu próprio perfil." unless current_user == @user
  end

  def user_params
    params.require(:user).permit(:bio, :avatar)
  end
end
