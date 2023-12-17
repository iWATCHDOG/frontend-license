import { userLogout } from '@/services/userService';
import { Link } from '@@/exports';
import { useModel } from '@umijs/max';
import { Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import classNames from 'classnames';
import { stringify } from 'querystring';
import React from 'react';
import { history, useNavigate } from 'umi';
import styles from './index.less';
import { BASE_URL } from '@/constants';


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
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
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

  return loginUser ? (<Dropdown
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
  </>);
};

export default AvatarDropdown;
