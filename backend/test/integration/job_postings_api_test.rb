require "test_helper"

class JobPostingsApiTest < ActionDispatch::IntegrationTest
  setup do
    @company = create_company("jobs-company@example.com")
    @other_company = create_company("other-jobs-company@example.com")
    @student = create_student("jobs-student@example.com")
  end

  test "company creates and updates its job posting" do
    assert_difference("JobPosting.count", 1) do
      post "/company/jobs",
        params: {
          job_posting: valid_attributes.merge(
            title: "  Railsエンジニア  ",
            company_id: @other_company.id
          )
        },
        headers: company_headers,
        as: :json
    end

    assert_response :created
    job_id = response.parsed_body["id"]
    assert_equal "Railsエンジニア", response.parsed_body["title"]
    assert_equal @company.id, response.parsed_body.dig("company", "id")

    patch "/company/jobs/#{job_id}",
      params: { job_posting: { title: "更新後タイトル" } },
      headers: company_headers,
      as: :json

    assert_response :success
    assert_equal "更新後タイトル", response.parsed_body["title"]
  end

  test "company can list and delete its job postings" do
    own_job = @company.job_postings.create!(valid_attributes)
    @other_company.job_postings.create!(valid_attributes.merge(title: "他社求人"))

    get "/company/jobs", headers: company_headers, as: :json
    assert_response :success
    assert_equal [ own_job.id ], response.parsed_body.pluck("id")

    assert_difference("JobPosting.count", -1) do
      delete "/company/jobs/#{own_job.id}", headers: company_headers, as: :json
    end
    assert_response :no_content
  end

  test "company cannot view update or delete another company job posting" do
    other_job = @other_company.job_postings.create!(valid_attributes)

    get "/company/jobs/#{other_job.id}", headers: company_headers, as: :json
    assert_response :not_found

    patch "/company/jobs/#{other_job.id}",
      params: { job_posting: { title: "不正更新" } },
      headers: company_headers,
      as: :json
    assert_response :not_found

    assert_no_difference("JobPosting.count") do
      delete "/company/jobs/#{other_job.id}", headers: company_headers, as: :json
    end
    assert_response :not_found
  end

  test "student can browse companies and job postings" do
    job = @company.job_postings.create!(valid_attributes)

    get "/companies", headers: student_headers, as: :json
    assert_response :success
    assert_includes response.parsed_body.pluck("id"), @company.id

    get "/companies/#{@company.id}", headers: student_headers, as: :json
    assert_response :success
    assert_equal @company.id, response.parsed_body.dig("company", "id")
    assert_equal job.id, response.parsed_body.dig("job_postings", 0, "id")

    get "/jobs", headers: student_headers, as: :json
    assert_response :success
    assert_includes response.parsed_body.pluck("id"), job.id

    get "/jobs/#{job.id}", headers: student_headers, as: :json
    assert_response :success
    assert_equal job.id, response.parsed_body["id"]
  end

  test "job browsing and management require the correct account type" do
    get "/jobs", as: :json
    assert_response :unauthorized

    get "/jobs", headers: company_headers, as: :json
    assert_response :unauthorized

    post "/company/jobs",
      params: { job_posting: valid_attributes },
      headers: student_headers,
      as: :json
    assert_response :unauthorized
  end

  test "rejects missing and oversized required fields without creating a job" do
    [
      valid_attributes.merge(title: "   "),
      valid_attributes.merge(description: "a" * 10_001)
    ].each do |attributes|
      assert_no_difference("JobPosting.count") do
        post "/company/jobs",
          params: { job_posting: attributes },
          headers: company_headers,
          as: :json
      end
      assert_response :unprocessable_entity
    end
  end

  private

  def valid_attributes
    {
      title: "バックエンドエンジニア",
      description: "Rails APIの開発を担当します。",
      location: "東京都",
      compensation: "時給1,500円",
      period: "3か月以上",
      required_skills: "Ruby"
    }
  end

  def create_company(email)
    company = Company.create!(
      name: "求人テスト企業",
      email: email,
      password: "password123",
      password_confirmation: "password123"
    )
    company.regenerate_api_token!
    company
  end

  def create_student(email)
    student = Student.create!(
      name: "求人閲覧学生",
      email: email,
      password: "password123",
      password_confirmation: "password123"
    )
    student.regenerate_api_token!
    student
  end

  def company_headers
    { "Authorization" => "Bearer #{@company.api_token}" }
  end

  def student_headers
    { "Authorization" => "Bearer #{@student.api_token}" }
  end
end
