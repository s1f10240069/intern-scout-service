class SessionsController < ApplicationController
  ACCOUNT_TYPES = %w[student company].freeze

  def create
    account_type = params[:account_type].presence
    unless ACCOUNT_TYPES.include?(account_type)
      render json: { error: "アカウント種別が正しくありません" }, status: :unprocessable_entity
      return
    end

    account_class = account_type == "company" ? Company : Student
    account = account_class.authenticate_by(email: params[:email], password: params[:password])

    if account
      account.regenerate_api_token!
      render json: login_payload(account_type, account)
    else
      render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
    end
  end

  def show
    if current_student
      render json: current_student
    else
      render json: { error: "認証が必要です" }, status: :unauthorized
    end
  end

  private

  def login_payload(account_type, account)
    { account_type: account_type, token: account.api_token, account_type.to_sym => account }
  end
end
