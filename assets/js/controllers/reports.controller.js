angular.module('app').controller('ReportsCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike',
	function ($scope, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike) {
		$scope.reportingData = {
			apps: []
		};
		$scope.showingGraph = false;
		$scope.showing = { "type": "apps", "subType": 1 };

		function initDataTableSimple() {
			jQuery('#reports-table').dataTable({
				pageLength: 30,
				lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
				searching: false,
				order: [[0, "asc"]],
				oLanguage: {
					sLengthMenu: ""
				},
				// dom:
				// 	"<'row'<'col-sm-12'tr>>" +
				// 	"<'row pb-20'<'col-sm-6'i><'col-sm-6'p>>"
			});
		};

		function fetchReporting(type, subType) {
			$http.get("http://localhost:9000/firebase/stats/" + type + "/" + subType)
				.then(function (res) {
					$scope.reportingData.apps = res.data;
					initDataTableSimple()
				})
				.catch(function (err) {
					alert("There was issue fetching apps reporing data");
				});
		}
		$scope.$watch('showing.type', function (value) {
			//fetchReporting(value, $scope.showing.subType);
		});
		$scope.$watch('showing.subType', function (value) {
			//fetchReporting($scope.showing.type, value);
		});
		function initGraphs() {
			$http.get("http://localhost:9000/firebase/stats/daily/20")
				.then(function (res) {
					let parsedData = {
						"gain": [], 
						"growth": [], 
						"loss": [], 
						"subscribed": [], 
						"totalClicks": [], 
						"totalUsers": [], 
						"unsubscribed": []
					};
					
					const data = Object.values(res.data)
					for (let row of data) {
						for(let column in row){
							if(parsedData[column]){
								parsedData[column].push(row[column])
							}
						}
					}
					$scope.data = Object.values(parsedData)
					$scope.labels = Object.keys(parsedData);
				})
				.catch(function (err) {
					alert("There was issue fetching apps reporing data");
				});
		}
		// initGraphs();
		$scope.series = ["gain", "growth", "loss", "subscribed", "totalClicks", "totalUsers", "unsubscribed"];
		$scope.labels = [];
		// $scope.series = ['Series A', 'Series B'];
		$scope.data = [];
		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};
		$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
		$scope.options = {
			scales: {
				yAxes: [
					{
						id: 'y-axis-1',
						type: 'linear',
						display: true,
						position: 'left'
					},
					{
						id: 'y-axis-2',
						type: 'linear',
						display: true,
						position: 'right'
					}
				]
			}
		};
	}
]);