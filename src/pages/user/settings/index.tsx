import React, { useEffect, useState } from 'react';
import {
  ContainerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Layout, Menu, MenuProps, message, Row, Typography, Upload, UploadProps } from 'antd';
import { BASE_URL } from '@/constants';
import { useModel, useParams } from '@@/exports';
import Title from 'antd/es/typography/Title';
import Sider from 'antd/es/layout/Sider';
import { ProCard } from '@ant-design/pro-components';
import { Content } from 'antd/es/layout/layout';
import ProfileComponent from '@/pages/user/settings/components/ProfileComponent';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { updateUserAvatar } from '@/services/userService';
import AccountComponent from '@/pages/user/settings/components/AccountComponent';
import SecurityComponent from '@/pages/user/settings/components/access/SecurityComponent';
import SecurityLogComponent from '@/pages/user/settings/components/archives/SecurityLogComponent';

const { Text } = Typography;

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  // 获取路由传参
  const params = useParams();
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [uploading, setUploading] = useState(false);
  const items = [{
    type: 'profile',
    key: '1',
    label: '公开资料',
    icon: <UserOutlined />,
  }, {
    type: 'account',
    key: '2',
    label: '账户',
    icon: <SettingOutlined />,
  }, {
    type: 'group',
    key: '3',
    label: '访问',
    children: [{
      type: 'security',
      key: '3-1',
      label: '密码与认证',
      icon: <SafetyCertificateOutlined />,
    }],
  }, {
    type: 'group',
    key: '4',
    label: '档案',
    children: [{
      type: 'security-log',
      key: '4-1',
      label: '安全日志',
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
              // 修改路由，但不刷新页面，为/user/settings/type
              type = child.type;
            }
          }
        }
      }
    }
    // 修改路由，但不刷新页面，为/user/settings/type
    window.history.pushState({}, '', '/user/settings/' + type);
  };

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      const hide = message.loading('更新中');
      setUploading(true);
      try {
        setInitialState({
          ...initialState,
          refreshing: true,
        } as InitialState);
        const avatar = info.file.originFileObj as RcFile;
        const { data } = await updateUserAvatar(avatar);
        message.success('更新成功');
      } catch (e: any) {
        message.error(e.message);
      } finally {
        hide();
        setTimeout(() => {
          window.location.reload();
          setUploading(false);
        }, 300);
      }
    }
  };

  useEffect(() => {
    const type = params.type;
    if (type === 'profile') {
      setSelectedKeys(['1']);
    } else if (type === 'account') {
      setSelectedKeys(['2']);
    } else if (type === 'security') {
      setSelectedKeys(['3-1']);
    } else if (type === 'security-log') {
      setSelectedKeys(['4-1']);
    }
  }, []);
  return (
    <div style={{ backgroundSize: '100% 100%' }}>
      <Row>
        <Col style={{ marginRight: '16px' }}>
          <Avatar
            size={70}
            src={BASE_URL + '/user/get/avatar/' + loginUser?.uid}
          />
        </Col>
        <Col>
          <Title level={4}>{loginUser?.username}</Title>
          <Text type={'secondary'}>您的个人账户</Text>
        </Col>
      </Row>
      <br />
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
              <div style={{ minHeight: 360 }}>
                {selectedKeys[0] === '1' && (<ProfileComponent />)}
                {selectedKeys[0] === '2' && (<AccountComponent />)}
                {selectedKeys[0] === '3-1' && (<SecurityComponent />)}
                {selectedKeys[0] === '4-1' && (<SecurityLogComponent />)}
              </div>
            </Content>
            {selectedKeys[0] === '1' && (
              <Sider width={200} style={{ background: '#fff' }}>
                <Title level={5} style={{ textAlign: 'center' }}>个人头像</Title>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Avatar
                    size={164}
                    src={BASE_URL + '/user/get/avatar/' + loginUser?.uid}
                    icon={<UserOutlined />}
                  />
                  {uploading ?
                    <Button
                      style={{
                        position: 'absolute',
                        left: '50%', // 初始位置在容器宽度的一半
                        bottom: '-40px', // 根据您的设计调整，负值意味着向下移动按钮
                        transform: 'translateX(-50%)', // 向左移动按钮宽度的一半来居中
                        zIndex: 1, // 确保按钮在最上层
                      }}
                      icon={<UploadOutlined />}
                      loading={uploading}
                    >
                      上传
                    </Button> :
                    <Upload onChange={handleChange}>
                      <Button
                        style={{
                          position: 'absolute',
                          left: '50%', // 初始位置在容器宽度的一半
                          bottom: '-40px', // 根据您的设计调整，负值意味着向下移动按钮
                          transform: 'translateX(-50%)', // 向左移动按钮宽度的一半来居中
                          zIndex: 1, // 确保按钮在最上层
                        }}
                        icon={<UploadOutlined />}
                      >
                        上传
                      </Button>
                    </Upload>}
                </div>
              </Sider>
            )}
          </Layout>
        </Layout>
      </ProCard>
    </div>
  );
};