class Rack::Attack
  # Limita tentativas de login: 5 por minuto por IP
  throttle("login/ip", limit: 5, period: 60) do |req|
    req.ip if req.path == "/login" && req.post?
  end

  # Limita criação de conta: 3 por hora por IP
  throttle("registration/ip", limit: 3, period: 3600) do |req|
    req.ip if req.path == "/registration" && req.post?
  end

  # Limita criação de reviews/diary/watchlist/follow: 20 por minuto por IP
  throttle("writes/ip", limit: 20, period: 60) do |req|
    req.ip if req.post? || req.delete? || req.patch?
  end

  self.throttled_responder = lambda do |request|
    [429, { "Content-Type" => "text/plain" }, ["Muitas requisições. Tente novamente em instantes.\n"]]
  end
end