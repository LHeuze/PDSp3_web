class AddAmountOfLockersToLockerAdministrator < ActiveRecord::Migration[7.1]
  def change
    add_column :locker_administrators, :amount_of_lockers, :integer
  end
end
