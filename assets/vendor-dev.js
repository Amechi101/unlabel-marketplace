/*! Locomotive Boilerplate - 2017-11-08 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

var _html = require('./utils/html');

var _globals = require('./utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


// Global functions and tools


// Basic modules


var App = function () {
    function App() {
        var _this = this;

        _classCallCheck(this, App);

        this.modules = modules;
        this.currentModules = [];

        _environment.$document.on('initModules.App', function (event) {
            _this.initGlobals(event.firstBlood).deleteModules().initModules();
        });
    }

    /**
     * Destroy all existing modules
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.deleteModules = function deleteModules() {
        // Loop modules
        var i = this.currentModules.length;

        // Destroy all modules
        while (i--) {
            this.currentModules[i].destroy();
            this.currentModules.splice(i);
        }

        return this;
    };

    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.initGlobals = function initGlobals(firstBlood) {
        (0, _globals2.default)(firstBlood);
        return this;
    };

    /**
     * Find modules and initialize them
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.initModules = function initModules() {
        // Elements with module
        var moduleEls = document.querySelectorAll('[data-module]');

        // Loop through elements
        var i = 0;
        var elsLen = moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            var el = moduleEls[i];

            // All data- attributes considered as options
            var options = (0, _html.getNodeData)(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $(el);

            // Module does exist at this point
            var attr = options.module;

            // Splitting modules found in the data-attribute
            var moduleIdents = attr.replace(/\s/g, '').split(',');

            // Loop modules
            var j = 0;
            var modulesLen = moduleIdents.length;

            for (; j < modulesLen; j++) {
                var moduleAttr = moduleIdents[j];

                if (typeof this.modules[moduleAttr] === 'function') {
                    var module = new this.modules[moduleAttr](options);
                    this.currentModules.push(module);
                }
            }
        }

        return this;
    };

    return App;
}();

// IIFE for loading the application
// ==========================================================================


(function () {})();

// remap jQuery to $
(function ($) {

    function initScript() {

        window.App = new App();
        _environment.$document.trigger({
            type: 'initModules.App',
            firstBlood: true
        });

        if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
            _environment.$document.on('SmoothScroll.isReady', function (event) {

                _environment.$body.addClass('dom-is-loaded');
            });
        }

        $(window).resize(function () {
            $(document).trigger('SmoothScroll.rebuild');
        });

        if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
            $('html').addClass('is-desktop');
            $(document).trigger('SmoothScroll.rebuild');
        } else {
            //$('body').addClass('is-loaded');

            $('html').addClass('is-mobile');

            $('.c-overlay-changing-page').removeClass('is-active');

            hunt(document.getElementsByClassName('js-parallax'), {
                in: function _in() {
                    this.classList.add('is-inview');
                },
                offset: 0
            });
        };

        $('.o-scroll-home .scroll-content').on("hasscrolled", function () {
            //console.log($('.o-scroll-home').data('y'));
            if ($(this).data('y') <= -400) {
                // Whatever
                //console.log("Toggle class!");
            }

            if ($('.c-product-list-header .c-filter').hasClass('is-inview')) {
                $('.c-product-aside').addClass('is-not-top');
                console.log('yess');
            } else {
                $('.c-product-aside').removeClass('is-not-top');
            }
        });
    } //initScript

    initScript();

})(window.jQuery || window.$);

},{"./modules":2,"./utils/environment":8,"./utils/globals":9,"./utils/html":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Button = require('./modules/Button');

Object.defineProperty(exports, 'Button', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Button).default;
  }
});

var _Title = require('./modules/Title');

Object.defineProperty(exports, 'Title', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Title).default;
  }
});

var _SmoothScroll = require('./modules/SmoothScroll');

Object.defineProperty(exports, 'SmoothScroll', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SmoothScroll).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Button":4,"./modules/SmoothScroll":5,"./modules/Title":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


/**
 * Abstract module
 * Gives access to generic jQuery nodes
 */
var _class = function _class(options) {
    _classCallCheck(this, _class);

    this.$document = _environment.$document;
    this.$window = _environment.$window;
    this.$html = _environment.$html;
    this.$body = _environment.$body;
    this.$el = options.$el;
    this.el = options.el;
};

