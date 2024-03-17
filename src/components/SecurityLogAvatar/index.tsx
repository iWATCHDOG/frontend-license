import React from 'react';
import { Avatar } from 'antd';
import { BASE_URL } from '@/constants';

interface Props {
  row: UserType.SecurityLogVO;
}

const SecurityLogAvatar: React.FC<Props> = (props) => {
  const { row } = props;
  return <>
    {row?.avatar ?
      <Avatar.Group maxCount={4}>
        {row?.avatar.avatars?.map((item) => {
          {
            if (item.code === 1) {
              return (<Avatar
                size={40}
                src={BASE_URL + '/user/get/avatar/' + item.data}
              />);
            } else if (item.code === 2) {
              return (<Avatar
                size={40}
                src={BASE_URL + '/photo/' + item.data}
              />);
            } else {
              return (<Avatar
                size={40}
                src={(item.data as unknown as string)}
              />);
            }
          }
        })}
      </Avatar.Group> : <Avatar
        size={40}
        src={BASE_URL + '/user/get/avatar/' + row?.uid}
      />}

  </>;
};
export default SecurityLogAvatar;
