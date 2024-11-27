class AddLockerAdministratorToLockers < ActiveRecord::Migration[7.1]
  def change
    add_reference :lockers, :locker_administrator, null: true, foreign_key: true
  end
end
