module Api
    module V1
      class MetricsController < ApplicationController
        before_action :authenticate_request
  
        # GET /api/v1/metrics
        def index
          metrics = LockerMetricsService.metrics_for_last_7_days
          render json: metrics, status: :ok
        end
        #GET /api/v1/metrics/:admin_id
        def show
            admin = LockerAdministrator.find(params[:admin_id])
            metrics = LockerMetricsService.metrics_for_admin(admin)
            render json: metrics, status: :ok
          end
      end
    end
  end
  