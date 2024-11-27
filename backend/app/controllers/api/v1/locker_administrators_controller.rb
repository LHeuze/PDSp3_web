module Api
    module V1        
        class LockerAdministratorsController < ApplicationController
            before_action :authenticate_request
            def index
                locker_administrators = LockerAdministrator.where(user_id: current_user.id)
                render json: locker_administrators.as_json(
                    only: [:id, :name, :base_topic, :status, :amount_of_lockers],
                    include: { user: { only: [:id, :name, :email] } }
                    ), status: :ok
            end

            def update
                locker_administrator = LockerAdministrator.find(params[:id])
                if locker_administrator.update(name: params[:name])
                  render json: locker_administrator, status: :ok
                else
                  render json: { error: 'Failed to update' }, status: :unprocessable_entity
                end
            end

            def lockers
                locker_administrator = LockerAdministrator.find(params[:id])
                
                if locker_administrator.user_id == current_user.id
                    render json: locker_administrator.lockers, status: :ok
                else
                    render json: { error: 'Unauthorized' }, status: :unauthorized
                end
            end
        end
    end
end
