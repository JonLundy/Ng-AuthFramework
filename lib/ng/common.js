// Common Angular Module

var HRITCommon = { aspect: undefined, api: '/api/', guest: false, env: 'default' };

angular.module('my-common',[]).
  factory('RemoteService', function ($http) {
    return {
      api: function ($module, $part, $root) {
        $root = ($root != undefined ? $root : HRITCommon.api);

        var baseStr = $root + $module;
        var config  = {cache: false, headers: { 'If-Modified-Since': "0" }, withCredentials: true};
        var execute = function(method, id, payload, query) {
            switch(method) {
               case 'GET':    break;
               case 'PUT':    config['data'] = payload; break;
               case 'POST':   config['data'] = payload; break;
               case 'PATCH':  config['data'] = payload; break;
               case 'DELETE': break;
               default: return undefined;
            }

            if (query == undefined) query = {};
            if (HRITCommon.aspect != undefined) {
                query.aspect = HRITCommon.aspect;
            }


            config['url']    = baseStr + (id != undefined ? '(' + id + ')': '') + ($part != undefined ? '/' + $part : '');
            config['params'] = query;
            config['method'] = method;


            if (method == 'DELETE') {
              return $http(config);
            }

            var q = $http(config).then(function(response) {
                    if (response.data == undefined) return {};
                    if (response.data.d != undefined) return response.data.d;
                    else return response.data;
                }, function (response) {
                    return {};   // On failure return an empty object.
                });

            return q;
        };
        return {
            get:    function(id, query)          { return execute('GET',    id,    null, query); },
            put:    function(id, payload, query) { return execute('PUT',    id, payload, query); },
            post:   function(id, payload, query) { return execute('POST',   id, payload, query); },
            patch:  function(id, payload, query) { return execute('PATCH',  id, payload, query); },
            del:    function(id, query)          { return execute('DELETE', id,    null, query); },
            'delete': function(id, query)        { return execute('DELETE', id,    null, query); }
        };
  }}}).
  directive('userMenu', function($location) {
    return {
      restrict: 'M',
      scope: false,
      controller: function($scope, $element, RemoteService) {

          $scope.user_data = $scope.$root.user_data  = [];

          RemoteService.api('whoami')
                       .get()
                       .then(function(data){
                            $scope.loading = false;
                            $scope.$root.user_data  = data;
                            $scope.$root.$user  = data;
                      });

          $scope.loading = true;
          $scope.$root.absUrl = function () { return encodeURIComponent($location.absUrl()); };

          $scope.guest = $scope.$root.guest = function (allow) {
            if (allow == true) return angular.equals ($scope.$root.user_data, []);
            return HRITCommon.guest ? false : angular.equals ($scope.$root.user_data, []);
          };
          $scope.role = function(role) { return ($scope.$root.user_data.app_roles.indexOf(role) > -1); }
          $scope.$role = function(role) { return ($scope.$root.$user.app_roles.indexOf(role) > -1); }
          $scope.is_user = function(id) { return ($scope.$root.user_data.person_id == id); }
      },
      templateUrl: '/lib/ng/part/user-menu.html',
      replace: true
    };
  }).
    directive('serviceMenu', function() {
    return {
      restrict: 'M',
      scope: false,
      controller: function($scope, $element, RemoteService) {
          $scope.$root.$env = {
            env: 'prod',
            root: 'https://A000.appspot.com',
            app_name: 'My Web Applications',
            menu: {
                title: 'MyApps',
                link: '/'
            }    
          };
      },
      templateUrl: '/lib/ng/part/service-menu.html',
      replace: true
    };
  });
