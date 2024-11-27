# app/controllers/api/v1/superuser/dashboard_controller.rb
module Api
  module V1
    module Superuser
      class DashboardController < ApplicationController
        def index
          render json: {
            user_count: User.count,
            locker_count: Locker.count,
          }
        end
      end
    end
  end
end
