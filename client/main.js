import "../imports/i18n/en.i18n.yml";

import App from "../imports/ui/app";
import { Meteor } from "meteor/meteor";
import React from "react";
import i18n from "meteor/universe:i18n";
import { render } from "react-dom";

Meteor.startup(() => {
    i18n.setLocale("en-US");
    render(<App />, document.getElementById("render-target"));
});
