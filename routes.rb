Rails.application.routes.draw do
  resources :movies, only: [] do
    resources :reviews, only: [:index, :create]
  end

  resources :reviews, only: [:show, :update, :destroy]
end