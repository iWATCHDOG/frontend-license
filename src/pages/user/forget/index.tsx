import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import { useSearchParams } from 'umi';
import React, { useState } from 'react';
import { DEFAULT_NAME } from '@/constants';
import { Link } from '@@/exports';
import { emailForget } from '@/services/userService';


type ForgetType = 'email' | 'phone';

export default () => {
  const [searchParams] = useSearchParams();
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');


  const [forgetType, setForgetType] = useState<ForgetType>('email');

  const doForget = async (fields: Record<string, any>) => {
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

  // @ts-ignore
  return (<div
    style={{
      height: '100vh',
      backgroundSize: '100% 100%',
      padding: '32px 0 24px',
    }}
  >
    <LoginForm
      title="找回密码"
      subTitle={DEFAULT_NAME}
      submitter={{
        searchConfig: {
          submitText: '找回密码',
        },
      }}
      onFinish={async (formData) => {
        await doForget(formData);
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
  </div>);
};
