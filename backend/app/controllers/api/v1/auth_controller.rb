require 'google-id-token'

module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      def google
        id_token = params[:id_token]
        validator = GoogleIDToken::Validator.new
        client_id = Rails.application.credentials.dig(:google, :client_id)

        begin
          payload = validator.check(id_token, client_id)

          # Extract user information from the payload
          email = payload['email']
          name = payload['name']
          picture = payload['picture']

          # Find or create the user in your database
          user = User.find_or_create_by(email: email) do |u|
            u.name = name
            u.image_url = picture
            # Set additional user attributes if necessary
          end

          # Generate a JWT token for session management
          jwt_token = JwtService.encode({ user_id: user.id, exp: Time.now.to_i + Rails.application.credentials.dig(:jwt, :expiration_time) })

          # Return success response
          render json: { message: 'User authenticated', token: jwt_token, user: user }, status: :ok
        rescue GoogleIDToken::ValidationError => e
          render json: { error: 'Invalid ID token' }, status: :unauthorized
        end
      end
    end
  end
end
