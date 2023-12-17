// noinspection JSIgnoredPromiseFromCall

import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React, { useEffect } from 'react';
import './index.less';
import { DEFAULT_NAME } from '@/constants';

/**
 * 全局 Footer
 */
const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
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
        },
      ]}
    />
  );
};

export default GlobalFooter;
