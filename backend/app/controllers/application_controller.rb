class ApplicationController < ActionController::API
  private

  def bearer_token
    request.headers["Authorization"]&.delete_prefix("Bearer ")
  end

  def current_company
    Company.find_by(api_token: bearer_token) if bearer_token.present?
  end

  def current_student
    Student.find_by(api_token: bearer_token) if bearer_token.present?
  end

  def authenticate_company!
    return if current_company

    render json: { error: "企業アカウントでのログインが必要です" }, status: :unauthorized
  end
end
