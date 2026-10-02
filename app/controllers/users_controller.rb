class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :followers, :following]
  before_action :require_login, only: [:edit, :update]
  before_action :require_own_profile, only: [:edit, :update]

  def show
    @reviews = @user.reviews.includes(:movie).order(created_at: :desc)
    @diary_entries = @user.diary_entries.includes(:movie).order(watched_on: :desc)
  end

  def edit; end

  def update
    attrs = user_params

    if params[:user][:avatar].present?
      file = params[:user][:avatar]
      allowed = %w[image/jpeg image/png image/gif image/webp]
      max_size = 500.kilobytes

      if !allowed.include?(file.content_type)
        @user.errors.add(:avatar_url, "deve ser uma imagem (JPEG, PNG, GIF ou WebP)")
        render :edit, status: :unprocessable_entity and return
      elsif file.size > max_size
        @user.errors.add(:avatar_url, "deve ter no máximo 500KB")
        render :edit, status: :unprocessable_entity and return
      else
        base64 = Base64.strict_encode64(file.read)
        attrs = attrs.merge(avatar_url: "data:#{file.content_type};base64,#{base64}")
      end
    end

    if @user.update(attrs)
      redirect_to user_path(@user.username), notice: "Perfil atualizado com sucesso."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def followers
    @users = @user.followers
  end

  def following
    @users = @user.following
  end

  private

  def set_user
    @user = User.find_by!(username: params[:username])
  end

  def require_own_profile
    redirect_to user_path(@user.username), alert: "Você só pode editar seu próprio perfil." unless current_user == @user
  end

  def user_params
    params.require(:user).permit(:bio)
  end
end
