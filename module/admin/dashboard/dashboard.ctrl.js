(function(){
  'use strict';
  angular.module('app')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $state, AuthSrv, StorageUtils, UserSrv, $rootScope,aPIInterFace) {
      LoaderStop();
    var vm = {};
    $scope.vm = vm;
    vm.role = StorageUtils.getSync('role');
    

    $scope.goToUser = function () {
      $state.go($scope.vm.role +'.user');

    };
      vm.AdminDashboard={};
      vm.GetAdminDashboard = function () {
      
          aPIInterFace.doServiceCall('Get', 'GetAdminDashboard', null, 'admin').then(function (response) {
              if (response.Success) {
                  vm.AdminDashboard = response.Result;
                  LoaderStop();
                  DrawUserChart();
                  DrawJobPaiChart();
              } else {
                  LoaderStop();
              }
          });
      }
      vm.GetAdminDashboard ();

      function DrawUserChart()
      {
        var donutData = [
          {label: "Locum", data: vm.AdminDashboard.locumCount, color: "#3c8dbc"},
          {label: "Pharmacy", data: vm.AdminDashboard.pharmacyCount, color: "#0073b7"},
          {label: "Head Office", data: vm.AdminDashboard.headOfficeCount, color: "#00c0ef"}
        ];
        $.plot("#donut-chart", donutData, {
          series: {
            pie: {
              show: true,
              radius: 1,
              innerRadius: 0.5,
              label: {
                show: true,
                radius: 2 / 3,
                formatter: labelFormatter,
                threshold: 0.1
              }

            }
          },
          legend: {
            show: false
          }
        });
      }
      function labelFormatter(label, series) {
        return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
                + label
                + "<br>"
                + Math.round(series.percent) + "%</div>";
      }


    //Draw Job Pai Chart

    function DrawJobPaiChart()
    {
     //-------------
        //- PIE CHART -
        //-------------
        // Get context with jQuery - using jQuery's .get() method.
        var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
        var pieChart = new Chart(pieChartCanvas);
        var PieData = [
          {
            value: vm.AdminDashboard.jobListed,
            color: "#f56954",
            highlight: "#f56954",
            label: "Job Listed"
          },
          {
            value: vm.AdminDashboard.jobNotApproved,
            color: "#00a65a",
            highlight: "#00a65a",
            label: "Waiting Approval"
          },
          {
            value: vm.AdminDashboard.jobComplete,
            color: "#f39c12",
            highlight: "#f39c12",
            label: "Job Completed"
          },
          {
            value: vm.AdminDashboard.paidJob,
            color: "#00c0ef",
            highlight: "#00c0ef",
            label: "Completed Payment"
          },
          {
            value: vm.AdminDashboard.paymentDue,
            color: "#3c8dbc",
            highlight: "#3c8dbc",
            label: "Pending Payment"
          }
        ];
        var pieOptions = {
          //Boolean - Whether we should show a stroke on each segment
          segmentShowStroke: true,
          //String - The colour of each segment stroke
          segmentStrokeColor: "#fff",
          //Number - The width of each segment stroke
          segmentStrokeWidth: 2,
          //Number - The percentage of the chart that we cut out of the middle
          percentageInnerCutout: 50, // This is 0 for Pie charts
          //Number - Amount of animation steps
          animationSteps: 100,
          //String - Animation easing effect
          animationEasing: "easeOutBounce",
          //Boolean - Whether we animate the rotation of the Doughnut
          animateRotate: true,
          //Boolean - Whether we animate scaling the Doughnut from the centre
          animateScale: false,
          //Boolean - whether to make the chart responsive to window resizing
          responsive: true,
          // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
          maintainAspectRatio: true,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        };
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        pieChart.Doughnut(PieData, pieOptions);

    }

  }
} )();
