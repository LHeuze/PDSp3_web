class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_request, only: [:google_sign_in]

  def google_sign_in
    token = params[:token]
    validator = GoogleIDToken::Validator.new

    begin
      payload = validator.check(token, Rails.application.credentials.dig(:google, :client_id))

      unless ['miuandes.cl', 'uandes.cl'].include?(payload['hd'])
        return render json: { error: 'Access restricted to miuandes.cl or uandes.cl users only' }, status: :forbidden
      end

      dummy_password = SecureRandom.hex(16)

      user = User.find_by(email: payload['email']) || User.new(
        email: payload['email'],
        name: payload['name'],
        role: 'locker_admin',
        password: dummy_password,
        password_confirmation: dummy_password
      )

      if user.new_record?
        if user.save
          Rails.logger.info "User #{user.email} created successfully."
        else
          Rails.logger.error "Failed to create user: #{user.errors.full_messages}"
          return render json: { error: "Failed to create user: #{user.errors.full_messages.join(', ')}" }, status: :unprocessable_entity
        end
      end

      auth_token = user.generate_auth_token
      render json: { token: auth_token, user: user }, status: :ok

    rescue GoogleIDToken::ValidationError => e
      render json: { error: "Invalid Google token: #{e.message}" }, status: :unauthorized
    end
  end
end