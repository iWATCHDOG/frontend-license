import React, { useEffect, useState } from 'react';
import { Helmet, useModel } from '@@/exports';
import Title from 'antd/es/typography/Title';
import CountUp from 'react-countup';
import { Button, Card, Col, Divider, Row, Statistic } from 'antd';
import { countLog, countSecurityLog, countUser } from '@/services/adminService';

const OverViewComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [userCount, setUserCount] = useState<number>(0);
  const [logCount, setLogCount] = useState<number>(0);
  const [securityCount, setSecurityCount] = useState<number>(0);
  const [refreshingCount, setRefreshingCount] = useState<boolean>(false);
  const [first, setFirst] = useState<boolean>(true);

  const formatter = (value: any) => {
    let start = value;
    if (first) {
      start = 0;
    } else {
      // 如果小于1000，则为0
      if (start < 1000) {
        start = 0;
      } else {
        start = start - 50;
      }
    }
    return <CountUp start={start} end={value} separator="," />;
  };

  const init = async () => {
    if (!refreshingCount) {
      try {
        setRefreshingCount(true);
        const uc = await countUser();
        const sc = await countSecurityLog();
        setUserCount(uc.data);
        setSecurityCount(sc.data);
        const rc = await countLog();
        setLogCount(rc.data);
      } catch (ignore) {
        setUserCount(-9999);
        setLogCount(-9999);
        setSecurityCount(-9999);
      } finally {
        setRefreshingCount(false);
      }
    }
  };

  const doInit = async () => {
    setFirst(true);
    await init();
    setFirst(false);
    setInterval(async () => {
      await init();
    }, 10000);
  };

  useEffect(() => {
    doInit();
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
      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="活跃用户数" value={userCount} formatter={formatter} />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="请求数" value={logCount} formatter={formatter} />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="安全日志数" value={securityCount} formatter={formatter} />
        </Card>
      </Col>
    </Row>
  </>);
};
export default OverViewComponent;