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

            def create
                locker_admin = LockerAdministrator.new(locker_admin_params)
                locker_admin.user_id = @current_user.id
        
                if locker_admin.save
                  create_lockers(locker_admin)
                  render json: locker_admin, status: :created
                else
                  render json: { error: locker_admin.errors.full_messages }, status: :unprocessable_entity
                end
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

            private

            def locker_admin_params
                params.require(:locker_administrator).permit(:name, :base_topic, :amount_of_lockers)
            end

            def create_lockers(locker_admin)
                locker_count = locker_admin.amount_of_lockers
                (1..locker_count).each do |i|
                  Locker.create!(
                    name: "Casillero #{i}",
                    number: i.to_s,
                    owner_email: @current_user.email,
                    locker_administrator_id: locker_admin.id
                  )
                end
            end
        end
    end
end