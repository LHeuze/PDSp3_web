# app/controllers/api/v1/superuser/gestures_controller.rb
module Api
    module V1
      module Superuser
        class GesturesController < ApplicationController
          before_action :authenticate_request
          before_action :set_model
          before_action :set_gesture, only: [:update, :destroy]
  
          def create
            @gesture = @model.gestures.build(gesture_params)
            if @gesture.save
              render json: @gesture, status: :created
            else
              render json: { errors: @gesture.errors.full_messages }, status: :unprocessable_entity
            end
          end
  
          def update
            if @gesture.update(gesture_params)
              render json: @gesture, status: :ok
            else
              render json: { errors: @gesture.errors.full_messages }, status: :unprocessable_entity
            end
          end
  
          def destroy
            if @gesture.destroy
              render json: { message: "Gesto eliminado exitosamente" }, status: :ok
            else
              render json: { errors: @gesture.errors.full_messages }, status: :unprocessable_entity
            end
          end
  
          private
  
          def set_model
            @model = Model.find(params[:model_id])
          end
  
          def set_gesture
            @gesture = @model.gestures.find(params[:id])
          end
  
          def gesture_params
            params.require(:gesture).permit(:name, :image)
          end
        end
      end
    end
  end
  