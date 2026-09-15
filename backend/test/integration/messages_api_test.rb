require "test_helper"

class MessagesApiTest < ActionDispatch::IntegrationTest
  setup do
    @company = create_company("company-a@example.com")
    @other_company = create_company("company-b@example.com")
    @student = create_student("student-a@example.com")
    @other_student = create_student("student-b@example.com")
  end

  test "company starts one conversation and subsequent messages reuse it" do
    assert_difference([ "Conversation.count", "Message.count" ], 1) do
      post "/company/students/#{@student.id}/messages",
        params: { message: { body: "  はじめまして  ", sender_type: "student" } },
        headers: company_headers,
        as: :json
    end

    assert_response :created
    conversation_id = response.parsed_body["id"]
    assert_equal "company", response.parsed_body.dig("messages", 0, "sender_type")
    assert_equal "はじめまして", response.parsed_body.dig("messages", 0, "body")

    assert_no_difference("Conversation.count") do
      assert_difference("Message.count", 1) do
        post "/company/students/#{@student.id}/messages",
          params: { message: { body: "二通目です" } },
          headers: company_headers,
          as: :json
      end
    end

    assert_response :created
    assert_equal conversation_id, response.parsed_body["id"]

    get "/company/students/#{@student.id}/conversation", headers: company_headers, as: :json
    assert_response :success
    assert_equal conversation_id, response.parsed_body.dig("conversation", "id")
  end

  test "company student detail returns no conversation before first message" do
    get "/company/students/#{@student.id}/conversation", headers: company_headers, as: :json

    assert_response :success
    assert_equal @student.id, response.parsed_body.dig("student", "id")
    assert_nil response.parsed_body["conversation"]
  end

  test "student can view and reply only to their conversation" do
    conversation = Conversation.create!(company: @company, student: @student)
    conversation.messages.create!(sender_type: "company", body: "こんにちは")

    get "/messages/#{conversation.id}", headers: student_headers, as: :json
    assert_response :success
    assert_equal "こんにちは", response.parsed_body.dig("messages", 0, "body")

    post "/messages/#{conversation.id}/messages",
      params: { message: { body: "返信します", sender_type: "company" } },
      headers: student_headers,
      as: :json
    assert_response :created
    assert_equal "student", response.parsed_body.dig("messages", 1, "sender_type")

    get "/messages/#{conversation.id}", headers: student_headers(@other_student), as: :json
    assert_response :not_found
  end

  test "company cannot access another company conversation" do
    conversation = Conversation.create!(company: @company, student: @student)
    conversation.messages.create!(sender_type: "company", body: "非公開メッセージ")

    get "/company/messages/#{conversation.id}", headers: company_headers(@other_company), as: :json
    assert_response :not_found

    post "/company/messages/#{conversation.id}/messages",
      params: { message: { body: "不正な返信" } },
      headers: company_headers(@other_company),
      as: :json
    assert_response :not_found
    assert_equal 1, conversation.messages.count
  end

  test "message endpoints require the correct account type" do
    post "/company/students/#{@student.id}/messages",
      params: { message: { body: "未認証" } },
      as: :json
    assert_response :unauthorized

    post "/company/students/#{@student.id}/messages",
      params: { message: { body: "学生から開始" } },
      headers: student_headers,
      as: :json
    assert_response :unauthorized

    get "/messages", headers: company_headers, as: :json
    assert_response :unauthorized
  end

  test "rejects blank and oversized message bodies" do
    [ "   ", "a" * 2_001 ].each do |body|
      post "/company/students/#{@student.id}/messages",
        params: { message: { body: body } },
        headers: company_headers,
        as: :json

      assert_response :unprocessable_entity
    end

    assert_equal 0, Message.count
    assert_equal 0, Conversation.count
  end

  test "database prevents duplicate conversations" do
    Conversation.create!(company: @company, student: @student)

    assert_raises(ActiveRecord::RecordNotUnique) do
      Conversation.insert_all!([ {
        company_id: @company.id,
        student_id: @student.id,
        created_at: Time.current,
        updated_at: Time.current
      } ])
    end
  end

  private

  def create_company(email)
    company = Company.create!(
      name: "テスト企業",
      email: email,
      password: "password123",
      password_confirmation: "password123"
    )
    company.regenerate_api_token!
    company
  end

  def create_student(email)
    student = Student.create!(
      name: "テスト学生",
      email: email,
      password: "password123",
      password_confirmation: "password123"
    )
    student.regenerate_api_token!
    student
  end

  def company_headers(company = @company)
    { "Authorization" => "Bearer #{company.api_token}" }
  end

  def student_headers(student = @student)
    { "Authorization" => "Bearer #{student.api_token}" }
  end
end
