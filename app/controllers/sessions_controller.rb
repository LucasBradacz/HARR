class SessionsController < ApplicationController
  before_action :redirect_if_logged_in, only: [:new, :create]

  def new; end

  def create
    user = User.find_by(username: params[:username])

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to session.delete(:return_to) || root_path, notice: "Login realizado com sucesso!"
    else
      flash.now[:alert] = "Usuário ou senha incorretos."
      render :new, status: :bad_request
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "Você saiu."
  end
end
