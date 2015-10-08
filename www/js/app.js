angular.module('inStep', ['ionic', 'inStepControllers', 'pusher-angular'])

  .config(function ($stateProvider, $urlRouterProvider) {
    window.client = new Pusher('e3d79ed69e5057530b35');
    $urlRouterProvider.otherwise('/listen');

    $stateProvider
      .state('listen', {
        url: '/listen',
        controller: 'listenCtrl',
        templateUrl: 'templates/listen.html'
      })
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
