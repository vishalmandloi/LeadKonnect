(function(){
  'use strict';
  angular.module('app')
  .directive('sendInvoice', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/sendinvoice.html',
      controller : ['$scope', 'alertService', function(scope,alertService){
        scope.SendInvoice = function(){
          debugger;
          var vm = scope.vm;
          
            var data = new FormData();
            var img = $("#uploadDoc").get(0).files;
            var daGroupModelta = new FormData();
            if (img.length > 0) {
                for (var i = 0; i < img.length; i++) {

                    data.append("image" + (i + 1), img[i]);
                }
            }
            if (vm.myDataForm.$valid || vm.travelExpense=='') {
                LoaderStart();

                vm.invoiceModel.locumId = vm.jobReqModel.locumId;

                var jsonString = JSON.stringify(vm.invoiceModel);
                data.append("json", jsonString);

                $.ajax({
                    type: "POST",
                    url: Config.backendUrl + "SendInvoice",
                    contentType: false,
                    processData: false,
                    async: true,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        if (response.Success) {
                            $('#invoice-modal').modal('hide');
                               $('#spnError').html('');
                            alertService.add('success', response.Message);
                            //alert(response.Message);
                            vm.GetUserFinaceJobsData();
                            LoaderStop();

                        } else {

                            $('#spnError').html(response.Message);
                            //alertService.add('success', response.Message);
                            LoaderStop();
                        }
                    },
                    error: function (response) {
                        alert(response.Message);
                        LoaderStop();

                    }
                });


            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        };
      }],
    };
  });

})();