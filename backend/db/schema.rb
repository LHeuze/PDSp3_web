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

ActiveRecord::Schema[7.1].define(version: 2024_11_25_211320) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "locker_administrators", force: :cascade do |t|
    t.string "name", null: false
    t.string "base_topic"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "locker_events", force: :cascade do |t|
    t.integer "locker_id", null: false
    t.string "event_type", null: false
    t.datetime "event_timestamp", precision: nil, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["locker_id"], name: "index_locker_events_on_locker_id"
  end

  create_table "lockers", force: :cascade do |t|
    t.string "number"
    t.text "password", default: [], array: true
    t.string "owner_email", null: false
    t.string "status", default: "locked"
    t.datetime "last_opened"
    t.datetime "last_closed"
    t.string "model_version"
    t.integer "access_count", default: 0
    t.boolean "synced", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "locker_administrator_id"
    t.index ["locker_administrator_id"], name: "index_lockers_on_locker_administrator_id"
    t.index ["number"], name: "index_lockers_on_number", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "locker_events", "lockers"
  add_foreign_key "lockers", "locker_administrators"
end
