class Review < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :body, length: { maximum: 2000 }

  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_nil: true

  validates :user_id, uniqueness: { scope: :movie_id, message: "já avaliou este filme" }
end