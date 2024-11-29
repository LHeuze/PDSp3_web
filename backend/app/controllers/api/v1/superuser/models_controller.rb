# app/controllers/api/v1/superuser/models_controller.rb
module Api
  module V1
    module Superuser
      class ModelsController < ApplicationController
        before_action :authenticate_request
        before_action :set_model, only: [:show, :update, :destroy]

        # GET /api/v1/superuser/models
        def index
          # Fetch models for the current user, and include their gestures
          models = Model.includes(:gestures).all
      
          # Manually build the response to include gestures
          models_with_gestures = models.map do |model|
            {
              id: model.id,
              name: model.name,
              user_id: model.user_id,
              created_at: model.created_at,
              updated_at: model.updated_at,
              gestures: model.gestures.map { |gesture| { name: gesture.name, image: url_for(gesture.image) } }
            }
          end
      
          # Respond with the models and their gestures
          render json: models_with_gestures
        end


        # GET /api/v1/superuser/models/:id
        def show
          render json: @model.as_json.merge({
            gestures: @model.gestures.map { |gesture| 
              {
                name: gesture.name,
                image_url: Rails.application.routes.url_helpers.rails_blob_path(gesture.image, only_path: true)
              }
            }
            })
        end

        # POST /api/v1/superuser/models
        def create
          permitted_params = model_params
        
          # Process gestures
          gestures = permitted_params[:gestures].values.map do |gesture_data|
            Gesture.new(name: gesture_data[:name], image: gesture_data[:image])
          end
        
          # Create the Model object associated with the current user
          model = current_user.models.build(name: permitted_params[:name], file: permitted_params[:file])
        
          # Attach the gestures
          gestures.each do |gesture|
            model.gestures << gesture
          end
        
          if model.save
            render json: model, status: :created
          else
            render json: model.errors, status: :unprocessable_entity
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
          params.permit(:name, :file, gestures: [:name, :image])
        end

        def model_update_params
          params.permit(:name, gestures: [])
        end
      end
    end
  end
end
