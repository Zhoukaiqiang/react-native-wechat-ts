// /* eslint-disable no-proto */
// ('use strict');
import { NativeModules } from 'react-native';
const { WechatTs } = NativeModules;

type WechatTsType = {
  multiply(a: number, b: number): Promise<number>;
  registerApp(appId: string): Promise<boolean>;
  isWXAppInstalled(): Promise<boolean | string>;
  getApiVersion(): Promise<number>;
  openWXApp(): Promise<boolean>;
  sendAuthRequest(
    scope: string,
    state: string
  ): Promise<{
    errCode: number;
    errStr: string;
    openId: string;
    code: string;
    url: string;
    lang: string;
    country: string;
  }>;
  pay(p: {
    /* 商户号 */
    partnerId: string;
    /* 预支付交易会话ID */
    prepayId: string;
    /* 随机字符串 */
    nonceStr: string;
    /* 时间戳 */
    timeStamp: string;
    /* 扩展字段: 暂填写固定值Sign=WXPay */
    packageValue: 'Sign=WXPay';
    /* 详细见签名算法：https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3 */
    sign: string;
    extData?: string;
  }): Promise<boolean>;
};

export default WechatTs as WechatTsType;
// import { EventEmitter } from 'events';

// let isAppRegistered = false;
// const { WechatTs } = NativeModules;

// // Event emitter to dispatch request and response from wechat.
// const emitter = new EventEmitter();

// DeviceEventEmitter.addListener('WechatTs_Resp', (resp) => {
//   emitter.emit(resp.type, resp);
// });

// function wrapRegisterApp(nativeFunc: {
//   apply: (arg0: null, arg1: any[]) => void;
// }) {
//   if (!nativeFunc) {
//     return undefined;
//   }
//   return (...args: any) => {
//     if (isAppRegistered) {
//       // FIXME(Yorkie): we ignore this error if AppRegistered is true.
//       return Promise.resolve(true);
//     }
//     isAppRegistered = true;
//     return new Promise((resolve, reject) => {
//       nativeFunc.apply(null, [
//         ...args,
//         (error: string | undefined, result: unknown) => {
//           if (!error) {
//             return resolve(result);
//           }
//           if (typeof error === 'string') {
//             return reject(new Error(error));
//           }
//           reject(error);
//         },
//       ]);
//     });
//   };
// }

// function wrapApi(nativeFunc: any) {
//   if (!nativeFunc) {
//     return undefined;
//   }
//   return (...args: any[]) => {
//     if (!isAppRegistered) {
//       return Promise.reject(new Error('registerApp required.'));
//     }
//     return new Promise((resolve, reject) => {
//       nativeFunc.apply(null, [
//         ...args,
//         (error: any, result: any) => {
//           if (!error) {
//             return resolve(result);
//           }
//           if (typeof error === 'string') {
//             return reject(new Error(error));
//           }
//           reject(error);
//         },
//       ]);
//     });
//   };
// }

// /**
//  * `addListener` inherits from `events` module
//  * @method addListener
//  * @param {String} eventName - the event name
//  * @param {Function} trigger - the function when event is fired
//  */
// export const addListener = emitter.addListener.bind(emitter);

// /**
//  * `once` inherits from `events` module
//  * @method once
//  * @param {String} eventName - the event name
//  * @param {Function} trigger - the function when event is fired
//  */
// export const once = emitter.once.bind(emitter);

// /**
//  * `removeAllListeners` inherits from `events` module
//  * @method removeAllListeners
//  * @param {String} eventName - the event name
//  */
// export const removeAllListeners = emitter.removeAllListeners.bind(emitter);

// /**
//  * @method registerApp
//  * @param {String} appid - the app id
//  * @return {Promise}
//  */
// export const registerApp = wrapRegisterApp(WechatTs.registerApp);

// /**
//  * @method registerAppWithDescription
//  * @param {String} appid - the app id
//  * @param {String} appdesc - the app description
//  * @return {Promise}
//  */
// export const registerAppWithDescription = wrapRegisterApp(
//   WechatTs.registerAppWithDescription
// );

// /**
//  * Return if the wechat app is installed in the device.
//  * @method isWXAppInstalled
//  * @return {Promise}
//  */
// export const isWXAppInstalled = wrapApi(WechatTs.isWXAppInstalled);

// /**
//  * Return if the wechat application supports the api
//  * @method isWXAppSupportApi
//  * @return {Promise}
//  */
// export const isWXAppSupportApi = wrapApi(WechatTs.isWXAppSupportApi);

// /**
//  * Get the wechat app installed url
//  * @method getWXAppInstallUrl
//  * @return {String} the wechat app installed url
//  */
// export const getWXAppInstallUrl = wrapApi(WechatTs.getWXAppInstallUrl);

// /**
//  * Get the wechat api version
//  * @method getApiVersion
//  * @return {String} the api version string
//  */
// export const getApiVersion = wrapApi(WechatTs.getApiVersion);

// /**
//  * Open wechat app
//  * @method openWXApp
//  * @return {Promise}
//  */
// export const openWXApp = wrapApi(WechatTs.openWXApp);

// // wrap the APIs
// const nativeShareToTimeline = wrapApi(WechatTs.shareToTimeline);
// const nativeShareToSession = wrapApi(WechatTs.shareToSession);
// const nativeShareToFavorite = wrapApi(WechatTs.shareToFavorite);
// // const nativeSendAuthRequest = wrapApi(WechatTs.sendAuthRequest);

