import React from 'react';
import { Button, Result } from 'antd';
import { useSearchParams } from '@@/exports';


/**
 * 查询 基础信息
 */
const PageNotFound: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={<Button type="primary" onClick={() => {
        // 重定向到之前页面
        window.location.href = searchParams.get('redirect') ?? '/';
      }}>返回</Button>}
    />
  );
};

export default PageNotFound;
