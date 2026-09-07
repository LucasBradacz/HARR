class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies do |t|
      t.bigint :tmdb_id
      t.string :title
      t.integer :release_year
      t.string :poster_url
      t.text :synopsis
      t.datetime :cached_at

      t.timestamps
    end
    add_index :movies, :tmdb_id, unique: true
    change_column_null :movies, :tmdb_id, false
  end
end
