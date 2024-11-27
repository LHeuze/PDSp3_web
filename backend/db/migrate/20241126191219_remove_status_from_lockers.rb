class RemoveStatusFromLockers < ActiveRecord::Migration[7.1]
  def change
    remove_column :lockers, :status, :string
  end
end
