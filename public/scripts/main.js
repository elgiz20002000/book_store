


/*************************************
     MENU & CART LIST
*************************************/

$(function () {
    "use strict";
    if ($(window).width() <= 1000) {
        $(".menu-first-level li.expand").on('click', function () {
            $(this).toggleClass('open-submenu');
            return false;
        });
        $(".menu-first-level li.exp-mega").on('click', function () {
            $(this).toggleClass('open-submenu');
            return false;
        });

        $(".menu-first-level li.expand ul li a").on('click', function () {
            location.href = $(this).attr('href');
        });

        $(".menu-first-level li.exp-mega .mega-menu span a").on('click', function () {
            location.href = $(this).attr('href');
        });
    }

    //Management open close cart

    $(document).click(function () {
        $("#dropdown").hide();
    });

    $(".box-shoppingCart").click(function (e) {
        e.stopPropagation();
        $("#dropdown").show();
    });

    /*************************************
     SLIDE  CAROUSEL
    *************************************/

    $(window).on('load', function () {
        $('.owl-carousel').owlCarousel({
            items: 1,
            smartSpeed: 700,
            loop: true,
            nav: true,
            navText: ["", ""],
            rewindNav: true,
            autoplay: true
        });
    });

});


