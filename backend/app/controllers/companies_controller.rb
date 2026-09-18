class CompaniesController < ApplicationController
  before_action :authenticate_student!, only: [ :index, :show ]

  def index
    render json: Company.order(:name)
  end

  def show
    company = Company.includes(:job_postings).find(params[:id])
    render json: {
      company: company,
      job_postings: company.job_postings.order(created_at: :desc).map { |job| job_posting_payload(job) }
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Company not found" }, status: :not_found
  end

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
