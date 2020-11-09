import { NativeModules, Dimensions } from 'react-native';

const { RNUserreportSdk } = NativeModules;


import { Platform } from 'react-native';
import { 
  getBundleId,
  getBuildNumber,
  getUniqueId,
  getSystemName,
  getSystemVersion,
  getDeviceId,
  getBrand,
  getModel
} from 'react-native-device-info';

let debug = false;

const warn = (...args) => {
  if (debug) {
    console.warn(...args);
  }
}

const error = (...args) => {
  if (debug) {
    console.error(...args);
  }
}

const info = (...args) => {
    if (debug) {
      console.info(...args);
    }
  }

let advertisingId;
let sakData;

RNUserreportSdk.getAdvertisingId()
    .then(data => {
        advertisingId = data.advertisingId;
        if (!advertisingId) {
          warn('Unable to get advertizing ID');
          advertisingId = '00000000-0000-0000-0000-000000000000';
        }
    })
    .catch(() => {
        warn('Unable to get advertizing ID');
        advertisingId = '00000000-0000-0000-0000-000000000000';
    });

let bundleId = getBundleId();
if (!bundleId) {
  warn('Unable to get device bundle ID');
  bundleId = '';
}

let buildNumber = getBuildNumber();
if (!buildNumber) {
  warn('Unable to get device build number');
  buildNumber = '';
}

let uniqueId = getUniqueId();
if (!uniqueId) {
  warn('Unable to get device unique ID');
  uniqueId = '';
}

let anonymousTracking = false;

const os = Platform.OS;
const systemName =  getSystemName();
const systemVersion = getSystemVersion();
const deviceId = getDeviceId();
const brand = getBrand();
const model = getModel();
const screen = Dimensions.get('screen');



const track = (trackingCode, consent) => {
  const random = Math.floor(Math.random() * 10 * 1000 * 1000 * 1000);

  const domain = anonymousTracking ? 'visitanalytics.dnt-userreport.com' : 'visitanalytics.userreport.com';
  let url = `https://${domain}/hit.gif` +
    `?t=${trackingCode}` +
    `&r=${random}` +
    `&d=${advertisingId}` +
    `&med=${encodeURIComponent([bundleId, buildNumber].filter(Boolean).join('/'))}` +
    `&idfv=${uniqueId}` +
    `&os=${encodeURIComponent(systemName)}` +
    `&osv=${encodeURIComponent(systemVersion)}` +
    `&dn=${encodeURIComponent([brand, model, deviceId].join(' '))}` + 
    `&dr=${Math.round(screen.width * screen.scale )}x${Math.round(screen.height * screen.scale)}`;
    
    if(consent && consent !== ''){
      url +=`&iab_consent=${consent}`;
    }


  fetch(url)
    .then(response => info(response))
    .catch(() => error('Tracking request failed'));
};

const configure = (sakId, mediaId, settings) => {
  debug = settings && !!settings.debug;

  if (os !== "ios" && os !== "android") {
    return error('Unsupported OS plaform');
  }

  if (
    !sakId || typeof sakId !== 'string' ||
    !mediaId || typeof mediaId !== 'string' ||
    settings && typeof settings !== 'object'
  ) {
    return error('Invalid configure params specified');
  }

  const domain = anonymousTracking ? 'sak.dnt-userreport.com' : 'sak.userreport.com';
  const url = `https://${domain}/${sakId}/media/${mediaId}/${os}.json`;
  fetch(url)
    .then(response => (
      response.json()
        .then(json => (
          sakData = json
        ))
        .catch(() => error('Unable to parse SAK configuration'))
    ))
    .catch(() => error('Unable to load SAK configuration'));
}

const setAnonymousTracking = isEnabled => {
  anonymousTracking = isEnabled;
};

const trackScreenView = () => {
  if (!sakData) {
    return error('UserReport SDK is not configured properly')
  }

  if (!sakData.kitTcode) {
    return error('Media not configured properly');
  }
  return track(sakData.kitTcode, sakData.hardcodedConsent);
};

const trackSectionScreenView = sectionId => {
  if (!sakData) {
    return error('UserReport SDK is not configured properly');
  }

  if(!sakData.sections || !sakData.sections[sectionId]) {
    return error('Section is missing in this media');
  }

  return track(sakData.sections[sectionId], sakData.hardcodedConsent);
};

export default {
  configure,
  setAnonymousTracking,
  trackScreenView,
  trackSectionScreenView,
};
