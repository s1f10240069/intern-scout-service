class AddAuthColumnsToInterns < ActiveRecord::Migration[8.1]
  def change
    add_column :interns, :password_digest, :string
    add_column :interns, :api_token, :string
    add_index :interns, :api_token, unique: true
  end
end
