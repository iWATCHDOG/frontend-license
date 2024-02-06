import React, { PropsWithChildren, useState } from 'react';
import { useModel } from '@@/exports';
import { Avatar, Button, Checkbox, DatePicker, Form, Input, message, Modal } from 'antd';
import { BASE_URL } from '@/constants';
import { addPermission } from '@/services/adminService';

interface AddModalProps {
  user?: UserType.UserVO;
  modalVisible: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

const AddModalComponent: React.FC<PropsWithChildren<AddModalProps>> = (props) => {
  const {
    user,
    modalVisible,
    onCancel,
    onFinish,
  } = props;
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [form] = Form.useForm();
  const [neverExpires, setNeverExpires] = useState(false);

  // 处理表单提交
  const whenFinish = async (values: any) => {
    // 这里应该是调用后端接口，传递权限和到期时间
    // 如果没有选择“永不过期”，且没有选择日期，则提示错误
    if (!neverExpires && !values.expiry) {
      message.error('请选择到期时间');
      return;
    }
    const hide = message.loading('处理中');
    const uid = user?.uid;
    // 如果选择了“永不过期”，则设置expiry为0
    const expiryTimestamp = neverExpires ? 0 : values.expiry.valueOf();
    console.log('Received values of form: ', {
      ...values,
      uid: uid,
      expiry: expiryTimestamp,
    });
    try {
      // 构造AddPermissionRequest
      const req = {
        uid: uid,
        permission: values.permission,
        expiry: expiryTimestamp,
      } as AdminType.PermissionAddRequest;
      await addPermission(req);
      message.success('添加成功');
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
    onFinish();
    // 清空表单
    form.resetFields();
    setNeverExpires(false);
  };

  // 处理“永不过期”复选框的变化
  const onNeverExpiresChange = (e: any) => {
    setNeverExpires(e.target.checked);
    // 如果选择了“永不过期”，清除日期选择器的值
    if (e.target.checked) {
      form.setFieldsValue({ expiry: null });
    }
  };

  return (<Modal
    destroyOnClose
    title={<><Avatar
      size={40}
      src={BASE_URL + '/user/get/avatar/' + user?.uid}
    /> {user?.username} - 权限添加</>}
    open={modalVisible}
    onCancel={() => {
      onCancel();
      form.resetFields();
      setNeverExpires(false);
    }}
    footer={null}
  >
    <Form form={form} layout="vertical" onFinish={whenFinish}>
      <Form.Item name="permission" label="权限" rules={[{ required: true, message: '请输入权限!' }]}>
        <Input placeholder="请输入权限" />
      </Form.Item>
      <Form.Item name="expiry" label="到期时间">
        <DatePicker
          disabled={neverExpires}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item>
        <Checkbox checked={neverExpires} onChange={onNeverExpiresChange}>
          永不过期
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  </Modal>);
};
export default AddModalComponent;