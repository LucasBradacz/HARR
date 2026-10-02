class AddReviewToDiaryEntries < ActiveRecord::Migration[8.1]
  def change
    add_reference :diary_entries, :review, foreign_key: true, null: true
  end
end
