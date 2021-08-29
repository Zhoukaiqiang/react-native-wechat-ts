package com.reactnativewechatts;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

@ReactModule(name = WechatTsModule.NAME)
public class WechatTsModule extends ReactContextBaseJavaModule {
  public static final String NAME = "WechatTs";

  private IWXAPI api = null;
  private final static String NOT_REGISTERED = "registerApp required.";
  private final static String INVOKE_FAILED = "WeChat API invoke returns false.";
  private final static String INVALID_ARGUMENT = "invalid argument.";
  private String appId;

  public WechatTsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    promise.resolve(a * b * 3);
  }

  public static native int nativeMultiply(int a, int b);


  @ReactMethod
  public void registerApp(String appid, Promise promise) {
    this.appId = appid;
    api = WXAPIFactory.createWXAPI(this.getReactApplicationContext().getBaseContext(),appId,false);
    promise.resolve(api.registerApp(appid));
  }
  public static native boolean nativeRegisterApp(String appId, Promise promise);

  @ReactMethod
  public void isWXAppInstalled(Promise promise) {
    if (api == null) {
      promise.reject("Execute error",NOT_REGISTERED);
      return;
    }
    promise.resolve(api.isWXAppInstalled());
  }

  public static native Promise nativeIsWXAppInstalled(Promise promise);

  @ReactMethod
  public void getApiVersion(Promise promise) {
    if (api == null) {
      promise.reject("Execute error",NOT_REGISTERED);
      return;
    }
    promise.resolve(api.getWXAppSupportAPI());
  }
  public static native Promise nativeGetApiVersion(Promise promise);

  @ReactMethod
  public void openWXApp(Promise promise) {
    if (api == null) {
      promise.reject("Execute error",NOT_REGISTERED);
      return;
    }
    promise.resolve(api.openWXApp());
  }

  public static native Promise nativeOpenWXApp(Promise promise);

  @ReactMethod
  public void sendAuthRequest(String scope, String state, Promise promise) {
    if (api == null) {
      promise.reject("Execute error",NOT_REGISTERED);
      return;
    }
    SendAuth.Req req = new SendAuth.Req();
    req.scope = scope;
    req.state = state;
    promise.resolve(api.sendReq(req));
  }

  public static native Promise nativeSendAuthRequest(String scope, String state, Promise promise);
/*
  @ReactMethod
  public void shareToTimeline(ReadableMap data, Promise promise) {
    if (api == null) {
      promise.reject("Execute error",NOT_REGISTERED);
      return;
    }
    _share(SendMessageToWX.Req.WXSceneTimeline, data, promise);
  }

  @ReactMethod
  public void shareToSession(ReadableMap data, Promise promise) {
    if (api == null) {
      promise.invoke(NOT_REGISTERED);
      return;
    }
    _share(SendMessageToWX.Req.WXSceneSession, data, promise);
  }

  @ReactMethod
  public void shareToFavorite(ReadableMap data, Promise promise) {
    if (api == null) {
      promise.invoke(NOT_REGISTERED);
      return;
    }
    _share(SendMessageToWX.Req.WXSceneFavorite, data, promise);
  }
*/

  @ReactMethod
  public void pay(ReadableMap data, Promise promise) {
    PayReq payReq = new PayReq();
    if (data.hasKey("partnerId")) {
      payReq.partnerId = data.getString("partnerId");
    }
    if (data.hasKey("prepayId")) {
      payReq.prepayId = data.getString("prepayId");
    }
    if (data.hasKey("nonceStr")) {
      payReq.nonceStr = data.getString("nonceStr");
    }
    if (data.hasKey("timeStamp")) {
      payReq.timeStamp = data.getString("timeStamp");
    }
    if (data.hasKey("sign")) {
      payReq.sign = data.getString("sign");
    }
    if (data.hasKey("packageValue")) {
      payReq.packageValue = data.getString("packageValue");
    }
    if (data.hasKey("extData")) {
      payReq.extData = data.getString("extData");
    }
    payReq.appId = appId;
    promise.resolve(api.sendReq(payReq));
  }
  public static native Promise nativePay(ReadableMap data, Promise promise);
