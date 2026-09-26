require "test_helper"

# Testes de segurança da aplicação:
# - CSRF
# - rate limiting contra força bruta/spam
# - validações com HTTP 400 e mensagens de erro
# - entradas com caracteres de injeção tratadas com segurança
# - rotas críticas protegidas por autenticação
class SecurityTest < ActionDispatch::IntegrationTest
  test "requisição de login sem token de autenticidade é rejeitada quando a proteção CSRF está ativa" do
    original = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    begin
      post session_url, params: { username: "alice", password: "Senha@123" }
      assert_response :unprocessable_entity
    ensure
      ActionController::Base.allow_forgery_protection = original
    end
  end

  test "rate limiting bloqueia tentativas excessivas de login (proteção contra força bruta)" do
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

    begin
      5.times do
        post session_url, params: { username: "alice", password: "senha-errada" }
      end
      post session_url, params: { username: "alice", password: "senha-errada" }
      assert_response :too_many_requests
    ensure
      Rack::Attack.enabled = false
    end
  end

  test "rate limiting bloqueia excesso de tentativas de cadastro de conta" do
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

    begin
      3.times do |i|
        post registration_url, params: {
          user: {
            username: "spam#{i}",
            email: "spam#{i}@example.com",
            password: "Senha@123",
            password_confirmation: "Senha@123"
          }
        }
      end

      post registration_url, params: {
        user: {
          username: "spam_extra",
          email: "spam_extra@example.com",
          password: "Senha@123",
          password_confirmation: "Senha@123"
        }
      }

      assert_response :too_many_requests
    ensure
      Rack::Attack.enabled = false
    end
  end

  test "cadastro com dados inválidos retorna 400 e mensagem de validação" do
    post registration_url, params: {
      user: {
        username: "",
        email: "",
        password: "",
        password_confirmation: ""
      }
    }

    assert_response :bad_request
    assert_select "li", minimum: 1
  end

  test "tentativa de injeção no login retorna erro seguro" do
    payload = %q{' OR '1'='1' --}

    post session_url, params: {
      username: payload,
      password: payload
    }

    assert_response :bad_request
    assert_includes response.body, "Usuário ou senha incorretos."
  end

  test "rota de seguir usuário exige autenticação" do
    post follow_url(followed_id: users(:two).id)

    assert_redirected_to new_session_url
  end
end
