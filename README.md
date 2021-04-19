# UserReport React Native SDK

Running UserReport in React Native applications.

## Supported Platforms

* Android
* iOS

## Installation

Install [NPM package](https://www.npmjs.com/package/@audienceproject/react-native-userreport-sdk) and dependencies:

```sh
npm install --save @audienceproject/react-native-userreport-sdk react-native react-native-device-info
```

### On Android

Update your `AndroidMainfest.xml` and declare that your app is Ad Manager App:

```xml
<manifest ...>
    <application ...>

        <meta-data
            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
            android:value="true"/>

    </application>
</manifest>
```

### On iOS

Install Pods:

```sh
cd ios && pod install && cd ..
```

Update your `Info.plist` with message that will inform the user why app is requesting permission to use data for tracking:

```xml
<plist ...>
    <dict ...>

        <key>NSUserTrackingUsageDescription</key>
        <string>This identifier will be used to deliver personalized ads to you.</string>

    </dict>
</plist>
```

## Usage

See our [demo application source](demo/App.js) for more examples.

Import SDK into your application and we are ready to go:

```js
import UserReport from '@audienceproject/react-native-userreport-sdk';
```

### Configure

Before making any tracking requests you need to configure SDK with `SAK_ID` and `MEDIA_ID` (can be found on Media Settings page in UserReport UI):

```js
UserReport.configure(SAK_ID, MEDIA_ID);
```

### Tracking

There are two types of tracking:

* Screen view tracking
* Section view tracking

If your application has one single topic, it can be tracked using screen view tracking command:

```js
UserReport.trackScreenView();
```

If your application has different sections (for instance “Health”, “World news” and “Local news”), then it should be tracked using both screen view command and section view tracking command with specific `SECTION_ID` (can be found on Media Settings page in UserReport UI):

```js
UserReport.trackScreenView();
UserReport.trackSectionScreenView(SECTION_ID);
```

### Anonymous Tracking

In anonymous tracking mode all requests will be fired to the do-not-track domain and IDFA will never be sent:

```js
UserReport.setAnonymousTracking(true);
```

### Debug Mode

In debug mode SDK will log debugging information into console:

```js
UserReport.setDebug(true);
```

#### IDFA and iOS 14

Starting iOS 14.5 you’ll need to [receive user’s permission](https://developer.apple.com/app-store/user-privacy-and-data-use/) to access device advertising identifier. That behavior can be disabled for older iOS versions:

```js
UserReport.setIdfaDialog(false);
```
