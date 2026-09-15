class RenameInternsToStudents < ActiveRecord::Migration[8.1]
  def up
    rename_table :interns, :students
  end

  def down
    rename_table :students, :interns
  end
end
