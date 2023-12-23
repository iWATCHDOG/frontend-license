import { useParams } from '@@/exports';
import React, { useEffect, useState } from 'react';
import { getUserProfile, getUserProfileByUsername } from '@/services/userService';
import { postNotify } from '@/services/rootService';
// @ts-ignore
import { history } from 'umi';
import { stringify } from 'querystring';
import { Avatar, Col, Row, Space, Typography } from 'antd';
import { BASE_URL } from '@/constants';

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
    <Row>
      <Col>
        <Space size={0} direction={'vertical'}>
          <Space>
            <Avatar
              size={320}
              src={BASE_URL + '/user/get/avatar/' + user?.uid}
            />
          </Space>
          <Space>
            <br />
          </Space>
          <Space>
            <Typography.Text style={{ fontSize: 'large', color: '#8c9197' }}>
              {user?.username}
            </Typography.Text>
          </Space>
        </Space>
      </Col>
      <Col span={18} push={6}>
        col-18 col-push-6
      </Col>
    </Row>
  </>;
};
