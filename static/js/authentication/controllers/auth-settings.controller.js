/**
 * AuthSettingsController
 * @namespace crowdsource.authentication.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdsource.authentication.controllers')
        .controller('AuthSettingsController', AuthSettingsController);

    AuthSettingsController.$inject = ['$window', '$location', '$scope', 'Authentication', '$mdToast', '$routeParams'];

    /**
     * @namespace AuthSettingsController
     */
    function AuthSettingsController($window, $location, $scope, Authentication, $mdToast, $routeParams) {
        var self = this;

        self.changePassword = changePassword;

        activate();
        function activate() {
            if (!Authentication.isAuthenticated() && $location.path().match(/change-password/gi)) {
                $location.url('/');
            }
            if ($routeParams.activation_key) {
                Authentication.activate_account($routeParams.activation_key).then(function success(data, status) {
                    $location.url('/login');
                }, function error(data) {
                    $mdToast.showSimple(data.data.message);
                }).finally(function () {
                });
            }
        }

        /**
         * @name changePassword
         * @desc Change password of the user
         * @memberOf crowdsource.authentication.controllers.AuthSettingsController
         */
        function changePassword() {
            if (self.password1 !== self.password2) {
                self.error = 'Passwords do not match';
                $scope.form.$setPristine();
                return;
            }
            Authentication.changePassword(self.password, self.password1, self.password2).then(function success(data, status) {
                $location.url('/profile');

            }, function error(data) {
                if (data.data.hasOwnProperty('non_field_errors')) {
                    self.error = 'Password must be at least 8 characters long.';
                }
                else {
                    self.error = data.data[0];
                }
                $scope.form.$setPristine();

            }).finally(function () {
            });
        }
    }
})();