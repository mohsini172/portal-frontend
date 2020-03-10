/*
 *  Document   : app.js
 *  Author     : pixelcave
 *  Description: Setting up and vital functionality for our App
 *
 */
//when we're accessing /some-name/our-app it will be problematic
let sublocation = window.location.pathname.split("/");
sublocation.splice(-1, 1)
const base_href = sublocation.join("/");

// Create our angular module
var App = angular.module('app', [
	'ngStorage',
	'ui.router',
	'ui.bootstrap',
	'oc.lazyLoad',
	'ui.sortable',
	"chart.js"
]);

// Enabling the cors
App.config(function ($httpProvider) {
	//Enable cross domain calls
	$httpProvider.defaults.useXDomain = true;

	//Remove the header used to identify ajax call  that would prevent CORS from working
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Router configuration
App.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/campaign');
		$httpProvider.interceptors.push(apiInterceptor);
		$stateProvider
			.state('campaign', {
				url: '/campaign',
				templateUrl: 'assets/views/campaign.html',
				controller: 'CampaignCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/angularjs-dropdown-multiselect.min.js',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/campaign.controller.js',
								'assets/js/common/utils.service.js'
							]
						});
					}]
				}
			})
			.state('campaignGroups', {
				url: '/campaign/groups/:id',
				templateUrl: 'assets/views/campaign-groups.html',
				controller: 'CampaignGroupsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/campaign-groups.controller.js'
							]
						});
					}]
				}
			})
			.state('messages', {
				url: '/messages/:id',
				templateUrl: 'assets/views/messages.html',
				controller: 'MessagesCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/messages.controller.js'
							]
						});
					}]
				}
			})
			.state('groups', {
				url: '/groups',
				templateUrl: 'assets/views/groups.html',
				controller: 'GroupsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/groups.controller.js'
							]
						});
					}]
				}
			})
			.state('sources', {
				url: '/sources',
				templateUrl: 'assets/views/sources.html',
				controller: 'SourcesCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/sources.controller.js'
							]
						});
					}]
				}
			})
			.state('apps', {
				url: '/apps',
				templateUrl: 'assets/views/apps.html',
				controller: 'AppsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/apps.controller.js'
							]
						});
					}]
				}
			})
			.state('reports', {
				url: '/reports',
				templateUrl: 'assets/views/reports.html',
				controller: 'ReportsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/controllers/reports.controller.js',
								'assets/js/components/apps-report/apps-report.component.js',
								'assets/js/components/daily-report/daily-report.component.js',
								'assets/js/components/countries-report/countries-report.component.js',
								'assets/js/components/categories-report/categories-report.component.js',
								'assets/js/common/report.service.js',
							]
						});
					}]
				}
			})
			.state('media', {
				url: '/media',
				templateUrl: 'assets/views/media.html',
				controller: 'MediaCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables-checkbox/dataTables.checkboxes.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/plugins/datatables-checkbox/dataTables.checkboxes.min.js',
								'assets/js/controllers/media.controller.js',

							]
						});
					}]
				}
			})
			.state('mediaGroups', {
				url: '/media-groups/:id/:title/:type',
				templateUrl: 'assets/views/media-groups.html',
				controller: 'MediaGroupsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#css-bootstrap',
							serie: true,
							files: [
								'assets/js/plugins/datatables/jquery.dataTables.min.css',
								'assets/js/plugins/datatables/jquery.dataTables.min.js',
								'assets/js/plugins/datatables-checkbox/dataTables.checkboxes.css',
								'assets/js/plugins/datatables-checkbox/dataTables.checkboxes.min.js',
								'assets/js/controllers/media-groups.controller.js'
							]
						});
					}]
				}
			})
	}
]);

// Tooltips and Popovers configuration
App.config(['$uibTooltipProvider',
	function ($uibTooltipProvider) {
		$uibTooltipProvider.options({
			appendToBody: true
		});
	}
]);

