import React from 'react';
import { history, useModel } from '@@/exports';
import Title from 'antd/es/typography/Title';
import { Button, Divider, message, Modal, Typography } from 'antd';
import { deleteUser } from '@/services/userService';
import { stringify } from 'querystring';

const { Text, Link } = Typography;

const AccountCompnoent: React.FC = () => {
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const onClick = () => {
    Modal.confirm({
      title: '确认删除',
      content: (
        <p>该操作无法撤销,请谨慎确认！</p>
      ),
      async onOk() {
        // 删除
        const hide = message.loading('删除中');
        try {
          const { data } = await deleteUser();
          message.success('删除成功');
          await setInitialState({
            ...initialState,
            loginUser: undefined,
          });
          // 刷新页面
          if (data) {
            setTimeout(() => {
              history.replace({
                pathname: '/user/login',
                search: stringify({
                  redirect: window.location.href,
                }),
              });
            }, 300);
          }
        } catch (e: any) {
          message.error(e.message);
        } finally {
          hide();
        }
      },
    });
  };
  return (<>
    <Title level={3} type="danger">删除账户</Title>
    <Divider />
    <Button danger onClick={onClick}>删除您的账户</Button>
  </>);
};
export default AccountCompnoent;