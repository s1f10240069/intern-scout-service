Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resources :students, only: [ :index, :show, :create ]
  # Temporary compatibility routes. Remove after every client uses /students.
  resources :interns, only: [ :index, :show, :create ]

  post "login", to: "sessions#create"
  get "me", to: "sessions#show"

  resources :companies, only: [ :create ]

  post "company_login", to: "company_sessions#create"
  get "company_me", to: "company_sessions#show"

  # Defines the root path route ("/")
  # root "posts#index"
end
