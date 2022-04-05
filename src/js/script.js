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
                    dots: true,
                    arrow: false
               }
            }
        ]
});
});