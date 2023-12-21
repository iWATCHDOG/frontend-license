import React, { useRef } from 'react';
import { Avatar, Button, Space, Tag } from 'antd';
import { ActionType, ProList } from '@ant-design/pro-components';
import { getSecurityLogs } from '@/services/userService';
// @ts-ignore
import humanizeDuration from 'humanize-duration';
import { BASE_URL } from '@/constants';

enum SecurityType {
  CHANGE_PASSWORD_FORGET = 100,
  CHANGE_PASSWORD = 101,
  BIND_GITHUB = 200,
  UNBIND_GITHUB = 201,
  UPDATE_PROFILE = 300,
  CHANGE_AVATAR = 301,
  ADD_ACCOUNT = 400,
  DELETE_USER = 401
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
  };
  return descriptions[type];
};

const getSecurityTypeByCode = (code: number) => {
  if (Object.values(SecurityType).includes(code)) {
    return code as SecurityType;
  }
  return undefined;
};

const humanizer = humanizeDuration.humanizer({
  language: 'zh_CN',
  maxDecimalPoints: 0,
  delimiter: ' ',
  largest: 1,
});

const fillZero2 = (s: number) => {
  if (s < 10) {
    return `0${s}`;
  }
  return s;
};

const translateTimeCreated = (d: Date | undefined) => {
  if (!d) {
    return '';
  }
  const t = d.getTime();
  const offset = Date.now() - t;
  if (offset < 5 * 60 * 1000) {
    return '刚刚';
  }
  if (offset > 7 * 24 * 60 * 60 * 1000) {
    return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
  }
  return humanizer(offset) + '前';
};

const SecurityLogComponent: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const convertStringToList = (s: string | undefined) => {
    // 已知s的例子是[301]或[301,302] 或者可能是undefined
    if (!s) {
      return [];
    }
    const arr = s.split(',');
    const res: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      const n = parseInt(arr[i].replace('[', '').replace(']', ''));
      res.push(n);
    }
    return res;
  };

  const getSecurityTypeTag = (code: number) => {
    const type = getSecurityTypeByCode(code);
    if (!type) {
      return <></>;
    }
    return <Tag color={getSecurityTypeColor(type)}>{getSecurityTypeDescription(type)}</Tag>;
  };

  return (<>
    <ProList<UserType.SecurityLog>
      actionRef={actionRef}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
      toolBarRender={() => [
        <Button
          key="3"
          type="primary"
          onClick={() => {
            actionRef.current?.reload();
          }}
        >
          刷新
        </Button>,
      ]}
      dateFormatter="string"
      search={{
        labelWidth: 'auto',
        filterType: 'light',
      }}
      split={true}
      showActions="hover"
      request={async (params) => {
        const searchParams: UserType.UserSecurityLogQueryRequest = {
          ...params,
        };
        const {
          data,
          code,
        } = await getSecurityLogs(searchParams);
        const d = data?.records || [];
        return {
          data: d,
          success: code === 20000,
          total: data.total,
        } as any;
      }}
      metas={{
        title: {
          dataIndex: 'id',
          title: 'ID',
          render: (_, row) => {
            return (
              <Space size={0}>
                <span style={{
                  color: '#477fef',
                }}>
                  {row.title ?? '未知'}
                </span>
              </Space>
            );
          },
        },
        avatar: {
          dataIndex: 'avatar',
          search: false,
          render: (_, row) => {
            return (
              <Avatar
                size={40}
                src={BASE_URL + '/user/get/avatar/' + row?.uid}
              />
            );
          },
        },
        description: {
          dataIndex: 'info',
          search: false,
          render: (_, row) => {
            return (
              <Space size={0} direction={'vertical'}>
                {row.info && <Space>
                  <span>{row.info}</span>
                </Space>}
                <Space>
                  <span>{row?.ip}</span>
                  <span>|</span>
                  <span>{translateTimeCreated(new Date(row?.updateTime as any as number))}</span>
                  <span>|</span>
                  <span>{row?.id}</span>
                </Space>
              </Space>
            );
          },
        },
        subTitle: {
          dataIndex: 'labels',
          render: (_, row) => {
            return (
              <Space size={0}>
                {convertStringToList(row?.types).map((data: number, index: number) => <>
                  {getSecurityTypeTag(data)}
                </>)}
              </Space>
            );
          },
          search: false,
        },
      }}
    />
  </>);
};
export default SecurityLogComponent;