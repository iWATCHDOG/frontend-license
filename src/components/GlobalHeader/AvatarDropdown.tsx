import { userLogout } from '@/services/userService';
import { Link } from '@@/exports';
import { useModel } from '@umijs/max';
import { Avatar, Button, Dropdown, MenuProps, message, notification } from 'antd';
import classNames from 'classnames';
import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import { history, useNavigate } from 'umi';
import styles from './index.less';
import { BASE_URL } from '@/constants';
import { getNotifyList } from '@/services/rootService';


/**
 * 头像下拉菜单
 */
const AvatarDropdown: React.FC = () => {
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const onMenuClick = async (event: {
    key: React.Key; keyPath: React.Key[];
  }) => {
    const { key } = event;

    if (key === 'logout') {
      try {
        await userLogout();
        message.success('已退出登录');
      } catch (e: any) {
        message.error('操作失败');
      }
      // @ts-ignore
      await setInitialState({
        ...initialState,
        loginUser: undefined,
      });
      setTimeout(() => {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }, 300);
      return;
    } else if (key === 'settings') {
      navigate('/user/settings');
    }
  };

  const items: MenuProps['items'] = loginUser ? [{
    key: 'current',
    label: loginUser.username ?? 'null',
    disabled: true,
  }, {
    key: 'settings',
    label: '设置',
  }, {
    type: 'divider',
  }, {
    key: 'logout',
    danger: true,
    label: '退出登录',
  }] : [];

  const getNotify = async () => {
    try {
      const res = await getNotifyList();
      res.data.forEach(notify => {
        let type: string = 'info';
        switch (notify.type) {
          case 0:
            type = 'success';
            break;
          case 1:
            type = 'error';
            break;
          case 2:
            type = 'warning';
            break;
          case 3:
            type = 'info';
            break;
        }
        // @ts-ignore
        api[type]({
          message: notify.title,
          description: notify.content,
        });
      });
    } catch (ignore) {

    }
  };

  const doNotify = async () => {
    await getNotify();
    // 每隔5秒get一次
    setInterval(async () => {
      await getNotify();
    }, 5000);
  };

  useEffect(() => {
    doNotify();
  }, []);

  return <>
    {contextHolder}
    {loginUser ? (<Dropdown
      overlayClassName={classNames(styles.container)}
      menu={{
        items,
        onClick: onMenuClick,
      }}
      trigger={['click']}
    >
      <div className={`${styles.action} ${styles.account}`}>
        <Avatar
          src={BASE_URL + '/user/get/avatar/' + loginUser.uid} />
      </div>
    </Dropdown>) : (<>
      <Link to="/user/login">
        <Button type="primary" ghost style={{ marginRight: 16 }}>
          登录
        </Button>
      </Link>
    </>)}
  </>;
};

export default AvatarDropdown;
