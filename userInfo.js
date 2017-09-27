(function () {

    var app = angular.module('BlakWealth');

    app.component("userInfo", {
        templateUrl: 'user-avatar/userInfo.html',
        controller: 'userInfoController as vm',
        bindings: {
            userId: '<'
        }
    })
})();


(function () {

    "use strict";

    var app = angular.module('BlakWealth');

    app.controller('userInfoController', userInfoController);

    userInfoController.$inject = ['userAvatarInfoService'];

    function userInfoController(userAvatarInfoService) {

        var vm = this;
        vm.$onChanges = _init;

        function _init() {
            vm.Id = vm.userId;
            userAvatarInfoService.getUserInfo(vm.Id).then(_getByIdSuccess, _getByIdError);
        };

        function _getByIdSuccess(response) {
            vm.src = response.data.imgUrl;
            vm.name = response.data.userName;
        }

        function _getByIdError() {
            console.log('error on getting user avatar and user name');
        }

    }
})();

(function () {

    var app = angular.module("BlakWealth");

    app.service('userAvatarInfoService', userAvatarInfoService);

    userAvatarInfoService.$inject = ['$http'];

    function userAvatarInfoService($http) {

        function _getUserInfo(id) {
            var settings = {
                url: "/api/users/useravatar/" + id,
                method: 'GET',
                cache: false,
                responseType: 'json',
            };
            return $http(settings);

        }

        return {
            getUserInfo: _getUserInfo
        }
    }
})();