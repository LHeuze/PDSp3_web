class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
  
  before_create :set_default_role
  enum role: { locker_admin: 'locker_admin', superuser: 'superuser' }

  # Method to generate a JWT token for the user
  def generate_auth_token
    expiration = Rails.application.credentials.dig(:jwt, :expiration_time)&.to_i || 24.hours.from_now.to_i
    payload = { user_id: self.id, exp: expiration }
    JWT.encode(payload, Rails.application.credentials.dig(:jwt, :secret_key), 'HS256')
  end
  
  private

  def set_default_role
    self.role ||= :locker_admin
  end
end