import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import DateTimeWidget from '../src/DateTimeWidget';
import DateTimeReviewWidget from '../src/DateTimeReviewWidget';
import LocationPickerWidget from '../src/LocationPickerWidget';
import LocationReviewWidget from '../src/LocationReviewWidget';
import FileUploadWidget from '../src/FileUploadWidget';
import FileUploadReviewWidget from '../src/FileUploadReviewWidget';
import OfficerDetailsDisplayWidget from '../src/OfficerDetailsDisplayWidget';
import WitnessDetailsDisplayWidget from '../src/WitnessDetailsDisplayWidget';

import '../node_modules/uswds/dist/css/uswds.min.css';

const dateTimeStories = storiesOf('Date Time', module);
dateTimeStories.addDecorator(withKnobs);

dateTimeStories
  .add('Edit', () => (
    <DateTimeWidget value={text('Date/Time', '2011-11-11 11:11 PM')} />
  ))
  .add('Review', () => (
    <DateTimeReviewWidget value={text('Date/Time', '2011-11-11 11:11 PM')} />
  ));

const locationStories = storiesOf('Location', module);
locationStories.addDecorator(withKnobs);

const locationJSON = JSON.stringify({
  address: '800 Guadalupe St, Austin, TX 78701',
  position: { lat: 30.271272, lng: -97.745934 },
});

function onLocationChage(locaitonJSON) {
  // This is where we can handle stuff with location changing
}

locationStories
  .add(
    'Edit',
    () => (
      <LocationPickerWidget
        value={text('Location', locationJSON)}
        onChange={onLocationChage}
      />
    ),
    { knobs: { escapeHTML: false } },
  )
  .add(
    'Review',
    () => <LocationReviewWidget value={text('Location', locationJSON)} />,
    { knobs: { escapeHTML: false } },
  );

storiesOf('File Upload', module)
  .add('Edit', () => <FileUploadWidget />)
  .add('Review', () => <FileUploadReviewWidget />);

storiesOf('Officer Details', module).add('Display', () => (
  <OfficerDetailsDisplayWidget />
));

storiesOf('Witness Details', module).add('Display', () => (
  <WitnessDetailsDisplayWidget />
));
