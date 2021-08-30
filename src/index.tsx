// /* eslint-disable no-proto */
// ('use strict');
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { EventEmitter } from 'events';
const { WechatTs } = NativeModules;

const emitter = new EventEmitter();
/* 注册监听器 */
DeviceEventEmitter.addListener('WECHAT_RESP', (resp) => {
  emitter.emit(resp.type, resp);
});

export function sendAuthRequest(scopes: string, state: string) {
  return new Promise(async (resolve, reject) => {
    await WechatTs.sendAuthRequest(scopes, state);
    emitter.once('SendAuth.Resp', (resp) => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(resp);
      }
    });
  });
}
export function pay(data: any) {
  return new Promise((resolve, reject) => {
    WechatTs.pay(data, () => {
      emitter.once('PayReq.Resp', (resp) => {
        if (resp.errCode === 0) {
          resolve(resp);
        } else {
          reject(resp);
        }
      });
    });
  });
}

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
