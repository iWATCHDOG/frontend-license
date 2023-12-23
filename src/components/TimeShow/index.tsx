import React from 'react';
// @ts-ignore
import humanizeDuration from 'humanize-duration';

interface Props {
  date?: Date;
}

const humanizer = humanizeDuration.humanizer({
  language: 'zh_CN',
  maxDecimalPoints: 0,
  delimiter: ' ',
  largest: 1,
});

const fillZero2 = (s: number) => {
  if (s < 10) {
    return `0${s}`;
  }
  return s;
};

const translateTimeCreated = (d: Date | undefined) => {
  if (!d) {
    return '';
  }
  const t = d.getTime();
  const offset = Date.now() - t;
  if (offset < 5 * 60 * 1000) {
    return '刚刚';
  }
  if (offset > 7 * 24 * 60 * 60 * 1000) {
    return `${d.getFullYear()}-${fillZero2(d.getMonth() + 1)}-${fillZero2(d.getDate())} ${fillZero2(d.getHours())}:${fillZero2(d.getMinutes())}`;
  }
  return humanizer(offset) + '前';
};
const TimeShow: React.FC<Props> = (props) => {
  const { date } = props;

  return <>
    {translateTimeCreated(date)}
  </>;
};
export default TimeShow;
