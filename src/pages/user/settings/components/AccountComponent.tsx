import React, { useEffect, useState } from 'react';
import { history, useModel } from '@@/exports';
import Title from 'antd/es/typography/Title';
import { Button, Divider, message, Modal, Space, Typography } from 'antd';
import { deleteUser, getOAuthInfo, unBindOAuth } from '@/services/userService';
import { stringify } from 'querystring';
import { GithubOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { BASE_URL } from '@/constants';

const { Text, Link } = Typography;

const functionComponent: React.FC = () => {
  type OAuthDataItem = (typeof defaultOAuthData)[number];
  const [githubInfo, setGithubInfo] = useState<string | undefined>(undefined);
  const {
    initialState,
    setInitialState,
  } = useModel('@@initialState');
  const defaultOAuthData = [
    {
      id: 3,
      name: 'GitHub',
      image: <GithubOutlined />,
      desc: githubInfo ?? 'Loading...',
    },
  ];
  const [oAuthDataSource, setOAuthDataSource] = useState<OAuthDataItem[]>(defaultOAuthData);

  const isBind = (item: OAuthDataItem) => {
    // desc 为 undefined 或 Loading... 或 未绑定 为未绑定
    return item.desc !== undefined && item.desc !== 'Loading...' && item.desc !== '未绑定';
  };

  const loginUser = initialState?.loginUser;
  const onDeleteClick = () => {
    Modal.confirm({
      title: '确认注销',
      content: (
        <p>该操作无法撤销,请谨慎确认！</p>
      ),
      async onOk() {
        // 删除
        const hide = message.loading('注销中');
        try {
          const { data } = await deleteUser();
          message.success('注销成功');
          await setInitialState({
            ...initialState,
            loginUser: undefined,
          });
          // 刷新页面
          if (data) {
            setTimeout(() => {
              history.replace({
                pathname: '/user/login',
                search: stringify({
                  redirect: window.location.href,
                }),
              });
            }, 300);
          }
        } catch (e: any) {
          message.error(e.message);
        } finally {
          hide();
        }
      },
    });
  };

  const initOAuth = async () => {
    for (const item of defaultOAuthData) {
      try {
        const ret = await getOAuthInfo(item.id);
        if (ret.data) {
          item.desc = ret.data;
          setGithubInfo(ret.data);
        } else {
          item.desc = '未绑定';
          setGithubInfo('未绑定');
        }
      } catch (e: any) {
        item.desc = '未绑定';
        setGithubInfo('未绑定');
      }
    }
  };

  useEffect(() => {
    initOAuth();
  }, []);

  return (<>
    <Title level={3}>第三方账号管理</Title>
    <Divider />
    <ProList<OAuthDataItem>
      rowKey="id"
      dataSource={oAuthDataSource}
      onDataSourceChange={setOAuthDataSource}
      metas={{
        title: {
          dataIndex: 'name',
        },
        avatar: {
          dataIndex: 'image',
        },
        description: {
          dataIndex: 'desc',
        },
        subTitle: {
          render: () => {
            return (
              <Space size={0}>
              </Space>
            );
          },
        },
        actions: {
          render: (text, row, index, action) => [
            <Button
              type="link"
              loading={row.desc === 'Loading...'}
              danger={isBind(row)}
              onClick={async () => {
                if (isBind(row)) {
                  Modal.confirm({
                    title: '确认解绑',
                    content: (
                      <p>该操作无法撤销,请谨慎确认！</p>
                    ),
                    async onOk() {
                      // 删除
                      const hide = message.loading('解绑中');
                      try {
                        const { data } = await unBindOAuth(row.id);
                        message.success('解绑成功');
                        // 刷新页面
                        if (data) {
                          setTimeout(() => {
                            window.location.reload();
                          }, 300);
                        }
                      } catch (e: any) {
                        message.error(e.message);
                      } finally {
                        hide();
                      }
                    },
                  });
                } else {
                  const hide = message.loading('跳转中');
                  if (row.id === 3) {
                    // GitHub
                    window.location.href = BASE_URL + '/oauth/github';
                  }
                }
              }
              }
              key="link"
            >
              {row.desc === 'Loading...' ? 'Loading...' : isBind(row) ? '解绑' : '绑定'}
            </Button>,
          ],
        },
      }}
    />
    <Title level={3} type="danger">注销账户</Title>
    <Divider />
    <Button danger onClick={onDeleteClick}>注销您的账户</Button>
  </>);
};
export default functionComponent;