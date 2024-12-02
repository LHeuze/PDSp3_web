# app/models/model.rb
class Model < ApplicationRecord
  belongs_to :user
  has_one_attached :file
  has_many :gestures, dependent: :destroy
  has_many :locker_administrators, dependent: :nullify
  validates :name, presence: true
  validates :file, presence: true, on: :create

  after_update :trigger_locker_updates, if: :name_or_file_changed?

  private

  def name_or_file_changed?
    saved_change_to_name? || saved_change_to_file_attachment?
  end

  def saved_change_to_file_attachment?
    file.attachment&.saved_change_to_blob_id?
  end

  def trigger_locker_updates
    # Find all lockers associated with this model via locker administrators
    lockers = Locker.joins(:locker_administrator)
                    .where(locker_administrators: { model_id: id })

    lockers.each do |locker|
      # Update the locker to trigger the after_update callback
      locker.touch
    end
  end
end
