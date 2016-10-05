"use strict";
angular.module('NOTICE.services', ['ngResource','ngStorage'])
.constant('urls', {
    BASE: '',
    BASE_API: ''
})
.factory("cacheService", ["$http", function ($http) {
    var dummydata = {
        sections: [
            { id: 1, name: "EMBA Spring 2016" },
            { id: 2, name: "MBA Spring 2016" },
            { id: 3, name: "EMBA Fall 2016" },
            { id: 4, name: "MBA Fall 2016" },
        ],
        subjects: [
            { id: 1, name: "Microeconomic Analysis", code: "501", section: 1 },
            { id: 2, name: "Microeconomic Analysis", code: "501", section: 3 },
            { id: 3, name: "Business Statistics", code: "502", section: 2 },
            { id: 4, name: "Business Statistics", code: "502", section: 4 }
        ],
        students: [
            { id: 1, firstName: 'Yogesh', lastName: 'Adhikari', email: 'adhikari.yogesh@gmail.com', phone: '9808371434', section: 1 },
            { id: 2, firstName: 'A', lastName: 'F', email: 'a.f@gmail.com', phone: '9808371434', section: 2 },
            { id: 3, firstName: 'B', lastName: 'G', email: 'b.g@gmail.com', phone: '9808371434', section: 3 },
            { id: 4, firstName: 'C', lastName: 'H', email: 'c.h@gmail.com', phone: '9808371434', section: 4 },
            { id: 5, firstName: 'D', lastName: 'I', email: 'd.i@gmail.com', phone: '9808371434', section: 1 },
            { id: 6, firstName: 'E', lastName: 'J', email: 'e.j@gmail.com', phone: '9808371434', section: 2 }
        ],
        users: [
            { id: 1, userName: 'YOGAD', firstName: 'Yogesh', lastName: 'Adhikari' },
            { id: 2, userName: 'LUNYA', firstName: 'Lunish', lastName: 'Yakami' },
            { id: 3, userName: 'UJJSI', firstName: 'Ujjwal', lastName: 'Silwal' },
        ],
        attendancereport: [
            {
                student: 'Yogesh Adhikari',
                attendance: [
                    { subject: "Micro Economics", attendance: 90 },
                    { subject: "Human Resource Management", attendance: 92 },
                    { subject: "Business Management", attendance: 88 },
                    { subject: "Business Statistics", attendance: 82 },
                    { subject: "Management Accounting", attendance: 88 },
                    { subject: "Managerial Communication", attendance: 85 },
                ]
            },
            {
                student: 'Lunish Yakami',
                attendance: [
                    { subject: "Micro Economics", attendance: 94 },
                    { subject: "Human Resource Management", attendance: 82 },
                    { subject: "Business Management", attendance: 86 },
                    { subject: "Business Statistics", attendance: 83 },
                    { subject: "Management Accounting", attendance: 98 },
                    { subject: "Managerial Communication", attendance: 79 },
                ]
            }
        ]
    };
    var sections = [];
    var subjects = [];

    return {
        getSections: function (success) {
            //if (sections.length == 0) {

            //}
           return dummydata.sections;
        },
        getSubjects: function () {
            //if (sections.length == 0) {

            //}
            return dummydata.subjects;
        },
        getStudents: function (id) {
            return $.grep(dummydata.students, function (data) {
                return data.section == id;
            });
        },
        getUsers: function () {
            return dummydata.users;
        },
        getAttendanceReport: function (filter) {
            return dummydata.attendancereport;
        }
    };
}])
.factory('authenticationService', ['$http', '$localStorage', 'urls', function ($http, $localStorage, urls) {
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };

    function getClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    };

    var tokenClaims = getClaimsFromToken();

    return {
        signup: function (data, success, error) {
            //$http.post(urls.BASE + '/signup', data).success(success).error(error)
        },
        signin: function (data, success, error) {
            //$http.post(urls.BASE + '/signin', data).success(success).error(error)
            //console.log(data);
        },
        logout: function (success) {
            tokenClaims = {};
            delete $localStorage.token;
            success();
        },
        getTokenClaims: function () {
            return tokenClaims;
        }
    };
}])

.factory("messageService", ["$http", function ($http) {
    return {
        sendMessage: function (message, files) {
            var targetUrl = "/Home/Message";
            return $http({
                url: targetUrl,
                method: "POST",
                headers: { "Content-Type": undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("messageRequest", angular.toJson(data.messageRequest));
                    angular.forEach(data.filesRequest, function (file) {
                        formData.append("filesRequest", file);
                    })

                    return formData;

                },
                data: { messageRequest: message, filesRequest: files }
            })
        }
    };
}])
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])
.factory('attendanceService', ['$http', 'cacheService', function ($http, cacheService) {
    return {
        saveAttendance: function (attendance) {
            
        },
    };
}])
.factory('userService', ['$http', function ($http) {
    return {
        addUser: function (user) {

        },
        amendUser: function (user) {

        },
        resetPassword: function () {

        }
    }
}])
.factory('studentService', ['$http', 'cacheService', function ($http, cacheService) {
    return {
        addStudent: function (attendance) {
            
        },
        amendStudent: function (attendance) {
            
        }
    };
}])
.factory('subjectService', ['$http', 'cacheService', function ($http, cacheService) {
    return {
        addSubject: function (attendance) {

        },
        amendSubject: function (attendance) {

        }
    };
}])
.factory('sectionService', ['$http', 'cacheService', function ($http, cacheService) {
    return {
        addSection: function (attendance) {

        },
        amendSection: function (attendance) {

        }
    };
}])
;