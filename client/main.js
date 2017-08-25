import App from "../imports/ui/app";
import { LANGUAGE } from "../imports/ui/configs";
import { Meteor } from "meteor/meteor";
import React from "react";
import i18n from "meteor/universe:i18n";
import { render } from "react-dom";

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Meteor.startup(() => {
    i18n.setLocale(LANGUAGE, { fresh: true });
    render(<App />, document.getElementById("render-target"));
});
