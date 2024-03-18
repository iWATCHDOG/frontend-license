// noinspection JSIgnoredPromiseFromCall

import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import './index.less';
import { DEFAULT_NAME } from '@/constants';

/**
 * 全局 Footer
 */
const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
          }/*, {
            key: getPingNumber() === -1 ? 'Time out' : formatPing(getPingNumber()),
            title: (
              <>
                <WifiOutlined style={getWifiStyle(getPingNumber())} />
                <span style={getWifiStyle(getPingNumber())}>{formatPing(getPingNumber())}</span>
              </>
            ),
            href: '',
          }*/]}
      />
    </>
  );
};

export default GlobalFooter;