// Custom UI helper functions
App.factory('uiHelpers', function () {
	return {
		// Handles active color theme
		uiHandleColorTheme: function (themeName) {
			var colorTheme = jQuery('#css-theme');

			if (themeName) {
				if (colorTheme.length && (colorTheme.prop('href') !== 'assets/css/themes/' + themeName + '.min.css')) {
					jQuery('#css-theme').prop('href', 'assets/css/themes/' + themeName + '.min.css');
				} else if (!colorTheme.length) {
					jQuery('#css-main').after('<link rel="stylesheet" id="css-theme" href="assets/css/themes/' + themeName + '.min.css">');
				}
			} else {
				if (colorTheme.length) {
					colorTheme.remove();
				}
			}
		},
		// Handles #main-container height resize to push footer to the bottom of the page
		uiHandleMain: function () {
			var lMain = jQuery('#main-container');
			var hWindow = jQuery(window).height();
			var hHeader = jQuery('#header-navbar').outerHeight();
			var hFooter = jQuery('#page-footer').outerHeight();

			if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
				lMain.css('min-height', hWindow - hFooter);
			} else {
				lMain.css('min-height', hWindow - (hHeader + hFooter));
			}
		},
		// Handles transparent header functionality (solid on scroll - used in frontend pages)
		uiHandleHeader: function () {
			var lPage = jQuery('#page-container');

			if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
				jQuery(window).on('scroll', function () {
					if (jQuery(this).scrollTop() > 20) {
						lPage.addClass('header-navbar-scroll');
					} else {
						lPage.removeClass('header-navbar-scroll');
					}
				});
			}
		},
		// Handles sidebar and side overlay custom scrolling functionality
		uiHandleScroll: function (mode) {
			var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var lPage = jQuery('#page-container');
			var lSidebar = jQuery('#sidebar');
			var lSidebarScroll = jQuery('#sidebar-scroll');
			var lSideOverlay = jQuery('#side-overlay');
			var lSideOverlayScroll = jQuery('#side-overlay-scroll');

			// Init scrolling
			if (mode === 'init') {
				// Init scrolling only if required the first time
				uiHandleScroll();
			} else {
				// If screen width is greater than 991 pixels and .side-scroll is added to #page-container
				if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
					// If sidebar exists
					if (lSidebar.length) {
						// Turn sidebar's scroll lock off (slimScroll will take care of it)
						jQuery(lSidebar).scrollLock('disable');

						// If sidebar scrolling does not exist init it..
						if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
							lSidebarScroll.slimScroll({
								height: lSidebar.outerHeight(),
								color: '#fff',
								size: '5px',
								opacity: .35,
								wheelStep: 15,
								distance: '2px',
								railVisible: false,
								railOpacity: 1
							});
						}
						else { // ..else resize scrolling height
							lSidebarScroll
								.add(lSidebarScroll.parent())
								.css('height', lSidebar.outerHeight());
						}
					}

					// If side overlay exists
					if (lSideOverlay.length) {
						// Turn side overlay's scroll lock off (slimScroll will take care of it)
						jQuery(lSideOverlay).scrollLock('disable');

						// If side overlay scrolling does not exist init it..
						if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
							lSideOverlayScroll.slimScroll({
								height: lSideOverlay.outerHeight(),
								color: '#000',
								size: '5px',
								opacity: .35,
								wheelStep: 15,
								distance: '2px',
								railVisible: false,
								railOpacity: 1
							});
						}
						else { // ..else resize scrolling height
							lSideOverlayScroll
								.add(lSideOverlayScroll.parent())
								.css('height', lSideOverlay.outerHeight());
						}
					}
				} else {
					// If sidebar exists
					if (lSidebar.length) {
						// If sidebar scrolling exists destroy it..
						if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
							lSidebarScroll
								.slimScroll({ destroy: true });
							lSidebarScroll
								.attr('style', '');
						}

						// Turn sidebars's scroll lock on
						jQuery(lSidebar).scrollLock('enable');
					}

					// If side overlay exists
					if (lSideOverlay.length) {
						// If side overlay scrolling exists destroy it..
						if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
							lSideOverlayScroll
								.slimScroll({ destroy: true });
							lSideOverlayScroll
								.attr('style', '');
						}

						// Turn side overlay's scroll lock on
						jQuery(lSideOverlay).scrollLock('enable');
					}
				}
			}
		},
		// Handles page loader functionality
		uiLoader: function (mode) {
			var lBody = jQuery('body');
			var lpageLoader = jQuery('#page-loader');

			if (mode === 'show') {
				if (lpageLoader.length) {
					lpageLoader.fadeIn(250);
				} else {
					lBody.prepend('<div id="page-loader"></div>');
				}
			} else if (mode === 'hide') {
				if (lpageLoader.length) {
					lpageLoader.fadeOut(250);
				}
			}
		},
		// Handles blocks API functionality
		uiBlocks: function (block, mode, button) {
			// Set default icons for fullscreen and content toggle buttons
			var iconFullscreen = 'si si-size-fullscreen';
			var iconFullscreenActive = 'si si-size-actual';
			var iconContent = 'si si-arrow-up';
			var iconContentActive = 'si si-arrow-down';

			if (mode === 'init') {
				// Auto add the default toggle icons
				switch (button.data('action')) {
					case 'fullscreen_toggle':
						button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
						break;
					case 'content_toggle':
						button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
						break;
					default:
						return false;
				}
			} else {
				// Get block element
				var elBlock = (block instanceof jQuery) ? block : jQuery(block);

				// If element exists, procceed with blocks functionality
				if (elBlock.length) {
					// Get block option buttons if exist (need them to update their icons)
					var btnFullscreen = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
					var btnToggle = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

					// Mode selection
					switch (mode) {
						case 'fullscreen_toggle':
							elBlock.toggleClass('block-opt-fullscreen');

							// Enable/disable scroll lock to block
							if (elBlock.hasClass('block-opt-fullscreen')) {
								jQuery(elBlock).scrollLock('enable');
							} else {
								jQuery(elBlock).scrollLock('disable');
							}

							// Update block option icon
							if (btnFullscreen.length) {
								if (elBlock.hasClass('block-opt-fullscreen')) {
									jQuery('i', btnFullscreen)
										.removeClass(iconFullscreen)
										.addClass(iconFullscreenActive);
								} else {
									jQuery('i', btnFullscreen)
										.removeClass(iconFullscreenActive)
										.addClass(iconFullscreen);
								}
							}
							break;
						case 'fullscreen_on':
							elBlock.addClass('block-opt-fullscreen');

							// Enable scroll lock to block
							jQuery(elBlock).scrollLock('enable');

							// Update block option icon
							if (btnFullscreen.length) {
								jQuery('i', btnFullscreen)
									.removeClass(iconFullscreen)
									.addClass(iconFullscreenActive);
							}
							break;
						case 'fullscreen_off':
							elBlock.removeClass('block-opt-fullscreen');

							// Disable scroll lock to block
							jQuery(elBlock).scrollLock('disable');

							// Update block option icon
							if (btnFullscreen.length) {
								jQuery('i', btnFullscreen)
									.removeClass(iconFullscreenActive)
									.addClass(iconFullscreen);
							}
							break;
						case 'content_toggle':
							elBlock.toggleClass('block-opt-hidden');

							// Update block option icon
							if (btnToggle.length) {
								if (elBlock.hasClass('block-opt-hidden')) {
									jQuery('i', btnToggle)
										.removeClass(iconContent)
										.addClass(iconContentActive);
								} else {
									jQuery('i', btnToggle)
										.removeClass(iconContentActive)
										.addClass(iconContent);
								}
							}
							break;
						case 'content_hide':
							elBlock.addClass('block-opt-hidden');

							// Update block option icon
							if (btnToggle.length) {
								jQuery('i', btnToggle)
									.removeClass(iconContent)
									.addClass(iconContentActive);
							}
							break;
						case 'content_show':
							elBlock.removeClass('block-opt-hidden');

							// Update block option icon
							if (btnToggle.length) {
								jQuery('i', btnToggle)
									.removeClass(iconContentActive)
									.addClass(iconContent);
							}
							break;
						case 'refresh_toggle':
							elBlock.toggleClass('block-opt-refresh');

							// Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
							if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
								setTimeout(function () {
									elBlock.removeClass('block-opt-refresh');
								}, 2000);
							}
							break;
						case 'state_loading':
							elBlock.addClass('block-opt-refresh');
							break;
						case 'state_normal':
							elBlock.removeClass('block-opt-refresh');
							break;
						case 'close':
							elBlock.hide();
							break;
						case 'open':
							elBlock.show();
							break;
						default:
							return false;
					}
				}
			}
		}
	};
});

