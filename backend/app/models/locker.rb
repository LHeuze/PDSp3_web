# app/models/locker.rb
class Locker < ApplicationRecord
  belongs_to :locker_administrator
  has_many :locker_events, dependent: :destroy

  validates :owner_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  after_update :send_password_change_notification, if: :should_notify_owner?

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

  def should_notify_owner?
    password_or_owner_email_changed? || previous_changes.key?(:updated_at)
  end

  def password_or_owner_email_changed?
    saved_change_to_password? || saved_change_to_owner_email?
  end

  def send_password_change_notification
    return unless owner_email.present?

    # Existing email and MQTT notifications
    LockerMailer.locker_update_notification(self).deliver_later
    MqttService.publish_locker_update(self)
  end

end
