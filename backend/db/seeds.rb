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
u1 = User.create!(
  email: "admin@example.com",
  name: "admin1",
  password: "password",
  password_confirmation: "password",
  role: "locker_admin"
)

u2 = User.create!(
  email: "admin2@example.com",
  name: "admin2",
  password: "password",
  password_confirmation: "password",
  role: "locker_admin"
)

# Create 3 lockers
Locker.create!([
  {
    number: "Locker 1",
    password: ["fist", "peace", "rad", "fist"],
    owner_id: u1.id,
    status: "locked",
    last_accessed: Time.now,
    model_version: "1.0",
    access_count: 0,
    synced: true
  },
  {
    number: "Locker 2",
    password: ["peace", "fist", "rad", "peace"],
    owner_id: u1.id,
    status: "locked",
    last_accessed: Time.now,
    model_version: "1.0",
    access_count: 0,
    synced: true
  },
  {
    number: "Locker 3",
    password: ["rad", "fist", "peace", "rad"],
    owner_id: u2.id,
    status: "locked",
    last_accessed: Time.now,
    model_version: "1.0",
    access_count: 0,
    synced: true
  }
])
