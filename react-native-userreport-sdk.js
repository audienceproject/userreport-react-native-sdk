import ReactNative from 'react-native'; // eslint-disable-line import/no-unresolved
import ReactNativeDeviceInfo from 'react-native-device-info'; // eslint-disable-line import/no-unresolved

/* debug */

let useDebug = false;

const debugInfo = (value) => {
  if (useDebug) console.info(`UR SDK :: ${value}`); // eslint-disable-line no-console
};
const debugError = (value) => {
  if (useDebug) console.error(`UR SDK :: ${value}`); // eslint-disable-line no-console
};

export const setDebug = (value) => {
  if (value) { // log if debug enabled
    useDebug = value;
  }
  debugInfo(`Debug ${value ? 'enabled' : 'disabled'}`);
  if (!value) { // log if debug disabled
    useDebug = value;
  }
};

/* dnt */

let useAnonymousTracking = false;

export const setAnonymousTracking = (value) => {
  useAnonymousTracking = value;
  debugInfo(`Anonymous tracking ${value ? 'enabled' : 'disabled'}`);
};

/* idfa dialog */

let useIdfaDialog = true;

export const setIdfaDialog = (value) => {
  useIdfaDialog = value;
  debugInfo(`IDFA dialog ${value ? 'enabled' : 'disabled'}`);
};

const loadIdfa = async () => {
  const nativeModule = ReactNative.NativeModules.RNAdvertisingId;
  const nativeMethod = ReactNative.Platform.OS !== 'ios' || useIdfaDialog
    ? nativeModule.getAdvertisingId : nativeModule.getAdvertisingIdLegacy;

  try {
    const data = await nativeMethod();
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
  const appVersion = ReactNativeDeviceInfo.getVersion();

  const systemName = ReactNativeDeviceInfo.getSystemName();
  const systemVersion = ReactNativeDeviceInfo.getSystemVersion();

  const deviceName = `${ReactNativeDeviceInfo.getBrand()} ${ReactNativeDeviceInfo.getDeviceId()}`;
  const screen = ReactNative.Dimensions.get('screen');
  const screenWidth = Math.round(screen.width * screen.scale);
  const screenHeight = Math.round(screen.height * screen.scale);
  const deviceResolution = `${screenWidth}x${screenHeight}`;

  const path = `https://${domain}/hit.gif`;
  const params = `?t=${encodeURIComponent(trackingCode)}` // eslint-disable-line prefer-template
    + `&rnd=${random}`
    + (!useAnonymousTracking && idfa ? `&d=${encodeURIComponent(idfa)}` : '')
    + (!useAnonymousTracking && idfv ? `&idfv=${encodeURIComponent(idfv)}` : '')
    + `&appid=${encodeURIComponent(bundleId)}`
    + `&appver=${encodeURIComponent(appVersion)}`
    + `&os=${encodeURIComponent(systemName)}`
    + `&osv=${encodeURIComponent(systemVersion)}`
    + `&dn=${encodeURIComponent(deviceName)}`
    + `&dr=${encodeURIComponent(deviceResolution)}`
    + (consentString ? `&gdpr_consent=${encodeURIComponent(consentString)}` : '');

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
  setIdfaDialog,
  configure,
  trackScreenView,
  trackSectionScreenView,
};
