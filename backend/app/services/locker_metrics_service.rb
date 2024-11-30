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
  
      # Fetch all locker administrators with their lockers
      locker_admins = LockerAdministrator.includes(:lockers).all
  
      metrics = locker_admins.each_with_object({}) do |admin, result|
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
  
      metrics
    end
  
    def self.total_openings_per_day(events)
      events.where(event_type: "opened")
            .group("DATE(event_timestamp)").count
    end
  
    def self.most_common_opening_hour(events)
      events.where(event_type: "opened")
            .group("EXTRACT(HOUR FROM event_timestamp)")
            .order("count_all DESC")
            .count
            .first&.first # Returns the hour
    end
  
    def self.calculate_average_interval(events)
      timestamps = events.where(event_type: "opened").order(:event_timestamp).pluck(:event_timestamp)
      intervals = timestamps.each_cons(2).map { |a, b| b - a }
      intervals.sum / intervals.size if intervals.present?
    end
  
    def self.calculate_average_open_time(events)
      locker_events = events.order(:event_timestamp)
      open_times = locker_events.each_cons(2).map do |event1, event2|
        if event1.event_type == "opened" && event2.event_type == "closed"
          event2.event_timestamp - event1.event_timestamp
        end
      end.compact
  
      open_times.sum / open_times.size if open_times.present?
    end
  end
  