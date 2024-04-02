import React, { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import { Helmet, history } from '@@/exports';
import Title from 'antd/es/typography/Title';
import { Button, Divider, message, Modal, Space } from 'antd';
import { deleteUser, getOAuthInfo, unBindOAuth } from '@/services/userService';
import { stringify } from 'querystring';
import { BilibiliOutlined, createFromIconfontCN, GithubOutlined, QqOutlined, WechatOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { BASE_URL } from '@/constants';

const AccountComponent: React.FC = () => {
  type OAuthDataItem = (typeof defaultOAuthData)[number];
  const [wechatInfo, setWechatInfo] = useState<string | undefined>(undefined);
  const [qqInfo, setQqInfo] = useState<string | undefined>(undefined);
  const [githubInfo, setGithubInfo] = useState<string | undefined>(undefined);
  const [giteeInfo, setGiteeInfo] = useState<string | undefined>(undefined);
  const [microsoftInfo, setMicrosoftInfo] = useState<string | undefined>(undefined);
  const [bilibiliInfo, setBilibiliInfo] = useState<string | undefined>(undefined);
  const { initialState, setInitialState } = useModel('@@initialState');

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4443134_jcggo4h6b6r.js',
  });
  const defaultOAuthData = [
    {
      id: 1,
      name: '微信',
      image: <WechatOutlined />,
      desc: wechatInfo ?? 'Loading...',
    },
    {
      id: 2,
      name: 'QQ',
      image: <QqOutlined />,
      desc: qqInfo ?? 'Loading...',
    },
    {
      id: 3,
      name: 'GitHub',
      image: <GithubOutlined />,
      desc: githubInfo ?? 'Loading...',
    }, {
      id: 5,
      name: 'Gitee',
      image: <IconFont type={'icon-gitee'} />,
      desc: giteeInfo ?? 'Loading...',
    }, {
      id: 6,
      name: 'Microsoft',
      image: <IconFont type={'icon-microsoft1'} />,
      desc: microsoftInfo ?? 'Loading...',
    }, {
      id: 7,
      name: '哔哩哔哩',
      image: <BilibiliOutlined />,
      desc: bilibiliInfo ?? 'Loading...',
    },
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [oAuthDataSource, setOAuthDataSource] = useState<OAuthDataItem[]>(defaultOAuthData);

  const isBind = (item: OAuthDataItem) => {
    // desc 为 undefined 或 Loading... 或 未绑定 为未绑定
    return item.desc !== undefined && item.desc !== 'Loading...' && item.desc !== '未绑定';
  };
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
          localStorage.setItem('refreshing', 'refreshing');
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
              localStorage.removeItem('refreshing');
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
        if (ret.code === 1) {
          if (ret.data) {
            item.desc = ret.data;
            setWechatInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setWechatInfo('未绑定');
          }
        } else if (item.id === 2) {
          if (ret.data) {
            item.desc = ret.data;
            setQqInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setQqInfo('未绑定');
          }
        } else if (item.id === 3) {
          if (ret.data) {
            item.desc = ret.data;
            setGithubInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setGithubInfo('未绑定');
          }
        } else if (item.id === 5) {
          if (ret.data) {
            item.desc = ret.data;
            setGiteeInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setGiteeInfo('未绑定');
          }
        } else if (item.id === 6) {
          if (ret.data) {
            item.desc = ret.data;
            setMicrosoftInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setMicrosoftInfo('未绑定');
          }
        } else if (item.id === 7) {
          if (ret.data) {
            item.desc = ret.data;
            setBilibiliInfo(ret.data);
          } else {
            item.desc = '未绑定';
            setBilibiliInfo('未绑定');
          }
        }
      } catch (e: any) {
        item.desc = '未绑定';
        if (item.id === 1) {
          setWechatInfo('未绑定');
        } else if (item.id === 2) {
          setQqInfo('未绑定');
        } else if (item.id === 3) {
          setGithubInfo('未绑定');
        } else if (item.id === 5) {
          setGiteeInfo('未绑定');
        } else if (item.id === 6) {
          setMicrosoftInfo('未绑定');
        } else if (item.id === 7) {
          setBilibiliInfo('未绑定');
        }
      }
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    initOAuth();
  }, []);

  return (<>
    <Helmet>
      <title>账户 - 设置</title>
    </Helmet>
    <Title level={3}>第三方账号登录管理</Title>
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
                          localStorage.setItem('refreshing', 'refreshing');
                          setTimeout(() => {
                            window.location.reload();
                            localStorage.removeItem('refreshing');
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
                  localStorage.setItem('refreshing', 'refreshing');
                  localStorage.setItem('redirect', window.location.href);
                  if (row.id === 1) {
                    // WeChat
                    window.location.href = BASE_URL + '/oauth/wechat';
                  } else if (row.id === 2) {
                    // QQ
                    window.location.href = BASE_URL + '/oauth/qq';
                  } else if (row.id === 3) {
                    // GitHub
                    window.location.href = BASE_URL + '/oauth/github';
                  } else if (row.id === 5) {
                    // Gitee
                    window.location.href = BASE_URL + '/oauth/gitee';
                  } else if (row.id === 6) {
                    // Microsoft
                    window.location.href = BASE_URL + '/oauth/microsoft';
                  } else if (row.id === 7) {
                    // Bilibili
                    window.location.href = BASE_URL + '/oauth/bilibili';
                  }
                  setTimeout(() => {
                    localStorage.removeItem('refreshing');
                  }, 300);
                  hide();
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
export default AccountComponent;