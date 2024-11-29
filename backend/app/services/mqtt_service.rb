require 'mqtt'

class MqttService
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
  
    topic = locker_admin.base_topic
    message = { 
      locker_admin_id: locker_admin.id, 
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
  
    # Subscribe to all locker administrators' base topics
    LockerAdministrator.find_each do |admin|
      client.subscribe(admin.base_topic)
    end
  
    # Listen for messages
    client.get do |received_topic, message|
      data = JSON.parse(message)
  
      locker_admin_id = data["locker_admin_id"]
      locker_number = data["locker_number"]
      status = data["status"]
  
      if locker_admin_id && locker_number && status
        locker_admin = LockerAdministrator.find_by(id: locker_admin_id)
        locker = locker_admin&.lockers&.find_by(number: locker_number)
  
        if locker
          event_type = status == "opened" ? "opened" : "closed"
          LockerEvent.create!(locker: locker, event_type: event_type, event_timestamp: Time.current)
          action_message = status == "opened" ? "Su casillero ha sido abierto." : "Su casillero ha sido cerrado."
          send_email_to_owner(locker.owner_email, action_message)
        else
          Rails.logger.error "Locker not found for admin ID #{locker_admin_id} and locker number #{locker_number}"
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
