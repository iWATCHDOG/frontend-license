import React from 'react';
import { Button, Result } from 'antd';


/**
 * 查询 基础信息
 */
const NoLogin: React.FC = () => {
  return (
    <Result
      status="403"
      title="401"
      subTitle="抱歉，您还没有登录。"
      extra={<Button type="primary" onClick={() => {
        window.location.href = '/user/login';
      }}>登录</Button>}
    />
  );
};

export default NoLogin;
