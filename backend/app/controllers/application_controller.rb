class ApplicationController < ActionController::API
  private

  def bearer_token
    request.headers["Authorization"]&.delete_prefix("Bearer ")
  end

  def current_company
    Company.find_by(api_token: bearer_token) if bearer_token.present?
  end

  def current_student
    Student.find_by(api_token: bearer_token) if bearer_token.present?
  end

  def authenticate_company!
    return if current_company

    render json: { error: "企業アカウントでのログインが必要です" }, status: :unauthorized
  end

  def authenticate_student!
    return if current_student

    render json: { error: "学生アカウントでのログインが必要です" }, status: :unauthorized
  end

  def conversation_payload(conversation, include_messages: true)
    payload = {
      id: conversation.id,
      company: conversation.company,
      student: conversation.student,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at
    }
    payload[:messages] = conversation.messages.map { |message| message_payload(message) } if include_messages
    payload
  end

  def message_payload(message)
    message.as_json(only: [ :id, :sender_type, :body, :created_at ])
  end

  def job_posting_payload(job_posting)
    job_posting.as_json(
      only: [
        :id, :title, :description, :location, :compensation,
        :period, :required_skills, :created_at, :updated_at
      ]
    ).merge(company: job_posting.company)
  end
end
