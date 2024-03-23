import React, { useRef } from 'react';
import { Button, Space } from 'antd';
import { ActionType, ProList } from '@ant-design/pro-components';
import { getSecurityLogs } from '@/services/userService';
import { Helmet, useModel } from '@@/exports';
import SecurityLogTag from '@/components/SecurityLogTag';
import TimeShow from '@/components/TimeShow';
import { formatString } from '@/utils/stringUtils';
import SecurityLogAvatar from '@/components/SecurityLogAvatar';

const SecurityLogComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
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
      <title>安全日志 - 档案</title>
    </Helmet>
    <ProList<UserType.SecurityLogVO>
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
          uid: loginUser?.uid,
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
              <SecurityLogAvatar row={row} />
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
          dataIndex: 'labels',
          render: (_, row) => {
            return (
              <Space size={0}>
                {convertStringToList(row?.types).map((data: number) => <>
                  <SecurityLogTag data={data} />
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