require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNUserReportSDK"
  s.version      = package['version']
  s.summary      = package['description']
  s.source       = { :git => package['repository']['url'], :tag => "v#{s.version}" }
  s.authors      = package['author']
  s.license      = package['license']
  s.homepage     = package['homepage']

  s.platform     = :ios, "7.0"
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
end
