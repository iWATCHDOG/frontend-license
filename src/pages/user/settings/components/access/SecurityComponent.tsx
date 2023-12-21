import React, { useRef } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Divider, message } from 'antd';
import { history, useModel } from '@@/exports';
import { ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { updateUserPassword } from '@/services/userService';
import { stringify } from 'querystring';

const SecurityComponent: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const formRef = useRef<ProFormInstance>();

  const doUpdate = async () => {
    const hide = message.loading('更新中');
    try {
      const oldPassword = formRef.current?.getFieldValue('oldPassword');
      const newPassword = formRef.current?.getFieldValue('newPassword');
      const params: UserType.UpdateUserPasswordRequest = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      const { data } = await updateUserPassword(params);
      // 刷新页面
      if (data) {
        localStorage.setItem('refreshing', 'refreshing');
        await setInitialState({
          ...initialState,
          loginUser: undefined,
        });
        // 清除cookie
        let date = new Date();
        date.setDate(date.getDate());
        document.cookie = `loginToken="null"; expires=${date.toUTCString()};`;
        setTimeout(async () => {
          // 到登录页面
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
          localStorage.removeItem('refreshing');
        }, 300);
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
  };

  return (<>
    <Title level={3}>修改密码</Title>
    <Divider />
    <ProForm<UserType.UpdateUserPasswordRequest>
      formRef={formRef}
      submitter={{
        render: () => {
          return [
            <Button type="primary" htmlType="button" onClick={doUpdate} key="update">
              更新密码
            </Button>,
          ];
        },
      }}
    >

      <ProFormText.Password
        name="oldPassword"
        fieldProps={{
          size: 'large',
        }}
        width="xl"
        label={'旧密码'}
        placeholder={'请输入旧密码'}
        rules={[{
          required: true,
          message: '请输入旧密码！',
        }]}
      />
      <ProFormText.Password
        name="newPassword"
        fieldProps={{
          size: 'large',
          autoComplete: 'new-password',
        }}
        width="xl"
        label={'新密码'}
        placeholder={'请输入新密码'}
        rules={[{
          required: true,
          message: '请输入新密码！',
        }, {
          pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
          message: '密码必须包含大小写字母、数字、特殊符号中的三种，且长度为8-30位',
        }]}
      />
      <ProFormText.Password
        name="newPasswordConfirm"
        fieldProps={{
          size: 'large',
          autoComplete: 'new-password',
        }}
        width="xl"
        label={'确认新密码'}
        placeholder={'请再次输入新密码'}
        rules={[{
          required: true,
          message: '请再次输入新密码！',
        }, ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject('两次密码输入不一致');
          },
        })]}
      />
    </ProForm>
  </>);
};
export default SecurityComponent;