export default function(app) {
  app.component('passwordReset', {
    controller: [
      '$location', 'authService', 'notificationService',
      function ($location, authService, notificationService) {
        const ctrl = this;

        const token = $location.search().token;
        if (!token) {
          notificationService.notifications.push({
            type: 'error',
            message: `Password reset token is missing.`,
          });
        }
        $location.search({});

        // send email/username for password reset
        ctrl.send = (password) => {
          ctrl.sending = true;
          ctrl.success = undefined;
          ctrl.error = undefined;
          authService.passwordReset(token, password)
            .then(
              data => {
                ctrl.sending = false;
                ctrl.success = data;
                $location.url(data.returnUrl);
              },
              data => {
                ctrl.sending = false;
                ctrl.error = data;
              }
            );
        };
      }
    ],
    template: `
    <div class="container ph-xl-margin-bottom">
      <h2 class="text-center">Reset your password</h2>

      <h4 class="ph-heading-light ph-md-margin-bottom text-center">
        Enter your new password.
      </h4>

      <div class="row ph-md-padding-top">
        <div class="col-md-offset-4 col-md-4">
          <form name="passwordResetForm" novalidate>
            <label for="password">New password</label>
            <input type="password" class="form-control" id="password" name="password"
              ng-model="$ctrl.password" placeholder="Enter your new password"
              ng-minlength="8"
              ng-disabled="$ctrl.sending"
              required>
            <p class="help-block">
              <span ng-if="(passwordResetForm.$submitted || passwordResetForm.password.$touched) && passwordResetForm.password.$error"
                class="text=error"
              >
                Please enter your new password with at least 8 characters.
              </span>
            </p>

            <button class="btn btn-primary btn-block ph-md-margin-top" type="submit"
              ng-click="!$ctrl.sending && !passwordResetForm.$invalid && $ctrl.send($ctrl.password)"
              ng-class="{disabled: $ctrl.sending || passwordResetForm.$invalid}"
            >
              <i ng-if="$ctrl.sending" class="fa fa-fw fa-spinner fa-spin"></i>
              <i ng-if="!$ctrl.sending" class="fa fa-fw"></i>
              Set new password
            </button>
            <p class="help-block">
              <ul class="fa-ul text-success" ng-if="$ctrl.success">
                <li><i class="fa fa-li fa-check"></i> {{$ctrl.success.message}}</li>
              </ul>
              <ul class="fa-ul text-danger" ng-if="$ctrl.error">
                <li><i class="fa fa-li fa-times"></i> {{$ctrl.error.message}}</li>
              </ul>
            </p>
          </form>
        </div>
      </div>
    </div>
    `,
  });
}
