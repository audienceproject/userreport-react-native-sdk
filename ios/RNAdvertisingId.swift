//
//  RNAdvertisingId.swift
//
//  Created by App Like on 28.09.17.
//

import AdSupport
import AppTrackingTransparency

@objc(RNAdvertisingId)
class RNAdvertisingId: NSObject {
    @objc
    func getAdvertisingId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        isAppTrackingEnabled(requestPermission: true){(isAdvertisingTrackingEnabled: Bool) -> Void in
            //use the image that was just retrieved
            let response: NSMutableDictionary = [
                "isLimitAdTrackingEnabled" : !isAdvertisingTrackingEnabled,
                "advertisingId" : ""
            ]

            if (isAdvertisingTrackingEnabled) {
                let idfa : String = ASIdentifierManager.shared().advertisingIdentifier.uuidString
                response["advertisingId"] = idfa
            }

            resolve(response)
        }


    }

    func isAppTrackingEnabled(requestPermission: Bool = false, result: @escaping (_ isAuthorized: Bool) -> Void){
        if #available(iOS 14, *) {
            if(!requestPermission) {
                result(ATTrackingManager.trackingAuthorizationStatus == .authorized);
            }
            else {
                ATTrackingManager.requestTrackingAuthorization { status in
                    if (status == .authorized){
                        result(true);
                    }
                    else {
                        result(false);
                    }
                }
            }
        }
        else {
            result(ASIdentifierManager.shared().isAdvertisingTrackingEnabled);
        }
    }

    @objc
    func getAdvertisingIdLegacy(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let isAdvertisingTrackingEnabled : Bool = ASIdentifierManager.shared().isAdvertisingTrackingEnabled

        let response: NSMutableDictionary = [
            "isLimitAdTrackingEnabled" : !isAdvertisingTrackingEnabled,
            "advertisingId" : ""
        ]

        if (isAdvertisingTrackingEnabled) {
            let idfa : String = ASIdentifierManager.shared().advertisingIdentifier.uuidString
            response["advertisingId"] = idfa
        }

        resolve(response)
    }
}
