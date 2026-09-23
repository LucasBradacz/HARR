Rails.application.routes.draw do
  root "movies#index"

  resources :movies, only: [:index, :show] do
    resources :reviews, only: [:create]
    resources :diary_entries, only: [:create, :edit, :update, :destroy]
    resource :watchlist_item, only: [:create, :destroy]
  end

  resources :reviews, only: [:edit, :update, :destroy]

  get "watchlist", to: "watchlist_items#index", as: :watchlist

  get "/login", to: "sessions#new", as: :new_session
  post "/login", to: "sessions#create", as: :session
  delete "/logout", to: "sessions#destroy", as: :logout

  resource :registration, only: [:new, :create]

  resources :users, only: [:show], param: :username

  post "follows/:followed_id", to: "follows#create", as: :follow
  delete "follows/:followed_id", to: "follows#destroy", as: :unfollow

  get "up" => "rails/health#show", as: :rails_health_check
end