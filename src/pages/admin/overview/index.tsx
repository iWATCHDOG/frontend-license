import { useModel, useParams } from '@@/exports';
import React, { useEffect, useState } from 'react';
import {
  ContainerOutlined,
  ExceptionOutlined,
  FormOutlined,
  HomeOutlined,
  PlusSquareOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, Result } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { ProCard } from '@ant-design/pro-components';
import { Content } from 'antd/es/layout/layout';
import OverViewComponent from '@/pages/admin/overview/components/OverViewComponent';
import UserComponent from '@/pages/admin/overview/components/UserComponent';
import AgreementComponent from '@/pages/admin/overview/components/settings/AgreementComponent';
import SecurityLogComponent from '@/pages/admin/overview/components/archives/SecurityLogComponent';
import LogComponent from '@/pages/admin/overview/components/archives/LogComponent';
import PermissionComponent from '@/pages/admin/overview/components/permission/PermissionCompoent';
import PermissionAddComponent from '@/pages/admin/overview/components/permission/PermissionAddComponent';

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  // 获取路由传参
  const params = useParams();
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const items = [{
    type: 'overview',
    key: '1',
    label: '概览',
    icon: <HomeOutlined />,
  }, {
    type: 'user',
    key: '2',
    label: '用户管理',
    icon: <UserOutlined />,
  }, {
    type: 'group',
    key: '3',
    label: '权限管理',
    children: [{
      type: 'permission/overview',
      key: '3-1',
      label: '权限列表',
      icon: <SecurityScanOutlined />,
    }, {
      type: 'permission/add',
      key: '3-2',
      label: '添加权限',
      icon: <PlusSquareOutlined />,
    }],
  }, {
    type: 'group',
    key: '4',
    label: '设置',
    children: [{
      type: 'agreement',
      key: '4-1',
      label: '用户协议',
      icon: <FormOutlined />,
    }],
  }, {
    type: 'group',
    key: '5',
    label: '日志',
    children: [{
      type: 'security-log',
      key: '5-1',
      label: '安全日志',
      icon: <ExceptionOutlined />,
    }, {
      type: 'log',
      key: '5-2',
      label: '请求日志',
      icon: <ContainerOutlined />,
    }],

  }];

  const onSelected: MenuProps['onSelect'] = (e) => {
    setSelectedKeys(e.selectedKeys);
    const key = e.key;
    // 获取type
    let type = items.find(item => item.key === key)?.type;
    if (!type) {
      // 遍历所有子项
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.key === key) {
              type = child.type;
              break;
            }
          }
        }
      }
    }
    // 修改路由，但不刷新页面，为/user/settings/type
    window.history.pushState({}, '', '/admin/' + type);
  };

  useEffect(() => {
    let type = params.type;
    const type2 = params.type2;
    if (type === 'overview') {
      setSelectedKeys(['1']);
    } else if (type === 'user') {
      setSelectedKeys(['2']);
    } else if (type === 'permission') {
      if (type2 === 'overview') {
        setSelectedKeys(['3-1']);
      } else if (type2 === 'add') {
        setSelectedKeys(['3-2']);
      } else {
        setSelectedKeys(['3-1']);
      }
    } else if (type === 'agreement') {
      setSelectedKeys(['4-1']);
    } else if (type === 'security-log') {
      setSelectedKeys(['5-1']);
    } else if (type === 'log') {
      setSelectedKeys(['5-2']);
    } else {
      setSelectedKeys(['1']);
      // 修改为默认路由
      window.history.pushState({}, '', '/admin/overview');
    }
  }, []);

  return (
    <div style={{ backgroundSize: '100% 100%' }}>
      <ProCard boxShadow>
        <Layout>
          <Sider
            breakpoint="md"
            style={{ background: '#fff' }}>
            <Menu mode="inline"
                  defaultSelectedKeys={['1']}
                  selectedKeys={selectedKeys}
                  onSelect={onSelected}
                  items={items} />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content style={{ margin: '24px 16px 0' }}>
              {selectedKeys[0] === '1' ? (<OverViewComponent />) :
                selectedKeys[0] === '2' ? (<UserComponent />) :
                  selectedKeys[0] === '3-1' ? (<PermissionComponent />) :
                    selectedKeys[0] === '3-2' ? (<PermissionAddComponent />) :
                      selectedKeys[0] === '4-1' ? (<AgreementComponent />) :
                        selectedKeys[0] === '5-1' ? (<SecurityLogComponent />) :
                          selectedKeys[0] === '5-2' ? (<LogComponent />) :
                            <Result status="404" title="404" subTitle="抱歉，您访问的页面不存在。" />}
            </Content>
          </Layout>
        </Layout>
      </ProCard>
    </div>
  );
};