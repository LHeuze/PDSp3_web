class LockerAdministrator < ApplicationRecord
    has_many :lockers, dependent: :destroy
    belongs_to :user
    belongs_to :model, optional: true
end
