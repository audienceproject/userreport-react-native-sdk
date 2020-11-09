# Supported plarforms
- iOS
- Android


# Setup dependencies

```bash
npm install --save @apr/react-native-userreport-sdk react-native-device-info
```

#### Android
Update your `AndroidMainfest.xml` and declare that your app is an Ad Manager app, as instructed on [Google's Ad Manager guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/quick-start#update_your_androidmanifestxml):
```xml
<manifest>
    <application>
        <meta-data
            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
            android:value="true"/>
    </application>
</manifest>
```

## Setup of [react-native-device-info](https://www.npmjs.com/package/react-native-device-info)

### Automatic
```bash
react-native link react-native-device-info
react-native link @apr/react-native-userreport-sdk
cd ios
pod install
```
### Manual 
Follow the link: https://www.npmjs.com/package/react-native-device-info

# Usage for screen/section tracking

Configure the UserReport ReactNative SDK using your `PUBLISHER_ID` and your `MEDIA_ID`.

Your `PUBLISHER_ID` and `MEDIA_ID` can be found on the Media Setting page in UserReport.


```javascript
// Configure
UserReport.configure("PUBLISHER_ID","MEDIA_ID");
```

Note: only Android and iOS supported as a platform. So make sure you invoke `configure` only on these platforms. On other platforms, it will return an error.


Example: 

```javascript
//App.js
import {Platform} from 'react-native';
import UserReport from '@apr/react-native-userreport-sdk'

export default class App extends Component{
    componentDidMount() {
        var mediaId = Platform.OS === 'ios' ?
         "MEDIA_ID_FOR_IOS": "MEDIA_ID_FOR_ANDROID";
      
        UserReport.configure("PUBLISHER_ID",mediaId);
    }
}
```

While development it is recommended to set `debug` flag in the `settings` parameter, so you will be able to understand that it is configured correctly, in case of errors they will be written to the console. 
Example:

```javascript
UserReport.configure("PUBLISHER_ID","MEDIA_ID",  { debug: true });
```

There are two types of tracking:
  - Screen view tracking (`UserReport.trackScreenView()`)
  - Section view tracking (`UserReport.trackSectionScreenView()`)

If a media (website) has one single topic, it can be tracked using `UserReport.trackScreenView()`.

If a website has different sections, for instance *Health*, *World news* and *Local news*, then it should be tracked using `UserReport.trackSectionScreenView(sectionId)`.  The `sectionId` for a particular section can be found on the Media Setting page in UserReport.
Even when `UserReport.trackSectionScreenView(sectionId)` is used `UserReport.trackScreenView()` should be invoked as well.

Example of tracking screen view:
```javascript
export default class ScreenView extends Component {
    componentDidMount() {
        UserReport.trackScreenView();
    }

    render() {...}
}
```


Example of tracking section screen view:
```javascript
export default class ScreenView extends Component {
    componentDidMount() {
        UserReport.trackScreenView();
        UserReport.trackSectionScreenView(sectionId);
    }

    render() {...}
}
```

## Anonymous tracking

You can configure SDK to use anonymous tracking using `setAnonymousTracking` command:

```javascript
import UserReport from '@apr/react-native-userreport-sdk';

UserReport.setAnonymousTracking(true);
```
