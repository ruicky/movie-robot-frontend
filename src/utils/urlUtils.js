import CallApp from 'callapp-lib';
import { get as _get } from 'lodash-es';

export const jumpUrl = (httpUrl, appUrl) => {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
    const temp = appUrl.split('://')
    const options = {
      scheme: {
        protocol: _get(temp, '[0]')
      },
      appstore: "",
      fallback: httpUrl
    };
    const callLib = new CallApp(options);
    callLib.open({
      path: _get(temp, '[1]'),
      callback: () => window.open(httpUrl, '_blank')
    });
  } else {
    window.open(httpUrl, '_blank');
  }
}