class RegistrationsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path, notice: "Conta criada com sucesso."
    else
      render :new, status: :bad_request    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :bio, :avatar_url)
  end
end