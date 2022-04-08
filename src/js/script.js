$(document).ready(function(){
    $('.carousel__inner').slick({
        speed: 1200,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="../icons/arrow-left.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="../icons/arrow-right.png"></button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    // dots: true,
                    arrow: false
               }
            }
        ]
    });
    // просто табы
    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
            .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
            .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });
    // tabs link подробнее
    function toggleSlide(item) {
        $(item).each(function (i) {
            $(this).on('click', function (e) {
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            })
        })
    };

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    // modal
    $('[data-modal=consultation]').on('click', function () {
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function () {
        $('.overlay, #consultation, #thanks, #order').fadeOut('slow');
    });
    $('.button_mini').each(function (i) {
        $(this).on('click', function () {
            $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
            $('.overlay, #order').fadeIn('slow');
        })
    });

    function valideForm(form) {
        $(form).validate({
         rules: {
            name: 'required',
            phone: 'required',
            email: {
                required: true,
                email: true,
            }
        },
         messages: {
            name: "Пожалуйста введи своё имя",
            phone: "Введите свой телефон",
            email: {
            required: "Пожалуйста введи свой эмейл",
            email: "Вы не правильно ввели свою почту name@domain.com"
            }
        }
      });
    }
    valideForm('#order form')
    valideForm('#consultation-form form')
    valideForm('#consultation form')

    $('input[name=phone]').mask('+380 (99) 99-99-99');

    // smooth scroll and pageUp

    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $('.pageUp').fadeIn();
        } else {
            $('.pageUp').fadeOut();
        }
    })

    $("a[href^='#']").click(function () {
        const _href = $(this).attr("href");
        $("html,body").animate({ scrollTop: $(_href).offset().top + "px" });
        return false;
    })
});


