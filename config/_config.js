var Config = (function () {
    'use strict';
    var cfg = {
        appVersion: '~',
        debug: true, // to toggle features between dev & prod
        verbose: true, // should log in console more infos
        track: false, // should send tracking events to a server
        storage: true, // should save data to browser storage
        storagePrefix: 'app-', // prefix all stoarge entries with this prefix
        emailSupport: 'leankonnect@support.com',

        //-------------Staging-----------------------------------
        backendUrl: 'http://84ea335e.ngrok.io/api/WebService/',
        imagePath: 'http://84ea335e.ngrok.io/WebImages/',

        //---------------Live----------------------------------

        // backendUrl: 'http://localhost:8030/api/WebService/',
        // imagePath: 'http://localhost:8030/WebImages/',
        
        parse: {
            applicationId: '4410af2g',
            restApiKey: ''
        },
        gcm: {
            // create project here : https://console.developers.google.com/
            senderID: '65137484242', // Google project number
            apiServerKey: 'AIzaSyDhPeRcH4HJU1sF6y5qfOrSoOsRVcoC9u4' // used only to send notifications
        }
    };
    return cfg;
})();
