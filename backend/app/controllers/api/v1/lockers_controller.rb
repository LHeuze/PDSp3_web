# app/controllers/api/v1/lockers_controller.rb
module Api
  module V1
    class LockersController < ApplicationController
      before_action :authenticate_request
      def index
        @lockers = Locker.includes(:owner).all
        render json: @lockers.as_json(
          only: [:id, :number, :password, :status, :last_accessed, :model_version],
          include: {
            owner: {
              only: [:id, :email, :role]
            }
          }
        )
      end

      def show
        @locker = Locker.find(params[:id])
        render json: @locker.as_json(
          only: [:id, :number, :password, :status, :last_accessed, :model_version, :access_count],
          include: {
            owner: {
              only: [:id, :email, :role]
            }
          }
        )
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

      private

      def locker_params
        params.require(:locker).permit(:model_version, :owner_id, password: [])
      end
    end
  end
end
