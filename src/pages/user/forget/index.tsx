import { LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import { useSearchParams } from 'umi';
import React, { useEffect, useState } from 'react';
import { DEFAULT_NAME } from '@/constants';
import { Link, useParams } from '@@/exports';
import { checkForgetPasswordToken, emailForget, forgetPasswordB } from '@/services/userService';


type ForgetType = 'email' | 'phone';

export default () => {
  const [searchParams] = useSearchParams();
  const {
    initialState,
  } = useModel('@@initialState');

  const [checked, setChecked] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  // 获取路由传参
  const params = useParams();

  const [forgetType, setForgetType] = useState<ForgetType>('email');

  const sendForgetMail = async (fields: Record<string, any>) => {
    const hide = message.loading('处理中');
    try {
      // 判断是否是邮箱
      if (forgetType === 'email') {
        // 邮箱找回
        const email = fields.email;
        await emailForget(email);
        message.success('邮件已发送，请注意查收');
      } else if (forgetType === 'phone') {
        // 手机号找回
        const phone = fields.phone;
        message.error('暂不支持手机号找回');
      } else {
        message.error('找回方式错误');
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
  };

  const forgetPassword = async (fields: Record<string, any>) => {
    const hide = message.loading('处理中');
    try {
      const token = params.token;
      const password = fields.password;
      await forgetPasswordB(password, token ? token : '');
      message.success('重置成功');
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
  };

  const check = async () => {
    const token = params.token;
    try {
      const ret = await checkForgetPasswordToken(token ? token : '');
      if (!ret) {
        setChecked(false);
        message.error('无效的token');
      } else {
        setChecked(true);
        // @ts-ignore
        setEmailValue(ret.data);
      }
    } catch (e) {
      setChecked(false);
      message.error('无效的token');
    }
  };

  useEffect(() => {
    // 判断是否已经登录
    if (initialState?.loginUser) {
      message.error('您已经登录，即将跳转到首页');
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } else {
      const token = params.token;
      if (token) {
        check();
      }
    }
  }, []);

  // @ts-ignore
  return (<div
    style={{
      height: '100vh',
      backgroundSize: '100% 100%',
      padding: '32px 0 24px',
    }}
  >
    {!checked &&
      <LoginForm
        title="找回密码"
        subTitle={DEFAULT_NAME}
        submitter={{
          searchConfig: {
            submitText: '找回密码',
          },
        }}
        onFinish={async (formData) => {
          await sendForgetMail(formData);
        }}
      >
        <Tabs
          centered
          activeKey={forgetType}
          onChange={(activeKey) => setForgetType(activeKey as ForgetType)}
        >
          <Tabs.TabPane key={'email'} tab={'邮箱'} />
          <Tabs.TabPane key={'phone'} tab={'手机号'} />
        </Tabs>
        {forgetType === 'email' &&
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入注册邮箱'}
            rules={[{
              required: true,
              message: '请输入注册邮箱!',
            }, {
              type: 'email',
              message: '请输入正确的邮箱格式!',
            }]}
          />}
        {forgetType === 'phone' &&
          <ProFormText
            name="phone"
            fieldProps={{
              size: 'large',
              prefix: <PhoneOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入注册手机号'}
            rules={[{
              required: true,
              message: '请输入注册手机号!',
            }, {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式！',
            }]}
          />}
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
            to="/user/login"
            style={{
              float: 'right',
            }}
          >
            返回登录
          </Link>
        </div>
      </LoginForm>
    }
    {checked &&
      <LoginForm
        title="重置密码"
        subTitle={DEFAULT_NAME}
        submitter={{
          searchConfig: {
            submitText: '重置',
          },
        }}
        onFinish={async (formData) => {
          await forgetPassword(formData);
        }}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: <MailOutlined className={'prefixIcon'} />,
            defaultValue: emailValue,
          }}
          disabled={true}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
            autoComplete: 'new-password',
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
            autoComplete: 'new-password',
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
            to="/user/login"
            style={{
              float: 'right',
            }}
          >
            返回登录
          </Link>
        </div>
      </LoginForm>
    }
  </div>);
};
