var alertAll = function () {
  alert(JSON.stringify(arguments));
  $ionicLoading.hide();
};
angular.module('inStepControllers',
  ['ionic'])

  .controller('bluetoothCtrl', function ($scope, $rootScope, $state, $ionicLoading) {
    $rootScope.bluetoothDevice = {id: 123};
    $scope.devices = [];

    //document.addEventListener('deviceready', function () {
    //  ble.enable();
    //});

    $scope.getDevices = function () {
      $ionicLoading.show({
        template: 'Searching...'
      });

      ble.startScan([], function (device) {
        if (device.name != 'estimote') {
          $ionicLoading.hide();
          $scope.devices.push(device);
        }
      }, alertAll);

      setTimeout(ble.stopScan, 20000,
        function () {
          deferred.resolve();
        },
        function () {
          console.log("stopScan failed");
          deferred.reject("Error stopping scan");
        }
      );
    };

    $scope.connectDevice = function (device_id) {
      ble.connect(device_id, function (device) {
        $rootScope.bluetoothDevice = device;
        $state.go('listen');
      }, alertAll);
    };

    $state.go('listen'); // TODO remove
  })

  .controller('listenCtrl', function ($scope, $pusher) {
    $scope.pulse = 0;
    ionic.Platform.ready(function () {
      var pusher = $pusher(window.client);
      var channel = pusher.subscribe('test_channel');
      channel.bind('my_event', function (data) {
        $scope.pulse++;
        if (window.cordova)
          navigator.notification.vibrate(data.bitLength);
      });
    });
  })

  .directive('ngPulser', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.$watch('pulse', function () {
          element.addClass('pulser');
          window.setTimeout(function () {
            element.removeClass('pulser');
          }, 1000)
        })
      }
    }
  });
