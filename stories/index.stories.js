import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withState } from '@dump247/storybook-state';

import DateWidget from '../src/DateWidget';
import DateReviewWidget from '../src/DateReviewWidget';
import TimeWidget from '../src/TimeWidget';
import TimeReviewWidget from '../src/TimeReviewWidget';
import LocationPickerWidget from '../src/LocationPickerWidget';
import LocationReviewWidget from '../src/LocationReviewWidget';
import FileUploadWidget from '../src/FileUploadWidget';
import FileUploadReviewWidget from '../src/FileUploadReviewWidget';
import OfficerDetailsDisplayWidget from '../src/OfficerDetailsDisplayWidget';
import WitnessDetailsDisplayWidget from '../src/WitnessDetailsDisplayWidget';
import LargeTextAreaReviewWidget from '../src/LargeTextAreaReviewWidget';

import '../node_modules/uswds/dist/css/uswds.min.css';

const dateStories = storiesOf('Date', module);
dateStories.addDecorator(withKnobs);

dateStories
  .add('Edit', () => (
    <DateWidget id="root_date" value={text('Date', '2018-11-11')} />
  ))
  .add('Review', () => (
    <DateReviewWidget value={text('Date', '2018-11-11')} />
  ));

const timeStories = storiesOf('Time', module);
timeStories.addDecorator(withKnobs);

timeStories
  .add('Edit', () => (
    <TimeWidget id="root_time" value={text('Date', '9:30 pm')} />
  ))
  .add('Review', () => (
    <TimeReviewWidget value={text('Date', '9:30 pm')} />
  ));

const locationStories = storiesOf('Location', module);
locationStories.addDecorator(withKnobs);

const initialLocationJSON = JSON.stringify({
  address: '800 Guadalupe St, Austin, TX 78701',
  position: { lat: 30.271272, lng: -97.745934 },
});

locationStories
  .add(
    'Edit',
    withState({
      locationJSON: initialLocationJSON,
    })(({ store }) => (
      <LocationPickerWidget
        value={store.state.locationJSON}
        onChange={newLocationJSON =>
          store.set({ locationJSON: newLocationJSON })
        }
      />
    )),
  )
  .add(
    'Review',
    () => (
      <LocationReviewWidget value={text('Location', initialLocationJSON)} />
    ),
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

const largeTextAreaStories = storiesOf('LargeTextArea', module);
largeTextAreaStories
  .add('Review', ()=>(
    <LargeTextAreaReviewWidget value={require('./loren.js').value}/>
  ))
