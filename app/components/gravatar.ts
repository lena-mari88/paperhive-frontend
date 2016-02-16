'use strict';
export default function(app) {
    app.component('gravatar', {
      bindings: {
        user: `<`,
        size: '@',
        classes: '@',
      },
      template: '<img width={{$ctrl.size}} height={{$ctrl.size}} ng-src="https://secure.gravatar.com/avatar/{{$ctrl.user.account.avatar.value}}?s={{$ctrl.size}}&d=identicon" alt="{{$ctrl.user.displayName}} avatar" class="{{$ctrl.classes}}">',
    });
};