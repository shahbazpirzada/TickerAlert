

angular.module('ngLeftMenu', ['blockUI'])

  .constant('ngLeftMenuPath', 'module/leftMenu/themes/')

  .controller('LeftMenuController', ['$scope', '$state', '$http', '$timeout', '$ionicSideMenuDelegate',
    'ngLeftMenuPath', '$location', '$ionicHistory', '$cordovaBarcodeScanner', '$ionicPlatform', 'blockUI', '$ionicPopup', 
    function ($scope, $state, $http, $timeout, $ionicSideMenuDelegate, path, $location, $ionicHistory, $cordovaBarcodeScanner, $ionicPlatform, blockUI, $ionicPopup) {

      var _this = this;
      _this.templateUrl = "";
      _this.headerImage = "";
      _this.backgroundImage = "";
      _this.auth_token = "YWRtaW46QFN0ZWNoNzgzMjQ=";
      _this.baseUrl = "http://notifier.stech.com.pk:2337";

      $scope.$on('$includeContentLoaded', function () {
        if (_this.data && _this.data.items && _this.data.items.length > 0 && _this.data.items[0].pagePath && _this.templateUrl == "") {
          _this.templateUrl = _this.data.items[0].pagePath;
        }
        _this.addImageOnComponent(_this.data);
      });

      _this.addImageOnComponent = function (data) {
        $timeout(function () {
          if (data) {
            if (data.headerImage) {
              angular.element('.container-hearder-image')
                .css({ 'background-image': 'url("' + data.headerImage + '")' });
            }
            if (data.backgroundImage) {
              angular.element('.container-background')
                .css({ 'background-image': 'url("' + data.backgroundImage + '")' });
            }
            if (data.containerBodyImage) {
              angular.element('.container-background-full')
                .css({ 'background-image': 'url("' + data.containerBodyImage + '")' });
            }
          }
        });
      };


      _this.clickEvent = function (path) {
        $ionicSideMenuDelegate.toggleLeft();
        _this.templateUrl = path;
      };

      _this.changeTemplate = function (path) {
        _this.templateUrl = path;
      };

      _this.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };

      _this.goBack = function () {
        $ionicHistory.goBack();
      };

      if ($ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(true);
      }

      _this.contentUrl = function (type) {
        if (_this.theme) {
          if (type === 'html') {
            return path + _this.theme + '/index.html';
          } else if (type === 'css') {
            return path + _this.theme + '/style.css';
          }
        }
      };

      // menu page 1 related settings

      $scope.ticket = {
        number: ''
      }

      $scope.gcmToken = window.global.GCM_TOKEN;

      $scope.scan = function () {

        $ionicPlatform.ready(function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (result) {

              $scope.barcode = result.text.toString();

              if ($scope.barcode) {
                _this.changeTemplate('templates/leftMenuPage2.html');
              }

            }, function (error) {
              // An error occurred
              $scope.scanResults = 'Error: ' + error;
            });
        });

      };

      $scope.back = function () {
        _this.changeTemplate('templates/leftMenuPage1.html');
      };

      $scope.subscribe = function () {

        blockUI.start();

        $http.defaults.headers.common['Authorization'] = 'Basic ' + _this.auth_token;

        // get TrackNo, TimeNo and TicketNo data from $scope.barcode
        if ($scope.barcode) {

          var timeNo = $scope.barcode.substring(0, 3).replace(/^0+/, '');
          var trackNo = $scope.barcode.substring(3, 7).replace(/^0+/, '');
          var branchNo = $scope.barcode.substring(7, 10).replace(/^0+/, '');

          var data = {
            TrackNo: parseInt(trackNo),
            TimeNo: parseInt(timeNo),
            TicketNo: parseInt($scope.ticket.number.replace(/^0+/, '')),
            GcmId: $scope.gcmToken
          };

          $http.put(_this.baseUrl + '/saveGcmId?format=json', JSON.stringify(data))
            .success(function (data, status, headers) {

              blockUI.stop();

              $scope.ServerResponse = data;

              if ($scope.ServerResponse) {
                //  alert("You have been successfully subscribed for notifications!");
                //alert("" + $scope.ticket.number.replace(/^0+/, ''));
                //alert("You will notify of your turn!");

                window.plugins.toast.show('Thank You!', 'long', 'bottom');

                // alert($scope.ServerResponse.Message);
                var responsedata = String($scope.ServerResponse.Result);
                var compareresults = "true";
                //     alert(responsedata + "yeh " + compareresults);


                if (responsedata == compareresults) {
                  //alert($scope.ServerResponse.Message);
                  var dataDisp = ($scope.ServerResponse.Message).split(':');

                 // var displayString= 'Your postion in queue is: ' + dataDisp[1];
                  $scope.showPopup(dataDisp[1]);
                  // window.plugins.toast.show($scope.ServerResponse.Message, 'long', 'center');
                }

                else {
                  alert("Please scan barcode again!");
                  // window.plugins.toast.show('Please scan barcode again!', 'long', 'center');
                }


              }

              $scope.back();

            })
            .error(function (data, status, header, config) {

              blockUI.stop();

              //alert("An error occurred, please try again later.");


              window.plugins.toast.show('An error occurred, please try again later.', 'long', 'center');

            });

        }


      }



      // Triggered on a button click, or some other target
      $scope.showPopup = function (data) {
        //debugger;
        var text = data;
        var alertPopup = $ionicPopup.alert({
          title: '<b> Thanks for your subscription </b>',
          template: '<style> .popup{ background: white!important;background-color: black;border: 3px solid #e3e3e3;border-radius: 4px;box-shadow: 10px 10px 5px #888888; }  .popup-container { opacity: 1;} </style> Your position in queue : <b> '+ data +' </b>' 
        });
        alertPopup.then(function (res) {
          console.log('Done ');
        });

        //alert(data);


      };

    }])

  .directive('leftMenu', ['ngLeftMenuPath', function (path) {
    return {
      restrict: 'E',
      scope: {
        theme: '=theme',
        data: '=data',
        events: '=events'
      },
      bindToController: true,
      controllerAs: "leftMenuController",
      controller: "LeftMenuController",
      template: '<link data-ng-href="{{leftMenuController.contentUrl(\'css\')}}" rel="stylesheet"/><div ng-include="leftMenuController.contentUrl(\'html\')"></div>'
    };
  }]);

