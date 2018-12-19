import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";

import DateTimeWidget from "../src/DateTimeWidget";
import DateTimeReviewWidget from "../src/DateTimeReviewWidget";
import LocationPickerWidget from "../src/LocationPickerWidget";
import LocationReviewWidget from "../src/LocationReviewWidget";
// import FileUploadWidget from "../src/FileUploadWidget";
import FileUploadReviewWidget from "../src/FileUploadReviewWidget";
import OfficerDetailsDisplayWidget from "../src/OfficerDetailsDisplayWidget";
import WitnessDetailsDisplayWidget from "../src/WitnessDetailsDisplayWidget";

const dateTimeStories = storiesOf("Date Time", module);
dateTimeStories.addDecorator(withKnobs);

dateTimeStories
  .add("Edit", () => (
    <DateTimeWidget value={text("Date/Time", "2011-11-11 11:11 PM")} />
  ))
  .add("Review", () => (
    <DateTimeReviewWidget value={text("Date/Time", "2011-11-11 11:11 PM")} />
  ));

const locationStories = storiesOf("Location", module);
locationStories.addDecorator(withKnobs);

locationStories
  .add("Edit", () => (
    <LocationPickerWidget
      address={text("Address", "800 Guadalupe St, Austin, TX 78701")}
      position={{
        lat: number("Lat", 30.271272),
        lng: number("Lng", -97.745934)
      }}
    />
  ))
  .add("Review", () => <LocationReviewWidget />);

storiesOf("File Upload", module)
  .add("Edit", () => <Welcome showApp={linkTo("Button")} />)
  .add("Review", () => <Welcome showApp={linkTo("Button")} />);

storiesOf("Officer Details", module).add("Review", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Witness Details", module).add("Review", () => (
  <Welcome showApp={linkTo("Button")} />
));
