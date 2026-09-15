class Message < ApplicationRecord
  SENDER_TYPES = %w[company student].freeze
  MAX_BODY_LENGTH = 2_000

  belongs_to :conversation, touch: true

  before_validation :normalize_body

  validates :sender_type, inclusion: { in: SENDER_TYPES }
  validates :body, presence: true, length: { maximum: MAX_BODY_LENGTH }

  private

  def normalize_body
    self.body = body&.strip
  end
end
