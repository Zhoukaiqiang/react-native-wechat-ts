import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import WechatTs from 'react-native-wechat-ts';

WechatTs.registerApp('wx12345678');
export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  let install = React.useRef<boolean>(false);
  React.useEffect(() => {
    WechatTs.multiply(4, 5).then(setResult);
    (async () => {
      install.current = (await WechatTs.isWXAppInstalled()) as boolean;
      console.log(await WechatTs.getApiVersion());
    })();
  }, []);

  const open = async () => {
    await WechatTs.openWXApp();
  };
  const auth = async () => {
    WechatTs.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo_test').then(
      (res: any) => {
        console.log(res);
      }
    );
  };

  const pay = () => {
    WechatTs.pay({
      partnerId: 'kajslkrjqlwke',
      timeStamp: 'alksjdaklsd',
      packageValue: 'Sign=WXPay',
      sign: 'asdasdasd',
      nonceStr: 'asdasd',
      prepayId: 'asdasdasd',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Text>微信是否安装：{install.current ? 'y' : 'n'}</Text>
      <Button title="打开微信" onPress={open} />
      <Sep />
      <Button title="微信登录" onPress={auth} />
      <Sep />
      <Button title="微信支付" onPress={pay} />
    </View>
  );
}
const Sep = () => <View style={styles.sep} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  sep: {
    height: 20,
  },
});
