require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  # Assets
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  # Active Storage — disco local (Render free tier; arquivos somem no redeploy)
  config.active_storage.service = :local

  # SSL — Render termina SSL no proxy
  config.assume_ssl = true
  config.force_ssl  = true

  # Logs para STDOUT (padrão Render/12-factor)
  config.log_tags  = [ :request_id ]
  config.logger    = ActiveSupport::TaggedLogging.logger(STDOUT)
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.silence_healthcheck_path = "/up"
  config.active_support.report_deprecations = false

  # Cache e fila simples — sem Solid (banco único no Render PostgreSQL)
  config.cache_store = :memory_store
  config.active_job.queue_adapter = :inline

  # I18n
  config.i18n.fallbacks = true

  config.active_record.dump_schema_after_migration = false
  config.active_record.attributes_for_inspect = [ :id ]
end
