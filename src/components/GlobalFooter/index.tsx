// noinspection JSIgnoredPromiseFromCall

import { GithubOutlined, WifiOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React, { useEffect } from 'react';
import './index.less';
import { DEFAULT_NAME } from '@/constants';
import { getPing } from '@/services/rootService';

/**
 * 全局 Footer
 */
const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [ping, setPing] = React.useState<number>(0);

  const initPing = async () => {
    // 获取当前时间戳
    const time = new Date().getTime();
    try {
      await getPing();
      // 获取当前时间戳
      const time2 = new Date().getTime();
      setPing(time2 - time);
    } catch (e: any) {
      setPing(-1);
    }
  };

  const doPing = async () => {
    await initPing();
    // 每隔5秒ping一次
    setInterval(async () => {
      await initPing();
    }, 5000);
  };

  useEffect(() => {
    doPing();
  }, []);
  // noinspection HtmlRequiredAltAttribute
  return (
    <DefaultFooter
      className="default-footer"
      copyright={`${currentYear} ` + DEFAULT_NAME}
      links={[
        {
          key: 'xLikeWATCHDOG',
          title: (
            <>
              <GithubOutlined /> xLikeWATCHDOG
            </>
          ),
          href: 'https://github.com/xLikeWATCHDOG',
          blankTarget: true,
        }, {
          key: 'ping',
          title: (
            <>
              <WifiOutlined /> {ping === -1 ? '服务器连接失败' : `延迟${ping}ms`}
            </>
          ),
          href: '',
        }]}
    />
  );
};

export default GlobalFooter;
