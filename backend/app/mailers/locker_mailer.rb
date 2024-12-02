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

      @gesture_images = []

      @new_password.each_with_index do |gesture_name, index|
        gesture = gesture_hash[gesture_name]
        if gesture&.image&.attached?
          # Generate the public URL for the image
          image_url = Rails.application.routes.url_helpers.rails_blob_url(gesture.image, only_path: false)
          # Add the gesture details to the array for the view
          @gesture_images << {
            name: gesture_name,
            index: index,
            url: image_url
          }
        else
          Rails.logger.warn("No image found for gesture '#{gesture_name}'")
        end
      end

    else
      Rails.logger.warn("No model associated with the locker administrator's user.")
    end

    mail(
      to: @owner_email,
      subject: 'La contraseña de tu casillero ha sido actualizada'
    ) do |format|
      format.html
    end
  end

  def locker_notification_email
    @message = params[:message]
    mail(to: params[:email], subject: 'Locker Notification')
  end
end
