# app/controllers/api/v1/superuser/models_controller.rb
module Api
  module V1
    module Superuser
      class ModelsController < ApplicationController
        before_action :authenticate_request
        before_action :set_model, only: [:show, :update, :destroy]

        # GET /api/v1/superuser/models
        def index
          models = Model.where(user: @current_user)
          render json: models, status: :ok
        end

        # GET /api/v1/superuser/models/:id
        def show
          render json: @model.as_json.merge({
            gesture_images: @model.gesture_images.map { |image| Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true) }
          })
        end


        # POST /api/v1/superuser/models
        def create
          model = Model.new(model_params)
          model.user = @current_user

          # Attach the AI model file
          if params[:file].present?
            model.file.attach(params[:file])
          else
            return render json: { error: "El archivo del modelo es obligatorio" }, status: :unprocessable_entity
          end

          # Attach the gesture images
          if params[:gesture_images].present?
            params[:gesture_images].each do |_, image|
              if image.is_a?(ActionDispatch::Http::UploadedFile)
                model.gesture_images.attach(image)
              else
                Rails.logger.error("Invalid gesture image: #{image}")
              end
            end
          else
            return render json: { error: "Las imágenes de los gestos son obligatorias" }, status: :unprocessable_entity
          end

          if model.save
            render json: model, status: :created
          else
            render json: { errors: model.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/superuser/models/:id
        def update
          if @model.update(model_update_params)
            # Update file if provided
            if params[:file].present?
              @model.file.attach(params[:file])
            end

            # Update gesture images if provided
            if params[:gesture_images].present?
              @model.gesture_images.purge # Remove old images
              params[:gesture_images].each do |_, image|
                @model.gesture_images.attach(image)
              end
            end

            render json: @model, status: :ok
          else
            render json: { errors: @model.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/superuser/models/:id
        def destroy
          if @model.destroy
            render json: { message: "Modelo eliminado exitosamente" }, status: :ok
          else
            render json: { errors: @model.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_model
          @model = Model.find_by(id: params[:id], user: @current_user)
          render json: { error: "Modelo no encontrado" }, status: :not_found unless @model
        end

        def model_params
          {
            name: params[:name],
            gestures: params[:gestures]&.values
          }
        end

        def model_update_params
          params.permit(:name, gestures: [])
        end
      end
    end
  end
end
