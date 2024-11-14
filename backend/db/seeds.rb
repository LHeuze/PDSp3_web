# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# db/seeds.rb

# Make sure to have an existing user as the owner
# Replace `User.first.id` with an actual user ID in your database
# db/seeds.rb

# Create two users with different roles

# Create 3 lockers
locker1 = Locker.find_or_create_by!(number: "1") do |locker|
  locker.password = ["fist", "peace", "rad", "fist"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

locker2 = Locker.find_or_create_by!(number: "2") do |locker|
  locker.password = ["peace", "fist", "rad", "peace"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

locker3 = Locker.find_or_create_by!(number: "3") do |locker|
  locker.password = ["rad", "fist", "peace", "rad"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_opened = Time.now
  locker.last_closed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

# Helper method to create opening and closing events
def seed_locker_events(locker)
  # Create an opening event 6 hours ago
  locker.locker_events.create!(
    event_type: "opened",
    event_timestamp: 6.hours.ago
  )

  # Create a closing event 5 hours ago
  locker.locker_events.create!(
    event_type: "closed",
    event_timestamp: 5.hours.ago
  )

  # Create another opening event 2 hours ago
  locker.locker_events.create!(
    event_type: "opened",
    event_timestamp: 2.hours.ago
  )

  # Create another closing event 1 hour ago
  locker.locker_events.create!(
    event_type: "closed",
    event_timestamp: 1.hour.ago
  )
end

# Seed events for each locker
seed_locker_events(locker1)
seed_locker_events(locker2)
seed_locker_events(locker3)
