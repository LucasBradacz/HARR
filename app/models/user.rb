class User < ApplicationRecord
  has_secure_password

  has_many :reviews, dependent: :destroy
  has_many :diary_entries, dependent: :destroy
  has_many :watchlist_items, dependent: :destroy
  has_many :watchlist_movies, through: :watchlist_items, source: :movie

  has_many :active_follows, class_name: "Follow", foreign_key: :follower_id, dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :passive_follows, class_name: "Follow", foreign_key: :followed_id, dependent: :destroy
  has_many :followers, through: :passive_follows, source: :follower

  validates :username, presence: true,
                       uniqueness: { case_sensitive: false },
                       length: { in: 3..30 },
                       format: { with: /\A[a-zA-Z0-9_]+\z/, message: "pode conter apenas letras, números e underlines" }

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    length: { maximum: 255 },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "deve ser um e-mail válido" }

  validates :password, length: { maximum: 72 }, allow_nil: true
end