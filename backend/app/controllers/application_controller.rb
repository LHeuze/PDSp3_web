class ApplicationController < ActionController::API
    include ActionController::Cookies # If you plan to use cookies
  
    before_action :authenticate_request
  
    private
  
    def authenticate_request
      header = request.headers['Authorization']
      header = header.split(' ').last if header

      Rails.logger.info("Authorization Header: #{header}")
      
      decoded = JwtService.decode(header)
      if decoded
        @current_user = User.find_by(id: decoded['user_id'])
      else
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end
  end
  