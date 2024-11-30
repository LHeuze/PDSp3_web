class Locker < ApplicationRecord
  validates :owner_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validate :password_gestures_valid

  after_update :send_password_change_notification, if: :password_or_owner_email_changed?

  has_many :locker_events, dependent: :destroy
  belongs_to :locker_administrator
  
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

  def password_or_owner_email_changed?
    saved_change_to_password? || saved_change_to_owner_email?
  end

  def send_password_change_notification
    return unless owner_email.present? # Skip if there's no owner email

    begin
      LockerMailer.locker_update_notification(self).deliver_now
      Rails.logger.info "Locker ##{id}: Email notification sent to #{owner_email}."
    rescue => e
      Rails.logger.error "Locker ##{id}: Failed to send email notification: #{e.message}"
    end

    begin
      MqttService.publish_locker_update(self)
      Rails.logger.info "Locker ##{id}: MQTT message sent."
    rescue => e
      Rails.logger.error "Locker ##{id}: Failed to send MQTT message: #{e.message}"
    end
  end


  def password_gestures_valid
    model = locker_administrator.model || locker_administrator.user.current_model
    unless model
      errors.add(:password, 'cannot be validated because no model is associated with the locker administrator.')
      return
    end
  
    valid_gestures = model.gestures.pluck(:name)
    if password.any? { |gesture| !valid_gestures.include?(gesture) }
      errors.add(:password, 'contains gestures not present in the current model')
    end
  end
  
end
