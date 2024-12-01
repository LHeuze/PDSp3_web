Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      get 'locker_stats/:admin_id', to: 'metrics#show'
      resources :models, only: [:index, :update]
      patch '/user/update_model', to: 'models#update_user_model'
      namespace :superuser do
        get 'dashboard', to: 'dashboard#index'
        resources :models, only: [:index, :show, :create, :update, :destroy]
        resources :gestures, only: [:update]
        resources :users
      end
      resources :lockers, only: [:index, :show, :update] do
        get 'events', on: :member
      end
      resources :locker_administrators, only: [:index, :update, :create, :destroy] do
        get 'lockers', on: :member
      end
      post 'users/google_sign_in', to: 'users#google_sign_in'
    end
  end
  get '*path', to: 'static#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
