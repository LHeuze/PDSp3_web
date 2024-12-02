# app/controllers/api/v1/superuser/dashboard_controller.rb
module Api
  module V1
    module Superuser
      class DashboardController < ApplicationController
        before_action :authenticate_request
        def index
          @metrics = SuperuserMetricsService.system_overview
          render json: @metrics, status: :ok
        end
      end
    end
  end
end
