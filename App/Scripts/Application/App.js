"use strict";
angular.module("NOTICE", ["ui.router", "NOTICE.controllers", "NOTICE.services"])
.config(["$stateProvider", "$urlRouterProvider","$httpProvider", function ($stateProvider, $urlRouterProvider,$httpProvider) {
    $stateProvider
        .state('NOTICE', {
            url: '/',
            views: {
                'header':{
                    templateUrl: "/App/Templates/header.html",
                    controller: "HeaderController",
                    resolve: {
                        template: function () {
                            return { 
                                passwordModal: "/App/Templates/Modal/changePassword.html"
                            }
                            
                        }
                    }
                },
                'content': {
                    templateUrl: "/App/Templates/notice.html",
                    controller: "LandingPageController",
                    resolve: {
                        sections: ['cacheService', function (cacheService) {
                            return cacheService.getSections();
                        }]
                    }
                },
                'footer': {
                    templateUrl: "/App/Templates/footer.html"
                }
            }
        })
        .state('NOTICE.login', {
            url: 'login',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/login.html",
                    controller: "LoginController"
                }
            }
        })
        .state('NOTICE.settings', {
            url: 'settings',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/settings.html",
                    controller: "SettingsController"
                }
            }
        })
        .state('NOTICE.attendance', {
            url: 'attendance',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/attendance.html",
                    controller: "AttendanceController",
                    resolve: {
                        subjects: ['cacheService', function (cacheService) {
                            return cacheService.getSubjects();
                        }],
                        sections: ['cacheService', function (cacheService) {
                            return cacheService.getSections();
                        }],
                    }
                }
            }
        })
        .state('NOTICE.report', {
            url: 'report',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/report.html",
                    controller: "ReportController",
                    resolve: {
                        sections: ['cacheService', function (cacheService) {
                            return cacheService.getSections();
                        }]
                    }
                }
            }
        })
        .state('NOTICE.students', {
            url: 'students',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/students.html",
                    controller: "StudentsController",
                    resolve: {
                        tabs: function(){
                            return [
                                { title: "Sections", template: "/App/Templates/section.html"},
                                { title: "Subjects", template: "/App/Templates/subject.html"},
                                { title: "Students", template: "/App/Templates/student-list.html"}
                            ]
                        },
                        templates: function () {
                            return {
                                addSectionModal: '/App/Templates/Modal/addSection.html',
                                addSubjectModal: '/App/Templates/Modal/addSubject.html',
                                addStudentModal: '/App/Templates/Modal/addStudent.html'
                            }
                        },
                       
                        sections: ['cacheService', function (cacheService) {
                            return cacheService.getSections();
                        }]                      
                    }
                }
            }
        })
        .state('NOTICE.users', {
            url: 'users',
            views: {
                'content@': {
                    templateUrl: "/App/Templates/users.html",
                    controller: "UserController",
                    resolve: {
                        template: function () {
                            return {
                                userModal: "/App/Templates/Modal/addUser.html"
                            }

                        }
                    }
                }
            }
        })
        
    $urlRouterProvider.otherwise("/");



    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var token = $localStorage.get('token', '');
                if(token !== '')
                    config.headers.Authorization = 'Bearer ' + $localStorage.get('token', '');
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $localStorage.store('token', '');
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
}])

.run(["$rootScope", "$localStorage", "$location", function ($rootScope, $localStorage, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState, fromState) {
        $rootScope.isLogin = false;
        var token = $localStorage.get('token', '');
        if (token === '') {
            $location.path("/login");
            $rootScope.isLogin = true;
        }
    })


    //Toaster
    window.Application = window.Application || {};

    $(document).on('click', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
            $(this).collapse('hide');
        }
    });

    window.Application.toast = (function ($, toastr) {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "500",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        $(document).on("showToast", function (e, data) {
            var m = data.message;
            switch (data.type) {
                case "error":
                    toastr.error(m);
                    return;
                case "success":
                    toastr.success(m);
                    return;
                case "warning":
                    toastr.warning(m);
                    return;
            }
        });

        var showToast = function (type, message) {
            $(document).trigger("showToast", { type: type, message: message });
        };

        var toast = {
            show: showToast
        };

        return toast;

    })(jQuery, toastr);
}]);
