class LockerMailer < ApplicationMailer
  def locker_update_notification(locker)
    @locker = locker
    @owner_email = @locker.owner_email
    @new_password = @locker.password
    mail(to: @owner_email, subject: 'Your Locker Password Has Been Updated')
  end
end
