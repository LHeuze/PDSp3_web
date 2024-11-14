Rails.application.config.after_initialize do
    MqttSubscribeJob.perform_later unless Rails.env.test?
  end
  