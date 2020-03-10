angular.module('app').controller('CampaignCtrl', ['$scope', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike', 'UtilsService',
	function ($scope, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike, UtilsService) {



		//initializing variables
		$scope.campaignList = [];
		$scope.campaignSourcesList = [];
		$scope.sourcesList = [];
		$scope.appList = [];
		$scope.campaignData = {};
		$scope.campaignData.countries = [];
		$scope.campaignData.sources = [];
		$scope.campaignData.apps = [];
		$scope.campaignData.autoReset = "0";
		$scope.campaignData.advanceTargeting = { enabled: false };
		$scope.campaignData.frequency = 0;
		$scope.campaignData.collapsing = 0;
		$scope.campaignData.sendingLimit = 0;
		$scope.campaignData.allDay = true;
		$scope.deleteCampaign = deleteCampaign;
		$scope.createCampaign = createCampaign;
		$scope.enableEditing = enableEditing;
		$scope.changeStatus = changeStatus;
		$scope.duplicate = duplicate;
		$scope.statusModels = [];
		$scope.range = range;
		$scope.isEditing = false;
		$scope.editingId = null;
		$scope.countriesVisibility = false;
		$scope.parseDate = parseDate;
		$scope.campaignData.schedules = [];
		$scope.addTimeRange = addTimeRange;
		$scope.removeTimeRange = removeTimeRange;
		// $scope.campaignData.fromHour = "1";
		// $scope.campaignData.fromMinute = "1";
		// $scope.campaignData.fromDaylightSaving = "0";
		// $scope.campaignData.toHour = "1";
		// $scope.campaignData.toMinute = "1";
		// $scope.campaignData.toDaylightSaving = "0";

		//intializing functions
		addTimeRange();
		loadAppList();
		loadSourceList();
		loadCampaignList();
		// $scope.countries = [countries];
		$scope.sources = [];
		$scope.apps = [];


		// Init simple DataTable, for more examples you can check out https://www.datatables.net/
		function initDataTableSimple() {
			jQuery('.js-dataTable-simple').dataTable({
				columnDefs: [{ orderable: false, targets: [-1] }],
				pageLength: 30,
				lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
				searching: false,
				order: [[0, "asc"]],
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
			$http({
				url: '/api/apps/',
				method: 'GET'
			}).then(
				function (res) {
					$scope.apps = res.data;
				},
				function (err) {
					toastr.error("Error in loading apps");
					console.log(err);
				}
			);
		}
		function loadCampaignList() {
			$http({
				url: '/api/campaigns/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.campaignList = res.data;
					
					//using angular timeout to digest view property otherwise it will give error
					$timeout(function () {
						if (!$scope.initializedTable) initDataTableSimple(); $scope.initializedTable = true
					}, 100);
				},
				function (err) {
					toastr.error("Error in loading campaigns");
					console.log(err);
				}
			);
		}
		function loadSourceList() {
			$http({
				url: '/api/sources/',
				method: 'GET',
			}).then(
				function (res) {
					$scope.sources = res.data;
				},
				function (err) {
					toastr.error("Error in loading sources");
					console.log(err);
				}
			);
		}

		function changeStatus(id, value) {
			value = Math.abs(value)
			console.log($scope.statusModels);
			$http({
				url: '/api/campaigns/' + id,
				method: 'PUT',
				data: { active: value },
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
		function duplicate(id) {
			console.log($scope.statusModels);
			$http({
				url: '/api/campaigns/' + id + '/duplicate/',
				method: 'POST',
			}).then(
				function (res) {
					loadCampaignList();
					console.log(res);
				},
				function (err) {
					alert("Something went wrong");
					console.log(err);
				}
			);
		}


		//delete app function input->id
		function deleteCampaign(id) {
			$http({
				url: '/api/campaigns/' + id,
				method: 'DELETE',
			}).then(
				function (res) {
					loadCampaignList();
					alert("deleted successfully")
				},
				function (err) {
					alert("Error in deletion");
					console.log(err);
				}
			);
		}

		//creating app
		function createCampaign() {
			try {
				let data = {
					name: $scope.campaignData.name,
					label: $scope.campaignData.label,
					collapsing: $scope.campaignData.collapsing,
					timezone: $scope.campaignData.timezone,
					autoReset: $scope.campaignData.autoReset,
					sendingLimit: $scope.campaignData.sendingLimit,
					countries: $scope.campaignData.countries,
					sources: $scope.campaignData.sources,
					apps: $scope.campaignData.apps,
					allDay: $scope.campaignData.allDay,
					advanceTargeting: $scope.campaignData.advanceTargeting,
					frequency: $scope.campaignData.frequency,
					crons: []
				};
				if ($scope.campaignData.allDay) {
					data.schedules = [];
					data.crons.push("*/" + $scope.campaignData.frequency + " * * * *")
				}
				else {
					data.schedules = $scope.campaignData.schedules;
					for (let schedule of $scope.campaignData.schedules) {
						let encodedVals = UtilsService.encodeCronJob(schedule.fromHour, schedule.fromMinute, schedule.fromDaylightSaving, schedule.toHour, schedule.toMinute, schedule.toDaylightSaving, $scope.campaignData.frequency)
						for(let val of encodedVals) {
							data.crons.push(val)
						}
					}
				}
				const method = $scope.isEditing ? 'PUT' : 'POST';
				const url = '/api/campaigns/' + ($scope.isEditing ? $scope.editingId : '');
				$http({
					url: url,
					method: method,
					data: data
				}).then(
					function (res) {
						$scope.isEditing=false
						loadCampaignList();
						alert("Sucess");
					},
					function (err) {
						alert("Error in saving data");
						console.log(err);
					}
				);
			}
			catch (err) {
				return alert("something went wrong");
			}
			// if (!$scope.isEditing) {
			// 	try {
			// 		data.status = 0;
			// 		$http({
			// 			url: '/api/campaigns/',
			// 			method: 'POST',
			// 			data: $httpParamSerializerJQLike(data),
			// 			headers: {
			// 				'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
			// 			}
			// 		}).then(
			// 			function (res) {
			// 				loadCampaignList();
			// 				alert("Sucess");
			// 			},
			// 			function (err) {
			// 				alert("Error in saving data");
			// 				console.log(err);
			// 			}
			// 		);
			// 	}
			// 	catch (err) {
			// 		console.log("here");
			// 		alert("something went wrong");
			// 	}
			// }
			// else {
			// 	$scope.isEditing = false;
			// 	try {
			// 		data.status = parseInt($scope.campaignData.status);
			// 		$http({
			// 			url: '/api/campaigns/' + $scope.editingId,
			// 			method: 'PUT',
			// 			data: $httpParamSerializerJQLike(data),
			// 			headers: {
			// 				'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
			// 			}
			// 		}).then(
			// 			function (res) {
			// 				loadCampaignList();
			// 				alert("Sucess");
			// 			},
			// 			function (err) {
			// 				alert("Error in saving data");
			// 				console.log(err);
			// 			}
			// 		);
			// 	}
			// 	catch (err) {
			// 		$scope.isEditing = false;
			// 		alert("something went wrong");
			// 	}
			// }
		}

		function enableEditing(data) {
			$scope.isEditing = true;
			$scope.editingId = data._id;
			Object.assign($scope.campaignData, JSON.parse(JSON.stringify(data)));
		}

		function range(num) {
			return new Array(num);
		}

		function getSources(id) {
			$http({
				url: '/api/sources/campaign-sources/' + id,
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.campaignData.sources = [];
					$timeout(function () {
						for (var i = 0; i < res.data.length; i++) {
							$scope.campaignData.sources.push(res.data[i][0].toString());
						}
					}, 0)
				},
				function (err) {
					alert("Error in sources data");
					console.log(err);
				}
			);
		}
		function getAllSources() {
			$http({
				url: '/api/sources/all-campaign-sources/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.campaignSourcesList = res.data;
				},
				function (err) {
					alert("Error in sources data");
					console.log(err);
				}
			);
		}
		function getApps(id) {
			$http({
				url: '/api/apps/' + id,
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.campaignData.apps = [];
					for (var i = 0; i < res.data.length; i++) {
						$scope.campaignData.apps.push(res.data[i][0].toString());
					}
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}
		function addTimeRange() {
			console.log("here");
			$scope.campaignData.schedules.push({
				fromHour: 0,
				fromMinute: 0,
				fromDaylightSaving: 0,
				toHour: 1,
				toMinute: 0,
				toDaylightSaving: 0
			})
		}
		function removeTimeRange(index) {
			$scope.campaignData.schedules.splice(index)
		}
		function parseDate(hours = 0, minutes = 0, daylightSaving = 0) {
			var date = new Date();
			date.setHours(hours + (12 * daylightSaving) % 24);
			date.setMinutes(minutes)
			return date;
		}
		$scope.selectionBlured = function (target, visibility) {
			$timeout(function () {
				if (document.activeElement.id != target) {
					$scope[visibility] = false;
				}
				else $scope[visibility] = true;
			}, 50)
		}
		
		$scope.timezones = moment.tz.names();
		$scope.countries = [
			{ "id": "AF", "label": "Afghanistan" },
			{ "id": "AX", "label": "Åland Islands" },
			{ "id": "AL", "label": "Albania" },
			{ "id": "DZ", "label": "Algeria" },
			{ "id": "AS", "label": "American Samoa" },
			{ "id": "AD", "label": "Andorra" },
			{ "id": "AO", "label": "Angola" },
			{ "id": "AI", "label": "Anguilla" },
			{ "id": "AQ", "label": "Antarctica" },
			{ "id": "AG", "label": "Antigua and Barbuda" },
			{ "id": "AR", "label": "Argentina" },
			{ "id": "AM", "label": "Armenia" },
			{ "id": "AW", "label": "Aruba" },
			{ "id": "AU", "label": "Australia" },
			{ "id": "AT", "label": "Austria" },
			{ "id": "AZ", "label": "Azerbaijan" },
			{ "id": "BS", "label": "Bahamas" },
			{ "id": "BH", "label": "Bahrain" },
			{ "id": "BD", "label": "Bangladesh" },
			{ "id": "BB", "label": "Barbados" },
			{ "id": "BY", "label": "Belarus" },
			{ "id": "BE", "label": "Belgium" },
			{ "id": "BZ", "label": "Belize" },
			{ "id": "BJ", "label": "Benin" },
			{ "id": "BM", "label": "Bermuda" },
			{ "id": "BT", "label": "Bhutan" },
			{ "id": "BO", "label": "Bolivia, Plurinational State of" },
			{ "id": "BQ", "label": "Bonaire, Sint Eustatius and Saba" },
			{ "id": "BA", "label": "Bosnia and Herzegovina" },
			{ "id": "BW", "label": "Botswana" },
			{ "id": "BV", "label": "Bouvet Island" },
			{ "id": "BR", "label": "Brazil" },
			{ "id": "IO", "label": "British Indian Ocean Territory" },
			{ "id": "BN", "label": "Brunei Darussalam" },
			{ "id": "BG", "label": "Bulgaria" },
			{ "id": "BF", "label": "Burkina Faso" },
			{ "id": "BI", "label": "Burundi" },
			{ "id": "KH", "label": "Cambodia" },
			{ "id": "CM", "label": "Cameroon" },
			{ "id": "CA", "label": "Canada" },
			{ "id": "CV", "label": "Cape Verde" },
			{ "id": "KY", "label": "Cayman Islands" },
			{ "id": "CF", "label": "Central African Republic" },
			{ "id": "TD", "label": "Chad" },
			{ "id": "CL", "label": "Chile" },
			{ "id": "CN", "label": "China" },
			{ "id": "CX", "label": "Christmas Island" },
			{ "id": "CC", "label": "Cocos (Keeling) Islands" },
			{ "id": "CO", "label": "Colombia" },
			{ "id": "KM", "label": "Comoros" },
			{ "id": "CG", "label": "Congo" },
			{ "id": "CD", "label": "Congo, the Democratic Republic of the" },
			{ "id": "CK", "label": "Cook Islands" },
			{ "id": "CR", "label": "Costa Rica" },
			{ "id": "CI", "label": "Côte d'Ivoire" },
			{ "id": "HR", "label": "Croatia" },
			{ "id": "CU", "label": "Cuba" },
			{ "id": "CW", "label": "Curaçao" },
			{ "id": "CY", "label": "Cyprus" },
			{ "id": "CZ", "label": "Czech Republic" },
			{ "id": "DK", "label": "Denmark" },
			{ "id": "DJ", "label": "Djibouti" },
			{ "id": "DM", "label": "Dominica" },
			{ "id": "DO", "label": "Dominican Republic" },
			{ "id": "EC", "label": "Ecuador" },
			{ "id": "EG", "label": "Egypt" },
			{ "id": "SV", "label": "El Salvador" },
			{ "id": "GQ", "label": "Equatorial Guinea" },
			{ "id": "ER", "label": "Eritrea" },
			{ "id": "EE", "label": "Estonia" },
			{ "id": "ET", "label": "Ethiopia" },
			{ "id": "FK", "label": "Falkland Islands (Malvinas)" },
			{ "id": "FO", "label": "Faroe Islands" },
			{ "id": "FJ", "label": "Fiji" },
			{ "id": "FI", "label": "Finland" },
			{ "id": "FR", "label": "France" },
			{ "id": "GF", "label": "French Guiana" },
			{ "id": "PF", "label": "French Polynesia" },
			{ "id": "TF", "label": "French Southern Territories" },
			{ "id": "GA", "label": "Gabon" },
			{ "id": "GM", "label": "Gambia" },
			{ "id": "GE", "label": "Georgia" },
			{ "id": "DE", "label": "Germany" },
			{ "id": "GH", "label": "Ghana" },
			{ "id": "GI", "label": "Gibraltar" },
			{ "id": "GR", "label": "Greece" },
			{ "id": "GL", "label": "Greenland" },
			{ "id": "GD", "label": "Grenada" },
			{ "id": "GP", "label": "Guadeloupe" },
			{ "id": "GU", "label": "Guam" },
			{ "id": "GT", "label": "Guatemala" },
			{ "id": "GG", "label": "Guernsey" },
			{ "id": "GN", "label": "Guinea" },
			{ "id": "GW", "label": "Guinea-Bissau" },
			{ "id": "GY", "label": "Guyana" },
			{ "id": "HT", "label": "Haiti" },
			{ "id": "HM", "label": "Heard Island and McDonald Islands" },
			{ "id": "VA", "label": "Holy See (Vatican City State)" },
			{ "id": "HN", "label": "Honduras" },
			{ "id": "HK", "label": "Hong Kong" },
			{ "id": "HU", "label": "Hungary" },
			{ "id": "IS", "label": "Iceland" },
			{ "id": "IN", "label": "India" },
			{ "id": "ID", "label": "Indonesia" },
			{ "id": "IR", "label": "Iran, Islamic Republic of" },
			{ "id": "IQ", "label": "Iraq" },
			{ "id": "IE", "label": "Ireland" },
			{ "id": "IM", "label": "Isle of Man" },
			{ "id": "IL", "label": "Israel" },
			{ "id": "IT", "label": "Italy" },
			{ "id": "JM", "label": "Jamaica" },
			{ "id": "JP", "label": "Japan" },
			{ "id": "JE", "label": "Jersey" },
			{ "id": "JO", "label": "Jordan" },
			{ "id": "KZ", "label": "Kazakhstan" },
			{ "id": "KE", "label": "Kenya" },
			{ "id": "KI", "label": "Kiribati" },
			{ "id": "KP", "label": "Korea, Democratic People's Republic of" },
			{ "id": "KR", "label": "Korea, Republic of" },
			{ "id": "KW", "label": "Kuwait" },
			{ "id": "KG", "label": "Kyrgyzstan" },
			{ "id": "LA", "label": "Lao People's Democratic Republic" },
			{ "id": "LV", "label": "Latvia" },
			{ "id": "LB", "label": "Lebanon" },
			{ "id": "LS", "label": "Lesotho" },
			{ "id": "LR", "label": "Liberia" },
			{ "id": "LY", "label": "Libya" },
			{ "id": "LI", "label": "Liechtenstein" },
			{ "id": "LT", "label": "Lithuania" },
			{ "id": "LU", "label": "Luxembourg" },
			{ "id": "MO", "label": "Macao" },
			{ "id": "MK", "label": "Macedonia, the former Yugoslav Republic of" },
			{ "id": "MG", "label": "Madagascar" },
			{ "id": "MW", "label": "Malawi" },
			{ "id": "MY", "label": "Malaysia" },
			{ "id": "MV", "label": "Maldives" },
			{ "id": "ML", "label": "Mali" },
			{ "id": "MT", "label": "Malta" },
			{ "id": "MH", "label": "Marshall Islands" },
			{ "id": "MQ", "label": "Martinique" },
			{ "id": "MR", "label": "Mauritania" },
			{ "id": "MU", "label": "Mauritius" },
			{ "id": "YT", "label": "Mayotte" },
			{ "id": "MX", "label": "Mexico" },
			{ "id": "FM", "label": "Micronesia, Federated States of" },
			{ "id": "MD", "label": "Moldova, Republic of" },
			{ "id": "MC", "label": "Monaco" },
			{ "id": "MN", "label": "Mongolia" },
			{ "id": "ME", "label": "Montenegro" },
			{ "id": "MS", "label": "Montserrat" },
			{ "id": "MA", "label": "Morocco" },
			{ "id": "MZ", "label": "Mozambique" },
			{ "id": "MM", "label": "Myanmar" },
			{ "id": "NA", "label": "Namibia" },
			{ "id": "NR", "label": "Nauru" },
			{ "id": "NP", "label": "Nepal" },
			{ "id": "NL", "label": "Netherlands" },
			{ "id": "NC", "label": "New Caledonia" },
			{ "id": "NZ", "label": "New Zealand" },
			{ "id": "NI", "label": "Nicaragua" },
			{ "id": "NE", "label": "Niger" },
			{ "id": "NG", "label": "Nigeria" },
			{ "id": "NU", "label": "Niue" },
			{ "id": "NF", "label": "Norfolk Island" },
			{ "id": "MP", "label": "Northern Mariana Islands" },
			{ "id": "NO", "label": "Norway" },
			{ "id": "OM", "label": "Oman" },
			{ "id": "PK", "label": "Pakistan" },
			{ "id": "PW", "label": "Palau" },
			{ "id": "PS", "label": "Palestinian Territory, Occupied" },
			{ "id": "PA", "label": "Panama" },
			{ "id": "PG", "label": "Papua New Guinea" },
			{ "id": "PY", "label": "Paraguay" },
			{ "id": "PE", "label": "Peru" },
			{ "id": "PH", "label": "Philippines" },
			{ "id": "PN", "label": "Pitcairn" },
			{ "id": "PL", "label": "Poland" },
			{ "id": "PT", "label": "Portugal" },
			{ "id": "PR", "label": "Puerto Rico" },
			{ "id": "QA", "label": "Qatar" },
			{ "id": "RE", "label": "Réunion" },
			{ "id": "RO", "label": "Romania" },
			{ "id": "RU", "label": "Russian Federation" },
			{ "id": "RW", "label": "Rwanda" },
			{ "id": "BL", "label": "Saint Barthélemy" },
			{ "id": "SH", "label": "Saint Helena, Ascension and Tristan da Cunha" },
			{ "id": "KN", "label": "Saint Kitts and Nevis" },
			{ "id": "LC", "label": "Saint Lucia" },
			{ "id": "MF", "label": "Saint Martin (French part)" },
			{ "id": "PM", "label": "Saint Pierre and Miquelon" },
			{ "id": "VC", "label": "Saint Vincent and the Grenadines" },
			{ "id": "WS", "label": "Samoa" },
			{ "id": "SM", "label": "San Marino" },
			{ "id": "ST", "label": "Sao Tome and Principe" },
			{ "id": "SA", "label": "Saudi Arabia" },
			{ "id": "SN", "label": "Senegal" },
			{ "id": "RS", "label": "Serbia" },
			{ "id": "SC", "label": "Seychelles" },
			{ "id": "SL", "label": "Sierra Leone" },
			{ "id": "SG", "label": "Singapore" },
			{ "id": "SX", "label": "Sint Maarten (Dutch part)" },
			{ "id": "SK", "label": "Slovakia" },
			{ "id": "SI", "label": "Slovenia" },
			{ "id": "SB", "label": "Solomon Islands" },
			{ "id": "SO", "label": "Somalia" },
			{ "id": "ZA", "label": "South Africa" },
			{ "id": "GS", "label": "South Georgia and the South Sandwich Islands" },
			{ "id": "SS", "label": "South Sudan" },
			{ "id": "ES", "label": "Spain" },
			{ "id": "LK", "label": "Sri Lanka" },
			{ "id": "SD", "label": "Sudan" },
			{ "id": "SR", "label": "Suriname" },
			{ "id": "SJ", "label": "Svalbard and Jan Mayen" },
			{ "id": "SZ", "label": "Swaziland" },
			{ "id": "SE", "label": "Sweden" },
			{ "id": "CH", "label": "Switzerland" },
			{ "id": "SY", "label": "Syrian Arab Republic" },
			{ "id": "TW", "label": "Taiwan, Province of China" },
			{ "id": "TJ", "label": "Tajikistan" },
			{ "id": "TZ", "label": "Tanzania, United Republic of" },
			{ "id": "TH", "label": "Thailand" },
			{ "id": "TL", "label": "Timor-Leste" },
			{ "id": "TG", "label": "Togo" },
			{ "id": "TK", "label": "Tokelau" },
			{ "id": "TO", "label": "Tonga" },
			{ "id": "TT", "label": "Trinidad and Tobago" },
			{ "id": "TN", "label": "Tunisia" },
			{ "id": "TR", "label": "Turkey" },
			{ "id": "TM", "label": "Turkmenistan" },
			{ "id": "TC", "label": "Turks and Caicos Islands" },
			{ "id": "TV", "label": "Tuvalu" },
			{ "id": "UG", "label": "Uganda" },
			{ "id": "UA", "label": "Ukraine" },
			{ "id": "AE", "label": "United Arab Emirates" },
			{ "id": "GB", "label": "United Kingdom" },
			{ "id": "US", "label": "United States" },
			{ "id": "UM", "label": "United States Minor Outlying Islands" },
			{ "id": "UY", "label": "Uruguay" },
			{ "id": "UZ", "label": "Uzbekistan" },
			{ "id": "VU", "label": "Vanuatu" },
			{ "id": "VE", "label": "Venezuela, Bolivarian Republic of" },
			{ "id": "VN", "label": "Viet Nam" },
			{ "id": "VG", "label": "Virgin Islands, British" },
			{ "id": "VI", "label": "Virgin Islands, U.S." },
			{ "id": "WF", "label": "Wallis and Futuna" },
			{ "id": "EH", "label": "Western Sahara" },
			{ "id": "YE", "label": "Yemen" },
			{ "id": "ZM", "label": "Zambia" },
			{ "id": "ZW", "label": "Zimbabwe" }
		]
	}
]);