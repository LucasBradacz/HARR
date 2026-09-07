# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_07_210308) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "diary_entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "movie_id", null: false
    t.integer "rating"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.date "watched_on"
    t.index ["movie_id"], name: "index_diary_entries_on_movie_id"
    t.index ["user_id"], name: "index_diary_entries_on_user_id"
  end

  create_table "follows", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "followed_id", null: false
    t.bigint "follower_id", null: false
    t.datetime "updated_at", null: false
    t.index ["followed_id"], name: "index_follows_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_follows_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_follows_on_follower_id"
    t.check_constraint "follower_id <> followed_id", name: "follower_not_followed"
  end

  create_table "genres", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "movie_genres", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "genre_id", null: false
    t.bigint "movie_id", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_movie_genres_on_genre_id"
    t.index ["movie_id"], name: "index_movie_genres_on_movie_id"
  end

  create_table "movies", force: :cascade do |t|
    t.datetime "cached_at"
    t.datetime "created_at", null: false
    t.string "poster_url"
    t.integer "release_year"
    t.text "synopsis"
    t.string "title"
    t.bigint "tmdb_id", null: false
    t.datetime "updated_at", null: false
    t.index ["tmdb_id"], name: "index_movies_on_tmdb_id", unique: true
  end

  create_table "reviews", force: :cascade do |t|
    t.text "body"
    t.boolean "contains_spoilers"
    t.datetime "created_at", null: false
    t.bigint "movie_id", null: false
    t.integer "rating"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["movie_id"], name: "index_reviews_on_movie_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar_url"
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.string "username"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "watchlist_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "movie_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["movie_id"], name: "index_watchlist_items_on_movie_id"
    t.index ["user_id", "movie_id"], name: "index_watchlist_items_on_user_id_and_movie_id", unique: true
    t.index ["user_id"], name: "index_watchlist_items_on_user_id"
  end

  add_foreign_key "diary_entries", "movies"
  add_foreign_key "diary_entries", "users"
  add_foreign_key "follows", "users", column: "followed_id"
  add_foreign_key "follows", "users", column: "follower_id"
  add_foreign_key "movie_genres", "genres"
  add_foreign_key "movie_genres", "movies"
  add_foreign_key "reviews", "movies"
  add_foreign_key "reviews", "users"
  add_foreign_key "watchlist_items", "movies"
  add_foreign_key "watchlist_items", "users"
end
