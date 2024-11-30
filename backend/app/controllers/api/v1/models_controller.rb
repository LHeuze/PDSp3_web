module Api
    module V1  
        class ModelsController < ApplicationController
            before_action :authenticate_request

            # GET /models
            def index
                models = Model.all
                current_model = @current_user.current_model
              
                render json: {
                  models: models.as_json(only: [:id, :name]),
                  current_model: current_model&.as_json(only: [:id, :name])
                }, status: :ok
              end
              
              def update_user_model
                new_model = Model.find_by(id: params[:model_id])
                return render json: { error: "Modelo no encontrado" }, status: :not_found unless new_model
              
                if @current_user.update(current_model: new_model)
                  # Update locker administrators' models
                  @current_user.locker_administrators.update_all(model_id: new_model.id)

                  update_lockers_passwords(new_model)
              
                  send_model_file_to_lockers(new_model)
              
                  render json: { message: "Modelo actualizado exitosamente" }, status: :ok
                else
                  render json: { error: @current_user.errors.full_messages }, status: :unprocessable_entity
                end
              end
              

              private

              def update_lockers_passwords(new_model)
                # Fetch all lockers associated with the current user's locker administrators
                lockers = Locker.joins(locker_administrator: :user)
                                .where(locker_administrators: { user_id: @current_user.id })
              
                # Iterate over each locker to update its password
                lockers.find_each do |locker|
                  # Generate a new password based on the new model's gestures
                  new_password = generate_password_from_model(new_model)
              
                  # Update the locker with the new password
                  locker.update(password: new_password)
                end
              end
                       

              def generate_password_from_model(model)
                gesture_names = model.gestures.pluck(:name)
                password_length = 4
                gesture_names.sample(password_length)
              end

              def send_model_file_to_lockers(model)
                @current_user.locker_administrators.find_each do |locker_admin|
                  MqttService.publish_model_file(locker_admin, model)
                end
              end
        end
    end
end
