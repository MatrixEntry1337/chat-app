var appModule = angular.module('app', ['ui.router', 'chat', ]);

appModule.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
   $urlRouterProvider.otherwise('chat-home');

    $stateProvider
        .state('chat-home', {
            url: '/chat-home',
            templateUrl: 'templates/chat-home.html',
            controller: 'chatCtrl',
        })
        .state('404', {
            url: '/404',
            templateUrl: '/templates/404.html',
        });
    
}]);