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
    setInterval(async () => {
      await initPing();
    }, 5000);
  };

  const formatPing = (ping: number) => {
    if (ping === -1) {
      return 'Time out';
    }
    // 如果ping大于1000ms，显示秒
    if (ping > 1000) {
      return `${(ping / 1000).toFixed(2)}s`;
    }
    return `${ping}ms`;
  };

  const getWifiStyle = (ping: number) => {
    if (ping === -1 || ping > 1000) {
      return { color: '#ff4d4f' };
    }
    // 如果ping大于500显示橙色
    if (ping > 500) {
      return { color: '#faad14' };
    }
    return { color: '#52c41a' };
  };

  useEffect(() => {
    doPing();
  }, []);
  // noinspection HtmlRequiredAltAttribute
  return (<>
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
            key: ping === -1 ? 'Time out' : formatPing(ping),
            title: (
              <>
                <WifiOutlined style={getWifiStyle(ping)} />
                {/*有颜色的字体*/}
                <span style={getWifiStyle(ping)}>{formatPing(ping)}</span>
              </>
            ),
            href: '',
          }]}
      />
    </>
  );
};

export default GlobalFooter;
