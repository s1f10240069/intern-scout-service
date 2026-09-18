class JobPostingsController < ApplicationController
  before_action :authenticate_student!
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def index
    job_postings = JobPosting.includes(:company).order(created_at: :desc)
    render json: job_postings.map { |job_posting| job_posting_payload(job_posting) }
  end

  def show
    render json: job_posting_payload(JobPosting.includes(:company).find(params[:id]))
  end

  private

  def render_not_found
    render json: { error: "Job posting not found" }, status: :not_found
  end
end
