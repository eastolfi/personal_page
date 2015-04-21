angular.module('mean.system').controller('FileUploadController',
    ['$scope', '$http', '$filter', '$window', 'Global', '$translate',
    function ($scope, $http, $filter, $window, Global, $translate) {
        
        var url = 'server/php/';
        $scope.options = {
            url: url
        };
        $scope.loadingFiles = true;
        $http.get(url).then(
            function (response) {
                $scope.loadingFiles = false;
                $scope.queue = response.data.files || [];
            },
            function () {
                $scope.loadingFiles = false;
            }
        );
        
        
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function () {
                return state;
            };
            file.$destroy = function () {
                state = 'pending';
                return $http({
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function () {
                        state = 'resolved';
                        $scope.clear(file);
                    },
                    function () {
                        state = 'rejected';
                    }
                );
            };
        } else if (!file.$cancel && !file._index) {
            file.$cancel = function () {
                $scope.clear(file);
            };
        }
}]);