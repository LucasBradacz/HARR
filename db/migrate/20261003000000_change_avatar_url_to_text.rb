class ChangeAvatarUrlToText < ActiveRecord::Migration[8.1]
  def change
    change_column :users, :avatar_url, :text
  end
end
