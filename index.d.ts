/* eslint-disable prettier/prettier */
declare type WechatTsType = {
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
    partnerId: string;
    prepayId: string;
    nonceStr: string;
    timeStamp: string;
    packageValue: 'Sign=WXPay';
    sign: string;
    extData?: string;
  }): Promise<boolean>;
};
declare const _default: WechatTsType;
export default _default;
