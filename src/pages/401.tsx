import React from 'react';
import { Button, Result } from 'antd';
import { useSearchParams } from '@@/exports';


/**
 * 查询 基础信息
 */
const NoLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <Result
      status="403"
      title="401"
      subTitle="抱歉，您还没有登录。"
      extra={<Button type="primary" onClick={() => {
        window.location.href = '/user/login?redirect=' + searchParams.get('redirect');
      }}>登录</Button>}
    />
  );
};

export default NoLogin;
