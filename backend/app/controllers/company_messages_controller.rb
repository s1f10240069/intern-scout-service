class CompanyMessagesController < ApplicationController
  before_action :authenticate_company!
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def index
    conversations = current_company.conversations
      .includes(:student, :company)
      .order(updated_at: :desc)

    render json: conversations.map { |conversation| conversation_payload(conversation, include_messages: false) }
  end

  def show
    render json: conversation_payload(company_conversation)
  end

  def show_for_student
    student = Student.find(params[:student_id])
    conversation = current_company.conversations
      .includes(:company, :student, :messages)
      .find_by(student: student)

    render json: {
      student: student,
      conversation: conversation && conversation_payload(conversation)
    }
  end

  def create_for_student
    student = Student.find(params[:student_id])
    conversation = current_company.conversations.find_by(student: student) ||
      current_company.conversations.build(student: student)
    message = conversation.messages.build(message_params.merge(sender_type: "company"))

    unless message.valid?
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      return
    end

    save_initial_message!(conversation, message)
    render json: conversation_payload(conversation.reload), status: :created
  end

  def reply
    message = company_conversation.messages.build(message_params.merge(sender_type: "company"))

    if message.save
      render json: conversation_payload(company_conversation.reload), status: :created
    else
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def company_conversation
    @company_conversation ||= current_company.conversations
      .includes(:company, :student, :messages)
      .find(params[:conversation_id])
  end

  def save_initial_message!(conversation, message)
    Conversation.transaction do
      conversation.save! if conversation.new_record?
      message.save!
    end
  rescue ActiveRecord::RecordNotUnique
    conversation = current_company.conversations.find_by!(student: conversation.student)
    message.conversation = conversation
    message.save!
  end

  def message_params
    params.require(:message).permit(:body)
  end

  def render_not_found
    render json: { error: "Resource not found" }, status: :not_found
  end
end
