# db/seeds.rb

# Create a Superuser
User.find_or_create_by!(email: "lheuze@miuandes.cl") do |user|
  user.name = "LUCAS HEUZE ARAYA"
  user.password = "password" # Replace with a strong password
  user.password_confirmation = "password"
  user.role = "superuser"
end

# Create a Locker Administrator
locker_admin = LockerAdministrator.find_or_create_by!(name: "Locker admin 1") do |admin|
  admin.user = User.find_by(email: "lheuze@miuandes.cl")
  admin.name = "Locker Admin de Lucas"
  admin.base_topic = "lockers/1/"
  admin.amount_of_lockers = 3
end

# Create 3 lockers and assign them to the Locker Administrator
locker1 = Locker.find_or_create_by!(number: "1") do |locker|
  locker.name = "Locker 1"
  locker.password = ["fist", "peace", "rad", "fist"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker2 = Locker.find_or_create_by!(number: "2") do |locker|
  locker.name = "Locker 2"
  locker.password = ["peace", "fist", "rad", "peace"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker3 = Locker.find_or_create_by!(number: "3") do |locker|
  locker.name = "Locker 3"
  locker.password = ["rad", "fist", "peace", "rad"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

# Helper method to create realistic opening and closing events
def seed_locker_events(locker, days_ago_start, days_ago_end)
  total_days = (days_ago_end - days_ago_start).abs + 1
  (days_ago_start..days_ago_end).each do |days_ago|
    # Random number of events per day (e.g., 1 to 3)
    events_per_day = rand(1..3)
    events_per_day.times do
      # Random time during the day between 8 AM and 8 PM
      hour = rand(8..20)
      minute = rand(0..59)
      opening_time = Time.now - days_ago.days - hour.hours - minute.minutes
      closing_time = opening_time + 5.minutes

      # Ensure closing time is before now
      next if closing_time > Time.now

      # Create opening event
      locker.locker_events.create!(
        event_type: "opened",
        event_timestamp: opening_time
      )

      # Create closing event
      locker.locker_events.create!(
        event_type: "closed",
        event_timestamp: closing_time
      )
    end
  end
end

# Seed events for each locker over the past 12 days
seed_locker_events(locker1, 12, 1)
seed_locker_events(locker2, 12, 1)
seed_locker_events(locker3, 12, 1)

puts "Seeding completed. Locker Administrator and lockers have been created with realistic events!"
