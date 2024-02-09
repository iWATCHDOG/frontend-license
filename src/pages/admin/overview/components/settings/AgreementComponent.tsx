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
    {formatString('修改权限：{old:{permission:*},new:{permission:null}}，过期时间：{old:{date:0},new:{date:1708846587023}}')}
    Agreement</>);
};
export default AgreementComponent;