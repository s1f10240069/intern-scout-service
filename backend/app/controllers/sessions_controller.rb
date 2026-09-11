class SessionsController < ApplicationController
  def create
    intern = Intern.authenticate_by(email: params[:email], password: params[:password])

    if intern
      intern.regenerate_api_token!
      render json: { intern: intern, token: intern.api_token }
    else
      render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
    end
  end

  def show
    if current_intern
      render json: current_intern
    else
      render json: { error: "認証が必要です" }, status: :unauthorized
    end
  end

  private

  def current_intern
    token = request.headers["Authorization"]&.delete_prefix("Bearer ")
    Intern.find_by(api_token: token) if token.present?
  end
end
