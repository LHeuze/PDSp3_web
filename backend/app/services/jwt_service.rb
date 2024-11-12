class JwtService
    # Encodes a payload into a JWT token
    def self.encode(payload)
      JWT.encode(payload, Rails.application.credentials.dig(:jwt, :secret_key), 'HS256')
    end
  
    # Decodes a JWT token into a payload
    def self.decode(token)
      decoded_token = JWT.decode(token, Rails.application.credentials.dig(:jwt, :secret_key), true, { algorithm: 'HS256' })
      decoded_token.first
    rescue JWT::DecodeError => e
      nil
    end
  end
  