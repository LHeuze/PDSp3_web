# app/controllers/api/v1/superuser/users_controller.rb
module Api
  module V1
    module Superuser
      class UsersController < ApplicationController
        def index
          users = User.all
          render json: users
        end

        def show
          user = User.find(params[:id])
          render json: user
        end

        def update
          user = User.find(params[:id])
          if user.update(user_params)
            render json: user
          else
            render json: { error: user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          user = User.find(params[:id])
          user.destroy
          render json: { message: 'User deleted successfully' }
        end

        private

        def user_params
          params.require(:user).permit(:name, :email, :role)
        end
      end
    end
  end
end
