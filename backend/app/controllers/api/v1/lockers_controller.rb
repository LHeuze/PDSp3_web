module Api
  module V1
    class LockersController < ApplicationController
      before_action :authenticate_request
      before_action :set_locker, only: [:show, :events]
      
      def index
        @lockers = Locker.order(:number)
        render json: @lockers.as_json(
          only: [:id, :name, :number, :password, :last_opened, :last_closed, :model_version, :owner_email]
        )
      end

      def show
        # Fetch the user associated with the locker administrator
        user = @locker.locker_administrator.user
        model = user.current_model # Fetch the current model of the user
        gestures = model&.gestures || [] # Handle case where user might not have a model
    
        render json: @locker.as_json.merge({
          gestures: gestures
        })
      end

      def update
        Rails.logger.info(params[:locker])
        @locker = Locker.find(params[:id])
      
        if @locker.update(locker_params)
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
