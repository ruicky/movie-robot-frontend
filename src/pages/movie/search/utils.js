// 优化后的促销信息
export const getPromotion = (upload_volume_factor, download_volume_factor) => {
  const getUploadPromotion = (upload_volume_factor) => {
    if (upload_volume_factor === 1) {
      return "";
    }
    if (upload_volume_factor > 1) {
      return `${upload_volume_factor}x`;
    }
    return "";
  };

  const getDownloadPromotion = (download_volume_factor) => {
    if (download_volume_factor === 1) {
      return "";
    }
    if (download_volume_factor === 0) {
      return "Free";
    }
    return `${download_volume_factor * 100}%`;
  };

  return `${getUploadPromotion(upload_volume_factor)}${getDownloadPromotion(
    download_volume_factor
  )}`;
};
