window.global = {

    GCM_SENDER_ID: '191345131982',
    GCM_SERVER_KEY: 'AIzaSyCY7GAaBLef5s8b2VeaVUWhazpiTbHM0QU',
    GCM_TOKEN: ''

}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngSplashScreen',
  'controllers',
  'ngWizard',
  'ngLeftMenu',
  'ngParallax',
  'ngListView',
  'ionic.native'
])

.run(function ($ionicPlatform, $cordovaLocalNotifications, $ionicPopup) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);

            document.addEventListener('deviceready', function () {

                var push = PushNotification.init({
                    android: {
                        senderID: window.global.GCM_SENDER_ID
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                });

                push.on('registration', function (x) {

                    // this is gcm id that we need to persist on cloud
                    window.global.GCM_TOKEN = x.registrationId;

                });

                push.on('notification', function (data) {

                    $cordovaLocalNotifications.schedule({
                        text: data.message,
                        led: 'FF0000'
                    });

                });

                push.on('error', function (e) {
                    console.log(err);
                });

                cordova.plugins.backgroundMode.setDefaults({
                    title: 'TicketAlert',
                    text: 'App is running in background'
                 //   title: '...',
                    //text: '...',
                    //ticker: '...'
                })

                // Enable background mode
                cordova.plugins.backgroundMode.enable();


                // Exclude the app from the recent task list works on Android 5.0+.
                cordova.plugins.backgroundMode.excludeFromTaskList();

                // Called when background mode has been activated
                cordova.plugins.backgroundMode.onactivate = function () {
                    setTimeout(function () {
                        // Modify the currently displayed notification
                        cordova.plugins.backgroundMode.configure({
                            text: 'App is running in background'
                            //title: '...',
                            //text: '...',
                            //ticker: '...'
                        });
                    }, 5000);
                }

                cordova.plugins.backgroundMode.on('activate', function () {
                    cordova.plugins.backgroundMode.disableWebViewOptimizations();
                });


            }, false);



            // Android customization
              cordova.plugins.backgroundMode.setDefaults({ silent: true });





        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }


        //document.addEventListener('backbutton', function (event) {
        //    event.preventDefault(); // EDIT
        //    navigator.app.exitApp();
        //});

    });


    $ionicPlatform.registerBackButtonAction(function (event) {

        $ionicPopup.confirm({
            title: 'Exit',
            template: ' <style> .popup{ background: white!important;background-color: black;border: 3px solid #e3e3e3;border-radius: 4px;box-shadow: 10px 10px 5px #888888; }  .popup-container { opacity: 1;} </style> <span> Are you sure you want to exit? <span>'
        }).then(function (res) {
            if (res) {
                ionic.Platform.exitApp();
            }
        })

    }, 100);




}


)
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app',
      {
          url: '/app',
          templateUrl: 'templates/splashscreen.html',
          controller: 'SplashScreenCtrl'
      })
      //.state('page2',
      //{
      //    url: '/app/:param',
      //    //templateUrl: 'templates/leftMenuPage2.html',
      //    controller: 'leftMenuPage2Ctrl',
      //})
      .state('wizard',
      {
          url: '/wizard',
          templateUrl: 'templates/wizard.html',
          controller: 'WizardCtrl'
      })
      .state('leftMenu',
      {
          url: '/leftMenu',
          templateUrl: 'templates/leftMenu.html',
          controller: 'LeftMenuCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');
});



