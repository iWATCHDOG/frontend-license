import { FileTextOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { DEFAULT_NAME } from '@/constants';
import { Link } from '@@/exports';
import { emailCodeRequest, userLogin, userRegister } from '@/services/userService';

type RegisterType = 'email' | 'phone';

export default () => {
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');


  const [registerType, setRegisterType] = useState<RegisterType>('email');

  const doRegister = async (fields: UserType.UserCreateRequest) => {
    console.log(fields);
    const hide = message.loading('处理中');
    try {
      await userRegister(fields);
      message.success('注册成功');
      // 登录
      const lf = {
        account: fields.email ?? fields.phone,
        password: fields.password,
      } as unknown as UserType.UserLoginRequest;
      const res = await userLogin(lf);
      // 记录登录信息
      setInitialState({
        ...initialState,
        loginUser: res.data,
      } as InitialState);
      // 重定向到之前页面
      window.location.href = '/';
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
    <LoginForm<UserType.UserCreateRequest>
      title="注册账号"
      subTitle={DEFAULT_NAME}
      submitter={{
        searchConfig: {
          submitText: '注册',
        },
      }}
      onFinish={async (formData) => {
        await doRegister(formData);
      }}
    >
      <Tabs
        centered
        activeKey={registerType}
        onChange={(activeKey) => setRegisterType(activeKey as RegisterType)}
      >
        <Tabs.TabPane key={'email'} tab={'邮箱注册'} />
        <Tabs.TabPane key={'phone'} tab={'手机号注册'} />
      </Tabs>
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={'请输入用户名'}
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          }, {
            pattern: /^[a-zA-Z0-9_-]{1,16}$/,
            message: '用户名必须是4-16位字母、数字、下划线、减号组成',
          },
        ]}
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
        }, {
          pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
          message: '密码必须包含大小写字母、数字、特殊符号中的三种，且长度为8-30位',
        }]}
      />
      <ProFormText.Password
        name="password-confirm"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'请再次输入密码'}
        rules={[{
          required: true,
          message: '请再次输入密码！',
        }, ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject('两次密码输入不一致');
          },
        })]}
      />
      {registerType === 'email' && <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <MailOutlined className={'prefixIcon'} />,
        }}
        onGetCaptcha={async (email) => {
          const hide = message.loading('处理中');
          if (email === undefined) {
            message.error('请输入邮箱！');
            hide();
            return new Promise((resolve, reject) => {
              reject();
            });
          }
          try {
            const { data } = await emailCodeRequest(email);
            if (data) {
              message.success(`验证码发送成功！请注意查收`);
            } else {
              message.error('验证码发送失败！请稍后重试');
            }
          } catch (e: any) {
            message.error(e.message);
          } finally {
            hide();
          }
        }}
        placeholder="请输入邮箱"
        rules={[
          {
            required: true,
            message: '请输入邮箱!',
          }, {
            type: 'email',
            message: '请输入正确的邮箱格式！',
          },
        ]}
        name="email"
        phoneName="email"
      />}
      {registerType === 'phone' && <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <PhoneOutlined className={'prefixIcon'} />,
        }}
        onGetCaptcha={async (phone) => {
          const hide = message.loading('处理中');
          if (!phone) {
            message.error('请输入手机号！');
            hide();
            return new Promise((resolve, reject) => {
              reject();
            });
          }
          try {
            /*const { data } = await emailCodeRequest(phone);
            if (data) {
              message.success('验证码发送成功！请注意查收');
            } else {
              message.error('验证码发送失败！请稍后重试');
            }*/
            message.error('暂不支持手机注册');
          } catch (e: any) {
            message.error(e.message);
          } finally {
            hide();
          }
          return new Promise((resolve, reject) => {
            reject();
          });
        }}
        placeholder="请输入手机号"
        rules={[
          {
            required: true,
            message: '请输入手机号!',
          }, {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号格式！',
          },
        ]}
        name="phone"
        phoneName="phone"
      />}
      <ProFormText
        name="code"
        fieldProps={{
          size: 'large',
          prefix: <FileTextOutlined className={'prefixIcon'} />,
        }}
        placeholder={'请输入验证码'}
        rules={[
          {
            required: true,
            message: '请输入验证码!',
          },
        ]}
      />
      <div
        style={{
          marginBlockEnd: 24,
        }}
      >
        <Link
          to="/user/forget"
          style={{
            float: 'left',
          }}
        >
          忘记密码
        </Link>
        <Link
          to="/user/login"
          style={{
            float: 'right',
          }}
        >
          返回登录
        </Link>
      </div>
    </LoginForm>
  </div>);
};
