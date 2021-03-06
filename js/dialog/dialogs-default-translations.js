(function(){
  'use strict';
  angular.module('app')
    .config(configure);

    function configure($translateProvider){
        $translateProvider.translations('de-DE',{
            DIALOGS_ERROR: "Error",
            DIALOGS_ERROR_MSG: "Ein unbekannter Fehler ist aufgetreten.",
            DIALOGS_CLOSE: "Schließen",
            DIALOGS_PLEASE_WAIT: "Bitte warten",
            DIALOGS_PLEASE_WAIT_ELIPS: "Bitte warten...",
            DIALOGS_PLEASE_WAIT_MSG: "Warte auf Fertigstellung der Operation.",
            DIALOGS_PERCENT_COMPLETE: "% fertig",
            DIALOGS_NOTIFICATION: "Benachrichtigung",
            DIALOGS_NOTIFICATION_MSG: "Unbekannte Anwendungsbenachrichtigung.",
            DIALOGS_CONFIRMATION: "Bestätigung",
            DIALOGS_CONFIRMATION_MSG: "Bestätigung erforderlich.",
            DIALOGS_OK: "OK",
            DIALOGS_YES: "Ja",
            DIALOGS_NO: "Nein"
        });
        
        $translateProvider.translations('en-US',{
            DIALOGS_ERROR: "Error",
            DIALOGS_ERROR_MSG: "An unknown error has occurred.",
            DIALOGS_CLOSE: "Close",
            DIALOGS_PLEASE_WAIT: "Please Wait",
            DIALOGS_PLEASE_WAIT_ELIPS: "Please Wait...",
            DIALOGS_PLEASE_WAIT_MSG: "Waiting on operation to complete.",
            DIALOGS_PERCENT_COMPLETE: "% Complete",
            DIALOGS_NOTIFICATION: "Notification",
            DIALOGS_NOTIFICATION_MSG: "Unknown application notification.",
            DIALOGS_CONFIRMATION: "Confirmation",
            DIALOGS_CONFIRMATION_MSG: "Confirmation required.",
            DIALOGS_OK: "OK",
            DIALOGS_YES: "Yes",
            DIALOGS_NO: "No"
        });
        
        $translateProvider.translations('es-ES',{
            DIALOGS_ERROR: "Error",
            DIALOGS_ERROR_MSG: "Se ha producido un error.",
            DIALOGS_CLOSE: "Cerrar",
            DIALOGS_PLEASE_WAIT: "Espere por favor",
            DIALOGS_PLEASE_WAIT_ELIPS: "Espere por favor...",
            DIALOGS_PLEASE_WAIT_MSG: "Completando operación.",
            DIALOGS_PERCENT_COMPLETE: "% Completado",
            DIALOGS_NOTIFICATION: "Notificación",
            DIALOGS_NOTIFICATION_MSG: "Notificación de una aplicación desconocida.",
            DIALOGS_CONFIRMATION: "Confirmación",
            DIALOGS_CONFIRMATION_MSG: "Se requiere confirmacion.",
            DIALOGS_OK: "Aceptar",
            DIALOGS_YES: "Sí",
            DIALOGS_NO: "No"
        });
        
        $translateProvider.translations("fr-FR", {
            DIALOGS_ERROR: "Erreur",
            DIALOGS_ERROR_MSG: "Une erreur inconnue s'est produite.",
            DIALOGS_CLOSE: "Fermer",
            DIALOGS_PLEASE_WAIT: "Patientez svp",
            DIALOGS_PLEASE_WAIT_ELIPS: "Patienter svp...",
            DIALOGS_PLEASE_WAIT_MSG: "En attente de la fin de l'opération.",
            DIALOGS_PERCENT_COMPLETE: "% Terminer",
            DIALOGS_NOTIFICATION: "Notification",
            DIALOGS_NOTIFICATION_MSG: "Notification de l'application inconnue",
            DIALOGS_CONFIRMATION: "Confirmer",
            DIALOGS_CONFIRMATION_MSG: "Merci de confirmer",
            DIALOGS_OK: "OK",
            DIALOGS_YES: "Oui",
            DIALOGS_NO: "Non"
        });
        
        $translateProvider.translations('pt-BR',{
            DIALOGS_ERROR: "Erro",
            DIALOGS_ERROR_MSG: "Ocorreu um erro inesperado.",
            DIALOGS_CLOSE: "Fechar",
            DIALOGS_PLEASE_WAIT: "Por favor aguarde",
            DIALOGS_PLEASE_WAIT_ELIPS: "Por favor aguarde...",
            DIALOGS_PLEASE_WAIT_MSG: "Aguardando que a operação termine.",
            DIALOGS_PERCENT_COMPLETE: "% Completados",
            DIALOGS_NOTIFICATION: "Notificação",
            DIALOGS_NOTIFICATION_MSG: "Notificação de aplicação desconhecida.",
            DIALOGS_CONFIRMATION: "Confirmação",
            DIALOGS_CONFIRMATION_MSG: "Confirmação requerida.",
            DIALOGS_OK: "OK",
            DIALOGS_YES: "Sim",
            DIALOGS_NO: "Não"
        });

        $translateProvider.translations('zh-CN',{
            DIALOGS_ERROR: "错误",
            DIALOGS_ERROR_MSG: "出现未知错误。",
            DIALOGS_CLOSE: "关闭",
            DIALOGS_PLEASE_WAIT: "请稍候",
            DIALOGS_PLEASE_WAIT_ELIPS: "请稍候...",
            DIALOGS_PLEASE_WAIT_MSG: "请等待操作完成。",
            DIALOGS_PERCENT_COMPLETE: "% 已完成",
            DIALOGS_NOTIFICATION: "通知",
            DIALOGS_NOTIFICATION_MSG: "未知应用程序的通知。",
            DIALOGS_CONFIRMATION: "确认",
            DIALOGS_CONFIRMATION_MSG: "确认要求。",
            DIALOGS_OK: "确定",
            DIALOGS_YES: "确认",
            DIALOGS_NO: "取消"
        });

        $translateProvider.preferredLanguage('en-US');
    }
})();
