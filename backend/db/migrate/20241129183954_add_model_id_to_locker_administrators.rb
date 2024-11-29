class AddModelIdToLockerAdministrators < ActiveRecord::Migration[7.1]
  def change
    add_column :locker_administrators, :model_id, :bigint
  end
end
