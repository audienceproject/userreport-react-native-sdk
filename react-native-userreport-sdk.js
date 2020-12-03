import ReactNative from 'react-native';
import ReactNativeDeviceInfo from 'react-native-device-info';

/* debug */

let useDebug = false;

const debugInfo = (value) => {
  if (useDebug) console.info(`UR SDK :: ${value}`); // eslint-disable-line no-console
};
const debugError = (value) => {
  if (useDebug) console.error(`UR SDK :: ${value}`); // eslint-disable-line no-console
};

export const setDebug = (value) => {
  useDebug = value;
  debugInfo(`Debug ${value ? 'enabled' : 'disabled'}`);
};

/* dnt */

let useAnonymousTracking = false;

export const setAnonymousTracking = (value) => {
  useAnonymousTracking = value;
  debugInfo(`Anonymous tracking ${value ? 'enabled' : 'disabled'}`);
};

/* idfa */

let useIdfa = true;

export const setIdfa = (value) => {
  useIdfa = value;
  debugInfo(`IDFA ${value ? 'enabled' : 'disabled'}`);
};

const loadIdfa = async () => {
  if (!useIdfa) {
    return '';
  }

  try {
    const data = await ReactNative.NativeModules.RNAdvertisingId.getAdvertisingId(); // FIXME: https://github.com/applike/react-native-advertising-id/pull/26
    return data.advertisingId || '';
  } catch (error) {
    return '';
  }
};

/* configure */

let configurePromiseResolve;
let configurePromiseReject;
const configurePromise = new Promise((resolve, reject) => {
  configurePromiseResolve = resolve;
  configurePromiseReject = reject;
});

export const configure = async (publisherId, mediaId) => {
  const domain = useAnonymousTracking
    ? 'sak.dnt-userreport.com'
    : 'sak.userreport.com';

  const platformOs = ReactNative.Platform.OS;
  if (platformOs !== 'ios' && platformOs !== 'android') {
    debugError(`Platform ${platformOs} is not supported`);
  }

  const url = `https://${domain}/${publisherId}/media/${mediaId}/${platformOs}.json`;
  debugInfo(`Loading media configuration ${url}`);

  try {
    const result = await fetch(url);
    const json = await result.json();
    return configurePromiseResolve(json);
  } catch (error) {
    return configurePromiseReject(error);
  }
};

/* tracking */

const fireTrackingPixel = async (trackingCode, consentString) => {
  const domain = useAnonymousTracking
    ? 'visitanalytics.dnt-userreport.com'
    : 'visitanalytics.userreport.com';

  const random = Math.random().toString(36).slice(2);
  const idfa = await loadIdfa();
  const idfv = ReactNativeDeviceInfo.getUniqueId();
  const bundleId = ReactNativeDeviceInfo.getBundleId();

  const systemName = ReactNativeDeviceInfo.getSystemName();
  const systemVersion = ReactNativeDeviceInfo.getSystemVersion();

  const deviceName = `${ReactNativeDeviceInfo.getBrand()} ${ReactNativeDeviceInfo.getDeviceId()}`;
  const screen = ReactNative.Dimensions.get('screen');
  const screenWidth = Math.round(screen.width * screen.scale);
  const screenHeight = Math.round(screen.height * screen.scale);
  const deviceResolution = `${screenWidth}x${screenHeight}`;

  const path = `https://${domain}/hit.gif`;
  const params = `?t=${encodeURIComponent(trackingCode)}` // eslint-disable-line prefer-template
    + `&r=${random}`
    + (!useAnonymousTracking && idfa ? `&d=${encodeURIComponent(idfa)}` : '')
    + (!useAnonymousTracking && idfv ? `&idfv=${encodeURIComponent(idfv)}` : '')
    + `&med=${encodeURIComponent(bundleId)}`
    + `&os=${encodeURIComponent(systemName)}`
    + `&osv=${encodeURIComponent(systemVersion)}`
    + `&dn=${encodeURIComponent(deviceName)}`
    + `&dr=${encodeURIComponent(deviceResolution)}`
    + (consentString ? `&iab_consent=${encodeURIComponent(consentString)}` : '');

  const url = path + params;
  debugInfo(`Firing tracking pixel ${url}`);

  return fetch(url);
};

export const trackScreenView = async () => {
  const { kitTcode, hardcodedConsent } = await configurePromise;
  return fireTrackingPixel(kitTcode, hardcodedConsent);
};

export const trackSectionScreenView = async (sectionId) => {
  const { sections, hardcodedConsent } = await configurePromise;
  const sectionTcode = sections && sections[sectionId];
  if (!sectionTcode) {
    debugError(`Unable to find section for ${sectionId}`);
    return Promise.reject();
  }

  return fireTrackingPixel(sectionTcode, hardcodedConsent);
};

/* exports */

export default {
  setDebug,
  setAnonymousTracking,
  setIdfa,
  configure,
  trackScreenView,
  trackSectionScreenView,
};
