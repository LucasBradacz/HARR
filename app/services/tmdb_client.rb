require "net/http"
require "uri"
require "json"

class TmdbClient
  BASE_URL = "https://api.themoviedb.org/3"

  class Error < StandardError; end

  def self.search_movies(query)
    new.search_movies(query)
  end

  def self.find_movie(tmdb_id)
    new.find_movie(tmdb_id)
  end

  def search_movies(query)
    response = get("/search/movie", query: query, language: "pt-BR")
    response["results"] || []
  end

  def find_movie(tmdb_id)
    get("/movie/#{tmdb_id}", language: "pt-BR")
  end

  private

  def get(path, params = {})
    uri = URI("#{BASE_URL}#{path}")
    uri.query = URI.encode_www_form(params.merge(api_key: api_key))

    response = Net::HTTP.get_response(uri)

    unless response.is_a?(Net::HTTPSuccess)
      raise Error, "TMDB request failed: #{response.code} #{response.message}"
    end

    JSON.parse(response.body)
  end

  def api_key
    ENV.fetch("TMDB_API_KEY") { raise Error, "TMDB_API_KEY não configurada no .env" }
  end
end