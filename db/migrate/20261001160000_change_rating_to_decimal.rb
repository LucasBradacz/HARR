class ChangeRatingToDecimal < ActiveRecord::Migration[8.1]
  def up
    change_column :reviews, :rating, :decimal, precision: 3, scale: 1
    change_column :diary_entries, :rating, :decimal, precision: 3, scale: 1
  end

  def down
    change_column :reviews, :rating, :integer
    change_column :diary_entries, :rating, :integer
  end
end
