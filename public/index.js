var Listeafaire = angular.module('ListeaFaire', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.modifyData = {};


    //Obtenir la liste (appel à la fonction get dans server.js)
    $http.get('/DiffListe/'+$scope.ListeName).success(function(data) {
        console.log("Sucess ListeUser ?");
        $scope.lalistenom = data;
        console.log(data);
//        console.log($scope.lalistenom);
    })
    .error(function(data) {
        console.log('Error ListeUser : ' + data);
    });

    $scope.modifieListeName = function(nom){
        console.log("test");
        document.getElementById('ListeName').innerHTML=nom;
        document.getElementById('listetache').style.display = "block";
        document.getElementById('todo-form').style.display = "block";
        $http.get('/Listetache/'+nom).success(function(data) {
            console.log("Sucess ListeUser ?");
            console.log($scope.ListeName);
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error ListeUser : ' + data);
        })
       
    };

    $scope.createList = function(){
        $http.post('/CreateList/',$scope.Liste)
        .success(function(data){
            $scope.Liste = {};
            $scope.lalistenom = data;
        })
        .error(function(data){
            console.log('Error : ' + data);
        })
    };

    $scope.deleteList = function(listname){
        console.log(listname);
        $http.post('/DeleteList/'+listname)
        .success(function(data) {
            $scope.lalistenom = data;
            console.log(data);
            window.location.replace('/AfficheListe');
        })
        .error(function(data) {
            console.log('Error : ' + data);
        }); 
    };

    //rajout d'une donnée (appel à la fonction post dans server.js)
    $scope.createTodo = function() {
       var list = document.getElementById('ListeName').innerHTML;
        $http.post('/ListeCreate/'+list, $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    //rajout d'une donnée (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        var list = document.getElementById('ListeName').innerHTML;
        $http.post('/Liste/delete/' +id +'/'+ list)
            .success(function(data) {
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.modifier = function(index,x){
        var list = document.getElementById('ListeName').innerHTML;
        if (document.getElementById('modify-'+index).innerHTML=='modifier') {
            for (pas = 0; pas < $scope.laliste.length; pas++) {
                document.getElementById('xtextmodify-'+pas).style.display = "none";
                document.getElementById('xtext-'+pas).style.display = "block";
                document.getElementById('modify-'+pas).innerHTML='modifier';
            }
            $scope.modifyData.text = x.text;
            document.getElementById('xtextmodify-'+index).style.display = "block";
            document.getElementById('xtext-'+index).style.display = "none";
            document.getElementById('modify-'+index).innerHTML='Valider';
        }

        else {
            document.getElementById('xtextmodify-'+index).style.display = "none";
            document.getElementById('xtext-'+index).style.display = "block";
            document.getElementById('modify-'+index).innerHTML='modifier';
            console.log($scope.modifyData.text);
            $http.post('/Liste/modify/'+x._id+'/'+$scope.modifyData.text+'/'+list)
            .success(function(data){
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data){
                console.log('Error : ' + data);
            });
        };
    };

    $scope.isChecked = function(id,done) {
        var list = document.getElementById('ListeName').innerHTML;
        $http.put('/Liste/' +id+'/'+done+'/'+list)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
}