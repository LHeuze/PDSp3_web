class CreateLockers < ActiveRecord::Migration[7.1]
  def change
    create_table :lockers do |t|
      t.string :number
      t.text :password, array: true, default: []
      t.string :owner_email, null: false
      t.datetime :last_opened
      t.datetime :last_closed
      t.integer :access_count, default: 0
      t.references :locker_administrator, foreign_key: true
      
      t.timestamps
    end

    add_index :lockers, [:number, :locker_administrator_id], unique: true
  end
end
