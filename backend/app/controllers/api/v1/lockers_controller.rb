module Api
  module V1
    class LockersController < ApplicationController
      before_action :authenticate_request
      before_action :set_locker, only: [:events]
      
      def index
        @lockers = Locker.order(:number)
        render json: @lockers.as_json(
          only: [:id, :name, :number, :password, :last_opened, :last_closed, :model_version, :owner_email]
        )
      end

      def show
        locker = Locker.find(params[:id])
        render json: locker.as_json(methods: [:formatted_last_opened, :formatted_last_closed])
      end

      def update
        Rails.logger.info(params[:locker])
        @locker = Locker.find(params[:id])
        previous_owner_email = @locker.owner_email
        previous_password = @locker.password

        if @locker.update(locker_params)
          if @locker.owner_email != previous_owner_email || @locker.password != previous_password
            LockerMailer.locker_update_notification(@locker).deliver_now
          end
          render json: @locker, status: :ok
        else
          render json: { error: @locker.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def events
        events = @locker.locker_events.order(event_timestamp: :desc)

        render json: events, status: :ok
      end

      private

      def locker_params
        params.require(:locker).permit(:name, :model_version, :owner_email, password: [])
      end

      def set_locker
        @locker = Locker.find(params[:id])
      end
    end
  end
end
