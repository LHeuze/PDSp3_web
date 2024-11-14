class Locker < ApplicationRecord
  validates :owner_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  after_update :notify_password_change, if: :saved_change_to_password?

  has_many :locker_events, dependent: :destroy

  def formatted_last_opened
    last_opened&.iso8601
  end
  
  def formatted_last_closed
    last_closed&.iso8601
  end

  def log_open_event
    locker_events.create(event_type: "opened", event_timestamp: Time.current)
  end

  def log_close_event
    locker_events.create(event_type: "closed", event_timestamp: Time.current)
  end
  private

  def notify_password_change
    MqttService.publish_locker_update(self)
  end
end
