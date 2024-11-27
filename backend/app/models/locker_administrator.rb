class LockerAdministrator < ApplicationRecord
    has_many :lockers
    belongs_to :user
end
