
export const jumpUrl = (httpUrl, appUrl) => {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)){
    var loadDateTime = new Date();
    window.setTimeout(function () {
      var timeOutDateTime = new Date();
      if (timeOutDateTime - loadDateTime <6000) {
        // 找不到app时执行的操作
        window.location = httpUrl
    }
    }, 3000);
    window.location = appUrl;
  } else {
    window.location = httpUrl
  }
}