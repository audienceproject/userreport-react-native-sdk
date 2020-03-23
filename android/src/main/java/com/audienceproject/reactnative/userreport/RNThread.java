package com.audienceproject.reactnative.userreport;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.ads.identifier.AdvertisingIdClient.Info;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;

import java.io.IOException;

public class RNThread implements Runnable {
    ReactApplicationContext context;
    Promise result;

    public RNThread(ReactApplicationContext reactContext, Promise promise) {
        this.context = reactContext;
        this.result = promise;
    }

    @Override
    public void run() {
        try {
            Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(context);
            WritableMap map = Arguments.createMap();
            map.putString("advertisingId", adInfo.getId());
            result.resolve(map);
        } catch (IOException e) {
            result.reject(e);
        } catch (GooglePlayServicesNotAvailableException e) {
            result.reject(e);
        } catch (GooglePlayServicesRepairableException e) {
            result.reject(e);
        }
    }
}