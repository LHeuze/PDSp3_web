class Locker < ApplicationRecord
  validates :owner_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
