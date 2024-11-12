module Api
  module V1
    class LockersController < ApplicationController
      before_action :authenticate_request
      
      def index
        @lockers = Locker.order(:number)
        render json: @lockers.as_json(
          only: [:id, :number, :password, :status, :last_accessed, :model_version, :owner_email]
        )
      end

      def show
        @locker = Locker.find(params[:id])
        render json: @locker.as_json(
          only: [:id, :number, :password, :status, :last_accessed, :model_version, :access_count, :owner_email]
        )
      end

      def update
        Rails.logger.info(params[:locker])
        @locker = Locker.find(params[:id])
        previous_owner_email = @locker.owner_email
        previous_password = @locker.password

        if @locker.update(locker_params)
          # Send email if owner_email or password changed
          if @locker.owner_email != previous_owner_email || @locker.password != previous_password
            LockerMailer.locker_update_notification(@locker).deliver_now
          end
          render json: @locker, status: :ok
        else
          render json: { error: @locker.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def locker_params
        params.require(:locker).permit(:model_version, :owner_email, password: [])
      end
    end
  end
end
