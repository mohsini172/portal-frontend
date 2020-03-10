angular.module('app').controller('AppsCtrl', ['$scope', '$localStorage', '$window', '$rootScope', '$http', '$timeout', '$httpParamSerializerJQLike',
    function ($scope, $localStorage, $window, $rootScope, $http, $timeout, $httpParamSerializerJQLike) {



        //initializing variables
        $scope.apps = [];
        $scope.appData = {};
        $scope.deleteApp = deleteApp;
        $scope.createApp = createApp;
        const apiUrl = $rootScope.apiUrl;
        //intializing functions
        loadAppList();


        // Init simple DataTable, for more examples you can check out https://www.datatables.net/
        function initDataTableSimple() {
            jQuery('.js-dataTable-simple').dataTable({
                columnDefs: [{ orderable: false, targets: [-1] }],
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
        function loadAppList() {
            $http.get('/api/apps/').then(
                function (res) {
                    $scope.apps = res.data;
                    //using angular timeout to digest view property otherwise it will give error
                    $timeout(function () {

                        if (!$scope.initializedTable) initDataTableSimple(); $scope.initializedTable = true
                    }, 100);
                },
                function (err) {
                    toastr.error('Unabled to load apps');
                    console.log(err);
                }
            );
        }


        //delete app function input->id
        function deleteApp(id) {
            $http({
                url: '/api/apps/' + id,
                method: 'DELETE'
            }).then(
                function (res) {
                    loadAppList();
                    toastr.success("Successfully deleted")
                },
                function (err) {
                    toastr.error("Error while deleting");
                    console.log(err);
                }
            );
        }

        //creating app
        function createApp() {
            $http.post('/api/apps/', $scope.appData)
                .then(
                    function (res) {
                        loadAppList();
                        toastr.success("Successfully created list");
                    },
                    function (err) {
                        toastr.error("Error in reloading app list");
                        console.log(err);
                    }
                );
        }
    }
]);