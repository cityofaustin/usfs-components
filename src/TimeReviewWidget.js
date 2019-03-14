import React from 'react';
import { format, parse } from 'date-fns';

export default function TimeReviewWidget(props) {
  const time = parse(props.value);

  return <span>{format(time, 'h:mm A')}</span>;
}
