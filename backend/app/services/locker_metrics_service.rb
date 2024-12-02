class LockerMetricsService
  def self.metrics_for_admin(admin)
    start_date = 7.days.ago.beginning_of_day
    events = LockerEvent.where(event_timestamp: start_date..Time.current)
  
    admin.lockers.each_with_object({}) do |locker, metrics|
      locker_events = events.where(locker_id: locker.id)
      metrics[locker.name] = {
        total_openings_per_day: total_openings_per_day(locker_events),
        most_common_opening_hour: most_common_opening_hour(locker_events),
        average_interval_between_openings: calculate_average_interval(locker_events),
        average_open_time: calculate_average_open_time(locker_events)
      }
    end
  end
  
  def self.metrics_for_last_7_days
    start_date = 7.days.ago.beginning_of_day
    events = LockerEvent.where(event_timestamp: start_date..Time.current)
  
    locker_admins = LockerAdministrator.includes(:lockers).all
  
    locker_admins.each_with_object({}) do |admin, result|
      result[admin.name] = admin.lockers.each_with_object({}) do |locker, locker_metrics|
        locker_events = events.where(locker_id: locker.id)
        locker_metrics[locker.name] = {
          total_openings_per_day: total_openings_per_day(locker_events),
          most_common_opening_hour: most_common_opening_hour(locker_events),
          average_interval_between_openings: calculate_average_interval(locker_events),
          average_open_time: calculate_average_open_time(locker_events)
        }
      end
    end
  end
  
  def self.total_openings_per_day(events)
    events.where(event_type: "opened")
          .group("DATE(event_timestamp)").count
  end
  
  def self.most_common_opening_hour(events)
    hour_count = events.where(event_type: "opened")
                       .group("EXTRACT(HOUR FROM event_timestamp)")
                       .order("count_all DESC")
                       .count
    hour_count.first&.first&.to_i  # Returns the hour as an integer
  end
  
  def self.calculate_average_interval(events)
    timestamps = events.where(event_type: "opened").order(:event_timestamp).pluck(:event_timestamp)
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    if intervals.present?
      ((intervals.sum / intervals.size) / 3600.0).round(2)  # Convert to minutes and round
    else
      0
    end
  end
  
  def self.calculate_average_open_time(events)
    open_times = []
    open_event = nil

    events.order(:event_timestamp).each do |event|
      if event.event_type == "opened"
        open_event = event
      elsif event.event_type == "closed" && open_event
        duration = event.event_timestamp - open_event.event_timestamp
        open_times << duration
        open_event = nil
      end
    end

    if open_times.present?
      ((open_times.sum / open_times.size) / 60.0).round(2)  # Convert to minutes and round
    else
      0
    end
  end
end
