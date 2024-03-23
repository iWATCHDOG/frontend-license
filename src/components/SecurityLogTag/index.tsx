import { Tag } from 'antd';
import React from 'react';

enum SecurityType {
  UNKNOWN = -1,
  CHANGE_PASSWORD_FORGET = 100,
  CHANGE_PASSWORD = 101,
  BIND_GITHUB = 200,
  UNBIND_GITHUB = 201,
  BIND_GITEE = 202,
  UNBIND_GITEE = 203,
  UPDATE_PROFILE = 300,
  CHANGE_AVATAR = 301,
  ADD_ACCOUNT = 400,
  DELETE_USER = 401,
  ADMIN_OPERATION = 500,
  ADD_PERMISSION = 600,
  REMOVE_PERMISSION = 601,
  UPDATE_PERMISSION = 602,
  ADD_BLACKLIST = 700,
  REMOVE_BLACKLIST = 701,
}

const getSecurityTypeColor = (type: SecurityType) => {
  const colors: Record<SecurityType, string> = {
    [SecurityType.UNKNOWN]: 'gray',
    [SecurityType.CHANGE_PASSWORD_FORGET]: 'red',
    [SecurityType.CHANGE_PASSWORD]: 'blue',
    [SecurityType.BIND_GITHUB]: 'green',
    [SecurityType.UNBIND_GITHUB]: 'orange',
    [SecurityType.BIND_GITEE]: 'purple',
    [SecurityType.UNBIND_GITEE]: 'cyan',
    [SecurityType.UPDATE_PROFILE]: 'purple',
    [SecurityType.CHANGE_AVATAR]: 'cyan',
    [SecurityType.ADD_ACCOUNT]: 'magenta',
    [SecurityType.DELETE_USER]: 'geekblue',
    [SecurityType.ADMIN_OPERATION]: 'volcano',
    [SecurityType.ADD_PERMISSION]: 'gold',
    [SecurityType.REMOVE_PERMISSION]: 'lime',
    [SecurityType.UPDATE_PERMISSION]: 'yellow',
    [SecurityType.ADD_BLACKLIST]: 'orange',
    [SecurityType.REMOVE_BLACKLIST]: 'cyan',
  };
  return colors[type] ?? 'red';
};

const getSecurityTypeDescription = (type: SecurityType) => {
  const descriptions: Record<SecurityType, string> = {
    [SecurityType.UNKNOWN]: '未知',
    [SecurityType.CHANGE_PASSWORD_FORGET]: '找回密码',
    [SecurityType.CHANGE_PASSWORD]: '修改密码',
    [SecurityType.BIND_GITHUB]: '绑定GitHub',
    [SecurityType.UNBIND_GITHUB]: '解绑GitHub',
    [SecurityType.BIND_GITEE]: '绑定Gitee',
    [SecurityType.UNBIND_GITEE]: '解绑Gitee',
    [SecurityType.UPDATE_PROFILE]: '更新资料',
    [SecurityType.CHANGE_AVATAR]: '修改头像',
    [SecurityType.ADD_ACCOUNT]: '注册',
    [SecurityType.DELETE_USER]: '注销账号',
    [SecurityType.ADMIN_OPERATION]: '管理员操作',
    [SecurityType.ADD_PERMISSION]: '添加权限',
    [SecurityType.REMOVE_PERMISSION]: '移除权限',
    [SecurityType.UPDATE_PERMISSION]: '更新权限',
    [SecurityType.ADD_BLACKLIST]: '添加黑名单',
    [SecurityType.REMOVE_BLACKLIST]: '移除黑名单',
  };
  return descriptions[type];
};

const getSecurityTypeByCode = (code: number) => {
  if (Object.values(SecurityType).includes(code)) {
    return code as SecurityType;
  }
  return SecurityType.UNKNOWN;
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
