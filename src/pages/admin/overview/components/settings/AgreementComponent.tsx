import React from 'react';
import { useModel } from '@@/exports';

const AgreementComponent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  return (<>
    Agreement</>);
};
export default AgreementComponent;