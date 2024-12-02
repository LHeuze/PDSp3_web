class SuperuserMetricsService
  def self.system_overview
    {
      active_users_count: User.where(role: 'admin_locker').count,
      active_controllers_count: LockerAdministrator.count,
      active_lockers_count: Locker.count,
      total_openings_last_7_days: total_openings_last_7_days,
      peak_usage_hours: peak_usage_hours,
      inactive_lockers_count: inactive_lockers.count,
      average_open_time: average_open_time,
      top_lockers_by_openings: top_lockers_by_openings  # Updated method
    }
  end

  def self.total_openings_last_7_days
    start_date = 7.days.ago.beginning_of_day
    LockerEvent.where(event_type: "opened", event_timestamp: start_date..Time.current)
               .group("DATE(event_timestamp)")
               .order("DATE(event_timestamp)")
               .count
  end

  def self.peak_usage_hours
    LockerEvent.where(event_type: "opened")
               .group("EXTRACT(HOUR FROM event_timestamp)")
               .order("count_all DESC")
               .limit(3)
               .count
               .transform_keys(&:to_i)
  end

  def self.inactive_lockers(threshold_days = 30)
    threshold_date = threshold_days.days.ago
    used_locker_ids = LockerEvent.where(event_timestamp: threshold_date..Time.current)
                                 .distinct.pluck(:locker_id)
    Locker.where.not(id: used_locker_ids)
  end

  def self.average_open_time
    open_times = []

    LockerEvent.where(event_type: ["opened", "closed"])
               .order(:locker_id, :event_timestamp)
               .group_by(&:locker_id)
               .each do |locker_id, events|
      events.each_cons(2) do |event1, event2|
        if event1.event_type == "opened" && event2.event_type == "closed"
          duration = event2.event_timestamp - event1.event_timestamp
          open_times << duration
        end
      end
    end

    if open_times.any?
      ((open_times.sum / open_times.size) / 60.0).round(2)  # Convert to minutes
    else
      0
    end
  end

  def self.top_lockers_by_openings(limit = 5)
    locker_openings = LockerEvent.where(event_type: "opened")
                                 .group(:locker_id)
                                 .order("count_all DESC")
                                 .limit(limit)
                                 .count

    locker_openings.map do |locker_id, count|
      locker = Locker.find_by(id: locker_id)
      { locker_name: locker&.name || "Unknown", openings: count }
    end
  end
end
