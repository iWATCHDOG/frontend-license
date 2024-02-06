import React from 'react';
import { Helmet, useModel } from '@@/exports';
import { formatString } from '@/utils/stringUtils';

const AgreementComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  return (<>
    <Helmet>
      <title>用户协议 - 设置</title>
    </Helmet>
    {formatString('测试{data:1738842476000}哈哈哈{permission:gro.123}')}
    Agreement</>);
};
export default AgreementComponent;