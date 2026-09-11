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
    Intern.find_by(api_token: bearer_token) if bearer_token.present?
  end
end
