angular.module('inStepControllers',
  ['ionic'])

  .controller('bluetoothCtrl', function ($scope, $ionicLoading) {
    var alertAll = function () {
      alert(JSON.stringify(arguments));
      $ionicLoading.hide();
    };

    document.addEventListener('deviceready', function () {
      ble.enable();
    });

    $scope.devices = [];
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
      ble.connect(device_id, alertAll, alertAll);
    }
  });
