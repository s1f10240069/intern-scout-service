class CompanySessionsController < ApplicationController
  def create
    company = Company.authenticate_by(email: params[:email], password: params[:password])

    if company
      company.regenerate_api_token!
      render json: { company: company, token: company.api_token }
    else
      render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
    end
  end

  def show
    if current_company
      render json: current_company
    else
      render json: { error: "認証が必要です" }, status: :unauthorized
    end
  end
end
