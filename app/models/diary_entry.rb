class DiaryEntry < ApplicationRecord
  belongs_to :user
  belongs_to :movie
  belongs_to :review, optional: true

  validates :watched_on, presence: true
  validate :watched_on_cannot_be_in_the_future

  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }, allow_nil: true

  private

  def watched_on_cannot_be_in_the_future
    if watched_on.present? && watched_on > Date.current
      errors.add(:watched_on, "não pode ser uma data futura")
    end
  end
end
