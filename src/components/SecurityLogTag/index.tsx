import { Tag } from 'antd';
import React from 'react';

enum SecurityType {
  CHANGE_PASSWORD_FORGET = 100,
  CHANGE_PASSWORD = 101,
  BIND_GITHUB = 200,
  UNBIND_GITHUB = 201,
  UPDATE_PROFILE = 300,
  CHANGE_AVATAR = 301,
  ADD_ACCOUNT = 400,
  DELETE_USER = 401,
  ADMIN_OPERATION = 500
}

const getSecurityTypeColor = (type: SecurityType) => {
  const colors: Record<SecurityType, string> = {
    [SecurityType.CHANGE_PASSWORD_FORGET]: 'red',
    [SecurityType.CHANGE_PASSWORD]: 'blue',
    [SecurityType.BIND_GITHUB]: 'green',
    [SecurityType.UNBIND_GITHUB]: 'orange',
    [SecurityType.UPDATE_PROFILE]: 'purple',
    [SecurityType.CHANGE_AVATAR]: 'cyan',
    [SecurityType.ADD_ACCOUNT]: 'magenta',
    [SecurityType.DELETE_USER]: 'geekblue',
    [SecurityType.ADMIN_OPERATION]: 'volcano',
  };
  return colors[type];
};

const getSecurityTypeDescription = (type: SecurityType) => {
  const descriptions: Record<SecurityType, string> = {
    [SecurityType.CHANGE_PASSWORD_FORGET]: '找回密码',
    [SecurityType.CHANGE_PASSWORD]: '修改密码',
    [SecurityType.BIND_GITHUB]: '绑定GitHub',
    [SecurityType.UNBIND_GITHUB]: '解绑GitHub',
    [SecurityType.UPDATE_PROFILE]: '更新资料',
    [SecurityType.CHANGE_AVATAR]: '修改头像',
    [SecurityType.ADD_ACCOUNT]: '注册',
    [SecurityType.DELETE_USER]: '注销账号',
    [SecurityType.ADMIN_OPERATION]: '管理员操作',
  };
  return descriptions[type];
};

const getSecurityTypeByCode = (code: number) => {
  if (Object.values(SecurityType).includes(code)) {
    return code as SecurityType;
  }
  return undefined;
};

interface Props {
  data: number;
}

const SecurityLogTag: React.FC<Props> = (props) => {
  const { data } = props;
  const getSecurityTypeTag = (code: number) => {
    const type = getSecurityTypeByCode(code);
    if (!type) {
      return <></>;
    }
    return <Tag color={getSecurityTypeColor(type)}>{getSecurityTypeDescription(type)}</Tag>;
  };
  return <>
    {getSecurityTypeTag(data)}
  </>;
};
export default SecurityLogTag;
