// Root Application

HRITCommon.guest = true;

angular.module('my-app', ['my-common']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:HomeCtrl, templateUrl:'home.html'}).
      otherwise({redirectTo:'/'});
  }).
  directive('appMenu', function() {
    return {
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
            $scope.items = [
                {link: '/',      title: "Home"},                
                {link: '/app1/', title: "App1"},               
                {link: '/app2/', title: "App2"}                
            ];
      },
      templateUrl: '/lib/ng/part/menubar.html',
      replace: true
     };
  });
 
function HomeCtrl($scope, RemoteService) {
    $scope.$env.app_name = 'Application Root';
    
    $scope.info = RemoteService.api('whoami').get();
}
