class Locker < ApplicationRecord
  validates :owner_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  after_update :notify_password_change, if: :saved_change_to_password?

  private

  def notify_password_change
    MqttService.publish_locker_update(self)
  end
end
