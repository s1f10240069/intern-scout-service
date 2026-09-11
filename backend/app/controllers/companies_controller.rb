class CompaniesController < ApplicationController
  def create
    company = Company.new(company_params)

    if company.save
      company.regenerate_api_token!
      render json: { company: company, token: company.api_token }, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def company_params
    params.require(:company).permit(:name, :email, :password, :password_confirmation)
  end
end
