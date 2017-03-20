(function () {
    'use strict';
    angular.module('app')
      .controller('CreateJobsCtrl', CreateJobsCtrl);

    function CreateJobsCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, $compile, $timeout, uiCalendarConfig, $filter) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        vm.data = 5;
        vm.finalFee = '';
        vm.pharmacyName = currentUser.userName;
        vm.isSinglePharmacy = currentUser.isSinglePharmacy;
        vm.CreateAJob = CreateAJobs;
        vm.Validate = Validate;
        vm.selectDefaulTime = selectDefaulTime;
        vm.GetBranchForDrobdown = GetBranchForDrobdown;
        vm.GetBranchName = GetBranchName;
        vm.timeCalculate = timeCalculate;
        vm.housrList = ["00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45",
  "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00", "04:15", "04:30", "04:45",
  "05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00",
  "09:15", "09:30", "09:45",
  "10:00", "10:15", "10:30", "10:45", "11:00", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00",
 "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45",
  "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45"]
        vm.JobTitleList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]
        vm.serviceCharge = 0;
        vm.normalShiftCharge = 0;
        vm.emergencyShift = 0;

        vm.init = function () {
            reSet();
            GetShiftingCharges();
            vm.isShowing = false;
            vm.GetBranchForDrobdown();
        }

        function reSet() {
            vm.JobModel = {
                jobId: null,
                branchId: null,
                userId: null,
                costPerHours: 0,
                costPlaceholder: '£21 / hour',
                jobDescription: null,
                timingList: []
            }
        }

        $scope.fkey = "Start Time";
        function selectDefaulTime(timeData) {
            if (timeData == undefined) {
                return timeData = "Start Time"
            }
            else {
                return timeData;
            }
        }

        //--------GetBranchList-----------
        function GetBranchForDrobdown() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "4" && !currentUser.isSinglePharmacy) {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
                }

                aPIInterFace.doServiceCall('Post', 'GetBranchForDrobdown', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.branchList = response.Result;
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            //else {
            //    alert('Invalid User')
            //}
        }

        function GetBranchName(d) {
            if (vm.branchList && vm.branchList.length > 0) {
                return $filter('filter')(vm.branchList, { id: d }, true)[0].value;
            }
        }

        function Validate() {
            vm.timeError = null;

            angular.forEach($scope.events, function (value, key) {
                value.cost = ((vm.JobModel.costPerHours) * timeCalculate(value.startTime, value.finishTime)) //- ((vm.JobModel.costPerHours / 60) * parseInt(vm.breakTime));
                value.hours = timeCalculate(value.startTime, value.finishTime)
            });
            if(parseFloat(vm.JobModel.costPerHours)<20){
                $('.text-adjust').css('border','solid 1px red');
            }
            else{
                $('.text-adjust').css('border','none');
            }
            if (vm.myDataForm.$valid && parseFloat(vm.JobModel.costPerHours)>=20) {
                //angular.forEach($scope.events, function (value, key) {
                //    value.cost = ((vm.JobModel.costPerHours) * timeCalculate(value.startTime, value.finishTime)) - ((vm.JobModel.costPerHours / 60) * parseInt(vm.breakTime));
                //    value.hours = timeCalculate(value.startTime, value.finishTime)
                //});
                $scope.isShowing = true;
            } else {
                $scope.isShowing = false;
            }
        }

        function timeCalculate(startTm, finishTm) {
            var startHR = startTm.split(':')[0];
            var startMin = startTm.split(':')[1];
            var finishHR = finishTm.split(':')[0];
            var finishMin = finishTm.split(':')[1];

            var TotalTime = (((parseInt(finishHR) * 60) + parseInt(finishMin)) - ((parseInt(startHR) * 60) + parseInt(startMin))) ;

            return (parseInt(TotalTime)-parseInt(vm.breakTime))/ 60;


        }
        /* ***********CreateAJobs************** */
        function CreateAJobs() {
            vm.timeError = null;
            if (vm.myDataForm.$valid) {
                vm.JobModel.userId = currentUser.userId;
                vm.JobModel.timingList = $scope.events;

                console.log(vm.JobModel);
                if (vm.JobModel.timingList.length > 0) {
                    var validEntry = true;
                    var dateExist = false;
                    angular.forEach($scope.events, function (value, key) {
                        validEntry = true;
                        if (value.startTime == null || value.finishTime == null) {
                            validEntry = false;
                        }
                    });
                    if (validEntry) {
                        LoaderStart();
                        aPIInterFace.doServiceCall('Post', 'CreateAJobs', vm.JobModel).then(function (response) {
                            if (response.Success) {
                                reSet();
                                $state.go('pharmacy.jobs');
                                LoaderStop();
                            }
                            else {
                                alert(response.Message)
                                LoaderStop();
                            }
                        });
                    } else {
                        vm.timeError = 'Please fill your time slot';
                    }
                } else {
                    vm.timeError = 'Please select job time slots';
                    //alert('Please select job time slots');
                }
            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        }

        ///---------------------************************--------------------------------

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        /* event source that contains custom events on the scope */
        //$scope.events = [
        //  { title: 'All Day Event', start: new Date(y, m, 1) },
        //  //{ title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
        //  { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
        //  { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
        //  { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
        //  { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
        //];

        $scope.events = [];

        /* event source that calls a function on every view switch */

        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            angular.forEach($scope.events, function (value, key) {
                if (date.title === value.title) {
                    $scope.redusePrice(value.start);
                    $scope.events.splice(key, 1);
                }
            });
        };

        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };

        /*alertOnDayClick */
        $scope.alertOnDayClick = function (date, jsEvent, view) {

            vm.myDataForm.submitted = false;
            if (!currentUser.isSinglePharmacy && vm.JobModel.branchId == null) {
                vm.myDataForm.submitted = true;
                return false;
            }

            vm.startTime = 0;
            vm.finishTime = 0;
            if (date.isBefore(moment(), 'd')) {
                return;
            };

            var objReq = {
                pharmacyId: currentUser.isSinglePharmacy ? currentUser.userId : vm.JobModel.branchId,
                dateFor: new Date(date.format()),
                isBranch: currentUser.isSinglePharmacy ? false : true
            }

            aPIInterFace.doServiceCall('Post', 'GetTiming', objReq).then(function (response) {
                if (response.Success) {
                    if (response.Result.startTime && response.Result.finishTime) {
                        //vm.startTime = vm.housrList.indexOf(response.Result.startTime).toString();
                        //vm.finishTime = vm.housrList.indexOf(response.Result.finishTime).toString();

                        vm.startTime = response.Result.startTime;
                        vm.finishTime = response.Result.finishTime;
                    }
                    else {
                        vm.startTime =null;
                        vm.finishTime =null;
                    }
                    LoaderStop();
                }

                if ($scope.events.length == 0) {
                    var obj = {
                        title: '<span class="calendar-creatJob-btn">JOB ' + ($scope.events.length + 1) + '</span>',
                        jobID: 'A',
                        start: new Date(date.format()),
                        startTime: vm.startTime,
                        finishTime: vm.finishTime,
                        cost: 0,
                        allDay: false,
                        emergencyShift: 0,
                        normalShiftCharge: 0,
                        serviceCharge: 0,
                        hours: 0
                    }
                    $scope.events.push(obj);
                    Validate();
                }
                else {
                    var validEntry = true;
                    var dateExist = false;
                    angular.forEach($scope.events, function (value, key) {
                        validEntry = true;
                        if (value.startTime == 0 || value.finishTime == 0) {
                            validEntry = false;
                        }
                    });
                    if (validEntry) {
                        var len = $filter('filter')($scope.events, { start: new Date(date.format()) }, true).length;
                        var obj = {
                            title: '<span class="calendar-creatJob-btn">JOB ' + ($scope.events.length + 1) + '</span>',
                            jobID: vm.JobTitleList[len],
                            start: new Date(date.format()),
                            startTime: vm.startTime,
                            finishTime: vm.finishTime,
                            cost: 0,
                            allDay: false,
                            emergencyShift: 0,
                            normalShiftCharge: 0,
                            serviceCharge: 0,
                            hours: 0

                        }
                        $scope.events.push(obj);
                        Validate();
                    } else {
                        alert('Please fill previous details!')
                    }
                }
                var oneDay = 24 * 60 * 60 * 1000;
                var selectedDate = new Date(date);
                var currentDate = new Date();
                var diffDays = Math.round(Math.abs((selectedDate.getTime() - currentDate.getTime()) / (oneDay)));

                if (diffDays <= 2) {
                    vm.serviceCharge = +vm.serviceCharge + +vm.emergencyShift;

                    $scope.events[$scope.events.length - 1].normalShiftCharge = 0;
                    $scope.events[$scope.events.length - 1].emergencyShift = +vm.emergencyShift;
                    $scope.events[$scope.events.length - 1].serviceCharge = +vm.emergencyShift;
                }
                else {
                    vm.serviceCharge = +vm.serviceCharge + +vm.normalShiftCharge;

                    $scope.events[$scope.events.length - 1].emergencyShift = 0;
                    $scope.events[$scope.events.length - 1].normalShiftCharge = +vm.normalShiftCharge;
                    $scope.events[$scope.events.length - 1].serviceCharge = +vm.normalShiftCharge;
                }

            });
            getServiceFees($scope.events);
           
        }

        function getServiceFees(data) {
            vm.finalFee = Number(vm.normalShiftCharge) * (data.length + 1);
        }
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }

        };
        /* add custom event*/
        $scope.addEvent = function () {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function (index, event) {
            $scope.events.splice(index, 1);
            $scope.redusePrice(event.start);

            //$scope.eventRender();

        };

        $scope.redusePrice = function (eventDate) {
            var oneDay = 24 * 60 * 60 * 1000;
            var selectedDate = new Date(eventDate);
            var currentDate = new Date();
            var diffDays = Math.round(Math.abs((selectedDate.getTime() - currentDate.getTime()) / (oneDay)));

            if (diffDays <= 2) {
                vm.serviceCharge = +vm.serviceCharge - +vm.emergencyShift;
            }
            else {
                vm.serviceCharge = +vm.serviceCharge - +vm.normalShiftCharge;
            }
        }

        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);

        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            $timeout(function () {
                if (uiCalendarConfig.calendars[calendar]) {
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                firstDay: 1,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                minDate: new Date(),
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender,
                dayClick: $scope.alertOnDayClick,
            }
        };


        $scope.changeLang = function () {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                $scope.changeTo = 'Hungarian';
            }
        };

        vm.getEventTotalAmount = function () {
            vm.JobModel.totalHour = 0;
            _.forEach($scope.events, function (v, k) {
                //vm.JobModel.totalHour += (v.finishTime - v.startTime);
                vm.JobModel.totalHour += timeCalculate(v.startTime, v.finishTime);
            });
            return vm.JobModel.costPerHours * vm.JobModel.totalHour + Number(vm.serviceCharge);
        };


        vm.positive = Math.positive;

        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

        function GetShiftingCharges() {
            debugger;
            LoaderStart();
            var objReq = {
                query: { userId: currentUser.userId }

            }

            aPIInterFace.doServiceCall('Get', 'GetShiftingCharges', objReq).then(function (response) {
                console.log(response)
                vm.emergencyShift = response.Result.emergencyShift;
                vm.normalShiftCharge = response.Result.normalShift;
                vm.finalFee = vm.normalShiftCharge;
                vm.breakTime = response.Result.breakTime;
                LoaderStop();
            });
        }

    }

})();
