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
Locker.find_or_create_by!(number: "Locker 1") do |locker|
  locker.password = ["fist", "peace", "rad", "fist"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_accessed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

Locker.find_or_create_by!(number: "Locker 2") do |locker|
  locker.password = ["peace", "fist", "rad", "peace"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_accessed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

Locker.find_or_create_by!(number: "Locker 3") do |locker|
  locker.password = ["rad", "fist", "peace", "rad"]
  locker.owner_email = "lheuze@miuandes.cl"
  locker.status = "locked"
  locker.last_accessed = Time.now
  locker.model_version = "1.0"
  locker.access_count = 0
  locker.synced = true
end

