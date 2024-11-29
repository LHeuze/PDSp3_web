class LockerMailer < ApplicationMailer
  def locker_update_notification(locker)
    @locker = locker
    @owner_email = @locker.owner_email
    @new_password = @locker.password  # Should be an array of gesture names

    # Fetch associated model from locker administrator's user
    model = @locker.locker_administrator.user.model

    if model.present?
      # Map gesture names to Gesture objects
      gesture_hash = model.gestures.includes(image_attachment: :blob).index_by(&:name)

      # Initialize an empty array to store image URLs
      @gesture_images = []

      @new_password.each_with_index do |gesture_name, index|
        gesture = gesture_hash[gesture_name]
        if gesture && gesture.image.attached?
          # Attach the gesture image to the email
          image = gesture.image.download
          attachments.inline["gesture_#{gesture_name.downcase}.jpg"] = { 
            content: image,
            mime_type: 'image/jpeg',
            content_id: "gesture_#{gesture_name.downcase}.jpg"
          }


          # Add the gesture image to the array of image URLs
          @gesture_images << { name: gesture_name, index: index }
        else
          Rails.logger.warn("No image found for gesture '#{gesture_name}'")
        end
      end
    else
      Rails.logger.warn("No model associated with the locker administrator's user.")
    end

    # Send email with HTML body including gesture images
    mail(to: @owner_email, subject: 'Your Locker Password Has Been Updated') do |format|
      format.html do
        render html: build_email_body.html_safe
      end
    end
  end

  def locker_notification_email
    @message = params[:message]
    mail(to: params[:email], subject: "Locker Notification")
  end

  private

  def build_email_body
    body = "<h1>La contraseña de tu casillero ha sido actualizada</h1>"
    body += "<p>Tu casillero (Número: <%= @locker.number %>) ha sido modificado y tiene nueva contraseña.</p>"
    
    body += <<-HTML
      <h2>Instrucciones</h2>
      <p>1. Para abrir el casillero, acerca la mano al sensor en la caja para iniciar la interacción.</p>
      <p>2. Luego selecciona el casillero que quieres abrir ({1, 2, 3}) usando el gesto correspondiente.</p>
      <p>3. Finalmente realizar los gestos indicados abajo con intermitencia de 4 segundos :</p>
    HTML
    # Loop through gesture images and embed them inline
    @gesture_images.each do |gesture|
      # Make sure the CID matches the inline attachment's name
      body += <<-HTML
        <p><strong>Gesto #{gesture[:index] + 1}:</strong></p>
        <img src="cid:gesture_#{gesture[:name].downcase}.jpg" alt="Gesture #{gesture[:index] + 1}" style="max-width: 100%; height: auto;" />
      HTML
    end
  
    body
  end
  
end
