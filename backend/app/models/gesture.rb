class Gesture < ApplicationRecord
    belongs_to :model
    has_one_attached :image

    validates :name, presence: true
    validates :image, presence: true
  end
  