import React, { useRef } from 'react';
import { Helmet, useModel } from '@@/exports';
import { Avatar, Divider, message, Popconfirm, Space, Typography } from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { deletePermission, getPermissions } from '@/services/adminService';
import { BASE_URL } from '@/constants';

const PermissionComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Permission.PermissionVO>[] = [{
    title: 'ID',
    dataIndex: 'id',
    hideInForm: true,
    search: false,
  }, {
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
    hideInForm: true,
    search: false,
  }, {
    title: '权限',
    dataIndex: 'permission',
  }, {
    title: '到期时间',
    dataIndex: 'expiry',
    hideInForm: true,
    search: false,
    render: (dom, record) => {
      if (record?.expiry === 0) {
        return (
          <Typography.Text>永久</Typography.Text>);
      } else {
        // @ts-ignore
        const exp = new Date(record.expiry);
        // 格式化时间为 2021-01-01 00:00:00 格式,前面的0显示
        const t = exp.getFullYear() + '-' + (exp.getMonth() + 1).toString().padStart(2, '0') + '-' + exp.getDate().toString().padStart(2, '0') + ' ' + exp.getHours().toString().padStart(2, '0') + ':' + exp.getMinutes().toString().padStart(2, '0') + ':' + exp.getSeconds().toString().padStart(2, '0');
        return (
          <Typography.Text>{t}</Typography.Text>);
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
            try {
              await deletePermission(record.id as number);
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
    <Helmet>
      <title>权限列表 - 权限管理</title>
    </Helmet>
    <ProTable<Permission.PermissionVO>
      headerTitle="权限管理"
      actionRef={actionRef}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      request={async (params, sorter, filter) => {
        const searchParams: AdminType.PermissionQueryRequest = {
          ...params,
          // @ts-ignore
          sorter,
          filter,
        };
        const {
          data,
          code,
        } = await getPermissions(searchParams);
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
export default PermissionComponent;