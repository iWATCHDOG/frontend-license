import React, { useRef, useState } from 'react';
import { Helmet, useModel } from '@@/exports';
import { ActionType, ProList } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import { addBlacklist, getLogByRequestID, getLogs } from '@/services/adminService';
import LogDrawer from '@/pages/admin/overview/components/archives/components/LogDrawer';
import TimeShow from '@/components/TimeShow';

const LogComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<AdminType.Log | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const getHttpTag = (code: number) => {
    // 如果是200系列，就是绿色，否则就是红色
    if (code >= 200 && code < 300) {
      return <Tag color={'green'}>{code}</Tag>;
    } else {
      return <Tag color={'red'}>{code}</Tag>;
    }
  };

  const getMethodTag = (method: string) => {
    // GET是绿色，POST是蓝色，DELETE是红色，PUT是黄色，其他是灰色
    if (method === 'GET') {
      return <Tag color={'green'}>{method}</Tag>;
    } else if (method === 'POST') {
      return <Tag color={'blue'}>{method}</Tag>;
    } else if (method === 'DELETE') {
      return <Tag color={'red'}>{method}</Tag>;
    } else if (method === 'PUT') {
      return <Tag color={'yellow'}>{method}</Tag>;
    } else {
      return <Tag color={'gray'}>{method}</Tag>;
    }
  };

  return (<>
    <Helmet>
      <title>请求日志 - 管理后台</title>
    </Helmet>
    <ProList<AdminType.Log>
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
        } = await getLogs(searchParams);
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
                  {row.requestId}
                </span>
              </Space>
            );
          },
        },
        description: {
          dataIndex: 'requestId',
          title: '请求ID',
          render: (_, row) => {
            return (
              <Space size={0} direction={'vertical'}>
                <Space>
                  <span>{row.url}</span>
                </Space>
                <Space>
                  {row.uid && (<>
                    <span>{row.uid}</span>
                    <span>|</span>
                  </>)}
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
            return (<>
              {getMethodTag(row.method as string)}
              {getHttpTag(row.httpCode as number)}
            </>);
          },
        },
        actions: {
          render: (_, row) => {
            return (<>
              <Space>
                <Button type={'link'} size={'small'} onClick={async () => {
                  setLoading(true);
                  setOpen(true);
                  const { data } = await getLogByRequestID(row.requestId as string);
                  setLog(data);
                  setLoading(false);
                }}>详情</Button>
                <Popconfirm
                  title="您确定要拉黑吗？"
                  onConfirm={async () => {
                    const hide = message.loading('处理中');
                    try {
                      await addBlacklist(row.id as number);
                      message.success('拉黑成功!');
                      actionRef.current?.reload();
                    } catch (e: any) {
                      message.error(e.message);
                    } finally {
                      hide();
                    }
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Typography.Link type="danger">拉黑</Typography.Link>
                </Popconfirm>
              </Space>
            </>);
          },
        },
      }}
    />
    <LogDrawer
      loading={loading}
      log={log}
      drawerVisible={open}
      onCancel={() => setOpen(false)} />
  </>);
};
export default LogComponent;