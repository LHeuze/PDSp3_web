class LockerEvent < ApplicationRecord
  belongs_to :locker

  validates :event_type, inclusion: { in: %w[opened closed] }

  after_create :update_locker_timestamps

  private

  def update_locker_timestamps
    case event_type
    when "opened"
      locker.update(last_opened: event_timestamp)
    when "closed"
      locker.update(last_closed: event_timestamp)
    end
  end
end
