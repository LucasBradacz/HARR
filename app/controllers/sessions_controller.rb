class SessionsController < ApplicationController
  def new; end

  def create
    user = User.find_by(username: params[:username])

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path, notice: "Login realizado com sucesso!"
    else
      flash.now[:alert] = "Usuário ou senha incorretos."
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "Você saiu."
  end
end