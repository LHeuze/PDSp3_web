class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
  
  before_create :set_default_role
  enum role: { locker_admin: 'locker_admin', superuser: 'superuser' }

  private

  def set_default_role
    self.role ||= :locker_admin
  end
end
