# app/models/gesture.rb
class Gesture < ApplicationRecord
  belongs_to :model
  has_one_attached :image

  validates :name, presence: true
  validates :image, presence: true

  after_update :update_lockers_with_changed_gesture

  private

  def update_lockers_with_changed_gesture
    if saved_change_to_name?
      old_name, new_name = saved_change_to_name

      # Find all lockers whose passwords include the old gesture name
      lockers = Locker.joins(locker_administrator: :model)
                .where(locker_administrators: { model_id: model.id })
                .where("? = ANY(password)", old_name)


      lockers.each do |locker|
        begin
          updated_password = locker.password.map { |gesture_name| gesture_name == old_name ? new_name : gesture_name }
          locker.update!(password: updated_password)
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error "Failed to update Locker ##{locker.id}: #{e.message}"
          # Handle errors as needed
        end
      end
    elsif saved_change_to_image_attachment?
      # If only the image changed, notify the locker owners
      notify_locker_owners_of_image_change
    end
  end

  def notify_locker_owners_of_image_change
    # Find all lockers whose passwords include the gesture name
    lockers = Locker.joins(locker_administrator: :model)
                    .where(locker_administrators: { model_id: model.id })
                    .where("password @> ARRAY[?]::varchar[]", [name])

    lockers.each do |locker|
      # Touch the locker to trigger notifications
      locker.touch
    end
  end
end
