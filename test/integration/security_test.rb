require "test_helper"

class SecurityTest < ActionDispatch::IntegrationTest

  test "cadastro com dados invalidos retorna 400" do
    get registrations_create_url, params: {
      user: {
        username: "",
        email: "email-invalido",
        password: "Senha123!",
        password_confirmation: "Senha123!"
      }
    }

    assert_response :bad_request
  end

end