class LockerAdministrator < ApplicationRecord
    has_many :lockers
    belongs_to :user
    belongs_to :model, optional: true
end
