var appConnexion = angular.module('appConnexion', []);

function mainController($scope, $http, $window){
    console.log("test");


    $scope.connect= function() {
    
        //console.log($scope.myId);
        //console.log($scope.myPassword);
        $http.post('/login/'+$scope.myId+'/'+$scope.myPassword)
        .success(function(cb) {
            console.log("Succesfully POST le cookie /");
                console.log(cb);
                if(cb=='OK')
                {
                    $window.location.href="/AfficheListe";
                }
            })
        .error(function(){
            console.log("Error");
        })
    }

    $scope.cree = function(){
        $http.post('/cree/'+$scope.myId+'/'+$scope.myPassword)
        .success(function(cb) {
            console.log(cb);
            })
        .error(function(){
            console.log("Error");
        })
        $scope.myId ="";
        $scope.myPassword = "";
    }
}