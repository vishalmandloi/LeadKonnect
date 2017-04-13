'use strict';
(function () {


    function LoaderStart() {

        $('#loader').show();
    }


    function LoaderStop() {
        $('#loader').hide();
    }



    // container for data to be used for messages;
    var apiRoutes = {};
    window.apiRoutes = apiRoutes;
    var app = angular.module('app');

    app.run(['$rootScope', 'Config', function (rootScope, Config) {
        rootScope.apiRoutes = apiRoutes;
    }]);

    apiRoutes.routePath = Config.backendUrl;
    apiRoutes.routeAdminPath = Config.backendAdminUrl;

    apiRoutes.url =
    {
        dynamicForms: 'DynamicForms',
        users: 'Signup',
        GetCategories: 'getcategories',
        GetNeeds: 'getneeds',
        GetNeedTypes: 'getneedtypes',
        GetShowDetails: 'getshowdetails',
        CreatePost: 'createpost',
        GetPosts: 'getposts?searchText=:searchText&searchFor=:searchFor',
        GetPostsById: 'getpostsbyid?leadId=:leadId&userId=:userId',
        AddPartner: 'addpartner',
        MakeOffer: 'createoffer',
        GetMyPosts: 'getmyposts?userId=:userId&searchFor=:searchFor',
        GetPartners: 'getpartners?userId=:userId',
        ResponsePartnerRequest: 'responsepartnerrequest',
        ResponseOffer: 'responseoffer',
        CloseLead: 'closelead',
        GetNotificationds: 'getnotifications?userId=:userId',
        GiveFeedback: 'givefeedback',
        GetAppliedLeads: 'getappliedleads?userId=:userId&searchFor=:searchFor',        
        GetUserDetails: 'getuserdetail?userId=:userId&FromId=:FromId', 
        UpdateNotificationCount: 'updatenotificationcount',
        
        CheckEmail: 'CheckEmail',
        GetLocumProfile: 'GetLocumProfile',
        GetLocumSettings: 'GetLocumSettings',
        UpdateLocumSettings: 'UpdateLocumSettings',
        UpdateLocumPassword: 'UpdateLocumPassword',
        GetLocumJobByStatus: 'GetLocumJobByStatus',
        AppliedJob: 'AppliedJob',
        AddUpdateBankDetails: 'AddUpdateBankDetails',
        GetLocumBankDetails: 'GetLocumBankDetails',
        SaveMessages: 'SaveMessages',
        GetMessageForLocum: 'GetMessageForLocum',
        GetLocumMessageList: 'GetLocumMessageList?locumId=:locumId',
        GetUserFinaceJobsData: 'GetUserFinaceJobsData',
        SendInvoice: 'SendInvoice',
        GetDashbaordDataForLocum: 'GetDashbaordDataForLocum',
        GetInvoiceFromSL: 'GetInvoiceFromSL',
        SaveLocumCommentsForCalendor: 'SaveLocumCommentsForCalendor',
        CalendorAvailabilityUpdate: 'CalendorAvailabilityUpdate',
        PaymentRecieved: 'PaymentRecieved',
        ForgotPassword: 'ForgotPassword',
        GetMessageByJob:'GetMessageByJob',
        SendOtp:'SendOtp',
        VerifiedOtpPost:'VerifiedOtp',
        ReSendOtp:'ReSendOtp',
        //----------Pharmacy-------
        pharmacy: 'SinglePharmacySignup',
        MultiplePharmacySignup: 'MultiplePharmacySignup',
        CreateAJobs: 'CreateAJobs',
        GetPharmacyProfile: 'GetPharmacyProfile',
        UpdatePharmacyProfile: 'UpdatePharmacyProfile',
        AddUpdatePharmacyBranch: 'AddUpdatePharmacyBranch',
        GetBranchList: 'GetBranchList',
        GetBranchForDrobdown: 'GetBranchForDrobdown',
        GetPharmacyJob: 'GetPharmacyJob',
        GetITSystemForDropdown: 'GetITSystemForDropdown',
        GetAppliedJobLocum: 'GetAppliedJobLocum',
        ApproveJob: 'ApproveJob',
        UpdatePharmacyPassword: 'UpdatePharmacyPassword',
        GetTiming: 'GetTiming',
        GetPharmacyMessageList: 'GetPharmacyMessageList?pharmacyId=:pharmacyId',
        GetShiftingCharges: 'GetShiftingCharges?pharmacyId=:userId',
        AddFavorite: 'AddFavorite',
        GetFavoriteList: 'GetFavoriteList?pharmacyId=:userId',
        GetLatLongList: 'GetLatLongList?pharmacyId=:userId',
        GetPharmacyFinanceData: 'GetPharmacyFinanceData',
        UpdateJobStatusByPharmacy: 'UpdateJobStatusByPharmacy',
        GetDashbaordDataForPharmacy: 'GetDashbaordDataForPharmacy',
        SaveLocumRating:'SaveLocumRating',

        //----------Admin-------
        GetAllLocums: 'GetAllLocums',
        GetAllJobForAdmin: 'GetAllJobForAdmin',
        UpdateIsActiveAndIsDelete: 'UpdateIsActiveAndIsDelete',
        GetDocumentsAndDeclarations: 'GetDocumentsAndDeclarations',
        GetAllPharmacyUsers: 'GetAllPharmacyUsers',
        GetLocumActivities: 'GetLocumActivities?locumId=:locumId&month=:month&year=:year',
        GetPharmacyDetailForSignUp: 'GetPharmacyDetailForSignUp?ODSCode=:ODSCode',
        CreateUpdateHeadOffice: 'CreateUpdateHeadOffice',
        GetAllHeadOffice: 'GetAllHeadOffice',
        GetAllSubOffice: 'GetAllSubOffice',
        GetHeadOfficeById: 'GetHeadOfficeById',
        GetPharmacyRequests: 'GetPharmacyRequests',
        CheckValidEmail: 'CheckValidEmail?email=:email',
        GetPharmacyForDropdown: 'GetPharmacyForDropdown',
        EditJobByAdmin: 'EditJobByAdmin',
        GetJobById: 'GetJobById',
        AddUpdatePageContent: 'AddUpdatePageContent',
        GetPagesForDropdown: 'GetPagesForDropdown',
        GetContentFoCMS: 'GetContentFoCMS',
        GetAdminSettings: 'GetAdminSettings',
        SaveAdminSettings: 'SaveAdminSettings',
        GetHomeStaticContent: 'GetHomeStaticContent',
        GetContentByPageName: 'GetContentByPageName',
        GetMonthlyInvoiceForAdmin: 'GetMonthlyInvoiceForAdmin',
        GetHeadOfficeForDropdown: 'GetHeadOfficeForDropdown',
        GetPharmacyByHeadOffice: 'GetPharmacyByHeadOffice',
        SendInvoiceBySL: 'SendInvoiceBySL',
        UpdateRequestStatus: 'UpdateRequestStatus',
        GetAdminDashboard: 'GetAdminDashboard',

        //----------Head office-------------------------
        GetHeadOfficeAccountInfo: 'GetHeadOfficeAccountInfo',
        UpdateHeadOffice: 'UpdateHeadOffice',
        CreateUpdateSubOffice: 'CreateUpdateSubOffice',
        GetNotificationByType: 'GetNotificationByType',
        GetContent: 'GetContentById?pageId=:id',
        GetAllJobsForHeadOffice: 'GetAllJobsForHeadOffice',
        GetDashbaordDataForHeadOffice: 'GetDashbaordDataForHeadOffice',
        UpdateShiftCharges: 'UpdateShiftCharges',
        GetNotificationUnreadCount: 'GetNotificationUnreadCount'


    };

    apiRoutes.getPath = function (key) {
        return apiRoutes.routePath + apiRoutes.url[key];
    }

    apiRoutes.getAdminPath = function (key) {
        return apiRoutes.routeAdminPath + apiRoutes.url[key];
    }

})(window.app);