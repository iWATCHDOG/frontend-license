import { useParams } from '@@/exports';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserProfileByUsername } from '@/services/userService';
import { postNotify } from '@/services/rootService';
// @ts-ignore
import { history, useNavigate } from 'umi';
import { stringify } from 'querystring';

export default () => {
  // 获取路由传参
  const params = useParams();
  const [user, setUser] = useState<UserType.UserVO>({});

  const init = async (uid: number, username: string) => {
    let u: UserType.UserVO | undefined;
    try {
      if (uid) {
        // 通过uid获取用户信息
        const res = await getUserProfile(uid);
        u = res.data;
      }
    } catch (ignore) {
      try {
        if (!u) {
          if (username) {
            // 通过username获取用户信息
            const res = await getUserProfileByUsername(username);
            u = res.data;
          }
        }
      } catch (i) {
      }
    } finally {
      if (u) {
        setUser(u);
        window.history.pushState({}, '', '/user/' + u.username + '.' + u.uid);
      } else {
        localStorage.setItem('refreshing', 'refreshing');
        try {
          const notify = {
            title: '用户不存在',
            content: '当前查看的用户不存在',
            type: 1,
          } as RootType.NotifyRequest;
          await postNotify(notify);
        } catch (ignore) {

        } finally {
          setTimeout(() => {
            history.replace({
              pathname: '/404',
              search: stringify({
                redirect: window.location.href,
              }),
            });
            localStorage.removeItem('refreshing');
          }, 300);
        }
      }
    }
  };

  useEffect(() => {
    // 路由参数格式为 /user/:var , var 格式为: username$uid
    const var1 = params.var;
    // 处理var
    // @ts-ignore
    const [username, uid] = var1?.split('.');
    init(uid, username);
  }, []);
  return <>
    {user.username}</>;
};
