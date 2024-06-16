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
    // 映射表，将 id 和对应的状态更新函数关联起来
    const infoSetters: { [key: number]: (desc: string) => void } = {
      1: setWechatInfo,
      2: setQqInfo,
      3: setGithubInfo,
      5: setGiteeInfo,
      6: setMicrosoftInfo,
      7: setBilibiliInfo,
    };

    // 并行发出所有的 OAuth 信息请求
    const promises = defaultOAuthData.map(item => getOAuthInfo(item.id));
    const results = await Promise.all(promises);

    // 处理每个请求的结果
    results.forEach((ret, index) => {
      const item = defaultOAuthData[index];
      const id = item.id;
      const data = ret?.data?.openId;

      // 检查映射表中是否有对应的 setter 函数
      if (infoSetters[id]) {
        if (data) {
          item.desc = data;
          infoSetters[id](data);
        } else {
          item.desc = '未绑定';
          infoSetters[id]('未绑定');
        }
      } else {
        console.error(`Unknown id: ${id}`);
      }
    });
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