# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

DUMMY_PASSWORD = "password123"

[
  { name: "山田太郎", email: "intern1@example.com", university: "○○大学 情報学部", graduation_year: 2027, skills: "Ruby, React" },
  { name: "佐藤花子", email: "intern2@example.com", university: "○○大学 経済学部", graduation_year: 2028, skills: "Python, SQL" }
].each do |attrs|
  Student.find_or_create_by!(email: attrs[:email]) do |student|
    student.name = attrs[:name]
    student.university = attrs[:university]
    student.graduation_year = attrs[:graduation_year]
    student.skills = attrs[:skills]
    student.password = DUMMY_PASSWORD
    student.password_confirmation = DUMMY_PASSWORD
  end
end

[
  { name: "株式会社サンプル", email: "company1@example.com" },
  { name: "テスト商事株式会社", email: "company2@example.com" }
].each do |attrs|
  Company.find_or_create_by!(email: attrs[:email]) do |company|
    company.name = attrs[:name]
    company.password = DUMMY_PASSWORD
    company.password_confirmation = DUMMY_PASSWORD
  end
end
