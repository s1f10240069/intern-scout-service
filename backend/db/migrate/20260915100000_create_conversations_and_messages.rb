class CreateConversationsAndMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :conversations do |t|
      t.references :company, null: false, foreign_key: { on_delete: :cascade }
      t.references :student, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
    add_index :conversations, [ :company_id, :student_id ], unique: true

    create_table :messages do |t|
      t.references :conversation, null: false, foreign_key: { on_delete: :cascade }
      t.string :sender_type, null: false
      t.text :body, null: false

      t.timestamps
    end
    add_check_constraint :messages,
      "sender_type IN ('company', 'student')",
      name: "messages_sender_type_check"
    add_check_constraint :messages,
      "char_length(btrim(body)) BETWEEN 1 AND 2000",
      name: "messages_body_length_check"
  end
end
