export const coverSize = (size_mb) => {
    if (size_mb < 0) {
        return '-';
    } else if (size_mb === '-' || size_mb === '无限') {
        return size_mb;
    }
    if (size_mb <= 1024) {
        return size_mb.toFixed(2) + "MB";
    } else if (size_mb <= 1024 * 1024) {
        return (size_mb / 1024).toFixed(2) + "GB";
    } else if (size_mb <= 1024 * 1024 * 1024) {
        return (size_mb / 1024 / 1024).toFixed(2) + "TB";
    } else if (size_mb <= 1024 * 1024 * 1024 * 1024) {
        return (size_mb / 1024 / 1024 / 1024).toFixed(2) + "PB";
    } else {
        return size_mb;
    }
}