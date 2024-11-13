class LockerMailer < ApplicationMailer
  def locker_update_notification(locker)
    @locker = locker
    @owner_email = @locker.owner_email
    @new_password = @locker.password
  
    locker_number_gesture_map = { 1 => 'c', 2 => 'fist', 3 => 'five' }
    locker_number_as_int = @locker.number.to_i
    @locker_number_gesture = locker_number_gesture_map[locker_number_as_int]
  
    if @locker_number_gesture
      attachments.inline["locker_select_#{@locker_number_gesture}.jpg"] = File.read("app/assets/images/gestures/#{@locker_number_gesture}.jpg")
    end
  
    attached_gestures = []
    @new_password.each do |gesture|
      gesture_downcased = gesture.downcase
      unless attached_gestures.include?(gesture_downcased)
        attachments.inline["#{gesture_downcased}.jpg"] = File.read("app/assets/images/gestures/#{gesture_downcased}.jpg")
        attached_gestures << gesture_downcased
      end
    end
  
    mail(to: @owner_email, subject: 'Your Locker Password Has Been Updated')
  end
  
  

  def locker_notification_email
    @message = params[:message]
    mail(to: params[:email], subject: "Locker Notification")
  end
end
