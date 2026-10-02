class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  stale_when_importmap_changes

  helper_method :current_user, :logged_in?

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    unless logged_in?
      session[:return_to] = request.fullpath
      redirect_to new_session_path, alert: "Você precisa estar logado."
    end
  end

  def redirect_if_logged_in
    redirect_to root_path if logged_in?
  end

  def render_not_found
    render "errors/not_found", status: :not_found
  end
end
