require 'mqtt'

class MqttService
  def self.publish_locker_update(locker)
    # Set MQTTX public broker details
    host = 'broker.emqx.io'
    port = 1883  # or 8883 if you want to use SSL/TLS

    # Establish MQTT connection without authentication
    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: (port == 8883) # Enable SSL only if using port 8883
    )

    # Define the topic and message
    topic = "lockers/#{locker.number}/update"
    message = { number: locker.number, new_password: locker.password }.to_json

    # Publish the message
    client.publish(topic, message)

    # Disconnect
    client.disconnect
  end

  def self.subscribe_to_locker_open_events
    host = 'broker.emqx.io'
    port = 1883  # Use 8883 if you want SSL/TLS

    client = MQTT::Client.connect(
      host: host,
      port: port,
      ssl: (port == 8883)
    )

    # Subscribe to a topic (assuming all open events are published on this topic)
    topic = "lockers/+/opened"

    client.subscribe(topic)

    # Listen for messages
    client.get do |received_topic, message|
      data = JSON.parse(message)

      # Ensure the message action is locker opened
      if data["action"] == "locker_opened"
        locker_number = data["number"]
        locker = Locker.find_by(number: locker_number)

        if locker
          send_email_to_owner(locker.owner_email, "Your locker has been opened.")
        end
      end
    end
  end

  def self.send_email_to_owner(email, message)
    # Example email notification method
    LockerMailer.with(email: email, message: message).locker_notification_email.deliver_now
  end
end
