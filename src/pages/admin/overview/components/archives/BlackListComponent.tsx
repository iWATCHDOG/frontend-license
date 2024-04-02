import React, { useRef } from 'react';
import { Helmet, useModel } from '@@/exports';
import { ActionType, ProList } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import { deleteBlacklist, getBlackList } from '@/services/adminService';
import TimeShow from '@/components/TimeShow';
import { BASE_URL } from '@/constants';

const BlackListComponent: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');

  return (<>
    <Helmet>
      <title>黑名单 - 设置</title>
    </Helmet>
    <ProList<RootType.Blacklist>
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
        <a key="1" href={BASE_URL + '/admin/download/blacklist'} target={'_blank'} rel="noreferrer">
          <Button key={2}>导出</Button>
        </a>,
      ]}
      dateFormatter="string"
      search={{
        labelWidth: 'auto',
        filterType: 'light',
      }}
      split={true}
      showActions="hover"
      request={async (params) => {
        const searchParams: AdminType.BlacklistQueryRequest = {
          ...params,
        };
        const {
          data,
          code,
        } = await getBlackList(searchParams);
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
                  {row.ip}
                </span>
              </Space>
            );
          },
        },
        description: {
          dataIndex: 'info',
          search: false,
          render: (_, row) => {
            return (
              <Space size={0} direction={'vertical'}>
                <Space>
                  <span>{row.log}</span>
                  <span>|</span>
                  <span>{row.reason}</span>
                  <span>|</span>
                  <span><TimeShow date={new Date(row?.updateTime as any as number)} /></span>
                </Space>
              </Space>
            );
          },
        },
        actions: {
          render: (_, row) => {
            return (<>
              <Space>
                <Popconfirm
                  title="您确定要删除吗？"
                  onConfirm={async () => {
                    const hide = message.loading('处理中');
                    try {
                      await deleteBlacklist(row.id as number);
                      message.success('删除成功!');
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
                  <Button size={'small'} type="primary" danger ghost>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            </>);
          },
        },
      }}
    />
  </>);
};
export default BlackListComponent;