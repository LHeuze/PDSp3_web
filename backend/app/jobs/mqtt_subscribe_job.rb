class MqttSubscribeJob < ApplicationJob
  queue_as :default

  def perform
    MqttService.subscribe_to_locker_open_events
  end
end
