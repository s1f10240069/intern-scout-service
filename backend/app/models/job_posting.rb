class JobPosting < ApplicationRecord
  belongs_to :company

  before_validation :normalize_text_fields

  validates :title, presence: true, length: { maximum: 200 }
  validates :description, presence: true, length: { maximum: 10_000 }
  validates :location, :compensation, :period, :required_skills, length: { maximum: 255 }, allow_nil: true

  private

  def normalize_text_fields
    %i[title description location compensation period required_skills].each do |field|
      self[field] = self[field]&.strip.presence
    end
  end
end
