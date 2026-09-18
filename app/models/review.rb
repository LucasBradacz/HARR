class Review < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_nil: true
end