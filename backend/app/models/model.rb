# app/models/model.rb
class Model < ApplicationRecord
  belongs_to :user
  has_one_attached :file
  has_many_attached :gesture_images

  validates :name, presence: true
  validates :gestures, presence: true, length: { is: 6 }
  validate :validate_gesture_images
  validate :validate_file

  private

  def validate_gesture_images
    if gesture_images.attached?
      if gesture_images.count != 6
        errors.add(:gesture_images, "deben ser exactamente 6 imágenes")
      end
      gesture_images.each do |image|
        unless image.content_type.starts_with?("image/")
          errors.add(:gesture_images, "deben ser archivos de imagen válidos")
        end
      end
    else
      errors.add(:gesture_images, "son obligatorias")
    end
  end

  def validate_file
    if file.attached?
    else
      errors.add(:file, "es obligatorio")
    end
  end
end
