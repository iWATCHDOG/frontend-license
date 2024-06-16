import React from 'react';
import { Helmet, useModel } from '@@/exports';
import { Button, Form, InputNumber, Select, Typography } from 'antd';

const { Text, Link } = Typography;

const AgreementComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;

  return (<>
    <Helmet>
      <title>用户协议 - 设置</title>
    </Helmet>
    <Form>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ width: '15%' }}>
          <Form.Item name="actdo">
            <Select defaultValue="0" options={[{
              label: '充值',
              value: '0',
            }, {
              label: '扣除',
              value: '1',
            }]} />
          </Form.Item>
        </div>
        <div style={{ width: 'calc(75%)', marginRight: '10px' }}>
          <Form.Item name="rmb">
            <InputNumber<number>
              placeholder="请输入金额"
              prefix="￥"
              style={{ width: '100%' }}
              min={0}
              max={1000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number} />
          </Form.Item>
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </div>
    </Form>


  </>);
};
export default AgreementComponent;