//
//  private void _share(final int scene, final ReadableMap data, final Promise promise) {
//    Uri uri = null;
//    if (data.hasKey("thumbImage")) {
//      String imageUrl = data.getString("thumbImage");
//
//      try {
//        uri = Uri.parse(imageUrl);
//        // Verify scheme is set, so that relative uri (used by static resources) are not handled.
//        if (uri.getScheme() == null) {
//          uri = getResourceDrawableUri(getReactApplicationContext(), imageUrl);
//        }
//      } catch (Exception e) {
//        // ignore malformed uri, then attempt to extract resource ID.
//      }
//    }
//
//    if (uri != null) {
//      this._getImage(uri, new ResizeOptions(100, 100), new ImagePromise() {
//        @Override
//        public void invoke(@Nullable Bitmap bitmap) {
//          WechatTsModule.this._share(scene, data, bitmap, promise);
//        }
//      });
//    } else {
//      this._share(scene, data, null, promise);
//    }
//  }
//
//  private void _getImage(Uri uri, ResizeOptions resizeOptions, final ImagePromise imagePromise) {
//    BaseBitmapDataSubscriber dataSubscriber = new BaseBitmapDataSubscriber() {
//      @Override
//      protected void onNewResultImpl(Bitmap bitmap) {
//        if (bitmap != null) {
//          if (bitmap.getConfig() != null) {
//            bitmap = bitmap.copy(bitmap.getConfig(), true);
//            imagePromise.invoke(bitmap);
//          } else {
//            bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
//            imagePromise.invoke(bitmap);
//          }
//        } else {
//          imagePromise.invoke(null);
//        }
//      }
//
//      @Override
//      protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
//        imagePromise.invoke(null);
//      }
//    };
//
//    ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(uri);
//    if (resizeOptions != null) {
//      builder = builder.setResizeOptions(resizeOptions);
//    }
//    ImageRequest imageRequest = builder.build();
//
//    ImagePipeline imagePipeline = Fresco.getImagePipeline();
//    DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, null);
//    dataSource.subscribe(dataSubscriber, UiThreadImmediateExecutorService.getInstance());
//  }
//
//  private static Uri getResourceDrawableUri(ReactApplicationContext context, String name) {
//    if (name == null || name.isEmpty()) {
//      return null;
//    }
//    name = name.toLowerCase().replace("-", "_");
//    int resId = context.getResources().getIdentifier(
//      name,
//      "drawable",
//      context.getPackageName());
//
//    if (resId == 0) {
//      return null;
//    } else {
//      return new Uri.Builder()
//        .scheme(UriUtil.LOCAL_RESOURCE_SCHEME)
//        .path(String.valueOf(resId))
//        .build();
//    }
//  }
//
//  private void _share(final int scene, final ReadableMap data, final Bitmap thumbImage, final Promise promise) {
//    if (!data.hasKey("type")) {
//      promise.invoke(INVALID_ARGUMENT);
//      return;
//    }
//    String type = data.getString("type");
//
//    WXMediaMessage.IMediaObject mediaObject = null;
//    if (type.equals("news")) {
//      mediaObject = _jsonToWebpageMedia(data);
//    } else if (type.equals("text")) {
//      mediaObject = _jsonToTextMedia(data);
//    } else if (type.equals("imageUrl") || type.equals("imageResource")) {
//      __jsonToImageUrlMedia(data, new MediaObjectPromise() {
//        @Override
//        public void invoke(@Nullable WXMediaMessage.IMediaObject mediaObject) {
//          if (mediaObject == null) {
//            promise.invoke(INVALID_ARGUMENT);
//          } else {
//            WechatTsModule.this._share(scene, data, thumbImage, mediaObject, promise);
//          }
//        }
//      });
//      return;
//    } else if (type.equals("imageFile")) {
//      __jsonToImageFileMedia(data, new MediaObjectPromise() {
//        @Override
//        public void invoke(@Nullable WXMediaMessage.IMediaObject mediaObject) {
//          if (mediaObject == null) {
//            promise.invoke(INVALID_ARGUMENT);
//          } else {
//            WechatTsModule.this._share(scene, data, thumbImage, mediaObject, promise);
//          }
//        }
//      });
//      return;
//    } else if (type.equals("video")) {
//      mediaObject = __jsonToVideoMedia(data);
//    } else if (type.equals("audio")) {
//      mediaObject = __jsonToMusicMedia(data);
//    } else if (type.equals("file")) {
//      mediaObject = __jsonToFileMedia(data);
//    }
//
//    if (mediaObject == null) {
//      promise.invoke(INVALID_ARGUMENT);
//    } else {
//      _share(scene, data, thumbImage, mediaObject, promise);
//    }
//  }
//
//  private void _share(int scene, ReadableMap data, Bitmap thumbImage, WXMediaMessage.IMediaObject mediaObject, Promise promise) {
//
//    WXMediaMessage message = new WXMediaMessage();
//    message.mediaObject = mediaObject;
//
//    if (thumbImage != null) {
//      message.setThumbImage(thumbImage);
//    }
//
//    if (data.hasKey("title")) {
//      message.title = data.getString("title");
//    }
//    if (data.hasKey("description")) {
//      message.description = data.getString("description");
//    }
//    if (data.hasKey("mediaTagName")) {
//      message.mediaTagName = data.getString("mediaTagName");
//    }
//    if (data.hasKey("messageAction")) {
//      message.messageAction = data.getString("messageAction");
//    }
//    if (data.hasKey("messageExt")) {
//      message.messageExt = data.getString("messageExt");
//    }
//
//    SendMessageToWX.Req req = new SendMessageToWX.Req();
//    req.message = message;
//    req.scene = scene;
//    req.transaction = UUID.randomUUID().toString();
//    promise.invoke(null, api.sendReq(req));
//  }
//
//  private WXTextObject _jsonToTextMedia(ReadableMap data) {
//    if (!data.hasKey("description")) {
//      return null;
//    }
//
//    WXTextObject ret = new WXTextObject();
//    ret.text = data.getString("description");
//    return ret;
//  }
//
//  private WXWebpageObject _jsonToWebpageMedia(ReadableMap data) {
//    if (!data.hasKey("webpageUrl")) {
//      return null;
//    }
//
//    WXWebpageObject ret = new WXWebpageObject();
//    ret.webpageUrl = data.getString("webpageUrl");
//    if (data.hasKey("extInfo")) {
//      ret.extInfo = data.getString("extInfo");
//    }
//    return ret;
//  }
//
//  private void __jsonToImageMedia(String imageUrl, final MediaObjectPromise promise) {
//    Uri imageUri;
//    try {
//      imageUri = Uri.parse(imageUrl);
//      // Verify scheme is set, so that relative uri (used by static resources) are not handled.
//      if (imageUri.getScheme() == null) {
//        imageUri = getResourceDrawableUri(getReactApplicationContext(), imageUrl);
//      }
//    } catch (Exception e) {
//      imageUri = null;
//    }
//
//    if (imageUri == null) {
//      promise.invoke(null);
//      return;
//    }
//
//    this._getImage(imageUri, null, new ImagePromise() {
//      @Override
//      public void invoke(@Nullable Bitmap bitmap) {
//        promise.invoke(bitmap == null ? null : new WXImageObject(bitmap));
//      }
//    });
//  }
//
//  private void __jsonToImageUrlMedia(ReadableMap data, MediaObjectPromise promise) {
//    if (!data.hasKey("imageUrl")) {
//      promise.invoke(null);
//      return;
//    }
//    String imageUrl = data.getString("imageUrl");
//    __jsonToImageMedia(imageUrl, promise);
//  }
//
//  private void __jsonToImageFileMedia(ReadableMap data, MediaObjectPromise promise) {
//    if (!data.hasKey("imageUrl")) {
//      promise.invoke(null);
//      return;
//    }
//
//    String imageUrl = data.getString("imageUrl");
//    if (!imageUrl.toLowerCase().startsWith("file://")) {
//      imageUrl = "file://" + imageUrl;
//    }
//    __jsonToImageMedia(imageUrl, promise);
//  }
//
//  private WXMusicObject __jsonToMusicMedia(ReadableMap data) {
//    if (!data.hasKey("musicUrl")) {
//      return null;
//    }
//
//    WXMusicObject ret = new WXMusicObject();
//    ret.musicUrl = data.getString("musicUrl");
//    return ret;
//  }
//
//  private WXVideoObject __jsonToVideoMedia(ReadableMap data) {
//    if (!data.hasKey("videoUrl")) {
//      return null;
//    }
//
//    WXVideoObject ret = new WXVideoObject();
//    ret.videoUrl = data.getString("videoUrl");
//    return ret;
//  }
//
//  private WXFileObject __jsonToFileMedia(ReadableMap data) {
//    if (!data.hasKey("filePath")) {
//      return null;
//    }
//    return new WXFileObject(data.getString("filePath"));
//  }
//
//  // TODO: 实现sendRequest、sendSuccessResponse、sendErrorCommonResponse、sendErrorUserCancelResponse
//
//
//  public void onReq(BaseReq baseReq) {
//
//  }
//
//  public void onResp(BaseResp baseResp) {
//    WritableMap map = Arguments.createMap();
//    map.putInt("errCode", baseResp.errCode);
//    map.putString("errStr", baseResp.errStr);
//    map.putString("openId", baseResp.openId);
//    map.putString("transaction", baseResp.transaction);
//
//    if (baseResp instanceof SendAuth.Resp) {
//      SendAuth.Resp resp = (SendAuth.Resp) (baseResp);
//
//      map.putString("type", "SendAuth.Resp");
//      map.putString("code", resp.code);
//      map.putString("state", resp.state);
//      map.putString("url", resp.url);
//      map.putString("lang", resp.lang);
//      map.putString("country", resp.country);
//    } else if (baseResp instanceof SendMessageToWX.Resp) {
//      SendMessageToWX.Resp resp = (SendMessageToWX.Resp) (baseResp);
//      map.putString("type", "SendMessageToWX.Resp");
//    } else if (baseResp instanceof PayResp) {
//      PayResp resp = (PayResp) (baseResp);
//      map.putString("type", "PayReq.Resp");
//      map.putString("returnKey", resp.returnKey);
//    }
//
//    this.getReactApplicationContext()
//      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//      .emit("WeChat_Resp", map);
//  }
//
//  private interface ImagePromise {
//    void invoke(@Nullable Bitmap bitmap);
//  }
//
//  private interface MediaObjectPromise {
//    void invoke(@Nullable WXMediaMessage.IMediaObject mediaObject);
//  }
}