exports.default = _class;

},{"../utils/environment":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$el.on('click.Button', function (event) {
            _this.$document.trigger('Title.changeLabel', [$(event.currentTarget).val()]);
        });
        return _this;
    }

    _class.prototype.destroy = function destroy() {
        this.$el.off('.Button');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _smoothScrollbar = require('smooth-scrollbar');

var _smoothScrollbar2 = _interopRequireDefault(_smoothScrollbar);

var _environment = require('../utils/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Locomotive smooth scroll
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        if (is.desktop() && $(window).width() > 1024 || is.ie() && $(window).width() > 1024) {
            _this.scrollbar;
            _this.selector = '.js-parallax';

            _this.build();
        }
        return _this;
    }

    // Set
    // ==========================================================================


    _class.prototype.set = function set() {
        this.windowHeight = this.$window.height();
        this.windowMiddle = this.windowHeight / 2;
        this.scrollbarLimit = this.scrollbar.limit.y + this.windowHeight;
        // Create elements object
        this.addElements();
        // First load
        this.checkElements(true);
    };

    // Build
    // ==========================================================================


    _class.prototype.build = function build() {
        var _this2 = this;

        setTimeout(function () {
            _this2.scrollbar = _smoothScrollbar2.default.init(_this2.$el[0]);
            _this2.elements = {};
            _this2.set();

            // On scroll
            _this2.scrollbar.addListener(function () {
                return _this2.checkElements();
            });
            // Rebuild event
            _environment.$document.on('SmoothScroll.rebuild', function () {
                return _this2.updateElements();
            });
            // Scrollto button event
            $('.js-scrollto').on('click.SmoothScroll', function (event) {
                return _this2.scrollTo(event);
            });

            // Setup done
            _environment.$document.trigger({
                type: 'SmoothScroll.isReady'
            });
            $('.c-loading').removeClass('is-active');
        }, 1500);
    };

    // Add elements
    // ==========================================================================


    _class.prototype.addElements = function addElements() {
        var _this3 = this;

        this.elements = [];

        $(this.selector).each(function (i, el) {
            var $element = $(el);
            var elementSpeed = $element.data('speed') / 10;
            var elementPosition = $element.data('position');
            var elementTarget = $element.data('target');
            var elementHorizontal = $element.data('horizontal');
            var $target = elementTarget ? $(elementTarget) : $element;
            var elementOffset = $target.offset().top + _this3.scrollbar.scrollTop;

            if (!elementTarget && $element.data('transform')) {
                var transform = $element.data('transform');
                elementOffset -= parseFloat(transform.y);
            }

            var elementLimit = elementOffset + $target.outerHeight();
            var elementMiddle = (elementLimit - elementOffset) / 2 + elementOffset;
            var elementPersist = $element.data('persist');
            var elementFixed = $element.data('fixed');

            _this3.elements[i] = {
                $element: $element,
                offset: elementOffset,
                limit: elementLimit,
                middle: elementMiddle,
                speed: elementSpeed,
                position: elementPosition,
                horizontal: elementHorizontal,
                persist: elementPersist,
                fixed: elementFixed
            };
        });
    };

    /**
    * Set the scroll bar limit
    */


    _class.prototype.setScrollbarLimit = function setScrollbarLimit() {
        this.scrollbarLimit = this.scrollbar.limit.y + this.windowHeight;
    };

    // Update elements
    // ==========================================================================
    // updateElements() {
    //     this.scrollbar.update();
    //     this.set();
    //     $document.trigger('SmoothScroll.update');
    // }


    /**
     * Update elements and recalculate all the positions on the page
     */


    _class.prototype.updateElements = function updateElements() {

        this.scrollbar.update();
        this.windowHeight = $(window).height();
        this.windowMiddle = this.windowHeight / 2;
        this.setScrollbarLimit();
        this.addElements();
    };

    // Check elements
    // ==========================================================================


    _class.prototype.checkElements = function checkElements(first) {
        var scrollbarTop = this.scrollbar.scrollTop;
        var scrollbarLimit = this.scrollbarLimit;
        var scrollbarBottom = scrollbarTop + this.windowHeight;
        var scrollbarMiddle = scrollbarTop + this.windowMiddle;

        for (var i in this.elements) {
            var transformDistance = void 0;
            var scrollBottom = scrollbarBottom;
            var $element = this.elements[i].$element;
            var elementOffset = this.elements[i].offset;
            var elementLimit = this.elements[i].limit;
            var elementMiddle = this.elements[i].middle;
            var elementSpeed = this.elements[i].speed;
            var elementPosition = this.elements[i].position;
            var elementHorizontal = this.elements[i].horizontal;
            var elementPersist = this.elements[i].persist;
            var elementFixed = this.elements[i].fixed;

            if (elementPosition === 'top') {
                scrollBottom = scrollbarTop;
            }

            if (elementFixed) {
                $element.css('transform', 'translateY(' + scrollbarTop + 'px)');
                console.log(scrollbarTop);
            }

            // Define if the element is inview
            var inview = scrollBottom >= elementOffset && scrollbarTop <= elementLimit;

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

    // Transform element
    // ==========================================================================
    /**
     * [transform description]
     * @param  {[type]} $element Jquery element.
     * @param  {mixed}  x        Translate value
     * @param  {mixed}  y        Translate value
     * @param  {mixed}  z        Translate value
     * @return {void}
     */


    _class.prototype.transform = function transform($element, x, y, z) {
        // Defaults
        x = x || 0;
        y = y || 0;
        z = z || 0;

        // Translate
        $element.css({
            '-webkit-transform': 'translate3d(' + x + ', ' + y + ', ' + z + ')',
            '-ms-transform': 'translate3d(' + x + ', ' + y + ', ' + z + ')',
            'transform': 'translate3d(' + x + ', ' + y + ', ' + z + ')'
        }).data('transform', {
            x: x,
            y: y,
            z: z
        }); // Remember

        $element.find(this.selector).each(function (i, e) {
            var $this = $(e);
            if (!$this.data('transform')) {
                $this.data('transform', {
                    x: x,
                    y: y,
                    z: z
                });
            }
        });
    };

    // Scroll to
    // ==========================================================================


    _class.prototype.scrollTo = function scrollTo(event) {
        if (!$.isNumeric(event)) {
            event.preventDefault();

            var $target = $($(event.currentTarget).attr('href'));
            var targetOffset = $target.offset().top + this.scrollbar.scrollTop;
        } else {
            targetOffset = event;
        }

        this.scrollbar.scrollTo(0, targetOffset, 900);
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$el.off('.SmoothScroll');
        this.elements = {};
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":8,"./AbstractModule":3,"smooth-scrollbar":13}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _visibility = require('../utils/visibility');

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$label = _this.$el.find('.js-label');

        _this.$document.on('Title.changeLabel', function (event, value) {
            _this.changeLabel(value);
            _this.destroy();
        });

        _this.hiddenCallbackIdent = (0, _visibility.visibilityApi)({
            action: 'addCallback',
            state: 'hidden',
            callback: _this.logHidden
        });

        _this.visibleCallbackIdent = (0, _visibility.visibilityApi)({
            action: 'addCallback',
            state: 'visible',
            callback: _this.logVisible
        });
        return _this;
    }

    _class.prototype.logHidden = function logHidden() {
        console.log('Title is hidden');
    };

    _class.prototype.logVisible = function logVisible() {
        console.log('Title is visible');
    };

    _class.prototype.changeLabel = function changeLabel(value) {
        this.$label.text(value);
    };

    _class.prototype.destroy = function destroy() {
        this.$document.off('Title.changeLabel');

        (0, _visibility.visibilityApi)({
            action: 'removeCallback',
            state: 'hidden',
            ident: this.hiddenCallbackIdent
        });

        (0, _visibility.visibilityApi)({
            action: 'removeCallback',
            state: 'visible',
            ident: this.visibleCallbackIdent
        });

        this.$el.off('.Title');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/visibility":12,"./AbstractModule":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addToArray = addToArray;
exports.arrayContains = arrayContains;
exports.arrayContentsMatch = arrayContentsMatch;
exports.ensureArray = ensureArray;
exports.lastItem = lastItem;
exports.removeFromArray = removeFromArray;
exports.toArray = toArray;
exports.findByKeyValue = findByKeyValue;

var _is = require('./is');

function addToArray(array, value) {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    }
}

function arrayContains(array, value) {
    for (var i = 0, c = array.length; i < c; i++) {
        if (array[i] == value) {
            return true;
        }
    }

    return false;
}

function arrayContentsMatch(a, b) {
    var i;

    if (!(0, _is.isArray)(a) || !(0, _is.isArray)(b)) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    i = a.length;
    while (i--) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function ensureArray(x) {
    if (typeof x === 'string') {
        return [x];
    }

    if (x === undefined) {
        return [];
    }

    return x;
}

function lastItem(array) {
    return array[array.length - 1];
}

function removeFromArray(array, member) {
    if (!array) {
        return;
    }

    var index = array.indexOf(member);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

function toArray(arrayLike) {
    var array = [],
        i = arrayLike.length;
    while (i--) {
        array[i] = arrayLike[i];
    }

    return array;
}

function findByKeyValue(array, key, value) {
    return array.filter(function (obj) {
        return obj[key] === value;
    });
}

},{"./is":11}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement);
var $body = $(document.body);

exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.visibilityApi = undefined;

var _is = require('./is');

var _array = require('./array');

var _environment = require('./environment');

var CALLBACKS = {
    hidden: [],
    visible: []
}; /* jshint esnext: true */


var ACTIONS = ['addCallback', 'removeCallback'];

var STATES = ['visible', 'hidden'];

var PREFIX = 'v-';

var UUID = 0;

// Main event
_environment.$document.on('visibilitychange', function (event) {
    if (document.hidden) {
        onDocumentChange('hidden');
    } else {
        onDocumentChange('visible');
    }
});

/**
 * Add a callback
 * @param {string}   state
 * @param {function} callback
 * @return {string}  ident
 */
function addCallback(state, options) {
    var callback = options.callback || '';

    if (!(0, _is.isFunction)(callback)) {
        console.warn('Callback is not a function');
        return false;
    }

    var ident = PREFIX + UUID++;

    CALLBACKS[state].push({
        ident: ident,
        callback: callback
    });

    return ident;
}

/**
 * Remove a callback
 * @param  {string}   state  Visible or hidden
 * @param  {string}   ident  Unique identifier
 * @return {boolean}         If operation was a success
 */
function removeCallback(state, options) {
    var ident = options.ident || '';

    if (typeof ident === 'undefined' || ident === '') {
        console.warn('Need ident to remove callback');
        return false;
    }

    var index = (0, _array.findByKeyValue)(CALLBACKS[state], 'ident', ident)[0];

    // console.log(ident)
    // console.log(CALLBACKS[state])

    if (typeof index !== 'undefined') {
        (0, _array.removeFromArray)(CALLBACKS[state], index);
        return true;
    } else {
        console.warn('Callback could not be found');
        return false;
    }
}

/**
 * When document state changes, trigger callbacks
 * @param  {string}  state  Visible or hidden
 */
function onDocumentChange(state) {
    var callbackArray = CALLBACKS[state];
    var i = 0;
    var len = callbackArray.length;

    for (; i < len; i++) {
        callbackArray[i].callback();
    }
}

/**
 * Public facing API for adding and removing callbacks
 * @param   {object}           options  Options
 * @return  {boolean|integer}           Unique identifier for the callback or boolean indicating success or failure
 */
function visibilityApi(options) {
    var action = options.action || '';
    var state = options.state || '';
    var ret = void 0;

    // Type and value checking
    if (!(0, _array.arrayContains)(ACTIONS, action)) {
        console.warn('Action does not exist');
        return false;
    }
    if (!(0, _array.arrayContains)(STATES, state)) {
        console.warn('State does not exist');
        return false;
    }

    // @todo Magic call function pls
    if (action === 'addCallback') {
        ret = addCallback(state, options);
    } else if (action === 'removeCallback') {
        ret = removeCallback(state, options);
    }

    return ret;
}

exports.visibilityApi = visibilityApi;

},{"./array":7,"./environment":8,"./is":11}],13:[function(require,module,exports){
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Scrollbar=n():t.Scrollbar=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var e={};return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=56)}([function(t,n,e){var r=e(39)("wks"),o=e(16),i=e(2).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n){var e=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=e)},function(t,n,e){var r=e(2),o=e(4),i=e(11),u=e(6),c=e(10),s=function(t,n,e){var a,f,l,p,h=t&s.F,d=t&s.G,v=t&s.S,y=t&s.P,m=t&s.B,g=d?r:v?r[n]||(r[n]={}):(r[n]||{}).prototype,b=d?o:o[n]||(o[n]={}),x=b.prototype||(b.prototype={});d&&(e=n);for(a in e)f=!h&&g&&void 0!==g[a],l=(f?g:e)[a],p=m&&f?c(l,r):y&&"function"==typeof l?c(Function.call,l):l,g&&u(g,a,l,t&s.U),b[a]!=l&&i(b,a,p),y&&x[a]!=l&&(x[a]=l)};r.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},function(t,n,e){var r=e(2),o=e(11),i=e(3),u=e(16)("src"),c=Function.toString,s=(""+c).split("toString");e(4).inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,e,c){var a="function"==typeof e;a&&(i(e,"name")||o(e,"name",n)),t[n]!==e&&(a&&(i(e,u)||o(e,u,t[n]?""+t[n]:s.join(String(n)))),t===r?t[n]=e:c?t[n]?t[n]=e:o(t,n,e):(delete t[n],o(t,n,e)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[u]||c.call(this)})},function(t,n,e){var r=e(8),o=e(40),i=e(42),u=Object.defineProperty;n.f=e(9)?Object.defineProperty:function(t,n,e){if(r(t),n=i(n,!0),r(e),o)try{return u(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(1);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n,e){t.exports=!e(12)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(43);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},function(t,n,e){var r=e(7),o=e(17);t.exports=e(9)?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n){t.exports={}},function(t,n,e){var r=e(10),o=e(48),i=e(49),u=e(8),c=e(19),s=e(50),a={},f={},n=t.exports=function(t,n,e,l,p){var h,d,v,y,m=p?function(){return t}:s(t),g=r(e,l,n?2:1),b=0;if("function"!=typeof m)throw TypeError(t+" is not iterable!");if(i(m)){for(h=c(t.length);h>b;b++)if((y=n?g(u(d=t[b])[0],d[1]):g(t[b]))===a||y===f)return y}else for(v=m.call(t);!(d=v.next()).done;)if((y=o(v,g,d.value,n))===a||y===f)return y};n.BREAK=a,n.RETURN=f},function(t,n,e){var r=e(1);t.exports=function(t,n){if(!r(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){var r=e(30),o=e(27);t.exports=function(t){return r(o(t))}},function(t,n,e){var r=e(26),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,n,e){var r=e(27);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(16)("meta"),o=e(1),i=e(3),u=e(7).f,c=0,s=Object.isExtensible||function(){return!0},a=!e(12)(function(){return s(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++c,w:{}}})},l=function(t,n){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!s(t))return"F";if(!n)return"E";f(t)}return t[r].i},p=function(t,n){if(!i(t,r)){if(!s(t))return!0;if(!n)return!1;f(t)}return t[r].w},h=function(t){return a&&d.NEED&&s(t)&&!i(t,r)&&f(t),t},d=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:h}},function(t,n,e){"use strict";var r=e(23),o={};o[e(0)("toStringTag")]="z",o+""!="[object z]"&&e(6)(Object.prototype,"toString",function(){return"[object "+r(this)+"]"},!0)},function(t,n,e){var r=e(24),o=e(0)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(t){}};t.exports=function(t){var n,e,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=u(n=Object(t),o))?e:i?r(n):"Object"==(c=r(n))&&"function"==typeof n.callee?"Arguments":c}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n,e){"use strict";var r=e(59)(!0);e(28)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})})},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,e){"use strict";var r=e(60),o=e(5),i=e(6),u=e(11),c=e(3),s=e(13),a=e(61),f=e(32),l=e(67),p=e(0)("iterator"),h=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,n,e,v,y,m,g){a(e,n,v);var b,x,_,w=function(t){if(!h&&t in T)return T[t];switch(t){case"keys":case"values":return function(){return new e(this,t)}}return function(){return new e(this,t)}},S=n+" Iterator",E="values"==y,O=!1,T=t.prototype,A=T[p]||T["@@iterator"]||y&&T[y],M=A||w(y),j=y?E?w("entries"):M:void 0,P="Array"==n?T.entries||A:A;if(P&&(_=l(P.call(new t)))!==Object.prototype&&_.next&&(f(_,S,!0),r||c(_,p)||u(_,p,d)),E&&A&&"values"!==A.name&&(O=!0,M=function(){return A.call(this)}),r&&!g||!h&&!O&&T[p]||u(T,p,M),s[n]=M,s[S]=d,y)if(b={values:E?M:w("values"),keys:m?M:w("keys"),entries:j},g)for(x in b)x in T||i(T,x,b[x]);else o(o.P+o.F*(h||O),n,b);return b}},function(t,n,e){var r=e(63),o=e(45);t.exports=Object.keys||function(t){return r(t,o)}},function(t,n,e){var r=e(24);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n,e){var r=e(39)("keys"),o=e(16);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,n,e){var r=e(7).f,o=e(3),i=e(0)("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},function(t,n,e){for(var r=e(68),o=e(29),i=e(6),u=e(2),c=e(11),s=e(13),a=e(0),f=a("iterator"),l=a("toStringTag"),p=s.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=o(h),v=0;v<d.length;v++){var y,m=d[v],g=h[m],b=u[m],x=b&&b.prototype;if(x&&(x[f]||c(x,f,p),x[l]||c(x,l,m),s[m]=p,g))for(y in r)x[y]||i(x,y,r[y],!0)}},function(t,n,e){var r=e(6);t.exports=function(t,n,e){for(var o in n)r(t,o,n[o],e);return t}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n,e){"use strict";var r=e(2),o=e(5),i=e(6),u=e(34),c=e(21),s=e(14),a=e(35),f=e(1),l=e(12),p=e(51),h=e(32),d=e(72);t.exports=function(t,n,e,v,y,m){var g=r[t],b=g,x=y?"set":"add",_=b&&b.prototype,w={},S=function(t){var n=_[t];i(_,t,"delete"==t?function(t){return!(m&&!f(t))&&n.call(this,0===t?0:t)}:"has"==t?function(t){return!(m&&!f(t))&&n.call(this,0===t?0:t)}:"get"==t?function(t){return m&&!f(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function(t){return n.call(this,0===t?0:t),this}:function(t,e){return n.call(this,0===t?0:t,e),this})};if("function"==typeof b&&(m||_.forEach&&!l(function(){(new b).entries().next()}))){var E=new b,O=E[x](m?{}:-0,1)!=E,T=l(function(){E.has(1)}),A=p(function(t){new b(t)}),M=!m&&l(function(){for(var t=new b,n=5;n--;)t[x](n,n);return!t.has(-0)});A||(b=n(function(n,e){a(n,b,t);var r=d(new g,n,b);return void 0!=e&&s(e,y,r[x],r),r}),b.prototype=_,_.constructor=b),(T||M)&&(S("delete"),S("has"),y&&S("get")),(M||O)&&S(x),m&&_.clear&&delete _.clear}else b=v.getConstructor(n,t,y,x),u(b.prototype,e),c.NEED=!0;return h(b,t),w[t]=b,o(o.G+o.W+o.F*(b!=g),w),m||v.setStrong(b,t,y),b}},function(t,n,e){"use strict";var r=e(5);t.exports=function(t){r(r.S,t,{of:function(){for(var t=arguments.length,n=Array(t);t--;)n[t]=arguments[t];return new this(n)}})}},function(t,n,e){"use strict";var r=e(5),o=e(43),i=e(10),u=e(14);t.exports=function(t){r(r.S,t,{from:function(t){var n,e,r,c,s=arguments[1];return o(this),n=void 0!==s,n&&o(s),void 0==t?new this:(e=[],n?(r=0,c=i(s,arguments[2],2),u(t,!1,function(t){e.push(c(t,r++))})):u(t,!1,e.push,e),new this(e))}})}},function(t,n,e){var r=e(2),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,n,e){t.exports=!e(9)&&!e(12)(function(){return 7!=Object.defineProperty(e(41)("div"),"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(1),o=e(2).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,n,e){var r=e(1);t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var r=e(8),o=e(62),i=e(45),u=e(31)("IE_PROTO"),c=function(){},s=function(){var t,n=e(41)("iframe"),r=i.length;for(n.style.display="none",e(66).appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;)delete s.prototype[i[r]];return s()};t.exports=Object.create||function(t,n){var e;return null!==t?(c.prototype=r(t),e=new c,c.prototype=null,e[u]=t):e=s(),void 0===n?e:o(e,n)}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n,e){"use strict";var r=e(7).f,o=e(44),i=e(34),u=e(10),c=e(35),s=e(14),a=e(28),f=e(46),l=e(71),p=e(9),h=e(21).fastKey,d=e(15),v=p?"_s":"size",y=function(t,n){var e,r=h(n);if("F"!==r)return t._i[r];for(e=t._f;e;e=e.n)if(e.k==n)return e};t.exports={getConstructor:function(t,n,e,a){var f=t(function(t,r){c(t,f,n,"_i"),t._t=n,t._i=o(null),t._f=void 0,t._l=void 0,t[v]=0,void 0!=r&&s(r,e,t[a],t)});return i(f.prototype,{clear:function(){for(var t=d(this,n),e=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete e[r.i];t._f=t._l=void 0,t[v]=0},delete:function(t){var e=d(this,n),r=y(e,t);if(r){var o=r.n,i=r.p;delete e._i[r.i],r.r=!0,i&&(i.n=o),o&&(o.p=i),e._f==r&&(e._f=o),e._l==r&&(e._l=i),e[v]--}return!!r},forEach:function(t){d(this,n);for(var e,r=u(t,arguments.length>1?arguments[1]:void 0,3);e=e?e.n:this._f;)for(r(e.v,e.k,this);e&&e.r;)e=e.p},has:function(t){return!!y(d(this,n),t)}}),p&&r(f.prototype,"size",{get:function(){return d(this,n)[v]}}),f},def:function(t,n,e){var r,o,i=y(t,n);return i?i.v=e:(t._l=i={i:o=h(n,!0),k:n,v:e,p:r=t._l,n:void 0,r:!1},t._f||(t._f=i),r&&(r.n=i),t[v]++,"F"!==o&&(t._i[o]=i)),t},getEntry:y,setStrong:function(t,n,e){a(t,n,function(t,e){this._t=d(t,n),this._k=e,this._l=void 0},function(){for(var t=this,n=t._k,e=t._l;e&&e.r;)e=e.p;return t._t&&(t._l=e=e?e.n:t._t._f)?"keys"==n?f(0,e.k):"values"==n?f(0,e.v):f(0,[e.k,e.v]):(t._t=void 0,f(1))},e?"entries":"values",!e,!0),l(n)}}},function(t,n,e){var r=e(8);t.exports=function(t,n,e,o){try{return o?n(r(e)[0],e[1]):n(e)}catch(n){var i=t.return;throw void 0!==i&&r(i.call(t)),n}}},function(t,n,e){var r=e(13),o=e(0)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},function(t,n,e){var r=e(23),o=e(0)("iterator"),i=e(13);t.exports=e(4).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,n,e){var r=e(0)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,n){if(!n&&!o)return!1;var e=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:e=!0}},i[r]=function(){return u},t(i)}catch(t){}return e}},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(23),o=e(76);t.exports=function(t){return function(){if(r(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},function(t,n,e){var r=e(10),o=e(30),i=e(20),u=e(19),c=e(86);t.exports=function(t,n){var e=1==t,s=2==t,a=3==t,f=4==t,l=6==t,p=5==t||l,h=n||c;return function(n,c,d){for(var v,y,m=i(n),g=o(m),b=r(c,d,3),x=u(g.length),_=0,w=e?h(n,x):s?h(n,0):void 0;x>_;_++)if((p||_ in g)&&(v=g[_],y=b(v,_,m),t))if(e)w[_]=y;else if(y)switch(t){case 3:return!0;case 5:return v;case 6:return _;case 2:w.push(v)}else if(f)return!1;return l?-1:a||f?f:w}}},function(t,n,e){"use strict";var r=e(29),o=e(89),i=e(52),u=e(20),c=e(30),s=Object.assign;t.exports=!s||e(12)(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=s({},t)[e]||Object.keys(s({},n)).join("")!=r})?function(t,n){for(var e=u(t),s=arguments.length,a=1,f=o.f,l=i.f;s>a;)for(var p,h=c(arguments[a++]),d=f?r(h).concat(f(h)):r(h),v=d.length,y=0;v>y;)l.call(h,p=d[y++])&&(e[p]=h[p]);return e}:s},function(t,n,e){t.exports=e(57)},function(t,n,e){"use strict";function r(t,n){function e(){this.constructor=t}q(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}function o(t,n,e,r){var o,i=arguments.length,u=i<3?n:null===r?r=Object.getOwnPropertyDescriptor(n,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(t,n,e,r);else for(var c=t.length-1;c>=0;c--)(o=t[c])&&(u=(i<3?o(u):i>3?o(n,e,u):o(n,e))||u);return i>3&&u&&Object.defineProperty(n,e,u),u}function i(t,n,e){return t===t&&(void 0!==e&&(t=t<=e?t:e),void 0!==n&&(t=t>=n?t:n)),t}function u(t){var n=typeof t;return null!=t&&("object"==n||"function"==n)}function c(t){var n=it.call(t,ct),e=t[ct];try{t[ct]=void 0;var r=!0}catch(t){}var o=ut.call(t);return r&&(n?t[ct]=e:delete t[ct]),o}function s(t){return ft.call(t)}function a(t){return null==t?void 0===t?ht:pt:dt&&dt in Object(t)?st(t):lt(t)}function f(t){return null!=t&&"object"==typeof t}function l(t){return"symbol"==typeof t||yt(t)&&vt(t)==mt}function p(t){if("number"==typeof t)return t;if(gt(t))return bt;if(J(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=J(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(xt,"");var e=wt.test(t);return e||St.test(t)?Et(t.slice(2),e?2:8):_t.test(t)?bt:+t}function h(t,n,e){return void 0===e&&(e=n,n=void 0),void 0!==e&&(e=Ot(e),e=e===e?e:0),void 0!==n&&(n=Ot(n),n=n===n?n:0),$(Ot(t),n,e)}function d(t,n){return void 0===t&&(t=-1/0),void 0===n&&(n=1/0),function(e,r){var o="_"+r;Object.defineProperty(e,r,{get:function(){return this[o]},set:function(e){Object.defineProperty(this,o,{value:Tt(e,t,n),enumerable:!1,writable:!0,configurable:!0})},enumerable:!0,configurable:!0})}}function v(t,n){var e="_"+n;Object.defineProperty(t,n,{get:function(){return this[e]},set:function(t){Object.defineProperty(this,e,{value:!!t,enumerable:!1,writable:!0,configurable:!0})},enumerable:!0,configurable:!0})}function y(t,n,e){function r(n){var e=p,r=h;return p=h=void 0,g=n,v=t.apply(r,e)}function o(t){return g=t,y=setTimeout(c,n),b?r(t):v}function i(t){var e=t-m,r=t-g,o=n-e;return x?kt(o,d-r):o}function u(t){var e=t-m,r=t-g;return void 0===m||e>=n||e<0||x&&r>=d}function c(){var t=Mt();if(u(t))return s(t);y=setTimeout(c,i(t))}function s(t){return y=void 0,_&&p?r(t):(p=h=void 0,v)}function a(){void 0!==y&&clearTimeout(y),g=0,p=m=h=y=void 0}function f(){return void 0===y?v:s(Mt())}function l(){var t=Mt(),e=u(t);if(p=arguments,h=this,m=t,e){if(void 0===y)return o(m);if(x)return y=setTimeout(c,n),r(m)}return void 0===y&&(y=setTimeout(c,n)),v}var p,h,d,v,y,m,g=0,b=!1,x=!1,_=!0;if("function"!=typeof t)throw new TypeError(jt);return n=Ot(n)||0,J(e)&&(b=!!e.leading,x="maxWait"in e,d=x?Pt(Ot(e.maxWait)||0,n):d,_="trailing"in e?!!e.trailing:_),l.cancel=a,l.flush=f,l}function m(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return function(n,e,r){var o=r.value;return{get:function(){return this.hasOwnProperty(e)||Object.defineProperty(this,e,{value:Dt.apply(void 0,[o].concat(t))}),this[e]}}}}function g(t){var n=Nt.get(t)||[];return Nt.set(t,n),function(t,e,r){function o(t){!t.type.match(/drag/)&&t.defaultPrevented||r(t)}e.split(/\s+/g).forEach(function(e){n.push({elem:t,eventName:e,handler:o}),t.addEventListener(e,o)})}}function b(t){var n=Nt.get(t);n&&(n.forEach(function(t){var n=t.elem,e=t.eventName,r=t.handler;n.removeEventListener(e,r)}),Nt.delete(t))}function x(t){return t.touches?t.touches[t.touches.length-1]:t}function _(t){var n=x(t);return{x:n.clientX,y:n.clientY}}function w(t,n){return void 0===n&&(n=[]),n.some(function(n){return t===n})}function S(t){var n={};return Object.keys(t).forEach(function(e){if(!Ct.test(e))return void(n[e]=t[e]);var r=t[e];e=e.replace(/^-/,""),n[e]=r,zt.forEach(function(t){n["-"+t+"-"+e]=r})}),n}function E(t,n){n=S(n),Object.keys(n).forEach(function(e){var r=e.replace(/^-/,"").replace(/-([a-z])/g,function(t,n){return n.toUpperCase()});t.style[r]=n[e]})}function O(t,n,e){void 0===n&&(n=0),void 0===e&&(e=0);var r=t.options,o=t.offset,i=t.limit;if(!r.continuousScrolling)return!1;0===i.x&&0===i.y&&t.update();var u=Tt(n+o.x,0,i.x),c=Tt(e+o.y,0,i.y),s=!0;return s=s&&u===o.x,s=s&&c===o.y,s=s&&(o.x===i.x||0===o.x||o.y===i.y||0===o.y)}function T(t){var n=t.containerEl,e=t.contentEl;return{container:{width:n.clientWidth,height:n.clientHeight},content:{width:e.offsetWidth-e.clientWidth+e.scrollWidth,height:e.offsetHeight-e.clientHeight+e.scrollHeight}}}function A(t,n){var e=t.bounding,r=n.getBoundingClientRect(),o=Math.max(e.top,r.top),i=Math.max(e.left,r.left),u=Math.min(e.right,r.right);return o<Math.min(e.bottom,r.bottom)&&i<u}function M(t){var n=t.getSize(),e={x:Math.max(n.content.width-n.container.width,0),y:Math.max(n.content.height-n.container.height,0)},r=t.containerEl.getBoundingClientRect(),o={top:Math.max(r.top,0),right:Math.min(r.right,window.innerWidth),bottom:Math.min(r.bottom,window.innerHeight),left:Math.max(r.left,0)};t.size=n,t.limit=e,t.bounding=o,t.track.update(),t.setPosition()}function j(t,n,e){var r=t.options,o=t.offset,i=t.limit,u=t.track,c=t.contentEl;return r.renderByPixels&&(n=Math.round(n),e=Math.round(e)),n=Tt(n,0,i.x),e=Tt(e,0,i.y),n!==o.x&&u.xAxis.show(),e!==o.y&&u.yAxis.show(),r.alwaysShowTracks||u.autoHideOnIdle(),n===o.x&&e===o.y?null:(o.x=n,o.y=e,E(c,{"-transform":"translate3d("+-n+"px, "+-e+"px, 0)"}),u.update(),{offset:K({},o),limit:K({},i)})}function P(t,n,e,r,o){function i(){var n=Date.now()-g,e=r?s(Math.min(n/r,1)):1;t.setPosition(d+y*e,v+m*e),n>=r?"function"==typeof f&&f.call(t):requestAnimationFrame(i)}void 0===r&&(r=0);var u=void 0===o?{}:o,c=u.easing,s=void 0===c?k:c,a=u.callback,f=void 0===a?null:a,l=t.options,p=t.offset,h=t.limit;l.renderByPixels&&(n=Math.round(n),e=Math.round(e));var d=p.x,v=p.y,y=Tt(n,0,h.x)-d,m=Tt(e,0,h.y)-v,g=Date.now();i()}function k(t){return Math.pow(t-1,3)+1}function D(t,n,e){var r=void 0===e?{}:e,o=r.alignToTop,i=void 0===o||o,u=r.onlyScrollIfNeeded,c=void 0!==u&&u,s=r.offsetTop,a=void 0===s?0:s,f=r.offsetLeft,l=void 0===f?0:f,p=r.offsetBottom,h=void 0===p?0:p,d=t.containerEl,v=t.bounding;if(n&&d.contains(n)){var y=n.getBoundingClientRect();c&&t.isVisible(n)||t.setMomentum(y.left-v.left-l,i?y.top-v.top-a:y.bottom-v.bottom-h)}}function L(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];t.forEach(function(t){var n=t.pluginName;if(!n)throw new TypeError("plugin name is required");Vt.order.add(n),Vt.constructors[n]=t})}function N(t,n){return Array.from(Vt.order).filter(function(t){return!1!==n[t]}).map(function(e){var r=Vt.constructors[e],o=new r(t,n[e]);return n[e]=o.options,o})}function z(t){var n=g(t),e=t.containerEl;n(e,"keydown",function(n){if(document.activeElement===e){var r=C(t,n.keyCode||n.which);if(r){var o=r[0],i=r[1];if(O(t,o,i))return e.blur(),void(t.parent&&t.parent.containerEl.focus());n.preventDefault(),t.addTransformableMomentum(o,i,n)}}})}function C(t,n){var e=t.size,r=t.limit,o=t.offset;switch(n){case It.SPACE:return[0,200];case It.PAGE_UP:return[0,40-e.container.height];case It.PAGE_DOWN:return[0,e.container.height-40];case It.END:return[0,r.y-o.y];case It.HOME:return[0,-o.y];case It.LEFT:return[-40,0];case It.UP:return[0,-40];case It.RIGHT:return[40,0];case It.DOWN:return[0,40];default:return null}}function R(t){function n(n,e){var r=t.size;if(n===Ut.X){return e/(r.container.width+(l.thumb.realSize-l.thumb.displaySize))*r.content.width}if(n===Ut.Y){return e/(r.container.height+(p.thumb.realSize-p.thumb.displaySize))*r.content.height}return 0}function e(t){return w(t,[l.element,l.thumb.element])?Ut.X:w(t,[p.element,p.thumb.element])?Ut.Y:void 0}var r,o,i,u,c,s=g(t),a=t.containerEl,f=t.track,l=f.xAxis,p=f.yAxis;s(a,"click",function(r){if(!o&&w(r.target,[l.element,p.element])){var i=r.target,u=e(i),c=i.getBoundingClientRect(),s=_(r),a=t.offset,f=t.limit;if(u===Ut.X){var h=s.x-c.left-l.thumb.displaySize/2;t.setMomentum(Tt(n(u,h)-a.x,-a.x,f.x-a.x),0)}if(u===Ut.Y){var h=s.y-c.top-p.thumb.displaySize/2;t.setMomentum(0,Tt(n(u,h)-a.y,-a.y,f.y-a.y))}}}),s(a,"mousedown",function(n){if(w(n.target,[l.thumb.element,p.thumb.element])){r=!0;var o=n.target,s=_(n),f=o.getBoundingClientRect();u=e(o),i={x:s.x-f.left,y:s.y-f.top},c=a.getBoundingClientRect(),E(t.containerEl,{"-user-select":"none"})}}),s(window,"mousemove",function(e){if(r){e.preventDefault(),o=!0;var s=t.offset,a=_(e);if(u===Ut.X){var f=a.x-i.x-c.left;t.setPosition(n(u,f),s.y)}if(u===Ut.Y){var f=a.y-i.y-c.top;t.setPosition(s.x,n(u,f))}}}),s(window,"mouseup blur",function(){r=o=!1,E(t.containerEl,{"-user-select":""})})}function F(t){g(t)(window,"resize",Dt(t.update.bind(t),300))}function I(t){function n(r){var o=r.x,i=r.y;(o||i)&&(t.setMomentum(Tt(u.x+o,0,c.x)-u.x,Tt(u.y+i,0,c.y)-u.y),e=requestAnimationFrame(function(){n({x:o,y:i})}))}var e,r=g(t),o=t.containerEl,i=t.contentEl,u=t.offset,c=t.limit,s=!1;r(window,"mousemove",function(r){if(s){cancelAnimationFrame(e);n(H(t,r))}}),r(i,"selectstart",function(t){t.stopPropagation(),cancelAnimationFrame(e),s=!0,E(document.body,{"-user-select":"none"}),E(o,{"-user-select":"auto"})}),r(window,"mouseup blur",function(){cancelAnimationFrame(e),s=!1,E(document.body,{"-user-select":""}),E(o,{"-user-select":""})}),r(o,"scroll",function(t){t.preventDefault(),o.scrollTop=o.scrollLeft=0})}function H(t,n){var e=t.bounding,r=e.top,o=e.right,i=e.bottom,u=e.left,c=_(n),s=c.x,a=c.y,f={x:0,y:0};return 0===s&&0===a?f:(s>o-20?f.x=s-o+20:s<u+20&&(f.x=s-u-20),a>i-20?f.y=a-i+20:a<r+20&&(f.y=a-r-20),f.x*=2,f.y*=2,f)}function W(t){var n,e=/Android/.test(navigator.userAgent)?3:2,r=t.containerEl,o=new Ft,i=g(t),u=0;i(r,"touchstart",function(e){o.track(e),t.setMomentum(0,0),0===u&&(n=t.options.damping,t.options.damping=Math.max(n,.5)),u++}),i(r,"touchmove",function(n){if(!Xt||Xt===t){o.update(n);var e=o.getDelta(),r=e.x,i=e.y;O(t,r,i)||(n.preventDefault(),t.addTransformableMomentum(r,i,n),Xt=t)}}),i(r,"touchcancel touchend",function(r){var i=o.getVelocity(),c={x:0,y:0};Object.keys(i).forEach(function(t){var r=i[t]/n;c[t]=Math.abs(r)<50?0:r*e}),t.addTransformableMomentum(c.x,c.y,r),u--,0===u&&(t.options.damping=n),o.release(r),Xt=null})}function B(t){g(t)(t.options.wheelEventTarget||t.containerEl,"onwheel"in window?"wheel":"mousewheel",function(n){var e=G(n),r=e.x,o=e.y;O(t,r,o)||(n.preventDefault(),t.addTransformableMomentum(r,o,n))})}function G(t){if("deltaX"in t){var n=Kt(t.deltaMode);return{x:t.deltaX/Yt.STANDARD*n,y:t.deltaY/Yt.STANDARD*n}}return"wheelDeltaX"in t?{x:t.wheelDeltaX/Yt.OTHERS,y:t.wheelDeltaY/Yt.OTHERS}:{x:0,y:t.wheelDelta/Yt.OTHERS}}function V(){if(!tn&&"undefined"!=typeof window){var t=document.createElement("style");t.id=Zt,t.textContent=Qt,document.head.appendChild(t),tn=!0}}function U(){if(tn&&"undefined"!=typeof window){var t=document.getElementById(Zt);t&&t.parentNode&&(t.parentNode.removeChild(t),tn=!1)}}Object.defineProperty(n,"__esModule",{value:!0});var X={};e.d(X,"keyboardHandler",function(){return z}),e.d(X,"mouseHandler",function(){return R}),e.d(X,"resizeHandler",function(){return F}),e.d(X,"selectHandler",function(){return I}),e.d(X,"touchHandler",function(){return W}),e.d(X,"wheelHandler",function(){return B});var Y,q=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])},K=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++){n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},$=(e(58),e(79),e(84),e(93),e(96),i),J=u,Q=e(98),Z="object"==typeof self&&self&&self.Object===Object&&self,tt=Q.a||Z||Function("return this")(),nt=tt,et=nt.Symbol,rt=et,ot=Object.prototype,it=ot.hasOwnProperty,ut=ot.toString,ct=rt?rt.toStringTag:void 0,st=c,at=Object.prototype,ft=at.toString,lt=s,pt="[object Null]",ht="[object Undefined]",dt=rt?rt.toStringTag:void 0,vt=a,yt=f,mt="[object Symbol]",gt=l,bt=NaN,xt=/^\s+|\s+$/g,_t=/^[-+]0x[0-9a-f]+$/i,wt=/^0b[01]+$/i,St=/^0o[0-7]+$/i,Et=parseInt,Ot=p,Tt=h,At=function(){return nt.Date.now()},Mt=At,jt="Expected a function",Pt=Math.max,kt=Math.min,Dt=y,Lt=function(){function t(t){void 0===t&&(t={});var n=this;this.damping=.1,this.thumbMinSize=20,this.renderByPixels=!0,this.alwaysShowTracks=!1,this.continuousScrolling=!0,this.wheelEventTarget=null,this.plugins={},Object.keys(t).forEach(function(e){n[e]=t[e]})}return o([d(0,1)],t.prototype,"damping",void 0),o([d(0,1/0)],t.prototype,"thumbMinSize",void 0),o([v],t.prototype,"renderByPixels",void 0),o([v],t.prototype,"alwaysShowTracks",void 0),o([v],t.prototype,"continuousScrolling",void 0),t}(),Nt=new WeakMap,zt=["webkit","moz","ms","o"],Ct=new RegExp("^-(?!(?:"+zt.join("|")+")-)"),Rt=function(){function t(t){this.updateTime=Date.now(),this.delta={x:0,y:0},this.velocity={x:0,y:0},this.lastPosition={x:0,y:0},this.lastPosition=_(t)}return t.prototype.update=function(t){var n=this,e=n.velocity,r=n.updateTime,o=n.lastPosition,i=Date.now(),u=_(t),c={x:-(u.x-o.x),y:-(u.y-o.y)},s=i-r||16,a=c.x/s*16,f=c.y/s*16;e.x=.9*a+.1*e.x,e.y=.9*f+.1*e.y,this.delta=c,this.updateTime=i,this.lastPosition=u},t}(),Ft=function(){function t(){this._touchList={}}return Object.defineProperty(t.prototype,"_primitiveValue",{get:function(){return{x:0,y:0}},enumerable:!0,configurable:!0}),t.prototype.isActive=function(){return void 0!==this._activeTouchID},t.prototype.getDelta=function(){var t=this._getActiveTracker();return t?K({},t.delta):this._primitiveValue},t.prototype.getVelocity=function(){var t=this._getActiveTracker();return t?K({},t.velocity):this._primitiveValue},t.prototype.track=function(t){var n=this,e=t.targetTouches;return Array.from(e).forEach(function(t){n._add(t)}),this._touchList},t.prototype.update=function(t){var n=this,e=t.touches,r=t.changedTouches;return Array.from(e).forEach(function(t){n._renew(t)}),this._setActiveID(r),this._touchList},t.prototype.release=function(t){var n=this;delete this._activeTouchID,Array.from(t.changedTouches).forEach(function(t){n._delete(t)})},t.prototype._add=function(t){if(!this._has(t)){var n=new Rt(t);this._touchList[t.identifier]=n}},t.prototype._renew=function(t){if(this._has(t)){this._touchList[t.identifier].update(t)}},t.prototype._delete=function(t){delete this._touchList[t.identifier]},t.prototype._has=function(t){return this._touchList.hasOwnProperty(t.identifier)},t.prototype._setActiveID=function(t){this._activeTouchID=t[t.length-1].identifier,this._lastTouch=this._touchList[this._activeTouchID]},t.prototype._getActiveTracker=function(){var t=this;return t._touchList[t._activeTouchID]},t}();!function(t){t.X="x",t.Y="y"}(Y||(Y={}));var It,Ht=function(){function t(t,n){void 0===n&&(n=0),this._direction=t,this._minSize=n,this.element=document.createElement("div"),this.displaySize=0,this.realSize=0,this.offset=0,this.element.className="scrollbar-thumb scrollbar-thumb-"+t}return t.prototype.attachTo=function(t){t.appendChild(this.element)},t.prototype.update=function(t,n,e){this.realSize=Math.min(n/e,1)*n,this.displaySize=Math.max(this.realSize,this._minSize),this.offset=t/e*(n+(this.realSize-this.displaySize)),E(this.element,this._getStyle())},t.prototype._getStyle=function(){switch(this._direction){case Y.X:return{width:this.displaySize+"px","-transform":"translate3d("+this.offset+"px, 0, 0)"};case Y.Y:return{height:this.displaySize+"px","-transform":"translate3d(0, "+this.offset+"px, 0)"};default:return null}},t}(),Wt=function(){function t(t,n){void 0===n&&(n=0),this.element=document.createElement("div"),this._isShown=!1,this.element.className="scrollbar-track scrollbar-track-"+t,this.thumb=new Ht(t,n),this.thumb.attachTo(this.element)}return t.prototype.attachTo=function(t){t.appendChild(this.element)},t.prototype.show=function(){this._isShown||(this._isShown=!0,this.element.classList.add("show"))},t.prototype.hide=function(){this._isShown&&(this._isShown=!1,this.element.classList.remove("show"))},t.prototype.update=function(t,n,e){E(this.element,{display:e<=n?"none":"block"}),this.thumb.update(t,n,e)},t}(),Bt=function(){function t(t){this._scrollbar=t;var n=t.options.thumbMinSize;this.xAxis=new Wt(Y.X,n),this.yAxis=new Wt(Y.Y,n),this.xAxis.attachTo(t.containerEl),this.yAxis.attachTo(t.containerEl),t.options.alwaysShowTracks&&(this.xAxis.show(),this.yAxis.show())}return t.prototype.update=function(){var t=this._scrollbar,n=t.size,e=t.offset;this.xAxis.update(e.x,n.container.width,n.content.width),this.yAxis.update(e.y,n.container.height,n.content.height)},t.prototype.autoHideOnIdle=function(){this._scrollbar.options.alwaysShowTracks||(this.xAxis.hide(),this.yAxis.hide())},o([m(300)],t.prototype,"autoHideOnIdle",null),t}(),Gt=function(){function t(t,n){var e=this.constructor;this.scrollbar=t,this.name=e.pluginName,this.options=K({},e.defaultOptions,n)}return t.prototype.onInit=function(){},t.prototype.onDestory=function(){},t.prototype.onUpdate=function(){},t.prototype.onRender=function(t){},t.prototype.transformDelta=function(t,n){return K({},t)},t.pluginName="",t.defaultOptions={},t}(),Vt={order:new Set,constructors:{}};!function(t){t[t.SPACE=32]="SPACE",t[t.PAGE_UP=33]="PAGE_UP",t[t.PAGE_DOWN=34]="PAGE_DOWN",t[t.END=35]="END",t[t.HOME=36]="HOME",t[t.LEFT=37]="LEFT",t[t.UP=38]="UP",t[t.RIGHT=39]="RIGHT",t[t.DOWN=40]="DOWN"}(It||(It={}));var Ut;!function(t){t[t.X=0]="X",t[t.Y=1]="Y"}(Ut||(Ut={}));var Xt,Yt={STANDARD:1,OTHERS:-3},qt=[1,28,500],Kt=function(t){return qt[t]||qt[0]},$t=new Map,Jt=function(){function t(t,n){var e=this;this.offset={x:0,y:0},this.limit={x:1/0,y:1/0},this.bounding={top:0,right:0,bottom:0,left:0},this._plugins=[],this._momentum={x:0,y:0},this._listeners=new Set,this.containerEl=t;var r=this.contentEl=document.createElement("div");this.options=new Lt(n),t.setAttribute("data-scrollbar","true"),t.setAttribute("tabindex","1"),E(t,{overflow:"hidden",outline:"none"}),window.navigator.msPointerEnabled&&(t.style.msTouchAction="none"),r.className="scroll-content",Array.from(t.childNodes).forEach(function(t){r.appendChild(t)}),t.appendChild(r),this.track=new Bt(this),this.size=this.getSize(),this._plugins=N(this,this.options.plugins);var o=t.scrollLeft,i=t.scrollTop;t.scrollLeft=t.scrollTop=0,this.setPosition(o,i,{withoutCallbacks:!0});var u=window,c=u.MutationObserver||u.WebKitMutationObserver||u.MozMutationObserver;"function"==typeof c&&(this._observer=new c(function(){e.update()}),this._observer.observe(r,{subtree:!0,childList:!0})),$t.set(t,this),requestAnimationFrame(function(){e._init()})}return Object.defineProperty(t.prototype,"parent",{get:function(){for(var t=this.containerEl.parentElement;t;){var n=$t.get(t);if(n)return n;t=t.parentElement}return null},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"scrollTop",{get:function(){return this.offset.y},set:function(t){this.setPosition(this.scrollLeft,t)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"scrollLeft",{get:function(){return this.offset.x},set:function(t){this.setPosition(t,this.scrollTop)},enumerable:!0,configurable:!0}),t.prototype.getSize=function(){return T(this)},t.prototype.update=function(){M(this),this._plugins.forEach(function(t){t.onUpdate()})},t.prototype.isVisible=function(t){return A(this,t)},t.prototype.setPosition=function(t,n,e){var r=this;void 0===t&&(t=this.offset.x),void 0===n&&(n=this.offset.y),void 0===e&&(e={});var o=j(this,t,n);o&&!e.withoutCallbacks&&this._listeners.forEach(function(t){t.call(r,o)})},t.prototype.scrollTo=function(t,n,e,r){void 0===t&&(t=this.offset.x),void 0===n&&(n=this.offset.y),void 0===e&&(e=0),void 0===r&&(r={}),P(this,t,n,e,r)},t.prototype.scrollIntoView=function(t,n){void 0===n&&(n={}),D(this,t,n)},t.prototype.addListener=function(t){if("function"!=typeof t)throw new TypeError("[smooth-scrollbar] scrolling listener should be a function");this._listeners.add(t)},t.prototype.removeListener=function(t){this._listeners.delete(t)},t.prototype.addTransformableMomentum=function(t,n,e){this._updateDebounced();var r=this._plugins.reduce(function(t,n){return n.transformDelta(t,e)||t},{x:t,y:n});this.addMomentum(r.x,r.y)},t.prototype.addMomentum=function(t,n){this.setMomentum(this._momentum.x+t,this._momentum.y+n)},t.prototype.setMomentum=function(t,n){0===this.limit.x&&(t=0),0===this.limit.y&&(n=0),this.options.renderByPixels&&(t=Math.round(t),n=Math.round(n)),this._momentum.x=t,this._momentum.y=n},t.prototype.updatePluginOptions=function(t,n){this._plugins.forEach(function(e){e.name===t&&Object.assign(e.options,n)})},t.prototype.destroy=function(){var t=this,n=t.containerEl,e=t.contentEl;b(this),this._listeners.clear(),this.setMomentum(0,0),cancelAnimationFrame(this._renderID),this._observer&&this._observer.disconnect(),$t.delete(this.containerEl);for(var r=Array.from(e.childNodes);n.firstChild;)n.removeChild(n.firstChild);r.forEach(function(t){n.appendChild(t)}),E(n,{overflow:""}),n.scrollTop=this.scrollTop,n.scrollLeft=this.scrollLeft,this._plugins.forEach(function(t){t.onDestory()}),this._plugins.length=0},t.prototype._init=function(){var t=this;this.update(),Object.keys(X).forEach(function(n){X[n](t)}),this._plugins.forEach(function(t){t.onInit()}),this._render()},t.prototype._updateDebounced=function(){this.update()},t.prototype._render=function(){var t=this._momentum;if(t.x||t.y){var n=this._nextTick("x"),e=this._nextTick("y");t.x=n.momentum,t.y=e.momentum,this.setPosition(n.position,e.position)}var r=K({},this._momentum);this._plugins.forEach(function(t){t.onRender(r)}),this._renderID=requestAnimationFrame(this._render.bind(this))},t.prototype._nextTick=function(t){var n=this,e=n.options,r=n.offset,o=n._momentum,i=r[t],u=o[t];if(Math.abs(u)<=.1)return{momentum:0,position:i+u};var c=u*(1-e.damping);return e.renderByPixels&&(c|=0),{momentum:c,position:i+u-c}},o([m(100,{leading:!0})],t.prototype,"_updateDebounced",null),t}(),Qt="\n[data-scrollbar] {\n  display: block;\n  position: relative;\n}\n\n.scroll-content {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n\n.scrollbar-track {\n  position: absolute;\n  opacity: 0;\n  z-index: 1;\n  background: rgba(222, 222, 222, .75);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity 0.5s 0.5s ease-out;\n          transition: opacity 0.5s 0.5s ease-out;\n}\n.scrollbar-track.show,\n.scrollbar-track:hover {\n  opacity: 1;\n  -webkit-transition-delay: 0s;\n          transition-delay: 0s;\n}\n\n.scrollbar-track-x {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 8px;\n}\n.scrollbar-track-y {\n  top: 0;\n  right: 0;\n  width: 8px;\n  height: 100%;\n}\n.scrollbar-thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 8px;\n  height: 8px;\n  background: rgba(0, 0, 0, .5);\n  border-radius: 4px;\n}\n",Zt="smooth-scrollbar-style",tn=!1;e.d(n,"ScrollbarPlugin",function(){return Gt});var nn=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return r(n,t),n.init=function(t,n){if(!t||1!==t.nodeType)throw new TypeError("expect element to be DOM Element, but got "+t);return V(),$t.has(t)?$t.get(t):new Jt(t,n)},n.initAll=function(t){return Array.from(document.querySelectorAll("[data-scrollbar]"),function(e){return n.init(e,t)})},n.has=function(t){return $t.has(t)},n.get=function(t){return $t.get(t)},n.getAll=function(){return Array.from($t.values())},n.destroy=function(t){var n=$t.get(t);n&&n.destroy()},n.destroyAll=function(){$t.forEach(function(t){t.destroy()})},n.use=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return L.apply(void 0,t)},n.attachStyle=function(){return V()},n.detachStyle=function(){return U()},n.version="8.2.0",n.ScrollbarPlugin=Gt,n}(Jt);n.default=nn},function(t,n,e){e(22),e(25),e(33),e(70),e(75),e(77),e(78),t.exports=e(4).Map},function(t,n,e){var r=e(26),o=e(27);t.exports=function(t){return function(n,e){var i,u,c=String(o(n)),s=r(e),a=c.length;return s<0||s>=a?t?"":void 0:(i=c.charCodeAt(s),i<55296||i>56319||s+1===a||(u=c.charCodeAt(s+1))<56320||u>57343?t?c.charAt(s):i:t?c.slice(s,s+2):u-56320+(i-55296<<10)+65536)}}},function(t,n){t.exports=!1},function(t,n,e){"use strict";var r=e(44),o=e(17),i=e(32),u={};e(11)(u,e(0)("iterator"),function(){return this}),t.exports=function(t,n,e){t.prototype=r(u,{next:o(1,e)}),i(t,n+" Iterator")}},function(t,n,e){var r=e(7),o=e(8),i=e(29);t.exports=e(9)?Object.defineProperties:function(t,n){o(t);for(var e,u=i(n),c=u.length,s=0;c>s;)r.f(t,e=u[s++],n[e]);return t}},function(t,n,e){var r=e(3),o=e(18),i=e(64)(!1),u=e(31)("IE_PROTO");t.exports=function(t,n){var e,c=o(t),s=0,a=[];for(e in c)e!=u&&r(c,e)&&a.push(e);for(;n.length>s;)r(c,e=n[s++])&&(~i(a,e)||a.push(e));return a}},function(t,n,e){var r=e(18),o=e(19),i=e(65);t.exports=function(t){return function(n,e,u){var c,s=r(n),a=o(s.length),f=i(u,a);if(t&&e!=e){for(;a>f;)if((c=s[f++])!=c)return!0}else for(;a>f;f++)if((t||f in s)&&s[f]===e)return t||f||0;return!t&&-1}}},function(t,n,e){var r=e(26),o=Math.max,i=Math.min;t.exports=function(t,n){return t=r(t),t<0?o(t+n,0):i(t,n)}},function(t,n,e){var r=e(2).document;t.exports=r&&r.documentElement},function(t,n,e){var r=e(3),o=e(20),i=e(31)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,n,e){"use strict";var r=e(69),o=e(46),i=e(13),u=e(18);t.exports=e(28)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,o(1)):"keys"==n?o(0,e):"values"==n?o(0,t[e]):o(0,[e,t[e]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,n,e){var r=e(0)("unscopables"),o=Array.prototype;void 0==o[r]&&e(11)(o,r,{}),t.exports=function(t){o[r][t]=!0}},function(t,n,e){"use strict";var r=e(47),o=e(15);t.exports=e(36)("Map",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var n=r.getEntry(o(this,"Map"),t);return n&&n.v},set:function(t,n){return r.def(o(this,"Map"),0===t?0:t,n)}},r,!0)},function(t,n,e){"use strict";var r=e(2),o=e(7),i=e(9),u=e(0)("species");t.exports=function(t){var n=r[t];i&&n&&!n[u]&&o.f(n,u,{configurable:!0,get:function(){return this}})}},function(t,n,e){var r=e(1),o=e(73).set;t.exports=function(t,n,e){var i,u=n.constructor;return u!==e&&"function"==typeof u&&(i=u.prototype)!==e.prototype&&r(i)&&o&&o(t,i),t}},function(t,n,e){var r=e(1),o=e(8),i=function(t,n){if(o(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{r=e(10)(Function.call,e(74).f(Object.prototype,"__proto__").set,2),r(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return i(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:i}},function(t,n,e){var r=e(52),o=e(17),i=e(18),u=e(42),c=e(3),s=e(40),a=Object.getOwnPropertyDescriptor;n.f=e(9)?a:function(t,n){if(t=i(t),n=u(n,!0),s)try{return a(t,n)}catch(t){}if(c(t,n))return o(!r.f.call(t,n),t[n])}},function(t,n,e){var r=e(5);r(r.P+r.R,"Map",{toJSON:e(53)("Map")})},function(t,n,e){var r=e(14);t.exports=function(t,n){var e=[];return r(t,!1,e.push,e,n),e}},function(t,n,e){e(37)("Map")},function(t,n,e){e(38)("Map")},function(t,n,e){e(22),e(25),e(33),e(80),e(81),e(82),e(83),t.exports=e(4).Set},function(t,n,e){"use strict";var r=e(47),o=e(15);t.exports=e(36)("Set",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return r.def(o(this,"Set"),t=0===t?0:t,t)}},r)},function(t,n,e){var r=e(5);r(r.P+r.R,"Set",{toJSON:e(53)("Set")})},function(t,n,e){e(37)("Set")},function(t,n,e){e(38)("Set")},function(t,n,e){e(22),e(33),e(85),e(91),e(92),t.exports=e(4).WeakMap},function(t,n,e){"use strict";var r,o=e(54)(0),i=e(6),u=e(21),c=e(55),s=e(90),a=e(1),f=e(12),l=e(15),p=u.getWeak,h=Object.isExtensible,d=s.ufstore,v={},y=function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},m={get:function(t){if(a(t)){var n=p(t);return!0===n?d(l(this,"WeakMap")).get(t):n?n[this._i]:void 0}},set:function(t,n){return s.def(l(this,"WeakMap"),t,n)}},g=t.exports=e(36)("WeakMap",y,m,s,!0,!0);f(function(){return 7!=(new g).set((Object.freeze||Object)(v),7).get(v)})&&(r=s.getConstructor(y,"WeakMap"),c(r.prototype,m),u.NEED=!0,o(["delete","has","get","set"],function(t){var n=g.prototype,e=n[t];i(n,t,function(n,o){if(a(n)&&!h(n)){this._f||(this._f=new r);var i=this._f[t](n,o);return"set"==t?this:i}return e.call(this,n,o)})}))},function(t,n,e){var r=e(87);t.exports=function(t,n){return new(r(t))(n)}},function(t,n,e){var r=e(1),o=e(88),i=e(0)("species");t.exports=function(t){var n;return o(t)&&(n=t.constructor,"function"!=typeof n||n!==Array&&!o(n.prototype)||(n=void 0),r(n)&&null===(n=n[i])&&(n=void 0)),void 0===n?Array:n}},function(t,n,e){var r=e(24);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){"use strict";var r=e(34),o=e(21).getWeak,i=e(8),u=e(1),c=e(35),s=e(14),a=e(54),f=e(3),l=e(15),p=a(5),h=a(6),d=0,v=function(t){return t._l||(t._l=new y)},y=function(){this.a=[]},m=function(t,n){return p(t.a,function(t){return t[0]===n})};y.prototype={get:function(t){var n=m(this,t);if(n)return n[1]},has:function(t){return!!m(this,t)},set:function(t,n){var e=m(this,t);e?e[1]=n:this.a.push([t,n])},delete:function(t){var n=h(this.a,function(n){return n[0]===t});return~n&&this.a.splice(n,1),!!~n}},t.exports={getConstructor:function(t,n,e,i){var a=t(function(t,r){c(t,a,n,"_i"),t._t=n,t._i=d++,t._l=void 0,void 0!=r&&s(r,e,t[i],t)});return r(a.prototype,{delete:function(t){if(!u(t))return!1;var e=o(t);return!0===e?v(l(this,n)).delete(t):e&&f(e,this._i)&&delete e[this._i]},has:function(t){if(!u(t))return!1;var e=o(t);return!0===e?v(l(this,n)).has(t):e&&f(e,this._i)}}),a},def:function(t,n,e){var r=o(i(n),!0);return!0===r?v(t).set(n,e):r[t._i]=e,t},ufstore:v}},function(t,n,e){e(37)("WeakMap")},function(t,n,e){e(38)("WeakMap")},function(t,n,e){e(25),e(94),t.exports=e(4).Array.from},function(t,n,e){"use strict";var r=e(10),o=e(5),i=e(20),u=e(48),c=e(49),s=e(19),a=e(95),f=e(50);o(o.S+o.F*!e(51)(function(t){Array.from(t)}),"Array",{from:function(t){var n,e,o,l,p=i(t),h="function"==typeof this?this:Array,d=arguments.length,v=d>1?arguments[1]:void 0,y=void 0!==v,m=0,g=f(p);if(y&&(v=r(v,d>2?arguments[2]:void 0,2)),void 0==g||h==Array&&c(g))for(n=s(p.length),e=new h(n);n>m;m++)a(e,m,y?v(p[m],m):p[m]);else for(l=g.call(p),e=new h;!(o=l.next()).done;m++)a(e,m,y?u(l,v,[o.value,m],!0):o.value);return e.length=m,e}})},function(t,n,e){"use strict";var r=e(7),o=e(17);t.exports=function(t,n,e){n in t?r.f(t,n,o(0,e)):t[n]=e}},function(t,n,e){e(97),t.exports=e(4).Object.assign},function(t,n,e){var r=e(5);r(r.S+r.F,"Object",{assign:e(55)})},function(t,n,e){"use strict";(function(t){var e="object"==typeof t&&t&&t.Object===Object&&t;n.a=e}).call(n,e(99))},function(t,n){var e;e=function(){return this}();try{e=e||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(e=window)}t.exports=e}]).default});
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
