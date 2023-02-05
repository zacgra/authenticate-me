class Api::SessionsController < ApplicationController
  def show
    if current_user
      @user = current_user
      render 'api/users/show'
    else
      render json: { user: nil }
    end
  end

  def create
    credentials, password = session_params.values_at(:credentials, :password)
    @user = User.find_by_credentials(credentials, password)
    if @user
      login!(@user)
      render 'api/users/show'
    else
      render json: { errors: ['The provided credentials were invalid.'] }, status: :unauthorized
    end
  end

  def destroy
    logout! if current_user
    render json: { message: 'success' }
  end

  def session_params
    params.require(:session).permit(:credentials, :password)
  end
end
