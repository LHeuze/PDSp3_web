class CreateLockers < ActiveRecord::Migration[7.1]
  def change
    create_table :lockers do |t|
      t.string :number
      t.text :password, array: true, default: []
      t.references :owner, foreign_key: { to_table: :users }
      t.string :status, default: "locked"
      t.datetime :last_accessed
      t.string :model_version
      t.integer :access_count, default: 0
      t.boolean :synced, default: true

      t.timestamps
    end

    add_index :lockers, :number, unique: true
  end
end