// /**
//  * @method sendAuthRequest
//  * @param {Array} scopes - the scopes for authentication.
//  * @return {Promise}
//  */
// export function sendAuthRequest(scopes: any, state: any) {
//   return new Promise((resolve, reject) => {
//     WechatTs.sendAuthRequest(scopes, state, () => {});
//     emitter.once('SendAuth.Resp', (resp) => {
//       if (resp.errCode === 0) {
//         resolve(resp);
//       } else {
//         reject(new WechatError(resp));
//       }
//     });
//   });
// }

// /**
//  * Share something to timeline/moments/朋友圈
//  * @method shareToTimeline
//  * @param {Object} data
//  * @param {String} data.thumbImage - Thumb image of the message, which can be a uri or a resource id.
//  * @param {String} data.type - Type of this message. Could be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
//  * @param {String} data.webpageUrl - Required if type equals news. The webpage link to share.
//  * @param {String} data.imageUrl - Provide a remote image if type equals image.
//  * @param {String} data.videoUrl - Provide a remote video if type equals video.
//  * @param {String} data.musicUrl - Provide a remote music if type equals audio.
//  * @param {String} data.filePath - Provide a local file if type equals file.
//  * @param {String} data.fileExtension - Provide the file type if type equals file.
//  */
// export function shareToTimeline(data: any) {
//   return new Promise((resolve, reject) => {
//     nativeShareToTimeline && nativeShareToTimeline(data);
//     emitter.once('SendMessageToWX.Resp', (resp) => {
//       if (resp.errCode === 0) {
//         resolve(resp);
//       } else {
//         reject(new WechatError(resp));
//       }
//     });
//   });
// }

// /**
//  * Share something to a friend or group
//  * @method shareToSession
//  * @param {Object} data
//  * @param {String} data.thumbImage - Thumb image of the message, which can be a uri or a resource id.
//  * @param {String} data.type - Type of this message. Could be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
//  * @param {String} data.webpageUrl - Required if type equals news. The webpage link to share.
//  * @param {String} data.imageUrl - Provide a remote image if type equals image.
//  * @param {String} data.videoUrl - Provide a remote video if type equals video.
//  * @param {String} data.musicUrl - Provide a remote music if type equals audio.
//  * @param {String} data.filePath - Provide a local file if type equals file.
//  * @param {String} data.fileExtension - Provide the file type if type equals file.
//  */
// export function shareToSession(data: any) {
//   return new Promise((resolve, reject) => {
//     nativeShareToSession && nativeShareToSession(data);
//     emitter.once('SendMessageToWX.Resp', (resp) => {
//       if (resp.errCode === 0) {
//         resolve(resp);
//       } else {
//         reject(new WechatError(resp));
//       }
//     });
//   });
// }

// /**
//  * Share something to favorite
//  * @method shareToFavorite
//  * @param {Object} data
//  * @param {String} data.thumbImage - Thumb image of the message, which can be a uri or a resource id.
//  * @param {String} data.type - Type of this message. Could be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
//  * @param {String} data.webpageUrl - Required if type equals news. The webpage link to share.
//  * @param {String} data.imageUrl - Provide a remote image if type equals image.
//  * @param {String} data.videoUrl - Provide a remote video if type equals video.
//  * @param {String} data.musicUrl - Provide a remote music if type equals audio.
//  * @param {String} data.filePath - Provide a local file if type equals file.
//  * @param {String} data.fileExtension - Provide the file type if type equals file.
//  */
// export function shareToFavorite(data: any) {
//   return new Promise((resolve, reject) => {
//     nativeShareToFavorite && nativeShareToFavorite(data);
//     emitter.once('SendMessageToWX.Resp', (resp) => {
//       if (resp.errCode === 0) {
//         resolve(resp);
//       } else {
//         reject(new WechatError(resp));
//       }
//     });
//   });
// }

// /**
//  * wechat pay
//  * @param {Object} data
//  * @param {String} data.partnerId
//  * @param {String} data.prepayId
//  * @param {String} data.nonceStr
//  * @param {String} data.timeStamp
//  * @param {String} data.package
//  * @param {String} data.sign
//  * @returns {Promise}
//  */
// export function pay(data: { [x: string]: any; timeStamp: string }) {
//   // FIXME(Yorkie): see https://github.com/yorkie/react-native-wechat/issues/203
//   // Here the server-side returns params in lowercase, but here SDK requires timeStamp
//   // for compatibility, we make this correction for users.
//   function correct(actual: string, fixed: string) {
//     if (!data[fixed] && data[actual]) {
//       data[fixed] = data[actual];
//       delete data[actual];
//     }
//   }
//   correct('prepayid', 'prepayId');
//   correct('noncestr', 'nonceStr');
//   correct('partnerid', 'partnerId');
//   correct('timestamp', 'timeStamp');

//   // FIXME(94cstyles)
//   // Android requires the type of the timeStamp field to be a string
//   if (Platform.OS === 'android') data.timeStamp = String(data.timeStamp);

//   return new Promise((resolve, reject) => {
//     WechatTs.pay(data, (result: any) => {
//       if (result) reject(result);
//     });
//     emitter.once('PayReq.Resp', (resp) => {
//       if (resp.errCode === 0) {
//         resolve(resp);
//       } else {
//         reject(new WechatError(resp));
//       }
//     });
//   });
// }

// /**
//  * promises will reject with this error when API call finish with an errCode other than zero.
//  */
// export class WechatError extends Error {
//   code: { toString: () => any };
//   constructor(resp: { errStr: any; errCode: { toString: () => any } }) {
//     const message = resp.errStr || resp.errCode.toString();
//     super(message);
//     this.name = 'WechatError';
//     this.code = resp.errCode;

//     // avoid babel's limition about extending Error class
//     // https://github.com/babel/babel/issues/3083
//     if (typeof Object.setPrototypeOf === 'function') {
//       Object.setPrototypeOf(this, WechatError.prototype);
//     }
//   }
// }
