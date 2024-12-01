# Ensure the directory for seed files exists
gesture_images_path = Rails.root.join('db', 'seeds_files', 'gestures')
raise "Gesture images directory does not exist: #{gesture_images_path}" unless File.directory?(gesture_images_path)

# Path to gesture image files
gesture_files = {
  "Fist" => gesture_images_path.join("Fist.jpg"),
  "Peace" => gesture_images_path.join("Peace.jpg"),
  "Rad" => gesture_images_path.join("Rad.jpg"),
  "Five" => gesture_images_path.join("Five.jpg"),
  "Thumb" => gesture_images_path.join("Thumb.jpg"),
  "C" => gesture_images_path.join("C.jpg")
}

# Ensure all gesture files exist
gesture_files.each do |gesture_name, file_path|
  raise "Gesture file for '#{gesture_name}' does not exist: #{file_path}" unless File.exist?(file_path)
end

# Create a Superuser
user = User.find_or_create_by!(email: "lheuze@miuandes.cl") do |u|
  u.name = "LUCAS HEUZE ARAYA"
  u.password = "password"
  u.password_confirmation = "password"
  u.role = "superuser"
end

# Create a Model with an attached file
model_file_path = Rails.root.join('db', 'seeds_files', 'default_model_file.cc')
raise "Model file does not exist: #{model_file_path}" unless File.exist?(model_file_path)

model = Model.find_or_create_by!(name: "Default Model", user: user) do |m|
  m.file.attach(
    io: File.open(model_file_path),
    filename: 'default_model_file.cc',
    content_type: 'application/octet-stream'
  )
end

# Create Gestures and attach images
gesture_files.each do |gesture_name, file_path|
  gesture = Gesture.find_or_create_by!(name: gesture_name, model: model) do |g|
    g.image.attach(
      io: File.open(file_path),
      filename: File.basename(file_path),
      content_type: 'image/jpeg' # Adjust based on your file type
    )
  end

  puts "Gesture created: #{gesture.name}, Image attached: #{gesture.image.attached? ? gesture.image.filename : 'No'}"
end

# Create a Locker Administrator and associate the model
locker_admin = LockerAdministrator.find_or_create_by!(name: "Locker Admin 1") do |admin|
  admin.user = user
  admin.name = "Locker Admin de Lucas"
  admin.base_topic = "lockers/1/"
  admin.amount_of_lockers = 3
  admin.model = model # Associate the model here
end

# Create Lockers
locker1 = Locker.find_or_create_by!(number: "1") do |locker|
  locker.name = "Locker 1"
  locker.password = ["Fist", "Peace", "Rad", "Fist"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker2 = Locker.find_or_create_by!(number: "2") do |locker|
  locker.name = "Locker 2"
  locker.password = ["Peace", "Fist", "Rad", "Peace"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker3 = Locker.find_or_create_by!(number: "3") do |locker|
  locker.name = "Locker 3"
  locker.password = ["Rad", "Fist", "Peace", "Rad"]
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

puts "Seeding completed."
