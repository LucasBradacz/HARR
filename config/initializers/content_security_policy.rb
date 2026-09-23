Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.img_src     :self, "https://image.tmdb.org", :data
    policy.style_src   :self, :unsafe_inline
    policy.script_src  :self
    policy.connect_src :self
  end
end