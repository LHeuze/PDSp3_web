class AddStatusToLockerAdministrator < ActiveRecord::Migration[7.1]
  def change
    add_column :locker_administrators, :status, :string, default: 'not conected'
  end
end
