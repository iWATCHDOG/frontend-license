// @ts-ignore
import humanizeDuration from 'humanize-duration';
import { getUsername } from '@/services/userService';

// 初始化map，存uid对应的用户名
const uidNameMap = new Map<number, string>();

// 格式化带有格式的字符串
export const formatString = (str: string): string => {
  // 这个函数尝试通过编程方式而不是仅仅使用正则表达式来处理字符串格式
  function replaceDate(str: string): string {
    return str.replace(/{date:(\d+)}/g, (match, key) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return key === '0' ? '永久' : translateTimeCreated(new Date(parseInt(key, 10)));
    });
  }

  function replacePermission(str: string): string {
    return str.replace(/{permission:([\w.*]+)}/g, (match, key) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return key.startsWith('group.') ? getGroupByName(key.substring(6)) : key;
    });
  }

  function replaceUidName(str: string): string {
    return str.replace(/{uid:(\d+)}/g, (match, key) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      initUidNameMap(parseInt(key, 10));
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return uidNameMap.get(parseInt(key, 10)) || key;
    });
  }

  async function initUidNameMap(uid: number) {
    if (!uidNameMap.has(uid)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const ret = await getUsername(uid);
      uidNameMap.set(uid, ret.data);
    }
  }

  function recursiveReplace(str: string): string {
    // 先替换日期和权限
    let result = replaceDate(str);
    result = replacePermission(result);
    result = replaceUidName(result);

    // 检查是否还有需要替换的部分，特别是嵌套部分
    let oldNewMatch = /{old:(.*?),new:(.*?)}/.exec(result);
    while (oldNewMatch) {
      const oldPart = recursiveReplace(oldNewMatch[1]);
      const newPart = recursiveReplace(oldNewMatch[2]);
      result = result.replace(oldNewMatch[0], `${oldPart}=>${newPart}`);
      oldNewMatch = /{old:(.*?),new:(.*?)}/.exec(result);
    }

    return result;
  }

  return recursiveReplace(str);
};

// 这里假设translateTimeCreated和getGroupByName函数已经正确实现


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