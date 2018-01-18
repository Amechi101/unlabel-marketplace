"use strict";

;(function($) {

 	var preloaderWrap = $('.preloader-wrap');
    var pageSweeper = $('.page-sweeper');

    function dataActiveOn(e) {
        e.attr("data-active", "on")
    }

    function dataActiveOff(e) {
        e.attr("data-active", "off")
    }

    function pageLinkTransition(e) {
        pageSweeper.show(), setTimeout(function() {
            dataActiveOn(pageSweeper), setTimeout(function() {
                location.href = e
            }, 750)
        }, 10)
    }

    function preloaderOff() {
        dataActiveOff(preloaderWrap), setTimeout(function() {
            preloaderWrap.remove()
        }, 1e3);
    }

    $("a").click(function(e) {
        var thisTarget = $(this).attr("target"), 
            thisHref = $(this).attr("href");
        
        if("_blank" != thisTarget && -1 == thisHref.indexOf("mailto") && thisHref != "javascript:void(0);" && 
        (e.preventDefault(), "#" != thisHref && pageLinkTransition(thisHref)));
    });

    preloaderWrap.attr("data-preloader-on", "on");


    $(window).load(function() {
        console.log('page loaded!');  
        
        setTimeout(function() {
            console.log('loader off - animation end!');
            
            preloaderOff();
            
           	setTimeout(function() {
           		console.log('bring in page elements');
           		
           		$('body').addClass('dom-is-loaded');

           		
           	}, 500);
        }, 700);
    
    });
}(jQuery));
