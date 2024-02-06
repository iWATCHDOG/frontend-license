// @ts-ignore
import humanizeDuration from 'humanize-duration';

// 格式化带有格式的字符串
export const formatString = (str: string) => {
  // 修改字符串中的{data:xxx}格式,方法是提取出xxx，若xxx等于0，则返回永久，若xxx不等于0，则返回translateTimeCreated(new Date(xxx))
  const dataReg = /{date:(\d+)}/g;
  let ret = str.replace(dataReg, (word, key) => {
    if (key === '0') {
      return '永久';
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return translateTimeCreated(new Date(parseInt(key)));
  });
  // 修改字符串中的{permission:xxx}格式,注意xxx可能包含.,方法是提取出xxx，若xxx以group.开头，则提取group.后的字符串，然后调用getGroupName方法，否则返回xxx
  const permissionReg = /{permission:([\w.*]+)}/g;
  ret = ret.replace(permissionReg, (word, key) => {
    if (key.startsWith('group.')) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getGroupByName(key);
    }
    return key;
  });
  return ret;
};

const humanizer = humanizeDuration.humanizer({
  language: 'zh_CN',
  maxDecimalPoints: 0,
  delimiter: ' ',
  largest: 1,
});

const fillZero2 = (s: number) => {
  if (s < 10) {
    return `0${s}`;
  }
  return s;
};

export const translateTimeCreated = (d: Date | undefined) => {
  if (!d) {
    return '';
  }
  const t = d.getTime();
  const offset = Date.now() - t;
  if (t > Date.now() || offset > 7 * 24 * 60 * 60 * 1000) {
    return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
  }
  if (offset < 5 * 60 * 1000) {
    return '刚刚';
  }
  return humanizer(offset) + '前';
};

export const getGroupByName = (name: string) => {
  switch (name) {
    case 'group.admin':
      return '管理员';
    case 'group.default':
      return '用户';
    default:
      return name;
  }
};