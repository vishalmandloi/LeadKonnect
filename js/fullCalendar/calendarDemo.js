/**
 * calendarDemoApp - 0.9.0
 */
angular.module('calendarDemoApp', ['ui.calendar', 'ui.bootstrap'])
        .controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig) {
    //Block Table list
    $scope.eventList = [];
    $scope.events = [];

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {

        if ($scope.defaultView == "Month") {
            var date = event.start.format("YYYY-MM-DD");
            var val = $("#myCal").find("[data-date='" + date + "']").addClass('eventCalendarClass');
        }

        element.find('.fc-time').hide();

        if (event.type == "EVENT") {
            element.addClass("table_event_icon");
            if ($scope.defaultView != "Month") {
                $(element).children(".fc-bg").addClass("calender_blue_bg");
                //  $(element).css("background-color",'red');
                //console.log(element);
            }
        }

        if (event.type == "OFFER") {
            element.addClass("table_offer_icon");
            if ($scope.defaultView != "Month") {
                $(element).children(".fc-bg").addClass("calender_green_bg");
                $(element).removeAttr("left").removeAttr("right");

            }
        }
        if ($scope.defaultView == "Day") {
            console.log('css');
            $(element).children(".fc-bg").addClass("show_day");
            $(element).addClass("show_day_calander");

        }
        //element.attr({
        //    'tooltip': event.title,
        //    'tooltip-append-to-body': true
        //});

        $compile(element)($scope);
    };
    function resizeCalendar() {
        var w = angular.element($window);
        return w.height() - 143;
    }
    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: resizeCalendar(),
            editable: false,
            firstDay: 1,
            header: {
                left: null,
                center: 'title',
                right: null
            },
            eventLimit: true,
            columnFormat: {
                month: 'dddd',    // Monday, Wednesday, etc
                week: 'dddd, DD MMM',//'dddd, MMM dS', // Monday 9/7
                day: 'dddd DD MMM, YYYY'  // Monday 9/7
            },
            // eventLimit: true,

            eventClick: function (d) {

                var date = d.start.format("YYYY-MM-DD");

                var data = [];

                if ($scope.defaultView != "Month") {
                    var time = d.start.format("HH:00:00");
                    var minute = d.start.format("mm");
                    var second = d.start.format("ss");
                    if (minute > 0) {
                        time = d.start.format("HH:mm:00");
                    }
                    if (second > 0) {
                        time = d.start.format("HH:mm:ss");
                    }

                    data = $filter('filter')($scope.eventList, { eventDate: date, startTime: time }, true);
                } else {
                    data = $filter('filter')($scope.eventList, { eventDate: date }, true);
                }

                if (data.length > 0) {
                    //  console.log(data);

                    angular.forEach(data, function (d, i) {
                        var cdt = moment(d.startTime, 'HH:mm');
                        d.orderDate = new Date(cdt);
                        // console.log(d);
                    });
                    //console.log(data);
                    //  data = $filter('orderBy')(data, orderDate, true);
                    //console.log(data);
                    bindViewData(data);

                    var p = $(this);

                    var position = p.position();
                    var childPos = p.offset();

                    var topp = childPos.top;
                    var leftp = childPos.left;

                    $("#datadiv").css("left", leftp);
                    $("#datadiv").css("top", topp - 150);

                    if (($(window).height() - topp) < 300) {
                        $("#datadiv").css("top", topp - 300);
                    }

                    if (($(window).width() - leftp) < 220) {
                        $("#datadiv").css("left", leftp - 220);
                    }

                    $('.demo_div').show();

                }
            },

            eventRender: $scope.eventRender
        }
    };


    /* event sources array*/


    $scope.getDateTimeFormat = function (datetime, option) {
        var opt;
        if (option == 1) {
            var now = moment(datetime);
            opt = now.format('DD MMM YYYY');
        } else {
            opt = moment(datetime, ["h:mm A"]).format("hh:mm A");
        }
        return opt;
    }

    $scope.selectedData = [];

    function bindViewData(data) {
        $scope.selectedData = [];
        angular.forEach(data, function (d, i) {
            $scope.selectedData.push(d);
        });

        $('.fc-more').attr("disabled", "disabled");
    }

    var todayDate = new Date();
    $scope.defaultView = "Month";
    $scope.currentMonth = (todayDate.getMonth() + 1);

    var getIndexIfObjWithOwnAttr = function (attr, value) {
        if ($scope.events.length > 0) {
            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i].hasOwnProperty(attr) && $scope.events[i][attr] === value) {
                    return i;
                }
            }
        }
        return -1;
    };

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    $scope.eventSources = [];
    $scope.loadDataFromServer = function (yr, month) {
        LoaderStart();
        //console.log(yr + ' ' + month);
        nextMonthDate = new Date(yr, month);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        prevMonthDate = new Date(yr, month);
        prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
        //console.log(prevMonthDate.getMonth());
        var prevmonth = prevMonthDate.getMonth();
        var nxtmonth = nextMonthDate.getMonth();
        if (parseInt(nxtmonth) < 10) {
            nxtmonth = '0' + nxtmonth;
        }
        if (parseInt(prevmonth) < 10) {
            prevmonth = '0' + prevmonth;
        }

        var fromd = yr + '-' + prevmonth + '-' + daysInMonth(prevmonth, yr);
        var tod = yr + '-' + nxtmonth + '-' + '01';

        //console.log(fromd + tod);
        eventFactory.getEventCalenderList(fromd, tod).then(function (res) {

            if (res.responseStatus) {
                $('#myCal').fullCalendar('removeEvents');
                $("#myCal").fullCalendar('removeEventSources');
                $(".fc-other-month").removeClass('eventCalendarClass');
                // $scope.events = [];
                $scope.eventList = [];
                $scope.events = [];
                $scope.eventList = res.list;
                //$scope.eventSources = [];
                angular.forEach(res.list, function (d, i) {
                    var time = d.startTime.split(':');
                    var sdate = new Date(d.eventDate);
                    sdate.setHours(time[0]);
                    sdate.setMinutes(time[1]);
                    sdate.setSeconds(time[2]);

                    var edate = new Date(d.eventDate);
                    var etime = d.endTime.split(':');
                    edate.setHours(etime[0]);
                    edate.setMinutes(etime[1]);
                    edate.setSeconds(etime[2]);

                    var index = getIndexIfObjWithOwnAttr('id', d.guid);
                    if (index == -1) {
                        var obj = { id: d.guid, type: d.type, title: d.name, start: sdate, end: edate };
                        $scope.events.push(obj);
                    }

                });

                $scope.eventSources.push($scope.events);
                LoaderStop();

                //  console.log($scope.eventSources);
            }
        }, function (err) {

        });
    }


    $scope.Intloaddata = function () {
        //  $scope.events = [];
        var yr = todayDate.getFullYear(), month = (todayDate.getMonth() + 1);
        $scope.loadDataFromServer(yr, month);

    }

    //Init Load
    $scope.Intloaddata();

    $scope.externalloaddata = function () {
        //  $scope.events = [];
        $timeout(function () {
            var yr = todayDate.getFullYear(), month = (todayDate.getMonth() + 1);
            $scope.loadDataFromServer(yr, month);
        }, 50);
    }

    $scope.loaddata = function (yr, month) {
        $scope.loadDataFromServer(yr, month);
        //$scope.lastMonth = (selecteddate.getMonth() + 1);
        //todayDate.setDate(selecteddate.getDate() + day);
        //var yr = todayDate.getFullYear(), month = (todayDate.getMonth() + 1);
        //$scope.currentMonth = month;
        //if ($scope.defaultView == "Month") {
        //    $scope.loadDataFromServer(yr, month);
        //    return false;
        //}
        //if ($scope.currentMonth != $scope.lastMonth) {
        //    $scope.loadDataFromServer(yr, month);
        //}


    }

    //Open add pop up
    $scope.addEditEvent = function (val) {
        eventFactory.setEventId(val);
        ngDialog.open({ template: 'Components/Event/views/add-edit-event.html', showClose: false, scope: $scope });
    }


    $scope.nextBtn = function () {
        var cal = $('#myCal').fullCalendar('next');
        var moment = $('#myCal').fullCalendar('getDate');
        var date = new Date(moment.format());
        $scope.loadDataFromServer(moment.format('YYYY'), moment.format('M'));
        //var selecteddate = new Date(moment.format());
        //var noofdays = daysInMonth(moment.format('MM'), moment.format('YYYY'));        
        //console.log(noofdays);
        //if ($scope.defaultView == "Month") {
        //    $scope.loaddata(noofdays, selecteddate);
        //}
        //if ($scope.defaultView == "Week") {
        //    $scope.loaddata(7, selecteddate);
        //}
        //if ($scope.defaultView == "Day") {
        //    $scope.loaddata(1, selecteddate);
        //}


    }

    $scope.preBtn = function () {
        $('#myCal').fullCalendar('prev');
        var moment = $('#myCal').fullCalendar('getDate');
        var date = new Date(moment.format());
        $scope.loadDataFromServer(moment.format('YYYY'), moment.format('M'));
        //var selecteddate = new Date(moment.format());
        //var noofdays = daysInMonth(moment.format('MM'), moment.format('YYYY'));
        //if ($scope.defaultView == "Month") {
        //    $scope.loaddata(-noofdays, selecteddate);
        //}
        //if ($scope.defaultView == "Week") {
        //    $scope.loaddata(-7, selecteddate);
        //}
        //if ($scope.defaultView == "Day") {
        //    $scope.loaddata(-1, selecteddate);
        //}


    }

    $scope.monthBtn = function () {
        $scope.defaultView = "Month";
        $('#myCal').fullCalendar('changeView', 'month');
        $('#myCal').fullCalendar({ month: todayDate.getMonth() });
    }
    $scope.weekBtn = function () {
        $scope.defaultView = "Week"
        $('#myCal').fullCalendar('changeView', 'agendaWeek');
    }
    $scope.dayBtn = function () {
        $scope.defaultView = "Day"
        $('#myCal').fullCalendar('changeView', 'agendaDay');
        //$('#myCal').fullCalendar('today');
    }
    $scope.fulldayBtn = function (selecteddate) {
        $('#datadiv').hide();
        $scope.defaultView = "Day"
        $('#myCal').fullCalendar('changeView', 'agendaDay');
        date = new Date(selecteddate);
        $('#myCal').fullCalendar('gotoDate', date);
    }
}
/* EOF */