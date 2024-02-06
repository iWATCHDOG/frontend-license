import React, { useRef } from 'react';
import { Avatar, Button, Space } from 'antd';
import { ActionType, ProList } from '@ant-design/pro-components';
import { getSecurityLogs } from '@/services/userService';
import { BASE_URL } from '@/constants';
import SecurityLogTag from '@/components/SecurityLogTag';
import TimeShow from '@/components/TimeShow';
import { Helmet } from '@@/exports';
import { formatString } from '@/utils/stringUtils';

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

  return (<>
    <Helmet>
      <title>安全日志 - 管理后台</title>
    </Helmet>
    <ProList<UserType.SecurityLog>
      actionRef={actionRef}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
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
                  <span>{formatString(row.info)}</span>
                </Space>}
                <Space>
                  <span>{row?.uid}</span>
                  <span>|</span>
                  <span>{row?.ip}</span>
                  <span>|</span>
                  <span><TimeShow date={new Date(row?.updateTime as any as number)} /></span>
                  <span>|</span>
                  <span>{row?.id}</span>
                </Space>
              </Space>
            );
          },
        },
        subTitle: {
          dataIndex: 'uid',
          title: 'UID',
          render: (_, row) => {
            return (
              <Space size={0}>
                {convertStringToList(row?.types).map((data: number, index: number) => <>
                  <SecurityLogTag data={data} />
                </>)}
              </Space>
            );
          },
        },
      }}
    />
  </>);
};
export default SecurityLogComponent;