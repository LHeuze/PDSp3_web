# db/seeds.rb
User.find_or_create_by!(email: "lheuze@miuandes.cl") do |user|
  user.name = "LUCAS HEUZE ARAYA"
  user.password = "password" # Replace with a strong password
  user.password_confirmation = "password"
  user.role = "superuser"
end
# Create a Locker Administrator
locker_admin = LockerAdministrator.find_or_create_by!(name: "Locker admin 1") do |admin|
  admin.user = User.find_by(email: "lheuze@miuandes.cl")
  admin.name = "locker admin de Lucas"
  admin.base_topic = "lockers/1/"
  admin.amount_of_lockers = 3
end

# Create 3 lockers and assign them to the Locker Administrator
locker1 = Locker.find_or_create_by!(number: "1") do |locker|
  locker.name = "locker 1"
  locker.password = ["fist", "peace", "rad", "fist"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker2 = Locker.find_or_create_by!(number: "2") do |locker|
  locker.name = "locker 2"
  locker.password = ["peace", "fist", "rad", "peace"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

locker3 = Locker.find_or_create_by!(number: "3") do |locker|
  locker.name = "locker 3"
  locker.password = ["rad", "fist", "peace", "rad"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.access_count = 0
  locker.locker_administrator = locker_admin
end

# Helper method to create opening and closing events
def seed_locker_events(locker)
  locker.locker_events.find_or_create_by!(event_type: "opened", event_timestamp: 6.hours.ago)
  locker.locker_events.find_or_create_by!(event_type: "closed", event_timestamp: 5.hours.ago)
  locker.locker_events.find_or_create_by!(event_type: "opened", event_timestamp: 2.hours.ago)
  locker.locker_events.find_or_create_by!(event_type: "closed", event_timestamp: 1.hour.ago)
end

# Seed events for each locker
seed_locker_events(locker1)
seed_locker_events(locker2)
seed_locker_events(locker3)

puts "Seeding completed. Locker Administrator and lockers have been created with events!"
