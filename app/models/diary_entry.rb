class DiaryEntry < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :watched_on, presence: true
  validate :watched_on_cannot_be_in_the_future

  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_nil: true

  private

  def watched_on_cannot_be_in_the_future
    if watched_on.present? && watched_on > Date.current
      errors.add(:watched_on, "não pode ser uma data futura")
    end
  end
end