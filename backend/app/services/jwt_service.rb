class JwtService
    # Encodes a payload into a JWT token
    def self.encode(payload, exp = 24.hours.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, Rails.application.credentials.dig(:jwt, :secret_key), 'HS256')
    end
  
    # Decodes a JWT token into a payload

    def self.decode(token)
      begin
        decoded = JWT.decode(token, Rails.application.credentials.dig(:jwt, :secret_key), true, { algorithm: 'HS256' })
        HashWithIndifferentAccess.new(decoded[0])
      rescue JWT::ExpiredSignature
        Rails.logger.error 'JWT Expired Signature'
        nil
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error: #{e.message}"
        nil
      end
    end
  end
  