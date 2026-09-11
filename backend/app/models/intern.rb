class Intern < ApplicationRecord
  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  def regenerate_api_token!
    update!(api_token: SecureRandom.hex(24))
  end

  def as_json(options = {})
    super(options.merge(except: [ :password_digest, :api_token ]))
  end
end
