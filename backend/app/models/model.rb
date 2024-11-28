# app/models/model.rb
class Model < ApplicationRecord
  belongs_to :user
  has_one_attached :file
  has_many :gestures, dependent: :destroy

  validates :name, presence: true
  validate :validate_file

  private

  def validate_file
    if file.attached?
    else
      errors.add(:file, "es obligatorio")
    end
  end
end
