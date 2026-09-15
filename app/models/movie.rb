class Movie < ApplicationRecord
  has_many :reviews, dependent: :restrict_with_error
  has_many :diary_entries, dependent: :restrict_with_error
  has_many :watchlist_items, dependent: :restrict_with_error
  has_many :movie_genres, dependent: :destroy
  has_many :genres, through: :movie_genres

  validates :tmdb_id, presence: true, uniqueness: true
  validates :title, presence: true

  def self.find_or_fetch(tmdb_id)
    find_by(tmdb_id: tmdb_id) || fetch_from_tmdb(tmdb_id)
  end

  def self.fetch_from_tmdb(tmdb_id)
    data = TmdbClient.find_movie(tmdb_id)

    movie = create!(
      tmdb_id: data["id"],
      title: data["title"],
      release_year: data["release_date"].to_s.first(4).presence&.to_i,
      poster_url: data["poster_path"].present? ? "https://image.tmdb.org/t/p/w500#{data['poster_path']}" : nil,
      synopsis: data["overview"],
      cached_at: Time.current
    )

    attach_genres(movie, data["genres"] || [])
    movie
  end

  def self.attach_genres(movie, tmdb_genres)
    tmdb_genres.each do |g|
      genre = Genre.find_or_create_by!(name: g["name"])
      movie.genres << genre unless movie.genres.include?(genre)
    end
  end
end