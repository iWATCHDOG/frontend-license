import React from 'react';
import { translateTimeCreated } from '@/utils/stringUtils';

interface Props {
  date?: Date;
}

const TimeShow: React.FC<Props> = (props) => {
  const { date } = props;

  return <>
    {translateTimeCreated(date)}
  </>;
};
export default TimeShow;
