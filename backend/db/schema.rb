# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_15_100000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "api_token"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["api_token"], name: "index_companies_on_api_token", unique: true
    t.index ["email"], name: "index_companies_on_email", unique: true
  end

  create_table "conversations", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.datetime "created_at", null: false
    t.bigint "student_id", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id", "student_id"], name: "index_conversations_on_company_id_and_student_id", unique: true
    t.index ["company_id"], name: "index_conversations_on_company_id"
    t.index ["student_id"], name: "index_conversations_on_student_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "body", null: false
    t.bigint "conversation_id", null: false
    t.datetime "created_at", null: false
    t.string "sender_type", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.check_constraint "char_length(btrim(body)) >= 1 AND char_length(btrim(body)) <= 2000", name: "messages_body_length_check"
    t.check_constraint "sender_type::text = ANY (ARRAY['company'::character varying, 'student'::character varying]::text[])", name: "messages_sender_type_check"
  end

  create_table "students", force: :cascade do |t|
    t.string "api_token"
    t.datetime "created_at", null: false
    t.string "email"
    t.integer "graduation_year"
    t.string "name"
    t.string "password_digest"
    t.string "skills"
    t.string "university"
    t.datetime "updated_at", null: false
    t.index ["api_token"], name: "index_students_on_api_token", unique: true
    t.index ["email"], name: "index_students_on_email", unique: true
  end

  add_foreign_key "conversations", "companies", on_delete: :cascade
  add_foreign_key "conversations", "students", on_delete: :cascade
  add_foreign_key "messages", "conversations", on_delete: :cascade
end
