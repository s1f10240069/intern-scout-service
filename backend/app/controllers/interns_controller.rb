class InternsController < ApplicationController
  def index
    interns = Intern.all
    render json: interns
  end

  def show
    intern = Intern.find(params[:id])
    render json: intern
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Intern not found" }, status: :not_found
  end

  def create
    intern = Intern.new(intern_params)

    if intern.save
      render json: intern, status: :created
    else
      render json: { errors: intern.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def intern_params
    params.require(:intern).permit(:name, :email, :university, :graduation_year, :skills)
  end
end
