require "test_helper"

class StudentsApiTest < ActionDispatch::IntegrationTest
  STUDENT_ATTRIBUTES = {
    name: "Student Test",
    email: "student@example.com",
    university: "Example University",
    graduation_year: 2028,
    skills: "Ruby",
    password: "password123",
    password_confirmation: "password123"
  }.freeze

  test "creates a student" do
    assert_difference("Student.count", 1) do
      post "/students", params: { student: STUDENT_ATTRIBUTES }, as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal "Student Test", body.dig("student", "name")
    assert body["token"].present?
    assert_not body["student"].key?("password_digest")
    assert_not body["student"].key?("api_token")
  end

  test "requires a company token to list students" do
    get "/students", as: :json
    assert_response :unauthorized

    company = Company.create!(
      name: "Example Company",
      email: "student-list-company@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    company.regenerate_api_token!

    get "/students", headers: { "Authorization" => "Bearer #{company.api_token}" }, as: :json
    assert_response :success
  end

  test "logs in a student" do
    Student.create!(STUDENT_ATTRIBUTES)

    post "/login", params: {
      account_type: "student",
      email: STUDENT_ATTRIBUTES[:email],
      password: STUDENT_ATTRIBUTES[:password]
    }, as: :json

    assert_response :success
    body = response.parsed_body
    assert_equal "student", body["account_type"]
    assert_equal "Student Test", body.dig("student", "name")
    assert body["token"].present?
    assert_equal %w[account_type student token], body.keys.sort
  end

  test "logs in a company through the unified login endpoint" do
    Company.create!(
      name: "Unified Company",
      email: "unified-company@example.com",
      password: "password123",
      password_confirmation: "password123"
    )

    post "/login", params: {
      account_type: "company",
      email: "unified-company@example.com",
      password: "password123"
    }, as: :json

    assert_response :success
    body = response.parsed_body
    assert_equal "company", body["account_type"]
    assert_equal "Unified Company", body.dig("company", "name")
    assert body["token"].present?

    get "/company_me", headers: { "Authorization" => "Bearer #{body['token']}" }, as: :json
    assert_response :success
    assert_equal "Unified Company", response.parsed_body["name"]
  end

  test "rejects missing or unknown account types" do
    [ nil, "unknown" ].each do |account_type|
      post "/login", params: {
        account_type: account_type,
        email: "nobody@example.com",
        password: "password123"
      }, as: :json

      assert_response :unprocessable_entity
    end
  end
end
