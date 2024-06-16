import { userLogout } from '@/services/userService';
import { useModel } from '@umijs/max';
import { Avatar, Button, Dropdown, MenuProps, message, notification, Space, Typography } from 'antd';
import classNames from 'classnames';
import { stringify } from 'querystring';
import React, { useEffect } from 'react';
// @ts-ignore
import { history, useNavigate } from 'umi';
import styles from './index.less';
import { BASE_URL } from '@/constants';
import { getNotifyList } from '@/services/rootService';
import { PoweroffOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;


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

  const toLogin = async () => {
    localStorage.setItem('refreshing', 'refreshing');
    setTimeout(() => {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
      localStorage.removeItem('refreshing');
    }, 300);
  };

  const onMenuClick = async (event: {
    key: React.Key; keyPath: React.Key[];
  }) => {
    const { key } = event;

    if (key === 'logout') {
      await setInitialState({
        ...initialState,
        loginUser: undefined,
      });
      localStorage.setItem('refreshing', 'refreshing');
      try {
        await userLogout();
        message.success('已退出登录');
      } catch (e: any) {
        message.error('操作失败');
      }
      // 清除cookie
      let date = new Date();
      date.setDate(date.getDate());
      document.cookie = `loginToken="null"; expires=${date.toUTCString()};`;
      setTimeout(() => {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        localStorage.removeItem('refreshing');
      }, 300);
      return;
    } else if (key === 'settings') {
      navigate('/user/settings');
    } else if (key === 'profile') {
      navigate('/user/' + loginUser?.username + '.' + loginUser?.uid);
    }
  };

  const items: MenuProps['items'] = loginUser ? [{
    key: 'current',
    label: loginUser.username ?? 'null',
    disabled: true,
  }, {
    key: 'profile',
    label: <>
      <UserOutlined /> 个人资料
    </>,
  }, {
    type: 'divider',
  }, {
    key: 'settings',
    label: <>
      <SettingOutlined /> 设置
    </>,
  }, {
    type: 'divider',
  }, {
    key: 'logout',
    danger: true,
    label: <>
      <PoweroffOutlined /> 退出登录
    </>,
  }] : [];

  const getNotify = async () => {
      // 判断是否处于刷新状态
      if (localStorage.getItem('refreshing') !== 'refreshing') {
        // 处于刷新状态
        try {
          const res = await getNotifyList();
          res.data.forEach((notify: {
            type: any;
            title: any;
            content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
            id: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
          }) => {
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
              description: <>
                <Text>
                  {notify.content}
                </Text>
                <div style={{ textAlign: 'right' }}>
                  <Space direction="vertical">
                    <Typography.Text type="secondary" style={{ fontSize: 'smaller' }}>
                      {notify.id}
                    </Typography.Text>
                  </Space>
                </div>
              </>,
            });
          });
        } catch (ignore) {

        }
      }
    }
  ;

  const doNotify = async () => {
    await getNotify();
    // 每隔5秒get一次
    setInterval(async () => {
      await getNotify();
    }, 5000);
  };

  useEffect(() => {
    const redirect = localStorage.getItem('redirect');
    if (redirect) {
      localStorage.removeItem('redirect');
      window.location.href = redirect ?? '/';
    } else {
      doNotify();
    }
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
      <Button type="primary" onClick={toLogin} ghost style={{ marginRight: 16 }}>
        登录
      </Button>
    </>)}
  </>;
};

export default AvatarDropdown;
