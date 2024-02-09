import React, { PropsWithChildren, useState } from 'react';
import { Avatar, Button, Checkbox, DatePicker, Form, Input, message, Modal } from 'antd';
import { updatePermission } from '@/services/adminService';
import { BASE_URL } from '@/constants';

interface EditModalProps {
  permission?: Permission.PermissionVO;
  modalVisible: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

const EditModalComponent: React.FC<PropsWithChildren<EditModalProps>> = (props) => {
  const {
    permission,
    modalVisible,
    onCancel,
    onFinish,
  } = props;
  const [form] = Form.useForm();

  const [neverExpires, setNeverExpires] = useState(false);

  // 处理表单提交
  const whenFinish = async (values: any) => {
    // 这里应该是调用后端接口，传递权限和到期时间
    // 如果没有选择“永不过期”，且没有选择日期，则提示错误
    if (!neverExpires && !values.expiry && !values.permission) {
      message.error('请输入修改的部分');
      return;
    }
    const hide = message.loading('处理中');
    // 如果选择了“永不过期”，则设置expiry为0，如果不选择，则获取当前设置的时间
    const expiryTimestamp = neverExpires ? 0 : values.expiry ? values.expiry.valueOf() : permission?.expiry;
    try {
      // 构造EditPermissionRequest
      const req = {
        id: permission?.id,
        permission: values.permission,
        expiry: expiryTimestamp,
      } as AdminType.PermissionUpdateRequest;
      await updatePermission(req);
      message.success('编辑成功');
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
      src={BASE_URL + '/user/get/avatar/' + permission?.uid}
    /> {permission?.id} - 权限编辑({permission?.permission})</>}
    open={modalVisible}
    onCancel={() => {
      onCancel();
      form.resetFields();
      setNeverExpires(false);
    }}
    footer={null}
  >
    <Form form={form} layout="vertical" onFinish={whenFinish}>
      <Form.Item name="permission" label="权限">
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
export default EditModalComponent;