class StudentMessagesController < ApplicationController
  before_action :authenticate_student!
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def index
    conversations = current_student.conversations
      .includes(:student, :company)
      .order(updated_at: :desc)

    render json: conversations.map { |conversation| conversation_payload(conversation, include_messages: false) }
  end

  def show
    render json: conversation_payload(student_conversation)
  end

  def reply
    message = student_conversation.messages.build(message_params.merge(sender_type: "student"))

    if message.save
      render json: conversation_payload(student_conversation.reload), status: :created
    else
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def student_conversation
    @student_conversation ||= current_student.conversations
      .includes(:company, :student, :messages)
      .find(params[:conversation_id])
  end

  def message_params
    params.require(:message).permit(:body)
  end

  def render_not_found
    render json: { error: "Resource not found" }, status: :not_found
  end
end
