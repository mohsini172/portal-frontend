angular.module('app').controller('MediaCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike',
	function ($scope, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike) {



		//initializing variables
		$scope.mediaGroups = [];
		$scope.media = [];
		$scope.mediaGroupData = {};
		$scope.mediaData = {};
		$scope.mediaData.checkboxes = [];
		$scope.checkboxesModels = {};
		$scope.deleteMediaGroup = deleteMediaGroup;
		$scope.createMediaGroup = createMediaGroup;
		$scope.addToGroup = addToGroup;
		$scope.toggleAllCheckBoxes = toggleAllCheckBoxes;
		$scope.isEditing = false;
		$scope.enableEditing = enableEditing;
		$scope.editingId = null;
		$scope.searchedType = ""
		$scope.isEmpty = isEmpty;
		$scope.addToGroupChanged = addToGroupChanged;
		$scope.filteredMedia = [];
		//this variable is for checkbox clicking event because when checkbox is clicked the checkbox plugin trigger is twice
		$scope.isChecking = false;
		//intializing functions
		loadMediaGroupList();
		loadMediaList();



		function addToGroupChanged(id) {
			for (let i = 0; i < $scope.mediaGroups.length; i++) {
				if ($scope.mediaGroups[i]._id == id) {
					$scope.searchedType = $scope.mediaGroups[i].mtype.toLowerCase() + 's';
				}
			}
		}

		// Init simple DataTable, for more examples you can check out https://www.datatables.net/
		function initMediaGroupTable() {
			jQuery('#media-group-table').dataTable({
				columnDefs: [{ orderable: false, targets: [2] }],
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
		function initMediaTable() {
			$scope.mediaTable = jQuery('#media-table').DataTable({
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
		function loadMediaGroupList() {
			$http({
				url: '/api/media-groups/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.mediaGroups = res.data;
					//using angular timeout to digest view property otherwise it will give error
					$timeout(function () {
						if (!$scope.initializedTable) initMediaGroupTable(); $scope.initializedTable = true
					}, 100);
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}
		function loadMediaList() {
			$http({
				url: '/api/s3/aws-files',
				method: 'GET'
			}).then(
				function (res) {
					$scope.media = res.data;
					for (var i in $scope.media) {
						$scope.checkboxesModels[$scope.media[i].file] = false;
					}
					$scope.filteredMedia = $scope.media;
					//using angular timeout to digest view property otherwise it will give error
					$timeout(function () {
						initMediaTable()
					}, 100);
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}


		//delete app function input->id
		function deleteMediaGroup(id) {
			$http({
				url: '/api/media-groups/' + id,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					loadMediaGroupList();
					alert("deleted successfully")
				},
				function (err) {
					alert("Error in deletion");
					console.log(err);
				}
			);
		}

		//creating app
		function createMediaGroup() {
			const method = $scope.isEditing ? 'PUT' : 'POST';
			const url = '/api/media-groups/' + ($scope.isEditing ? $scope.editingId : '');
			$http({
				url: url,
				method: method,
				data: $scope.mediaGroupData
			}).then(
				function (res) {
					loadMediaGroupList();
					alert("Sucess");
				},
				function (err) {
					alert("Error in saving data");
					console.log(err);
				}
			);
		}
		function isEmpty(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key))
					return false;
			}
			return true;
		}

		function addToGroup() {
			let data = {
				mgId: $scope.mediaData.mgId,
				filenames: []
			};
			for (var media in $scope.checkboxesModels) {
				if ($scope.checkboxesModels[media] == true)
					data.filenames.push({ "name": media })
			}
			// Iterate over all selected checkboxes
			$http({
				url: '/api/media-groups/' + data.mgId + '/media',
				method: 'POST',
				data: data.filenames,
			}).then(
				function (res) {
					alert("Sucess");
				},
				function (err) {
					alert("Error in loading data");
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
				if (counter >= start && counter < end) {
					const filename = filteredMedia[i].file;
					$scope.checkboxesModels[filename] = value;
				}
				if (value == false) {
					const filename = filteredMedia[i].file;
					$scope.checkboxesModels[filename] = value;
				}
				counter++;
			}
		}
		function enableEditing(data) {
			$scope.isEditing = true;
			$scope.editingId = data._id;
			$scope.mediaGroupData.label = data.label;
			$scope.mediaGroupData.mtype = data.mtype;
		}
	}
]);