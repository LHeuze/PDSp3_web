class ApplicationController < ActionController::API
  
    before_action :authenticate_request
    attr_reader :current_user
    private
  
    def authenticate_request
      token = request.headers['Authorization']&.split(' ')&.last

      decoded_token = JwtService.decode(token)
      if decoded_token.present?
        @current_user = User.find(decoded_token[:user_id])
      else
        render json: { error: 'Not Authorized' }, status: :unauthorized
      end
    end
  end
  