// Run our App
App.run(function ($rootScope, uiHelpers) {
	// Access uiHelpers easily from all controllers
	$rootScope.helpers = uiHelpers;
	$rootScope.apiUrl = "http://localhost:8000"

	// On window resize or orientation change resize #main-container & Handle scrolling
	var resizeTimeout;

	jQuery(window).on('resize orientationchange', function () {
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(function () {
			$rootScope.helpers.uiHandleScroll();
			$rootScope.helpers.uiHandleMain();
		}, 150);
	});
});

// Application Main Controller
App.controller('AppCtrl', ['$scope', '$localStorage', '$window', '$http', '$rootScope',
	function ($scope, $localStorage, $window, $http, $rootScope) {
		// Template Settings
		$scope.oneui = {
			version: '3.4', // Template version
			localStorage: false, // Enable/Disable local storage
			settings: {
				activeColorTheme: false, // Set a color theme of your choice, available: 'amethyst', 'city, 'flat', 'modern' and 'smooth'
				sidebarLeft: true, // true: Left Sidebar and right Side Overlay, false: Right Sidebar and left Side Overlay
				sidebarOpen: true, // Visible Sidebar by default (> 991px)
				sidebarOpenXs: false, // Visible Sidebar by default (< 992px)
				sidebarMini: false, // Mini hoverable Sidebar (> 991px)
				sideOverlayOpen: false, // Visible Side Overlay by default (> 991px)
				sideOverlayHover: false, // Hoverable Side Overlay (> 991px)
				sideScroll: true, // Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (> 991px)
				headerFixed: true // Enables fixed header
			}
		};

		// If local storage setting is enabled
		if ($scope.oneui.localStorage) {
			// Save/Restore local storage settings
			if ($scope.oneui.localStorage) {
				if (angular.isDefined($localStorage.oneuiSettings)) {
					$scope.oneui.settings = $localStorage.oneuiSettings;
				} else {
					$localStorage.oneuiSettings = $scope.oneui.settings;
				}
			}

			// Watch for settings changes
			$scope.$watch('oneui.settings', function () {
				// If settings are changed then save them to localstorage
				$localStorage.oneuiSettings = $scope.oneui.settings;
			}, true);
		}

		// Watch for activeColorTheme variable update
		$scope.$watch('oneui.settings.activeColorTheme', function () {
			// Handle Color Theme
			$scope.helpers.uiHandleColorTheme($scope.oneui.settings.activeColorTheme);
		}, true);

		// Watch for sideScroll variable update
		$scope.$watch('oneui.settings.sideScroll', function () {
			// Handle Scrolling
			setTimeout(function () {
				$scope.helpers.uiHandleScroll();
			}, 150);
		}, true);

		// When view content is loaded
		$scope.$on('$viewContentLoaded', function () {
			// Hide page loader
			$scope.helpers.uiLoader('hide');

			// Resize #main-container
			$scope.helpers.uiHandleMain();
		});
		$scope.authenticated = false;
		$scope.invalidLoginCredentials = false;
		let token = localStorage.getItem('token');
		if (token) {
			token = JSON.parse(token);
			const expiry = new Date(token.expiry);
			if (expiry > new Date()){
				$scope.authenticated = true;
				$rootScope.token = token;
			}
		}
		$scope.loginModel = {
			username: "",
			password: ""
		}
		$scope.authenticate = function () {
			$scope.invalidLoginCredentials = false;
			$http.post('/api/auth/login', $scope.loginModel).then(function (res) {
				let token = res.data;
				localStorage.setItem('token', JSON.stringify(token));
				$rootScope.token = token;
				$scope.authenticated = true;
			})
				.catch(function (error) {
					console.error(error);
					$scope.invalidLoginCredentials = true;
				})
		}
		$scope.logout = function() {
			$rootScope.token = undefined;
			$scope.authenticated = false;
			localStorage.removeItem('token')
		}
	}
]);


