class Conversation < ApplicationRecord
  belongs_to :company
  belongs_to :student
  has_many :messages, -> { order(:created_at, :id) }, dependent: :destroy

  validates :student_id, uniqueness: { scope: :company_id }
end
