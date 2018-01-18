/*! Locomotive Boilerplate - 2017-11-06 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ScrollManager = require('./modules/ScrollManager');

var _ScrollManager2 = _interopRequireDefault(_ScrollManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

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
    var cMask = $('.c-mask');
    var cMaskTimeline = new TimelineMax({ 
        
        tweens:[ TweenMax.set(cMask, {className: '+=c-mask-horizontal'}) ], 

        paused:true,
    });

    // onPageLoad Transition --> Brands/Creators page
    var bgColor = $('#our-creators .triptych__bg, #our-brands .triptych__bg');

    if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
        var ourBrandsCreatorsPagesTimeline = new TimelineMax({ 
            
            tweens:[
                // TweenMax.set(bgColor, {className: '+=js-animate'}),
                TweenMax.allFromTo(bgColor, .5, { x:'-170%', force3D:true, ease:Cubic.easeOut }, { x:'-50%', force3D:true, ease:Cubic.easeOut, clearProps: 'all' }, 0 ),
            ], 

            paused:true,
            
            delay:.9,
        });
    }

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

           cMaskTimeline.play();

           switch ( $body.attr('id') ) {
    
                case 'our-brands':
                     if (is.desktop() && $(window).width() >= 1024 || is.ie() && $(window).width() > 1024) {
                        ourBrandsCreatorsPagesTimeline.play(); 
                    }
                break;

                case 'our-creators':
                    if (is.desktop() && $(window).width() >= 1024 || is.ie() && $(window).width() > 1024) {
                        ourBrandsCreatorsPagesTimeline.play(); 
                    }
                break;
           }
        
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
        
        initScrollFramework();
        
        setTimeout(function() {
            console.log('loader off!');
            
            preloaderOff();
            
            initPageAnimations();

        }, 700);
    
    });

})(); // ==========================================================================
// App
// ==========================================================================
/* jshint esnext: true */

},{"./modules/ScrollManager":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Defaults = exports.Event = exports.EVENT_KEY = undefined;

var _environment = require('../utils/environment');

var _debounce = require('../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _is = require('../utils/is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // ==========================================================================
// Locomotive Scroll
// ==========================================================================
/* jshint esnext: true */


var EVENT_KEY = exports.EVENT_KEY = '.LocomotiveScroll';

var Event = exports.Event = {
    CLICK: 'click' + EVENT_KEY,
    ISREADY: 'isReady' + EVENT_KEY,
    REBUILD: 'rebuild' + EVENT_KEY,
    RENDER: 'render' + EVENT_KEY,
    RESIZE: 'resize' + EVENT_KEY,
    SCROLL: 'scroll' + EVENT_KEY,
    SCROLLTO: 'scrollTo' + EVENT_KEY,
    UPDATE: 'update' + EVENT_KEY,
    CHANGE: 'change' + EVENT_KEY
};

var Defaults = exports.Defaults = {
    container: _environment.$document,
    mobileContainer: _environment.$document,
    onScroll: function onScroll() {},
    selector: '.js-parallax',
    smooth: false,
    smoothMobile: false,
    reversed: false
};

/**
 * Manage animation of elements on the page according to scroll position.
 *
 * @todo  Manage some options (normally from data attributes) with constructor options (ex.: set repeat for all)
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.$container = options.container ? options.container : Defaults.container;
        this.selector = options.selector ? options.selector : Defaults.selector;

        this.callbacks = {
            onScroll: typeof options.onScroll === 'function' ? options.onScroll : Defaults.onScroll
        };

        this.scroll = {
            x: 0,
            y: 0,
            direction: ''
        };

        this.windowHeight = _environment.$window.height();
        this.windowMiddle = this.windowHeight / 2;

        this.animatedElements = [];

        this.requestId = undefined;
    }

    /**
     * Initialize scrolling animations
     */


    _class.prototype.init = function init() {
        var _this = this;

        this.addElements();

        this.renderAnimations();

        // On scroll
        this.$container.on(Event.SCROLL, (0, _debounce2.default)(function () {
            _this.renderAnimations();
        }, 10));

        // Rebuild event
        this.$container.on(Event.REBUILD, function () {
            _this.scrollTo({
                targetOffset: 0
            });
            _this.updateElements();
        });

        // Update event
        this.$container.on(Event.UPDATE, function (event, options) {
            return _this.updateElements(options);
        });

        // Render event
        this.$container.on(Event.RENDER, function () {
            return _this.renderAnimations();
        });


        // Scrollto button event
        this.$container.on(Event.CLICK, '.smoothscroll', function (event) {
            event.preventDefault();
            _this.scrollTo({
                sourceElem: $(event.currentTarget)
            });
        });

        this.$container.on(Event.SCROLLTO, function (event) {
            return _this.scrollTo(event.options);
        });

        // Setup done
        _environment.$document.triggerHandler({
            type: Event.ISREADY
        });

        // Resize event
        _environment.$window.on(Event.RESIZE, (0, _debounce2.default)(function () {
            _this.updateElements();
        }, 20));
    };

    /**
     * Find all animatable elements.
     * Called on page load and any subsequent updates.
     */


    _class.prototype.addElements = function addElements() {
        this.animatedElements = [];

        var $elements = $(this.selector);
        var len = $elements.length;
        var i = 0;

        for (; i < len; i++) {
            var $element = $elements.eq(i);
            var elementTarget = $element.attr('data-target');
            var elementPosition = $element.attr('data-position');
            var $target = elementTarget && $(elementTarget).length ? $(elementTarget) : $element;
            var elementOffset = $target.offset().top;
            var elementLimit = elementOffset + $target.outerHeight();
            var elementSticky = typeof $element.attr('data-sticky') === 'string';
            var elementStickyTarget = $element.attr('data-sticky-target');

            //Manage callback
            var elementCallbackString = typeof $element.attr('data-callback') === 'string' ? $element.attr('data-callback') : null;
            var elementCallback = null;

            if (elementCallbackString != null) {
                var event = elementCallbackString.substr(0, elementCallbackString.indexOf(':'));
                var optionsString = elementCallbackString.substr(elementCallbackString.indexOf('{'), elementCallbackString.length - event.length);
                optionsString = optionsString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');
                var options = JSON.parse(optionsString.toString());
                elementCallback = { event: event, options: options };
            }

            // If elements loses its animation after scrolling past it
            var elementRepeat = typeof $element.attr('data-repeat') === 'string';

            var elementInViewClass = $element.attr('data-inview-class');
            if (typeof elementInViewClass === 'undefined') {
                elementInViewClass = 'is-show';
            }

            if (elementSticky) {
                if (typeof elementStickyTarget === 'undefined') {
                    elementLimit = this.$container.height();
                } else {
                    elementLimit = $(elementStickyTarget).offset().top - $element.height();
                }

                // Reset offset
                $element.removeClass(elementInViewClass);
                $element.removeClass('-after');

                $element.css({
                    '-webkit-transform': 'translate3d(0, 0, 0)',
                    '-ms-transform': 'translate3d(0, 0, 0)',
                    'transform': 'translate3d(0, 0, 0)'
                });
            }

            // Don't add element if it already has its inview class and doesn't repeat
            if (elementRepeat || !$element.hasClass(elementInViewClass)) {
                this.animatedElements[i] = {
                    $element: $element,
                    offset: Math.round(elementOffset),
                    repeat: elementRepeat,
                    position: elementPosition,
                    limit: elementLimit,
                    inViewClass: elementInViewClass,
                    sticky: elementSticky,
                    callback: elementCallback
                };
            }
        };
    };

    /**
     * Loop through all animatable elements and apply animation method(s).
     */


    _class.prototype.animateElements = function animateElements() {
        var len = this.animatedElements.length;
        var removeIndexes = [];
        var i = 0;
        for (; i < len; i++) {
            var element = this.animatedElements[i];

            // If the element's visibility must not be manipulated any further, remove it from the list
            if (this.toggleElement(element, i)) {
                removeIndexes.push(i);
            }
        }

        // Remove animated elements after looping through elements
        i = removeIndexes.length;
        while (i--) {
            this.animatedElements.splice(removeIndexes[i], 1);
        }
    };

    /**
     * Render the class animations, and update the global scroll positionning.
     */


    _class.prototype.renderAnimations = function renderAnimations() {
        // if (window.pageYOffset > this.scroll.y) {
        //     if (this.scroll.direction !== 'down') {
        //         this.scroll.direction = 'down';
        //     }
        // } else if (window.pageYOffset < this.scroll.y) {
        //     if (this.scroll.direction !== 'up') {
        //         this.scroll.direction = 'up';
        //     }
        // }

        if (this.scroll.y !== window.pageYOffset) {
            this.scroll.y = window.pageYOffset;
        }
        if (this.scroll.x !== window.pageXOffset) {
            this.scroll.x = window.pageXOffset;
        }

        this.callbacks.onScroll(this.scroll);

        this.animateElements();
    };

    /**
     * Toggle classes on an element if it's visible.
     *
     * @param  {object}      element Current element to test
     * @param  {int}         index   Index of the element within it's container
     * @return {boolean}             Wether the item must be removed from its container
     */


    _class.prototype.toggleElement = function toggleElement(element, index) {
        var removeFromContainer = false;

        if (typeof element !== 'undefined') {
            // Find the bottom edge of the scroll container
            var scrollTop = this.scroll.y;
            var scrollBottom = scrollTop + this.windowHeight;

            // Define if the element is inView
            var inView = false;

            if (element.position === 'top') {
                inView = scrollTop >= element.offset && scrollTop <= element.limit;
            } else if (element.sticky) {
                inView = scrollTop >= element.offset && scrollTop <= element.limit;
            } else {
                inView = scrollBottom >= element.offset && scrollTop <= element.limit;
            }

            if (element.sticky) {
                if (scrollTop > element.limit) {
                    element.$element.addClass('-after');
                } else {
                    element.$element.removeClass('-after');
                }

                if (scrollTop < element.offset) {
                    element.$element.removeClass(element.inViewClass);
                }
            }

            // Add class if inView, remove if not
            if (inView) {
                if (!element.$element.hasClass(element.inViewClass)) {
                    element.$element.addClass(element.inViewClass);
                    this.triggerCallback(element, 'enter');
                }

                if (!element.repeat && !element.sticky) {
                    removeFromContainer = true;
                }

                if (element.sticky) {
                    var y = this.scroll.y - element.offset;

                    element.$element.css({
                        '-webkit-transform': 'translate3d(0, ' + y + 'px, 0)',
                        '-ms-transform': 'translate3d(0, ' + y + 'px, 0)',
                        'transform': 'translate3d(0, ' + y + 'px, 0)'
                    });
                }
            } else {
                if (element.repeat) {
                    if (element.$element.hasClass(element.inViewClass)) {
                        element.$element.removeClass(element.inViewClass);
                        this.triggerCallback(element, 'leave');
                    }
                }
            }
        }

        return removeFromContainer;
    };

    /**
     * check if the element have a callback, and trigger the event set in the data-callback
     *
     * @param  {object}      element Current element to test
     * @return void
     */


    _class.prototype.triggerCallback = function triggerCallback(element, way) {

        if (element.callback != undefined) {
            element.$element.trigger({
                type: element.callback.event,
                options: element.callback.options,
                way: way
            });
            //add this where you want dude (in your module btw)
            // $document.on(eventName.Namespace,(e)=>{
            //     console.log(e.options, e.way);
            // });
            /////////////////////////////////////////////
        }
    };

    /**
     * Scroll to a desired target.
     *
     * @param  {object} options
     * @return {void}
     */


    _class.prototype.scrollTo = function scrollTo(options) {
        var $targetElem = options.targetElem;
        var $sourceElem = options.sourceElem;
        var targetOffset = (0, _is.isNumeric)(options.targetOffset) ? parseInt(options.targetOffset) : 0;
        var speed = (0, _is.isNumeric)(options.speed) ? parseInt(options.speed) : 800;
        var delay = (0, _is.isNumeric)(options.delay) ? parseInt(options.delay) : 0;
        var toTop = options.toTop;
        var toBottom = options.toBottom;

        if (typeof $targetElem === 'undefined' && typeof $sourceElem === 'undefined' && typeof targetOffset === 'undefined') {
            console.warn('You must specify at least one parameter.');
            return false;
        }

        if (typeof $targetElem !== 'undefined' && $targetElem instanceof jQuery && $targetElem.length > 0) {
            targetOffset = $targetElem.offset().top + targetOffset;
        }

        if (typeof $sourceElem !== 'undefined' && $sourceElem instanceof jQuery && $sourceElem.length > 0) {
            var targetData = '';

            if ($sourceElem.attr('data-target')) {
                targetData = $sourceElem.attr('data-target');
            } else {
                targetData = $sourceElem.attr('href');
            }

            targetOffset = $(targetData).offset().top + targetOffset;
        }

        if (toTop === true) {
            targetOffset = 0;
        } else if (toBottom === true) {
            targetOffset = _environment.$document.height();
        }

        setTimeout(function () {
            $('html, body').animate({
                scrollTop: targetOffset
            }, speed);
        }, delay);
    };

    /**
     * Update elements and recalculate all the positions on the page
     */


    _class.prototype.updateElements = function updateElements() {
        this.addElements();
        this.animateElements();
    };

    /**
     * Destroy
     */


    _class.prototype.destroy = function destroy() {
        _environment.$window.off(EVENT_KEY);
        this.$container.off(EVENT_KEY);
        window.cancelAnimationFrame(this.requestId);
        this.requestId = undefined;
        this.animatedElements = undefined;
    };

    return _class;
}();

exports.default = _class;

},{"../utils/debounce":5,"../utils/environment":6,"../utils/is":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _Scroll = require('./Scroll');

var _Scroll2 = _interopRequireDefault(_Scroll);

var _SmoothScroll = require('./SmoothScroll');

var _SmoothScroll2 = _interopRequireDefault(_SmoothScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // ==========================================================================
// Locomotive Scroll Manager
// ==========================================================================
/* jshint esnext: true */


/**
 * Basic module that detects which scrolling module we'll be using
 */
var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.options = options;
        this.smooth = options.smooth || _Scroll.Defaults.smooth;
        this.smoothMobile = options.smoothMobile || _Scroll.Defaults.smoothMobile;
        this.mobileContainer = options.mobileContainer || _Scroll.Defaults.mobileContainer;
        this.isMobile = false;

        this.init();

        // Add a callback when reaching top or bottom
        // options.onScroll = function(scrollStatus) {
        //     $html.toggleClass('has-scrolled', (scrollStatus.y > 0));
        // };
    }

    _class.prototype.init = function init() {
        var _this = this;

        _environment.$html[0].scrollTop = 0;
        _environment.$body[0].scrollTop = 0;

        if (!this.smoothMobile) {
            this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        this.instance = function () {
            if (_this.smooth === true && !_this.isMobile) {
                return new _SmoothScroll2.default(_this.options);
            } else {
                if (_this.mobileContainer) {
                    _this.options.container = _this.mobileContainer;
                }
                return new _Scroll2.default(_this.options);
            }
        }();

        this.instance.init();

        var $scrollToOnLoadEl = $('.js-scrollto-on-load').first();

        if ($scrollToOnLoadEl.length === 1) {
            _environment.$document.triggerHandler({
                type: 'Event.SCROLLTO',
                options: {
                    targetElem: $scrollToOnLoadEl
                }
            });
        }
    };

    _class.prototype.destroy = function destroy() {
        this.instance.destroy();
    };

    return _class;
}();

exports.default = _class;

},{"../utils/environment":6,"./Scroll":2,"./SmoothScroll":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _environment = require('../utils/environment');

var _Scroll2 = require('./Scroll');

var _Scroll3 = _interopRequireDefault(_Scroll2);

var _debounce = require('../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _smoothScrollbar = require('smooth-scrollbar');

var _smoothScrollbar2 = _interopRequireDefault(_smoothScrollbar);

var _is = require('../utils/is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Locomotive Smooth Scroll
// ==========================================================================
/* jshint esnext: true */


/**
 * Smooth scrolling using `smooth-scrollbar`.
 * Based on `Scroll` class, which allows animations of elements on the page
 * according to scroll position.
 *
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */
var _class = function (_Scroll) {
    _inherits(_class, _Scroll);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _Scroll.call(this, options));

        _this.isReversed = options.reversed || _Scroll2.Defaults.reversed;
        _this.parallaxElements = [];
        return _this;
    }

    /**
     * Initialize scrolling animations
     */


    _class.prototype.init = function init() {
        var _this2 = this;

        // Add class to the document to know if SmoothScroll is initialized (to manage overflow on containers)
        _environment.$html.addClass('has-smooth-scroll');

        this.scrollbar = _smoothScrollbar2.default.init(this.$container[0], {
            syncCallbacks: true
        });

        this.scrollbarStatus = undefined;

        this.setScrollbarLimit();

        this.setWheelDirection(this.isReversed);

        this.set();

        this.renderAnimations(true);

        // On scroll
        this.scrollbar.addListener(function (status) {
            
            var offset = status.offset;

            // $('.anchors-nav.is-fixed').css({
            //     '-webkit-transform': 'translate3d(' + 0 + 'px, ' + offset.y + 'px, ' + 0 + 'px)',
            //     '-ms-transform': 'translate3d(' + 0 + 'px, ' + offset.y + 'px, ' + 0 + 'px)',
            //     'transform': 'translate3d(' + 0 + 'px, ' + offset.y + 'px, ' + 0 + 'px)',
            //     'top': '0px'
            // });

            if (_environment.$body.attr('id') == 'faq') {
                if (offset.y >= 80) {
                
                    $('.anchors-nav.is-fixed').css({
                        'top': offset.y + 'px',
                        'padding-top': '24px'
                    });
                
                } else {
                    
                    $('.anchors-nav').css({
                        'padding-top': '0px'
                    });  
                }
            }

                   
            return _this2.renderAnimations(false, status);
        });

        // Rebuild event
        this.$container.on(_Scroll2.Event.REBUILD, function () {
            _this2.scrollbar.scrollTo(0, 0, 0);
            _this2.updateElements();
        });

        // Update event
        this.$container.on(_Scroll2.Event.UPDATE, function (event, options) {
            return _this2.updateElements(options);
        });

        // Render event
        this.$container.on(_Scroll2.Event.RENDER, function () {
            return _this2.renderAnimations(false);
        });

        // Scrollto button event
        this.$container.on(_Scroll2.Event.CLICK, '.smoothscroll', function (event) {
            event.preventDefault();
            
            if ( this.tagName == 'A' ) {
                
                _this2.scrollTo({
                    sourceElem: $(event.currentTarget)
                });
            
            } else if ( this.tagName == 'SELECT' ) {
                
               // @TODO select scrollTo
                // _this2.$container.on(_Scroll2.Event.CHANGE, function () {

                //     _this2.scrollTo({
                //         sourceElem: $(event.currentTarget)
                //     });
                // });
            
            }
        });

        this.$container.on(_Scroll2.Event.SCROLLTO, function (event) {
            return _this2.scrollTo(event.options);
        });

        // Setup done
        _environment.$document.triggerHandler({
            type: _Scroll2.Event.ISREADY
        });

        // Resize event
        _environment.$window.on(_Scroll2.Event.RESIZE, (0, _debounce2.default)(function () {
            _this2.updateElements();
        }, 20));
    };

    _class.prototype.set = function set() {
        this.windowHeight = _environment.$window.height();
        this.windowMiddle = this.windowHeight / 2;
        this.scrollbarLimit = this.scrollbar.limit.y + this.windowHeight;
        // Create elements object
        this.addElements();
        // First load
        // this.checkElements(true);
    };

    /**
     * Reset existing elements and find all animatable elements.
     * Called on page load and any subsequent updates.
     */

    _class.prototype.checkElements = function checkElements(first) {
    
        var scrollbarTop = this.scrollbar.scrollTop;
        var scrollbarLimit = this.scrollbarLimit;
        var scrollbarBottom = scrollbarTop + this.windowHeight;
        var scrollbarMiddle = scrollbarTop + this.windowMiddle;

        console.log(this.scrollbar, 'scrollbar');
        console.log(scrollbarTop, 'Top');
        console.log(scrollbarBottom, 'Bottom');
        console.log(this.parallaxElements, 'elements');

        for (var i in this.parallaxElements) {
    
            var transformDistance = void 0;
            var scrollBottom = scrollbarBottom;
            var $element = this.parallaxElements[i].$element;
            var elementOffset = this.parallaxElements[i].offset;
            var elementLimit = this.parallaxElements[i].limit;
            var elementMiddle = this.parallaxElements[i].middle;
            var elementSpeed = this.parallaxElements[i].speed;
            var elementPosition = this.parallaxElements[i].position;
            var elementHorizontal = this.parallaxElements[i].horizontal;
            var elementPersist = this.parallaxElements[i].persist;
            var elementFixed = this.parallaxElements[i].fixed;

            if (elementPosition === 'top') {
                scrollBottom = scrollbarTop;
            }

            if (elementFixed) {
                $element.css('transform', 'translateY(' + scrollbarTop + 'px)');
                console.log(scrollbarTop);
            }

            // Define if the element is inview
            var inview = scrollBottom >= elementOffset && scrollbarTop <= elementLimit;

            console.log(scrollBottom, 'scrollBottom');
            console.log(elementOffset, 'elementOffset');
            console.log(scrollbarTop, 'scrollbarTop');
            console.log(elementLimit, 'elementLimit');
            console.log(inview);


            // Add class if inview, remove if not
            if (inview) {
                $element.addClass('is-inview');
            } else {
                if (!elementPersist) {
                    $element.removeClass('is-inview');
                }
            }

            if (first && !inview && elementSpeed) {
                // Different calculation if first call and the item is not in view
                if (elementPosition !== 'top') {
                    // transformDistance = ((elementOffset - this.windowMiddle)  - elementMiddle) * -elementSpeed;
                }
            }

            // If element is in view
            if (inview && elementSpeed) {
                switch (elementPosition) {
                    case 'top':
                        transformDistance = (scrollbarTop - elementOffset) * -elementSpeed;
                        break;

                    case 'bottom':
                        transformDistance = (scrollbarLimit - scrollBottom) * elementSpeed;
                        break;

                    default:
                        transformDistance = (scrollbarMiddle - elementMiddle) * -elementSpeed;
                        break;
                }
            }

            if (transformDistance) {
                // Transform horizontal OR vertical, default vertical
                elementHorizontal !== undefined ? this.transform($element, transformDistance + 'px') : this.transform($element, 0, transformDistance + 'px');
            }
        }
    };


    _class.prototype.addElements = function addElements() {
        this.animatedElements = [];
        this.parallaxElements = [];


        var $elements = $(this.selector);
        var len = $elements.length;
        var i = 0;

        for (; i < len; i++) {
            var $element = $elements.eq(i);
            var elementSpeed = (0, _is.isNumeric)($element.attr('data-speed')) ? $element.attr('data-speed') / 10 : false;
            var elementPosition = $element.attr('data-position');
            var elementTarget = $element.attr('data-target');
            var elementHorizontal = $element.attr('data-horizontal');
            var elementSticky = typeof $element.attr('data-sticky') === 'string';
            var elementStickyTarget = $element.attr('data-sticky-target');
            var $target = elementTarget && $(elementTarget).length ? $(elementTarget) : $element;
            var elementOffset = $target.offset().top + this.scrollbar.scrollTop;
            var elementLimit = elementOffset + $target.outerHeight();

            //Manage callback
            var elementCallbackString = typeof $element.attr('data-callback') === 'string' ? $element.attr('data-callback') : null;
            var elementCallback = null;

            if (elementCallbackString != null) {
                var event = elementCallbackString.substr(0, elementCallbackString.indexOf(':'));
                var optionsString = elementCallbackString.substr(elementCallbackString.indexOf('{'), elementCallbackString.length - event.length);
                optionsString = optionsString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');
                var options = JSON.parse(optionsString.toString());
                elementCallback = { event: event, options: options };
            }

            // If elements stays visible after scrolling past it
            var elementRepeat = typeof $element.attr('data-repeat') === 'string';

            var elementInViewClass = $element.attr('data-inview-class');
            if (typeof elementInViewClass === 'undefined') {
                elementInViewClass = 'is-show';
            }

            if (!elementTarget && $element.attr('data-transform')) {
                elementOffset -= parseFloat($element.attr('data-transform').y);
            }

            if (elementSticky) {
                if (typeof elementStickyTarget === 'undefined') {
                    elementLimit = Infinity;
                } else {
                    elementLimit = $(elementStickyTarget).offset().top - $element.height() + this.scrollbar.scrollTop;
                }
            }

            var newElement = {
                $element: $element,
                inViewClass: elementInViewClass,
                limit: elementLimit,
                offset: Math.round(elementOffset),
                repeat: elementRepeat,
                callback: elementCallback
            };

            // For parallax animated elements
            if (elementSpeed !== false) {
                var _elementPosition = $element.attr('data-position');
                var _elementHorizontal = $element.attr('data-horizontal');
                var elementMiddle = (elementLimit - elementOffset) / 2 + elementOffset;

                newElement.horizontal = _elementHorizontal;
                newElement.middle = elementMiddle;
                newElement.offset = elementOffset;
                newElement.position = _elementPosition;
                newElement.speed = elementSpeed;

                this.parallaxElements.push(newElement);
            } else {
                newElement.sticky = elementSticky;

                this.animatedElements.push(newElement);

                // @todo Useful?
                // Don't add element if it already has its in view class and doesn't repeat
                // if (elementRepeat || !$element.hasClass(elementInViewClass)) {
                //     this.animatedElements.push(newElement);
                // }

                if (elementSticky) {
                    //launch the toggle function to set the position of the sticky element
                    this.toggleElement(newElement);
                }
            }
        };
    };

    /**
     * Render the class/transform animations, and update the global scroll positionning.
     *
     * @param  {boolean} isFirstCall Determines if this is the first occurence of method being called
     * @param  {object}  status      Optional status object received when method is
     *                               called by smooth-scrollbar instance listener.
     * @return {void}
     */


    _class.prototype.renderAnimations = function renderAnimations(isFirstCall, status) {
        if ((typeof status === 'undefined' ? 'undefined' : _typeof(status)) === 'object') {
            this.scrollbarStatus = status;
        }

        var scrollbarTop = this.scrollbar.scrollTop;

        // if (scrollbarTop > this.scroll.y) {
        //     if (this.scroll.direction !== 'down') {
        //         this.scroll.direction = 'down';
        //     }
        // } else if (scrollbarTop < this.scroll.y) {
        //     if (this.scroll.direction !== 'up') {
        //         this.scroll.direction = 'up';
        //     }
        // }

        if (this.scroll.y !== scrollbarTop) {
            this.scroll.y = scrollbarTop;
        }

        this.transformElements(isFirstCall);
        this.animateElements();
    };

    /**
     * Scroll to a desired target.
     *
     * @param  {object} options
     * @return {void}
     */


    _class.prototype.scrollTo = function scrollTo(options) {
        var _this3 = this;

        var $targetElem = options.targetElem;
        var $sourceElem = options.sourceElem;
        var targetOffset = (0, _is.isNumeric)(options.targetOffset) ? parseInt(options.targetOffset) : 0;
        var delay = (0, _is.isNumeric)(options.delay) ? parseInt(options.delay) : 0;
        var speed = (0, _is.isNumeric)(options.speed) ? parseInt(options.speed) : 900;
        var toTop = options.toTop;
        var toBottom = options.toBottom;

        if (typeof $targetElem === 'undefined' && typeof $sourceElem === 'undefined' && typeof targetOffset === 'undefined') {
            console.warn('You must specify at least one parameter.');
            return false;
        }

        if (typeof $targetElem !== 'undefined' && $targetElem instanceof jQuery && $targetElem.length > 0) {
            targetOffset = $targetElem.offset().top + this.scrollbar.scrollTop + targetOffset;
        }

        if (typeof $sourceElem !== 'undefined' && $sourceElem instanceof jQuery && $sourceElem.length > 0) {
            var targetData = '';

            if ($sourceElem.attr('data-target')) {
                targetData = $sourceElem.attr('data-target');
            } else {
                targetData = $sourceElem.attr('href');
            }

            targetOffset = $(targetData).offset().top + this.scrollbar.scrollTop + targetOffset;
        }

        if (toTop === true) {
            targetOffset = 0;
        } else if (toBottom === true) {
            targetOffset = this.scrollbar.limit.y;
        }

        setTimeout(function () {
            _this3.scrollbar.scrollTo(0, targetOffset, speed);
        }, delay);
    };

    /**
     * Set the scroll bar limit
     */


    _class.prototype.setScrollbarLimit = function setScrollbarLimit() {
        this.scrollbarLimit = this.scrollbar.limit.y + this.windowHeight;
    };

    /**
     * Apply CSS transform properties on an element.
     *
     * @param  {object}  $element Targetted jQuery element
     * @param  {int}     x        Translate value
     * @param  {int}     y        Translate value
     * @param  {int}     z        Translate value
     * @return {void}
     */


    _class.prototype.transformElement = function transformElement($element, x, y, z) {
        // Defaults
        x = x || 0;
        y = y || 0;
        z = z || 0;

        // Translate and store the positionning as `data`
        $element.css({
            '-webkit-transform': 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)',
            '-ms-transform': 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)',
            'transform': 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)'
        }).data('transform', {
            x: x,
            y: y,
            z: z
        });

        // Affect child elements with the same positionning
        var children = $element.find(this.selector);
        var len = children.length;
        var i = 0;
        for (; i < len; i++) {
            var $child = $(children[i]);
            if (!$child.data('transform')) {
                $child.data('transform', {
                    x: x,
                    y: y,
                    z: z
                });
            }
        };
    };

    /**
     * Loop through all parallax-able elements and apply transform method(s).
     *
     * @param  {boolean} isFirstCall Determines if this is the first occurence of method being called
     * @return {void}
     */


    _class.prototype.transformElements = function transformElements(isFirstCall) {
        if (this.parallaxElements.length > 0) {
            var scrollbarBottom = this.scrollbar.scrollTop + this.windowHeight;
            var scrollbarMiddle = this.scrollbar.scrollTop + this.windowMiddle;

            var i = 0;
            var len = this.parallaxElements.length;
            var removeIndexes = [];

            for (; i < len; i++) {
                var curEl = this.parallaxElements[i];
                // Old
                var scrollBottom = scrollbarBottom;
                // New
                // let scrollBottom = (curEl.position === 'top') ? this.scrollbar.scrollTop : scrollbarBottom;

                var transformDistance = false;

                // Define if the element is in view
                // Old
                var inView = scrollBottom >= curEl.offset && this.scroll.y <= curEl.limit;
                // New
                // let inView = (scrollBottom >= curEl.offset && this.scrollbar.scrollTop <= curEl.limit);

                this.toggleElement(curEl, i);

                if (isFirstCall && !inView && curEl.speed) {
                    // Different calculations if it is the first call and the item is not in the view
                    if (curEl.position !== 'top') {
                        transformDistance = (curEl.offset - this.windowMiddle - curEl.middle) * -curEl.speed;
                    }
                }

                // If element is in view
                if (inView && curEl.speed) {
                    switch (curEl.position) {
                        case 'top':
                            // Old
                            transformDistance = this.scrollbar.scrollTop * -curEl.speed;
                            // New
                            // transformDistance = (this.scrollbar.scrollTop - curEl.offset) * -curEl.speed;
                            break;

                        case 'bottom':
                            transformDistance = (this.scrollbarLimit - scrollBottom) * curEl.speed;
                            break;

                        default:
                            transformDistance = (scrollbarMiddle - curEl.middle) * -curEl.speed;
                            break;
                    }
                }

                // Transform horizontal OR vertical. Defaults to vertical
                if ((0, _is.isNumeric)(transformDistance)) {
                    curEl.horizontal ? this.transformElement(curEl.$element, transformDistance) : this.transformElement(curEl.$element, 0, transformDistance);
                }
            }
        }
    };

    /**
     * Update elements and recalculate all the positions on the page
     *
     * @param {object} options
     */


    _class.prototype.updateElements = function updateElements(options) {
        options = options || {};

        this.scrollbar.update();
        this.windowHeight = _environment.$window.height();
        this.windowMiddle = this.windowHeight / 2;
        this.setScrollbarLimit();
        this.setWheelDirection(this.isReversed);
        this.addElements();
        this.transformElements(true);

        if (typeof options.callback === 'function') {
            options.callback();
        }

        this.renderAnimations(false, status);
    };

    /**
     * Set smooth-scrollbar scrolling direction for wheel event
     * @param {Boolean} isReversed
     */


    _class.prototype.setWheelDirection = function setWheelDirection(isReversed) {
        this.scrollbar.reverseWheel(isReversed);
    };

    /**
     * Destroy
     */


    _class.prototype.destroy = function destroy() {
        _Scroll.prototype.destroy.call(this);
        _environment.$html.removeClass('has-smooth-scroll');
        this.parallaxElements = [];
        this.scrollbar.destroy();
    };

    return _class;
}(_Scroll3.default);

