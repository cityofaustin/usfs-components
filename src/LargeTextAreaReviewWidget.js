import React from 'react';

import './LargeTextAreaReviewWidget.css';

export default function LargeTextAreaReviewWidget(props) {
  return (
    <div className="large-text-area-review-widget">
      {props.value}
    </div>
  )
}
