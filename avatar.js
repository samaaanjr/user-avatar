
(function () {
    "use strict";
    var app = angular.module('BlakWealth');

    app.component("userAvatar", {
        templateUrl: 'user-avatar/avatar.html',
        controller: avatarController,
        bindings: {
            userId: '<',
            includeFollowButton: '<',
            showOnlineStatus: '<',
            showName: '<',
            showUserName: '<',
            imgSize: '<'
        }
    });

    app.service('avatarService', avatarService);
    avatarService.$inject = ['$http', '$q', '$timeout'];
    function avatarService($http, $q, $timeout) {

        var pendingIds = [];
        var deferred = null;

        this.GetUserInfo = function (id) {
            pendingIds.push(id);
            if (!deferred) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(
                        $http({
                            url: '/api/users/useravatar/multiplexing',
                            data: { ids: pendingIds },
                            method: 'POST',
                        })
                    );

                    deferred = null;
                    pendingIds = [];
                });
            }

            return deferred.promise.then(response => response.data[id]);
        }

        this.followUser = function (userId) {
            var data = {
                TargetId: userId,
                Private: true
            };
            var settings = {
                url: '/api/Users1/follow',
                method: 'POST',
                cache: false,
                data: data,
                responseType: 'json',
            };

            return $http(settings);
        }
    }

    app.controller('avatarController', avatarController);
    avatarController.$inject = ['avatarService'];
    function avatarController(avatarService) {

        var vm = this;
        vm.avatarService = avatarService;
        vm.followTheUser = _followTheUser;
        
        this.$onChanges = function () {
            if (vm.userId) {
                vm.Id = vm.userId;
                vm.show = true;
                if (vm.showName === undefined) {
                    vm.showName = true;
                }
                if (vm.showUserName === undefined) {
                    vm.showUserName = true;
                }
                if (vm.imgSize === undefined) {
                    vm.imgSize = 85;
                }
                vm.avatarService.GetUserInfo(vm.Id).then(getSuccess, getError);
            } else {
                vm.show = false;
            }            
        };

        function getSuccess(response) {
            if (!response) {
                vm.show = false;
            } else {
                vm.src = response.userProfilePicture;
                vm.name = response.name;
                vm.userName = response.userName;
                vm.onlineStatus = response.onlineStatus;
            }
        }

        function getError(jqxhr) {
            console.log("error!");
        }

        function followTheUserSuccess(response) {
            console.log('You successfully follow the user');
        }

        function followTheUserError(jqxhr) {
            console.log("Sorry a problem occurred");
        }


        function _followTheUser() {

            vm.avatarService.followUser(vm.Id).then(followTheUserSuccess, followTheUserError);
        }
    }
})();