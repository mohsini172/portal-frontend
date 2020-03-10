angular.module('app').controller('GroupsCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike',
    function ($scope, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike) {



        //initializing variables
        $scope.groups = [];
        $scope.groupData = {};
        $scope.deleteGroup = deleteGroup;
        $scope.createGroup = createGroup;
        $scope.isEditing = false;
        $scope.enableEditing = enableEditing;
        $scope.editingId = null;
        //intializing functions
        loadGroupList();




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
        function loadGroupList() {
            $http({
                url: '/api/groups/',
                method: 'GET',
            }).then(
                function (res) {
                    $scope.groups = res.data;
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
        function deleteGroup(id) {
            $http({
                url: '/api/groups/' + id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).then(
                function (res) {
                    alert("deleted successfully")
                },
                function (err) {
                    alert("Error in deletion");
                    console.log(err);
                }
            );
        }

        //creating app
        function createGroup() {
            const method = $scope.isEditing ? 'PUT' : 'POST';
            const url = '/api/groups/' + ($scope.isEditing ? $scope.editingId : '');
            $http({
                url: url,
                method: method,
                data: $scope.groupData,
            }).then(
                function (res) {
                    loadGroupList();
                    alert("Sucess");
                },
                function (err) {
                    alert("Error in loading data");
                    console.log(err);
                }
            );
            $scope.isEditing = false;
        }

        function enableEditing(data) {
            $scope.isEditing = true;
            $scope.editingId = data._id;
            $scope.groupData.name = data.name;
            $scope.groupData.campaignUrl = data.campaignUrl;
            $scope.groupData.category = data.category;
        }
    }
]);