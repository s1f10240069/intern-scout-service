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

  post "company/students/:student_id/messages", to: "company_messages#create_for_student"
  get "company/students/:student_id/conversation", to: "company_messages#show_for_student"
  get "company/messages", to: "company_messages#index"
  get "company/messages/:conversation_id", to: "company_messages#show"
  post "company/messages/:conversation_id/messages", to: "company_messages#reply"

  get "messages", to: "student_messages#index"
  get "messages/:conversation_id", to: "student_messages#show"
  post "messages/:conversation_id/messages", to: "student_messages#reply"

  # Defines the root path route ("/")
  # root "posts#index"
end
