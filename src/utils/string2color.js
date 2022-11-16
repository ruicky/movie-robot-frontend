
export const string2color = (text) => {
  if (!text) return '#dc6666';
  // 这里是快捷指令的常用的颜色数组 https://jiejingku.net/yanse
  const colors = [
    '#dc6666', '#eb8366', '#e7a356', '#e0c03d', '#5ebc5e',
    '#44c2a6', '#4cc0d4', '#45a8e9', '#455cb1', '#754fad',
    '#a570d1', '#db81c3', '#818993', '#8d978d', '#928885'
  ]
  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    const t = text[i];
    const n =t.charCodeAt(0)
    sum += parseInt(n)
  }
  const index = parseInt(sum % colors.length)
  return colors[index]
}