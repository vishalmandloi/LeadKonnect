(function () {
    'use strict';
    angular.module('app')
      .controller('myleadCtrl', myleadCtrl);

    function myleadCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, alertService, $state, $stateParams) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        vm.currentUser=JSON.parse(localStorage.getItem('app-user'));
        $scope.vm = vm;
        vm.CloseLead = CloseLead;
        vm.ResponseOffer = ResponseOffer;
        vm.FeedBackUserId = 0;
        //vm.FeedbackClick = FeedbackClick;
        vm.PostFor = $stateParams.tab;
        vm.FeedBack = {};
        vm.ratingClick = ratingClick;
        vm.ReplyDiscussion = '';
        vm.MakeOffer = MakeOffer;
        vm.PostId = 0;
        vm.init = function(){
            GetPosts();
            $('.dropdown-menu').click(function(event){
             event.stopPropagation();
            });
        }

       function GetPosts(){
            LoaderStart();
            var objReq={
              userId:currentUser.UserId,
              searchFor:$stateParams.tab
            }
            var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetMyPosts', body).then(function (response) {
                if (response.Success) {
                    LoaderStop();
                    debugger
                      _.map(response.Result,function(lead) {

                        var evens = _.remove(lead.lstOffers, function(n) {
                          return n.RevisedTo !=null
                        });

                        lead.lstOffers =_.chain(lead.lstOffers)
                        .groupBy("UserId")
                        .pairs()
                        .map(function(currentItem) {
                            return _.object(_.zip(["userId", "users"], currentItem));
                        })
                        .map(function(res) {
                          
                             var match = _.find(evens, function(rev){  return res.userId == rev.RevisedTo}) || [];
                            res.users =res.users.concat(match);
                            return res.users
                        })
                        .value();

                    })

                    vm.posts = response.Result;
                    //debugger
                }
                else {
                    LoaderStop();
                }
            });
        }

        function CloseLead(req){
                LoaderStart();
                var objReq={
                    LeadId : req.LeadId
                }
                aPIInterFace.doServiceCall('Post', 'CloseLead', objReq).then(function (response) {
                    if (response.Success) {
                        //alertService.add('success', response.Message);
                        GetPosts()
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        //alertService.add('danger', response.Message);
                        alert(response.Message);
                        LoaderStop();
                    }
                });              
        }  

        function ResponseOffer(req,OfferStatus){
                LoaderStart();
                var objReq={
                    OfferId : req.OfferId, 
                    LeadId : req.LeadId,
                    OfferStatus : OfferStatus,
                    UserId: currentUser.UserId
                }
                aPIInterFace.doServiceCall('Post', 'ResponseOffer', objReq).then(function (response) {
                    if (response.Success) {
                        //alertService.add('success', response.Message);
                        GetPosts()
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        //alertService.add('danger', response.Message);
                        alert(response.Message);
                        LoaderStop();
                    }
              });              
        } 

        function ratingClick(){
                LoaderStart();
                var objReq={
                    Rating : vm.FeedBackModel.Rating, 
                    Feedback : vm.FeedBackModel.Feedback,
                    UserId : vm.FeedBackUserId,
                    FromId: currentUser.UserId
                }
                aPIInterFace.doServiceCall('Post', 'GiveFeedback', objReq).then(function (response) {
                    if (response.Success) {
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        //alertService.add('danger', response.Message);
                        alert(response.Message);
                        LoaderStop();
                    }
              });             
        } 

        function MakeOffer(){
            debugger
                LoaderStart();
                var objReq={
                    UserId:currentUser.UserId,
                    OfferDescription:vm.ReplyDiscussion,
                    LeadId:vm.PostId,
                    IsRevised:true,
                    RevisedTo:vm.FeedBackUserId
                }
                aPIInterFace.doServiceCall('Post', 'MakeOffer', objReq).then(function (response) {
                    if (response.Success) {
                        alert(response.Message);
                         LoaderStop();
                         $('#btnDiscussionRpy').click();
                         GetPosts();
                    } else {
                        alert(response.Message);
                        LoaderStop();
                    }
                });  

         }  

    }
})();
