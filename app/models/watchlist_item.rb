class WatchlistItem < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :user_id, uniqueness: { scope: :movie_id, message: "já adicionou este filme à watchlist" }
end