class CreateLockers < ActiveRecord::Migration[7.1]
  def change
    create_table :lockers do |t|
      t.string :number
      t.text :password, array: true, default: []
      t.string :owner_email, null: false
      t.string :status, default: "locked"
      t.datetime :last_opened
      t.datetime :last_closed
      t.string :model_version
      t.integer :access_count, default: 0
      t.boolean :synced, default: true

      t.timestamps
    end

    add_index :lockers, :number, unique: true
  end
end
