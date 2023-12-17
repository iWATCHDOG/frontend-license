import { userLogin } from '@/services/userService';
import { GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Checkbox, message, Modal, Space } from 'antd';
import { useSearchParams } from 'umi';
import React, { CSSProperties, useState } from 'react';
import { BASE_URL, DEFAULT_NAME } from '@/constants';
import { Link } from '@@/exports';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';

/**
 * 用户登录页面
 */
export default () => {
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = useState(false);

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  /**
   * 用户登录
   * @param fields
   */
  const doUserLogin = async (fields: UserType.UserLoginRequest) => {
    const hide = message.loading('登录中');
    try {
      const res = await userLogin(fields);
      message.success('登录成功');
      // 记录登录信息
      setInitialState({
        ...initialState,
        loginUser: res.data,
      } as InitialState);
      // 重定向到之前页面
      window.location.href = searchParams.get('redirect') ?? '/';
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
  };

  // @ts-ignore
  return (<div
    style={{
      height: '100vh',
      backgroundSize: '100% 100%',
      padding: '32px 0 24px',
    }}
  >
    <LoginForm<UserType.UserLoginRequest>
      title="登录"
      subTitle={DEFAULT_NAME}
      actions={
        <Space>
          其他登录方式
          <a href={BASE_URL + '/oauth/github'} style={{ color: 'inherit' }}>
            <GithubOutlined style={iconStyles} />
          </a>
        </Space>
      }
      onFinish={async (formData) => {
        // 判断是否同意用户协议
        if (!checked) {
          Modal.confirm({
            title: '用户协议',
            content: (
              <p>我已阅读并同意《用户协议》</p>
            ),
            onOk() {
              // 设置同意用户协议
              setChecked(true);
              doUserLogin(formData);
            },
            onCancel() {
              message.error('您未同意用户协议，无法登录');
            },
          });
          return;
        }
        await doUserLogin(formData);
      }}
    >
      <ProFormText
        name="account"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={'请输入账号'}
        rules={[{
          required: true,
          message: '请输入账号!',
        }]}
      />

      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'请输入密码'}
        rules={[{
          required: true,
          message: '请输入密码！',
        }]}
      />

      <div
        style={{
          marginBlockEnd: 24,
        }}
      >
        <Checkbox name="agreement"
                  checked={checked}
                  onChange={onChange}>
          我已阅读并同意
          <Link to="/agreement">《用户协议》</Link>
        </Checkbox>
      </div>

      <div
        style={{
          marginBlockEnd: 24,
        }}
      >
        <Link
          to="/user/register"
          style={{
            float: 'left',
          }}
        >
          注册账号
        </Link>
        <Link
          to="/user/forget"
          style={{
            float: 'right',
          }}
        >
          忘记密码
        </Link>
      </div>
    </LoginForm>
  </div>);
};
