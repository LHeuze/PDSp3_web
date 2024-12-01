class MqttService
  require 'mqtt'
  def self.generate_presigned_url(file)
    Rails.application.routes.url_helpers.rails_blob_url(file, host: 'https://pdsp3-web.onrender.com', protocol: 'https')
  end
  def self.publish_locker_update(locker)
    locker_admin = locker.locker_administrator
    raise "Locker must belong to a LockerAdministrator" unless locker_admin
  
    host = 'broker.emqx.io'
    port = 8883  # Use SSL/TLS
  
    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: true
    )
    topic = "#{locker_admin.base_topic}update"
    message = { 
      locker_number: locker.number, 
      new_password: locker.password 
    }.to_json
  
    client.publish(topic, message)
    client.disconnect
  end
  

  def self.subscribe_to_locker_open_events
    host = 'broker.emqx.io'
    port = 8883  # SSL/TLS enabled port
  
    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: true
    )
  
    Rails.logger.info "Connected to MQTT broker at #{host}:#{port}"
  
    # Subscribe to all "base_topic/interaction" topics
    LockerAdministrator.find_each do |admin|
      topic = "#{admin.base_topic}interaction"
      Rails.logger.info "Subscribing to topic: #{topic}"
      client.subscribe(topic)
    end
  
    # Listen for messages
    client.get do |received_topic, message|
      Rails.logger.info "Received message on topic: #{received_topic}"
      data = JSON.parse(message)
  
      # Extract locker_number and status from the message
      locker_number = data["locker_number"]
      status = data["status"]
  
      # Find the locker administrator by matching the base_topic
      base_topic = received_topic.split('/interaction').first + '/'  # Extract base_topic from received_topic
      locker_admin = LockerAdministrator.find_by(base_topic: base_topic)
  
      if locker_admin && locker_number && status
        # Find the locker associated with the locker administrator
        locker = locker_admin.lockers.find_by(number: locker_number)
  
        if locker
          event_type = status == "opened" ? "opened" : "closed"
          LockerEvent.create!(locker: locker, event_type: event_type, event_timestamp: Time.current)
          action_message = status == "opened" ? "Su casillero ha sido abierto." : "Su casillero ha sido cerrado."
          send_email_to_owner(locker.owner_email, action_message)
        else
          Rails.logger.error "Locker not found for locker number #{locker_number} under base_topic #{base_topic}"
        end
      else
        Rails.logger.error "Invalid message or no locker administrator found for topic: #{received_topic}"
      end
    end
  end
  
  
  
  def self.send_email_to_owner(email, message)
    LockerMailer.with(email: email, message: message).locker_notification_email.deliver_now
  end
  
  def self.publish_model_file(locker_admin, model)
    raise "LockerAdministrator must be provided" unless locker_admin
    raise "Model must be provided" unless model
  
    # Generate pre-signed URL
    file_url = generate_presigned_url(model.file)
  
    host = 'broker.emqx.io'
    port = 8883
  
    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: true
    )
  
    topic = "#{locker_admin.base_topic}model"
  
    # Send only the file URL
    message = {
      file_url: file_url
    }.to_json
  
    client.publish(topic, message)
    Rails.logger.info "Published file URL to topic #{topic}"
    client.disconnect
  rescue => e
    Rails.logger.error "Failed to publish model file: #{e.message}"
  end
  
  
end
