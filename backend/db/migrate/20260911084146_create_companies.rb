class CreateCompanies < ActiveRecord::Migration[8.1]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.string :api_token

      t.timestamps
    end
    add_index :companies, :email, unique: true
    add_index :companies, :api_token, unique: true
  end
end
