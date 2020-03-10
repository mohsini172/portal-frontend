angular.module('app').controller('MessagesCtrl', ['$scope', '$location', '$localStorage', '$window', '$http', '$timeout', '$httpParamSerializerJQLike', '$stateParams',
	function ($scope, $location, $localStorage, $window, $http, $timeout, $httpParamSerializerJQLike, $stateParams) {

		$scope.campaignName = $location.search()['campaign-title']
		$scope.campaignId = $location.search()['campaign-id']
		$scope.groupName = $location.search()['group-title']

		//initializing variables
		$scope.messages = [];
		$scope.messagesView = [];
		$scope.mediaGroups = [];
		$scope.media = [];
		$scope.messageData = {};
		$scope.messageData.batch = {};
		$scope.deleteMessage = deleteMessage;
		$scope.createMessage = createMessage;
		$scope.groupId = $stateParams.id;
		$scope.changeStatus = changeStatus;
		$scope.statusModels = [];
		$scope.isEditing = false;
		$scope.singleForm = 'yes';
		$scope.enableEditing = enableEditing;
		$scope.editingId = null;
		$scope.cachedGroupNames = {};
		$scope.selectedToTranslate = {};
		$scope.setTranslationId = setTranslationId;
		$scope.translate = translate;
		$scope.saveTranslations = saveTranslations;

		//intializing functions
		resetTranslations();
		loadMessagesList();
		loadMediaGroupsList();
		loadMediaList();



		// Reset translation object
		function resetTranslations() {
			$scope.translations = {
				headlines: {
					en: "",
					ar: "",
					fr: "",
					de: "",
					it: "",
					ru: "",
					es: "",
					tr: "",
					zh: "",
					cs: "",
					da: "",
					nl: "",
					fi: "",
					he: "",
					id: "",
					ja: "",
					ko: "",
					pl: "",
					pt: "",
					sv: ""
				},
				messages: {
					en: "",
					ar: "",
					fr: "",
					de: "",
					it: "",
					ru: "",
					es: "",
					tr: "",
					zh: "",
					cs: "",
					da: "",
					nl: "",
					fi: "",
					he: "",
					id: "",
					ja: "",
					ko: "",
					pl: "",
					pt: "",
					sv: ""
				}
			}
		}
		// Init simple DataTable, for more examples you can check out https://www.datatables.net/
		function initDataTableSimple() {
			jQuery('.js-dataTable-simple').dataTable({
				columnDefs: [{
					orderable: false,
					targets: [3]
				}],
				pageLength: 30,
				lengthMenu: [
					[5, 10, 15, 20],
					[5, 10, 15, 20]
				],
				searching: false,
				oLanguage: {
					sLengthMenu: ""
				},
				dom: "<'row'<'col-sm-12'tr>>" +
					"<'row pb-20'<'col-sm-6'i><'col-sm-6'p>>"
			});
		};
		//loads the list of apps from database
		function loadMessagesList() {
			$http({
				url: '/api/groups/' + $scope.groupId + '/messages/',
				method: 'GET'
			}).then(
				function (res) {
					$scope.messages = res.data;
					for (var i in $scope.messages) {
						const message = $scope.messages[i];
						if (!message.batch.enabled) {
							if (
								message.headlines &&
								message.headlines[0] &&
								message.headlines[0].content &&
								message.headlines[0].content[0]
							) {
								message.batch.name = message.headlines[0].content[0];
							}
							if (
								message.messages &&
								message.messages[0] &&
								message.messages[0].content &&
								message.messages[0].content[0]
							) {
								message.batch.description = message.messages[0].content[0];
							}
						}
					}
					//using angular timeout to digest view property otherwise it will give error
					$timeout(function () {
						if (!$scope.initializedTable) initDataTableSimple();
						$scope.initializedTable = true
					}, 100);
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}

		function setTranslationId(message) {
			resetTranslations();
			$scope.selectedToTranslate = message;
			try {
				$scope.singleForm = message.batch.enabled ? 'no' : 'yes';
				for (let headline of message.headlines) {
					if (headline.language == 'en')
						continue;
					$scope.translations.headlines[headline.language] = headline.content.join('\n');
				}
				for (let iterator of message.messages) {
					if (iterator.language == 'en')
						continue;
					$scope.translations.messages[iterator.language] = iterator.content.join('\n');
				}
			} catch (ex) {
				console.log(ex)
			}
		}
		function translate() {
			try {
				const headlines = $scope.selectedToTranslate.headlines[0].content.join('\n');
				const messages = $scope.selectedToTranslate.messages[0].content.join('\n');
				$http({
					url: '/api/s3/translate/',
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain' // Note the appropriate header
					},
					data: headlines
				}).then(
					function (res) {
						$scope.translations.headlines.en = res.data.en;
						$scope.translations.headlines.ar = res.data.ar;
						$scope.translations.headlines.fr = res.data.fr;
						$scope.translations.headlines.de = res.data.de;
						$scope.translations.headlines.it = res.data.it;
						$scope.translations.headlines.ru = res.data.ru;
						$scope.translations.headlines.es = res.data.es;
						$scope.translations.headlines.tr = res.data.tr;
						$scope.translations.headlines.zh = res.data.zh;
						$scope.translations.headlines.cs = res.data.cs;
						$scope.translations.headlines.da = res.data.da;
						$scope.translations.headlines.nl = res.data.nl;
						$scope.translations.headlines.fi = res.data.fi;
						$scope.translations.headlines.he = res.data.he;
						$scope.translations.headlines.id = res.data.id;
						$scope.translations.headlines.ja = res.data.ja;
						$scope.translations.headlines.ko = res.data.ko;
						$scope.translations.headlines.pl = res.data.pl;
						$scope.translations.headlines.pt = res.data.pt;
						$scope.translations.headlines.sv = res.data.sv;
					},
					function (err) {
						alert("Error in translating");
						console.log(err);
					}
				);
				$http({
					url: '/api/s3/translate/',
					method: 'POST',
					data: messages,
					headers: {
						'Content-Type': 'text/plain' // Note the appropriate header
					}
				}).then(
					function (res) {
						$scope.translations.messages.en = res.data.en;
						$scope.translations.messages.ar = res.data.ar;
						$scope.translations.messages.fr = res.data.fr;
						$scope.translations.messages.de = res.data.de;
						$scope.translations.messages.it = res.data.it;
						$scope.translations.messages.ru = res.data.ru;
						$scope.translations.messages.es = res.data.es;
						$scope.translations.messages.tr = res.data.tr;
						$scope.translations.messages.zh = res.data.zh;
						$scope.translations.messages.cs = res.data.cs;
						$scope.translations.messages.da = res.data.da;
						$scope.translations.messages.nl = res.data.nl;
						$scope.translations.messages.fi = res.data.fi;
						$scope.translations.messages.he = res.data.he;
						$scope.translations.messages.id = res.data.id;
						$scope.translations.messages.ja = res.data.ja;
						$scope.translations.messages.ko = res.data.ko;
						$scope.translations.messages.pl = res.data.pl;
						$scope.translations.messages.pt = res.data.pt;
						$scope.translations.messages.sv = res.data.sv;
					},
					function (err) {
						alert("Error in translating");
						console.log(err);
					}
				);
			}
			catch{
				return console.log("error in parsing");
			}
		}

		function loadMediaList() {
			$http({
				url: '/api/s3/aws-files',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.media = res.data;
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}

		function loadMediaGroupsList() {
			$http({
				url: '/api/media-groups/',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
				}
			}).then(
				function (res) {
					$scope.mediaGroups = res.data;
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}

		function changeStatus(id, value) {
			value = Math.abs(value)
			console.log($scope.statusModels);
			$http({
				url: '/api/groups/' + $scope.groupId + '/messages/' + id,
				method: 'PUT',
				data: {
					active: value
				}
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

		//delete app function input->id
		function deleteMessage(id) {
			$http({
				url: '/api/groups/' + $scope.groupId + '/messages/' + id,
				method: 'DELETE'
			}).then(
				function (res) {
					loadMessagesList();
					alert("deleted successfully")
				},
				function (err) {
					alert("Error in deletion");
					console.log(err);
				}
			);
		}

		//creating app
		function createMessage() {
			let formData = JSON.parse(JSON.stringify($scope.messageData));
			let payload = {
				headlines: { language: 'en', content: removeEmptyFromString($scope.messageData.headline.split('\n')) },
				messages: { language: 'en', content: removeEmptyFromString($scope.messageData.message.split('\n')) },
				batch: {
					enabled: $scope.singleForm != 'yes',
					name: $scope.messageData.batchName,
					description: $scope.messageData.batchDesc
				},
				icon: null,
				image: null,
				badge: null,
				active: true,
				path: $scope.messageData.path || null
			}
			if (formData.icon && formData.icon.indexOf("group-") >= 0) {
				payload.icon = {
					isGroup: true,
					id: formData.icon.split("group-")[1],
					reference: formData.icon.split("group-")[1]
				};
			} else {
				payload.icon = { isGroup: false, id: formData.icon };
			}
			if (formData.image && formData.image.indexOf("group-") >= 0) {
				payload.image = {
					isGroup: true,
					id: formData.image.split("group-")[1],
					reference: formData.image.split("group-")[1]
				};
			} else if (formData.image != "null") {
				payload.image = { isGroup: false, id: formData.image };
			}
			if (formData.badge && formData.badge.indexOf("group-") >= 0) {
				payload.badge = {
					isGroup: true,
					id: formData.badge.split("group-")[1],
					reference: formData.badge.split("group-")[1]
				};
			} else {
				payload.badge = { isGroup: false, id: formData.badge };
			}
			const method = $scope.isEditing ? 'PUT' : 'POST';
			const url = $scope.isEditing
				? '/api/groups/' + $scope.groupId + '/messages/' + $scope.editingId
				: '/api/groups/' + $scope.groupId + '/messages/';

			$http({
				url: url,
				method: method,
				data: payload
			}).then(
				function (res) {
					loadMessagesList();
					alert("Sucess");
				},
				function (err) {
					alert("Error in loading data");
					console.log(err);
				}
			);
		}

		function getGroupId(groupName) {
			for (let i = 0; i < $scope.mediaGroups.length; i++) {
				if ($scope.mediaGroups[i][1] && $scope.mediaGroups[i][1] == groupName) {
					return $scope.mediaGroups[i][0];
				}
			}
			return null;
		}

		function enableEditing(data) {
			$scope.isEditing = true;
			$scope.editingId = data._id;
			$scope.messageData = JSON.parse(JSON.stringify(data))
			$scope.singleForm = data.batch.enabled ? 'no' : 'yes';
			$scope.messageData.id = data._id;
			$scope.messageData.batchName = data.batch.name;
			$scope.messageData.batchDesc = data.batch.description;
			$scope.messageData.headline = data.headlines[0].content.join('\n');
			$scope.messageData.message = data.messages[0].content.join('\n');
			// To be on safe side
			data.image = data.image ? data.image : {};
			$scope.messageData.icon = data.icon.isGroup ? 'group-' + data.icon.id : data.icon.id;
			$scope.messageData.image = data.image.isGroup ? 'group-' + data.image.id : data.image.id;
			$scope.messageData.badge = data.badge.isGroup ? 'group-' + data.badge.id : data.badge.id;
			// $scope.messageData.active = data[9];
			// $scope.messageData.badgeId = data[10];
			// $scope.messageData.path = data[12];
		}
		function removeEmptyFromString(arr) {
			let result = [];
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] != "") {
					result.push(arr[i])
				}
			}
			return result;
		}
		function saveTranslations() {
			let payload = {
				headlines: [],
				messages: []
			}
			for (let i in $scope.translations.headlines) {
				payload.headlines.push({
					language: i,
					content: removeEmptyFromString($scope.translations.headlines[i].split('\n'))
				});
			}

			for (let i in $scope.translations.messages) {
				payload.messages.push({
					language: i,
					content: removeEmptyFromString($scope.translations.messages[i].split('\n'))
				});
			}
			console.log(payload);
			$http({
				url: '/api/groups/' + $scope.groupId + '/messages/' + $scope.selectedToTranslate._id,
				method: 'PUT',
				data: payload
			}).then(
				function (res) {
					loadMessagesList();
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