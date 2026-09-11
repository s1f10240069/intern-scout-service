class CreateInterns < ActiveRecord::Migration[8.1]
  def change
    create_table :interns do |t|
      t.string :name
      t.string :email
      t.string :university
      t.integer :graduation_year
      t.string :skills

      t.timestamps
    end

    add_index :interns, :email, unique: true
  end
end
