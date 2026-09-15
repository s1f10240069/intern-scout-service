class SessionsController < ApplicationController
  def create
    student = Student.authenticate_by(email: params[:email], password: params[:password])

    if student
      student.regenerate_api_token!
      render json: { student: student, intern: student, token: student.api_token }
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
end
