function changeSize(size, el) {
    var tl = new TimelineMax();
    tl.to(el, 0.4, {scaleY: size, transformOrigin: '50% 100%'});
}


/*
function moveFroth(el, pos) {
    var tl = new TimelineMax();
    tl.to(el, 0.4, {y:pos});
    console.log("froth");
}*/

$('.name p').on('click', function(){
    var rect = $(this).parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    //var size = $(this).data('size');
    var size = "1";
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
});


/*
$('.beer .name p.half').on('click', function(){
    var rect = $(this).parent().siblings('svg').find('rect:not(rect.froth)');
    var size = $(this).data('size');
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    var frothEl = $('.froth');
    moveFroth(frothEl, 132);
});

$('.beer .name p.pint').on('click', function(){
    var rect = $(this).parent().siblings('svg').find('rect:not(rect.froth)');
    var size = $(this).data('size');
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    var frothEl = $('.froth');
    moveFroth(frothEl, 0);
});
*/