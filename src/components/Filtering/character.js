/**
 User: burning <923398776@qq.com>
 Date: 2018年07月05日
 */
export function filterStr (str) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;'\",\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
  var specialStr = '';
  for (var i = 0; i < str.length; i++) {
    specialStr += str.substr(i, 1).replace(pattern, '');
  }
  return specialStr;
}

export default {
  filterStr
}
