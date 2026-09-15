require "test_helper"

class StudentsApiTest < ActionDispatch::IntegrationTest
  STUDENT_ATTRIBUTES = {
    name: "移行テスト学生",
    email: "migration-student@example.com",
    university: "テスト大学",
    graduation_year: 2028,
    skills: "Ruby",
    password: "password123",
    password_confirmation: "password123"
  }.freeze

  test "creates a student through the new endpoint" do
    assert_difference("Student.count", 1) do
      post "/students", params: { student: STUDENT_ATTRIBUTES }, as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal "移行テスト学生", body.dig("student", "name")
    assert body["token"].present?
    assert_not body["student"].key?("password_digest")
    assert_not body["student"].key?("api_token")
  end

  test "keeps the legacy interns endpoint compatible" do
    attributes = STUDENT_ATTRIBUTES.merge(email: "legacy-intern@example.com")

    assert_difference("Student.count", 1) do
      post "/interns", params: { intern: attributes }, as: :json
    end

    assert_response :created
    assert_equal "移行テスト学生", response.parsed_body.dig("intern", "name")
  end

  test "requires a company token to list students" do
    get "/students", as: :json
    assert_response :unauthorized

    company = Company.create!(
      name: "テスト企業",
      email: "student-list-company@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    company.regenerate_api_token!

    get "/students", headers: { "Authorization" => "Bearer #{company.api_token}" }, as: :json
    assert_response :success
  end

  test "logs in a student after the table rename" do
    Student.create!(STUDENT_ATTRIBUTES)

    post "/login", params: {
      account_type: "student",
      email: STUDENT_ATTRIBUTES[:email],
      password: STUDENT_ATTRIBUTES[:password]
    }, as: :json

    assert_response :success
    body = response.parsed_body
    assert_equal "student", body["account_type"]
    assert_equal "移行テスト学生", body.dig("student", "name")
    assert_equal body["student"], body["intern"]
    assert body["token"].present?
  end

  test "defaults legacy login requests to student" do
    Student.create!(STUDENT_ATTRIBUTES)

    post "/login", params: {
      email: STUDENT_ATTRIBUTES[:email],
      password: STUDENT_ATTRIBUTES[:password]
    }, as: :json

    assert_response :success
    assert_equal "student", response.parsed_body["account_type"]
  end

  test "logs in a company through the unified login endpoint" do
    Company.create!(
      name: "統合ログイン企業",
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
    assert_equal "統合ログイン企業", body.dig("company", "name")
    assert body["token"].present?

    get "/company_me", headers: { "Authorization" => "Bearer #{body['token']}" }, as: :json
    assert_response :success
    assert_equal "統合ログイン企業", response.parsed_body["name"]
  end

  test "rejects an unknown account type" do
    post "/login", params: {
      account_type: "unknown",
      email: "nobody@example.com",
      password: "password123"
    }, as: :json

    assert_response :unprocessable_entity
    assert_equal "アカウント種別が正しくありません", response.parsed_body["error"]
  end
end
