import React from 'react';
import { useModel } from '@@/exports';

const SecurityLogComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  return (<>
    SecurityLog</>);
};
export default SecurityLogComponent;