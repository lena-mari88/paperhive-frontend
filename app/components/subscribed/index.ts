'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('subscribed', {template});
};
