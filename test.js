/* eslint-env jest */

/* mocks */

jest.mock('react-native', () => ({
  __esModule: true,

  default: {
    Platform: {
      OS: 'ios',
    },

    Dimensions: {
      get: (type) => {
        if (type === 'screen') {
          return {
            width: 100,
            height: 200,
            scale: 1.5,
          };
        }

        return '__NativeDimensions__';
      },
    },

    NativeModules: {
      RNAdvertisingId: {
        getAdvertisingId: () => ({
          advertisingId: '__NativeAdvertisingId__',
        }),

        getAdvertisingIdLegacy: () => ({
          advertisingId: '__NativeAdvertisingLegacyId__',
        }),
      },
    },
  },
}), { virtual: true });

jest.mock('react-native-device-info', () => ({
  __esModule: true,

  default: {
    getUniqueId: () => '__DeviceInfoUniqueId__',
    getBundleId: () => '__DeviceInfoBundleId__',

    getSystemName: () => '__DeviceInfoSystemName__',
    getSystemVersion: () => '__DeviceInfoSystemVersion__',

    getBrand: () => '__DeviceInfoBrand__',
    getDeviceId: () => '__DeviceInfoDeviceId__',
  },
}), { virtual: true });

global.fetch = jest.fn((url) => Promise.resolve({
  json: () => Promise.resolve(
    url.startsWith('https://sak.') ? { // eslint-disable-line no-nested-ternary
      kitTcode: '__FetchMediaCode__',
      sections: {
        sectionId: '__FetchSectionCode__',
      },
      hardcodedConsent: '__FetchConsent__',
    } : {},
  ),
}));

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
});

afterEach(() => {
  jest.clearAllMocks();
});

/* imports */

const ReactNative = require('react-native'); // eslint-disable-line import/no-unresolved
const UserReport = require('.');

/* tests */

test('regular mode', async () => {
  await Promise.all([
    UserReport.configure('publisherId', 'mediaId'),
    UserReport.trackScreenView(),
    UserReport.trackSectionScreenView('sectionId'),
  ]);

  expect(fetch).toHaveBeenCalledTimes(3);

  expect(fetch).toHaveBeenNthCalledWith(1,
    'https://sak.userreport.com/publisherId/media/mediaId/ios.json');

  expect(fetch).toHaveBeenNthCalledWith(2,
    'https://visitanalytics.userreport.com/hit.gif'
      + '?t=__FetchMediaCode__'
      + '&r=4fzzzxjylrx'
      + '&d=__NativeAdvertisingId__'
      + '&idfv=__DeviceInfoUniqueId__'
      + '&med=__DeviceInfoBundleId__'
      + '&os=__DeviceInfoSystemName__'
      + '&osv=__DeviceInfoSystemVersion__'
      + '&dn=__DeviceInfoBrand__%20__DeviceInfoDeviceId__'
      + '&dr=150x300'
      + '&iab_consent=__FetchConsent__');

  expect(fetch).toHaveBeenNthCalledWith(3,
    'https://visitanalytics.userreport.com/hit.gif'
      + '?t=__FetchSectionCode__'
      + '&r=4fzzzxjylrx'
      + '&d=__NativeAdvertisingId__'
      + '&idfv=__DeviceInfoUniqueId__'
      + '&med=__DeviceInfoBundleId__'
      + '&os=__DeviceInfoSystemName__'
      + '&osv=__DeviceInfoSystemVersion__'
      + '&dn=__DeviceInfoBrand__%20__DeviceInfoDeviceId__'
      + '&dr=150x300'
      + '&iab_consent=__FetchConsent__');
});

test('legacy idfa', async () => {
  UserReport.setIdfaDialog(false);

  await Promise.all([
    UserReport.configure('publisherId', 'mediaId'),
    UserReport.trackScreenView(),
  ]);

  expect(fetch).toHaveBeenNthCalledWith(2,
    'https://visitanalytics.userreport.com/hit.gif'
      + '?t=__FetchMediaCode__'
      + '&r=4fzzzxjylrx'
      + '&d=__NativeAdvertisingLegacyId__'
      + '&idfv=__DeviceInfoUniqueId__'
      + '&med=__DeviceInfoBundleId__'
      + '&os=__DeviceInfoSystemName__'
      + '&osv=__DeviceInfoSystemVersion__'
      + '&dn=__DeviceInfoBrand__%20__DeviceInfoDeviceId__'
      + '&dr=150x300'
      + '&iab_consent=__FetchConsent__');
});

test('dnt mode', async () => {
  ReactNative.default.Platform.OS = 'android';

  UserReport.setAnonymousTracking(true);

  await Promise.all([
    UserReport.configure('publisherId', 'mediaId'),
    UserReport.trackScreenView(),
    UserReport.trackSectionScreenView('sectionId'),
  ]);

  expect(fetch).toHaveBeenCalledTimes(3);

  expect(fetch).toHaveBeenNthCalledWith(1,
    'https://sak.dnt-userreport.com/publisherId/media/mediaId/android.json');

  expect(fetch).toHaveBeenNthCalledWith(2,
    'https://visitanalytics.dnt-userreport.com/hit.gif'
      + '?t=__FetchMediaCode__'
      + '&r=4fzzzxjylrx'
      + '&med=__DeviceInfoBundleId__'
      + '&os=__DeviceInfoSystemName__'
      + '&osv=__DeviceInfoSystemVersion__'
      + '&dn=__DeviceInfoBrand__%20__DeviceInfoDeviceId__'
      + '&dr=150x300'
      + '&iab_consent=__FetchConsent__');

  expect(fetch).toHaveBeenNthCalledWith(3,
    'https://visitanalytics.dnt-userreport.com/hit.gif'
      + '?t=__FetchSectionCode__'
      + '&r=4fzzzxjylrx'
      + '&med=__DeviceInfoBundleId__'
      + '&os=__DeviceInfoSystemName__'
      + '&osv=__DeviceInfoSystemVersion__'
      + '&dn=__DeviceInfoBrand__%20__DeviceInfoDeviceId__'
      + '&dr=150x300'
      + '&iab_consent=__FetchConsent__');
});
