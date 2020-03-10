angular.module('app').controller('SourcesCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike',
    function ($scope, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike) {



        //initializing variables
        $scope.sources = [];
        $scope.sourceData = {};
        $scope.deleteSource = deleteSource;
        $scope.createSource = createSource;
        //intializing functions
        loadSourceList();




        // Init simple DataTable, for more examples you can check out https://www.datatables.net/
        function initDataTableSimple() {
            jQuery('.js-dataTable-simple').dataTable({
                columnDefs: [{ orderable: false, targets: [3] }],
                pageLength: 30,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                searching: false,
                oLanguage: {
                    sLengthMenu: ""
                },
                dom:
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row pb-20'<'col-sm-6'i><'col-sm-6'p>>"
            });
        };
        //loads the list of apps from database
        function loadSourceList() {
            $http({
                url: '/api/sources/',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).then(
                function (res) {
                    $scope.sources = res.data;
                    //using angular timeout to digest view property otherwise it will give error
                    $timeout(function () {
                        if (!$scope.initializedTable) initDataTableSimple(); $scope.initializedTable = true
                    }, 100);
                },
                function (err) {
                    alert("Error in loading data");
                    console.log(err);
                }
            );
        }


        //delete app function input->id
        function deleteSource(id) {
            $http({
                url: '/api/sources/' + id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).then(
                function (res) {
                    loadSourceList();
                    alert("deleted successfully")
                },
                function (err) {
                    alert("Error in deletion");
                    console.log(err);
                }
            );
        }

        //creating app
        function createSource() {
            $http.post('/api/sources/', $scope.sourceData).then(
                function (res) {
                    loadSourceList();
                    alert("Sucess");
                },
                function (err) {
                    alert("Error in loading data");
                    console.log(err);
                }
            );
        }
    }
]);