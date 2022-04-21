import CallApp from 'callapp-lib';
import _ from 'lodash';

export const jumpUrl = (httpUrl, appUrl) => {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)){
    const temp = appUrl.split('://')
    const options = {
      scheme: {
        protocol: _.get(temp, '[0]')
      },
      appstore: "",
      fallback: httpUrl
    };
    const callLib = new CallApp(options);
    callLib.open({
      path: _.get(temp, '[1]'),
      callback: () => window.open(httpUrl, '_blank')
    });
  } else {
    window.open(httpUrl, '_blank');
  }
}