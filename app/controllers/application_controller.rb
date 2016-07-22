class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  before_action :verified_request?

  def verified_request?
	  !protect_against_forgery? || request.get? || request.head? ||
	    form_authenticity_token == params[request_forgery_protection_token] ||
	    form_authenticity_token == request.headers['X-CSRF-Token']
  end
end
