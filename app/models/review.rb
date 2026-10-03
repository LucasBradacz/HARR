class Review < ApplicationRecord
  belongs_to :user
  belongs_to :movie
  has_one :diary_entry, dependent: :destroy

  # Recebe a data assistida do formulário — não é coluna do banco
  attr_accessor :watched_on

  validates :body, length: { maximum: 15000 }
  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }, allow_nil: true

  after_create :log_in_diary

  private

  def log_in_diary
    build_diary_entry(
      user: user,
      movie: movie,
      rating: rating,
      watched_on: watched_on.presence || Date.current
    ).save
  end
end
