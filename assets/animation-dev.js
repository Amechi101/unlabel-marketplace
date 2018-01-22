
;(function($) {

    // Local Environment
    var $document = $(document);
    var $window   = $(window);
    var $html     = $(document.documentElement);
    var $body     = $(document.body);

    //Page Transitions
    var preloaderWrap = $('.preloader-wrap');
    var pageSweeper   = $('.page-sweeper');

    preloaderWrap.attr("data-preloader-on", "on");

    // cMask
    // var cMask = $('.c-mask');
    // var cMaskTimeline = new TimelineMax({ 
        
    //     tweens:[ TweenMax.set(cMask, {className: '+=c-mask-horizontal'}) ], 

    //     paused:true,
    // });

    // // onPageLoad Transition --> Brands/Creators page
    // var bgColor = $('#our-creators .triptych__bg, #our-brands .triptych__bg');

    // if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
    //     var ourBrandsCreatorsPagesTimeline = new TimelineMax({ 
            
    //         tweens:[
    //             // TweenMax.set(bgColor, {className: '+=js-animate'}),
    //             TweenMax.allFromTo(bgColor, .5, { x:'-170%', force3D:true, ease:Cubic.easeOut }, { x:'-50%', force3D:true, ease:Cubic.easeOut, clearProps: 'all' }, 0 ),
    //         ], 

    //         paused:true,
            
    //         delay:.9,
    //     });
    // }

    function dataActiveOn(e) {
        e.attr("data-active", "on");
    }

    function dataActiveOff(e) {
        e.attr("data-active", "off");
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

    function initScrollFramework() {
        // Init Locomotive Scroll
        var smoothScroll = new _ScrollManager2.default({
            container: $('#app'),
            selector: '.js-parallax',
            smooth: true,
            smoothMobile: true,
            mobileContainer: $document
        });
    }

    function initPageAnimations() {
        setTimeout(function() {
            console.log('animations, go!');
                
           $body.addClass('dom-is-loaded'); 

           if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
                $html.addClass('is-desktop'); 
           } else {
                $html.addClass('is-mobile');
           }

           // cMaskTimeline.play();

           // switch ( $body.attr('id') ) {
    
           //      case 'our-brands':
           //           if (is.desktop() && $(window).width() >= 1024 || is.ie() && $(window).width() > 1024) {
           //              ourBrandsCreatorsPagesTimeline.play(); 
           //          }
           //      break;

           //      case 'our-creators':
           //          if (is.desktop() && $(window).width() >= 1024 || is.ie() && $(window).width() > 1024) {
           //              ourBrandsCreatorsPagesTimeline.play(); 
           //          }
           //      break;
           // }
        
        }, 500);
    }

    $("a").click(function(e) {
        var thisTarget = $(this).attr("target"), 
            thisHref = $(this).attr("href");
        
        var linkHash = /(#).*/gi;
        var linkHashTest = linkHash.test(thisHref);
        var linkHashMatch = thisHref.match(linkHash);

       function CheckHash() {

            if ( linkHashMatch != null ) {

                return linkHashMatch[0];
            
            } else {

                return '#';
            }
        }
        
        if("_blank" != thisTarget && -1 == thisHref.indexOf("mailto") && thisHref != "javascript:void(0);" && 
        (e.preventDefault(), CheckHash() != thisHref && pageLinkTransition(thisHref)));
    });

    $(window).load(function() {
        console.log('page loaded!');  
        
        // initScrollFramework();
        
        setTimeout(function() {
            console.log('loader off!');
            
            preloaderOff();
            
            initPageAnimations();

        }, 700);
    
    });

}(jQuery));

 