//=================================== svg
jQuery('.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        var $svg = jQuery(data).find('svg');
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }
        $svg = $svg.removeAttr('xmlns:a');
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }
        $img.replaceWith($svg);
    }, 'xml');
});

//=================================== loading
window.addEventListener('DOMContentLoaded', function() {
    $('.loading_txt').css({color: '#005087'});
    QueryLoader2(document.querySelector("body"), {
        backgroundColor: 'transparent',
        percentage: false,
        barHeight: 0,
        minimumTime: 1000,
        fadeOutTime: 0,
        onProgress: function(num){
            var num_ = Math.round(num);
            var num_scale = (num/100).toFixed(2);
            $('#loading_bar').css({'transform': 'scaleX(' + num_scale + ')'});
            $('#loading_num').text(num_);
        },
        onComplete: function(e){
            TweenMax.to('#loading', .6, {opacity: 0, onComplete: function(){
                $('#loading').hide();
            }});
        }
    });
});
