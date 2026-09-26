class DiaryEntry < ApplicationRecord
  belongs_to :user
  belongs_to :movie

  validates :watched_at, presence: true
  validate :watched_at_cannot_be_in_the_future

  validates :rating, numericality: { only_integer: true, in: 1..5 }, allow_nil: true
  validates :notes, length: { maximum: 1000 }, allow_blank: true

  private

  def watched_at_cannot_be_in_the_future
    if watched_at.present? && watched_at > Date.current
      errors.add(:watched_at, "não pode ser uma data futura")
    end
  end
end