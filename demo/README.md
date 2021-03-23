# Demo for UserReport React Native SDK

Install dependencies:

```sh
yarn
```

Run Android demo:

```sh
yarn android
```

Run iOS demo:

```sh
cd ios && pod install && cd ..
yarn ios
```

To update dependencies and re-initialize demo application:

```sh
yarn upgrade-interactive --latest

mv demo demo-old
react-native init UserReportReactNativeSDK --skip-install
mv UserReportReactNativeSDK demo
cp demo-old/README.md demo
cp demo-old/App.js demo
# update permissions for demo/ios/UserReportReactNativeSDK/Info.plist
# update permissions for demo/android/app/src/main/AndroidManifest.xml
# review diffs
```
