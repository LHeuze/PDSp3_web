class LockerMailer < ApplicationMailer
  def locker_update_notification(locker)
    @locker = locker
    @owner_email = @locker.owner_email
    @new_password = @locker.password

    # Fetch associated model from locker administrator's user
    model = @locker.locker_administrator.user.model

    if model.present?
      # Attach images dynamically from the model's gesture_images
      @new_password.each_with_index do |gesture, index|
        # Ensure we attach the correct image corresponding to the gesture
        if index < model.gesture_images.count
          image = model.gesture_images[index]
          attachments.inline["gesture_#{gesture.downcase}.jpg"] = image.download
        end
      end
    else
      Rails.logger.warn("No model associated with the locker administrator's user.")
    end

    mail(to: @owner_email, subject: 'Your Locker Password Has Been Updated')
  end

  def locker_notification_email
    @message = params[:message]
    mail(to: params[:email], subject: "Locker Notification")
  end
end
