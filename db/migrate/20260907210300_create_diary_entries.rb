class CreateDiaryEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :diary_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :movie, null: false, foreign_key: true
      t.integer :rating
      t.date :watched_on

      t.timestamps
    end
  end
end
