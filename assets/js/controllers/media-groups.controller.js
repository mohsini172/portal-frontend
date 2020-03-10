angular.module('app').controller('MediaGroupsCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$stateParams', '$httpParamSerializerJQLike',
    function ($scope, $localStorage, $window, $http, $timeout, $stateParams, $httpParamSerializerJQLike) {



        //initializing variables
        $scope.media = [];
        $scope.deleteMedia = deleteMedia;
        $scope.toggleSelectedGroup = toggleSelectedGroup;
        $scope.mgId = $stateParams.id;
        $scope.title = $stateParams.title;
        $scope.type = $stateParams.type;
        $scope.deletingFiles = [];
		$scope.isChecking = false;
		$scope.searchedFile = "";
		$scope.checkboxesModels = {};
		$scope.toggleAllCheckBoxes = toggleAllCheckBoxes;
        //intializing functions
        loadMediaList();




        // Init simple DataTable, for more examples you can check out https://www.datatables.net/
        function initDataTableSimple() {
            $scope.mediaTable = jQuery('.js-dataTable-simple').DataTable({
                columnDefs: [
                    { orderable: false, targets: [0, 3] }
                ],
                'select': {
                    'style': 'multi'
                },
                pageLength: 50,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                searching: false,
                oLanguage: {
                    sLengthMenu: ""
                },
                dom:
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-sm-6'i><'col-sm-6'p>>"
            });
        };
        //loads the list of apps from database
        function loadMediaList() {
            $http({
                url: '/api/media-groups/' + $scope.mgId,
                method: 'GET',
            }).then(
                function (res) {
					$scope.media = res.data.files;
					for (var i in $scope.media) {
						$scope.checkboxesModels[$scope.media[i][1]] = false;
					}
					$scope.filteredMedia = $scope.media;
                    //using angular timeout to digest view property otherwise it will give error
                    $timeout(function () {
                        if(!$scope.initializedTable) initDataTableSimple(); $scope.initializedTable=true
                    }, 100);
                },
                function (err) {
                    alert("Error in loading data");
                    console.log(err);
                }
            );
        }


        //delete app function input->id
        function deleteMedia() {
            let data = {
				filenames:[]
			};
            for (var media in $scope.checkboxesModels) {
				if ($scope.checkboxesModels[media] == true)
					data.filenames.push(media)
			}
            data.mgId = $scope.mgId;
            $http({
                url: '/api/media-groups/'+data.mgId+'/media/deletemany',
                method: 'POST',
                data: data.filenames
            }).then(
                function (res) {
                    loadMediaList();
                    alert("deleted successfully")
                },
                function (err) {
                    alert("Error in deletion");
                    console.log(err);
                }
            );
		}
		function toggleAllCheckBoxes(value) {
			let counter = 0;
			const start = $scope.mediaTable.page.info().start;
			const end = $scope.mediaTable.page.info().end;
			const filteredMedia = $scope.filteredMedia;
			for (let i in filteredMedia) {
				if (counter >= start && counter < end){
					const filename = filteredMedia[i][1];
					$scope.checkboxesModels[filename] = value;
				}
				if(value == false){
					const filename = filteredMedia[i][1];
					$scope.checkboxesModels[filename] = value;
				}
				counter++;
			}
		}

        function toggleSelectedGroup(filename) {
            if (!$scope.isChecking) {
                //this portion is to keep track of click within 300ms
                $scope.isChecking = true;
                $timeout(function () {
                    $scope.isChecking = false;
                }, 300);
                //ending portion

                let index = $scope.deletingFiles.indexOf(filename);
                if (index >= 0) {
                    $scope.deletingFiles.splice(index, 1);
                }
                else {
                    $scope.deletingFiles.push(filename);;
                }
            }
            console.log($scope.deletingFiles)
        }
    }
]);