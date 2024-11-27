class CreateLockerAdministrator < ActiveRecord::Migration[7.1]
  def change
    create_table :locker_administrators do |t|
      t.string :name, null: false
      t.string :base_topic
      t.timestamps
    end
  end
end
