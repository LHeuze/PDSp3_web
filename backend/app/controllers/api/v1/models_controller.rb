module Api
    module V1  
        class ModelsController < ApplicationController
            before_action :authenticate_request

            # GET /models
            def index
                models = Model.all
                current_model = @current_user.model

                render json: {
                models: models.as_json(only: [:id, :name]),
                current_model: current_model.as_json(only: [:id, :name])
                }, status: :ok
            end

            # PATCH /user/update_model
            def update_user_model
                new_model = Model.find_by(id: params[:model_id])
                return render json: { error: "Modelo no encontrado" }, status: :not_found unless new_model

                if @current_user.update(model: new_model)
                render json: { message: "Modelo actualizado exitosamente" }, status: :ok
                else
                render json: { error: @current_user.errors.full_messages }, status: :unprocessable_entity
                end
            end
        end
    end
end
