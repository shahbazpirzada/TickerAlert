angular.module('controllers', [])
  .controller('SplashScreenCtrl',
  [
    '$scope', function ($scope) {

      $scope.params = {
        'data': {
          'duration': 3000,
          'backgroundImage': 'img/background/30.jpg',
          'logo': 'img/logo/logo.png',
          'redirectTo': '/wizard'
        },
        'theme': "layout1"
      }

    }
  ])
  //.controller('leftMenuPage2Ctrl' ,['$scope','$stateParams', function ($scope,$stateParams) {
  //    $scope.barcode = $stateParams.param;
  //}
  //])
  //.controller('leftMenuPage2Ctrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
  //    $scope.params = {
  //        'barcode': $stateParams.param,
  //        //'events': {
  //        //    onFinish: function () {
  //        //        $location.path("/leftMenu");
  //        //    }
  //        //},
  //        'theme': "layout1"
  //    }
  //}
  //])
  .controller('WizardCtrl',
  [

    '$scope', '$location', function ($scope, $location) {



      if (window.localStorage.getItem('CheckboxValue') == 1) {
        $location.path("/leftMenu");
      } else {
        $scope.params = {
          'data': {
            'containerBodyImage': 'img/background/30.jpg',
            'btnPrev': 'Previous',
            'btnNext': 'Next',
            'btnFinish': 'Finish',
            'items': [
              {
                logo: '',
                image: 'img/AlertAppImages/tic1.png',
                title: 'Get Ticket',
                description:
                'Get the ticket from printer',
                buttonNext: 'Next'
              },
              {
                logo: '',
                image: 'img/AlertAppImages/tic2.png',
                title: 'Scan Ticket',
                description:
                'Scan the bar code of the ticket which is printed in the buttom of the image.',
                buttonNext: 'Next',
                buttonPrevious: 'Previous'
              },
              {
                logo: '',
                image: 'img/AlertAppImages/tic3.png',
                title: 'Subscribe Ticker Alerts',
                description:
                'Enter the issued ticket number in the box and press on subscribe button',
                buttonPrevious: 'Previous',
                buttonFinish: 'Finish'

              }
            ]
          },
          'events': {
            onFinish: function () {
              $location.path("/leftMenu");
            }
          },
          'theme': "layout1"
        }

      };







    }
  ])
  .controller('LeftMenuCtrl',
  ['$scope', '$cordovaLocalNotifications', '$ionicPlatform', '$ionicPopup',
    function ($scope, $cordovaLocalNotifications, $ionicPlatform, $ionicPopup) {

      $scope.params = {
        'items': {
          title: 'My Turn',
          description: 'Interactive Waiting',
          image: 'img/android-images/mipmap-xxxhdpi/ic_launcher.png',
          containerBodyImage: "img/background/30.jpg",
          items: [
            {
              icon: "icon-camera",
              pagePath: "templates/leftMenuPage1.html",
              title: "Scan"
            },
            {
              icon: "icon-cloud-check",
              pagePath: "templates/leftMenuPage2.html",
              title: "Subscribe"
            }
          ]
        },
        'theme': "layout1"
      };


      // Using show()

      debugger;
      var callfunc = window.localStorage.getItem('CheckboxValue');
      if (callfunc != 1) {
        $scope.data = { isChecked: true };

        $ionicPopup.show({
          title: 'Do not show the Wizard again?',
          content: '<style> .popup{ background: white!important;background-color: black;border: 3px solid #e3e3e3;border-radius: 4px;box-shadow: 10px 10px 5px #888888; }  .popup-container { opacity: 1;} .item{border-style: none;} </style><ion-checkbox ng-model="data.isChecked" ng-checked="data.isChecked" class = "item-checkbox-left">Remember...</ion-checkbox>',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function (e) { return e; }
            }
          ]
        })
          .then(function (res) {
            debugger;
            if (res) {
              console.log('You asked to open it!');
              if ($scope.data.isChecked) {
                console.log('and also to mark this as a work log (entry or leave)!');
                window.localStorage.setItem('CheckboxValue', '1');
              }
            }
          });
      }





    }
  ]);
