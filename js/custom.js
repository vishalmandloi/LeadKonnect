/*menu*/

$(document).ready(function () {
    var a = $(window).height();
    $('.custom-menu').height(a);
    $('.nav-toggle').click(function () {
        $('.custom-menu').animate({
            'right': '0px'
        })
    });
    $('.menu-close-btn').click(function () {
        $('.custom-menu').animate({
            'right': '-200px'
        })
    });

    $('.awaiting-confirmation-btn').click(function () {
        $(this).hide();
        $(this).next().css('display', 'block')
    });

    $('.secondary-distance').hide();
    $('#add-secondary-btn').click(function () {
        $('.secondary-distance').slideToggle();
    });

    $('#sec-loc-textbox').css('display', 'none');
    $('.lp-submit').click(function () {
        $('#sec-loc-textbox').slideDown();
    });

    $('.rf-inner2').hide();
    $('.rf-sub').click(function () {
        $('.rf-inner').hide();
        $('.rf-inner2').fadeIn('slow');
    });

    $('.lb-paid').change(function () {
        if ($(this).val() == 'unpaid') {
            $('.lb-minutes').attr('disabled', 'disabled');
        }
        else {
            $('.lb-minutes').removeAttr('disabled', '');
        }
    });
    $('.lb-brk').change(function () {
        if ($(this).val() == 'unpaid') {
            $('.lb-brk-min').attr('disabled', 'disabled');
        }
        else {
            $('.lb-brk-min').removeAttr('disabled', '');
        }
    });

    $(".content").mCustomScrollbar({
        axis: "yx" // vertical and horizontal scrollbar
    });

    //$("#create-job-datepicker").datepicker();
});

new WOW().init();
/*/menu*/




