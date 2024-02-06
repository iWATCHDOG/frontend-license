import React, { useRef, useState } from 'react';
import { Helmet, useModel } from '@@/exports';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Badge, Button, Divider, Space } from 'antd';
import { BASE_URL } from '@/constants';
import { getUsers } from '@/services/adminService';
import { ManOutlined, QuestionCircleOutlined, WomanOutlined } from '@ant-design/icons';
import AddModalComponent from '@/pages/admin/overview/components/permission/components/AddModal';

const PermissionAddComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const actionRef = useRef<ActionType>();
  const [user, setUser] = useState<UserType.UserVO | undefined>(undefined);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);

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
      1: { text: <><ManOutlined /> 男</> },
      2: { text: <><WomanOutlined /> 女</> },
      3: { text: <><QuestionCircleOutlined /> 保密</> },
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      0: { text: <Badge status="success" text={'正常'} /> },
      1: { text: <Badge status="warning" text={'禁用'} /> },
      2: { text: <Badge status="error" text={'删除'} /> },
    },
  }, {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <Space split={<Divider type="vertical" />}>
        <Button onClick={async () => {
          // 打开添加权限的页面
          setUser(record);
          setAddModalVisible(true);
        }}>选择</Button>
      </Space>
    ),
  }];
  return (<>
    <Helmet>
      <title>添加权限 - 权限管理</title>
    </Helmet>
    <ProTable<UserType.UserVO>
      headerTitle="添加权限"
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
    <AddModalComponent
      user={user}
      modalVisible={addModalVisible}
      onCancel={() => setAddModalVisible(false)}
      onFinish={() => setAddModalVisible(false)} />
  </>);
};
export default PermissionAddComponent;