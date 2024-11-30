class LockerMailer < ApplicationMailer
  def locker_update_notification(locker)
    @locker = locker
    @owner_email = @locker.owner_email
    @new_password = @locker.password  # Should be an array of gesture names

    # Fetch associated model from locker administrator's user
    model = @locker.locker_administrator.model || @locker.locker_administrator.user.current_model

    if model.present?
      # Map gesture names to Gesture objects
      gesture_hash = model.gestures.includes(image_attachment: :blob).index_by(&:name)

      # Prepare gesture images for the email
      @gesture_images = []

      @new_password.each_with_index do |gesture_name, index|
        gesture = gesture_hash[gesture_name]
        if gesture && gesture.image.attached?
          # Attach the gesture image to the email
          attachments.inline["gesture_#{gesture_name.downcase}.jpg"] = gesture.image.blob.download

          # Add the gesture name and image filename to the array
          @gesture_images << {
            name: gesture_name,
            index: index,
            filename: "gesture_#{gesture_name.downcase}.jpg"
          }
        else
          Rails.logger.warn("No image found for gesture '#{gesture_name}'")
        end
      end
    else
      Rails.logger.warn("No model associated with the locker administrator's user.")
    end

    mail(to: @owner_email, subject: 'La contraseña de tu casillero ha sido actualizada')
  end

  def locker_notification_email
    @message = params[:message]
    mail(to: params[:email], subject: 'Locker Notification')
  end  
  
end
