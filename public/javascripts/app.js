var appModule = angular.module('app', ['ui.router', 'chat', 'luegg.directives', 'ngTextareaEnter']);

appModule.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
   $urlRouterProvider.otherwise('chat');

    $stateProvider
        .state('chat', {
            url: '/chat-home',
            templateUrl: 'templates/chat.html',
            controller: 'chatCtrl'
        })
        .state('404', {
            url: '/404',
            templateUrl: '/templates/404.html',
        });
    
}]);