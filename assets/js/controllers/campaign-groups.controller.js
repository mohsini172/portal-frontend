angular.module('app').controller('CampaignGroupsCtrl', ['$scope', '$location', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike', '$stateParams',
	function ($scope, $location, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike, $stateParams) {

		$scope.campaignName = $location.search()['title']
		$scope.timezone = $location.search()['timezone']

		//initializing variables
		$scope.campaignGroups = [];
		$scope.groups = [];
		$scope.campaignGroupData = {};
		$scope.campaignGroupData.campaignId = $stateParams.id;
		$scope.campaignGroupData.status = 1;
		$scope.deleteCampaignGroup = deleteCampaignGroup;
		$scope.createCampaignGroup = createCampaignGroup;
		$scope.enableEditing = enableEditing;
		$scope.range = range;
		$scope.cid = $stateParams.id;
		$scope.changeStatus = changeStatus;
		$scope.resetSchduler = resetSchduler;
		$scope.resetCapping = resetCapping;
		$scope.statusModels = [];
		$scope.editingId = null;
		$scope.isEditing = false;
		$scope.sortDirty = false;
		$scope.updateSorting = updateSorting;
		$scope.parseTimezone = parseTimezone;
		//intializing functions
		loadCampaignGroupList();
		loadGroupList();




		// Init simple DataTable, for more examples you can check out https://www.datatables.net/
		function initDataTableSimple() {
			// jQuery('.js-dataTable-simple').dataTable({
			// 	columnDefs: [{ orderable: false, targets: [3] }],
			// 	pageLength: 30,
			// 	lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
			// 	searching: false,
			// 	oLanguage: {
			// 		sLengthMenu: ""
			// 	},
			// 	dom:
			// 		"<'row'<'col-sm-12'tr>>"+
			// 		"<'row pb-20'<'col-sm-6'i><'col-sm-6'p>>"
			// });
		};
		//loads the list of apps from database
		function loadCampaignGroupList() {
			$http({
				url: '/api/campaigns/' + $scope.cid + '/groups/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.campaignGroups = res.data;
					for (var i in $scope.campaignGroups) {
						$scope.campaignGroups[i][6] = ($scope.campaignGroups[i][6]) ? $scope.campaignGroups[i][6].replace("GMT", "") : null;
						// $scope.campaignGroups[i][6] = ($scope.campaignGroups[i][6])?(new Date($scope.campaignGroups[i][6])):null;
						$scope.statusModels.push($scope.campaignGroups[i][5] == 1)
					}
					//using angular timeout to digest view property otherwise it will give error
					$timeout(function () {
						if (!$scope.initializedTable) initDataTableSimple(); $scope.initializedTable = true
					}, 100);
				},
				function (err) {
					toastr.error("Error in loading campaign groups");
					console.log(err);
				}
			);
		}
		function changeStatus(id, value) {
			value = Math.abs(value)
			$http({
				url: '/api/campaigns/' + $scope.cid + '/groups/' + id,
				method: 'PUT',
				data: { active: value }
			}).then(
				function (res) {
					console.log(res);
				},
				function (err) {
					alert("There is some connection issues. Please check");
					console.log(err);
				}
			);
		}
		function loadGroupList() {
			$http({
				url: '/api/groups/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.groups = res.data;
				},
				function (err) {
					toastr.error("Error in loading groups");
					console.log(err);
				}
			);
		}


		//delete app function input->id
		function deleteCampaignGroup(id) {
			$http({
				url: '/api/campaigns/' + $scope.cid + '/groups/' + id,
				method: 'DELETE'
			}).then(
				function (res) {
					loadCampaignGroupList();
					alert("deleted successfully")
				},
				function (err) {
					toastr.error("Error in deletion");
					console.log(err);
				}
			);
		}

		//creating app
		function createCampaignGroup() {
			if (!$scope.isEditing) {
				$http({
					url: '/api/campaigns/' + $scope.campaignGroupData.campaignId + '/groups/',
					method: 'POST',
					data: $scope.campaignGroupData
				}).then(
					function (res) {
						loadCampaignGroupList();
						toastr.success("Sucess");
					},
					function (err) {
						toastr.error("Something went wrong ");
						console.log(err);
					}
				);
			}
			else {
				$scope.isEditing = false;
				$http({
					url: '/api/campaigns/' + $scope.cid + '/groups/' + $scope.editingId,
					method: 'PUT',
					data: $scope.campaignGroupData
				}).then(
					function (res) {
						loadCampaignGroupList();
						alert("Sucess");
					},
					function (err) {
						toastr.error("Error in saving");
						console.log(err);
					}
				);
			}
		}
		function enableEditing(data) {
			$scope.isEditing = true;
			$scope.editingId = data._id;
			$scope.campaignGroupData = JSON.parse(JSON.stringify(data));
			$scope.campaignGroupData.group = data.group._id;
		}
		function range(num) {
			return new Array(num);
		}
		function updateSorting() {
			let orderedList = [];
			for (let i = 0; i < $scope.campaignGroups.length; i++) {
				// orderedList.push({
				// 	id: $scope.campaignGroups[i][0],
				// 	order: i
				// })
				orderedList.push(
					{ id: $scope.campaignGroups[i]._id, order: i+1 }
				)
			}
			$http({
				url: '/api/campaigns/' + $scope.cid + '/groups/',
				method: 'PUT',
				data: orderedList
			}).then(
				function (res) {
					toastr.success("Sucess");
					$scope.sortDirty = false;
					loadCampaignGroupList();
				},
				function (err) {
					toastr.error("Error in saving list");
					console.log(err);
				}
			);

		}
		function resetSchduler() {
			$http({
				url: '/api/campaigns-groups/reset-scheduler/' + $scope.cid,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					loadCampaignGroupList();
					alert("Reset Successfully");
				},
				function (err) {
					alert("There was some error ");
					console.log(err);
				}
			);
		}
		function resetCapping() {
			$http({
				url: '/api/campaigns-groups/reset-capping/' + $scope.cid,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					loadCampaignGroupList();
					alert("Reset Successfully");
				},
				function (err) {
					alert("There was some error ");
					console.log(err);
				}
			);
		}
		$scope.getDate = function (date) {
			if (date && date != '')
				return new Date(date);
			else {
				return ""
			}
		}

		$scope.sortableOptions = {
			update: function () {
				$scope.sortDirty = true;
			},
			stop: function (e, ui) {
				for (var i in $scope.campaignGroups) {
					$scope.statusModels[i] = ($scope.campaignGroups[i][5] == 1)
				}
			}
		};
		function parseTimezone(date, timezone) {
			try {
				if (date && timezone) {
					const actualTime = moment.tz(date, 'UTC');
					actualTime.format();
					const convertedTime = actualTime.tz(timezone).format('MM-DD-YYYY hh:mm A');
					return convertedTime;
				}
				return date;
			} catch (error) {
				return date
			}
		}

	}
]);