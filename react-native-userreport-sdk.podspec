require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/audienceproject/userreport-react-native-sdk.git", :tag => "v#{s.version}" }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true
  s.swift_version= "4.2"
  s.dependency "React"
end
