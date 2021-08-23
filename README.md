# react-native-wechat-ts

react native lib for wechat app
react-native 微信支付-微信分享-微信登录lib

## Intro
这个修改自[react-native-wechat](https://www.npmjs.com/package/react-native-wechat),
区别 **更新了微信的Android版SDK**
只在安卓机中测试过。
只实现了部分功能


## 待办
实现分享
测试授权登录

## Installation

```sh
npm install react-native-wechat-ts
```

## Usage

```js
import WechatTs from "react-native-wechat-ts";

WechatTs.registerApp('appid');

/* 检查手机是否安装微信 */
WechatTs.isWxAppInstalled(): boolean

/* 检查当前SDK版本 */
WechatTs.getApiVersion(): number

/* 打开微信app */
WechatTs.openWXApp(): boolean


/* 微信授权登录 */
WechatTs.sendAuthRequest(): {}
//例

const auth = async () => {
    WechatTs.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo_test').then(
      (res: any) => {
        console.log(res);
      }
    );
  };

const Button = () => (
  <Button title="微信登录" onPress={auth} />
)
```


## License

MIT
