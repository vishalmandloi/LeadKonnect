//US-Phone Number
function ParseUSNumber(PhoneNumberInitialString, obj) {
    var FmtStr = '';
    var index = 0;
    var LimitCheck;

    LimitCheck = PhoneNumberInitialString.length;
    while (index != LimitCheck) {
        if (isNaN(parseInt(PhoneNumberInitialString.charAt(index))))
        { }
        else
        { FmtStr = FmtStr + PhoneNumberInitialString.charAt(index); }
        index = index + 1;
    }
    //console.log(FmtStr);
    if (FmtStr.length >= 10) {
        FmtStr = FmtStr.substring(0, 10);
        FmtStr = "(" + FmtStr.substring(0, 3) + ") " + FmtStr.substring(3, 6) + "-" + FmtStr.substring(6, 10);
    }
    else if (FmtStr.length != 0) {
        FmtStr = PhoneNumberInitialString;
        //CustomAlertMsg(CssDanger, "United States phone numbers must have exactly ten digits.");

    }
    if (FmtStr == '')
        FmtStr = null


    obj.value = FmtStr;
}



//Scroll to top
function scrollTop() {
    $('html, body').animate({ scrollTop: '0px' }, 300);
}

//isNumber
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

//--prevent spaces
function isSpace(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode ==32)
        return false;

    return true;
}

//Get this index of item via attr from array
var getIndexIfObjWithOwnAttr = function (newArr, attr, value) {
    for (var i = 0; i < newArr.length; i++) {
        if (newArr[i].hasOwnProperty(attr) && newArr[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function isValidEmail(email) {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
        return true;
    }
    else {
        return false;
    }
}
function isValidNumber(num) {
    var Number = /^[A-Za-z]+$/;
    if (Number.test(num)) {
        return false;
    }
    else {
        return true;
       
    }
}
