class CreateReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :movie, null: false, foreign_key: true
      t.integer :rating
      t.text :body
      t.boolean :contains_spoilers

      t.timestamps
    end
  end
end
