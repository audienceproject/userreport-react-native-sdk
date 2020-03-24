
#import "RNUserreportSdk.h"
#import <React/RCTUtils.h>
#import <UIKit/UIKit.h>
@import AdSupport;

@implementation RNUserreportSdk

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(getAdvertisingId:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSUUID *advertisingId = [[ASIdentifierManager sharedManager] advertisingIdentifier];
    NSString * advertisingIdStr = [advertisingId UUIDString]; 
    NSDictionary * dict = @{@"advertisingId" : advertisingIdStr};
    resolve(dict);
}

@end
