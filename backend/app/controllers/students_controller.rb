class StudentsController < ApplicationController
  before_action :authenticate_company!, only: [ :index, :show ]

  def index
    render json: Student.all
  end

  def show
    render json: Student.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Student not found" }, status: :not_found
  end

  def create
    student = Student.new(student_params)

    if student.save
      student.regenerate_api_token!
      render json: { student: student, token: student.api_token }, status: :created
    else
      render json: { errors: student.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def student_params
    params.require(:student).permit(
      :name, :email, :university, :graduation_year, :skills,
      :password, :password_confirmation
    )
  end
end
