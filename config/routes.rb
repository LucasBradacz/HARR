Rails.application.routes.draw do
  get "registrations/new"
  get "registrations/create"
  get "sessions/new"
  get "sessions/create"
  get "sessions/destroy"
  get "follows/create"
  get "follows/destroy"
  get "watchlist_items/create"
  get "watchlist_items/destroy"
  get "diary_entries/create"
  get "diary_entries/edit"
  get "diary_entries/update"
  get "diary_entries/destroy"
  get "reviews/create"
  get "reviews/edit"
  get "reviews/update"
  get "reviews/destroy"
  get "movies/index"
  get "movies/show"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
