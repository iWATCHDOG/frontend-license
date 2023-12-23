import React from 'react';
import { useModel } from '@@/exports';

const UserComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  return (<>
    User</>);
};
export default UserComponent;