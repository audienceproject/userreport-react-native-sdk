package com.audienceproject.reactnative.userreport;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNUserreportSdkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNUserreportSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNUserreportSdk";
  }

  @ReactMethod
  public void getAdvertisingId(Promise result) {
    this.reactContext.runOnNativeModulesQueueThread(new RNThread(reactContext, result));
  }
}