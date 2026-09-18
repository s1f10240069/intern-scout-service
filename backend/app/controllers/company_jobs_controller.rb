class CompanyJobsController < ApplicationController
  before_action :authenticate_company!
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def index
    job_postings = current_company.job_postings.order(created_at: :desc)
    render json: job_postings.map { |job_posting| job_posting_payload(job_posting) }
  end

  def show
    render json: job_posting_payload(company_job_posting)
  end

  def create
    job_posting = current_company.job_postings.build(job_posting_params)

    if job_posting.save
      render json: job_posting_payload(job_posting), status: :created
    else
      render json: { errors: job_posting.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if company_job_posting.update(job_posting_params)
      render json: job_posting_payload(company_job_posting)
    else
      render json: { errors: company_job_posting.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    company_job_posting.destroy!
    head :no_content
  end

  private

  def company_job_posting
    @company_job_posting ||= current_company.job_postings.includes(:company).find(params[:id])
  end

  def job_posting_params
    params.require(:job_posting).permit(
      :title, :description, :location, :compensation, :period, :required_skills
    )
  end

  def render_not_found
    render json: { error: "Job posting not found" }, status: :not_found
  end
end
