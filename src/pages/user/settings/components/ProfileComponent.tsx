import Title from 'antd/es/typography/Title';
import { Button, Divider, message } from 'antd';
import { ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useModel } from '@umijs/max';
import { updateUserProfile } from '@/services/userService';
import { Helmet } from '@@/exports';

const ProfileComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const formRef = useRef<ProFormInstance>();

  const doUpdate = async () => {
    const hide = message.loading('更新中');
    try {
      const username = formRef.current?.getFieldValue('username');
      // 判断username是否符合规则
      if (username && !/^[a-zA-Z0-9_-]{1,16}$/.test(username)) {
        message.error('用户名必须是1-16位字母、数字、下划线、减号组成');
      } else {
        const gender = formRef.current?.getFieldValue('gender');
        // 构造UserType.UpdateUserProfileRequest
        const params: UserType.UpdateUserProfileRequest = {
          username: username,
          gender: gender,
        };
        const { data } = await updateUserProfile(params);
        message.success('更新成功');
        // 刷新页面
        if (data) {
          localStorage.setItem('refreshing', 'refreshing');
          setTimeout(() => {
            window.location.reload();
            localStorage.removeItem('refreshing');
          }, 300);
        }
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      hide();
    }
  };

  return (<>
    <Helmet>
      <title>公开资料 - 设置</title>
    </Helmet>
    <Title level={3}>公开资料</Title>
    <Divider />
    <ProForm<UserType.UpdateUserProfileRequest>
      formRef={formRef}
      submitter={{
        render: () => {
          return [
            <Button type="primary" htmlType="button" onClick={doUpdate} key="update">
              更新资料
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        name="username"
        width="xl"
        label="用户名"
        fieldProps={{
          defaultValue: loginUser?.username,
        }}
        rules={[{
          pattern: /^[a-zA-Z0-9_-]{1,16}$/,
          message: '用户名必须是1-16位字母、数字、下划线、减号组成',
        }]}
      />
      <ProFormSelect
        name="gender"
        width="xl"
        label="性别"
        request={async () => [
          {
            value: 1,
            label: '男',
          },
          {
            value: 2,
            label: '女',
          },
          {
            value: 3,
            label: '保密',
          },
        ]}
        initialValue={loginUser?.gender}
      />
    </ProForm>
  </>);
};
export default ProfileComponent;