/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
App.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window',
	function ($scope, $localStorage, $window) {
		// When view content is loaded
		$scope.$on('$includeContentLoaded', function () {
			// Handle Scrolling
			$scope.helpers.uiHandleScroll();
		});
	}
]);

// Sidebar Controller
App.controller('SidebarCtrl', ['$scope', '$localStorage', '$window', '$location',
	function ($scope, $localStorage, $window, $location) {
		// When view content is loaded
		$scope.$on('$includeContentLoaded', function () {
			// Handle Scrolling
			$scope.helpers.uiHandleScroll();

			// Get current path to use it for adding active classes to our submenus
			$scope.path = $location.path();
		});
	}
]);

// Header Controller
App.controller('HeaderCtrl', ['$scope', '$localStorage', '$window',
	function ($scope, $localStorage, $window) {
		// When view content is loaded
		$scope.$on('$includeContentLoaded', function () {
			// Transparent header functionality
			$scope.helpers.uiHandleHeader();
		});
	}
]);



function apiInterceptor($q, $rootScope) {
	return {
		request: function (config) {
			config.headers.Authorization = ($rootScope.token) ? ("Token " + $rootScope.token.jwt) : "";
			var url = config.url;
			// ignore template requests
			if (url.substr(url.length - 5) == '.html') {
				return config || $q.when(config);
			}
			if (config.url.indexOf('/api/') == 0) {
				config.url = config.url.replace('/api/', 'https://pushrev.site/portal_dev/api/v0.2/')

				return config || $q.when(config);
			}
			return config || $q.when(config);
		}
	}
}