class CreateJobPostings < ActiveRecord::Migration[8.1]
  def change
    create_table :job_postings do |t|
      t.references :company, null: false, foreign_key: { on_delete: :cascade }
      t.string :title, null: false
      t.text :description, null: false
      t.string :location
      t.string :compensation
      t.string :period
      t.string :required_skills

      t.timestamps
    end

    add_check_constraint :job_postings,
      "char_length(btrim(title)) BETWEEN 1 AND 200",
      name: "job_postings_title_length_check"
    add_check_constraint :job_postings,
      "char_length(btrim(description)) BETWEEN 1 AND 10000",
      name: "job_postings_description_length_check"
  end
end
