class Review < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :body, length: { maximum: 2000 }
  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_nil: true

  after_create :log_in_diary

  private

  def log_in_diary
    user.diary_entries.create(
      movie: movie,
      rating: rating,
      watched_on: Date.current
    )
  end
end
