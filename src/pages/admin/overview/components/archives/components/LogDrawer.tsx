import React, { PropsWithChildren } from 'react';
import { Drawer, Skeleton } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
// @ts-ignore
import humanizeDuration from 'humanize-duration';

interface Props {
  log?: AdminType.Log;
  drawerVisible: boolean;
  onCancel: () => void;
  loading?: boolean;
}

const LogDrawer: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    log,
    drawerVisible,
    onCancel,
    loading,
  } = props;
  const humanizer = humanizeDuration.humanizer({
    language: 'zh_CN',
    maxDecimalPoints: 0,
    delimiter: ' ',
    largest: 1,
  });

  const fillZero2 = (s: number) => {
    if (s < 10) {
      return `0${s}`;
    }
    return s;
  };

  const translateTimeCreated = (d: Date | undefined) => {
    if (!d) {
      return '';
    }
    const t = d.getTime();
    const offset = Date.now() - t;
    if (offset < 5 * 60 * 1000) {
      return '刚刚';
    }
    if (offset > 7 * 24 * 60 * 60 * 1000) {
      return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
    }
    return humanizer(offset) + '前';
  };

  return (
    <Drawer
      destroyOnClose
      closable={false}
      onClose={() => {
        onCancel();
      }}
      open={drawerVisible}
      width={'40%'}
    >
      <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
        <ProDescriptions
          column={2}
          title="日志详情"
        >
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="请求ID">
            {log?.requestId}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="IP">
            {log?.ip}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="UserAgent">
            {log?.userAgent}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={1}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            label="请求地址">
            {log?.url}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={1}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="请求方法">
            {log?.method}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="Cookies">
            {log?.cookies}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            label="参数">
            {log?.params}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="jsonCode"
            contentStyle={{
              maxWidth: '80%',
            }}
            label="结果">
            {log?.result}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={1}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="状态码">
            {log?.httpCode}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={1}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="花费时间">
            {log?.cost}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={2}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label="时间">
            {translateTimeCreated(new Date(log?.updateTime as any as number))}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Skeleton>
    </Drawer>);
};

export default LogDrawer;
