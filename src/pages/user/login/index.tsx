import { userLogin } from '@/services/userService';
import {
  BilibiliOutlined,
  createFromIconfontCN,
  GithubOutlined,
  LockOutlined,
  QqOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Checkbox, message, Modal, Skeleton, Space } from 'antd';
// @ts-ignore
import { useSearchParams } from 'umi';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { BASE_URL, DEFAULT_NAME, TENCENT_CAPTCHA_APP_ID } from '@/constants';
import { Link } from '@@/exports';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { getEnableOAuthList } from '@/services/rootService';

/**
 * 用户登录页面
 */
export default () => {
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [show, setShow] = useState(false);
  const [oAuthList, setOAuthList] = useState<number[]>([]);

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  const { initialState, setInitialState } = useModel('@@initialState');

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4443134_jcggo4h6b6r.js',
  });

  /**
   * 用户登录
   * @param fields
   */
  const doUserLogin = async (fields: UserType.UserLoginRequest) => {
    const hide = message.loading('登录中');

    // @ts-ignore
    const captcha1 = new TencentCaptcha(TENCENT_CAPTCHA_APP_ID, async function(cr) {
      const bc: RootType.CaptchaResult = {
        ret: cr.ret,
        ticket: cr.ticket,
        CaptchaAppId: cr.CaptchaAppId,
        bizState: cr.bizState,
        randstr: cr.randstr,
      };
      if (cr.ret === 0) {
        try {
          const res = await userLogin(fields, bc);
          message.success('登录成功');
          // 记录登录信息
          setInitialState({
            ...initialState,
            loginUser: res.data,
          } as InitialState);
          // 写入 token
          let date = new Date();
          date.setDate(date.getDate() + 7);
          document.cookie = `loginToken=${res.data.token}; expires=${date.toUTCString()};`;
          // 重定向到之前页面
          window.location.href = searchParams.get('redirect') ?? '/';
        } catch (e: any) {
          message.error(e.message);
        }
      } else {
        message.error('请进行人机验证');
      }
      hide();
    });
    captcha1.show();
  };

  const enableOAuthList = async () => {
    const ret = await getEnableOAuthList();
    setOAuthList(ret.data);
  };

  useEffect(() => {
    // 判断是否已经登录
    if (initialState?.loginUser) {
      setShow(false);
      message.error('您已经登录，即将跳转到首页');
      setTimeout(() => {
        window.location.href = searchParams.get('redirect') ?? '/';
      }, 1000);
    } else {
      // 获取启用的 OAuth 列表
      enableOAuthList();
      setShow(true);
    }
  }, []);

  // @ts-ignore
  return <div
    style={{
      height: '100vh',
      backgroundSize: '100% 100%',
      padding: '32px 0 24px',
    }}
  >
    <Skeleton loading={!show} active paragraph={{ rows: 6 }}>
      <LoginForm<UserType.UserLoginRequest>
        title="登录"
        subTitle={DEFAULT_NAME}
        formRef={formRef}
        actions={
          <>
            {Array.isArray(oAuthList) && oAuthList.length > 0 && (
              <Space>
                其他登录方式
                {oAuthList.map((type) => (
                  <>
                    {type === 1 ? <a href={BASE_URL + '/oauth/wechat'} style={{ color: 'inherit' }}>
                      <WechatOutlined style={iconStyles} />
                    </a> : type === 2 ? <a href={BASE_URL + '/oauth/qq'} style={{ color: 'inherit' }}>
                      <QqOutlined style={iconStyles} />
                    </a> : type === 3 ? <a href={BASE_URL + '/oauth/github'} style={{ color: 'inherit' }}>
                      <GithubOutlined style={iconStyles} />
                    </a> : type === 5 ? <a href={BASE_URL + '/oauth/gitee'} style={{ color: 'inherit' }}>
                      <IconFont style={iconStyles} type={'icon-gitee'} />
                    </a> : type === 6 ? <a href={BASE_URL + '/oauth/microsoft'} style={{ color: 'inherit' }}>
                      <IconFont style={iconStyles} type={'icon-microsoft1'} />
                    </a> : type === 7 && <a href={BASE_URL + '/oauth/bilibili'} style={{ color: 'inherit' }}>
                      <BilibiliOutlined style={iconStyles} />
                    </a>}
                  </>
                ))}
              </Space>
            )}
          </>
        }
        onFinish={async (formData) => {
          // 判断是否同意用户协议
          if (!checked) {
            Modal.confirm({
              title: '用户协议',
              content: <p>我已阅读并同意《用户协议》</p>,
              onOk() {
                // 设置同意用户协议
                setChecked(true);
                // 提交
                formRef.current?.submit();
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
    </Skeleton>
  </div>;
};
