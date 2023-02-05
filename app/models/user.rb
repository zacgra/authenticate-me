# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  username        :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord
  has_secure_password
  before_validation :ensure_session_token

  validates :username, uniqueness: true, length: { in: 3..30 },
                       format: { without: URI::MailTo::EMAIL_REGEXP, message: 'cannot be an email address' }
  validates :email, uniqueness: true, length: { in: 3..255 },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: 'must be a valid email address' }
  validates :session_token, presence: true, uniqueness: true
  validates :password, length: { in: 6..255 }, allow_nil: true

  def self.generate_unique_session_token
    loop do
      token = SecureRandom.urlsafe_base64(16)
      return token unless User.exists?(session_token: token)
    end
  end

  def self.find_by_credentials(credentials, password)
    is_email = credentials.match(URI::MailTo::EMAIL_REGEXP)
    user = is_email ? User.find_by(email: credentials) : User.find_by(username: credentials)
    user ? user.authenticate(password) : false
  end

  def reset_session_token!
    self.session_token = self.class.generate_unique_session_token
    save!
    session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.session_token = self.class.generate_unique_session_token
  end
end
