import React, { useEffect, useState } from 'react';
import { Helmet, useModel } from '@@/exports';
import Title from 'antd/es/typography/Title';
import CountUp from 'react-countup';
import { Button, Card, Col, Divider, message, Row, Select, Space, Statistic } from 'antd';
import { countBlacklist, countLog, countSecurityLog, countUser, getChartData } from '@/services/adminService';
import {
  getBlacklistCount,
  getLogCount,
  getSecurityCount,
  getUserCount,
  setBlacklistCount,
  setLogCount,
  setSecurityCount,
  setUserCount,
} from '@/utils/globalUtils';
import { Line } from '@ant-design/charts';

const OverViewComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [refreshingCount, setRefreshingCount] = useState<boolean>(false);
  const [data, setData] = useState([
    {},
  ]);
  const [chartType, setChartType] = useState<string>('USER_CREATE');
  const [days, setDays] = useState<number>(7);
  const ref = React.useRef();
  const config = {
    padding: 'auto',
    forceFit: true,
    data,
    xField: 'data',
    yField: 'count',
    label: {
      visible: true,
      type: 'point',
    },
  };
  const formatter = (value: any) => {
    let start = 0;
    if (value > 1000) {
      start = value - 500;
    }
    return <CountUp start={start} end={value} separator="," />;
  };

  const init = async () => {
    if (!refreshingCount) {
      try {
        setRefreshingCount(true);

        // 构造图表请求参数
        const cr = {
          type: chartType,
          days: days,
        } as AdminType.ChartRequest;

        // 并行发出计数请求
        const [uc, sc, bc, rc, cd] = await Promise.all([
          countUser(),
          countSecurityLog(),
          countBlacklist(),
          countLog(),
          getChartData(cr),
        ]);

        // 设置获取到的计数
        setUserCount(uc.data);
        setSecurityCount(sc.data);
        setBlacklistCount(bc.data);
        setLogCount(rc.data);
        setData(cd.data);
      } catch (ignore) {
        // 在发生错误时设置默认的错误值
        setUserCount(-9999);
        setLogCount(-9999);
        setSecurityCount(-9999);
        setBlacklistCount(-9999);
      } finally {
        // 无论请求成功还是失败，最后都会将 refreshingCount 设置为 false
        setRefreshingCount(false);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (<>
    <Helmet>
      <title>概览 - 管理后台</title>
    </Helmet>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ textAlign: 'left' }}>
        <Title level={3}>API统计</Title>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
          key="3"
          type="primary"
          loading={refreshingCount}
          onClick={async () => {
            setRefreshingCount(true);
            await init();
            setRefreshingCount(false);
          }}
        >
          刷新
        </Button>
      </div>
    </div>
    <Divider />
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="活跃用户数" value={getUserCount()} formatter={formatter} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="请求数" value={getLogCount()} formatter={formatter} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="安全日志数" value={getSecurityCount()} formatter={formatter} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="黑名单数" value={getBlacklistCount()} formatter={formatter} />
        </Card>
      </Col>
    </Row>
    <Divider />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ textAlign: 'left' }}>
        <Select
          defaultValue={'USER_CREATE'}
          onChange={async (value) => {
            const hide = message.loading('更新数据中');
            setChartType(value);
            const cr = {
              type: value,
              days: days,
            } as AdminType.ChartRequest;
            const cd = await getChartData(cr);
            setData(cd.data);
            hide();
            message.success('数据更新成功');
          }}
          options={[
            { value: 'USER_CREATE', label: '用户创建统计' },
            { value: 'SECURITY_LOG', label: '安全日志统计' },
            { value: 'LOG', label: '请求日志统计' },
          ]}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Select
            defaultValue={7}
            style={{ width: 80 }}
            onChange={async (value) => {
              const hide = message.loading('更新数据中');
              setDays(value);
              const cr = {
                type: chartType,
                days: value,
              } as AdminType.ChartRequest;
              const cd = await getChartData(cr);
              setData(cd.data);
              hide();
              message.success('数据更新成功');
            }}
            size={'small'}
            options={[
              { value: 7, label: '7天' },
              { value: 30, label: '30天' },
              { value: 90, label: '90天' },
              { value: 120, label: '120天' },
              { value: 180, label: '180天' },
              { value: 360, label: '360天' },
            ]}
          />
        </Space>
      </div>
    </div>
    <Divider />
    <Card bordered={false}>
      <Line {...config} chartRef={ref} onlyChangeData={true} />
    </Card>
  </>);
};
export default OverViewComponent;