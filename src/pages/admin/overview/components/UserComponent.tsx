import React, { useRef } from 'react';
import { useModel } from '@@/exports';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Badge, Button, Divider, message, Popconfirm, Space, Typography } from 'antd';
import { deleteUser, getUsers } from '@/services/adminService';
import { BASE_URL } from '@/constants';

const UserComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserType.UserVO>[] = [{
    title: 'UID',
    dataIndex: 'uid',
  }, {
    title: '头像',
    dataIndex: 'avatar',
    render: (dom, record) => {
      return (<Avatar
        size={40}
        src={BASE_URL + '/user/get/avatar/' + record?.uid}
      />);
    },
    hideInForm: true,
    search: false,
  }, {
    title: '用户名',
    dataIndex: 'username',
  }, {
    title: '邮箱',
    dataIndex: 'email',
  }, {
    title: '手机号',
    dataIndex: 'phone',
  }, {
    title: '性别',
    dataIndex: 'gender',
    valueEnum: {
      1: { text: '男' },
      2: { text: '女' },
      3: { text: '保密' },
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      0: { text: '正常' },
      1: { text: '禁用' },
      2: { text: '删除' },
    },
    render: (dom, record) => {
      if (record.status === 0) {
        return (<Badge status="success" text={'正常'} />);
      } else if (record.status === 1) {
        return (<Badge status="warning" text={'禁用'} />);
      } else {
        return (<Badge status="error" text={'删除'} />);
      }
    },
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    hideInForm: true,
    search: false,
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: 'dateTime',
    hideInForm: true,
    search: false,
  }, {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <Space split={<Divider type="vertical" />}>
        <Typography.Link
          onClick={() => {
          }}
        >
          编辑
        </Typography.Link>
        <Popconfirm
          title="您确定要删除么？"
          onConfirm={async () => {
            const hide = message.loading('更新中');
            const uid = record.uid;
            try {
              await deleteUser(typeof uid === 'number' ? uid : -1);
              message.success('删除成功');
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
          <Typography.Link type="danger">删除</Typography.Link>
        </Popconfirm>
      </Space>
    ),
  }];
  return (<>
    <ProTable<UserType.UserVO>
      headerTitle="用户管理"
      actionRef={actionRef}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        <Button
          key="1"
          type="primary"
        >
          新建
        </Button>,
      ]}
      request={async (params, sorter, filter) => {
        const searchParams: AdminType.UserQueryRequest = {
          ...params,
          // @ts-ignore
          sorter,
          filter,
        };
        const {
          data,
          code,
        } = await getUsers(searchParams);
        // @ts-ignore
        const d = data?.records || [];
        // @ts-ignore
        const t = data?.total || 0;
        return {
          data: d,
          success: code === 20000,
          total: t,
        } as any;
      }}
      columns={columns}
    />
  </>);
};
export default UserComponent;