import React, { useEffect, useState } from 'react';
import { Helmet, useModel } from '@@/exports';
import Title from 'antd/es/typography/Title';
import CountUp from 'react-countup';
import { Button, Card, Col, Divider, Row, Statistic } from 'antd';
import { countBlacklist, countLog, countSecurityLog, countUser } from '@/services/adminService';
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

const OverViewComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [refreshingCount, setRefreshingCount] = useState<boolean>(false);

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
        const uc = await countUser();
        const sc = await countSecurityLog();
        const bc = await countBlacklist();
        setUserCount(uc.data);
        setSecurityCount(sc.data);
        setBlacklistCount(bc.data);
        const rc = await countLog();
        setLogCount(rc.data);
      } catch (ignore) {
        setUserCount(-9999);
        setLogCount(-9999);
        setSecurityCount(-9999);
        setBlacklistCount(-9999);
      } finally {
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
  </>);
};
export default OverViewComponent;