exports.default = _class;

},{"../utils/debounce":5,"../utils/environment":6,"../utils/is":8,"./Scroll":2,"smooth-scrollbar":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DATA_API_KEY = '.data-api';

var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement).removeClass('has-no-js').addClass('has-js');
var $body = $(document.body);

var isDebug = !!$html.data('debug');

exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escapeHtml = escapeHtml;
exports.unescapeHtml = unescapeHtml;
exports.getNodeData = getNodeData;
/**
 * @see  https://github.com/ractivejs/ractive/blob/dev/src/utils/html.js
 */
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Prepare HTML content that contains mustache characters for use with Ractive
 * @param  {string} str
 * @return {string}
 */
function unescapeHtml(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/**
 * Get element data attributes
 * @param   {DOMElement}  node
 * @return  {Array}       data
 */
function getNodeData(node) {
    // All attributes
    var attributes = node.attributes;

    // Regex Pattern
    var pattern = /^data\-(.+)$/;

    // Output
    var data = {};

    for (var i in attributes) {
        if (!attributes[i]) {
            continue;
        }

        // Attributes name (ex: data-module)
        var name = attributes[i].name;

        // This happens.
        if (!name) {
            continue;
        }

        var match = name.match(pattern);
        if (!match) {
            continue;
        }

        // If this throws an error, you have some
        // serious problems in your HTML.
        data[match[1]] = node.getAttribute(name);
    }

    return data;
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isEqual = isEqual;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isFunction = isFunction;
var toString = Object.prototype.toString,
    arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
function isArray(thing) {
    return toString.call(thing) === '[object Array]';
}

function isArrayLike(obj) {
    return arrayLikePattern.test(toString.call(obj));
}

function isEqual(a, b) {
    if (a === null && b === null) {
        return true;
    }

    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        return false;
    }

    return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumeric(thing) {
    return !isNaN(parseFloat(thing)) && isFinite(thing);
}

function isObject(thing) {
    return thing && toString.call(thing) === '[object Object]';
}

function isFunction(thing) {
    var getType = {};
    return thing && getType.toString.call(thing) === '[object Function]';
}

},{}],9:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Scrollbar=e():t.Scrollbar=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i),a=n(55),c=r(a),l=n(62),f=r(l);Object.defineProperty(e,"__esModule",{value:!0});var s="function"==typeof f.default&&"symbol"==typeof c.default?function(t){return typeof t}:function(t){return t&&"function"==typeof f.default&&t.constructor===f.default&&t!==f.default.prototype?"symbol":typeof t},d=n(78),h=n(89);n(129),n(146),n(159),n(174),n(189),e.default=d.SmoothScrollbar,d.SmoothScrollbar.version="7.3.1",d.SmoothScrollbar.init=function(t,e){if(!t||1!==t.nodeType)throw new TypeError("expect element to be DOM Element, but got "+("undefined"==typeof t?"undefined":s(t)));if(h.sbList.has(t))return h.sbList.get(t);t.setAttribute("data-scrollbar","");var n=[].concat(o(t.childNodes)),r=document.createElement("div");r.innerHTML='\n        <div class="scroll-content"></div>\n        <aside class="scrollbar-track scrollbar-track-x">\n            <div class="scrollbar-thumb scrollbar-thumb-x"></div>\n        </aside>\n        <aside class="scrollbar-track scrollbar-track-y">\n            <div class="scrollbar-thumb scrollbar-thumb-y"></div>\n        </aside>\n        <canvas class="overscroll-glow"></canvas>\n    ';var i=r.querySelector(".scroll-content");return[].concat(o(r.childNodes)).forEach(function(e){return t.appendChild(e)}),n.forEach(function(t){return i.appendChild(t)}),new d.SmoothScrollbar(t,e)},d.SmoothScrollbar.initAll=function(t){return[].concat(o(document.querySelectorAll(h.selectors))).map(function(e){return d.SmoothScrollbar.init(e,t)})},d.SmoothScrollbar.has=function(t){return h.sbList.has(t)},d.SmoothScrollbar.get=function(t){return h.sbList.get(t)},d.SmoothScrollbar.getAll=function(){return[].concat(o(h.sbList.values()))},d.SmoothScrollbar.destroy=function(t,e){return d.SmoothScrollbar.has(t)&&d.SmoothScrollbar.get(t).destroy(e)},d.SmoothScrollbar.destroyAll=function(t){h.sbList.forEach(function(e){e.destroy(t)})},t.exports=e.default},function(t,e,n){t.exports={default:n(3),__esModule:!0}},function(t,e,n){n(4),n(48),t.exports=n(12).Array.from},function(t,e,n){"use strict";var r=n(5)(!0);n(8)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){var r=n(6),o=n(7);t.exports=function(t){return function(e,n){var i,u,a=String(o(e)),c=r(n),l=a.length;return c<0||c>=l?t?"":void 0:(i=a.charCodeAt(c),i<55296||i>56319||c+1===l||(u=a.charCodeAt(c+1))<56320||u>57343?t?a.charAt(c):i:t?a.slice(c,c+2):(i-55296<<10)+(u-56320)+65536)}}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){"use strict";var r=n(9),o=n(10),i=n(25),u=n(15),a=n(26),c=n(27),l=n(28),f=n(44),s=n(46),d=n(45)("iterator"),h=!([].keys&&"next"in[].keys()),v="@@iterator",_="keys",p="values",y=function(){return this};t.exports=function(t,e,n,b,g,m,x){l(n,e,b);var S,E,M,O=function(t){if(!h&&t in k)return k[t];switch(t){case _:return function(){return new n(this,t)};case p:return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",P=g==p,j=!1,k=t.prototype,T=k[d]||k[v]||g&&k[g],A=T||O(g),R=g?P?O("entries"):A:void 0,L="Array"==e?k.entries||T:T;if(L&&(M=s(L.call(new t)),M!==Object.prototype&&(f(M,w,!0),r||a(M,d)||u(M,d,y))),P&&T&&T.name!==p&&(j=!0,A=function(){return T.call(this)}),r&&!x||!h&&!j&&k[d]||u(k,d,A),c[e]=A,c[w]=y,g)if(S={values:P?A:O(p),keys:m?A:O(_),entries:R},x)for(E in S)E in k||i(k,E,S[E]);else o(o.P+o.F*(h||j),e,S);return S}},function(t,e){t.exports=!0},function(t,e,n){var r=n(11),o=n(12),i=n(13),u=n(15),a="prototype",c=function(t,e,n){var l,f,s,d=t&c.F,h=t&c.G,v=t&c.S,_=t&c.P,p=t&c.B,y=t&c.W,b=h?o:o[e]||(o[e]={}),g=b[a],m=h?r:v?r[e]:(r[e]||{})[a];h&&(n=e);for(l in n)f=!d&&m&&void 0!==m[l],f&&l in b||(s=f?m[l]:n[l],b[l]=h&&"function"!=typeof m[l]?n[l]:p&&f?i(s,r):y&&m[l]==s?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e[a]=t[a],e}(s):_&&"function"==typeof s?i(Function.call,s):s,_&&((b.virtual||(b.virtual={}))[l]=s,t&c.R&&g&&!g[l]&&u(g,l,s)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(14);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var r=n(16),o=n(24);t.exports=n(20)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(17),o=n(19),i=n(23),u=Object.defineProperty;e.f=n(20)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(18);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){t.exports=!n(20)&&!n(21)(function(){return 7!=Object.defineProperty(n(22)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){t.exports=!n(21)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var r=n(18),o=n(11).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(18);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){t.exports=n(15)},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e){t.exports={}},function(t,e,n){"use strict";var r=n(29),o=n(24),i=n(44),u={};n(15)(u,n(45)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},function(t,e,n){var r=n(17),o=n(30),i=n(42),u=n(39)("IE_PROTO"),a=function(){},c="prototype",l=function(){var t,e=n(22)("iframe"),r=i.length,o="<",u=">";for(e.style.display="none",n(43).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(o+"script"+u+"document.F=Object"+o+"/script"+u),t.close(),l=t.F;r--;)delete l[c][i[r]];return l()};t.exports=Object.create||function(t,e){var n;return null!==t?(a[c]=r(t),n=new a,a[c]=null,n[u]=t):n=l(),void 0===e?n:o(n,e)}},function(t,e,n){var r=n(16),o=n(17),i=n(31);t.exports=n(20)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),a=u.length,c=0;a>c;)r.f(t,n=u[c++],e[n]);return t}},function(t,e,n){var r=n(32),o=n(42);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e,n){var r=n(26),o=n(33),i=n(36)(!1),u=n(39)("IE_PROTO");t.exports=function(t,e){var n,a=o(t),c=0,l=[];for(n in a)n!=u&&r(a,n)&&l.push(n);for(;e.length>c;)r(a,n=e[c++])&&(~i(l,n)||l.push(n));return l}},function(t,e,n){var r=n(34),o=n(7);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(35);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(33),o=n(37),i=n(38);t.exports=function(t){return function(e,n,u){var a,c=r(e),l=o(c.length),f=i(u,l);if(t&&n!=n){for(;l>f;)if(a=c[f++],a!=a)return!0}else for(;l>f;f++)if((t||f in c)&&c[f]===n)return t||f||0;return!t&&-1}}},function(t,e,n){var r=n(6),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e,n){var r=n(6),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},function(t,e,n){var r=n(40)("keys"),o=n(41);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e,n){var r=n(11),o="__core-js_shared__",i=r[o]||(r[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){t.exports=n(11).document&&document.documentElement},function(t,e,n){var r=n(16).f,o=n(26),i=n(45)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e,n){var r=n(40)("wks"),o=n(41),i=n(11).Symbol,u="function"==typeof i,a=t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))};a.store=r},function(t,e,n){var r=n(26),o=n(47),i=n(39)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){var r=n(7);t.exports=function(t){return Object(r(t))}},function(t,e,n){"use strict";var r=n(13),o=n(10),i=n(47),u=n(49),a=n(50),c=n(37),l=n(51),f=n(52);o(o.S+o.F*!n(54)(function(t){Array.from(t)}),"Array",{from:function(t){var e,n,o,s,d=i(t),h="function"==typeof this?this:Array,v=arguments.length,_=v>1?arguments[1]:void 0,p=void 0!==_,y=0,b=f(d);if(p&&(_=r(_,v>2?arguments[2]:void 0,2)),void 0==b||h==Array&&a(b))for(e=c(d.length),n=new h(e);e>y;y++)l(n,y,p?_(d[y],y):d[y]);else for(s=b.call(d),n=new h;!(o=s.next()).done;y++)l(n,y,p?u(s,_,[o.value,y],!0):o.value);return n.length=y,n}})},function(t,e,n){var r=n(17);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},function(t,e,n){var r=n(27),o=n(45)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},function(t,e,n){"use strict";var r=n(16),o=n(24);t.exports=function(t,e,n){e in t?r.f(t,e,o(0,n)):t[e]=n}},function(t,e,n){var r=n(53),o=n(45)("iterator"),i=n(27);t.exports=n(12).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,e,n){var r=n(35),o=n(45)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(a=r(e))&&"function"==typeof e.callee?"Arguments":a}},function(t,e,n){var r=n(45)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},function(t,e,n){t.exports={default:n(56),__esModule:!0}},function(t,e,n){n(4),n(57),t.exports=n(61).f("iterator")},function(t,e,n){n(58);for(var r=n(11),o=n(15),i=n(27),u=n(45)("toStringTag"),a=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],c=0;c<5;c++){var l=a[c],f=r[l],s=f&&f.prototype;s&&!s[u]&&o(s,u,l),i[l]=i.Array}},function(t,e,n){"use strict";var r=n(59),o=n(60),i=n(27),u=n(33);t.exports=n(8)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){e.f=n(45)},function(t,e,n){t.exports={default:n(63),__esModule:!0}},function(t,e,n){n(64),n(75),n(76),n(77),t.exports=n(12).Symbol},function(t,e,n){"use strict";var r=n(11),o=n(26),i=n(20),u=n(10),a=n(25),c=n(65).KEY,l=n(21),f=n(40),s=n(44),d=n(41),h=n(45),v=n(61),_=n(66),p=n(67),y=n(68),b=n(71),g=n(17),m=n(33),x=n(23),S=n(24),E=n(29),M=n(72),O=n(74),w=n(16),P=n(31),j=O.f,k=w.f,T=M.f,A=r.Symbol,R=r.JSON,L=R&&R.stringify,I="prototype",D=h("_hidden"),C=h("toPrimitive"),N={}.propertyIsEnumerable,F=f("symbol-registry"),H=f("symbols"),z=f("op-symbols"),B=Object[I],G="function"==typeof A,W=r.QObject,V=!W||!W[I]||!W[I].findChild,U=i&&l(function(){return 7!=E(k({},"a",{get:function(){return k(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=j(B,e);r&&delete B[e],k(t,e,n),r&&t!==B&&k(B,e,r)}:k,X=function(t){var e=H[t]=E(A[I]);return e._k=t,e},q=G&&"symbol"==typeof A.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof A},K=function(t,e,n){return t===B&&K(z,e,n),g(t),e=x(e,!0),g(n),o(H,e)?(n.enumerable?(o(t,D)&&t[D][e]&&(t[D][e]=!1),n=E(n,{enumerable:S(0,!1)})):(o(t,D)||k(t,D,S(1,{})),t[D][e]=!0),U(t,e,n)):k(t,e,n)},J=function(t,e){g(t);for(var n,r=y(e=m(e)),o=0,i=r.length;i>o;)K(t,n=r[o++],e[n]);return t},Y=function(t,e){return void 0===e?E(t):J(E(t),e)},Q=function(t){var e=N.call(this,t=x(t,!0));return!(this===B&&o(H,t)&&!o(z,t))&&(!(e||!o(this,t)||!o(H,t)||o(this,D)&&this[D][t])||e)},Z=function(t,e){if(t=m(t),e=x(e,!0),t!==B||!o(H,e)||o(z,e)){var n=j(t,e);return!n||!o(H,e)||o(t,D)&&t[D][e]||(n.enumerable=!0),n}},$=function(t){for(var e,n=T(m(t)),r=[],i=0;n.length>i;)o(H,e=n[i++])||e==D||e==c||r.push(e);return r},tt=function(t){for(var e,n=t===B,r=T(n?z:m(t)),i=[],u=0;r.length>u;)!o(H,e=r[u++])||n&&!o(B,e)||i.push(H[e]);return i};G||(A=function(){if(this instanceof A)throw TypeError("Symbol is not a constructor!");var t=d(arguments.length>0?arguments[0]:void 0),e=function(n){this===B&&e.call(z,n),o(this,D)&&o(this[D],t)&&(this[D][t]=!1),U(this,t,S(1,n))};return i&&V&&U(B,t,{configurable:!0,set:e}),X(t)},a(A[I],"toString",function(){return this._k}),O.f=Z,w.f=K,n(73).f=M.f=$,n(70).f=Q,n(69).f=tt,i&&!n(9)&&a(B,"propertyIsEnumerable",Q,!0),v.f=function(t){return X(h(t))}),u(u.G+u.W+u.F*!G,{Symbol:A});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)h(et[nt++]);for(var et=P(h.store),nt=0;et.length>nt;)_(et[nt++]);u(u.S+u.F*!G,"Symbol",{for:function(t){return o(F,t+="")?F[t]:F[t]=A(t)},keyFor:function(t){if(q(t))return p(F,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){V=!0},useSimple:function(){V=!1}}),u(u.S+u.F*!G,"Object",{create:Y,defineProperty:K,defineProperties:J,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt}),R&&u(u.S+u.F*(!G||l(function(){var t=A();return"[null]"!=L([t])||"{}"!=L({a:t})||"{}"!=L(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!q(t)){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);return e=r[1],"function"==typeof e&&(n=e),!n&&b(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!q(e))return e}),r[1]=e,L.apply(R,r)}}}),A[I][C]||n(15)(A[I],C,A[I].valueOf),s(A,"Symbol"),s(Math,"Math",!0),s(r.JSON,"JSON",!0)},function(t,e,n){var r=n(41)("meta"),o=n(18),i=n(26),u=n(16).f,a=0,c=Object.isExtensible||function(){return!0},l=!n(21)(function(){return c(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}})},s=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!c(t))return"F";if(!e)return"E";f(t)}return t[r].i},d=function(t,e){if(!i(t,r)){if(!c(t))return!0;if(!e)return!1;f(t)}return t[r].w},h=function(t){return l&&v.NEED&&c(t)&&!i(t,r)&&f(t),t},v=t.exports={KEY:r,NEED:!1,fastKey:s,getWeak:d,onFreeze:h}},function(t,e,n){var r=n(11),o=n(12),i=n(9),u=n(61),a=n(16).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||a(e,t,{value:u.f(t)})}},function(t,e,n){var r=n(31),o=n(33);t.exports=function(t,e){for(var n,i=o(t),u=r(i),a=u.length,c=0;a>c;)if(i[n=u[c++]]===e)return n}},function(t,e,n){var r=n(31),o=n(69),i=n(70);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,a=n(t),c=i.f,l=0;a.length>l;)c.call(t,u=a[l++])&&e.push(u);return e}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var r=n(35);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(33),o=n(73).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?a(t):o(r(t))}},function(t,e,n){var r=n(32),o=n(42).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,e,n){var r=n(70),o=n(24),i=n(33),u=n(23),a=n(26),c=n(19),l=Object.getOwnPropertyDescriptor;e.f=n(20)?l:function(t,e){if(t=i(t),e=u(e,!0),c)try{return l(t,e)}catch(t){}if(a(t,e))return o(!r.f.call(t,e),t[e])}},function(t,e){},function(t,e,n){n(66)("asyncIterator")},function(t,e,n){n(66)("observable")},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(79),u=r(i),a=n(82),c=r(a),l=n(86),f=r(l);Object.defineProperty(e,"__esModule",{value:!0}),e.SmoothScrollbar=void 0;var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,f.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),d=n(89),h=n(112);e.SmoothScrollbar=function(){function t(e){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,t),e.setAttribute("tabindex","1"),e.scrollTop=e.scrollLeft=0;var i=(0,h.findChild)(e,"scroll-content"),a=(0,h.findChild)(e,"overscroll-glow"),l=(0,h.findChild)(e,"scrollbar-track-x"),f=(0,h.findChild)(e,"scrollbar-track-y");if((0,h.setStyle)(e,{overflow:"hidden",outline:"none"}),(0,h.setStyle)(a,{display:"none","pointer-events":"none"}),this.__readonly("targets",(0,c.default)({container:e,content:i,canvas:{elem:a,context:a.getContext("2d")},xAxis:(0,c.default)({track:l,thumb:(0,h.findChild)(l,"scrollbar-thumb-x")}),yAxis:(0,c.default)({track:f,thumb:(0,h.findChild)(f,"scrollbar-thumb-y")})})).__readonly("offset",{x:0,y:0}).__readonly("thumbOffset",{x:0,y:0}).__readonly("limit",{x:1/0,y:1/0}).__readonly("movement",{x:0,y:0}).__readonly("movementLocked",{x:!1,y:!1}).__readonly("overscrollRendered",{x:0,y:0}).__readonly("overscrollBack",!1).__readonly("thumbSize",{x:0,y:0,realX:0,realY:0}).__readonly("bounding",{top:0,right:0,bottom:0,left:0}).__readonly("children",[]).__readonly("parents",[]).__readonly("size",this.getSize()).__readonly("isNestedScrollbar",!1),(0,u.default)(this,{__hideTrackThrottle:{value:(0,h.debounce)(this.hideTrack.bind(this),1e3,!1)},__updateThrottle:{value:(0,h.debounce)(this.update.bind(this))},__touchRecord:{value:new h.TouchRecord},__listeners:{value:[]},__handlers:{value:[]},__children:{value:[]},__timerID:{value:{}}}),this.__initOptions(r),this.__initReverseWheel(),this.__initScrollbar(),d.sbList.set(e,this),"function"==typeof d.GLOBAL_ENV.MutationObserver){var s=new d.GLOBAL_ENV.MutationObserver(function(){n.update(!0)});s.observe(i,{childList:!0}),Object.defineProperty(this,"__observer",{value:s})}}return s(t,[{key:"MAX_OVERSCROLL",get:function(){var t=this.options,e=this.size;switch(t.overscrollEffect){case"bounce":var n=Math.floor(Math.sqrt(Math.pow(e.container.width,2)+Math.pow(e.container.height,2))),r=this.__isMovementLocked()?2:10;return d.GLOBAL_ENV.TOUCH_SUPPORTED?(0,h.pickInRange)(n/r,100,1e3):(0,h.pickInRange)(n/10,25,50);case"glow":return 150;default:return 0}}},{key:"scrollTop",get:function(){return this.offset.y}},{key:"scrollLeft",get:function(){return this.offset.x}}]),t}()},function(t,e,n){t.exports={default:n(80),__esModule:!0}},function(t,e,n){n(81);var r=n(12).Object;t.exports=function(t,e){return r.defineProperties(t,e)}},function(t,e,n){var r=n(10);r(r.S+r.F*!n(20),"Object",{defineProperties:n(30)})},function(t,e,n){t.exports={default:n(83),__esModule:!0}},function(t,e,n){n(84),t.exports=n(12).Object.freeze},function(t,e,n){var r=n(18),o=n(65).onFreeze;n(85)("freeze",function(t){return function(e){return t&&r(e)?t(o(e)):e}})},function(t,e,n){var r=n(10),o=n(12),i=n(21);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},function(t,e,n){t.exports={default:n(87),__esModule:!0}},function(t,e,n){n(88);var r=n(12).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(10);r(r.S+r.F*!n(20),"Object",{defineProperty:n(16).f})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(93);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){t.exports={default:n(91),__esModule:!0}},function(t,e,n){n(92),t.exports=n(12).Object.keys},function(t,e,n){var r=n(47),o=n(31);n(85)("keys",function(){return function(t){return o(r(t))}})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(94);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(95);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(111);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=function(t){var e={},n={};return(0,a.default)(t).forEach(function(r){(0,i.default)(e,r,{get:function(){if(!n.hasOwnProperty(r)){var e=t[r];n[r]=e()}return n[r]}})}),e},l={MutationObserver:function(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver},TOUCH_SUPPORTED:function(){return"ontouchstart"in document},EASING_MULTIPLIER:function(){return navigator.userAgent.match(/Android/)?.5:.25},WHEEL_EVENT:function(){return"onwheel"in window?"wheel":"mousewheel"}};e.GLOBAL_ENV=c(l)},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(96),i=r(o);Object.defineProperty(e,"__esModule",{value:!0});var u=new i.default,a=u.set.bind(u),c=u.delete.bind(u);u.update=function(){u.forEach(function(t){t.__updateTree()})},u.delete=function(){var t=c.apply(void 0,arguments);return u.update(),t},u.set=function(){var t=a.apply(void 0,arguments);return u.update(),t},e.sbList=u},function(t,e,n){t.exports={default:n(97),__esModule:!0}},function(t,e,n){n(75),n(4),n(57),n(98),n(108),t.exports=n(12).Map},function(t,e,n){"use strict";var r=n(99);t.exports=n(104)("Map",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var e=r.getEntry(this,t);return e&&e.v},set:function(t,e){return r.def(this,0===t?0:t,e)}},r,!0)},function(t,e,n){"use strict";var r=n(16).f,o=n(29),i=n(100),u=n(13),a=n(101),c=n(7),l=n(102),f=n(8),s=n(60),d=n(103),h=n(20),v=n(65).fastKey,_=h?"_s":"size",p=function(t,e){var n,r=v(e);if("F"!==r)return t._i[r];for(n=t._f;n;n=n.n)if(n.k==e)return n};t.exports={getConstructor:function(t,e,n,f){var s=t(function(t,r){a(t,s,e,"_i"),t._i=o(null),t._f=void 0,t._l=void 0,t[_]=0,void 0!=r&&l(r,n,t[f],t)});return i(s.prototype,{clear:function(){for(var t=this,e=t._i,n=t._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete e[n.i];t._f=t._l=void 0,t[_]=0},delete:function(t){var e=this,n=p(e,t);if(n){var r=n.n,o=n.p;delete e._i[n.i],n.r=!0,o&&(o.n=r),r&&(r.p=o),e._f==n&&(e._f=r),e._l==n&&(e._l=o),e[_]--}return!!n},forEach:function(t){a(this,s,"forEach");for(var e,n=u(t,arguments.length>1?arguments[1]:void 0,3);e=e?e.n:this._f;)for(n(e.v,e.k,this);e&&e.r;)e=e.p},has:function(t){return!!p(this,t)}}),h&&r(s.prototype,"size",{get:function(){return c(this[_])}}),s},def:function(t,e,n){var r,o,i=p(t,e);return i?i.v=n:(t._l=i={i:o=v(e,!0),k:e,v:n,p:r=t._l,n:void 0,r:!1},t._f||(t._f=i),r&&(r.n=i),t[_]++,"F"!==o&&(t._i[o]=i)),t},getEntry:p,setStrong:function(t,e,n){f(t,e,function(t,e){this._t=t,this._k=e,this._l=void 0},function(){for(var t=this,e=t._k,n=t._l;n&&n.r;)n=n.p;return t._t&&(t._l=n=n?n.n:t._t._f)?"keys"==e?s(0,n.k):"values"==e?s(0,n.v):s(0,[n.k,n.v]):(t._t=void 0,s(1))},n?"entries":"values",!n,!0),d(e)}}},function(t,e,n){var r=n(15);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var r=n(13),o=n(49),i=n(50),u=n(17),a=n(37),c=n(52),l={},f={},e=t.exports=function(t,e,n,s,d){var h,v,_,p,y=d?function(){return t}:c(t),b=r(n,s,e?2:1),g=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(i(y)){for(h=a(t.length);h>g;g++)if(p=e?b(u(v=t[g])[0],v[1]):b(t[g]),p===l||p===f)return p}else for(_=y.call(t);!(v=_.next()).done;)if(p=o(_,b,v.value,e),p===l||p===f)return p};e.BREAK=l,e.RETURN=f},function(t,e,n){"use strict";var r=n(11),o=n(12),i=n(16),u=n(20),a=n(45)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[a]&&i.f(e,a,{configurable:!0,get:function(){return this}})}},function(t,e,n){"use strict";var r=n(11),o=n(10),i=n(65),u=n(21),a=n(15),c=n(100),l=n(102),f=n(101),s=n(18),d=n(44),h=n(16).f,v=n(105)(0),_=n(20);t.exports=function(t,e,n,p,y,b){var g=r[t],m=g,x=y?"set":"add",S=m&&m.prototype,E={};return _&&"function"==typeof m&&(b||S.forEach&&!u(function(){(new m).entries().next()}))?(m=e(function(e,n){f(e,m,t,"_c"),e._c=new g,void 0!=n&&l(n,y,e[x],e)}),v("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(t){var e="add"==t||"set"==t;t in S&&(!b||"clear"!=t)&&a(m.prototype,t,function(n,r){if(f(this,m,t),!e&&b&&!s(n))return"get"==t&&void 0;var o=this._c[t](0===n?0:n,r);return e?this:o})}),"size"in S&&h(m.prototype,"size",{get:function(){return this._c.size}})):(m=p.getConstructor(e,t,y,x),c(m.prototype,n),i.NEED=!0),d(m,t),E[t]=m,o(o.G+o.W+o.F,E),b||p.setStrong(m,t,y),m}},function(t,e,n){var r=n(13),o=n(34),i=n(47),u=n(37),a=n(106);t.exports=function(t,e){var n=1==t,c=2==t,l=3==t,f=4==t,s=6==t,d=5==t||s,h=e||a;return function(e,a,v){for(var _,p,y=i(e),b=o(y),g=r(a,v,3),m=u(b.length),x=0,S=n?h(e,m):c?h(e,0):void 0;m>x;x++)if((d||x in b)&&(_=b[x],p=g(_,x,y),t))if(n)S[x]=p;else if(p)switch(t){case 3:return!0;case 5:return _;case 6:return x;case 2:S.push(_)}else if(f)return!1;return s?-1:l||f?f:S}}},function(t,e,n){var r=n(107);t.exports=function(t,e){return new(r(t))(e)}},function(t,e,n){var r=n(18),o=n(71),i=n(45)("species");t.exports=function(t){var e;return o(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!o(e.prototype)||(e=void 0),r(e)&&(e=e[i],null===e&&(e=void 0))),void 0===e?Array:e}},function(t,e,n){var r=n(10);r(r.P+r.R,"Map",{toJSON:n(109)("Map")})},function(t,e,n){var r=n(53),o=n(110);t.exports=function(t){return function(){if(r(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},function(t,e,n){var r=n(102);t.exports=function(t,e){var n=[];return r(t,!1,n.push,n,e),n}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.selectors="scrollbar, [scrollbar], [data-scrollbar]"},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(113);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(114);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(115);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(116);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(117);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(118);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(119);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(120);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(121);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(122);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(123);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(124);(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})})},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.buildCurve=function(t,e){var n=[];if(e<=0)return n;for(var r=Math.round(e/1e3*60)-1,o=t?Math.pow(1/Math.abs(t),1/r):0,i=1;i<=r;i++)n.push(t-t*Math.pow(o,i));return n.push(t),n}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=100;e.debounce=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n,r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if("function"==typeof t){var o=void 0;return function(){for(var n=arguments.length,i=Array(n),u=0;u<n;u++)i[u]=arguments[u];!o&&r&&setTimeout(function(){return t.apply(void 0,i)}),clearTimeout(o),o=setTimeout(function(){o=void 0,t.apply(void 0,i)},e)}}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i);Object.defineProperty(e,"__esModule",{value:!0});e.findChild=function(t,e){
var n=t.children,r=null;return n&&[].concat(o(n)).some(function(t){if(t.className.match(e))return r=t,!0}),r}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={STANDARD:1,OTHERS:-3},r=[1,28,500],o=function(t){return r[t]||r[0]};e.getDelta=function(t){if("deltaX"in t){var e=o(t.deltaMode);return{x:t.deltaX/n.STANDARD*e,y:t.deltaY/n.STANDARD*e}}return"wheelDeltaX"in t?{x:t.wheelDeltaX/n.OTHERS,y:t.wheelDeltaY/n.OTHERS}:{x:0,y:t.wheelDelta/n.OTHERS}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.getPointerData=function(t){return t.touches?t.touches[t.touches.length-1]:t}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getPosition=void 0;var r=n(118);e.getPosition=function(t){var e=(0,r.getPointerData)(t);return{x:e.clientX,y:e.clientY}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getTouchID=void 0;var r=n(118);e.getTouchID=function(t){var e=(0,r.getPointerData)(t);return e.identifier}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.isOneOf=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return e.some(function(e){return t===e})}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.pickInRange=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-(1/0),n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0;return Math.max(e,Math.min(t,n))}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(90),i=r(o);Object.defineProperty(e,"__esModule",{value:!0});var u=["webkit","moz","ms","o"],a=new RegExp("^-(?!(?:"+u.join("|")+")-)"),c=function(t){var e={};return(0,i.default)(t).forEach(function(n){if(!a.test(n))return void(e[n]=t[n]);var r=t[n];n=n.replace(/^-/,""),e[n]=r,u.forEach(function(t){e["-"+t+"-"+n]=r})}),e};e.setStyle=function(t,e){e=c(e),(0,i.default)(e).forEach(function(n){var r=n.replace(/^-/,"").replace(/-([a-z])/g,function(t,e){return e.toUpperCase()});t.style[r]=e[n]})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var u=n(2),a=r(u),c=n(86),l=r(c),f=n(125),s=r(f);Object.defineProperty(e,"__esModule",{value:!0}),e.TouchRecord=void 0;var d=s.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},h=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,l.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),v=n(119),_=function(){function t(e){i(this,t),this.updateTime=Date.now(),this.delta={x:0,y:0},this.velocity={x:0,y:0},this.lastPosition=(0,v.getPosition)(e)}return h(t,[{key:"update",value:function(t){var e=this.velocity,n=this.updateTime,r=this.lastPosition,o=Date.now(),i=(0,v.getPosition)(t),u={x:-(i.x-r.x),y:-(i.y-r.y)},a=o-n||16,c=u.x/a*1e3,l=u.y/a*1e3;e.x=.8*c+.2*e.x,e.y=.8*l+.2*e.y,this.delta=u,this.updateTime=o,this.lastPosition=i}}]),t}();e.TouchRecord=function(){function t(){i(this,t),this.touchList={},this.lastTouch=null,this.activeTouchID=void 0}return h(t,[{key:"__add",value:function(t){if(this.__has(t))return null;var e=new _(t);return this.touchList[t.identifier]=e,e}},{key:"__renew",value:function(t){if(!this.__has(t))return null;var e=this.touchList[t.identifier];return e.update(t),e}},{key:"__delete",value:function(t){return delete this.touchList[t.identifier]}},{key:"__has",value:function(t){return this.touchList.hasOwnProperty(t.identifier)}},{key:"__setActiveID",value:function(t){this.activeTouchID=t[t.length-1].identifier,this.lastTouch=this.touchList[this.activeTouchID]}},{key:"__getActiveTracker",value:function(){var t=this.touchList,e=this.activeTouchID;return t[e]}},{key:"isActive",value:function(){return void 0!==this.activeTouchID}},{key:"getDelta",value:function(){var t=this.__getActiveTracker();return t?d({},t.delta):this.__primitiveValue}},{key:"getVelocity",value:function(){var t=this.__getActiveTracker();return t?d({},t.velocity):this.__primitiveValue}},{key:"getLastPosition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=this.__getActiveTracker()||this.lastTouch,n=e?e.lastPosition:this.__primitiveValue;return t?n.hasOwnProperty(t)?n[t]:0:d({},n)}},{key:"updatedRecently",value:function(){var t=this.__getActiveTracker();return t&&Date.now()-t.updateTime<30}},{key:"track",value:function(t){var e=this,n=t.targetTouches;return[].concat(o(n)).forEach(function(t){e.__add(t)}),this.touchList}},{key:"update",value:function(t){var e=this,n=t.touches,r=t.changedTouches;return[].concat(o(n)).forEach(function(t){e.__renew(t)}),this.__setActiveID(r),this.touchList}},{key:"release",value:function(t){var e=this;return this.activeTouchID=void 0,[].concat(o(t.changedTouches)).forEach(function(t){e.__delete(t)}),this.touchList}},{key:"__primitiveValue",get:function(){return{x:0,y:0}}}]),t}()},function(t,e,n){t.exports={default:n(126),__esModule:!0}},function(t,e,n){n(127),t.exports=n(12).Object.assign},function(t,e,n){var r=n(10);r(r.S+r.F,"Object",{assign:n(128)})},function(t,e,n){"use strict";var r=n(31),o=n(69),i=n(70),u=n(47),a=n(34),c=Object.assign;t.exports=!c||n(21)(function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t}),7!=c({},t)[n]||Object.keys(c({},e)).join("")!=r})?function(t,e){for(var n=u(t),c=arguments.length,l=1,f=o.f,s=i.f;c>l;)for(var d,h=a(arguments[l++]),v=f?r(h).concat(f(h)):r(h),_=v.length,p=0;_>p;)s.call(h,d=v[p++])&&(n[d]=h[d]);return n}:c},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(130);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(131);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(132);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(133);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(134);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(135);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(136);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(137);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(138);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(139);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(140);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(141);(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})});var g=n(142);(0,a.default)(g).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return g[t]}})});var m=n(143);(0,a.default)(m).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return m[t]}})});var x=n(144);(0,a.default)(x).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return x[t]}})});var S=n(145);(0,a.default)(S).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return S[t]}})})},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.clearMovement=r.SmoothScrollbar.prototype.stop=function(){this.movement.x=this.movement.y=0,cancelAnimationFrame(this.__timerID.scrollTo)}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i),a=n(78),c=n(112),l=n(89);a.SmoothScrollbar.prototype.destroy=function(t){var e=this.__listeners,n=this.__handlers,r=this.__observer,i=this.targets,u=i.container,a=i.content;n.forEach(function(t){var e=t.evt,n=t.elem,r=t.fn;n.removeEventListener(e,r)}),n.length=e.length=0,this.stop(),cancelAnimationFrame(this.__timerID.render),r&&r.disconnect(),l.sbList.delete(u),t||this.scrollTo(0,0,300,function(){if(u.parentNode){(0,c.setStyle)(u,{overflow:""}),u.scrollTop=u.scrollLeft=0;for(var t=[].concat(o(a.childNodes));u.firstChild;)u.removeChild(u.firstChild);t.forEach(function(t){return u.appendChild(t)})}})}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.getContentElem=function(){return this.targets.content}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.getSize=function(){var t=this.targets.container,e=this.targets.content;return{container:{width:t.clientWidth,height:t.clientHeight},content:{width:e.offsetWidth-e.clientWidth+e.scrollWidth,height:e.offsetHeight-e.clientHeight+e.scrollHeight}}}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.infiniteScroll=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50;if("function"==typeof t){var n={x:0,y:0},r=!1;this.addListener(function(o){var i=o.offset,u=o.limit;u.y-i.y<=e&&i.y>n.y&&!r&&(r=!0,setTimeout(function(){return t(o)})),u.y-i.y>e&&(r=!1),n=i})}}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.isVisible=function(t){var e=this.bounding,n=t.getBoundingClientRect(),r=Math.max(e.top,n.top),o=Math.max(e.left,n.left),i=Math.min(e.right,n.right),u=Math.min(e.bottom,n.bottom);return r<u&&o<i}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.addListener=function(t){"function"==typeof t&&this.__listeners.push(t)},r.SmoothScrollbar.prototype.removeListener=function(t){"function"==typeof t&&this.__listeners.some(function(e,n,r){return e===t&&r.splice(n,1)})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e,n){return e in t?(0,l.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){return!!e.length&&e.some(function(e){return t.match(e)})}function u(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.REGIESTER,e=d[t];return function(){for(var n=arguments.length,r=Array(n),o=0;o<n;o++)r[o]=arguments[o];this.__handlers.forEach(function(n){var o=n.elem,u=n.evt,a=n.fn,c=n.hasRegistered;c&&t===s.REGIESTER||!c&&t===s.UNREGIESTER||i(u,r)&&(o[e](u,a),n.hasRegistered=!c)})}}var a,c=n(86),l=r(c),f=n(78),s={REGIESTER:0,UNREGIESTER:1},d=(a={},o(a,s.REGIESTER,"addEventListener"),o(a,s.UNREGIESTER,"removeEventListener"),a);f.SmoothScrollbar.prototype.registerEvents=u(s.REGIESTER),f.SmoothScrollbar.prototype.unregisterEvents=u(s.UNREGIESTER)},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.reverseWheel=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.wheelReversed="boolean"==typeof t&&t,this.__readonly("wheelReversed",this.wheelReversed)}},function(t,e,n){"use strict";var r=n(78);r.SmoothScrollbar.prototype.scrollIntoView=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.alignToTop,r=void 0===n||n,o=e.onlyScrollIfNeeded,i=void 0!==o&&o,u=e.offsetTop,a=void 0===u?0:u,c=e.offsetLeft,l=void 0===c?0:c,f=e.offsetBottom,s=void 0===f?0:f,d=this.targets,h=this.bounding;if(t&&d.container.contains(t)){var v=t.getBoundingClientRect();i&&this.isVisible(t)||this.__setMovement(v.left-h.left-l,r?v.top-h.top-a:v.bottom-h.bottom-s)}}},function(t,e,n){"use strict";var r=n(112),o=n(78);o.SmoothScrollbar.prototype.scrollTo=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.offset.x,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.offset.y,n=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,u=this.options,a=this.offset,c=this.limit,l=this.__timerID;cancelAnimationFrame(l.scrollTo),i="function"==typeof i?i:function(){},u.renderByPixels&&(t=Math.round(t),e=Math.round(e));var f=a.x,s=a.y,d=(0,r.pickInRange)(t,0,c.x)-f,h=(0,r.pickInRange)(e,0,c.y)-s,v=(0,r.buildCurve)(d,o),_=(0,r.buildCurve)(h,o),p=v.length,y=0,b=function t(){n.setPosition(f+v[y],s+_[y]),y++,y===p?requestAnimationFrame(function(){i(n)}):l.scrollTo=requestAnimationFrame(t)};b()}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(90),i=r(o),u=n(78);u.SmoothScrollbar.prototype.setOptions=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,i.default)(e).forEach(function(n){t.options.hasOwnProperty(n)&&void 0!==e[n]&&(t.options[n]=e[n])})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(125),i=r(o),u=i.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},a=n(112),c=n(78);c.SmoothScrollbar.prototype.setPosition=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.offset.x,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.offset.y,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.__hideTrackThrottle();var r={},o=this.options,i=this.offset,c=this.limit,l=this.targets,f=this.__listeners;o.renderByPixels&&(t=Math.round(t),e=Math.round(e)),t!==i.x&&this.showTrack("x"),e!==i.y&&this.showTrack("y"),t=(0,a.pickInRange)(t,0,c.x),e=(0,a.pickInRange)(e,0,c.y),t===i.x&&e===i.y||(r.direction={x:t===i.x?"none":t>i.x?"right":"left",y:e===i.y?"none":e>i.y?"down":"up"},this.__readonly("offset",{x:t,y:e}),r.limit=u({},c),r.offset=u({},this.offset),this.__setThumbPosition(),(0,a.setStyle)(l.content,{"-transform":"translate3d("+-t+"px, "+-e+"px, 0)"}),n||f.forEach(function(t){o.syncCallbacks?t(r):requestAnimationFrame(function(){t(r)})}))}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e,n){return e in t?(0,c.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f.SHOW,e=d[t];return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"both",r=this.options,o=this.movement,i=this.targets,u=i.container,a=i.xAxis,c=i.yAxis;o.x||o.y?u.classList.add(s.CONTAINER):u.classList.remove(s.CONTAINER),r.alwaysShowTracks&&t===f.HIDE||(n=n.toLowerCase(),"both"===n&&(a.track.classList[e](s.TRACK),c.track.classList[e](s.TRACK)),"x"===n&&a.track.classList[e](s.TRACK),"y"===n&&c.track.classList[e](s.TRACK))}}var u,a=n(86),c=r(a),l=n(78),f={SHOW:0,HIDE:1},s={TRACK:"show",CONTAINER:"scrolling"},d=(u={},o(u,f.SHOW,"add"),o(u,f.HIDE,"remove"),u);l.SmoothScrollbar.prototype.showTrack=i(f.SHOW),l.SmoothScrollbar.prototype.hideTrack=i(f.HIDE)},function(t,e,n){"use strict";function r(){if("glow"===this.options.overscrollEffect){var t=this.targets,e=this.size,n=t.canvas,r=n.elem,o=n.context,i=window.devicePixelRatio||1,u=e.container.width*i,a=e.container.height*i;u===r.width&&a===r.height||(r.width=u,r.height=a,o.scale(i,i))}}function o(){var t=this.size,e=this.thumbSize,n=this.targets,r=n.xAxis,o=n.yAxis;(0,u.setStyle)(r.track,{display:t.content.width<=t.container.width?"none":"block"}),(0,u.setStyle)(o.track,{display:t.content.height<=t.container.height?"none":"block"}),(0,u.setStyle)(r.thumb,{width:e.x+"px"}),(0,u.setStyle)(o.thumb,{height:e.y+"px"})}function i(){var t=this.options;this.__updateBounding();var e=this.getSize(),n={x:Math.max(e.content.width-e.container.width,0),y:Math.max(e.content.height-e.container.height,0)},i={realX:e.container.width/e.content.width*e.container.width,realY:e.container.height/e.content.height*e.container.height};i.x=Math.max(i.realX,t.thumbMinSize),i.y=Math.max(i.realY,t.thumbMinSize),this.__readonly("size",e).__readonly("limit",n).__readonly("thumbSize",i),o.call(this),r.call(this),this.setPosition(),this.__setThumbPosition()}var u=n(112),a=n(78);a.SmoothScrollbar.prototype.update=function(t){t?requestAnimationFrame(i.bind(this)):i.call(this)}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(147);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(148);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(149);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(150);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(155);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(156);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(157);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(158);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this.limit,i=this.options,u=this.movement;this.__updateThrottle(),i.renderByPixels&&(t=Math.round(t),e=Math.round(e));var a=u.x+t,l=u.y+e;0===r.x&&(a=0),0===r.y&&(l=0);var f=this.__getDeltaLimit(n);u.x=c.pickInRange.apply(void 0,[a].concat(o(f.x))),u.y=c.pickInRange.apply(void 0,[l].concat(o(f.y)))}var u=n(2),a=r(u),c=n(112),l=n(78);Object.defineProperty(l.SmoothScrollbar.prototype,"__addMovement",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=this.movement,n=this.movementLocked;a.forEach(function(r){n[r]=e[r]&&t.__willOverscroll(r,e[r])})}function o(){var t=this.movementLocked;a.forEach(function(e){t[e]=!1})}function i(){var t=this.movementLocked;return t.x||t.y}var u=n(78),a=["x","y"];Object.defineProperty(u.SmoothScrollbar.prototype,"__autoLockMovement",{value:r,writable:!0,configurable:!0}),Object.defineProperty(u.SmoothScrollbar.prototype,"__unlockMovement",{value:o,writable:!0,configurable:!0}),Object.defineProperty(u.SmoothScrollbar.prototype,"__isMovementLocked",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(t){var e=this.options,n=this.movement,r=this.overscrollRendered,o=this.MAX_OVERSCROLL,i=n[t]=(0,h.pickInRange)(n[t],-o,o),u=e.overscrollDamping,a=r[t]+(i-r[t])*u;e.renderByPixels&&(a|=0),!this.__isMovementLocked()&&Math.abs(a-r[t])<.1&&(a-=i/Math.abs(i||1)),Math.abs(a)<Math.abs(r[t])&&this.__readonly("overscrollBack",!0),(a*r[t]<0||Math.abs(a)<=1)&&(a=0,this.__readonly("overscrollBack",!1)),r[t]=a}}function i(t){var e=this.__touchRecord,n=this.overscrollRendered;return n.x!==t.x||n.y!==t.y||!(!d.GLOBAL_ENV.TOUCH_SUPPORTED||!e.updatedRecently())}function u(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(e.length&&this.options.overscrollEffect){var n=this.options,r=this.overscrollRendered,u=l({},r);if(e.forEach(function(e){return o.call(t,e)}),i.call(this,u))switch(n.overscrollEffect){case"bounce":return s.overscrollBounce.call(this,r.x,r.y);case"glow":return s.overscrollGlow.call(this,r.x,r.y);default:return}}}var a=n(125),c=r(a),l=c.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},f=n(78),s=n(151),d=n(89),h=n(112);Object.defineProperty(f.SmoothScrollbar.prototype,"__renderOverscroll",{value:u,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(152);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(153);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(154);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})})},function(t,e,n){"use strict";function r(t,e){var n=this.size,r=this.offset,i=this.targets,u=this.thumbOffset,a=i.xAxis,c=i.yAxis,l=i.content;if((0,o.setStyle)(l,{"-transform":"translate3d("+-(r.x+t)+"px, "+-(r.y+e)+"px, 0)"}),t){var f=n.container.width/(n.container.width+Math.abs(t));(0,o.setStyle)(a.thumb,{"-transform":"translate3d("+u.x+"px, 0, 0) scale3d("+f+", 1, 1)","-transform-origin":t<0?"left":"right"})}if(e){var s=n.container.height/(n.container.height+Math.abs(e));(0,o.setStyle)(c.thumb,{"-transform":"translate3d(0, "+u.y+"px, 0) scale3d(1, "+s+", 1)","-transform-origin":e<0?"top":"bottom"})}}Object.defineProperty(e,"__esModule",{value:!0}),e.overscrollBounce=r;var o=n(112)},function(t,e,n){"use strict";function r(t,e){var n=this.size,r=this.targets,a=this.options,c=r.canvas,l=c.elem,f=c.context;return t||e?((0,u.setStyle)(l,{display:"block"}),f.clearRect(0,0,n.content.width,n.container.height),f.fillStyle=a.overscrollEffectColor,o.call(this,t),void i.call(this,e)):(0,u.setStyle)(l,{display:"none"})}function o(t){var e=this.size,n=this.targets,r=this.__touchRecord,o=this.MAX_OVERSCROLL,i=e.container,l=i.width,f=i.height,s=n.canvas.context;s.save(),t>0&&s.transform(-1,0,0,1,l,0);var d=(0,u.pickInRange)(Math.abs(t)/o,0,a),h=(0,u.pickInRange)(d,0,c)*l,v=Math.abs(t),_=r.getLastPosition("y")||f/2;s.globalAlpha=d,s.beginPath(),s.moveTo(0,-h),s.quadraticCurveTo(v,_,0,f+h),s.fill(),s.closePath(),s.restore()}function i(t){var e=this.size,n=this.targets,r=this.__touchRecord,o=this.MAX_OVERSCROLL,i=e.container,l=i.width,f=i.height,s=n.canvas.context;s.save(),t>0&&s.transform(1,0,0,-1,0,f);var d=(0,u.pickInRange)(Math.abs(t)/o,0,a),h=(0,u.pickInRange)(d,0,c)*l,v=r.getLastPosition("x")||l/2,_=Math.abs(t);s.globalAlpha=d,s.beginPath(),s.moveTo(-h,0),s.quadraticCurveTo(v,_,l+h,0),s.fill(),s.closePath(),s.restore()}Object.defineProperty(e,"__esModule",{value:!0}),e.overscrollGlow=r;var u=n(112),a=.75,c=.25},function(t,e,n){"use strict";function r(t){var e=this.options,n=this.offset,r=this.movement,o=this.__touchRecord,i=e.damping,u=e.renderByPixels,a=e.overscrollDamping,c=n[t],l=r[t],f=i;if(this.__willOverscroll(t,l)?f=a:o.isActive()&&(f=.5),Math.abs(l)<1){var s=c+l;return{movement:0,position:l>0?Math.ceil(s):Math.floor(s)}}var d=l*(1-f);return u&&(d|=0),{movement:d,position:c+l-d}}function o(){var t=this.options,e=this.offset,n=this.limit,i=this.movement,a=this.overscrollRendered,c=this.__timerID;if(i.x||i.y||a.x||a.y){var l=r.call(this,"x"),f=r.call(this,"y"),s=[];if(t.overscrollEffect){var d=(0,u.pickInRange)(l.position,0,n.x),h=(0,u.pickInRange)(f.position,0,n.y);(a.x||d===e.x&&i.x)&&s.push("x"),(a.y||h===e.y&&i.y)&&s.push("y")}this.movementLocked.x||(i.x=l.movement),this.movementLocked.y||(i.y=f.movement),this.setPosition(l.position,f.position),this.__renderOverscroll(s)}c.render=requestAnimationFrame(o.bind(this))}var i=n(78),u=n(112);Object.defineProperty(i.SmoothScrollbar.prototype,"__render",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this.options,i=this.movement;this.__updateThrottle();var u=this.__getDeltaLimit(n);r.renderByPixels&&(t=Math.round(t),e=Math.round(e)),i.x=c.pickInRange.apply(void 0,[t].concat(o(u.x))),i.y=c.pickInRange.apply(void 0,[e].concat(o(u.y)))}var u=n(2),a=r(u),c=n(112),l=n(78);Object.defineProperty(l.SmoothScrollbar.prototype,"__setMovement",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.options,r=this.offset,o=this.limit;if(!n.continuousScrolling)return!1;var u=(0,i.pickInRange)(t+r.x,0,o.x),a=(0,i.pickInRange)(e+r.y,0,o.y),c=!0;return c&=u===r.x,c&=a===r.y,c&=u===o.x||0===u||a===o.y||0===a}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__shouldPropagateMovement",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(!t)return!1;var n=this.offset,r=this.limit,o=n[t];return(0,i.pickInRange)(e+o,0,r[t])===o&&(0===o||o===r[t])}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__willOverscroll",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(160);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(161);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(162);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(169);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(170);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(171);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(172);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(173);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})})},function(t,e,n){"use strict";function r(){var t=this,e=this.targets,n=e.container,r=e.content,o=!1,u=void 0,a=void 0;Object.defineProperty(this,"__isDrag",{get:function(){return o},enumerable:!1});var c=function e(n){var r=n.x,o=n.y;if(r||o){var i=t.options.speed;t.__setMovement(r*i,o*i),u=requestAnimationFrame(function(){e({x:r,y:o})})}};this.__addEvent(n,"dragstart",function(e){t.__eventFromChildScrollbar(e)||(o=!0,a=e.target.clientHeight,(0,i.setStyle)(r,{"pointer-events":"auto"}),cancelAnimationFrame(u),t.__updateBounding())}),this.__addEvent(document,"dragover mousemove touchmove",function(e){if(o&&!t.__eventFromChildScrollbar(e)){cancelAnimationFrame(u),e.preventDefault();var n=t.__getPointerTrend(e,a);c(n)}}),this.__addEvent(document,"dragend mouseup touchend blur",function(){cancelAnimationFrame(u),o=!1})}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__dragHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=this,e=this.targets,n=function(e){var n=t.size,r=t.offset,o=t.limit,i=t.movement;switch(e){case s.SPACE:return[0,200];case s.PAGE_UP:return[0,-n.container.height+40];case s.PAGE_DOWN:return[0,n.container.height-40];case s.END:return[0,Math.abs(i.y)+o.y-r.y];case s.HOME:return[0,-Math.abs(i.y)-r.y];case s.LEFT:return[-40,0];case s.UP:return[0,-40];case s.RIGHT:return[40,0];case s.DOWN:return[0,40];default:return null}},r=e.container;this.__addEvent(r,"keydown",function(e){if(document.activeElement===r){var o=t.options,i=t.parents,u=t.movementLocked,a=n(e.keyCode||e.which);if(a){var c=l(a,2),f=c[0],s=c[1];if(t.__shouldPropagateMovement(f,s))return r.blur(),i.length&&i[0].focus(),t.__updateThrottle();e.preventDefault(),t.__unlockMovement(),f&&t.__willOverscroll("x",f)&&(u.x=!0),s&&t.__willOverscroll("y",s)&&(u.y=!0);var d=o.speed;t.__addMovement(f*d,s*d)}}}),this.__addEvent(r,"keyup",function(){t.__unlockMovement()})}var i=n(163),u=r(i),a=n(166),c=r(a),l=function(){function t(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var u,a=(0,c.default)(t);!(r=(u=a.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if((0,u.default)(Object(e)))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=n(78),s={SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40};Object.defineProperty(f.SmoothScrollbar.prototype,"__keyboardHandler",{value:o,writable:!0,configurable:!0})},function(t,e,n){t.exports={default:n(164),__esModule:!0}},function(t,e,n){n(57),n(4),t.exports=n(165)},function(t,e,n){var r=n(53),o=n(45)("iterator"),i=n(27);t.exports=n(12).isIterable=function(t){var e=Object(t);return void 0!==e[o]||"@@iterator"in e||i.hasOwnProperty(r(e))}},function(t,e,n){t.exports={default:n(167),__esModule:!0}},function(t,e,n){n(57),n(4),t.exports=n(168)},function(t,e,n){var r=n(17),o=n(52);t.exports=n(12).getIterator=function(t){var e=o(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return r(e.call(t))}},function(t,e,n){"use strict";function r(){var t=this,e=this.targets,n=e.container,r=e.xAxis,o=e.yAxis,u=function(e,n){var r=t.size,o=t.thumbSize;if("x"===e){var i=r.container.width-(o.x-o.realX);
return n/i*r.content.width}if("y"===e){var u=r.container.height-(o.y-o.realY);return n/u*r.content.height}return 0},a=function(t){return(0,i.isOneOf)(t,[r.track,r.thumb])?"x":(0,i.isOneOf)(t,[o.track,o.thumb])?"y":void 0},c=void 0,l=void 0,f=void 0,s=void 0,d=void 0;this.__addEvent(n,"click",function(e){if(!l&&(0,i.isOneOf)(e.target,[r.track,o.track])){var n=e.target,c=a(n),f=n.getBoundingClientRect(),s=(0,i.getPosition)(e),d=t.offset,h=t.thumbSize;if("x"===c){var v=s.x-f.left-h.x/2;t.__setMovement(u(c,v)-d.x,0)}else{var _=s.y-f.top-h.y/2;t.__setMovement(0,u(c,_)-d.y)}}}),this.__addEvent(n,"mousedown",function(e){if((0,i.isOneOf)(e.target,[r.thumb,o.thumb])){c=!0;var n=(0,i.getPosition)(e),u=e.target.getBoundingClientRect();s=a(e.target),f={x:n.x-u.left,y:n.y-u.top},d=t.targets.container.getBoundingClientRect()}}),this.__addEvent(window,"mousemove",function(e){if(c){e.preventDefault(),l=!0;var n=t.offset,r=(0,i.getPosition)(e);if("x"===s){var o=r.x-f.x-d.left;t.setPosition(u(s,o),n.y)}if("y"===s){var a=r.y-f.y-d.top;t.setPosition(n.x,u(s,a))}}}),this.__addEvent(window,"mouseup blur",function(){c=l=!1})}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__mouseHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){this.__addEvent(window,"resize",this.__updateThrottle)}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__resizeHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=!1,n=void 0,r=this.targets,o=r.container,u=r.content,a=function e(r){var o=r.x,i=r.y;if(o||i){var u=t.options.speed;t.__setMovement(o*u,i*u),n=requestAnimationFrame(function(){e({x:o,y:i})})}},c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";(0,i.setStyle)(o,{"-user-select":t})};this.__addEvent(window,"mousemove",function(r){if(e){cancelAnimationFrame(n);var o=t.__getPointerTrend(r);a(o)}}),this.__addEvent(u,"selectstart",function(r){return t.__eventFromChildScrollbar(r)?c("none"):(cancelAnimationFrame(n),t.__updateBounding(),void(e=!0))}),this.__addEvent(window,"mouseup blur",function(){cancelAnimationFrame(n),c(),e=!1}),this.__addEvent(o,"scroll",function(t){t.preventDefault(),o.scrollTop=o.scrollLeft=0})}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__selectHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=this,e=this.targets,n=this.__touchRecord,r=e.container;this.__addEvent(r,"touchstart",function(e){if(!t.__isDrag){var r=t.__timerID,o=t.movement;cancelAnimationFrame(r.scrollTo),t.__willOverscroll("x")||(o.x=0),t.__willOverscroll("y")||(o.y=0),n.track(e),t.__autoLockMovement()}}),this.__addEvent(r,"touchmove",function(e){if(!(t.__isDrag||s&&s!==t)){n.update(e);var r=n.getDelta(),o=r.x,i=r.y;if(t.__shouldPropagateMovement(o,i))return t.__updateThrottle();var u=t.movement,a=t.MAX_OVERSCROLL,c=t.options;if(u.x&&t.__willOverscroll("x",o)){var l=2;"bounce"===c.overscrollEffect&&(l+=Math.abs(10*u.x/a)),Math.abs(u.x)>=a?o=0:o/=l}if(u.y&&t.__willOverscroll("y",i)){var f=2;"bounce"===c.overscrollEffect&&(f+=Math.abs(10*u.y/a)),Math.abs(u.y)>=a?i=0:i/=f}t.__autoLockMovement(),e.preventDefault(),t.__addMovement(o,i,!0),s=t}}),this.__addEvent(r,"touchcancel touchend",function(e){if(!t.__isDrag){var r=t.options.speed,o=n.getVelocity(),i={};(0,u.default)(o).forEach(function(t){var e=(0,l.pickInRange)(o[t]*c.GLOBAL_ENV.EASING_MULTIPLIER,-1e3,1e3);i[t]=Math.abs(e)>f?e*r:0}),t.__addMovement(i.x,i.y,!0),t.__unlockMovement(),n.release(e),s=null}})}var i=n(90),u=r(i),a=n(78),c=n(89),l=n(112),f=100,s=null;Object.defineProperty(a.SmoothScrollbar.prototype,"__touchHandler",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=this.targets.container,n=!1,r=(0,i.debounce)(function(){n=!1},30,!1);this.__addEvent(e,u.GLOBAL_ENV.WHEEL_EVENT,function(e){var o=t.options,u=t.wheelReversed,a=(0,i.getDelta)(e),c=a.x,l=a.y;return c*=o.speed,l*=o.speed,t.__shouldPropagateMovement(c,l)?t.__updateThrottle():(e.preventDefault(),r(),t.overscrollBack&&(n=!0),n&&(t.__willOverscroll("x",c)&&(c=0),t.__willOverscroll("y",l)&&(l=0)),void(u?t.__addMovement(l,c,!0):t.__addMovement(c,l,!0)))})}var o=n(78),i=n(112),u=n(89);Object.defineProperty(o.SmoothScrollbar.prototype,"__wheelHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(175);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(86),i=r(o),u=n(90),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(176);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(177);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(178);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(179);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(180);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(183);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(184);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(185);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(186);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(187);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(188);(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})})},function(t,e,n){"use strict";function r(t,e,n){var r=this;if(!t||"function"!=typeof t.addEventListener)throw new TypeError("expect elem to be a DOM element, but got "+t);var o=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),o=1;o<e;o++)r[o-1]=arguments[o];!t.type.match(/drag/)&&t.defaultPrevented||n.apply(void 0,[t].concat(r))};e.split(/\s+/g).forEach(function(e){r.__handlers.push({evt:e,elem:t,fn:o,hasRegistered:!0}),t.addEventListener(e,o)})}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__addEvent",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.target;return this.children.some(function(t){return t.contains(e)})}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__eventFromChildScrollbar",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=this.options,n=this.offset,r=this.limit;return t&&(e.continuousScrolling||e.overscrollEffect)?{x:[-(1/0),1/0],y:[-(1/0),1/0]}:{x:[-n.x,r.x-n.x],y:[-n.y,r.y-n.y]}}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__getDeltaLimit",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.bounding,r=n.top,o=n.right,u=n.bottom,a=n.left,c=(0,i.getPosition)(t),l=c.x,f=c.y,s={x:0,y:0};return 0===l&&0===f?s:(l>o-e?s.x=l-o+e:l<a+e&&(s.x=l-a-e),f>u-e?s.y=f-u+e:f<r+e&&(s.y=f-r-e),s)}var o=n(78),i=n(112);Object.defineProperty(o.SmoothScrollbar.prototype,"__getPointerTrend",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,h.default)(t)}function i(t){var e=this,n={speed:1,damping:.1,thumbMinSize:20,syncCallbacks:!1,renderByPixels:!0,alwaysShowTracks:!1,continuousScrolling:"auto",overscrollEffect:!1,overscrollEffectColor:"#87ceeb",overscrollDamping:.2},r={damping:[0,1],speed:[0,1/0],thumbMinSize:[0,1/0],overscrollEffect:[!1,"bounce","glow"],overscrollDamping:[0,1]},i=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"auto";if(n.overscrollEffect!==!1)return!1;switch(t){case"auto":return e.isNestedScrollbar;default:return!!t}},u={set ignoreEvents(t){console.warn("`options.ignoreEvents` parameter is deprecated, use `instance#unregisterEvents()` method instead. https://github.com/idiotWu/smooth-scrollbar/wiki/Instance-Methods#instanceunregisterevents-regex--regex-regex--")},set friction(t){console.warn("`options.friction="+t+"` is deprecated, use `options.damping="+t/100+"` instead."),this.damping=t/100},get syncCallbacks(){return n.syncCallbacks},set syncCallbacks(t){n.syncCallbacks=!!t},get renderByPixels(){return n.renderByPixels},set renderByPixels(t){n.renderByPixels=!!t},get alwaysShowTracks(){return n.alwaysShowTracks},set alwaysShowTracks(t){t=!!t,n.alwaysShowTracks=t;var r=e.targets.container;t?(e.showTrack(),r.classList.add("sticky")):(e.hideTrack(),r.classList.remove("sticky"))},get continuousScrolling(){return i(n.continuousScrolling)},set continuousScrolling(t){"auto"===t?n.continuousScrolling=t:n.continuousScrolling=!!t},get overscrollEffect(){return n.overscrollEffect},set overscrollEffect(t){t&&!~r.overscrollEffect.indexOf(t)&&(console.warn("`overscrollEffect` should be one of "+(0,s.default)(r.overscrollEffect)+", but got "+(0,s.default)(t)+". It will be set to `false` now."),t=!1),n.overscrollEffect=t},get overscrollEffectColor(){return n.overscrollEffectColor},set overscrollEffectColor(t){n.overscrollEffectColor=t}};(0,l.default)(n).filter(function(t){return!u.hasOwnProperty(t)}).forEach(function(t){(0,a.default)(u,t,{enumerable:!0,get:function(){return n[t]},set:function(e){if(isNaN(parseFloat(e)))throw new TypeError("expect `options."+t+"` to be a number, but got "+("undefined"==typeof e?"undefined":b(e)));n[t]=g.pickInRange.apply(void 0,[e].concat(o(r[t])))}})}),this.__readonly("options",u),this.setOptions(t)}var u=n(86),a=r(u),c=n(90),l=r(c),f=n(181),s=r(f),d=n(2),h=r(d),v=n(55),_=r(v),p=n(62),y=r(p),b="function"==typeof y.default&&"symbol"==typeof _.default?function(t){return typeof t}:function(t){return t&&"function"==typeof y.default&&t.constructor===y.default&&t!==y.default.prototype?"symbol":typeof t},g=n(112),m=n(78);Object.defineProperty(m.SmoothScrollbar.prototype,"__initOptions",{value:i,writable:!0,configurable:!0})},function(t,e,n){t.exports={default:n(182),__esModule:!0}},function(t,e,n){var r=n(12),o=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.reverseWheel(t)}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__initReverseWheel",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){this.update(),this.__keyboardHandler(),this.__resizeHandler(),this.__selectHandler(),this.__mouseHandler(),this.__touchHandler(),this.__wheelHandler(),this.__dragHandler(),this.__render()}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__initScrollbar",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){return(0,u.default)(this,t,{value:e,enumerable:!0,configurable:!0})}var i=n(86),u=r(i),a=n(78);Object.defineProperty(a.SmoothScrollbar.prototype,"__readonly",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this.targets,e=this.size,n=this.offset,r=this.thumbOffset,i=this.thumbSize;r.x=n.x/e.content.width*(e.container.width-(i.x-i.realX)),r.y=n.y/e.content.height*(e.container.height-(i.y-i.realY)),(0,o.setStyle)(t.xAxis.thumb,{"-transform":"translate3d("+r.x+"px, 0, 0)"}),(0,o.setStyle)(t.yAxis.thumb,{"-transform":"translate3d(0, "+r.y+"px, 0)"})}var o=n(112),i=n(78);Object.defineProperty(i.SmoothScrollbar.prototype,"__setThumbPosition",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this.targets.container,e=t.getBoundingClientRect(),n=e.top,r=e.right,o=e.bottom,i=e.left,u=window,a=u.innerHeight,c=u.innerWidth;this.__readonly("bounding",{top:Math.max(n,0),right:Math.min(r,c),bottom:Math.min(o,a),left:Math.max(i,0)})}var o=n(78);Object.defineProperty(o.SmoothScrollbar.prototype,"__updateBounding",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=this.targets,e=t.container,n=t.content;this.__readonly("children",[].concat(o(n.querySelectorAll(l.selectors)))),this.__readonly("isNestedScrollbar",!1);for(var r=[],i=e;i=i.parentElement;)l.sbList.has(i)&&(this.__readonly("isNestedScrollbar",!0),r.push(i));this.__readonly("parents",r)}var u=n(2),a=r(u),c=n(78),l=n(89);Object.defineProperty(c.SmoothScrollbar.prototype,"__updateTree",{value:i,writable:!0,configurable:!0})},function(t,e){}])});
},{}]},{},[1,2,3,4,5,6,7,8]);
