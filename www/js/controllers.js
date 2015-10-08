angular.module('inStepControllers',
  ['ionic'])

  .controller('listenCtrl', function ($scope, $pusher) {
    $scope.pulse = 0;
    ionic.Platform.ready(function () {
      var pusher = $pusher(window.client);
      var channel = pusher.subscribe('events');
      channel.bind('event1', function (data) {
        if (!stop) {
          $scope.pulse++;
          if (window.cordova)
            navigator.notification.vibrate(data.beattLength);
        }
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
