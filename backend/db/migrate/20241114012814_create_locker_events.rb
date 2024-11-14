class CreateLockerEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :locker_events do |t|
      t.integer :locker_id, null: false, index: true
      t.string :event_type, null: false
      t.datetime :event_timestamp, null: false

      t.timestamps
    end

    add_foreign_key :locker_events, :lockers
  end
end
