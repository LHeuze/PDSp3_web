require 'mqtt'

class MqttService
  def self.publish_locker_update(locker)
    # Set MQTTX public broker details
    host = 'broker.emqx.io'
    port = 8883  # or 8883 if you want to use SSL/TLS

    # Establish MQTT connection without authentication
    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: (port == 8883) # Enable SSL only if using port 8883
    )

    # Define the topic and message
    topic = "lockers/update"
    message = { number: locker.number, new_password: locker.password }.to_json

    # Publish the message
    client.publish(topic, message)

    # Disconnect
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

    topic = "lockers/status"
    client.subscribe(topic)

    # Listen for messages
    client.get do |received_topic, message|
      data = JSON.parse(message)

      # Use the new format with locker_id and status
      locker_id = data["locker_id"]
      status = data["status"]

      if locker_id && status
        locker = Locker.find_by(id: locker_id)

        if locker
          event_type = status == "opened" ? "opened" : "closed"
          LockerEvent.create!(locker: locker, event_type: event_type, event_timestamp: Time.current)
          action_message = status == "opened" ? "Su casillero ha sido abierto." : "Su casillero ha sido cerrado."
          send_email_to_owner(locker.owner_email, action_message)
        end
      else
        Rails.logger.error "Invalid message format received: #{message}"
      end
    end
  end

  def self.send_email_to_owner(email, message)
    # Example email notification method
    LockerMailer.with(email: email, message: message).locker_notification_email.deliver_now
  end
end
