class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
  
  before_create :set_default_role
  enum role: { locker_admin: 'locker_admin', superuser: 'superuser' }
  has_many :locker_administrators
  has_many :models

  # Method to generate a JWT token for the user
  def generate_auth_token
    exp = Time.now.to_i + 7 * 24 * 3600 # 7 days from now
    payload = { user_id: id, exp: exp }
    JWT.encode(payload, Rails.application.credentials.dig(:jwt, :secret_key), 'HS256')
  end
  
  private

  def set_default_role
    self.role ||= :locker_admin
  end
end