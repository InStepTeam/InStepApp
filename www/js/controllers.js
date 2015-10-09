angular.module('inStepControllers',
  ['ionic', 'braintree-angular'])

  .constant('API_URL', 'http://instepapp.herokuapp.com/')
  .constant('clientTokenPath', 'http://instepapp.herokuapp.com/get_token')

  .factory('serverRequest', function (API_URL, $http, $ionicLoading, $ionicPopup) {
    return function (extraUrl, success, params) {
      $http({
        url: API_URL + extraUrl,
        method: "GET",
        withCredentials: true,
        data: params || {}
      }).success(function (data) {
        $ionicLoading.hide();
        if (data.success)
          success(data);
        else {
          console.log(data);
          $ionicPopup.alert({
            title: 'Error',
            template: '<div style="text-align:center">' + data.errs + '</div>'
          });
        }
      });
    };
  })


  .controller('eventsCtrl', function ($rootScope, $scope, serverRequest, $state) {
    $rootScope.currentEvent = null;
    $scope.events = [];
    serverRequest('events', function (data) {
      $scope.events = data['events'];
    });

    $scope.openEvent = function (event) {
      $rootScope.currentEvent = event;
      $state.go('listen', {eventId: event.id})
    }
  })

  .controller('listenCtrl', function ($scope, $pusher) {
    $scope.pulse = 0;
    ionic.Platform.ready(function () {
      var pusher = $pusher(window.client);
      var channel = pusher.subscribe('events');
      channel.bind('event2', function (data) {
        console.log(data);
        if ($scope.play) {
          $scope.pulse++;
          if (window.cordova)
            navigator.notification.vibrate(data.beatLength);
        }
      });
    });
  })

  .controller('storeCtrl', function ($scope) {
    $scope.paypalOptions = {
      onPaymentMethodReceived: function(payload) {
        console.log('Yay, payload with nonce:', payload);
      }
    };
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
