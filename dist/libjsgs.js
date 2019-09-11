window["libjsgs"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyboardController = function () {
  function KeyboardController() {
    var _this = this;

    _classCallCheck(this, KeyboardController);

    this.keys = [37, 39, 38, 40, 90, 88];

    this.status = [false, false, false, false, false, false, // player 1
    false, false, false, false, false, false];

    this.btnpWait = {};

    document.addEventListener('keydown', function (event) {
      var index = _this.keys.indexOf(event.keyCode);
      if (index < 0) return false;

      _this.status[index] = true;
    });

    document.addEventListener('keyup', function (event) {
      var index = _this.keys.indexOf(event.keyCode);
      if (index < 0) return false;

      _this.status[index] = false;
    });

    this.api = {
      btn: this.btn.bind(this),
      btnp: this.btnp.bind(this)
    };
  }

  _createClass(KeyboardController, [{
    key: 'btn',
    value: function btn(which) {
      var player = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      return this.status[which];
    }
  }, {
    key: 'btnp',
    value: function btnp(which) {
      var _this2 = this;

      var player = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var pressed = this.btn(which, player);

      if (!pressed) {
        this.btnpWait['' + which + player] = false;
        return pressed;
      }

      if (this.btnpWait['' + which + player]) return false;

      this.btnpWait['' + which + player] = true;

      setTimeout(function () {
        _this2.btnpWait['' + which + player] = false;
      }, 120);

      return pressed;
    }
  }]);

  return KeyboardController;
}();

exports.default = KeyboardController;

/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Screen = function () {
  function Screen(options) {
    _classCallCheck(this, Screen);

    this.type = 'defaultScreen';
    this.px = options.size / 128;
    this.size = options.size;
    this.palette = options.palette || this.constructor.defaultPalette;
    this.canvas = this.createCanvas(options);
    this.ctx = this.canvas.getContext('2d');
  }

  _createClass(Screen, [{
    key: 'update',
    value: function update(ram) {
      for (var addr = 0x6000; addr <= 0x7FFF; addr++) {
        var data = ram.arr[addr];
        var dataBinary = ("000000000" + data.toString(2)).substr(-8);
        var _ref = [this.palette[parseInt(dataBinary.substring(0, 4), 2)], this.palette[parseInt(dataBinary.substring(4, 8), 2)]],
            color1 = _ref[0],
            color2 = _ref[1];


        var _i = addr - 0x6000;
        var x = _i * 2 % 128;
        var y = Math.floor(_i / 64);

        this.ctx.fillStyle = color1;
        this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px);

        this.ctx.fillStyle = color2;
        this.ctx.fillRect(x * this.px + this.px, y * this.px, this.px, this.px);
      };
    }
  }, {
    key: 'fillArray',
    value: function fillArray(ram, dest) {
      for (var addr = 0x6000; addr <= 0x7FFF; addr++) {
        var data = ram.arr[addr];
        var _ref2 = [this.constructor.defaultPaletteInt[data >> 4], this.constructor.defaultPaletteInt[data & 15]],
            color1 = _ref2[0],
            color2 = _ref2[1];


        var _i2 = addr - 0x6000;
        var x = _i2 * 2 % 128;
        var y = 128 - Math.floor(_i2 / 64);
        var w = x + 1;

        dest[y * 128 + x] = color1;
        dest[y * 128 + w] = color2;
      };
    }
  }, {
    key: 'createCanvas',
    value: function createCanvas(_ref3) {
      var element = _ref3.element,
          size = _ref3.size;

      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;

      canvas.style.dispay = 'block';
      canvas.style.imageRendering = 'pixelated';

      return canvas;
    }
  }, {
    key: 'mountCanvas',
    value: function mountCanvas(element) {
      element.appendChild(this.canvas);
    }
  }]);

  return Screen;
}();

exports.default = Screen;


Screen.utils = {};

Screen.utils.hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

Screen.utils.componentToHex = function (c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

Screen.utils.rgbToHex = function (_ref4) {
  var r = _ref4.r,
      g = _ref4.g,
      b = _ref4.b;

  return "#" + Screen.utils.componentToHex(r) + Screen.utils.componentToHex(g) + Screen.utils.componentToHex(b);
};

Screen.defaultPalette = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA', '#ffccaa', '#291814', '#111d35', '#422136', '#125359', '#742f29', '#49333b', '#a28879', '#f3ef7d', '#be1250', '#ff6c24', '#a8e72e', '#00b543', '#065ab5', '#754665', '#ff6e59', '#ff9d81'];

Screen.utils.rgbToBgr = function (v) {
  var b = v & 255;
  var g = v >> 8 & 255;
  var r = v >> 16 & 255;

  return r | g << 8 | b << 16;
};

Screen.defaultPaletteInt = [];
for (var i in Screen.defaultPalette) {
  Screen.defaultPaletteInt.push(Screen.utils.rgbToBgr(Screen.defaultPalette[i]));
}

Screen.grayscalePalette = Screen.defaultPalette.map(function (color) {
  var _Screen$utils$hexToRg = Screen.utils.hexToRgb(color),
      r = _Screen$utils$hexToRg.r,
      g = _Screen$utils$hexToRg.g,
      b = _Screen$utils$hexToRg.b;

  var w = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
  return Screen.utils.rgbToHex({ r: w, g: w, b: w });
});

Screen.greenPalette = Screen.defaultPalette.map(function (color) {
  var _Screen$utils$hexToRg2 = Screen.utils.hexToRgb(color),
      r = _Screen$utils$hexToRg2.r,
      g = _Screen$utils$hexToRg2.g,
      b = _Screen$utils$hexToRg2.b;

  var rbc = Math.floor((0.299 * r + 0.587 * g + 0.114 * b) * (1 / 2));
  var gc = Math.floor(rbc * 2);
  return Screen.utils.rgbToHex({ r: rbc, g: gc, b: rbc });
});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(23);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(4);
var util = __webpack_require__(0);
var ArraySet = __webpack_require__(3).ArraySet;
var MappingList = __webpack_require__(25).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint vars:false, bitwise:true*/
/*jshint indent:4*/
/*global exports:true*/
(function clone(exports) {
    'use strict';

    var Syntax,
        isArray,
        VisitorOption,
        VisitorKeys,
        objectCreate,
        objectKeys,
        BREAK,
        SKIP,
        REMOVE;

    function ignoreJSHintError() { }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    ignoreJSHintError(shallowCopy);

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    function lowerBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            } else {
                len = diff;
            }
        }
        return i;
    }
    ignoreJSHintError(lowerBound);

    objectCreate = Object.create || (function () {
        function F() { }

        return function (o) {
            F.prototype = o;
            return new F();
        };
    })();

    objectKeys = Object.keys || function (o) {
        var keys = [], key;
        for (key in o) {
            keys.push(key);
        }
        return keys;
    };

    function extend(to, from) {
        var keys = objectKeys(from), key, i, len;
        for (i = 0, len = keys.length; i < len; i += 1) {
            key = keys[i];
            to[key] = from[key];
        }
        return to;
    }

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        ForOfStatement: 'ForOfStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MetaProperty: 'MetaProperty',
        MethodDefinition: 'MethodDefinition',
        ModuleSpecifier: 'ModuleSpecifier',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        Super: 'Super',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        AssignmentPattern: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'body'],
        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'superClass', 'body'],
        ClassExpression: ['id', 'superClass', 'body'],
        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExportAllDeclaration: ['source'],
        ExportDefaultDeclaration: ['declaration'],
        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
        ExportSpecifier: ['exported', 'local'],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        ForOfStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'body'],
        FunctionExpression: ['id', 'params', 'body'],
        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        ImportDeclaration: ['specifiers', 'source'],
        ImportDefaultSpecifier: ['local'],
        ImportNamespaceSpecifier: ['local'],
        ImportSpecifier: ['imported', 'local'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MetaProperty: ['meta', 'property'],
        MethodDefinition: ['key', 'value'],
        ModuleSpecifier: [],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: ['key', 'value'],
        RestElement: [ 'argument' ],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SpreadElement: ['argument'],
        Super: [],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        TaggedTemplateExpression: ['tag', 'quasi'],
        TemplateElement: [],
        TemplateLiteral: ['quasis', 'expressions'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handler', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id
    BREAK = {};
    SKIP = {};
    REMOVE = {};

    VisitorOption = {
        Break: BREAK,
        Skip: SKIP,
        Remove: REMOVE
    };

    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }

    Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
    };

    Reference.prototype.remove = function remove() {
        if (isArray(this.parent)) {
            this.parent.splice(this.key, 1);
            return true;
        } else {
            this.replace(null);
            return false;
        }
    };

    function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }

    function Controller() { }

    // API:
    // return property path array from root to current node
    Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;

        function addToPath(result, path) {
            if (isArray(path)) {
                for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                }
            } else {
                result.push(path);
            }
        }

        // root node
        if (!this.__current.path) {
            return null;
        }

        // first node is sentinel, second node is root element
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
            element = this.__leavelist[i];
            addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
    };

    // API:
    // return type of current node
    Controller.prototype.type = function () {
        var node = this.current();
        return node.type || this.__current.wrap;
    };

    // API:
    // return array of parent elements
    Controller.prototype.parents = function parents() {
        var i, iz, result;

        // first node is sentinel
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    };

    // API:
    // return current node
    Controller.prototype.current = function current() {
        return this.__current.node;
    };

    Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;

        result = undefined;

        previous  = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;

        return result;
    };

    // API:
    // notify control skip / break
    Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
    };

    // API:
    // skip child nodes of current node
    Controller.prototype.skip = function () {
        this.notify(SKIP);
    };

    // API:
    // break traversals
    Controller.prototype['break'] = function () {
        this.notify(BREAK);
    };

    // API:
    // remove node
    Controller.prototype.remove = function () {
        this.notify(REMOVE);
    };

    Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
        this.__fallback = null;
        if (visitor.fallback === 'iteration') {
            this.__fallback = objectKeys;
        } else if (typeof visitor.fallback === 'function') {
            this.__fallback = visitor.fallback;
        }

        this.__keys = VisitorKeys;
        if (visitor.keys) {
            this.__keys = extend(objectCreate(this.__keys), visitor.keys);
        }
    };

    function isNode(node) {
        if (node == null) {
            return false;
        }
        return typeof node === 'object' && typeof node.type === 'string';
    }

    function isProperty(nodeType, key) {
        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
    }

    Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist,
            leavelist,
            element,
            node,
            nodeType,
            ret,
            key,
            current,
            current2,
            candidates,
            candidate,
            sentinel;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                ret = this.__execute(visitor.leave, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {

                ret = this.__execute(visitor.enter, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                node = element.node;
                nodeType = node.type || element.wrap;
                candidates = this.__keys[nodeType];
                if (!candidates) {
                    if (this.__fallback) {
                        candidates = this.__fallback(node);
                    } else {
                        throw new Error('Unknown node type ' + nodeType + '.');
                    }
                }

                current = candidates.length;
                while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (isArray(candidate)) {
                        current2 = candidate.length;
                        while ((current2 -= 1) >= 0) {
                            if (!candidate[current2]) {
                                continue;
                            }
                            if (isProperty(nodeType, candidates[current])) {
                                element = new Element(candidate[current2], [key, current2], 'Property', null);
                            } else if (isNode(candidate[current2])) {
                                element = new Element(candidate[current2], [key, current2], null, null);
                            } else {
                                continue;
                            }
                            worklist.push(element);
                        }
                    } else if (isNode(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                    }
                }
            }
        }
    };

    Controller.prototype.replace = function replace(root, visitor) {
        var worklist,
            leavelist,
            node,
            nodeType,
            target,
            element,
            current,
            current2,
            candidates,
            candidate,
            sentinel,
            outer,
            key;

        function removeElem(element) {
            var i,
                key,
                nextElem,
                parent;

            if (element.ref.remove()) {
                // When the reference is an element of an array.
                key = element.ref.key;
                parent = element.ref.parent;

                // If removed from array, then decrease following items' keys.
                i = worklist.length;
                while (i--) {
                    nextElem = worklist[i];
                    if (nextElem.ref && nextElem.ref.parent === parent) {
                        if  (nextElem.ref.key < key) {
                            break;
                        }
                        --nextElem.ref.key;
                    }
                }
            }
        }

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        outer = {
            root: root
        };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                target = this.__execute(visitor.leave, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                    // replace
                    element.ref.replace(target);
                }

                if (this.__state === REMOVE || target === REMOVE) {
                    removeElem(element);
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }
                continue;
            }

            target = this.__execute(visitor.enter, element);

            // node may be replaced with null,
            // so distinguish between undefined and null in this place
            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                // replace
                element.ref.replace(target);
                element.node = target;
            }

            if (this.__state === REMOVE || target === REMOVE) {
                removeElem(element);
                element.node = null;
            }

            if (this.__state === BREAK || target === BREAK) {
                return outer.root;
            }

            // node may be null
            node = element.node;
            if (!node) {
                continue;
            }

            worklist.push(sentinel);
            leavelist.push(element);

            if (this.__state === SKIP || target === SKIP) {
                continue;
            }

            nodeType = node.type || element.wrap;
            candidates = this.__keys[nodeType];
            if (!candidates) {
                if (this.__fallback) {
                    candidates = this.__fallback(node);
                } else {
                    throw new Error('Unknown node type ' + nodeType + '.');
                }
            }

            current = candidates.length;
            while ((current -= 1) >= 0) {
                key = candidates[current];
                candidate = node[key];
                if (!candidate) {
                    continue;
                }

                if (isArray(candidate)) {
                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                            continue;
                        }
                        if (isProperty(nodeType, candidates[current])) {
                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                        } else if (isNode(candidate[current2])) {
                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                        } else {
                            continue;
                        }
                        worklist.push(element);
                    }
                } else if (isNode(candidate)) {
                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                }
            }
        }

        return outer.root;
    };

    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        var target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }

        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        var comments = [], comment, len, i, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.version = __webpack_require__(35).version;
    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
    exports.cloneEnvironment = function () { return clone({}); };

    return exports;
}(exports));
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 7 */
/***/ function(module, exports) {

/*
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

    // See `tools/generate-identifier-regex.js`.
    ES5Regex = {
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    };

    ES6Regex = {
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;  // 0..9
    }

    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
            0x61 <= ch && ch <= 0x66 ||     // a..f
            0x41 <= ch && ch <= 0x46;       // A..F
    }

    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;  // 0..7
    }

    // 7.2 White Space

    NON_ASCII_WHITESPACES = [
        0x1680, 0x180E,
        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
        0x202F, 0x205F,
        0x3000,
        0xFEFF
    ];

    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }

    // 7.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
        return cu1 + cu2;
    }

    IDENTIFIER_START = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_START[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    IDENTIFIER_PART = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_PART[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch >= 0x30 && ch <= 0x39 ||  // 0..9
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStartES5: isIdentifierStartES5,
        isIdentifierPartES5: isIdentifierPartES5,
        isIdentifierStartES6: isIdentifierStartES6,
        isIdentifierPartES6: isIdentifierPartES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 8 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Keyboard = __webpack_require__(1);

var _Keyboard2 = _interopRequireDefault(_Keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OnSreenController = function (_KeyboardController) {
  _inherits(OnSreenController, _KeyboardController);

  function OnSreenController(machine) {
    _classCallCheck(this, OnSreenController);

    var _this = _possibleConstructorReturn(this, (OnSreenController.__proto__ || Object.getPrototypeOf(OnSreenController)).call(this, machine));

    _this.buildButtons();
    return _this;
  }

  _createClass(OnSreenController, [{
    key: 'buildButtons',
    value: function buildButtons() {
      var _this2 = this;

      var wrapper = document.getElementById('mobileButtons');

      this.keys.forEach(function (key, i) {
        var button = document.createElement('button');
        button.innerHTML = i;
        button.classList.add('b_' + key);

        button.addEventListener('touchstart', function () {
          var index = _this2.keys.indexOf(key);
          if (index < 0) return false;

          _this2.status[index] = true;
        });

        button.addEventListener('touchend', function () {
          var index = _this2.keys.indexOf(key);
          if (index < 0) return false;

          _this2.status[index] = false;
        });

        wrapper.appendChild(button);
      });
    }
  }]);

  return OnSreenController;
}(_Keyboard2.default);

exports.default = OnSreenController;

/***/ },
/* 10 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSGS = function () {
    function JSGS(options) {
        var _this = this;

        _classCallCheck(this, JSGS);

        this.devices = options.devices;
        this.os = options.os;
        this.autoUpdate = options.autoUpdate;

        this.os.sendEvent('boot', this).sendEvent('cartridgeMount', this);

        if (this.autoUpdate) {
            this.updateLoop(function () {
                _this.os.update();
                _this.devices.screens.forEach(function (screen) {
                    return screen.update(_this.devices.ram);
                });
            });
        }

        this.then = Date.now();
    }

    _createClass(JSGS, [{
        key: 'updateLoop',
        value: function updateLoop(fn, fps) {
            fn();

            var then = Date.now();
            fps = fps || 30;
            var interval = 1000 / fps;

            return function loop(time) {
                requestAnimationFrame(loop);

                var now = Date.now();
                var delta = now - then;

                if (delta > interval) {
                    then = now - delta % interval;
                    fn();
                }
            }(0);
        }
    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            var fps = 30;
            var interval = 1000 / fps;

            var now = Date.now();
            var delta = now - this.then;

            if (delta > interval) {
                this.os.update();

                if (this.autoUpdate) {
                    this.devices.screens.forEach(function (screen) {
                        return screen.update(_this2.devices.ram);
                    });
                }

                this.then = now - delta % interval;

                return true;
            }

            return false;
        }
    }]);

    return JSGS;
}();

exports.default = JSGS;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(18);

var _graphics2 = _interopRequireDefault(_graphics);

var _sound = __webpack_require__(21);

var _sound2 = _interopRequireDefault(_sound);

var _math = __webpack_require__(19);

var _math2 = _interopRequireDefault(_math);

var _core = __webpack_require__(16);

var _core2 = _interopRequireDefault(_core);

var _readCartridge = __webpack_require__(20);

var _readCartridge2 = _interopRequireDefault(_readCartridge);

var _lua2js = __webpack_require__(36);

var _lua2js2 = _interopRequireDefault(_lua2js);

var _escodegen = __webpack_require__(22);

var _escodegen2 = _interopRequireDefault(_escodegen);

var _estraverse = __webpack_require__(6);

var _estraverse2 = _interopRequireDefault(_estraverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OS = function () {
  function OS(machine) {
    _classCallCheck(this, OS);

    this.$ = {};
    this.bootTime = 0;
  }

  _createClass(OS, [{
    key: 'sendEvent',
    value: function sendEvent(type, machine, payload) {
      var _this = this;

      switch (type) {
        case 'boot':
          this.boot(machine);
          break;

        case 'cartridgeMount':
          this.boot(machine).then(function () {
            return _this.cartridgeMount(machine);
          });
          break;

        case 'cartridgeEject':
          this.boot(machine).then(function () {
            return _this.cartridgeEject(machine);
          });
          break;
      }

      return this;
    }
  }, {
    key: 'boot',
    value: function boot(machine) {
      var _this2 = this;

      if (this.bootProgress) return this.bootProgress;
      this.bootProgress = new Promise(function (resolve) {
        _this2.$ = Object.assign(_this2.$, _lua2js2.default.stdlib, machine.devices.ram.api, _core2.default, _math2.default, (0, _graphics2.default)(machine.devices.ram), (0, _sound2.default)(machine.devices.ram), machine.devices.controller.api, {
          time: _this2.getUptime.bind(_this2),
          t: _this2.getUptime.bind(_this2)
        });

        // flush defaults to ram
        _this2.$.clip();
        _this2.$.color(6);

        // return resolve(this); // DEVELOPMENT

        var i = 1;

        var loadingAnim = setInterval(function () {
          _this2.$.cls();
          if (i >= 98) {
            _this2.bootTime = Date.now();
            clearInterval(loadingAnim);
            resolve(_this2);
          } else {
            _this2.$.print("javascript gaming system", 4, 4, 8);
            if (i >= 20) _this2.$.print("checking devices", 4, 12, 7);

            if (i >= 40) {
              _this2.$.print('booting' + '.'.repeat(Math.floor((i - 40) / 15)), 4, 20, 7);
            }

            i += parseInt(Math.random() * 2);
          }
        }, 1);
      });

      return this.bootProgress;
    }
  }, {
    key: 'cartridgeMount',
    value: function cartridgeMount(machine) {
      var _this3 = this;

      var _machine$devices = machine.devices,
          code = _machine$devices.code,
          cartridge = _machine$devices.cartridge;


      if (code != null) {
        this.$.print("running code", 4, 4, 7);
        var obj = { code: code };
        setTimeout(function () {
          return _this3.runCartridge(obj);
        }, 500);
      } else {

        this.$.print("reading cartridge", 4, 4, 7);

        this.loadCartridge(cartridge, machine).then(function (cartridgeData) {
          return setTimeout(function () {
            return _this3.runCartridge(cartridgeData);
          }, 500);
        });
      }
    }
  }, {
    key: 'cartridgeEject',
    value: function cartridgeEject(machine) {
      console.log('ejected', machine);
    }
  }, {
    key: 'loadCartridge',
    value: function loadCartridge(url, machine) {
      var png = new PngToy();

      return png.fetch(url).then(function () {
        return png.decode().then(_readCartridge2.default);
      }).then(function (cartridgeData) {
        var gfxi = 0;
        var gfxData = cartridgeData.gfx + cartridgeData.map + cartridgeData.gff;
        for (var x = 0x0000; x <= 0x30ff; x++) {
          machine.devices.ram.poke(x, parseInt('' + gfxData[gfxi] + gfxData[gfxi + 1], 16));
          gfxi = gfxi + 2;
        }

        var sfxi = 0;
        for (var _x = 0x3200; _x <= 0x42ff; _x++) {
          machine.devices.ram.poke(_x, parseInt('' + cartridgeData.sfx[sfxi] + cartridgeData.sfx[sfxi + 1], 16));
          sfxi = sfxi + 2;
        }

        return cartridgeData;
      });
    }
  }, {
    key: 'runCartridge',
    value: function runCartridge(____cartridgeData____) {
      this.$.cls();
      var ____BLACKLIST____ = Object.keys(window).join().replace('console', '_');

      var ____self____ = this;
      var ____api____ = Object.keys(this.$).map(function (key) {
        if (typeof ____self____.$[key] === 'function') {
          return '\n          function ' + key + '() {\n            return ____self____.$[\'' + key + '\'].apply(null, arguments);\n          }\n        ';
        }
        return '';
      });

      ____api____.push('var __lua = ____self____.$.__lua');

      /*h*/eval('\n      (function(' + ____BLACKLIST____ + ') {\n        ' + ____api____.join(';') + '\n\n        function _init() {}\n        function _update() {}\n        function _draw() {}\n\n        function add(tbl, item) {\n          console.log(tbl, item);\n          tbl[Object.keys(tbl).length] = item;\n        }\n\n        function all() {\n          return [() => {}, () => {}, () => {}];\n        }\n\n        function count(tbl) {\n          return Object.keys(tbl).length;\n        }\n\n        function menuitem() {}\n\n        ' + this.transpileLua(____cartridgeData____.code).replace('~=', '!=') + '\n\n        _init()\n        _update();\n        _draw();\n\n        ____self____._draw = _draw;\n        ____self____._update = _update;\n      })();\n     ');
    }
  }, {
    key: '_update',
    value: function _update() {}
  }, {
    key: '_draw',
    value: function _draw() {}
  }, {
    key: 'update',
    value: function update() {
      this._update();
      this._draw();
    }
  }, {
    key: 'transpileLua',
    value: function transpileLua(code) {
      var ast = _lua2js2.default.parse(code, {
        decorateLuaObjects: false,
        encloseWithFunctions: false,
        forceVar: false,
        luaCalls: false,
        luaOperators: false,
        noSharedObjects: false,
        allowRegularFunctions: true
      });

      var result = _escodegen2.default.generate(ast);
      var globalVars = [];

      _estraverse2.default.traverse(ast, {
        enter: function enter(node, parent) {
          if (node.type === "AssignmentExpression" && node.left.name && !globalVars.includes(node.left.name)) {
            globalVars.push(node.left.name);
          }
        }
      });

      return '\n      var ' + globalVars.join() + ';\n      ' + result.substring(1, result.length - 1) + '\n    ';
    }
  }, {
    key: 'getUptime',
    value: function getUptime() {
      return (Date.now() - this.bootTime) / 1000;
    }
  }]);

  return OS;
}();

exports.default = OS;

/***/ },
/* 12 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ram = function () {
  function Ram(size) {
    _classCallCheck(this, Ram);

    this.size = size;
    this.arr = new Uint8Array(size);

    this.api = {
      peek: this.peek.bind(this),
      poke: this.poke.bind(this),
      memset: this.memset.bind(this),
      memcpy: this.memcpy.bind(this),
      memread: this.memread.bind(this),
      memwrite: this.memwrite.bind(this),
      reload: this.reload.bind(this),
      cstore: this.cstore.bind(this)
    };
  }

  _createClass(Ram, [{
    key: "ifInRange",
    value: function ifInRange(addr, fn) {
      if (addr >= 0x00 && addr < this.size) {
        return fn();
      }

      throw new Error("BAD MEMORY ACCESS! 0x" + addr.toString(16));
    }
  }, {
    key: "peek",
    value: function peek(addr) {
      var _this = this;

      return this.ifInRange(addr, function () {
        return _this.arr[addr];
      });
    }
  }, {
    key: "poke",
    value: function poke(addr, val) {
      var _this2 = this;

      return this.ifInRange(addr, function () {
        return _this2.arr[addr] = val;
      });
    }
  }, {
    key: "memset",
    value: function memset(dest_addr, value, length) {
      this.arr.fill(value, dest_addr, dest_addr + length);
    }
  }, {
    key: "memread",
    value: function memread(dest_addr, length) {
      return this.arr.slice(dest_addr, dest_addr + length);
    }
  }, {
    key: "memwrite",
    value: function memwrite(dest_addr, data) {
      var length = data.length - 1;
      for (var i = 0; i <= length; i++) {
        this.arr[dest_addr + i] = data[i];
      }
    }
  }, {
    key: "memcpy",
    value: function memcpy(dest_addr, source_addr, length) {
      length = length - 1;
      for (var i = 0; i <= length; i++) {
        this.arr[dest_addr + i] = this.arr[source_addr + i];
      }
    }
  }, {
    key: "reload",
    value: function reload() {}
  }, {
    key: "cstore",
    value: function cstore() {}
  }]);

  return Ram;
}();

exports.default = Ram;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ = __webpack_require__(2);

var _2 = _interopRequireDefault(_);

var _crtlines = __webpack_require__(33);

var _crtlines2 = _interopRequireDefault(_crtlines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CRTScreen = function (_Screen) {
  _inherits(CRTScreen, _Screen);

  function CRTScreen() {
    _classCallCheck(this, CRTScreen);

    return _possibleConstructorReturn(this, (CRTScreen.__proto__ || Object.getPrototypeOf(CRTScreen)).apply(this, arguments));
  }

  _createClass(CRTScreen, [{
    key: 'createCanvas',
    value: function createCanvas(options) {
      var canvas = _get(CRTScreen.prototype.__proto__ || Object.getPrototypeOf(CRTScreen.prototype), 'createCanvas', this).call(this, options);
      var glCanvas = this.glCanvas = fx.canvas();

      this.lines = new Image();
      this.lines.src = _crtlines2.default;
      this.srcctx = canvas.getContext('2d');

      glCanvas.width = glCanvas.height = 512;
      glCanvas.style.dispay = 'block';
      glCanvas.style.imageRendering = 'pixelated';

      return canvas;
    }
  }, {
    key: 'mountCanvas',
    value: function mountCanvas(element) {
      element.appendChild(this.glCanvas);
    }
  }, {
    key: 'update',
    value: function update(ram) {
      _get(CRTScreen.prototype.__proto__ || Object.getPrototypeOf(CRTScreen.prototype), 'update', this).call(this, ram);

      var halfSize = this.size / 2;

      this.srcctx.drawImage(this.lines, 0, 0, this.size, this.size);

      this.glCanvas.draw(this.glCanvas.texture(this.canvas)).bulgePinch(halfSize, halfSize, this.size * 0.75, 0.12).vignette(0.15, 0.5).update();
    }
  }]);

  return CRTScreen;
}(_2.default);

exports.default = CRTScreen;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(8)(__webpack_require__(39))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(8)(__webpack_require__(40))

/***/ },
/* 16 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ },
/* 17 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  a: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  b: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  c: [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
  d: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  e: [1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  f: [1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0],
  g: [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1],
  h: [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  i: [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
  j: [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  k: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  l: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
  m: [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  n: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  o: [0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
  p: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
  q: [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
  r: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  s: [0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  t: [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  u: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1],
  v: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  w: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  x: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  y: [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  z: [1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
  "0": [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  "1": [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
  "2": [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  "3": [1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
  "4": [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  "5": [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  "6": [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  "7": [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  "8": [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  "!": [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  '"': [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "#": [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  "%": [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  "'": [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "(": [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  ")": [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  "*": [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  "+": [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
  ",": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
  "-": [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  "/": [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  ":": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  "<": [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  ">": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
  "=": [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  "?": [1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0],
  "[": [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
  "]": [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1],
  "^": [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "~": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGraphicsFunctions;

var _font = __webpack_require__(17);

var _font2 = _interopRequireDefault(_font);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGraphicsFunctions(ram) {
  function memoize(fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments),
          hash = "",
          i = args.length;
      var currentArg = null;
      while (i--) {
        currentArg = args[i];
        hash += currentArg === Object(currentArg) ? JSON.stringify(currentArg) : currentArg;
        fn.memoize || (fn.memoize = {});
      }
      return hash in fn.memoize ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args);
    };
  }

  function _color8toHexStr(color8) {
    return function (str) {
      return '00'.substring(0, 2 - str.length) + str;
    }(color8.toString(16));
  }

  var flags = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80];
  var initialColors = [0x00, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xA0, 0xB0, 0xC0, 0xD0, 0xE0, 0xF0];

  var color8toHexStr = memoize(_color8toHexStr);

  function pget(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || x > 127 || y < 0 || y > 127) {
      return 0;
    }

    var addr = 0x6000 + 64 * y + Math.floor(x / 2);
    var side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    } else if (side === 'right') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    }
  }

  function pset(x, y, colorIndex, color8) {
    var xSign = ram.arr[0x5f28] === 1 ? -1 : 1;
    var ySign = ram.arr[0x5f2a] === 1 ? -1 : 1;
    var camX = ram.arr[0x5f29] * xSign;
    var camY = ram.arr[0x5f2b] * ySign;
    var cx1 = ram.arr[0x5f20];
    var cy1 = ram.arr[0x5f21];
    var cx2 = ram.arr[0x5f22];
    var cy2 = ram.arr[0x5f23];

    x = Math.floor(x + camX);
    y = Math.floor(y + camY);

    if (x < cx1 || x > cx2 || y < cy1 || y > cy2) {
      return false;
    }

    if (colorIndex === undefined) {
      colorIndex = ram.arr[0x5f25]; // default color: color()
    }

    if (!color8) {
      color8 = ram.arr[0x5000 + colorIndex % 16];
    } else {
      color8 = ram.arr[0x5000 + initialColors.indexOf(color8)];
    }

    var addr = 0x6000 + 64 * y + Math.floor(x / 2);
    var before = ram.arr[addr];
    var left_side = x % 2 === 0 ? true : false;

    if (left_side) {
      ram.arr[addr] = color8 & 240 | before & 15;
    } else {
      ram.arr[addr] = before & 240 | (color8 & 240) >> 4;
    }
  }

  function cls() {
    ram.memset(0x6000, 0x00, 0x8000 - 0x6000);
  }

  function line(x0, y0, x1, y1, colorIndex) {
    x0 = Math.floor(x0);
    y0 = Math.floor(y0);
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    } else {
      colorIndex = Math.floor(colorIndex);
    }

    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1;
    var sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;

    while (true) {
      pset(x0, y0, colorIndex);

      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;x0 += sx;
      }
      if (e2 < dx) {
        err += dx;y0 += sy;
      }
    }
  }

  function rect(x1, y1, x2, y2, colorIndex) {
    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    line(x1, y1, x2, y1, colorIndex);
    line(x1, y1, x1, y2, colorIndex);
    line(x2, y1, x2, y2, colorIndex);
    line(x1, y2, x2, y2, colorIndex);
  }

  function rectfill(x1, y1, x2, y2, colorIndex) {
    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    for (var i = y1; i < y2; i++) {
      for (var j = x1; j < x2; j++) {
        pset(j, i, colorIndex);
      }
    }
  }

  function circ(x0, y0, r, colorIndex) {
    x0 = Math.floor(x0);
    y0 = Math.floor(y0);
    r = Math.floor(r);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    var x = r - 1;
    var y = 0;
    var rError = 1 - x;

    while (x >= y) {
      pset(x + x0, y + y0, colorIndex);
      pset(y + x0, x + y0, colorIndex);
      pset(-x + x0, y + y0, colorIndex);
      pset(-y + x0, x + y0, colorIndex);
      pset(-x + x0, -y + y0, colorIndex);
      pset(-y + x0, -x + y0, colorIndex);
      pset(x + x0, -y + y0, colorIndex);
      pset(y + x0, -x + y0, colorIndex);
      y++;

      if (rError < 0) {
        rError += 2 * y + 1;
      } else {
        x--;
        rError += 2 * (y - x + 1);
      }
    }
  }

  function circfill(x0, y0, radius, colorIndex) {
    var x = radius - 1;
    var y = 0;
    var radiusError = 1 - x;

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    while (x >= y) {
      line(-x + x0, y + y0, x + x0, y + y0, colorIndex);
      line(-y + x0, x + y0, y + x0, x + y0, colorIndex);
      line(-x + x0, -y + y0, x + x0, -y + y0, colorIndex);
      line(-y + x0, -x + y0, y + x0, -x + y0, colorIndex);
      y++;

      if (radiusError < 0) {
        radiusError += 2 * y + 1;
      } else {
        x--;
        radiusError += 2 * (y - x + 1);
      }
    }
  }

  function mset(celX, celY, sNum) {
    var mapStartAddr = 0x2000; // Map (rows 0-31)

    if (celY >= 32) {
      mapStartAddr = 0x1000;
    }

    var tile = celY * 128 + celX;
    ram.arr[mapStartAddr + tile] = sNum;
  }

  function mget(celX, celY) {
    celX = Math.floor(celX);
    celY = Math.floor(celY);

    var mapStartAddr = 0x2000; // Map (rows 0-31)

    if (celY >= 32) {
      mapStartAddr = 0x1000;
    }

    var tile = celY * 128 + celX;
    return ram.arr[mapStartAddr + tile];
  }

  function map(celX, celY, sx, sy, celW, celH, layer) {
    for (var x = celX; x < celX + celW; x++) {
      for (var y = celY; y < celY + celH; y++) {
        var sprNum = mget(x, y);

        if (layer !== undefined && !fget(sprNum, layer)) {
          continue;
        }

        if (sprNum !== 0) {
          spr(sprNum, sx + (x - celX) * 8, sy + (y - celY) * 8);
        }
      }
    }
  }

  function spr(n, x, y, w, h, flip_x, flip_y) {
    x = Math.floor(x);
    y = Math.floor(y);

    var sx = n % 16 * 4;
    var sy = Math.floor(n / 16) * 8;
    var startAddr = 0x0000 + sx + sy * 64;

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j = j + 2) {
        var val = ram.arr[startAddr + 64 * i + j / 2];

        var x1 = flip_x ? x - j + 7 : x + j;
        var x2 = flip_x ? x - j + 6 : x + j + 1;

        var y1 = flip_y ? y - i + 7 : y + i;
        var y2 = y1;

        var val_a = val >> 4 & 15;
        var val_b = val & 15;

        if ((ram.arr[0x5000 + val_a] & 15) == 0) {
          pset(x1, y1, null, val_a << 4);
        }

        if ((ram.arr[0x5000 + val_b] & 15) == 0) {
          pset(x2, y2, null, val_b << 4);
        }
      }
    }
  }

  function sget(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    var addr = 0x0000 + 64 * y + Math.floor(x / 2);
    var side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    } else if (side === 'right') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    }
  }

  function sset(x, y, colorIndex) {
    x = Math.floor(x);
    y = Math.floor(y);

    var drawPalette = ram.memread(0x5000, 16);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    var colorStr = void 0;

    var color8 = drawPalette[colorIndex % 16];
    var addr = 0x0000 + 64 * y + Math.floor(x / 2);
    var beforePoke = color8toHexStr(ram.peek(addr));
    var side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      colorStr = color8toHexStr(color8)[0] + beforePoke[1];
    } else if (side === 'right') {
      colorStr = beforePoke[0] + color8toHexStr(color8)[0];
    }

    ram.poke(addr, parseInt(colorStr, 16));
  }

  function print(text) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var colorIndex = arguments[3];

    x = Math.floor(x);
    y = Math.floor(y);
    text = String(text);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    text = text.toLowerCase();
    for (var i = 0; i < text.length; i++) {
      var letter = _font2.default[text[i]];

      if (!letter) continue;

      for (var j = 0; j < 15; j++) {
        var lx = j % 3;
        var ly = Math.floor(j / 3);

        if (letter[j]) {
          pset(lx + x + i * 4, ly + y, colorIndex);
        }
      }
    }
  }

  function pal(c1, c2) {
    var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (c1 === undefined && c2 === undefined) {
      ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
      ram.memwrite(0x5f10, initialColors); // load initial screen palette to ram
      return;
    }

    var startAddr = 0x5000; // draw palette

    if (p === 1) {
      startAddr = 0x5f10;
    }

    if (c2 >= 128) {
      c2 -= 128;
    }

    var drawPalette = ram.memread(startAddr, 16);
    drawPalette[c1] = initialColors[c2];
    ram.memwrite(startAddr, drawPalette);
  }

  function palt(c, t) {
    if (c === undefined && t === undefined) {
      ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
      palt(0, true);
      return;
    }

    var current = ram.peek(0x5000 + c);
    var str = color8toHexStr(current);

    if (t) {
      str = str[0] + "1";
    } else {
      str = str[0] + "0";
    }

    ram.poke(0x5000 + c, parseInt(str, 16));
  }

  function _getCamera() {
    var xSign = ram.arr[0x5f28] === 1 ? -1 : 1;
    var ySign = ram.arr[0x5f2a] === 1 ? -1 : 1;

    var x = ram.arr[0x5f29];
    var y = ram.arr[0x5f2b];

    return [x * xSign, y * ySign];
  }

  function camera() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0) {
      ram.poke(0x5f28, 1);
    } else {
      ram.poke(0x5f28, 0);
    }
    if (y < 0) {
      ram.poke(0x5f2a, 1);
    } else {
      ram.poke(0x5f2a, 0);
    }

    ram.poke(0x5f29, Math.abs(x));
    ram.poke(0x5f2b, Math.abs(y));
  }

  function _getClip() {
    return [ram.arr[0x5f20], ram.arr[0x5f21], ram.arr[0x5f22], ram.arr[0x5f23]];
  }

  function clip() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 127;
    var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 127;

    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.floor(w);
    h = Math.floor(h);

    ram.poke(0x5f20, x);
    ram.poke(0x5f21, y);
    ram.poke(0x5f22, x + w);
    ram.poke(0x5f23, y + h);
  }

  function color() {
    var colorIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    ram.poke(0x5f25, colorIndex);
  }

  function _getCursor() {
    // TODO: Implement usage of this to print
    return [ram.peek(0x5f26), ram.peek(0x5f27)];
  }

  function cursor(x, y) {
    // TODO: Implement usage of this to print

    x = Math.floor(x);
    y = Math.floor(y);

    ram.poke(0x5f26, x);
    ram.poke(0x5f27, y);
  }

  function fget(n, f) {
    var addr = 0x3000 + n;

    if (f === undefined) {
      return ram.arr[addr];
    }

    return (ram.arr[addr] & flags[f]) === flags[f];
  }

  function fset(n, f, v) {
    var addr = 0x3000 + n;

    if (arguments.length === 2) {
      return ram.poke(addr, f);
    }

    if (fget(n, f) && v) {
      return;
    }

    if (fget(n, f) && !v) {
      ram.poke(addr, fget(n) - flags[f]);
    }

    if (!fget(n, f) && v) {
      ram.poke(addr, fget(n) + flags[f]);
    }
  }

  function stat() {
    return '';
  }

  ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
  ram.memwrite(0x5f10, initialColors); // load initial screen palette to ram
  palt(0, true);

  return {
    camera: camera,
    clip: clip,
    cls: cls,
    color: color,
    cursor: cursor,
    fget: fget,
    fset: fset,
    pget: pget,
    pset: pset,
    line: line,
    rect: rect,
    rectfill: rectfill,
    circ: circ,
    circfill: circfill,
    spr: spr,
    sget: sget,
    sset: sset,
    print: print,
    pal: pal,
    palt: palt,
    map: map,
    mget: mget,
    mset: mset,
    stat: stat
  };
}

/***/ },
/* 19 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = 1;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

exports.default = {
  rnd: function rnd(x) {
    x = x || 1;
    return random() * x;
  },
  sgn: function sgn(x) {
    return x < 0 ? -1 : 1;
  },


  max: Math.max,

  min: Math.min,

  mid: function mid(x, y, z) {
    return Math.max(x, Math.min(y, z));
  },


  flr: Math.floor,

  cos: function cos(x) {
    // x = 0 - 1
    return Math.cos(x * 2 * 3.1415);
  },
  sin: function sin(x) {
    return Math.sin(-x * 2 * 3.1415);
  },


  atan2: Math.atan2,

  sqrt: Math.sqrt,

  abs: Math.abs,

  srand: function srand(x) {
    x = x || 0;
    seed = 0;
  },
  band: function band(x, y) {
    return x & y;
  },
  bor: function bor(x, y) {
    return x | y;
  },
  bxor: function bxor(x, y) {
    return x ^ y;
  },
  bnot: function bnot(x) {
    return ~x;
  },
  shl: function shl(x, y) {},
  shr: function shr(x, y) {}
};

/***/ },
/* 20 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readCartridge;
// http://www.lexaloffle.com/bbs/?tid=27845

function readCartridge($bmp) {
  function pad(byte) {
    "use strict";

    return byte.toString().replace(/^(.(..)*)$/, '0$1');
  }

  function stringy(byte) {
    "use strict";

    return pad(byte.toString(16));
  }

  function buildString(str, len) {
    "use strict";

    var reg = new RegExp('.{1,' + len + '}', 'g');

    str = str.match(reg);
    str.forEach(function (m, idx) {
      str[idx] += "\n";
    });

    return str.join('');
  }

  function decompress(code) {
    "use strict";

    var mode = 0,
        copy,
        i = 8,
        lua = '',
        codelen = code.charCodeAt(4) << 8 | code.charCodeAt(5);
    var dict = "\n 0123456789abcdefghijklmnopqrstuvwxyz!#%(){}[]<>+=/*:;.,~_".split('');
    var byte, offset, length, buffer;

    while (lua.length < codelen) {
      byte = code.charCodeAt(i);

      if (mode === 1) {
        lua += code.charAt(i);
        mode = 0;
      } else if (mode === 2) {
        offset = lua.length - ((copy - 60) * 16 + (byte & 15));
        length = (byte >> 4) + 2;
        buffer = lua.substring(offset, offset + length);
        lua += buffer;
        mode = 0;
      } else if (byte === 0) {
        mode = 1;
      } else if (byte <= 59) {
        lua += dict[byte - 1];
      } else if (byte >= 60) {
        mode = 2;
        copy = byte;
      }

      i++;
    }

    return lua;
  }

  function getData(bmp) {
    "use strict";

    var gfx = '',
        map = '',
        gff = '',
        music = '',
        sfx = '',
        lua = '',
        imgData = bmp.bitmap,
        dataLen = imgData.length,
        i = 0,
        n = 0,
        r,
        g,
        b,
        a,
        byte,
        compressed,
        loop,
        lastbyte,
        loops = [],
        mode,
        speed,
        start,
        end,
        notes = '',
        tmp_music = [],
        track,
        step,
        note,
        version;

    if (bmp.width !== 160 || bmp.height !== 205) {
      return alert('Image is the wrong size.');
    }

    while (i < dataLen) {
      // get the last 2 bytes of each value and shift left if necessary
      r = (imgData[i++] & 3) << 4;
      g = (imgData[i++] & 3) << 2;
      b = imgData[i++] & 3;
      a = (imgData[i++] & 3) << 6;

      // compile new byte, convert to hex and pad left if needed
      byte = r | g | b | a;

      if (n < 8192) {
        // change endianness and append to output string
        gfx += stringy(byte).split('').reverse().join('');
      } else if (n < 12288) {
        map += stringy(byte);
      } else if (n < 12544) {
        gff += stringy(byte);
      } else if (n < 12800) {
        track = Math.floor((n - 12544) / 4);
        note = stringy(byte & 127);

        if (n % 4 === 0) {
          tmp_music.push([null, '']);
        }

        tmp_music[track][0] = stringy((byte & 128) >> 7 - n % 4 | tmp_music[track][0]);
        tmp_music[track][1] += note;
      } else if (n < 17152) {
        step = (n - 12800) % 68;

        if (step < 64 && n % 2 === 1) {
          note = (byte << 8) + lastbyte;
          notes += stringy(note & 63) + ((note & 448) >> 6).toString(16) + ((note & 3584) >> 9).toString(16) + ((note & 28672) >> 12).toString(16);
        } else if (step === 64) {
          mode = pad(byte);
        } else if (step === 65) {
          speed = byte;
        } else if (step === 66) {
          start = byte;
        } else if (step === 67) {
          end = byte;
          sfx += mode + stringy(speed) + stringy(start) + stringy(end) + notes + "\n";
          notes = '';
        }
      } else if (n < 32768) {
        if (n === 17152) {
          compressed = byte === 58;
        }

        lua += String.fromCharCode(byte);
      } else if (n === 32768) {
        version = byte;
      }

      lastbyte = byte;
      n++;
    }

    if (compressed) lua = decompress(lua);
    gfx = buildString(gfx, 128);
    gff = buildString(gff, 256);
    map = buildString(map, 256);

    tmp_music.forEach(function (m) {
      music += m[0] + ' ' + m[1] + "\n";
    });

    var result = {
      version: version,
      code: lua,
      gfx: gfx.replace(/(\r\n|\n|\r)/gm, ""),
      gff: gff.replace(/(\r\n|\n|\r)/gm, ""),
      map: map.replace(/(\r\n|\n|\r)/gm, ""),
      sfx: sfx.replace(/(\r\n|\n|\r)/gm, ""),
      music: music.replace(/(\r\n|\n|\r)/gm, "")
    };

    return result;
  }

  return getData($bmp);
};

/***/ },
/* 21 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSoundFunctions;
function getSoundFunctions(ram) {
  function music(n, fadeLen, channelMask) {}

  function sfx(n, channel, offset) {}

  return {
    music: music,
    sfx: sfx
  };
}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*
  Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2015 Ingvar Stepanyan <me@rreverser.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*global exports:true, require:true, global:true*/
(function () {
    'use strict';

    var Syntax,
        Precedence,
        BinaryPrecedence,
        SourceNode,
        estraverse,
        esutils,
        base,
        indent,
        json,
        renumber,
        hexadecimal,
        quotes,
        escapeless,
        newline,
        space,
        parentheses,
        semicolons,
        safeConcatenation,
        directive,
        extra,
        parse,
        sourceMap,
        sourceCode,
        preserveBlankLines,
        FORMAT_MINIFY,
        FORMAT_DEFAULTS;

    estraverse = __webpack_require__(6);
    esutils = __webpack_require__(32);

    Syntax = estraverse.Syntax;

    // Generation is done by generateExpression.
    function isExpression(node) {
        return CodeGenerator.Expression.hasOwnProperty(node.type);
    }

    // Generation is done by generateStatement.
    function isStatement(node) {
        return CodeGenerator.Statement.hasOwnProperty(node.type);
    }

    Precedence = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseOR: 5,
        BitwiseXOR: 6,
        BitwiseAND: 7,
        Equality: 8,
        Relational: 9,
        BitwiseSHIFT: 10,
        Additive: 11,
        Multiplicative: 12,
        Await: 13,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        TaggedTemplate: 17,
        Member: 18,
        Primary: 19
    };

    BinaryPrecedence = {
        '||': Precedence.LogicalOR,
        '&&': Precedence.LogicalAND,
        '|': Precedence.BitwiseOR,
        '^': Precedence.BitwiseXOR,
        '&': Precedence.BitwiseAND,
        '==': Precedence.Equality,
        '!=': Precedence.Equality,
        '===': Precedence.Equality,
        '!==': Precedence.Equality,
        'is': Precedence.Equality,
        'isnt': Precedence.Equality,
        '<': Precedence.Relational,
        '>': Precedence.Relational,
        '<=': Precedence.Relational,
        '>=': Precedence.Relational,
        'in': Precedence.Relational,
        'instanceof': Precedence.Relational,
        '<<': Precedence.BitwiseSHIFT,
        '>>': Precedence.BitwiseSHIFT,
        '>>>': Precedence.BitwiseSHIFT,
        '+': Precedence.Additive,
        '-': Precedence.Additive,
        '*': Precedence.Multiplicative,
        '%': Precedence.Multiplicative,
        '/': Precedence.Multiplicative
    };

    //Flags
    var F_ALLOW_IN = 1,
        F_ALLOW_CALL = 1 << 1,
        F_ALLOW_UNPARATH_NEW = 1 << 2,
        F_FUNC_BODY = 1 << 3,
        F_DIRECTIVE_CTX = 1 << 4,
        F_SEMICOLON_OPT = 1 << 5;

    //Expression flag sets
    //NOTE: Flag order:
    // F_ALLOW_IN
    // F_ALLOW_CALL
    // F_ALLOW_UNPARATH_NEW
    var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
        E_TTF = F_ALLOW_IN | F_ALLOW_CALL,
        E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
        E_TFF = F_ALLOW_IN,
        E_FFT = F_ALLOW_UNPARATH_NEW,
        E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;

    //Statement flag sets
    //NOTE: Flag order:
    // F_ALLOW_IN
    // F_FUNC_BODY
    // F_DIRECTIVE_CTX
    // F_SEMICOLON_OPT
    var S_TFFF = F_ALLOW_IN,
        S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT,
        S_FFFF = 0x00,
        S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX,
        S_TTFF = F_ALLOW_IN | F_FUNC_BODY;

    function getDefaultOptions() {
        // default options
        return {
            indent: null,
            base: null,
            parse: null,
            comment: false,
            format: {
                indent: {
                    style: '    ',
                    base: 0,
                    adjustMultilineComment: false
                },
                newline: '\n',
                space: ' ',
                json: false,
                renumber: false,
                hexadecimal: false,
                quotes: 'single',
                escapeless: false,
                compact: false,
                parentheses: true,
                semicolons: true,
                safeConcatenation: false,
                preserveBlankLines: false
            },
            moz: {
                comprehensionExpressionStartsWithAssignment: false,
                starlessGenerator: false
            },
            sourceMap: null,
            sourceMapRoot: null,
            sourceMapWithCode: false,
            directive: false,
            raw: true,
            verbatim: null,
            sourceCode: null
        };
    }

    function stringRepeat(str, num) {
        var result = '';

        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }

        return result;
    }

    function hasLineTerminator(str) {
        return (/[\r\n]/g).test(str);
    }

    function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
    }

    function merge(target, override) {
        var key;
        for (key in override) {
            if (override.hasOwnProperty(key)) {
                target[key] = override[key];
            }
        }
        return target;
    }

    function updateDeeply(target, override) {
        var key, val;

        function isHashObject(target) {
            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }

        for (key in override) {
            if (override.hasOwnProperty(key)) {
                val = override[key];
                if (isHashObject(val)) {
                    if (isHashObject(target[key])) {
                        updateDeeply(target[key], val);
                    } else {
                        target[key] = updateDeeply({}, val);
                    }
                } else {
                    target[key] = val;
                }
            }
        }
        return target;
    }

    function generateNumber(value) {
        var result, point, temp, exponent, pos;

        if (value !== value) {
            throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || (value === 0 && 1 / value < 0)) {
            throw new Error('Numeric literal whose value is negative');
        }

        if (value === 1 / 0) {
            return json ? 'null' : renumber ? '1e400' : '1e+400';
        }

        result = '' + value;
        if (!renumber || result.length < 3) {
            return result;
        }

        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
            point = 0;
            result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
            exponent = +temp.slice(pos + 1);
            temp = temp.slice(0, pos);
        }
        if (point >= 0) {
            exponent -= temp.length - point - 1;
            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
            --pos;
        }
        if (pos !== 0) {
            exponent -= pos;
            temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
            temp += 'e' + exponent;
        }
        if ((temp.length < result.length ||
                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
                +temp === value) {
            result = temp;
        }

        return result;
    }

    // Generate valid RegExp expression.
    // This function is based on https://github.com/Constellation/iv Engine

    function escapeRegExpCharacter(ch, previousIsBackslash) {
        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
        if ((ch & ~1) === 0x2028) {
            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {  // \n, \r
            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
    }

    function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

        result = reg.toString();

        if (reg.source) {
            // extract flag from toString result
            match = result.match(/\/([^/]*)$/);
            if (!match) {
                return result;
            }

            flags = match[1];
            result = '';

            characterInBrack = false;
            previousIsBackslash = false;
            for (i = 0, iz = reg.source.length; i < iz; ++i) {
                ch = reg.source.charCodeAt(i);

                if (!previousIsBackslash) {
                    if (characterInBrack) {
                        if (ch === 93) {  // ]
                            characterInBrack = false;
                        }
                    } else {
                        if (ch === 47) {  // /
                            result += '\\';
                        } else if (ch === 91) {  // [
                            characterInBrack = true;
                        }
                    }
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    previousIsBackslash = ch === 92;  // \
                } else {
                    // if new RegExp("\\\n') is provided, create /\n/
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    // prevent like /\\[/]/
                    previousIsBackslash = false;
                }
            }

            return '/' + result + '/' + flags;
        }

        return result;
    }

    function escapeAllowedCharacter(code, next) {
        var hex;

        if (code === 0x08  /* \b */) {
            return '\\b';
        }

        if (code === 0x0C  /* \f */) {
            return '\\f';
        }

        if (code === 0x09  /* \t */) {
            return '\\t';
        }

        hex = code.toString(16).toUpperCase();
        if (json || code > 0xFF) {
            return '\\u' + '0000'.slice(hex.length) + hex;
        } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
            return '\\0';
        } else if (code === 0x000B  /* \v */) { // '\v'
            return '\\x0B';
        } else {
            return '\\x' + '00'.slice(hex.length) + hex;
        }
    }

    function escapeDisallowedCharacter(code) {
        if (code === 0x5C  /* \ */) {
            return '\\\\';
        }

        if (code === 0x0A  /* \n */) {
            return '\\n';
        }

        if (code === 0x0D  /* \r */) {
            return '\\r';
        }

        if (code === 0x2028) {
            return '\\u2028';
        }

        if (code === 0x2029) {
            return '\\u2029';
        }

        throw new Error('Incorrectly classified character');
    }

    function escapeDirective(str) {
        var i, iz, code, quote;

        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                quote = '"';
                break;
            } else if (code === 0x22  /* " */) {
                quote = '\'';
                break;
            } else if (code === 0x5C  /* \ */) {
                ++i;
            }
        }

        return quote + str + quote;
    }

    function escapeString(str) {
        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                ++singleQuotes;
            } else if (code === 0x22  /* " */) {
                ++doubleQuotes;
            } else if (code === 0x2F  /* / */ && json) {
                result += '\\';
            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
                result += escapeDisallowedCharacter(code);
                continue;
            } else if (!esutils.code.isIdentifierPartES5(code) && (json && code < 0x20  /* SP */ || !json && !escapeless && (code < 0x20  /* SP */ || code > 0x7E  /* ~ */))) {
                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
                continue;
            }
            result += String.fromCharCode(code);
        }

        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
        quote = single ? '\'' : '"';

        if (!(single ? singleQuotes : doubleQuotes)) {
            return quote + result + quote;
        }

        str = result;
        result = quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
                result += '\\';
            }
            result += String.fromCharCode(code);
        }

        return result + quote;
    }

    /**
     * flatten an array to a string, where the array can contain
     * either strings or nested arrays
     */
    function flattenToString(arr) {
        var i, iz, elem, result = '';
        for (i = 0, iz = arr.length; i < iz; ++i) {
            elem = arr[i];
            result += Array.isArray(elem) ? flattenToString(elem) : elem;
        }
        return result;
    }

    /**
     * convert generated to a SourceNode when source maps are enabled.
     */
    function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap) {
            // with no source maps, generated is either an
            // array or a string.  if an array, flatten it.
            // if a string, just return it
            if (Array.isArray(generated)) {
                return flattenToString(generated);
            } else {
                return generated;
            }
        }
        if (node == null) {
            if (generated instanceof SourceNode) {
                return generated;
            } else {
                node = {};
            }
        }
        if (node.loc == null) {
            return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
    }

    function noEmptySpace() {
        return (space) ? space : ' ';
    }

    function join(left, right) {
        var leftSource,
            rightSource,
            leftCharCode,
            rightCharCode;

        leftSource = toSourceNodeWhenNeeded(left).toString();
        if (leftSource.length === 0) {
            return [right];
        }

        rightSource = toSourceNodeWhenNeeded(right).toString();
        if (rightSource.length === 0) {
            return [left];
        }

        leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
        rightCharCode = rightSource.charCodeAt(0);

        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
            esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode) ||
            leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
            return [left, noEmptySpace(), right];
        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
            return [left, right];
        }
        return [left, space, right];
    }

    function addIndent(stmt) {
        return [base, stmt];
    }

    function withIndent(fn) {
        var previousBase;
        previousBase = base;
        base += indent;
        fn(base);
        base = previousBase;
    }

    function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
                break;
            }
        }
        return (str.length - 1) - i;
    }

    function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase, sn;

        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;

        // first line doesn't have indentation
        for (i = 1, len = array.length; i < len; ++i) {
            line = array[i];
            j = 0;
            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
                ++j;
            }
            if (spaces > j) {
                spaces = j;
            }
        }

        if (typeof specialBase !== 'undefined') {
            // pattern like
            // {
            //   var t = 20;  /*
            //                 * this is comment
            //                 */
            // }
            previousBase = base;
            if (array[1][spaces] === '*') {
                specialBase += ' ';
            }
            base = specialBase;
        } else {
            if (spaces & 1) {
                // /*
                //  *
                //  */
                // If spaces are odd number, above pattern is considered.
                // We waste 1 space.
                --spaces;
            }
            previousBase = base;
        }

        for (i = 1, len = array.length; i < len; ++i) {
            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
            array[i] = sourceMap ? sn.join('') : sn;
        }

        base = previousBase;

        return array.join('\n');
    }

    function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
            if (endsWithLineTerminator(comment.value)) {
                return '//' + comment.value;
            } else {
                // Always use LineTerminator
                var result = '//' + comment.value;
                if (!preserveBlankLines) {
                    result += '\n';
                }
                return result;
            }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
    }

    function addComments(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment,
            extRange, range, prevRange, prefix, infix, suffix, count;

        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
            save = result;

            if (preserveBlankLines) {
                comment = stmt.leadingComments[0];
                result = [];

                extRange = comment.extendedRange;
                range = comment.range;

                prefix = sourceCode.substring(extRange[0], range[0]);
                count = (prefix.match(/\n/g) || []).length;
                if (count > 0) {
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));
                } else {
                    result.push(prefix);
                    result.push(generateComment(comment));
                }

                prevRange = range;

                for (i = 1, len = stmt.leadingComments.length; i < len; i++) {
                    comment = stmt.leadingComments[i];
                    range = comment.range;

                    infix = sourceCode.substring(prevRange[1], range[0]);
                    count = (infix.match(/\n/g) || []).length;
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));

                    prevRange = range;
                }

                suffix = sourceCode.substring(range[1], extRange[1]);
                count = (suffix.match(/\n/g) || []).length;
                result.push(stringRepeat('\n', count));
            } else {
                comment = stmt.leadingComments[0];
                result = [];
                if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
                    result.push('\n');
                }
                result.push(generateComment(comment));
                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                    result.push('\n');
                }

                for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
                    comment = stmt.leadingComments[i];
                    fragment = [generateComment(comment)];
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        fragment.push('\n');
                    }
                    result.push(addIndent(fragment));
                }
            }

            result.push(addIndent(save));
        }

        if (stmt.trailingComments) {

            if (preserveBlankLines) {
                comment = stmt.trailingComments[0];
                extRange = comment.extendedRange;
                range = comment.range;

                prefix = sourceCode.substring(extRange[0], range[0]);
                count = (prefix.match(/\n/g) || []).length;

                if (count > 0) {
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));
                } else {
                    result.push(prefix);
                    result.push(generateComment(comment));
                }
            } else {
                tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
                specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
                for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
                    comment = stmt.trailingComments[i];
                    if (tailingToStatement) {
                        // We assume target like following script
                        //
                        // var t = 20;  /**
                        //               * This is comment of t
                        //               */
                        if (i === 0) {
                            // first case
                            result = [result, indent];
                        } else {
                            result = [result, specialBase];
                        }
                        result.push(generateComment(comment, specialBase));
                    } else {
                        result = [result, addIndent(generateComment(comment))];
                    }
                    if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result = [result, '\n'];
                    }
                }
            }
        }

        return result;
    }

    function generateBlankLines(start, end, result) {
        var j, newlineCount = 0;

        for (j = start; j < end; j++) {
            if (sourceCode[j] === '\n') {
                newlineCount++;
            }
        }

        for (j = 1; j < newlineCount; j++) {
            result.push(newline);
        }
    }

    function parenthesize(text, current, should) {
        if (current < should) {
            return ['(', text, ')'];
        }
        return text;
    }

    function generateVerbatimString(string) {
        var i, iz, result;
        result = string.split(/\r\n|\n/);
        for (i = 1, iz = result.length; i < iz; i++) {
            result[i] = newline + base + result[i];
        }
        return result;
    }

    function generateVerbatim(expr, precedence) {
        var verbatim, result, prec;
        verbatim = expr[extra.verbatim];

        if (typeof verbatim === 'string') {
            result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
        } else {
            // verbatim is object
            result = generateVerbatimString(verbatim.content);
            prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
            result = parenthesize(result, prec, precedence);
        }

        return toSourceNodeWhenNeeded(result, expr);
    }

    function CodeGenerator() {
    }

    // Helpers.

    CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
        var result, noLeadingComment, that = this;

        noLeadingComment = !extra.comment || !stmt.leadingComments;

        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
            return [space, this.generateStatement(stmt, flags)];
        }

        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
            return ';';
        }

        withIndent(function () {
            result = [
                newline,
                addIndent(that.generateStatement(stmt, flags))
            ];
        });

        return result;
    };

    CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
            return [result, space];
        }
        if (ends) {
            return [result, base];
        }
        return [result, newline, base];
    };

    function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
    }

    function generateAsyncPrefix(node, spaceRequired) {
        return node.async ? 'async' + (spaceRequired ? noEmptySpace() : space) : '';
    }

    function generateStarSuffix(node) {
        var isGenerator = node.generator && !extra.moz.starlessGenerator;
        return isGenerator ? '*' + space : '';
    }

    function generateMethodPrefix(prop) {
        var func = prop.value, prefix = '';
        if (func.async) {
            prefix += generateAsyncPrefix(func, !prop.computed);
        }
        if (func.generator) {
            // avoid space before method name
            prefix += generateStarSuffix(func) ? '*' : '';
        }
        return prefix;
    }

    CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
        if (node.type === Syntax.Identifier) {
            return generateIdentifier(node);
        }
        return this.generateExpression(node, precedence, flags);
    };

    CodeGenerator.prototype.generateFunctionParams = function (node) {
        var i, iz, result, hasDefault;

        hasDefault = false;

        if (node.type === Syntax.ArrowFunctionExpression &&
                !node.rest && (!node.defaults || node.defaults.length === 0) &&
                node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
            // arg => { } case
            result = [generateAsyncPrefix(node, true), generateIdentifier(node.params[0])];
        } else {
            result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
            result.push('(');
            if (node.defaults) {
                hasDefault = true;
            }
            for (i = 0, iz = node.params.length; i < iz; ++i) {
                if (hasDefault && node.defaults[i]) {
                    // Handle default values.
                    result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence.Assignment, E_TTT));
                } else {
                    result.push(this.generatePattern(node.params[i], Precedence.Assignment, E_TTT));
                }
                if (i + 1 < iz) {
                    result.push(',' + space);
                }
            }

            if (node.rest) {
                if (node.params.length) {
                    result.push(',' + space);
                }
                result.push('...');
                result.push(generateIdentifier(node.rest));
            }

            result.push(')');
        }

        return result;
    };

    CodeGenerator.prototype.generateFunctionBody = function (node) {
        var result, expr;

        result = this.generateFunctionParams(node);

        if (node.type === Syntax.ArrowFunctionExpression) {
            result.push(space);
            result.push('=>');
        }

        if (node.expression) {
            result.push(space);
            expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
            if (expr.toString().charAt(0) === '{') {
                expr = ['(', expr, ')'];
            }
            result.push(expr);
        } else {
            result.push(this.maybeBlock(node.body, S_TTFF));
        }

        return result;
    };

    CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
        var result = ['for' + space + (stmt.await ? 'await' + space : '') + '('], that = this;
        withIndent(function () {
            if (stmt.left.type === Syntax.VariableDeclaration) {
                withIndent(function () {
                    result.push(stmt.left.kind + noEmptySpace());
                    result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
                });
            } else {
                result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
            }

            result = join(result, operator);
            result = [join(
                result,
                that.generateExpression(stmt.right, Precedence.Assignment, E_TTT)
            ), ')'];
        });
        result.push(this.maybeBlock(stmt.body, flags));
        return result;
    };

    CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
        var result = [];

        if (computed) {
            result.push('[');
        }

        result.push(this.generateExpression(expr, Precedence.Sequence, E_TTT));

        if (computed) {
            result.push(']');
        }

        return result;
    };

    CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
        if (Precedence.Assignment < precedence) {
            flags |= F_ALLOW_IN;
        }

        return parenthesize(
            [
                this.generateExpression(left, Precedence.Call, flags),
                space + operator + space,
                this.generateExpression(right, Precedence.Assignment, flags)
            ],
            Precedence.Assignment,
            precedence
        );
    };

    CodeGenerator.prototype.semicolon = function (flags) {
        if (!semicolons && flags & F_SEMICOLON_OPT) {
            return '';
        }
        return ';';
    };

    // Statements.

    CodeGenerator.Statement = {

        BlockStatement: function (stmt, flags) {
            var range, content, result = ['{', newline], that = this;

            withIndent(function () {
                // handle functions without any code
                if (stmt.body.length === 0 && preserveBlankLines) {
                    range = stmt.range;
                    if (range[1] - range[0] > 2) {
                        content = sourceCode.substring(range[0] + 1, range[1] - 1);
                        if (content[0] === '\n') {
                            result = ['{'];
                        }
                        result.push(content);
                    }
                }

                var i, iz, fragment, bodyFlags;
                bodyFlags = S_TFFF;
                if (flags & F_FUNC_BODY) {
                    bodyFlags |= F_DIRECTIVE_CTX;
                }

                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                    if (preserveBlankLines) {
                        // handle spaces before the first line
                        if (i === 0) {
                            if (stmt.body[0].leadingComments) {
                                range = stmt.body[0].leadingComments[0].extendedRange;
                                content = sourceCode.substring(range[0], range[1]);
                                if (content[0] === '\n') {
                                    result = ['{'];
                                }
                            }
                            if (!stmt.body[0].leadingComments) {
                                generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
                            }
                        }

                        // handle spaces between lines
                        if (i > 0) {
                            if (!stmt.body[i - 1].trailingComments  && !stmt.body[i].leadingComments) {
                                generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                            }
                        }
                    }

                    if (i === iz - 1) {
                        bodyFlags |= F_SEMICOLON_OPT;
                    }

                    if (stmt.body[i].leadingComments && preserveBlankLines) {
                        fragment = that.generateStatement(stmt.body[i], bodyFlags);
                    } else {
                        fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
                    }

                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        if (preserveBlankLines && i < iz - 1) {
                            // don't add a new line if there are leading coments
                            // in the next statement
                            if (!stmt.body[i + 1].leadingComments) {
                                result.push(newline);
                            }
                        } else {
                            result.push(newline);
                        }
                    }

                    if (preserveBlankLines) {
                        // handle spaces after the last line
                        if (i === iz - 1) {
                            if (!stmt.body[i].trailingComments) {
                                generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                            }
                        }
                    }
                }
            });

            result.push(addIndent('}'));
            return result;
        },

        BreakStatement: function (stmt, flags) {
            if (stmt.label) {
                return 'break ' + stmt.label.name + this.semicolon(flags);
            }
            return 'break' + this.semicolon(flags);
        },

        ContinueStatement: function (stmt, flags) {
            if (stmt.label) {
                return 'continue ' + stmt.label.name + this.semicolon(flags);
            }
            return 'continue' + this.semicolon(flags);
        },

        ClassBody: function (stmt, flags) {
            var result = [ '{', newline], that = this;

            withIndent(function (indent) {
                var i, iz;

                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                    result.push(indent);
                    result.push(that.generateExpression(stmt.body[i], Precedence.Sequence, E_TTT));
                    if (i + 1 < iz) {
                        result.push(newline);
                    }
                }
            });

            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(base);
            result.push('}');
            return result;
        },

        ClassDeclaration: function (stmt, flags) {
            var result, fragment;
            result  = ['class'];
            if (stmt.id) {
                result = join(result, this.generateExpression(stmt.id, Precedence.Sequence, E_TTT));
            }
            if (stmt.superClass) {
                fragment = join('extends', this.generateExpression(stmt.superClass, Precedence.Assignment, E_TTT));
                result = join(result, fragment);
            }
            result.push(space);
            result.push(this.generateStatement(stmt.body, S_TFFT));
            return result;
        },

        DirectiveStatement: function (stmt, flags) {
            if (extra.raw && stmt.raw) {
                return stmt.raw + this.semicolon(flags);
            }
            return escapeDirective(stmt.directive) + this.semicolon(flags);
        },

        DoWhileStatement: function (stmt, flags) {
            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
            var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
            result = this.maybeBlockSuffix(stmt.body, result);
            return join(result, [
                'while' + space + '(',
                this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                ')' + this.semicolon(flags)
            ]);
        },

        CatchClause: function (stmt, flags) {
            var result, that = this;
            withIndent(function () {
                var guard;

                result = [
                    'catch' + space + '(',
                    that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
                    ')'
                ];

                if (stmt.guard) {
                    guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
                    result.splice(2, 0, ' if ', guard);
                }
            });
            result.push(this.maybeBlock(stmt.body, S_TFFF));
            return result;
        },

        DebuggerStatement: function (stmt, flags) {
            return 'debugger' + this.semicolon(flags);
        },

        EmptyStatement: function (stmt, flags) {
            return ';';
        },

        ExportDefaultDeclaration: function (stmt, flags) {
            var result = [ 'export' ], bodyFlags;

            bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

            // export default HoistableDeclaration[Default]
            // export default AssignmentExpression[In] ;
            result = join(result, 'default');
            if (isStatement(stmt.declaration)) {
                result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
            } else {
                result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
            }
            return result;
        },

        ExportNamedDeclaration: function (stmt, flags) {
            var result = [ 'export' ], bodyFlags, that = this;

            bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

            // export VariableStatement
            // export Declaration[Default]
            if (stmt.declaration) {
                return join(result, this.generateStatement(stmt.declaration, bodyFlags));
            }

            // export ExportClause[NoReference] FromClause ;
            // export ExportClause ;
            if (stmt.specifiers) {
                if (stmt.specifiers.length === 0) {
                    result = join(result, '{' + space + '}');
                } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
                    result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
                } else {
                    result = join(result, '{');
                    withIndent(function (indent) {
                        var i, iz;
                        result.push(newline);
                        for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
                            result.push(indent);
                            result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                            if (i + 1 < iz) {
                                result.push(',' + newline);
                            }
                        }
                    });
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result.push(newline);
                    }
                    result.push(base + '}');
                }

                if (stmt.source) {
                    result = join(result, [
                        'from' + space,
                        // ModuleSpecifier
                        this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                        this.semicolon(flags)
                    ]);
                } else {
                    result.push(this.semicolon(flags));
                }
            }
            return result;
        },

        ExportAllDeclaration: function (stmt, flags) {
            // export * FromClause ;
            return [
                'export' + space,
                '*' + space,
                'from' + space,
                // ModuleSpecifier
                this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                this.semicolon(flags)
            ];
        },

        ExpressionStatement: function (stmt, flags) {
            var result, fragment;

            function isClassPrefixed(fragment) {
                var code;
                if (fragment.slice(0, 5) !== 'class') {
                    return false;
                }
                code = fragment.charCodeAt(5);
                return code === 0x7B  /* '{' */ || esutils.code.isWhiteSpace(code) || esutils.code.isLineTerminator(code);
            }

            function isFunctionPrefixed(fragment) {
                var code;
                if (fragment.slice(0, 8) !== 'function') {
                    return false;
                }
                code = fragment.charCodeAt(8);
                return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
            }

            function isAsyncPrefixed(fragment) {
                var code, i, iz;
                if (fragment.slice(0, 5) !== 'async') {
                    return false;
                }
                if (!esutils.code.isWhiteSpace(fragment.charCodeAt(5))) {
                    return false;
                }
                for (i = 6, iz = fragment.length; i < iz; ++i) {
                    if (!esutils.code.isWhiteSpace(fragment.charCodeAt(i))) {
                        break;
                    }
                }
                if (i === iz) {
                    return false;
                }
                if (fragment.slice(i, i + 8) !== 'function') {
                    return false;
                }
                code = fragment.charCodeAt(i + 8);
                return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
            }

            result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)];
            // 12.4 '{', 'function', 'class' is not allowed in this position.
            // wrap expression with parentheses
            fragment = toSourceNodeWhenNeeded(result).toString();
            if (fragment.charCodeAt(0) === 0x7B  /* '{' */ ||  // ObjectExpression
                    isClassPrefixed(fragment) ||
                    isFunctionPrefixed(fragment) ||
                    isAsyncPrefixed(fragment) ||
                    (directive && (flags & F_DIRECTIVE_CTX) && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
                result = ['(', result, ')' + this.semicolon(flags)];
            } else {
                result.push(this.semicolon(flags));
            }
            return result;
        },

        ImportDeclaration: function (stmt, flags) {
            // ES6: 15.2.1 valid import declarations:
            //     - import ImportClause FromClause ;
            //     - import ModuleSpecifier ;
            var result, cursor, that = this;

            // If no ImportClause is present,
            // this should be `import ModuleSpecifier` so skip `from`
            // ModuleSpecifier is StringLiteral.
            if (stmt.specifiers.length === 0) {
                // import ModuleSpecifier ;
                return [
                    'import',
                    space,
                    // ModuleSpecifier
                    this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                    this.semicolon(flags)
                ];
            }

            // import ImportClause FromClause ;
            result = [
                'import'
            ];
            cursor = 0;

            // ImportedBinding
            if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
                result = join(result, [
                        this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
                ]);
                ++cursor;
            }

            if (stmt.specifiers[cursor]) {
                if (cursor !== 0) {
                    result.push(',');
                }

                if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
                    // NameSpaceImport
                    result = join(result, [
                            space,
                            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
                    ]);
                } else {
                    // NamedImports
                    result.push(space + '{');

                    if ((stmt.specifiers.length - cursor) === 1) {
                        // import { ... } from "...";
                        result.push(space);
                        result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
                        result.push(space + '}' + space);
                    } else {
                        // import {
                        //    ...,
                        //    ...,
                        // } from "...";
                        withIndent(function (indent) {
                            var i, iz;
                            result.push(newline);
                            for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
                                result.push(indent);
                                result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                                if (i + 1 < iz) {
                                    result.push(',' + newline);
                                }
                            }
                        });
                        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                            result.push(newline);
                        }
                        result.push(base + '}' + space);
                    }
                }
            }

            result = join(result, [
                'from' + space,
                // ModuleSpecifier
                this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                this.semicolon(flags)
            ]);
            return result;
        },

        VariableDeclarator: function (stmt, flags) {
            var itemFlags = (flags & F_ALLOW_IN) ? E_TTT : E_FTT;
            if (stmt.init) {
                return [
                    this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
                    space,
                    '=',
                    space,
                    this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
                ];
            }
            return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
        },

        VariableDeclaration: function (stmt, flags) {
            // VariableDeclarator is typed as Statement,
            // but joined with comma (not LineTerminator).
            // So if comment is attached to target node, we should specialize.
            var result, i, iz, node, bodyFlags, that = this;

            result = [ stmt.kind ];

            bodyFlags = (flags & F_ALLOW_IN) ? S_TFFF : S_FFFF;

            function block() {
                node = stmt.declarations[0];
                if (extra.comment && node.leadingComments) {
                    result.push('\n');
                    result.push(addIndent(that.generateStatement(node, bodyFlags)));
                } else {
                    result.push(noEmptySpace());
                    result.push(that.generateStatement(node, bodyFlags));
                }

                for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
                    node = stmt.declarations[i];
                    if (extra.comment && node.leadingComments) {
                        result.push(',' + newline);
                        result.push(addIndent(that.generateStatement(node, bodyFlags)));
                    } else {
                        result.push(',' + space);
                        result.push(that.generateStatement(node, bodyFlags));
                    }
                }
            }

            if (stmt.declarations.length > 1) {
                withIndent(block);
            } else {
                block();
            }

            result.push(this.semicolon(flags));

            return result;
        },

        ThrowStatement: function (stmt, flags) {
            return [join(
                'throw',
                this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
            ), this.semicolon(flags)];
        },

        TryStatement: function (stmt, flags) {
            var result, i, iz, guardedHandlers;

            result = ['try', this.maybeBlock(stmt.block, S_TFFF)];
            result = this.maybeBlockSuffix(stmt.block, result);

            if (stmt.handlers) {
                // old interface
                for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
                    result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
                    if (stmt.finalizer || i + 1 !== iz) {
                        result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
                    }
                }
            } else {
                guardedHandlers = stmt.guardedHandlers || [];

                for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
                    result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
                    if (stmt.finalizer || i + 1 !== iz) {
                        result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
                    }
                }

                // new interface
                if (stmt.handler) {
                    if (Array.isArray(stmt.handler)) {
                        for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
                            result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
                            if (stmt.finalizer || i + 1 !== iz) {
                                result = this.maybeBlockSuffix(stmt.handler[i].body, result);
                            }
                        }
                    } else {
                        result = join(result, this.generateStatement(stmt.handler, S_TFFF));
                        if (stmt.finalizer) {
                            result = this.maybeBlockSuffix(stmt.handler.body, result);
                        }
                    }
                }
            }
            if (stmt.finalizer) {
                result = join(result, ['finally', this.maybeBlock(stmt.finalizer, S_TFFF)]);
            }
            return result;
        },

        SwitchStatement: function (stmt, flags) {
            var result, fragment, i, iz, bodyFlags, that = this;
            withIndent(function () {
                result = [
                    'switch' + space + '(',
                    that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
                    ')' + space + '{' + newline
                ];
            });
            if (stmt.cases) {
                bodyFlags = S_TFFF;
                for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
                    if (i === iz - 1) {
                        bodyFlags |= F_SEMICOLON_OPT;
                    }
                    fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        result.push(newline);
                    }
                }
            }
            result.push(addIndent('}'));
            return result;
        },

        SwitchCase: function (stmt, flags) {
            var result, fragment, i, iz, bodyFlags, that = this;
            withIndent(function () {
                if (stmt.test) {
                    result = [
                        join('case', that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
                        ':'
                    ];
                } else {
                    result = ['default:'];
                }

                i = 0;
                iz = stmt.consequent.length;
                if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
                    fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
                    result.push(fragment);
                    i = 1;
                }

                if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                    result.push(newline);
                }

                bodyFlags = S_TFFF;
                for (; i < iz; ++i) {
                    if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
                        bodyFlags |= F_SEMICOLON_OPT;
                    }
                    fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
                    result.push(fragment);
                    if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        result.push(newline);
                    }
                }
            });
            return result;
        },

        IfStatement: function (stmt, flags) {
            var result, bodyFlags, semicolonOptional, that = this;
            withIndent(function () {
                result = [
                    'if' + space + '(',
                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                    ')'
                ];
            });
            semicolonOptional = flags & F_SEMICOLON_OPT;
            bodyFlags = S_TFFF;
            if (semicolonOptional) {
                bodyFlags |= F_SEMICOLON_OPT;
            }
            if (stmt.alternate) {
                result.push(this.maybeBlock(stmt.consequent, S_TFFF));
                result = this.maybeBlockSuffix(stmt.consequent, result);
                if (stmt.alternate.type === Syntax.IfStatement) {
                    result = join(result, ['else ', this.generateStatement(stmt.alternate, bodyFlags)]);
                } else {
                    result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
                }
            } else {
                result.push(this.maybeBlock(stmt.consequent, bodyFlags));
            }
            return result;
        },

        ForStatement: function (stmt, flags) {
            var result, that = this;
            withIndent(function () {
                result = ['for' + space + '('];
                if (stmt.init) {
                    if (stmt.init.type === Syntax.VariableDeclaration) {
                        result.push(that.generateStatement(stmt.init, S_FFFF));
                    } else {
                        // F_ALLOW_IN becomes false.
                        result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
                        result.push(';');
                    }
                } else {
                    result.push(';');
                }

                if (stmt.test) {
                    result.push(space);
                    result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
                    result.push(';');
                } else {
                    result.push(';');
                }

                if (stmt.update) {
                    result.push(space);
                    result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
                    result.push(')');
                } else {
                    result.push(')');
                }
            });

            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
            return result;
        },

        ForInStatement: function (stmt, flags) {
            return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },

        ForOfStatement: function (stmt, flags) {
            return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },

        LabeledStatement: function (stmt, flags) {
            return [stmt.label.name + ':', this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
        },

        Program: function (stmt, flags) {
            var result, fragment, i, iz, bodyFlags;
            iz = stmt.body.length;
            result = [safeConcatenation && iz > 0 ? '\n' : ''];
            bodyFlags = S_TFTF;
            for (i = 0; i < iz; ++i) {
                if (!safeConcatenation && i === iz - 1) {
                    bodyFlags |= F_SEMICOLON_OPT;
                }

                if (preserveBlankLines) {
                    // handle spaces before the first line
                    if (i === 0) {
                        if (!stmt.body[0].leadingComments) {
                            generateBlankLines(stmt.range[0], stmt.body[i].range[0], result);
                        }
                    }

                    // handle spaces between lines
                    if (i > 0) {
                        if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                            generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                        }
                    }
                }

                fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
                result.push(fragment);
                if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                    if (preserveBlankLines) {
                        if (!stmt.body[i + 1].leadingComments) {
                            result.push(newline);
                        }
                    } else {
                        result.push(newline);
                    }
                }

                if (preserveBlankLines) {
                    // handle spaces after the last line
                    if (i === iz - 1) {
                        if (!stmt.body[i].trailingComments) {
                            generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                        }
                    }
                }
            }
            return result;
        },

        FunctionDeclaration: function (stmt, flags) {
            return [
                generateAsyncPrefix(stmt, true),
                'function',
                generateStarSuffix(stmt) || noEmptySpace(),
                stmt.id ? generateIdentifier(stmt.id) : '',
                this.generateFunctionBody(stmt)
            ];
        },

        ReturnStatement: function (stmt, flags) {
            if (stmt.argument) {
                return [join(
                    'return',
                    this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
                ), this.semicolon(flags)];
            }
            return ['return' + this.semicolon(flags)];
        },

        WhileStatement: function (stmt, flags) {
            var result, that = this;
            withIndent(function () {
                result = [
                    'while' + space + '(',
                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
                    ')'
                ];
            });
            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
            return result;
        },

        WithStatement: function (stmt, flags) {
            var result, that = this;
            withIndent(function () {
                result = [
                    'with' + space + '(',
                    that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
                    ')'
                ];
            });
            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
            return result;
        }

    };

    merge(CodeGenerator.prototype, CodeGenerator.Statement);

    // Expressions.

    CodeGenerator.Expression = {

        SequenceExpression: function (expr, precedence, flags) {
            var result, i, iz;
            if (Precedence.Sequence < precedence) {
                flags |= F_ALLOW_IN;
            }
            result = [];
            for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
                result.push(this.generateExpression(expr.expressions[i], Precedence.Assignment, flags));
                if (i + 1 < iz) {
                    result.push(',' + space);
                }
            }
            return parenthesize(result, Precedence.Sequence, precedence);
        },

        AssignmentExpression: function (expr, precedence, flags) {
            return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
        },

        ArrowFunctionExpression: function (expr, precedence, flags) {
            return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
        },

        ConditionalExpression: function (expr, precedence, flags) {
            if (Precedence.Conditional < precedence) {
                flags |= F_ALLOW_IN;
            }
            return parenthesize(
                [
                    this.generateExpression(expr.test, Precedence.LogicalOR, flags),
                    space + '?' + space,
                    this.generateExpression(expr.consequent, Precedence.Assignment, flags),
                    space + ':' + space,
                    this.generateExpression(expr.alternate, Precedence.Assignment, flags)
                ],
                Precedence.Conditional,
                precedence
            );
        },

        LogicalExpression: function (expr, precedence, flags) {
            return this.BinaryExpression(expr, precedence, flags);
        },

        BinaryExpression: function (expr, precedence, flags) {
            var result, currentPrecedence, fragment, leftSource;
            currentPrecedence = BinaryPrecedence[expr.operator];

            if (currentPrecedence < precedence) {
                flags |= F_ALLOW_IN;
            }

            fragment = this.generateExpression(expr.left, currentPrecedence, flags);

            leftSource = fragment.toString();

            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPartES5(expr.operator.charCodeAt(0))) {
                result = [fragment, noEmptySpace(), expr.operator];
            } else {
                result = join(fragment, expr.operator);
            }

            fragment = this.generateExpression(expr.right, currentPrecedence + 1, flags);

            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
                result.push(noEmptySpace());
                result.push(fragment);
            } else {
                result = join(result, fragment);
            }

            if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
                return ['(', result, ')'];
            }
            return parenthesize(result, currentPrecedence, precedence);
        },

        CallExpression: function (expr, precedence, flags) {
            var result, i, iz;
            // F_ALLOW_UNPARATH_NEW becomes false.
            result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
            result.push('(');
            for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
                result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
                if (i + 1 < iz) {
                    result.push(',' + space);
                }
            }
            result.push(')');

            if (!(flags & F_ALLOW_CALL)) {
                return ['(', result, ')'];
            }
            return parenthesize(result, Precedence.Call, precedence);
        },

        NewExpression: function (expr, precedence, flags) {
            var result, length, i, iz, itemFlags;
            length = expr['arguments'].length;

            // F_ALLOW_CALL becomes false.
            // F_ALLOW_UNPARATH_NEW may become false.
            itemFlags = (flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0) ? E_TFT : E_TFF;

            result = join(
                'new',
                this.generateExpression(expr.callee, Precedence.New, itemFlags)
            );

            if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
                result.push('(');
                for (i = 0, iz = length; i < iz; ++i) {
                    result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
                    if (i + 1 < iz) {
                        result.push(',' + space);
                    }
                }
                result.push(')');
            }

            return parenthesize(result, Precedence.New, precedence);
        },

        MemberExpression: function (expr, precedence, flags) {
            var result, fragment;

            // F_ALLOW_UNPARATH_NEW becomes false.
            result = [this.generateExpression(expr.object, Precedence.Call, (flags & F_ALLOW_CALL) ? E_TTF : E_TFF)];

            if (expr.computed) {
                result.push('[');
                result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
                result.push(']');
            } else {
                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
                    fragment = toSourceNodeWhenNeeded(result).toString();
                    // When the following conditions are all true,
                    //   1. No floating point
                    //   2. Don't have exponents
                    //   3. The last character is a decimal digit
                    //   4. Not hexadecimal OR octal number literal
                    // we should add a floating point.
                    if (
                            fragment.indexOf('.') < 0 &&
                            !/[eExX]/.test(fragment) &&
                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
                            ) {
                        result.push(' ');
                    }
                }
                result.push('.');
                result.push(generateIdentifier(expr.property));
            }

            return parenthesize(result, Precedence.Member, precedence);
        },

        MetaProperty: function (expr, precedence, flags) {
            var result;
            result = [];
            result.push(typeof expr.meta === "string" ? expr.meta : generateIdentifier(expr.meta));
            result.push('.');
            result.push(typeof expr.property === "string" ? expr.property : generateIdentifier(expr.property));
            return parenthesize(result, Precedence.Member, precedence);
        },

        UnaryExpression: function (expr, precedence, flags) {
            var result, fragment, rightCharCode, leftSource, leftCharCode;
            fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);

            if (space === '') {
                result = join(expr.operator, fragment);
            } else {
                result = [expr.operator];
                if (expr.operator.length > 2) {
                    // delete, void, typeof
                    // get `typeof []`, not `typeof[]`
                    result = join(result, fragment);
                } else {
                    // Prevent inserting spaces between operator and argument if it is unnecessary
                    // like, `!cond`
                    leftSource = toSourceNodeWhenNeeded(result).toString();
                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
                    rightCharCode = fragment.toString().charCodeAt(0);

                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
                            (esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode))) {
                        result.push(noEmptySpace());
                        result.push(fragment);
                    } else {
                        result.push(fragment);
                    }
                }
            }
            return parenthesize(result, Precedence.Unary, precedence);
        },

        YieldExpression: function (expr, precedence, flags) {
            var result;
            if (expr.delegate) {
                result = 'yield*';
            } else {
                result = 'yield';
            }
            if (expr.argument) {
                result = join(
                    result,
                    this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
                );
            }
            return parenthesize(result, Precedence.Yield, precedence);
        },

        AwaitExpression: function (expr, precedence, flags) {
            var result = join(
                expr.all ? 'await*' : 'await',
                this.generateExpression(expr.argument, Precedence.Await, E_TTT)
            );
            return parenthesize(result, Precedence.Await, precedence);
        },

        UpdateExpression: function (expr, precedence, flags) {
            if (expr.prefix) {
                return parenthesize(
                    [
                        expr.operator,
                        this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
                    ],
                    Precedence.Unary,
                    precedence
                );
            }
            return parenthesize(
                [
                    this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
                    expr.operator
                ],
                Precedence.Postfix,
                precedence
            );
        },

        FunctionExpression: function (expr, precedence, flags) {
            var result = [
                generateAsyncPrefix(expr, true),
                'function'
            ];
            if (expr.id) {
                result.push(generateStarSuffix(expr) || noEmptySpace());
                result.push(generateIdentifier(expr.id));
            } else {
                result.push(generateStarSuffix(expr) || space);
            }
            result.push(this.generateFunctionBody(expr));
            return result;
        },

        ArrayPattern: function (expr, precedence, flags) {
            return this.ArrayExpression(expr, precedence, flags, true);
        },

        ArrayExpression: function (expr, precedence, flags, isPattern) {
            var result, multiline, that = this;
            if (!expr.elements.length) {
                return '[]';
            }
            multiline = isPattern ? false : expr.elements.length > 1;
            result = ['[', multiline ? newline : ''];
            withIndent(function (indent) {
                var i, iz;
                for (i = 0, iz = expr.elements.length; i < iz; ++i) {
                    if (!expr.elements[i]) {
                        if (multiline) {
                            result.push(indent);
                        }
                        if (i + 1 === iz) {
                            result.push(',');
                        }
                    } else {
                        result.push(multiline ? indent : '');
                        result.push(that.generateExpression(expr.elements[i], Precedence.Assignment, E_TTT));
                    }
                    if (i + 1 < iz) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });
            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '');
            result.push(']');
            return result;
        },

        RestElement: function(expr, precedence, flags) {
            return '...' + this.generatePattern(expr.argument);
        },

        ClassExpression: function (expr, precedence, flags) {
            var result, fragment;
            result = ['class'];
            if (expr.id) {
                result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
            }
            if (expr.superClass) {
                fragment = join('extends', this.generateExpression(expr.superClass, Precedence.Assignment, E_TTT));
                result = join(result, fragment);
            }
            result.push(space);
            result.push(this.generateStatement(expr.body, S_TFFT));
            return result;
        },

        MethodDefinition: function (expr, precedence, flags) {
            var result, fragment;
            if (expr['static']) {
                result = ['static' + space];
            } else {
                result = [];
            }
            if (expr.kind === 'get' || expr.kind === 'set') {
                fragment = [
                    join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
                    this.generateFunctionBody(expr.value)
                ];
            } else {
                fragment = [
                    generateMethodPrefix(expr),
                    this.generatePropertyKey(expr.key, expr.computed),
                    this.generateFunctionBody(expr.value)
                ];
            }
            return join(result, fragment);
        },

        Property: function (expr, precedence, flags) {
            if (expr.kind === 'get' || expr.kind === 'set') {
                return [
                    expr.kind, noEmptySpace(),
                    this.generatePropertyKey(expr.key, expr.computed),
                    this.generateFunctionBody(expr.value)
                ];
            }

            if (expr.shorthand) {
                if (expr.value.type === "AssignmentPattern") {
                    return this.AssignmentPattern(expr.value, Precedence.Sequence, E_TTT);
                }
                return this.generatePropertyKey(expr.key, expr.computed);
            }

            if (expr.method) {
                return [
                    generateMethodPrefix(expr),
                    this.generatePropertyKey(expr.key, expr.computed),
                    this.generateFunctionBody(expr.value)
                ];
            }

            return [
                this.generatePropertyKey(expr.key, expr.computed),
                ':' + space,
                this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
            ];
        },

        ObjectExpression: function (expr, precedence, flags) {
            var multiline, result, fragment, that = this;

            if (!expr.properties.length) {
                return '{}';
            }
            multiline = expr.properties.length > 1;

            withIndent(function () {
                fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
            });

            if (!multiline) {
                // issues 4
                // Do not transform from
                //   dejavu.Class.declare({
                //       method2: function () {}
                //   });
                // to
                //   dejavu.Class.declare({method2: function () {
                //       }});
                if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                    return [ '{', space, fragment, space, '}' ];
                }
            }

            withIndent(function (indent) {
                var i, iz;
                result = [ '{', newline, indent, fragment ];

                if (multiline) {
                    result.push(',' + newline);
                    for (i = 1, iz = expr.properties.length; i < iz; ++i) {
                        result.push(indent);
                        result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
                        if (i + 1 < iz) {
                            result.push(',' + newline);
                        }
                    }
                }
            });

            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(base);
            result.push('}');
            return result;
        },

        AssignmentPattern: function(expr, precedence, flags) {
            return this.generateAssignment(expr.left, expr.right, '=', precedence, flags);
        },

        ObjectPattern: function (expr, precedence, flags) {
            var result, i, iz, multiline, property, that = this;
            if (!expr.properties.length) {
                return '{}';
            }

            multiline = false;
            if (expr.properties.length === 1) {
                property = expr.properties[0];
                if (property.value.type !== Syntax.Identifier) {
                    multiline = true;
                }
            } else {
                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                    property = expr.properties[i];
                    if (!property.shorthand) {
                        multiline = true;
                        break;
                    }
                }
            }
            result = ['{', multiline ? newline : '' ];

            withIndent(function (indent) {
                var i, iz;
                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                    result.push(multiline ? indent : '');
                    result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
                    if (i + 1 < iz) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });

            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '');
            result.push('}');
            return result;
        },

        ThisExpression: function (expr, precedence, flags) {
            return 'this';
        },

        Super: function (expr, precedence, flags) {
            return 'super';
        },

        Identifier: function (expr, precedence, flags) {
            return generateIdentifier(expr);
        },

        ImportDefaultSpecifier: function (expr, precedence, flags) {
            return generateIdentifier(expr.id || expr.local);
        },

        ImportNamespaceSpecifier: function (expr, precedence, flags) {
            var result = ['*'];
            var id = expr.id || expr.local;
            if (id) {
                result.push(space + 'as' + noEmptySpace() + generateIdentifier(id));
            }
            return result;
        },

        ImportSpecifier: function (expr, precedence, flags) {
            var imported = expr.imported;
            var result = [ imported.name ];
            var local = expr.local;
            if (local && local.name !== imported.name) {
                result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(local));
            }
            return result;
        },

        ExportSpecifier: function (expr, precedence, flags) {
            var local = expr.local;
            var result = [ local.name ];
            var exported = expr.exported;
            if (exported && exported.name !== local.name) {
                result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(exported));
            }
            return result;
        },

        Literal: function (expr, precedence, flags) {
            var raw;
            if (expr.hasOwnProperty('raw') && parse && extra.raw) {
                try {
                    raw = parse(expr.raw).body[0].expression;
                    if (raw.type === Syntax.Literal) {
                        if (raw.value === expr.value) {
                            return expr.raw;
                        }
                    }
                } catch (e) {
                    // not use raw property
                }
            }

            if (expr.value === null) {
                return 'null';
            }

            if (typeof expr.value === 'string') {
                return escapeString(expr.value);
            }

            if (typeof expr.value === 'number') {
                return generateNumber(expr.value);
            }

            if (typeof expr.value === 'boolean') {
                return expr.value ? 'true' : 'false';
            }

            if (expr.regex) {
              return '/' + expr.regex.pattern + '/' + expr.regex.flags;
            }
            return generateRegExp(expr.value);
        },

        GeneratorExpression: function (expr, precedence, flags) {
            return this.ComprehensionExpression(expr, precedence, flags);
        },

        ComprehensionExpression: function (expr, precedence, flags) {
            // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
            // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6

            var result, i, iz, fragment, that = this;
            result = (expr.type === Syntax.GeneratorExpression) ? ['('] : ['['];

            if (extra.moz.comprehensionExpressionStartsWithAssignment) {
                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
                result.push(fragment);
            }

            if (expr.blocks) {
                withIndent(function () {
                    for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
                        fragment = that.generateExpression(expr.blocks[i], Precedence.Sequence, E_TTT);
                        if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                            result = join(result, fragment);
                        } else {
                            result.push(fragment);
                        }
                    }
                });
            }

            if (expr.filter) {
                result = join(result, 'if' + space);
                fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
                result = join(result, [ '(', fragment, ')' ]);
            }

            if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);

                result = join(result, fragment);
            }

            result.push((expr.type === Syntax.GeneratorExpression) ? ')' : ']');
            return result;
        },

        ComprehensionBlock: function (expr, precedence, flags) {
            var fragment;
            if (expr.left.type === Syntax.VariableDeclaration) {
                fragment = [
                    expr.left.kind, noEmptySpace(),
                    this.generateStatement(expr.left.declarations[0], S_FFFF)
                ];
            } else {
                fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
            }

            fragment = join(fragment, expr.of ? 'of' : 'in');
            fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));

            return [ 'for' + space + '(', fragment, ')' ];
        },

        SpreadElement: function (expr, precedence, flags) {
            return [
                '...',
                this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
            ];
        },

        TaggedTemplateExpression: function (expr, precedence, flags) {
            var itemFlags = E_TTF;
            if (!(flags & F_ALLOW_CALL)) {
                itemFlags = E_TFF;
            }
            var result = [
                this.generateExpression(expr.tag, Precedence.Call, itemFlags),
                this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
            ];
            return parenthesize(result, Precedence.TaggedTemplate, precedence);
        },

        TemplateElement: function (expr, precedence, flags) {
            // Don't use "cooked". Since tagged template can use raw template
            // representation. So if we do so, it breaks the script semantics.
            return expr.value.raw;
        },

        TemplateLiteral: function (expr, precedence, flags) {
            var result, i, iz;
            result = [ '`' ];
            for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
                result.push(this.generateExpression(expr.quasis[i], Precedence.Primary, E_TTT));
                if (i + 1 < iz) {
                    result.push('${' + space);
                    result.push(this.generateExpression(expr.expressions[i], Precedence.Sequence, E_TTT));
                    result.push(space + '}');
                }
            }
            result.push('`');
            return result;
        },

        ModuleSpecifier: function (expr, precedence, flags) {
            return this.Literal(expr, precedence, flags);
        }

    };

    merge(CodeGenerator.prototype, CodeGenerator.Expression);

    CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
        var result, type;

        type = expr.type || Syntax.Property;

        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
            return generateVerbatim(expr, precedence);
        }

        result = this[type](expr, precedence, flags);


        if (extra.comment) {
            result = addComments(expr, result);
        }
        return toSourceNodeWhenNeeded(result, expr);
    };

    CodeGenerator.prototype.generateStatement = function (stmt, flags) {
        var result,
            fragment;

        result = this[stmt.type](stmt, flags);

        // Attach comments

        if (extra.comment) {
            result = addComments(stmt, result);
        }

        fragment = toSourceNodeWhenNeeded(result).toString();
        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
            result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
        }

        return toSourceNodeWhenNeeded(result, stmt);
    };

    function generateInternal(node) {
        var codegen;

        codegen = new CodeGenerator();
        if (isStatement(node)) {
            return codegen.generateStatement(node, S_TFFF);
        }

        if (isExpression(node)) {
            return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
        }

        throw new Error('Unknown node type: ' + node.type);
    }

    function generate(node, options) {
        var defaultOptions = getDefaultOptions(), result, pair;

        if (options != null) {
            // Obsolete options
            //
            //   `options.indent`
            //   `options.base`
            //
            // Instead of them, we can use `option.format.indent`.
            if (typeof options.indent === 'string') {
                defaultOptions.format.indent.style = options.indent;
            }
            if (typeof options.base === 'number') {
                defaultOptions.format.indent.base = options.base;
            }
            options = updateDeeply(defaultOptions, options);
            indent = options.format.indent.style;
            if (typeof options.base === 'string') {
                base = options.base;
            } else {
                base = stringRepeat(indent, options.format.indent.base);
            }
        } else {
            options = defaultOptions;
            indent = options.format.indent.style;
            base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
            newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        sourceCode = options.sourceCode;
        preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
        extra = options;

        if (sourceMap) {
            if (!exports.browser) {
                // We assume environment is node.js
                // And prevent from including source-map by browserify
                SourceNode = __webpack_require__(29).SourceNode;
            } else {
                SourceNode = global.sourceMap.SourceNode;
            }
        }

        result = generateInternal(node);

        if (!sourceMap) {
            pair = {code: result.toString(), map: null};
            return options.sourceMapWithCode ? pair : pair.code;
        }


        pair = result.toStringWithSourceMap({
            file: options.file,
            sourceRoot: options.sourceMapRoot
        });

        if (options.sourceContent) {
            pair.map.setSourceContent(options.sourceMap,
                                      options.sourceContent);
        }

        if (options.sourceMapWithCode) {
            return pair;
        }

        return pair.map.toString();
    }

    FORMAT_MINIFY = {
        indent: {
            style: '',
            base: 0
        },
        renumber: true,
        hexadecimal: true,
        quotes: 'auto',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
    };

    FORMAT_DEFAULTS = getDefaultOptions().format;

    exports.version = __webpack_require__(34).version;
    exports.generate = generate;
    exports.attachComments = estraverse.attachComments;
    exports.Precedence = updateDeeply({}, Precedence);
    exports.browser = false;
    exports.FORMAT_MINIFY = FORMAT_MINIFY;
    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
}());
/* vim: set sw=4 ts=4 et tw=80 : */

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(41)))

/***/ },
/* 23 */
/***/ function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ },
/* 24 */
/***/ function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ },
/* 26 */
/***/ function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(0);
var binarySearch = __webpack_require__(24);
var ArraySet = __webpack_require__(3).ArraySet;
var base64VLQ = __webpack_require__(4);
var quickSort = __webpack_require__(26).quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(5).SourceMapGenerator;
var util = __webpack_require__(0);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(5).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(27).SourceMapConsumer;
exports.SourceNode = __webpack_require__(28).SourceNode;


/***/ },
/* 30 */
/***/ function(module, exports) {

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    function isExpression(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'ArrayExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'FunctionExpression':
            case 'Identifier':
            case 'Literal':
            case 'LogicalExpression':
            case 'MemberExpression':
            case 'NewExpression':
            case 'ObjectExpression':
            case 'SequenceExpression':
            case 'ThisExpression':
            case 'UnaryExpression':
            case 'UpdateExpression':
                return true;
        }
        return false;
    }

    function isIterationStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'WhileStatement':
                return true;
        }
        return false;
    }

    function isStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'BlockStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
            case 'DebuggerStatement':
            case 'DoWhileStatement':
            case 'EmptyStatement':
            case 'ExpressionStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'IfStatement':
            case 'LabeledStatement':
            case 'ReturnStatement':
            case 'SwitchStatement':
            case 'ThrowStatement':
            case 'TryStatement':
            case 'VariableDeclaration':
            case 'WhileStatement':
            case 'WithStatement':
                return true;
        }
        return false;
    }

    function isSourceElement(node) {
      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
    }

    function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
            if (node.alternate != null) {
                return node.alternate;
            }
            return node.consequent;

        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
            return node.body;
        }
        return null;
    }

    function isProblematicIfStatement(node) {
        var current;

        if (node.type !== 'IfStatement') {
            return false;
        }
        if (node.alternate == null) {
            return false;
        }
        current = node.consequent;
        do {
            if (current.type === 'IfStatement') {
                if (current.alternate == null)  {
                    return true;
                }
            }
            current = trailingStatement(current);
        } while (current);

        return false;
    }

    module.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,

        trailingStatement: trailingStatement
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var code = __webpack_require__(7);

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
    }

    function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierNameES5(id) {
        var i, iz, ch;

        if (id.length === 0) { return false; }

        ch = id.charCodeAt(0);
        if (!code.isIdentifierStartES5(ch)) {
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code.isIdentifierPartES5(ch)) {
                return false;
            }
        }
        return true;
    }

    function decodeUtf16(lead, trail) {
        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
    }

    function isIdentifierNameES6(id) {
        var i, iz, ch, lowCh, check;

        if (id.length === 0) { return false; }

        check = code.isIdentifierStartES6;
        for (i = 0, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                ++i;
                if (i >= iz) { return false; }
                lowCh = id.charCodeAt(i);
                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                    return false;
                }
                ch = decodeUtf16(ch, lowCh);
            }
            if (!check(ch)) {
                return false;
            }
            check = code.isIdentifierPartES6;
        }
        return true;
    }

    function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
    }

    function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierNameES5: isIdentifierNameES5,
        isIdentifierNameES6: isIdentifierNameES6,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {
    'use strict';

    exports.ast = __webpack_require__(30);
    exports.code = __webpack_require__(7);
    exports.keyword = __webpack_require__(31);
}());
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "edca5d8b01f16f6ba3e98ada8aadc3af.png";

/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = {"_args":[["escodegen@1.11.1","/home/gogoprog/code/arcade/deps/jsgs"]],"_from":"escodegen@1.11.1","_id":"escodegen@1.11.1","_inBundle":false,"_integrity":"sha512-JwiqFD9KdGVVpeuRa68yU3zZnBEOcPs0nKW7wZzXky8Z7tffdYUHbe11bPCV5jYlK6DVdKLWLm0f5I/QlL0Kmw==","_location":"/escodegen","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"escodegen@1.11.1","name":"escodegen","escapedName":"escodegen","rawSpec":"1.11.1","saveSpec":null,"fetchSpec":"1.11.1"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/escodegen/-/escodegen-1.11.1.tgz","_spec":"1.11.1","_where":"/home/gogoprog/code/arcade/deps/jsgs","bin":{"esgenerate":"./bin/esgenerate.js","escodegen":"./bin/escodegen.js"},"bugs":{"url":"https://github.com/estools/escodegen/issues"},"dependencies":{"esprima":"^3.1.3","estraverse":"^4.2.0","esutils":"^2.0.2","optionator":"^0.8.1","source-map":"~0.6.1"},"description":"ECMAScript code generator","devDependencies":{"acorn":"^4.0.4","bluebird":"^3.4.7","bower-registry-client":"^1.0.0","chai":"^3.5.0","commonjs-everywhere":"^0.9.7","gulp":"^3.8.10","gulp-eslint":"^3.0.1","gulp-mocha":"^3.0.1","semver":"^5.1.0"},"engines":{"node":">=4.0"},"files":["LICENSE.BSD","README.md","bin","escodegen.js","package.json"],"homepage":"http://github.com/estools/escodegen","license":"BSD-2-Clause","main":"escodegen.js","maintainers":[{"name":"Yusuke Suzuki","email":"utatane.tea@gmail.com","url":"http://github.com/Constellation"}],"name":"escodegen","optionalDependencies":{"source-map":"~0.6.1"},"repository":{"type":"git","url":"git+ssh://git@github.com/estools/escodegen.git"},"scripts":{"build":"cjsify -a path: tools/entry-point.js > escodegen.browser.js","build-min":"cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js","lint":"gulp lint","release":"node tools/release.js","test":"gulp travis","unit-test":"gulp test"},"version":"1.11.1"}

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = {"_args":[["estraverse@4.2.0","/home/gogoprog/code/arcade/deps/jsgs"]],"_from":"estraverse@4.2.0","_id":"estraverse@4.2.0","_inBundle":false,"_integrity":"sha1-De4/7TH81GlhjOc0IJn8GvoL2xM=","_location":"/estraverse","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"estraverse@4.2.0","name":"estraverse","escapedName":"estraverse","rawSpec":"4.2.0","saveSpec":null,"fetchSpec":"4.2.0"},"_requiredBy":["/","/escodegen"],"_resolved":"https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz","_spec":"4.2.0","_where":"/home/gogoprog/code/arcade/deps/jsgs","bugs":{"url":"https://github.com/estools/estraverse/issues"},"description":"ECMAScript JS AST traversal functions","devDependencies":{"babel-preset-es2015":"^6.3.13","babel-register":"^6.3.13","chai":"^2.1.1","espree":"^1.11.0","gulp":"^3.8.10","gulp-bump":"^0.2.2","gulp-filter":"^2.0.0","gulp-git":"^1.0.1","gulp-tag-version":"^1.2.1","jshint":"^2.5.6","mocha":"^2.1.0"},"engines":{"node":">=0.10.0"},"homepage":"https://github.com/estools/estraverse","license":"BSD-2-Clause","main":"estraverse.js","maintainers":[{"name":"Yusuke Suzuki","email":"utatane.tea@gmail.com","url":"http://github.com/Constellation"}],"name":"estraverse","repository":{"type":"git","url":"git+ssh://git@github.com/estools/estraverse.git"},"scripts":{"lint":"jshint estraverse.js","test":"npm run-script lint && npm run-script unit-test","unit-test":"mocha --compilers js:babel-register"},"version":"4.2.0"}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {


var parser = __webpack_require__(37);
var stdlib = __webpack_require__(38);

this.stdlib = stdlib;
this.parse = parser.parser.parse;




/***/ },
/* 37 */
/***/ function(module, exports) {

this.parser = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = function() { init(); return true; },
        peg$c2 = void 0,
        peg$c3 = null,
        peg$c4 = "#",
        peg$c5 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c6 = [],
        peg$c7 = /^[^\n]/,
        peg$c8 = { type: "class", value: "[^\\n]", description: "[^\\n]" },
        peg$c9 = "\n",
        peg$c10 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c11 = function(t) { return finalize(t); },
        peg$c12 = /^[ \r\t\n]/,
        peg$c13 = { type: "class", value: "[ \\r\\t\\n]", description: "[ \\r\\t\\n]" },
        peg$c14 = "--[",
        peg$c15 = { type: "literal", value: "--[", description: "\"--[\"" },
        peg$c16 = "]",
        peg$c17 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c18 = "--",
        peg$c19 = { type: "literal", value: "--", description: "\"--\"" },
        peg$c20 = { type: "any", description: "any character" },
        peg$c21 = ";",
        peg$c22 = { type: "literal", value: ";", description: "\";\"" },
        peg$c23 = function(r) {
                return builder.blockStatement([r]) 
            },
        peg$c24 = function(list, ret) {
                list = expandMultiStatements(list);
                return builder.blockStatement(ret === null ? list : list.concat([ret[1]])); 
            },
        peg$c25 = function(a, b) {  
                if ( a === null ) return [];
                if ( b === null ) return a;
                return listHelper(a,b,1);
            },
        peg$c26 = "if",
        peg$c27 = { type: "literal", value: "if", description: "\"if\"" },
        peg$c28 = "then",
        peg$c29 = { type: "literal", value: "then", description: "\"then\"" },
        peg$c30 = "elseif",
        peg$c31 = { type: "literal", value: "elseif", description: "\"elseif\"" },
        peg$c32 = "else",
        peg$c33 = { type: "literal", value: "else", description: "\"else\"" },
        peg$c34 = "do",
        peg$c35 = { type: "literal", value: "do", description: "\"do\"" },
        peg$c36 = "end",
        peg$c37 = { type: "literal", value: "end", description: "\"end\"" },
        peg$c38 = "return",
        peg$c39 = { type: "literal", value: "return", description: "\"return\"" },
        peg$c40 = "local",
        peg$c41 = { type: "literal", value: "local", description: "\"local\"" },
        peg$c42 = "nil",
        peg$c43 = { type: "literal", value: "nil", description: "\"nil\"" },
        peg$c44 = "true",
        peg$c45 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c46 = "false",
        peg$c47 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c48 = "function",
        peg$c49 = { type: "literal", value: "function", description: "\"function\"" },
        peg$c50 = "not",
        peg$c51 = { type: "literal", value: "not", description: "\"not\"" },
        peg$c52 = "break",
        peg$c53 = { type: "literal", value: "break", description: "\"break\"" },
        peg$c54 = "for",
        peg$c55 = { type: "literal", value: "for", description: "\"for\"" },
        peg$c56 = "until",
        peg$c57 = { type: "literal", value: "until", description: "\"until\"" },
        peg$c58 = "while",
        peg$c59 = { type: "literal", value: "while", description: "\"while\"" },
        peg$c60 = /^[a-zA-Z_]/,
        peg$c61 = { type: "class", value: "[a-zA-Z_]", description: "[a-zA-Z_]" },
        peg$c62 = /^[a-zA-Z0-9_]/,
        peg$c63 = { type: "class", value: "[a-zA-Z0-9_]", description: "[a-zA-Z0-9_]" },
        peg$c64 = function(a) { return a; },
        peg$c65 = /^[0-9]/,
        peg$c66 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c67 = ".",
        peg$c68 = { type: "literal", value: ".", description: "\".\"" },
        peg$c69 = "\\",
        peg$c70 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c71 = /^[abfrntv'"\\]/,
        peg$c72 = { type: "class", value: "[abfrntv'\"\\\\]", description: "[abfrntv'\"\\\\]" },
        peg$c73 = function(c) { return {
                "n": "\n",
                "b": "\b",
                "f": "\f",
                "r": "\r",
                "t": "\t",
                "v": "\v",
                '"': '"',
                "'": "'",
                "\\": "\\"
            }[c] },
        peg$c74 = "\\\n",
        peg$c75 = { type: "literal", value: "\\\n", description: "\"\\\\\\n\"" },
        peg$c76 = function() { return "\n" },
        peg$c77 = "\\z",
        peg$c78 = { type: "literal", value: "\\z", description: "\"\\\\z\"" },
        peg$c79 = function() { return "" },
        peg$c80 = "\\x",
        peg$c81 = { type: "literal", value: "\\x", description: "\"\\\\x\"" },
        peg$c82 = /^[0-9a-f]/,
        peg$c83 = { type: "class", value: "[0-9a-f]", description: "[0-9a-f]" },
        peg$c84 = function(a, b) { return String.fromCharCode(parseInt('0x' + a + b)); },
        peg$c85 = function(a, b, c) { return String.fromCharCode(parseInt('' + a + b + c)); },
        peg$c86 = function() { error('Invalid Escape Sequence') },
        peg$c87 = /^[^'"']/,
        peg$c88 = { type: "class", value: "[^'\"']", description: "[^'\"']" },
        peg$c89 = /^[']/,
        peg$c90 = { type: "class", value: "[']", description: "[']" },
        peg$c91 = function() { return wrapNode({}); },
        peg$c92 = /^["]/,
        peg$c93 = { type: "class", value: "[\"]", description: "[\"]" },
        peg$c94 = "'",
        peg$c95 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c96 = function(s, r, e) { return eUntermIfEmpty(e,"string","\"",s); },
        peg$c97 = function(s, r, e) { return r.join(''); },
        peg$c98 = "\"",
        peg$c99 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c100 = function(s, r, e) { return eUntermIfEmpty(e,"string","'",s); },
        peg$c101 = "[",
        peg$c102 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c103 = function(s) { return s; },
        peg$c104 = "=",
        peg$c105 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c106 = /^[\n]/,
        peg$c107 = { type: "class", value: "[\\n]", description: "[\\n]" },
        peg$c108 = function(a) { return a;},
        peg$c109 = function(e) { return eMsg("Found an expression but expected a statement: " + e)},
        peg$c110 = function(e) { return builder.emptyStatement(); },
        peg$c111 = function(e) { return eMsg("`=` expected")},
        peg$c112 = /^[^\n\t\r ]/,
        peg$c113 = { type: "class", value: "[^\\n\\t\\r ]", description: "[^\\n\\t\\r ]" },
        peg$c114 = function(e) { return eMsg("Parser error near `" + e + "`"); },
        peg$c115 = "debugger",
        peg$c116 = { type: "literal", value: "debugger", description: "\"debugger\"" },
        peg$c117 = function() { return {type: "ExpressionStatement", expression: {type: "Identifier", name:"debugger; "} } },
        peg$c118 = function(start, b, end) { return eUntermIfEmpty(end, "do", "end", start); },
        peg$c119 = function(start, b, end) { return b ? b[0] : {type: "BlockStatement", body: []}; },
        peg$c120 = ",",
        peg$c121 = { type: "literal", value: ",", description: "\",\"" },
        peg$c122 = function(start, a, b, c, d, body, end) { return eUntermIfEmpty(end, "for", "end", start); },
        peg$c123 = function(start, a, b, c, d, body, end) {
                var amount = d == null ? {type: "Literal", value: 1 } : d[3];
                

                var start = bhelper.tempVar(b);
                var updateBy = bhelper.tempVar(amount);
                var testValue = bhelper.tempVar(c);
                var idx = bhelper.tempVar();

                var update = builder.assignmentExpression("=", idx.id, bhelper.binaryExpression("+", idx.id, updateBy.id));

                var texp;
                if ( false ) {
                    texp = bhelper.binaryExpression("<=", idx.id, testValue.id)
                } else {
                    texp = bhelper.luaOperator("forcomp", updateBy.id, idx.id, testValue.id);
                }

                if ( !body ) body = {type: "BlockStatement", body: []};
                else body = body[0];

                body.body.unshift(builder.variableDeclaration("let",[
                    {
                            type: "VariableDeclarator",
                            id: a,
                            init: idx.id,
                            userCode: false
                    }
                ]));

                var out = {
                    type: "ForStatement",
                    init: builder.variableDeclaration("let", [
                        {
                            type: "VariableDeclarator",
                            id: idx.id,
                            init: start.id,
                            userCode: false
                        }
                    ]),
                    body: body,
                    update: update,
                    test: texp,
                    loc: loc(),
                    range: range()
                };

                return bhelper.encloseDecls([out], start, updateBy, testValue);
            },
        peg$c124 = "in",
        peg$c125 = { type: "literal", value: "in", description: "\"in\"" },
        peg$c126 = function(start, a, b, c, end) { return eUntermIfEmpty(end, "for", "end", start); },
        peg$c127 = function(start, a, b, c, end) {
                var statements = [];
                var nil = {type: "Literal", value: null };
                var uf = {type: "Identifier", name: 'undefined' };


                var iterator = bhelper.tempName();
                var context = bhelper.tempName();
                var curent = bhelper.tempName();

                var v1 = a[0];

                var varlist = [];
                for ( var idx in a ) {
                    varlist.push({type: "VariableDeclarator", id: a[idx] });
                }

                var call = builder.callExpression(iterator,[context, curent]);
                var assign;
                //if ( a.length > 1 ) {
                    assign = bhelper.bulkAssign(a, [call])
                //} else {
                //    assign = bhelper.assign(v1, call);
                //}

                var nullish = function(v) {
                    return builder.binaryExpression("||", builder.binaryExpression("===", v1, nil), builder.binaryExpression("===", v1, uf))
                }

                statements.push(builder.variableDeclaration("let", varlist));
                statements.push({
                    type: "WhileStatement",
                    test: {type: "Literal", value: true},
                    body: bhelper.blockStatement([
                    assign,
                    { type: "IfStatement", test: nullish(v1), consequent: {type: "BreakStatement" } },
                    bhelper.assign(curent, v1),
                    c.body

                    ])
                });

                return bhelper.encloseDeclsUnpack(statements, [iterator, context, curent], b);
            },
        peg$c128 = function(left, right) { 
                var result = builder.variableDeclaration("let", []);

                if ( !opt('decorateLuaObjects', false) || ( left.length < 2 && right.length < 2 )) { 
                    for ( var i = 0; i < left.length; ++i ) {
                        result.declarations.push(            {
                            type: "VariableDeclarator",
                            id: left[i],
                            init: right[i],
                        });
                    }

                    return result;
                } else {
                    var assign = bhelper.bulkAssign(left, right)
                    for ( var i = 0; i < left.length; ++i ) {
                        result.declarations.push({
                            type: "VariableDeclarator",
                            id: left[i]
                        });
                    }
                 
                    return [result, assign];   
                }
            
            },
        peg$c129 = function(left) {
                var result = builder.variableDeclaration("let", []);
                for ( var i = 0; i < left.length; ++i ) {
                    result.declarations.push({
                        type: "VariableDeclarator",
                        id: left[i]
                    });
                }
                return result;  
            },
        peg$c130 = function(left, right) { 
                // if ( left.length < 2 ) return bhelper.assign(left[0], right[0]).expression;
                return bhelper.bulkAssign(left, right).expression;
            },
        peg$c131 = function() { return {
                "type": "BreakStatement",
                loc: loc(),
                range: range()
            } },
        peg$c132 = function(e) { return {
                type: "ExpressionStatement",
                expression: e,
                loc: loc(),
                range: range()
            } },
        peg$c133 = function(test, then) { return wrapNode({test: test, then:then}); },
        peg$c134 = function() { return eUnterminated("if","then"); },
        peg$c135 = function(start, test, then, elzeifs, elze, end) { return eUntermIfEmpty(end, "if", "end", start); },
        peg$c136 = function(start, test, then, elzeifs, elze, end) {
                var result = { type: "IfStatement", test: test, consequent: then, loc: loc(), range: range()}
                var last = result;

                for ( var idx in elzeifs ) {
                    var elif = elzeifs[idx][1];
                    var nue = { type: "IfStatement", test: elif.test, consequent: elif.then, loc: elif.loc, range: elif.range }
                    last.alternate = nue;
                    last = nue;
                }

                if ( elze !== null ) last.alternate = elze[3];
                return result;
            },
        peg$c137 = function(argument) { 
                var arg;


                if ( argument == null ) { }
                else if ( argument.length == 1 ) arg = argument[0];
                else if ( argument.length > 1 ) {
                    if ( opt('decorateLuaObjects', false) ) arg = bhelper.luaOperatorA("makeMultiReturn", argument);
                    else  arg = {
                        type: "ArrayExpression",
                        elements: argument
                    };            
                }
                return {
                    type: "ReturnStatement",
                    argument: arg,
                    loc: loc(),
                    range: range()
                }
            },
        peg$c138 = function() {
                return {
                    type: "ReturnStatement",
                    loc: loc(),
                }     
            },
        peg$c139 = function() { return eUnterminated("if"); },
        peg$c140 = function(test, body) { return {
                type: "WhileStatement",
                test: test,
                body: body ? body[0] : {type: "EmptyStatement"},
                loc: loc(),
                range: range()

            } },
        peg$c141 = "repeat",
        peg$c142 = { type: "literal", value: "repeat", description: "\"repeat\"" },
        peg$c143 = function() { return eUnterminated("repeat", "until"); },
        peg$c144 = function() {return eMsg("repeat until needs terminations criteria"); },
        peg$c145 = function(body, test) { return {
                type: "DoWhileStatement",
                test: { 
                    type: "UnaryExpression",
                    operator: "!",
                    argument: test,
                    prefix: true,
                    loc: test.loc,
                    range: test.range
                },
                body: body ? body[0] : {type: "EmptyStatement"},
                loc: loc(),
                range: range()
            } },
        peg$c146 = "that",
        peg$c147 = { type: "literal", value: "that", description: "\"that\"" },
        peg$c148 = function() { return { "type": "ThisExpression" }; },
        peg$c149 = function(a, b) {
                a = bhelper.translateExpressionIfNeeded(a);
                if ( b === null ) return a;
                var tokens = [];
                for ( var idx in b ) {
                    var v = b[idx];
                    tokens.push(v[1]);
                    tokens.push(bhelper.translateExpressionIfNeeded(v[3]));
                }

                return precedenceClimber(tokens, a, 1);
            },
        peg$c150 = "-",
        peg$c151 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c152 = "+",
        peg$c153 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c154 = "==",
        peg$c155 = { type: "literal", value: "==", description: "\"==\"" },
        peg$c156 = ">=",
        peg$c157 = { type: "literal", value: ">=", description: "\">=\"" },
        peg$c158 = "<=",
        peg$c159 = { type: "literal", value: "<=", description: "\"<=\"" },
        peg$c160 = "~=",
        peg$c161 = { type: "literal", value: "~=", description: "\"~=\"" },
        peg$c162 = ">",
        peg$c163 = { type: "literal", value: ">", description: "\">\"" },
        peg$c164 = "<",
        peg$c165 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c166 = "..",
        peg$c167 = { type: "literal", value: "..", description: "\"..\"" },
        peg$c168 = "and",
        peg$c169 = { type: "literal", value: "and", description: "\"and\"" },
        peg$c170 = "or",
        peg$c171 = { type: "literal", value: "or", description: "\"or\"" },
        peg$c172 = "*",
        peg$c173 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c174 = "//",
        peg$c175 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c176 = "/",
        peg$c177 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c178 = "%",
        peg$c179 = { type: "literal", value: "%", description: "\"%\"" },
        peg$c180 = "^",
        peg$c181 = { type: "literal", value: "^", description: "\"^\"" },
        peg$c182 = "(",
        peg$c183 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c184 = ")",
        peg$c185 = { type: "literal", value: ")", description: "\")\"" },
        peg$c186 = function(e) { return e; },
        peg$c187 = ":",
        peg$c188 = { type: "literal", value: ":", description: "\":\"" },
        peg$c189 = function(who, a) {
                var left = who
                for ( var idx = 0; idx < a.length; ++idx ) {
                    var v = a[idx];
                    if ( v[1] != null ) {
                        left = builder.memberExpression(left, v[1][1], false);
                        left.selfSuggar = true;
                    }
                    left = bhelper.callExpression(left,v[2]);
                }
                return left;
            },
        peg$c190 = function(b) { return [b]; },
        peg$c191 = function(c) { return [{type: "Literal", value: c, loc: loc(), range: range()}]; },
        peg$c192 = function(a) {

            // Wraping a call in ()'s reduces it to a singel value
            if ( a.type == "CallExpression" ) {
                return bhelper.luaOperator("oneValue", a);
            } else if ( a.type == "Identifier" && a.name == "__lua$rest" ) {
                return bhelper.luaOperator("oneValue", a);
            }
            return a;
        },
        peg$c193 = "...",
        peg$c194 = { type: "literal", value: "...", description: "\"...\"" },
        peg$c195 = function() {
                return wrapNode({type: "Identifier", name: "__lua$rest"});
            },
        peg$c196 = function(a, b) {
                var selfSuggar = false;
                if ( b.length == 0 ) return a;
                var left = a;
                for ( var i in b ) {
                    left = builder.memberExpression(left, b[i].exp, b[i].computed);
                    if ( b[i].suggar ) left.selfSuggar = true;
                }

                return left;
            },
        peg$c197 = /^[.:]/,
        peg$c198 = { type: "class", value: "[.:]", description: "[.:]" },
        peg$c199 = function(p, e) {
                return {exp: e, suggar: p == ':', computed: false }
            },
        peg$c200 = function(e) {
                return {exp: e, suggar: false, computed: true }
            },
        peg$c201 = function() { return eMsg("Malformed argument list."); },
        peg$c202 = function(a, b) {
                 return listHelper(a,b,3); 
            },
        peg$c203 = function(a, b) {
             return listHelper(a,b,3); 
        },
        peg$c204 = function() {return eUnterminated(")", "argument list"); },
        peg$c205 = function(a) {
                 return a; 
            },
        peg$c206 = function() {
                return []
            },
        peg$c207 = function(a, b, c) { 
                var left = builder.memberExpression(a, b[0], b[1]);
                for ( var idx in c ) {
                    left = builder.memberExpression(left, c[idx][0], c[idx][1]);
                }
                return left;
            },
        peg$c208 = function(b) { return [b, true]; },
        peg$c209 = function(b) { return [b,false]; },
        peg$c210 = "{",
        peg$c211 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c212 = "}",
        peg$c213 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c214 = function(f, s) { 
                var result = {
                    type: "ObjectExpression",
                    properties: [],
                    loc: loc(),
                    range: range()
                };

                var props = listHelper(f,s,3);
                var numeric = 0;
                var longProps = [];
                for ( var idx in props ) {
                    var p = props[idx];

                    if ( p.key === undefined ) p.key = {type: "Literal", value: ++numeric, arrayLike: true};
                    p.kind = "init";
                    result.properties.push(p);
                }


                if ( opt('decorateLuaObjects', false) ) {
                    var last;
                    var args = [];
                    var pp = [];
                    var last = true;
                    for ( var idx in result.properties ) {
                        var p = result.properties[idx];
                        if ( p.key.arrayLike ) {
                            args.push(p.value);
                            last = true;
                        } else {
                            longProps.push({
                                type: "ArrayExpression",
                                elements: [p.key, p.value]
                            });
                            pp.push(p);
                            last = false;
                        }
                    }
                    result.properties = pp;

                    result = {type: "ArrayExpression", elements: longProps };
                    if (pp.length < 1 ) result = {type:"Literal", value: null};

                    return bhelper.luaOperator.apply(bhelper, ["makeTable", result, {type: "Literal", value:last}].concat(args)); 
                }
                else return result;
            },
        peg$c215 = function(n, v) {
                if ( n.type == "Identifier" ) n = {type: "Literal", value: n.name};
                return { key: n, value: v };
            },
        peg$c216 = function(v) {
                return { value: v };
            },
        peg$c217 = function(k, v) {
                return { key: k, value: v }; 
            },
        peg$c218 = function(start, name, f, end) { return eUntermIfEmpty(end, "function", "end", start); },
        peg$c219 = function(start, name, f, end) {



                if ( name.type != "MemberExpression" && opt("allowRegularFunctions", false) ) {
                    //TODO: this would need to be decorated
                    return builder.functionDeclaration(name, f.params, f.body);
                }

                //TODO: Translate member expression into call
                var params = f.params.slice(0);
                if ( name.selfSuggar ) params = [{type: "Identifier", name: "self"}].concat(f.params);

                if ( f.rest ) {
                    bhelper.injectRest(f.body.body, params.length);
                }

                var out = builder.functionExpression(null, params, f.body)
                if ( opt('decorateLuaObjects', false) ) {
                    out = bhelper.luaOperator("makeFunction", out);
                }

                return bhelper.assign(name, out);
            },
        peg$c220 = function(start, name, f, end) {

                if ( f.rest ) {
                    bhelper.injectRest(f.body.body, f.params.length);
                }

                if ( opt("allowRegularFunctions", false) )
                    return builder.functionDeclaration(name, f.params, f.body);

                var func = builder.functionExpression(name, f.params, f.body);
                if ( opt('decorateLuaObjects', false) ) {
                    func = bhelper.luaOperator("makeFunction", func);
                }

                var decl = {type: "VariableDeclarator", id: name, init: func};
                var out = builder.variableDeclaration("let", [ decl ]);

                return out;
            },
        peg$c221 = function(f) {
                var result = {
                    type: "FunctionExpression",
                    body: f.body,
                    params: f.params,
                    loc:loc(),
                    range:range()
                }

                if ( f.rest ) {
                    bhelper.injectRest(f.body.body, f.params.length)
                }

                if ( opt('decorateLuaObjects', false) ) {
                    return bhelper.luaOperator("makeFunction", result);
                } else {
                    return result;
                }

            },
        peg$c222 = function(start, b, end) { return eUntermIfEmpty(end, "function", "end", start); },
        peg$c223 = function(start, b, end) { return b; },
        peg$c224 = function(p, rest, body) {
                return { params: p, body: body, rest: rest != null }
            },
        peg$c225 = function(body) {
                return { params: [], body: body, rest: true }
            },
        peg$c226 = function(a, b) {
                return listHelper(a,b); 
            },
        peg$c227 = function() { 
                return [] 
            },
        peg$c228 = function(o, e) { 
                var ops = {"not": "!", "-": "-", "#": "#" }
                if ( o == "#" ) {
                    e = bhelper.translateExpressionIfNeeded(e);
                    return bhelper.luaOperator("count", e);
                }
                return { 
                    type: "UnaryExpression",
                    operator: ops[o],
                    argument: bhelper.translateExpressionIfNeeded(e),
                    prefix: true,
                    loc: loc(),
                    range: range()
                }
            },
        peg$c229 = function(name) { return {
                type: "Identifier",
                name: name,
                loc: loc(),
                range: range()
            } },
        peg$c230 = function(a) {
                var values = {"nil": null, "false": false, "true": true} 
                return { type: "Literal", value: values[a], loc: loc(), range: range() }

            },
        peg$c231 = /^[eE]/,
        peg$c232 = { type: "class", value: "[eE]", description: "[eE]" },
        peg$c233 = function(b, c) {
                return { type: "Literal", value: parseFloat(b) * Math.pow(10, parseInt(c)), loc: loc(), range: range()  }

            },
        peg$c234 = "0",
        peg$c235 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c236 = /^[Xx]/,
        peg$c237 = { type: "class", value: "[Xx]", description: "[Xx]" },
        peg$c238 = /^[0-9a-fA-F]/,
        peg$c239 = { type: "class", value: "[0-9a-fA-F]", description: "[0-9a-fA-F]" },
        peg$c240 = function(b) {
                return { type: "Literal", value: parseInt(b), loc: loc(), range: range()  }

            },
        peg$c241 = function(b) {
                return { type: "Literal", value: parseFloat(b), loc: loc(), range: range()  }

            },
        peg$c242 = function(s) {
                return { type: "Literal", value: s, loc: loc(), range: range()  }

            },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      peg$reportedPos = peg$currPos;
      s1 = peg$c1();
      if (s1) {
        s1 = peg$c2;
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 35) {
          s3 = peg$c4;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c5); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c7.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c7.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 10) {
              s5 = peg$c9;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 === peg$FAILED) {
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseBlockStatement();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 === peg$FAILED) {
                s5 = peg$c3;
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c11(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1, s2, s3, s4, s5;

      s0 = [];
      if (peg$c12.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c14) {
          s2 = peg$c14;
          peg$currPos += 3;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsebalstringinsde();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c0;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
        if (s1 === peg$FAILED) {
          s1 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c18) {
            s2 = peg$c18;
            peg$currPos += 2;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c19); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = [];
            if (peg$c7.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c7.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            if (s3 === peg$FAILED) {
              s3 = [];
              if (input.length > peg$currPos) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c20); }
              }
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (input.length > peg$currPos) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c20); }
                }
              }
            }
            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c0;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c12.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
          }
          if (s1 === peg$FAILED) {
            s1 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c14) {
              s2 = peg$c14;
              peg$currPos += 3;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsebalstringinsde();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s4 = peg$c16;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c17); }
                }
                if (s4 !== peg$FAILED) {
                  s2 = [s2, s3, s4];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$c0;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c0;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c0;
            }
            if (s1 === peg$FAILED) {
              s1 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c18) {
                s2 = peg$c18;
                peg$currPos += 2;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                s4 = [];
                if (peg$c7.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c8); }
                }
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  if (peg$c7.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c8); }
                  }
                }
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 10) {
                    s5 = peg$c9;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s5 !== peg$FAILED) {
                    s4 = [s4, s5];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
                if (s3 === peg$FAILED) {
                  s3 = [];
                  if (input.length > peg$currPos) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c20); }
                  }
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    if (input.length > peg$currPos) {
                      s4 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c20); }
                    }
                  }
                }
                if (s3 !== peg$FAILED) {
                  s2 = [s2, s3];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$c0;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c0;
              }
            }
          }
        }
      } else {
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsescws() {
      var s0, s1, s2, s3, s4;

      s0 = [];
      s1 = peg$currPos;
      s2 = peg$parsews();
      if (s2 === peg$FAILED) {
        s2 = peg$c3;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s3 = peg$c21;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 === peg$FAILED) {
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$currPos;
          s2 = peg$parsews();
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 59) {
              s3 = peg$c21;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c22); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 === peg$FAILED) {
                s4 = peg$c3;
              }
              if (s4 !== peg$FAILED) {
                s2 = [s2, s3, s4];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$c0;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c0;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        }
      } else {
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsews();
      }

      return s0;
    }

    function peg$parseBlockStatement() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseReturnStatement();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c23(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseStatementList();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = peg$parsescws();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsescws();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseReturnStatement();
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c24(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseStatementList() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseStatement();
      if (s1 === peg$FAILED) {
        s1 = peg$c3;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = [];
        s5 = peg$parsescws();
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsescws();
          }
        } else {
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseStatement();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = [];
          s5 = peg$parsescws();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsescws();
            }
          } else {
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseStatement();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          s5 = peg$parsews();
          if (s5 === peg$FAILED) {
            s5 = peg$c3;
          }
          if (s5 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 59) {
              s6 = peg$c21;
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c22); }
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            s5 = peg$parsews();
            if (s5 === peg$FAILED) {
              s5 = peg$c3;
            }
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 59) {
                s6 = peg$c21;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c22); }
              }
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c25(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseReservedWord() {
      var s0, s1, s2;

      if (input.substr(peg$currPos, 2) === peg$c26) {
        s0 = peg$c26;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c28) {
          s0 = peg$c28;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c29); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c30) {
            s0 = peg$c30;
            peg$currPos += 6;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c31); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c32) {
              s0 = peg$c32;
              peg$currPos += 4;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c33); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c34) {
                s0 = peg$c34;
                peg$currPos += 2;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c35); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c36) {
                  s0 = peg$c36;
                  peg$currPos += 3;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c37); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c38) {
                    s0 = peg$c38;
                    peg$currPos += 6;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c39); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c40) {
                      s0 = peg$c40;
                      peg$currPos += 5;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c41); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 3) === peg$c42) {
                        s0 = peg$c42;
                        peg$currPos += 3;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c44) {
                          s0 = peg$c44;
                          peg$currPos += 4;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c45); }
                        }
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.substr(peg$currPos, 5) === peg$c46) {
                            s1 = peg$c46;
                            peg$currPos += 5;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c47); }
                          }
                          if (s1 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 8) === peg$c48) {
                              s2 = peg$c48;
                              peg$currPos += 8;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c49); }
                            }
                            if (s2 !== peg$FAILED) {
                              s1 = [s1, s2];
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c50) {
                              s0 = peg$c50;
                              peg$currPos += 3;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c51); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 5) === peg$c52) {
                                s0 = peg$c52;
                                peg$currPos += 5;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c53); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c54) {
                                  s0 = peg$c54;
                                  peg$currPos += 3;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c55); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 5) === peg$c56) {
                                    s0 = peg$c56;
                                    peg$currPos += 5;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c57); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 8) === peg$c48) {
                                      s0 = peg$c48;
                                      peg$currPos += 8;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c49); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 5) === peg$c58) {
                                        s0 = peg$c58;
                                        peg$currPos += 5;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c59); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$parsebinop();
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$parseunop();
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseName() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$currPos;
      s3 = peg$parseReservedWord();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c2;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
        }
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c0;
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c2;
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        if (peg$c60.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c61); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c62.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c63); }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c62.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        if (s3 !== peg$FAILED) {
          s3 = input.substring(s2, peg$currPos);
        }
        s2 = s3;
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c64(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseNumber() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      if (peg$c65.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c65.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
        }
      } else {
        s2 = peg$c0;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c67;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c68); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c65.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              if (peg$c65.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
            }
          } else {
            s5 = peg$c0;
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        if (s3 === peg$FAILED) {
          s3 = peg$c3;
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsestringchar() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c69;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c71.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c72); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c73(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c74) {
          s1 = peg$c74;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c75); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c76();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c77) {
            s1 = peg$c77;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c78); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsews();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c79();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c80) {
              s1 = peg$c80;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c81); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              if (peg$c82.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c83); }
              }
              if (s3 !== peg$FAILED) {
                s3 = input.substring(s2, peg$currPos);
              }
              s2 = s3;
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                if (peg$c82.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c83); }
                }
                if (s4 !== peg$FAILED) {
                  s4 = input.substring(s3, peg$currPos);
                }
                s3 = s4;
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c84(s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 92) {
                s1 = peg$c69;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                if (peg$c65.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c66); }
                }
                if (s3 !== peg$FAILED) {
                  s3 = input.substring(s2, peg$currPos);
                }
                s2 = s3;
                if (s2 !== peg$FAILED) {
                  s3 = peg$currPos;
                  if (peg$c65.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c66); }
                  }
                  if (s4 === peg$FAILED) {
                    s4 = peg$c3;
                  }
                  if (s4 !== peg$FAILED) {
                    s4 = input.substring(s3, peg$currPos);
                  }
                  s3 = s4;
                  if (s3 !== peg$FAILED) {
                    s4 = peg$currPos;
                    if (peg$c65.test(input.charAt(peg$currPos))) {
                      s5 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c66); }
                    }
                    if (s5 === peg$FAILED) {
                      s5 = peg$c3;
                    }
                    if (s5 !== peg$FAILED) {
                      s5 = input.substring(s4, peg$currPos);
                    }
                    s4 = s5;
                    if (s4 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c85(s2, s3, s4);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 92) {
                  s1 = peg$c69;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c70); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c86();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (peg$c87.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c88); }
                  }
                  if (s1 !== peg$FAILED) {
                    s1 = input.substring(s0, peg$currPos);
                  }
                  s0 = s1;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsesinglequote() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c89.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsedoublequote() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c92.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c93); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseString() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsedoublequote();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsestringchar();
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c94;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c95); }
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsestringchar();
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c94;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c95); }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsedoublequote();
          if (s3 === peg$FAILED) {
            s3 = [];
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = peg$currPos;
            s4 = peg$c96(s1, s2, s3);
            if (s4) {
              s4 = peg$c2;
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c97(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsesinglequote();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsestringchar();
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s3 = peg$c98;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c99); }
            }
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsestringchar();
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c98;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c99); }
              }
            }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsesinglequote();
            if (s3 === peg$FAILED) {
              s3 = [];
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = peg$currPos;
              s4 = peg$c100(s1, s2, s3);
              if (s4) {
                s4 = peg$c2;
              } else {
                s4 = peg$c0;
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c97(s1, s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c101;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c102); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsebalstringinsde();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c16;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c103(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parsebalstringinsde() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s1 = peg$c104;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c105); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsebalstringinsde();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c104;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c105); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c64(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c101;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c102); }
        }
        if (s1 !== peg$FAILED) {
          if (peg$c106.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c107); }
          }
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$currPos;
            s6 = peg$currPos;
            peg$silentFails++;
            s7 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 93) {
              s8 = peg$c16;
              peg$currPos++;
            } else {
              s8 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s8 !== peg$FAILED) {
              s9 = [];
              if (input.charCodeAt(peg$currPos) === 61) {
                s10 = peg$c104;
                peg$currPos++;
              } else {
                s10 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c105); }
              }
              while (s10 !== peg$FAILED) {
                s9.push(s10);
                if (input.charCodeAt(peg$currPos) === 61) {
                  s10 = peg$c104;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c105); }
                }
              }
              if (s9 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s10 = peg$c16;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c17); }
                }
                if (s10 !== peg$FAILED) {
                  s8 = [s8, s9, s10];
                  s7 = s8;
                } else {
                  peg$currPos = s7;
                  s7 = peg$c0;
                }
              } else {
                peg$currPos = s7;
                s7 = peg$c0;
              }
            } else {
              peg$currPos = s7;
              s7 = peg$c0;
            }
            peg$silentFails--;
            if (s7 === peg$FAILED) {
              s6 = peg$c2;
            } else {
              peg$currPos = s6;
              s6 = peg$c0;
            }
            if (s6 !== peg$FAILED) {
              if (input.length > peg$currPos) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c20); }
              }
              if (s7 !== peg$FAILED) {
                s6 = [s6, s7];
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$c0;
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$currPos;
              peg$silentFails++;
              s7 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 93) {
                s8 = peg$c16;
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s8 !== peg$FAILED) {
                s9 = [];
                if (input.charCodeAt(peg$currPos) === 61) {
                  s10 = peg$c104;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c105); }
                }
                while (s10 !== peg$FAILED) {
                  s9.push(s10);
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s10 = peg$c104;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c105); }
                  }
                }
                if (s9 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s10 = peg$c16;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c17); }
                  }
                  if (s10 !== peg$FAILED) {
                    s8 = [s8, s9, s10];
                    s7 = s8;
                  } else {
                    peg$currPos = s7;
                    s7 = peg$c0;
                  }
                } else {
                  peg$currPos = s7;
                  s7 = peg$c0;
                }
              } else {
                peg$currPos = s7;
                s7 = peg$c0;
              }
              peg$silentFails--;
              if (s7 === peg$FAILED) {
                s6 = peg$c2;
              } else {
                peg$currPos = s6;
                s6 = peg$c0;
              }
              if (s6 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c20); }
                }
                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            }
            if (s4 !== peg$FAILED) {
              s4 = input.substring(s3, peg$currPos);
            }
            s3 = s4;
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s4 = peg$c16;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c108(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseStatement() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parseDebugger();
      if (s0 === peg$FAILED) {
        s0 = peg$parseBreakStatement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseNumericFor();
          if (s0 === peg$FAILED) {
            s0 = peg$parseForEach();
            if (s0 === peg$FAILED) {
              s0 = peg$parseRepeatUntil();
              if (s0 === peg$FAILED) {
                s0 = peg$parseWhileStatement();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseIfStatement();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseExpressionStatement();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseDoEndGrouped();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseLocalAssingment();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseFunctionDeclaration();
                          if (s0 === peg$FAILED) {
                            s0 = peg$parseLocalFunction();
                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;
                              s1 = peg$currPos;
                              peg$silentFails++;
                              s2 = peg$currPos;
                              s3 = peg$parsews();
                              if (s3 === peg$FAILED) {
                                s3 = peg$c3;
                              }
                              if (s3 !== peg$FAILED) {
                                s4 = peg$parseReservedWord();
                                if (s4 !== peg$FAILED) {
                                  s3 = [s3, s4];
                                  s2 = s3;
                                } else {
                                  peg$currPos = s2;
                                  s2 = peg$c0;
                                }
                              } else {
                                peg$currPos = s2;
                                s2 = peg$c0;
                              }
                              peg$silentFails--;
                              if (s2 === peg$FAILED) {
                                s1 = peg$c2;
                              } else {
                                peg$currPos = s1;
                                s1 = peg$c0;
                              }
                              if (s1 !== peg$FAILED) {
                                s2 = peg$currPos;
                                s3 = peg$parseExpression();
                                if (s3 !== peg$FAILED) {
                                  s3 = input.substring(s2, peg$currPos);
                                }
                                s2 = s3;
                                if (s2 !== peg$FAILED) {
                                  peg$reportedPos = peg$currPos;
                                  s3 = peg$c109(s2);
                                  if (s3) {
                                    s3 = peg$c2;
                                  } else {
                                    s3 = peg$c0;
                                  }
                                  if (s3 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c110(s2);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$currPos;
                                peg$silentFails++;
                                s2 = peg$currPos;
                                s3 = peg$parsews();
                                if (s3 === peg$FAILED) {
                                  s3 = peg$c3;
                                }
                                if (s3 !== peg$FAILED) {
                                  s4 = peg$parseReservedWord();
                                  if (s4 !== peg$FAILED) {
                                    s3 = [s3, s4];
                                    s2 = s3;
                                  } else {
                                    peg$currPos = s2;
                                    s2 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s2;
                                  s2 = peg$c0;
                                }
                                peg$silentFails--;
                                if (s2 === peg$FAILED) {
                                  s1 = peg$c2;
                                } else {
                                  peg$currPos = s1;
                                  s1 = peg$c0;
                                }
                                if (s1 !== peg$FAILED) {
                                  s2 = peg$currPos;
                                  s3 = peg$parseIdentifier();
                                  if (s3 !== peg$FAILED) {
                                    s3 = input.substring(s2, peg$currPos);
                                  }
                                  s2 = s3;
                                  if (s2 !== peg$FAILED) {
                                    peg$reportedPos = peg$currPos;
                                    s3 = peg$c111(s2);
                                    if (s3) {
                                      s3 = peg$c2;
                                    } else {
                                      s3 = peg$c0;
                                    }
                                    if (s3 !== peg$FAILED) {
                                      peg$reportedPos = s0;
                                      s1 = peg$c110(s2);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;
                                  s1 = peg$currPos;
                                  peg$silentFails++;
                                  s2 = peg$currPos;
                                  s3 = peg$parsews();
                                  if (s3 === peg$FAILED) {
                                    s3 = peg$c3;
                                  }
                                  if (s3 !== peg$FAILED) {
                                    s4 = peg$parseReservedWord();
                                    if (s4 !== peg$FAILED) {
                                      s3 = [s3, s4];
                                      s2 = s3;
                                    } else {
                                      peg$currPos = s2;
                                      s2 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s2;
                                    s2 = peg$c0;
                                  }
                                  peg$silentFails--;
                                  if (s2 === peg$FAILED) {
                                    s1 = peg$c2;
                                  } else {
                                    peg$currPos = s1;
                                    s1 = peg$c0;
                                  }
                                  if (s1 !== peg$FAILED) {
                                    s2 = peg$currPos;
                                    if (peg$c112.test(input.charAt(peg$currPos))) {
                                      s3 = input.charAt(peg$currPos);
                                      peg$currPos++;
                                    } else {
                                      s3 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c113); }
                                    }
                                    if (s3 !== peg$FAILED) {
                                      s3 = input.substring(s2, peg$currPos);
                                    }
                                    s2 = s3;
                                    if (s2 !== peg$FAILED) {
                                      s3 = [];
                                      if (peg$c7.test(input.charAt(peg$currPos))) {
                                        s4 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                      } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c8); }
                                      }
                                      while (s4 !== peg$FAILED) {
                                        s3.push(s4);
                                        if (peg$c7.test(input.charAt(peg$currPos))) {
                                          s4 = input.charAt(peg$currPos);
                                          peg$currPos++;
                                        } else {
                                          s4 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c8); }
                                        }
                                      }
                                      if (s3 !== peg$FAILED) {
                                        if (peg$c106.test(input.charAt(peg$currPos))) {
                                          s4 = input.charAt(peg$currPos);
                                          peg$currPos++;
                                        } else {
                                          s4 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c107); }
                                        }
                                        if (s4 === peg$FAILED) {
                                          s4 = peg$currPos;
                                          peg$silentFails++;
                                          if (input.length > peg$currPos) {
                                            s5 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                          } else {
                                            s5 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c20); }
                                          }
                                          peg$silentFails--;
                                          if (s5 === peg$FAILED) {
                                            s4 = peg$c2;
                                          } else {
                                            peg$currPos = s4;
                                            s4 = peg$c0;
                                          }
                                        }
                                        if (s4 !== peg$FAILED) {
                                          peg$reportedPos = peg$currPos;
                                          s5 = peg$c114(s2);
                                          if (s5) {
                                            s5 = peg$c2;
                                          } else {
                                            s5 = peg$c0;
                                          }
                                          if (s5 !== peg$FAILED) {
                                            peg$reportedPos = s0;
                                            s1 = peg$c110(s2);
                                            s0 = s1;
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$c0;
                                          }
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$c0;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$c0;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseDebugger() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c115) {
        s1 = peg$c115;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c116); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c117();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseDoEndGrouped() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsedo();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseBlockStatement();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c36) {
              s4 = peg$c36;
              peg$currPos += 3;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c37); }
            }
            if (s4 === peg$FAILED) {
              s4 = [];
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = peg$currPos;
              s5 = peg$c118(s1, s3, s4);
              if (s5) {
                s5 = peg$c2;
              } else {
                s5 = peg$c0;
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c119(s1, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseif() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c26) {
        s1 = peg$c26;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsedo() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c34) {
        s1 = peg$c34;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsefor() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c54) {
        s1 = peg$c54;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c55); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsefunction() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c48) {
        s1 = peg$c48;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseNumericFor() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18;

      s0 = peg$currPos;
      s1 = peg$parsefor();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c104;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c105); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 === peg$FAILED) {
                  s6 = peg$c3;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseExpression();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 === peg$FAILED) {
                      s8 = peg$c3;
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s9 = peg$c120;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c121); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 === peg$FAILED) {
                          s10 = peg$c3;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseExpression();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$currPos;
                            s13 = peg$parsews();
                            if (s13 === peg$FAILED) {
                              s13 = peg$c3;
                            }
                            if (s13 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 44) {
                                s14 = peg$c120;
                                peg$currPos++;
                              } else {
                                s14 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c121); }
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsews();
                                if (s15 === peg$FAILED) {
                                  s15 = peg$c3;
                                }
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parseExpression();
                                  if (s16 !== peg$FAILED) {
                                    s13 = [s13, s14, s15, s16];
                                    s12 = s13;
                                  } else {
                                    peg$currPos = s12;
                                    s12 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s12;
                                  s12 = peg$c0;
                                }
                              } else {
                                peg$currPos = s12;
                                s12 = peg$c0;
                              }
                            } else {
                              peg$currPos = s12;
                              s12 = peg$c0;
                            }
                            if (s12 === peg$FAILED) {
                              s12 = peg$c3;
                            }
                            if (s12 !== peg$FAILED) {
                              s13 = peg$parsews();
                              if (s13 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c34) {
                                  s14 = peg$c34;
                                  peg$currPos += 2;
                                } else {
                                  s14 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c35); }
                                }
                                if (s14 !== peg$FAILED) {
                                  s15 = peg$parsews();
                                  if (s15 !== peg$FAILED) {
                                    s16 = peg$currPos;
                                    s17 = peg$parseBlockStatement();
                                    if (s17 !== peg$FAILED) {
                                      s18 = peg$parsews();
                                      if (s18 !== peg$FAILED) {
                                        s17 = [s17, s18];
                                        s16 = s17;
                                      } else {
                                        peg$currPos = s16;
                                        s16 = peg$c0;
                                      }
                                    } else {
                                      peg$currPos = s16;
                                      s16 = peg$c0;
                                    }
                                    if (s16 === peg$FAILED) {
                                      s16 = peg$c3;
                                    }
                                    if (s16 !== peg$FAILED) {
                                      if (input.substr(peg$currPos, 3) === peg$c36) {
                                        s17 = peg$c36;
                                        peg$currPos += 3;
                                      } else {
                                        s17 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c37); }
                                      }
                                      if (s17 === peg$FAILED) {
                                        s17 = [];
                                      }
                                      if (s17 !== peg$FAILED) {
                                        peg$reportedPos = peg$currPos;
                                        s18 = peg$c122(s1, s3, s7, s11, s12, s16, s17);
                                        if (s18) {
                                          s18 = peg$c2;
                                        } else {
                                          s18 = peg$c0;
                                        }
                                        if (s18 !== peg$FAILED) {
                                          peg$reportedPos = s0;
                                          s1 = peg$c123(s1, s3, s7, s11, s12, s16, s17);
                                          s0 = s1;
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$c0;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$c0;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseForEach() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

      s0 = peg$currPos;
      s1 = peg$parsefor();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenamelist();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c124) {
                s5 = peg$c124;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c125); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseexplist();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 !== peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c34) {
                        s9 = peg$c34;
                        peg$currPos += 2;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c35); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 === peg$FAILED) {
                          s10 = peg$c3;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseBlockStatement();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parsews();
                            if (s12 === peg$FAILED) {
                              s12 = peg$c3;
                            }
                            if (s12 !== peg$FAILED) {
                              if (input.substr(peg$currPos, 3) === peg$c36) {
                                s13 = peg$c36;
                                peg$currPos += 3;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c37); }
                              }
                              if (s13 === peg$FAILED) {
                                s13 = [];
                              }
                              if (s13 !== peg$FAILED) {
                                peg$reportedPos = peg$currPos;
                                s14 = peg$c126(s1, s3, s7, s11, s13);
                                if (s14) {
                                  s14 = peg$c2;
                                } else {
                                  s14 = peg$c0;
                                }
                                if (s14 !== peg$FAILED) {
                                  peg$reportedPos = s0;
                                  s1 = peg$c127(s1, s3, s7, s11, s13);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLocalAssingment() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c40) {
        s1 = peg$c40;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenamelist();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c104;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c105); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 === peg$FAILED) {
                  s6 = peg$c3;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseexplist();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c128(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c40) {
          s1 = peg$c40;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            s3 = peg$parsenamelist();
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c129(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseAssignmentExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsevarlist();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c104;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c105); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseexplist();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c130(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseBreakStatement() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c52) {
        s1 = peg$c52;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c53); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c131();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseExpressionStatement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 === peg$FAILED) {
        s1 = peg$parseCallExpression();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c132(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseelseif() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c30) {
        s1 = peg$c30;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c31); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c28) {
                s5 = peg$c28;
                peg$currPos += 4;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c29); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseBlockStatement();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c133(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseIfStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

      s0 = peg$currPos;
      s1 = peg$parseif();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c28) {
                s5 = peg$c28;
                peg$currPos += 4;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c29); }
              }
              if (s5 === peg$FAILED) {
                peg$reportedPos = peg$currPos;
                s5 = peg$c134();
                if (s5) {
                  s5 = peg$c2;
                } else {
                  s5 = peg$c0;
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseBlockStatement();
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$currPos;
                    s10 = peg$parsews();
                    if (s10 === peg$FAILED) {
                      s10 = peg$c3;
                    }
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parseelseif();
                      if (s11 !== peg$FAILED) {
                        s10 = [s10, s11];
                        s9 = s10;
                      } else {
                        peg$currPos = s9;
                        s9 = peg$c0;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$c0;
                    }
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$currPos;
                      s10 = peg$parsews();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c3;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseelseif();
                        if (s11 !== peg$FAILED) {
                          s10 = [s10, s11];
                          s9 = s10;
                        } else {
                          peg$currPos = s9;
                          s9 = peg$c0;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$c0;
                      }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$currPos;
                      s10 = peg$parsews();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c3;
                      }
                      if (s10 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c32) {
                          s11 = peg$c32;
                          peg$currPos += 4;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c33); }
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsews();
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parseBlockStatement();
                            if (s13 !== peg$FAILED) {
                              s10 = [s10, s11, s12, s13];
                              s9 = s10;
                            } else {
                              peg$currPos = s9;
                              s9 = peg$c0;
                            }
                          } else {
                            peg$currPos = s9;
                            s9 = peg$c0;
                          }
                        } else {
                          peg$currPos = s9;
                          s9 = peg$c0;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$c0;
                      }
                      if (s9 === peg$FAILED) {
                        s9 = peg$c3;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 === peg$FAILED) {
                          s10 = peg$c3;
                        }
                        if (s10 !== peg$FAILED) {
                          if (input.substr(peg$currPos, 3) === peg$c36) {
                            s11 = peg$c36;
                            peg$currPos += 3;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c37); }
                          }
                          if (s11 === peg$FAILED) {
                            s11 = [];
                          }
                          if (s11 !== peg$FAILED) {
                            peg$reportedPos = peg$currPos;
                            s12 = peg$c135(s1, s3, s7, s8, s9, s11);
                            if (s12) {
                              s12 = peg$c2;
                            } else {
                              s12 = peg$c0;
                            }
                            if (s12 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c136(s1, s3, s7, s8, s9, s11);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseReturnStatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c38) {
        s1 = peg$c38;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexplist();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c137(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c38) {
          s1 = peg$c38;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c39); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c138();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseWhileStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c58) {
        s1 = peg$c58;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c59); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c34) {
                s5 = peg$c34;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c35); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$currPos;
                  s8 = peg$parseBlockStatement();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsews();
                    if (s9 !== peg$FAILED) {
                      s8 = [s8, s9];
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$c0;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$c0;
                  }
                  if (s7 === peg$FAILED) {
                    s7 = peg$c3;
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 3) === peg$c36) {
                      s8 = peg$c36;
                      peg$currPos += 3;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c37); }
                    }
                    if (s8 === peg$FAILED) {
                      peg$reportedPos = peg$currPos;
                      s8 = peg$c139();
                      if (s8) {
                        s8 = peg$c2;
                      } else {
                        s8 = peg$c0;
                      }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c140(s3, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseRepeatUntil() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c141) {
        s1 = peg$c141;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c142); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseBlockStatement();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 5) === peg$c56) {
                s5 = peg$c56;
                peg$currPos += 5;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c57); }
              }
              if (s5 === peg$FAILED) {
                peg$reportedPos = peg$currPos;
                s5 = peg$c143();
                if (s5) {
                  s5 = peg$c2;
                } else {
                  s5 = peg$c0;
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseExpression();
                  if (s7 === peg$FAILED) {
                    peg$reportedPos = peg$currPos;
                    s7 = peg$c144();
                    if (s7) {
                      s7 = peg$c2;
                    } else {
                      s7 = peg$c0;
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c145(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseThat() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c146) {
        s1 = peg$c146;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c147); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c148();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSimpleExpression() {
      var s0;

      s0 = peg$parseLiteral();
      if (s0 === peg$FAILED) {
        s0 = peg$parseResetExpression();
        if (s0 === peg$FAILED) {
          s0 = peg$parseFunctionExpression();
          if (s0 === peg$FAILED) {
            s0 = peg$parseCallExpression();
            if (s0 === peg$FAILED) {
              s0 = peg$parseThat();
              if (s0 === peg$FAILED) {
                s0 = peg$parseIdentifier();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseObjectExpression();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseUnaryExpression();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseParenExpr();
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseExpression() {
      var s0;

      s0 = peg$parseAssignmentExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$parseBinSimpleExpression();
      }

      return s0;
    }

    function peg$parseBinSimpleExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseMemberExpression();
      if (s1 === peg$FAILED) {
        s1 = peg$parseSimpleExpression();
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsebinop();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseMemberExpression();
              if (s7 === peg$FAILED) {
                s7 = peg$parseSimpleExpression();
              }
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsews();
          if (s4 === peg$FAILED) {
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsebinop();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseMemberExpression();
                if (s7 === peg$FAILED) {
                  s7 = peg$parseSimpleExpression();
                }
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c149(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseunop() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c150;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c151); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 35) {
            s1 = peg$c4;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c5); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsebinop() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c152;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c153); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c150;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c151); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c154) {
            s1 = peg$c154;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c155); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c156) {
              s1 = peg$c156;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c157); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c158) {
                s1 = peg$c158;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c159); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c160) {
                  s1 = peg$c160;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c161); }
                }
                if (s1 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 62) {
                    s1 = peg$c162;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c163); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 60) {
                      s1 = peg$c164;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c165); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c166) {
                        s1 = peg$c166;
                        peg$currPos += 2;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c167); }
                      }
                      if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c168) {
                          s1 = peg$c168;
                          peg$currPos += 3;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c169); }
                        }
                        if (s1 === peg$FAILED) {
                          if (input.substr(peg$currPos, 2) === peg$c170) {
                            s1 = peg$c170;
                            peg$currPos += 2;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c171); }
                          }
                          if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 42) {
                              s1 = peg$c172;
                              peg$currPos++;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c173); }
                            }
                            if (s1 === peg$FAILED) {
                              if (input.substr(peg$currPos, 2) === peg$c174) {
                                s1 = peg$c174;
                                peg$currPos += 2;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c175); }
                              }
                              if (s1 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 47) {
                                  s1 = peg$c176;
                                  peg$currPos++;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c177); }
                                }
                                if (s1 === peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 37) {
                                    s1 = peg$c178;
                                    peg$currPos++;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c179); }
                                  }
                                  if (s1 === peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 94) {
                                      s1 = peg$c180;
                                      peg$currPos++;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c181); }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseprefixexp() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parsefuncname();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c182;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c183); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseExpression();
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 === peg$FAILED) {
                s4 = peg$c3;
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c184;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c185); }
                }
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c186(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseCallExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c48) {
        s3 = peg$c48;
        peg$currPos += 8;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s5 = peg$c182;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c183); }
          }
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c0;
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c2;
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseprefixexp();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          s5 = peg$parsews();
          if (s5 === peg$FAILED) {
            s5 = peg$c3;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
              s7 = peg$c187;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c188); }
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parseIdentifier();
              if (s8 !== peg$FAILED) {
                s7 = [s7, s8];
                s6 = s7;
              } else {
                peg$currPos = s6;
                s6 = peg$c0;
              }
            } else {
              peg$currPos = s6;
              s6 = peg$c0;
            }
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parsecallsuffix();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = peg$parsews();
              if (s5 === peg$FAILED) {
                s5 = peg$c3;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 58) {
                  s7 = peg$c187;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c188); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseIdentifier();
                  if (s8 !== peg$FAILED) {
                    s7 = [s7, s8];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$c0;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$c0;
                }
                if (s6 === peg$FAILED) {
                  s6 = peg$c3;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsecallsuffix();
                  if (s7 !== peg$FAILED) {
                    s5 = [s5, s6, s7];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$c0;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$c0;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c189(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsecallsuffix() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseargs();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c64(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseObjectExpression();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c190(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseString();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c191(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseParenExpr() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c182;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c183); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c184;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c185); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c192(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseResetExpression() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c193) {
        s1 = peg$c193;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c194); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c195();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsefuncname() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseThat();
      if (s1 === peg$FAILED) {
        s1 = peg$parseIdentifier();
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsefuncnamesuffix();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsefuncnamesuffix();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c196(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsefuncnamesuffix() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 === peg$FAILED) {
        s1 = peg$c3;
      }
      if (s1 !== peg$FAILED) {
        if (peg$c197.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c198); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 === peg$FAILED) {
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseIdentifier();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c199(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 === peg$FAILED) {
          s1 = peg$c3;
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 91) {
            s2 = peg$c101;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c102); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsews();
            if (s3 === peg$FAILED) {
              s3 = peg$c3;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseExpression();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsews();
                if (s5 === peg$FAILED) {
                  s5 = peg$c3;
                }
                if (s5 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s6 = peg$c16;
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c17); }
                  }
                  if (s6 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c200(s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseexplist() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c120;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c121); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseExpression();
              if (s7 === peg$FAILED) {
                peg$reportedPos = peg$currPos;
                s7 = peg$c201();
                if (s7) {
                  s7 = peg$c2;
                } else {
                  s7 = peg$c0;
                }
              }
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsews();
          if (s4 === peg$FAILED) {
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c120;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c121); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseExpression();
                if (s7 === peg$FAILED) {
                  peg$reportedPos = peg$currPos;
                  s7 = peg$c201();
                  if (s7) {
                    s7 = peg$c2;
                  } else {
                    s7 = peg$c0;
                  }
                }
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c202(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsevarlist() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsevar();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c120;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c121); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parsevar();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsews();
          if (s4 === peg$FAILED) {
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c120;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c121); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsevar();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c203(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsenamelist() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsews();
        if (s4 === peg$FAILED) {
          s4 = peg$c3;
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c120;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c121); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseIdentifier();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsews();
          if (s4 === peg$FAILED) {
            s4 = peg$c3;
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c120;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c121); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseIdentifier();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c202(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseargs() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c182;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c183); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexplist();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c184;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c185); }
              }
              if (s5 === peg$FAILED) {
                peg$reportedPos = peg$currPos;
                s5 = peg$c204();
                if (s5) {
                  s5 = peg$c2;
                } else {
                  s5 = peg$c0;
                }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c205(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c182;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c183); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c184;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c185); }
            }
            if (s3 === peg$FAILED) {
              peg$reportedPos = peg$currPos;
              s3 = peg$c204();
              if (s3) {
                s3 = peg$c2;
              } else {
                s3 = peg$c0;
              }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c206();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parsevar() {
      var s0;

      s0 = peg$parseMemberExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$parseIdentifier();
      }

      return s0;
    }

    function peg$parseMemberExpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseCallExpression();
      if (s1 === peg$FAILED) {
        s1 = peg$parseSimpleExpression();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseindexer();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseindexer();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseindexer();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c207(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseindexer() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c101;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c16;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c208(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c67;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c68); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseSimpleExpression();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c209(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseObjectExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c210;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c211); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefield();
          if (s3 === peg$FAILED) {
            s3 = peg$c3;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$currPos;
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s7 = peg$c120;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c121); }
              }
              if (s7 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                  s7 = peg$c21;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c22); }
                }
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parsews();
                if (s8 === peg$FAILED) {
                  s8 = peg$c3;
                }
                if (s8 !== peg$FAILED) {
                  s9 = peg$parsefield();
                  if (s9 !== peg$FAILED) {
                    s6 = [s6, s7, s8, s9];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c0;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$c0;
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s7 = peg$c120;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c121); }
                }
                if (s7 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 59) {
                    s7 = peg$c21;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c22); }
                  }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsews();
                  if (s8 === peg$FAILED) {
                    s8 = peg$c3;
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsefield();
                    if (s9 !== peg$FAILED) {
                      s6 = [s6, s7, s8, s9];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$c0;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c0;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 === peg$FAILED) {
                s5 = peg$c3;
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s6 = peg$c212;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c213); }
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c214(s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsefield() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      s1 = peg$parseLiteral();
      if (s1 === peg$FAILED) {
        s1 = peg$parseIdentifier();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c104;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c105); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseBinSimpleExpression();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c215(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseBinSimpleExpression();
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c216(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsews();
          if (s1 === peg$FAILED) {
            s1 = peg$c3;
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 91) {
              s2 = peg$c101;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsews();
              if (s3 === peg$FAILED) {
                s3 = peg$c3;
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseExpression();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsews();
                  if (s5 === peg$FAILED) {
                    s5 = peg$c3;
                  }
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s6 = peg$c16;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parsews();
                      if (s7 === peg$FAILED) {
                        s7 = peg$c3;
                      }
                      if (s7 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 61) {
                          s8 = peg$c104;
                          peg$currPos++;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c105); }
                        }
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parsews();
                          if (s9 === peg$FAILED) {
                            s9 = peg$c3;
                          }
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parseBinSimpleExpression();
                            if (s10 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c217(s4, s10);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parseFunctionDeclaration() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parsefunction();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefuncname();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsefuncbody();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 3) === peg$c36) {
                    s7 = peg$c36;
                    peg$currPos += 3;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c37); }
                  }
                  if (s7 === peg$FAILED) {
                    s7 = [];
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = peg$currPos;
                    s8 = peg$c218(s1, s3, s5, s7);
                    if (s8) {
                      s8 = peg$c2;
                    } else {
                      s8 = peg$c0;
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c219(s1, s3, s5, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLocalFunction() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c40) {
        s1 = peg$c40;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefunction();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsefuncname();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 === peg$FAILED) {
                  s6 = peg$c3;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsefuncbody();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 === peg$FAILED) {
                      s8 = peg$c3;
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.substr(peg$currPos, 3) === peg$c36) {
                        s9 = peg$c36;
                        peg$currPos += 3;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c37); }
                      }
                      if (s9 === peg$FAILED) {
                        s9 = [];
                      }
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = peg$currPos;
                        s10 = peg$c218(s3, s5, s7, s9);
                        if (s10) {
                          s10 = peg$c2;
                        } else {
                          s10 = peg$c0;
                        }
                        if (s10 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c220(s3, s5, s7, s9);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFunctionExpression() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsefuncdef();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c221(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsefuncdef() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsefunction();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefuncbody();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c36) {
                s5 = peg$c36;
                peg$currPos += 3;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c37); }
              }
              if (s5 === peg$FAILED) {
                s5 = [];
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = peg$currPos;
                s6 = peg$c222(s1, s3, s5);
                if (s6) {
                  s6 = peg$c2;
                } else {
                  s6 = peg$c0;
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c223(s1, s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsefuncbody() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c182;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c183); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseparamlist();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 === peg$FAILED) {
              s4 = peg$c3;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c120;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c121); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsews();
                if (s7 === peg$FAILED) {
                  s7 = peg$c3;
                }
                if (s7 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 3) === peg$c193) {
                    s8 = peg$c193;
                    peg$currPos += 3;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c194); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsews();
                    if (s9 === peg$FAILED) {
                      s9 = peg$c3;
                    }
                    if (s9 !== peg$FAILED) {
                      s6 = [s6, s7, s8, s9];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$c0;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c0;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
              if (s5 === peg$FAILED) {
                s5 = peg$c3;
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c184;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c185); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsews();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseBlockStatement();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c224(s3, s5, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c182;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c183); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 === peg$FAILED) {
            s2 = peg$c3;
          }
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c193) {
              s3 = peg$c193;
              peg$currPos += 3;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c194); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 === peg$FAILED) {
                s4 = peg$c3;
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c184;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c185); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsews();
                  if (s6 === peg$FAILED) {
                    s6 = peg$c3;
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseBlockStatement();
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c225(s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseparamlist() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c120;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c121); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 === peg$FAILED) {
              s6 = peg$c3;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseIdentifier();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c120;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c121); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 === peg$FAILED) {
                s6 = peg$c3;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseIdentifier();
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c0;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c226(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 === peg$FAILED) {
          s1 = peg$c3;
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c227();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseUnaryExpression() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseunop();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseMemberExpression();
          if (s3 === peg$FAILED) {
            s3 = peg$parseSimpleExpression();
            if (s3 === peg$FAILED) {
              s3 = peg$parseExpression();
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c228(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseIdentifier() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseName();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c229(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLiteral() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c42) {
        s1 = peg$c42;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c46) {
          s1 = peg$c46;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c47); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c44) {
            s1 = peg$c44;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c45); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c230(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNumber();
        if (s1 !== peg$FAILED) {
          if (peg$c231.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c232); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 45) {
              s5 = peg$c150;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c151); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 43) {
                s5 = peg$c152;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c153); }
              }
            }
            if (s5 === peg$FAILED) {
              s5 = peg$c3;
            }
            if (s5 !== peg$FAILED) {
              s6 = [];
              if (peg$c65.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  if (peg$c65.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c66); }
                  }
                }
              } else {
                s6 = peg$c0;
              }
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              s4 = input.substring(s3, peg$currPos);
            }
            s3 = s4;
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c233(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 48) {
            s1 = peg$c234;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c235); }
          }
          if (s1 !== peg$FAILED) {
            if (peg$c236.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c237); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              s4 = [];
              if (peg$c238.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c239); }
              }
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  if (peg$c238.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c239); }
                  }
                }
              } else {
                s4 = peg$c0;
              }
              if (s4 !== peg$FAILED) {
                s4 = input.substring(s3, peg$currPos);
              }
              s3 = s4;
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c240(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseNumber();
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c241(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseString();
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c242(s1);
              }
              s0 = s1;
            }
          }
        }
      }

      return s0;
    }


      function loc() { return {start: { line: line(), column: column() } } }
      function range() { return [offset(), offset() + text().length]; }
      function listHelper(a,b,c) { return a == null ? [] : [a].concat(b.map(function(b) { return b[c || 2]; })); }
      function opt(name, def) { return name in options ? options[name] : def }

      function expandMultiStatements(list) {
        var out = [];
        for ( var i = 0; i < list.length; ++i ) {
            var value = list[i];
            if (value instanceof Array) out = out.concat(value);
            else out.push(value);
        }
        return out;
      }

      function wrapNode(obj, hasScope) {
        hasScope = !!hasScope 
        obj.loc = loc();
        obj.range = range();
        obj.hasScope = hasScope;
        obj.text = text();
        return obj;
      }

      function eUntermIfEmpty(what, type, end, start) {
        if ( what.length == 0 ) return eUnterminated(type, end, start);
        return true;
      }

      function eUnterminated(type, end, start) {
        var xline = start !== undefined ? start.loc.start.line : (line());
        var xcol = start !== undefined ? start.loc.start.column : (column());

        eMsg("`" + (end || "end") + "` expected (to close " + type + " at " + xline + ":" + xcol + ") at " + line() +  ":" + column() );
        return true;
      }

      function eMsg(why) {
        if ( !opt("loose", false) ) error(why);
        errors.push({msg: why, loc: loc(), range: range()});
        return true;
      }

      var opPrecedence = {
        "^": 10,
        "not": 9,
        "*": 8, "/": 8, "%": 8, "//": 8,
        "+": 7, "-": 7,
        "..": 6,
        "<": 5, ">": 5, ">=": 5, "<=": 5, "==": 5, "~=": 5,
        "and": 4,
        "or": 3
      }

      function precedenceClimber(tokens, lhs, min) {
        while ( true ) { 
            if ( tokens.length == 0 ) return lhs;
            var op = tokens[0];
            var prec = opPrecedence[op];
            if ( prec < min ) return lhs;
            tokens.shift();

            var rhs = tokens.shift();
            while ( true ) {
                var peek = tokens[0];
                if ( peek == null || opPrecedence[peek] <= prec ) break;
                rhs = precedenceClimber(tokens, rhs, opPrecedence[peek]);
            }

            lhs = bhelper.binaryExpression(op, lhs, rhs);
        }

      }

      var errors;

      function init() {
        errors = [];
      }

      var builder = {
        assignmentExpression: function(op, left, right) { return wrapNode({type: "AssignmentExpression", operator: op, left: left, right: right }); },
        binaryExpression: function(op, left, right) { return wrapNode({type: (op == '||' || op == '&&') ? "LogicalExpression" : "BinaryExpression", operator: op, left: left, right: right }); },
        blockStatement: function(body) { return wrapNode({ type: "BlockStatement", body: body}); },
        callExpression: function(callee, args) { return wrapNode({ type: "CallExpression", callee: callee, arguments: args}); },
        emptyStatement: function() { return wrapNode({ type: "EmptyStatement" }); },
        functionDeclaration: function(name, args, body, isGenerator, isExpression) {
            return wrapNode({type: "FunctionDeclaration", id: name, params: args, body: body, generator: isGenerator, expression: isExpression });
        },
        memberExpression: function(obj, prop, isComputed) { return wrapNode({ type:"MemberExpression", object: obj, property: prop, computed: isComputed }); },
        variableDeclaration: function(kind, decls) { return { type: "VariableDeclaration", declarations: decls, kind: opt("forceVar", true) ? "var" : kind } },
        functionExpression: function(name, args, body) { return { type: "FunctionExpression", name: name, body: body, params: args } },
        returnStatement: function(arg) { return wrapNode({type: "ReturnStatement", argument: arg}); },
        generatedReturnStatement: function(arg) { return wrapNode({type: "ReturnStatement", argument: arg, userCode: false}); }
      };

      var i = function(n) { return { type: "Identifier", name: n}; }
      var id = i;
      var tmpVarCtr = 0;

      function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      }



      function finalize(ast) {
        if ( opt("loose", false) ) ast.errors = errors;
        
        if ( opt("useStrict", false) ) {
            ast.body.unshift({
                type: "ExpressionStatement",
                expression: { type: "Literal", value: "use strict" }
            });
        }

        if ( opt("noSharedObjects", true) ) return clone(ast);
        return ast;
      }

      var bhelper = {
        blockStatement: function(body) {
            return builder.blockStatement(expandMultiStatements(body));
        },
        tempName: function() {
            return i("__lua$tmpvar$" + (++tmpVarCtr));
        },
        tempVar: function(exp) {
            return { type: "VariableDeclarator", id: bhelper.tempName(), init: exp };
        },
        assign: function(target, exp) {
            var out = builder.assignmentExpression("=", target, exp);
            if ( target.type == "MemberExpression" && opt("luaOperators", false) ) {
                var prop = target.property;
                if ( !target.computed ) prop = {"type": "Literal", "value": prop.name, loc: prop.loc, range: prop.range };
                
                var helper;
                var nue = bhelper.translateExpressionIfNeeded(target.object);

                if ( target.object.type == "Identifier" ) helper = target.object.name;

                if ( helper === undefined ) {
                    nue = bhelper.luaOperator("indexAssign", nue, prop, exp);
                } else {
                    nue = bhelper.luaOperator("indexAssign", nue, prop, exp, {type:"Literal", value: helper});
                }

                nue = {type: "ConditionalExpression",test: nue, consequent: exp, alternate: out};

                out = nue;
            }
                
            return {
                type: "ExpressionStatement",
                expression: out
            };
        },
        encloseDecls: function(body /*, decls...*/) {
            var decls = Array.prototype.slice.call(arguments, 1);
            return bhelper.encloseDeclsEx.apply(this, [body, opt("encloseWithFunctions", true) ].concat(decls));
        },
        encloseDeclsEx: function(body, enclose /*, decls...*/) {
            var decls = Array.prototype.slice.call(arguments, 2);
            var vals = [];
            var names = [];
            for ( var k in decls ) {
                var v = decls[k];
                vals.push(v.init);
                names.push(v.id);
            }

            if ( enclose ) {
                return {
                    expression: builder.callExpression(
                        builder.functionExpression(null, names, bhelper.blockStatement(body)),
                        vals
                    ),
                    type: "ExpressionStatement"
                }
            } else {
                if ( decls.length < 1 ) return body;
                return bhelper.blockStatement([ builder.variableDeclaration("let", decls) ].concat(body));
            }
        },
        encloseDeclsUnpack: function(body, names, explist, force) {

            if ( force || opt("encloseWithFunctions", true) ) {
                return {
                    expression: builder.callExpression(
                        builder.memberExpression(
                            builder.functionExpression(null, names, builder.blockStatement(body)),
                            i("apply")
                        ),
                        [{type: "Literal", value: null}, bhelper.luaOperatorA("expandReturnValues", explist)]
                    ),
                    type: "ExpressionStatement"
                }
            } else {
                var decls = [];
                for ( var idx in names ) {
                    decls.push({
                        type: "VariableDeclarator",
                        id: names[idx],
                        init: idx.id
                    });
                }
                return bhelper.blockStatement([ 
                    builder.variableDeclaration("let", decls),
                    bhelper.bulkAssign(names, explist)
                    ].concat(body));
            }
        },
        bulkAssign: function(names, explist) {
            var temps = [];
            var body = [];
            for ( var i = 0; i < names.length; ++i ) {
                temps[i] = bhelper.tempName();
            }

            // If we are refrencing a previously set value in a bulk assign as a property
            // we want to use the old value to look up the index, so we will pull that from
            // the temp var passed in
            var extra = 0;
            for ( var i = 0; i < names.length; ++i ) {
                var exp = names[i];
                if ( exp.type == "MemberExpression" && exp.property.type == "Identifier" ) {
                    for ( var j = 0; j < i; ++j) {
                        if ( names[j].name == exp.property.name ) {
                            var holding = bhelper.tempName();
                            temps.unshift(holding);
                            explist.unshift(exp.property);
                            exp.property = holding;
                            ++extra;
                        }
                    }
                }
            }

            for ( var i = 0; i < names.length; ++i ) {
                body[i] = bhelper.assign(names[i], temps[i+extra]);
            }

            if ( names.length > 1 ) {
                return bhelper.encloseDeclsUnpack(body, temps, explist, true);
            } else {
                var value = explist[0];
                if ( value.type == "CallExpression" ) value = bhelper.luaOperator("oneValue", value);
                return bhelper.assign(names[0], value);
            }
            
        },
        luaOperator: function(op /*, args */) {
            if ( op == "oneValue" && opt("noMutliReturnSquish", false) ) return arguments[1];
            var o = builder.callExpression(
                builder.memberExpression(i("__lua"), i(op)), 
                Array.prototype.slice.call(arguments, 1)
            );
            o.internal = true;
            return o;
        },
        luaOperatorA: function(op, args) {
            var o = builder.callExpression(
                builder.memberExpression(i("__lua"), i(op)), 
                args
            );
            o.internal = true;
            return o;
        },
        binaryExpression: function(op, a, b) {
            if ( opt("luaOperators", false) && op != "and" && op != "or" ) {
                var map = {"+": "add", "-": "sub", "*": "mul", "/": "div", "//": "intdiv", "^": "pow", "%":"mod",
                    "..": "concat", "==": "eq", "<": "lt", "<=": "lte", ">": "gt", ">=": "gte", "~=": "ne",
                    "and": "and", "or": "or"
                };
                
                return bhelper.luaOperator(map[op], a, b);
            } else {

                if ( op == "~=" ) xop = "!=";
                else if ( op == ".." ) op = "+";
                else if ( op == "or" ) op = "||";
                else if ( op == "and" ) op = "&&";
                else if ( op == "//" ) op = "/";

                a = bhelper.luaOperator("oneValue", a);
                b = bhelper.luaOperator("oneValue", b);

                return builder.binaryExpression(op, a, b);
            }
        },
        callExpression: function(callee, args) {
            if ( opt("luaCalls", false) ) {
                var that = {"type": "ThisExpression" };
                if ( callee.type == "MemberExpression" ) that = {"type":"Literal", "value": null};
                var flags = 0;
                if ( callee.selfSuggar ) {
                    flags = flags | 1;
                }

                if ( opt('decorateLuaObjects', false) ) {
                    flags = flags | 2;
                }

                var flagso = {"type": "Literal", "value": flags};
                var helper = null;
                
                if ( callee.type == "Identifier" ) helper = callee.name;
                else if ( callee.type == "MemberExpression" && !callee.computed ) helper = callee.property.name;

                helper = {"type": "Literal", "value": helper};

                if ( callee.selfSuggar ) {
                    if ( callee.object.type == "Identifier" ) {
                        //Dont bother making a function if we are just an identifer.
                        var rcallee = bhelper.translateExpressionIfNeeded(callee)
                        return bhelper.luaOperator.apply(bhelper, ["call", flagso , rcallee, callee.object, helper].concat(args));

                    } else {
                        var tmp = bhelper.tempVar(bhelper.translateExpressionIfNeeded(callee.object));
                        
                        var rexpr = builder.memberExpression(tmp.id, callee.property, callee.computed);
                        var rcallee = bhelper.translateExpressionIfNeeded(rexpr);
                        var expr = bhelper.luaOperator.apply(bhelper, ["call", flagso, rcallee, tmp.id, helper].concat(args));
                        return result = bhelper.encloseDeclsEx([
                            builder.returnStatement(
                                expr
                            )
                        ], true, tmp).expression;

                    }
                } else {
                    var rcallee = bhelper.translateExpressionIfNeeded(callee)
                    if ( rcallee.type == "Identifier" && rcallee.name == "assert" ) {
                        args.push({type: "Literal", value: args[0].text || "?"})
                    }
                    return bhelper.luaOperator.apply(bhelper, ["call", flagso , rcallee, that, helper].concat(args));
                }
            } else {
                return builder.callExpression(callee, args);
            }
        },
        memberExpression: function(obj, prop, isComputed) {
            if ( opt("luaOperators", false) && !isComputed ) {
                var helper;
                if ( obj.type == "Identifier") helper = obj.name;

                if ( helper == undefined ) {
                    return bhelper.luaOperator("index", obj, prop);
                } else {
                    return bhelper.luaOperator("index", obj, prop, {type:"Literal", value: helper});
                }
            }
            return builder.memberExpression(obj, prop, isComputed);
        },
        translateExpressionIfNeeded: function(exp) {
            if ( !opt("luaOperators", false) ) return exp;
            if ( exp.type == "MemberExpression" ) {
                var prop = exp.property;
                if ( !exp.computed ) prop = {"type": "Literal", value: prop.name };
                var nu = bhelper.memberExpression(bhelper.translateExpressionIfNeeded(exp.object), prop, false);
                nu.origional = exp;
                nu.range = exp.range;
                nu.loc = exp.loc;
                return nu;
            }

            return exp;
        },
        injectRest: function(block, count) {
            block.unshift(builder.variableDeclaration("let", [
                    {
                        type: "VariableDeclarator", 
                        id: {type: "Identifier", name:"__lua$rest"},
                        userCode: false,
                        init: bhelper.luaOperator("rest", 
                            {type: "Identifier", name:"arguments"},
                            {type: "Literal", value:count}
                        )
                    }
                 ]));
        },
        valueProvdier: function(statement) {
            return builder.functionExpression(null, [], bhelper.blockStatement([
                builder.generatedReturnStatement(statement)
            ]));
        }
      }



    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();


/***/ },
/* 38 */
/***/ function(module, exports) {

var env = {};
var __lua = (function() {

	// Yoinked from underscore.
	var isJSArray = Array.isArray || function(obj) { return toString.call(obj) === '[object Array]'; };

	function type(what) {
		if ( what === null || what === undefined ) return "nil";
		if ( isNaN(what) ) return "number";
		var t = typeof what;
		if ( t == "object" ) return "table";
		return t;
	}

	function numberForArith(n) {
		if ( type(n) == "number" ) return n;
		else if ( typeof n == "string" ) {
			n = parseInt(n);
			if ( !isNaN(n) ) return n;

		}

		throw "attempt to perform arithmetic on a " +  type(n) + " value: " + n;
	}

	function makeString(a) { 
		a = oneValue(a);

		var mtf = lookupMetaTable(a, "__tostring");
		if ( mtf !== null ) return mtf(a);

		if ( a === undefined || a === null ) return "nil";
		if ( a instanceof LuaTable ) {
			return "table: 0x" + a.id;
		} else if ( typeof a == "number" ) {
			if ( ~~a == a ) return a.toString();
			var rep = a.toPrecision();
			if ( rep.length > 14 ) return a.toPrecision(14);
			return rep;
		}
		return "" + a;
	}

	function add(a,b) {
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__add");
		if ( mtf !== null ) return mtf(a,b);

		return numberForArith(a) + numberForArith(b); 
	}

	function sub(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__sub");
		if ( mtf !== null ) return mtf(a,b);

		return numberForArith(a) - numberForArith(b);
	}

	function mul(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__mul");
		if ( mtf !== null ) return mtf(a,b);

		return numberForArith(a) * numberForArith(b);
	}

	function div(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__div");
		if ( mtf !== null ) return mtf(a,b);

		return numberForArith(a) / numberForArith(b);
	}

	function intdiv(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__idiv");
		if ( mtf !== null ) return mtf(a,b);

		return ~~(numberForArith(a) / numberForArith(b));
	}

	function mod(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__mod");
		if ( mtf !== null ) return mtf(a,b);

		return numberForArith(a) % numberForArith(b);
	}

	function pow(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__pow");
		if ( mtf !== null ) return mtf(a,b);

		return Math.pow(numberForArith(a),numberForArith(b)); 
	}

	function concat(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__concat");
		if ( mtf !== null ) return mtf(a,b);
		if ( a === null || a === undefined || b === null || b === undefined ) throw "attempt to concatenate a nil value";

		return  makeString(a) + makeString(b); 
	}

	function lte(a,b) {
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__le");
		if ( mtf !== null ) return mtf(a,b);

		return a <= b; 
	}

	function lt(a,b) {
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__lt");
		if ( mtf !== null ) return mtf(a,b);

		return a < b; 
	}

	function gte(a,b) { return lte(b,a); }
	function gt(a,b) { return lt(b,a); }


	function forcomp(d,a,b) { 
		if ( d > 0 ) return a <= b; 
		else if ( d < 0 ) return b <= a;
		else return false;
	}

	
	function eq(a,b) { 
		a = oneValue(a); b = oneValue(b);

		var mtf = lookupMetaTableBin(a, b, "__eq");
		if ( mtf !== null ) return mtf(a,b);


		if ( a === null || a === undefined ) {
			return ( b === null || b === undefined );
		}
		if ( a === b ) return true;
		return false;
	}
	
	function ne(a,b) { return !eq(a,b); }

	function count(a) { 
		if ( a instanceof LuaTable ) {
			var cnt = 0;
			while ( a.numeric[cnt] !== undefined ) ++cnt;
			return cnt;
		}
		return a.length;
	}

	function and(a,b) { return a && b; }
	function or(a,b) { return a || b; }

	function call(flags, what, that, helper /*, args... */ ) {
		var injectSelf = !!(flags & 1); 
		var detectLua = !!(flags & 2); 

		if ( what === null || what === undefined ) {
			if ( helper === undefined ) throw "attempt to call a " + type(what) + " value";
			else throw "attempt to call '" + helper + "' (a " + type(what) + " value)"; 
		}

		var args = expand(Array.prototype.slice.call(arguments, 4), true);

		var doInject = true;

		if ( detectLua ) {
			doInject = what.__luaType == "function";
		}

		if ( injectSelf && doInject ) {
			args.unshift(that);
		}

		if ( detectLua && what.__luaType != "function" ) {
			var args2 = [];
			for ( var i = 0; i < args.length; ++i ) {
				var a = args[i];
				if ( a instanceof LuaTable ) {
					if ( a.numeric.length == 0 ) args2[i] = a.hash;
					else if ( Object.keys(a.hash).length == 0 ) args2[i] = a.numeric;
					else args2[i] = a;
				} else {
					args2[i] = a;
				}
			}
			args = args2;
		}

		return what.apply(that, args);
	}

	function rest(args, cnt) {
		var out = Object.create(LuaReturnValues.prototype, {});
		out.values = Array.prototype.slice.call(args, cnt);
		return out;
	}

	var id = 0;
	function LuaTable() {
		this.id = ++id;
		this.numeric = [];
		this.hash = {};
	}

	Object.defineProperty(LuaTable.prototype, "__luaType",  {value: "table",  enumerable: false});
	Object.defineProperty(LuaTable.prototype, "toString",  {value: function() {
		return makeString(this);
	},  enumerable: false});

	function makeTable(t, allowExpand /*, numeric ... */) {
		var out = new LuaTable();

		out.numeric = expand(Array.prototype.slice.call(arguments, 2), allowExpand);
		if ( !t ) return out;

		if ( isJSArray(t) ) {
			for ( var i = 0; i < t.length; ++i ) {
				var pair = t[i];
				var key = pair[0];
				var val = pair[1];
				if ( typeof key == "number" ) {
					out.numeric[key - 1] = val;
				} else {
					out.hash[key] = val;
				}
			}
		} else {
			for ( var k in t ) {
				out.hash[k] = t[k];
			}
		}

		return out;
	}

	function makeFunction(f) {
		f.__luaType = "function";
		return f;
	}

	function LuaReturnValues(v) {
		this.values = v;
	}

	Object.defineProperty(LuaReturnValues.prototype, "__luaType",  {value: "returnValues",  enumerable: false});

	function lookupMetaTable(table, entry) {
		if ( table instanceof LuaTable ) {
			if ( table.__metatable === undefined ) return null;

			var idx = table.__metatable.hash[entry];
			if ( idx === null || idx === undefined ) return null;

			return idx;
		}

		return null;
	}

	function lookupMetaTableBin(a, b, entry) {
		var mt = lookupMetaTable(a, entry);
		if ( mt == null ) return lookupMetaTable(b, entry);
		return mt;
	}

	function index(table, prop, helper) {
		if ( table === null || table === undefined || typeof table == "number" ) {
			if ( helper == undefined ) {
				throw "attempt to index a " + type(table) + " value";
			} else {
				throw "attempt to index '" + helper + "' (a " + type(table) + " value)";
			}
		} else if ( table instanceof LuaTable ) {
			var val;
			if ( typeof prop == "number") val = table.numeric[prop-1];
			else val = table.hash[prop];

			if ( val !== null & val !== undefined ) return val;

			var idxfx = lookupMetaTable(table, "__index");
			if ( idxfx == null ) return null;

			if ( typeof idxfx == "function" ) return oneValue(idxfx(table, prop));
			return index(idxfx, prop);
		} else if ( isJSArray(table) ) {
			return table[prop - 1];
		} else if ( typeof table == "string" ) {
			var sidx = tonumber(prop);
			if ( sidx < 0 ) sidx += (table.length + 1);
			return table[sidx-1];
		} else {
			return table[prop];
		}
	}

	function indexAssign(table, prop, value, helper) {

		if ( table === null || table === undefined || typeof table == "number" ) {
			if ( helper == undefined ) {
				throw "attempt to index a " + type(table) + " value";
			} else {
				throw "attempt to index '" + helper + "' (a " + type(table) + " value)";
			}
		}

		if ( table instanceof LuaTable ) {
			var val;

			if ( prop === undefined || prop === null ) throw "table index is nil";

			if ( typeof prop == "number" ) val = table.numeric[prop-1];
			else val = table.hash[prop];

			if ( val !== null & val !== undefined ) {
				if ( typeof prop == "number") table.numeric[prop-1] = value;
				else table.hash[prop] = value;
				return true;
			}

			if ( table.__metatable === undefined ) {
				if ( typeof prop == "number") table.numeric[prop-1] = value;
				else table.hash[prop] = value;
				return true;
			}



			var idx = table.__metatable.__newindex;
			if ( idx === null || idx === undefined ) {
				if ( typeof pop == "number") table.numeric[prop] = value;
				else table.hash[prop] = value;
				return true;	
			}

			if ( typeof idx == "function" ) idx(table, prop, value);
			else indexAssign(idx, prop, value);

			return true;


		} else if ( typeof table == "string" ) { 
			throw "attempt to index string value";
		} else if ( isJSArray(table) ) {
			table[prop-1] = value;
			return true;
		} else {
			return false;
		}
	}

	function oneValue(v) {
		if ( v instanceof LuaReturnValues ) return v.values[0];
		return v;
	}

	function makeMultiReturn() {
		return new LuaReturnValues(expand(arguments, true));
	}

	function expand(what, allowExpand) {
		if ( allowExpand === undefined ) allowExpand = false;

		var out = [];
		for ( var idx in what ) {
			var v = what[idx];
			if ( v instanceof LuaReturnValues ) {
				for ( var i in v.values ) {
					out.push(v.values[i]);
					if ( idx < what.length - 1 || !allowExpand) break;
				}
			} else {
				out.push(v);
			}
		}
		return out;
	}

	function expandReturnValues() {
		return expand(arguments, true);
	}

	function pcall(what /*, args... */ ) {
		try {
			var result = expand([what.apply(this, Array.prototype.slice.call(arguments, 1))], true);
			result.unshift(true);
			return makeMultiReturn.apply(__lua, result);
		} catch ( e ) {
			return makeMultiReturn(false, e);
		}
	}

	function isTable(a) { return a instanceof LuaTable; }

	function mark(o) {
		var seen = [];
		function domark(o) {
			if ( o in seen ) return;
			seen.push(o);
			if ( typeof o == "object" ) for ( var idx in o ) domark(o[idx]);
			else if ( typeof o == "function" ) o.__luaType = "function";
			
		}
		domark(o);
	}

	return {
		add: add,
		sub: sub,
		mul: mul,
		div: div,
		intdiv: intdiv,
		mod: mod,
		call: call,
		lte: lte,
		lt: lt,
		ne: ne,
		gt: gt,
		gte: gte,
		eq: eq,
		index: index,
		indexAssign: indexAssign,
		concat: concat,
		makeTable: makeTable,
		makeFunction: makeFunction,
		expandReturnValues: expandReturnValues,
		makeMultiReturn: makeMultiReturn,
		count: count,
		and: and,
		or: or,
		expand: expand,
		rest: rest,
		pcall: pcall,
		type: type,
		pow: pow,
		isTable: isTable,
		mark: mark,
		forcomp: forcomp,
		makeString: makeString,
		oneValue: oneValue,
		lookupMetaTable: lookupMetaTable,
		isJSArray: isJSArray
	};

})();


this.__lua = __lua;

env.string = {
	byte: function byte(s,i,j) {
		var chars = env.string.sub(s,i,j);
		var out = [];
		for ( var i = 0; i < chars.length; ++i ) out[i] = chars.charCodeAt(i);
		return __lua.makeMultiReturn.apply(__lua, out);
	},
	char: function char(/* arguments */) {
		var out = "";
		for ( var i = 0; i < arguments.length; ++i ) {
			out += String.fromCharCode(arguments[i]|0); 
		}
		return out;

	},
	dump: null,
	find: null,
	gmatch: null,
	gsub: null,
	len: function len(s) { return ("" + s).length; },
	lower: function lower(s) { return ("" + s).toLowerCase(); },
	match: null,
	reverse: function(s) {
		return ("" + s).split("").reverse().join("");
	},
	sub: function(s, i, j) {
		if ( i === undefined || i === null ) i = 1;
		if ( j === undefined || j === null ) j = s.length;
		if ( i < 0 ) i += (s.length+1);
		if ( j < 0 ) j += (s.length+1);

		return __lua.makeString(s).substring(i-1,j);

	},
	upper: function lower(s) { return ("" + s).toUpperCase(); },
	format: function format(format, etc) {
		var arg = arguments;
		var i = 1;
		return format.replace(/%([0-9.]+)?([%sfdgi])/g, function (m, w, t) {
			var r = null;
			if ( t == "%" ) return "%";
			else if ( t == "s") r = arg[i++];
			else if ( t == "d") r = parseInt(arg[i++]);
			else if ( t == "i") r = parseInt(arg[i++]);
			else if ( t == "f" ) r = arg[i++].toFixed(parseFloat(m[1]) || 6);
			else r = arg[i++]; 
			r = "" + r;
			if ( parseInt(w) ) {
				var extra = parseInt(w) - r.length;
				if ( extra > 0 ) r = new Array(extra).join(" ") + r;
			}
			return r;
		});
	}

};

env.table = {
	concat: null,
	insert: null,
	pack: function(/* arguments */) {
		var obj = {}
		for ( var i = 0; i < arguments.length; ++i) {
			obj[("" + (i + 1))] = arguments[i];
		}
		return __lua.makeTable(obj);
	},
	remove: null,
	sort: function sort(table) { return table; },
	unpack: function(table,i,j) {
		if ( i === undefined || i === null ) i = 1;
		if ( j === undefined || j === null ) j = __lua.count(table);

		var arr = [];
		if ( __lua.isTable(table) ) {
			for ( var a = i; a <= j; ++a ) {
				arr.push(table.numeric[a]);
			}
		} else {
			for ( var a = i; a <= j; ++a ) {
				arr.push(table[a]);
			}			
		}

		return __lua.makeMultiReturn.apply(__lua, arr);


	}

};

env.unpack = env.table.unpack;

env.tonumber = function(n) {
	return parseInt(n);
};

env.tostring = function(n) {
	return __lua.makeString(n);
};

env.os = {
	clock: null,
	date: null,
	difftime: function difftime(t1,t2) { return t2 - t1; },
	execute: null,
	exit: null,
	time: function time(table) {
		if ( table == null ) return new Date().getTime();
		throw "Time given a table not implemented yet.";
	}
};

env.io = {
	write: function() { env.print(arguments); }
};

env.error = function error(s) { throw s; };

env.assert = function assert(what, msg, code) {
	if ( code === undefined ) {
		code = msg;
		msg = undefined;
	}

	if ( !!what ) return what;

	throw("Assert Failed!! " + code);
};

env.type = function type(what) {
	return __lua.type(what);
};


env.pairs = function pairs(table) {

	var mtf = __lua.lookupMetaTable(table, "__pairs");
	if ( mtf !== null ) return mtf(table);

	var list = [];
	if ( __lua.isTable(table) ) {
		for ( var i = 0; i < table.numeric.length; ++i ) list.push([i + 1, i, table.numeric]);
		for ( var idx in table.hash ) list.push([idx, idx, table.hash]);
	} else if ( __lua.isJSArray(table) ) {
		for ( var i = 0; i < table.length; ++i ) list.push([i + 1, i, table]);
	} else {
		var keys = Object.keys(table);
		for ( var idx in keys ) list.push([keys[idx], keys[idx], table]);
	}

	return __lua.makeMultiReturn(function(handle, cur) {
		if ( handle.length < 1 ) return null;
		var nfo = handle.shift();
		var k = nfo[0];
		var v = nfo[2][nfo[1]];
		return __lua.makeMultiReturn(k,v);
	}, list, null);
};

env.ipairs = function ipairs(table) {

	var mtf = __lua.lookupMetaTable(table, "__ipairs");
	if ( mtf !== null ) return mtf(table);

	return __lua.makeMultiReturn(function ipairsitr(table, cur) {
		cur = cur + 1;
		if ( __lua.isJSArray(table) ) {
			if ( table.length < cur ) return null;
			return __lua.makeMultiReturn(cur, table[cur-1]);
		} else if ( __lua.isTable(table) ) {
			if ( table.numeric[cur-1] === null || table.numeric[cur-1] === undefined ) return null;
			return __lua.makeMultiReturn(cur, table.numeric[cur-1]);
		} else {
			return table[cur-1];
		}
	}, table, 0);
};

env.next = function next(table, cur) {
	if ( __lua.isTable(table) ) {
		var list = [];
		for ( var i = 0; i < table.numeric.length; ++i ) list.push([i + 1, table.numeric[i]]);
		for ( var tidx in table.hash ) list.push([tidx, table.hash[tidx]]);
		var trigger = false;
		for ( var i = 0; i < list.length; ++i ) {
			var itm = list[i];
			if ( cur === null || cur === undefined || trigger ) {
				if ( itm[1] !== undefined && itm[1] !== null )
					return __lua.makeMultiReturn(itm[0], itm[1]);
			}
			if ( cur === itm[0] ) trigger = true;
		}

		return null;
	} else {
		var listk = Object.keys(table);
		var trigger = false;
		for ( var i = 0; i < listk.length; ++i ) {
			var idx = listk[i];
			var sidx = idx;
			if ( typeof sidx == "number" ) sidx = sidx = 1;
			if ( cur === null || cur === undefined || trigger ) return __lua.makeMultiReturn(idx, table[sidx]);
			if ( cur === idx ) trigger = true;
		}
		return null;
	}
};

env.print = function print() { console.log.apply(console, arguments); };
env.pcall = this.__lua.pcall;

env.rawequals = function rawequals(a,b) { return a == b; };
env.rawget = function rawget(table, prop) { 
	if ( table instanceof LuaTable ) {
		if ( typeof prop == "number" ) return table.numeric[prop - 1];
		else return table.hash[prop];
	}
	return table[prop]; 
};
env.rawset = function rawset(table, prop, val) { 
	if ( table instanceof LuaTable ) {
		if ( typeof prop == "number" ) return table.numeric[prop - 1] = val;
		else return table.hash[prop] = val;
	}
	return table[prop] = val; 
};

env.something = function something(table) {
	var array = [];
	var idx = 1;
	while ( table[idx] !== undefined ) {
		array.push(table[idx]);
		++idx;
	}
	return __lua.makeMultiReturn.apply(__lua, array);
};
env.math = Math;

env.setmetatable = function setmetatable(target, meta) {

	Object.defineProperty(target, "__metatable", {value: meta, enumerable: false, configurable: true });
	return target;
};

env.getmetatable = function getmetatable(taget, meta) {
	return taget.__metatable;
};

var reduce = function reduce(arr, op) {
	if ( arr.length < 1 ) return undefined;
	var val = arr[0];
	for ( var i = 1; i < arr.length; ++i ) {
		val = op(val, arr[i]);
	}
	return val;
};

env.bit32 = {
	band: function band() { return reduce(arguments, function(a,b) { return a & b; }); },
	bor: function bor() { return reduce(arguments, function(a,b) { return a | b; }); },
	bxor: function bxor() { return reduce(arguments, function(a,b) { return a | b; }); },

	rshift: function rshift(b, disp) { return b >> disp; }
};

env.require = function require(what) {
	if ( what == "bit" ) return env.bit32;
	if ( what == "bit32" ) return env.bit32;
	throw "Module " + waht + " not found";
};

__lua.mark(env);
__lua.env = env;
for ( var idx in env ) this[idx] = env[idx];



/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = "\"use strict\";\n\n/*\n * glfx.js\n * http://evanw.github.com/glfx.js/\n *\n * Copyright 2011 Evan Wallace\n * Released under the MIT license\n */\nwindow.fx = function () {\n  function q(a, d, c) {\n    return Math.max(a, Math.min(d, c));\n  }function w(b) {\n    return { _: b, loadContentsOf: function loadContentsOf(b) {\n        a = this._.gl;this._.loadContentsOf(b);\n      }, destroy: function destroy() {\n        a = this._.gl;this._.destroy();\n      } };\n  }function A(a) {\n    return w(r.fromElement(a));\n  }function B(b, d) {\n    var c = a.UNSIGNED_BYTE;if (a.getExtension(\"OES_texture_float\") && a.getExtension(\"OES_texture_float_linear\")) {\n      var e = new r(100, 100, a.RGBA, a.FLOAT);try {\n        e.drawTo(function () {\n          c = a.FLOAT;\n        });\n      } catch (g) {}e.destroy();\n    }this._.texture && this._.texture.destroy();\n    this._.spareTexture && this._.spareTexture.destroy();this.width = b;this.height = d;this._.texture = new r(b, d, a.RGBA, c);this._.spareTexture = new r(b, d, a.RGBA, c);this._.extraTexture = this._.extraTexture || new r(0, 0, a.RGBA, c);this._.flippedShader = this._.flippedShader || new h(null, \"uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,vec2(texCoord.x,1.0-texCoord.y));}\");this._.isInitialized = !0;\n  }function C(a, d, c) {\n    this._.isInitialized && a._.width == this.width && a._.height == this.height || B.call(this, d ? d : a._.width, c ? c : a._.height);a._.use();this._.texture.drawTo(function () {\n      h.getDefaultShader().drawRect();\n    });return this;\n  }function D() {\n    this._.texture.use();this._.flippedShader.drawRect();return this;\n  }function f(a, d, c, e) {\n    (c || this._.texture).use();this._.spareTexture.drawTo(function () {\n      a.uniforms(d).drawRect();\n    });this._.spareTexture.swapWith(e || this._.texture);\n  }function E(a) {\n    a.parentNode.insertBefore(this, a);a.parentNode.removeChild(a);return this;\n  }\n  function F() {\n    var b = new r(this._.texture.width, this._.texture.height, a.RGBA, a.UNSIGNED_BYTE);this._.texture.use();b.drawTo(function () {\n      h.getDefaultShader().drawRect();\n    });return w(b);\n  }function G() {\n    var b = this._.texture.width,\n        d = this._.texture.height,\n        c = new Uint8Array(4 * b * d);this._.texture.drawTo(function () {\n      a.readPixels(0, 0, b, d, a.RGBA, a.UNSIGNED_BYTE, c);\n    });return c;\n  }function k(b) {\n    return function () {\n      a = this._.gl;return b.apply(this, arguments);\n    };\n  }function x(a, d, c, e, g, l, n, p) {\n    var m = c - g,\n        h = e - l,\n        f = n - g,\n        k = p - l;g = a - c + g - n;l = d - e + l - p;var q = m * k - f * h,\n        f = (g * k - f * l) / q,\n        m = (m * l - g * h) / q;return [c - a + f * c, e - d + f * e, f, n - a + m * n, p - d + m * p, m, a, d, 1];\n  }function y(a) {\n    var d = a[0],\n        c = a[1],\n        e = a[2],\n        g = a[3],\n        l = a[4],\n        n = a[5],\n        p = a[6],\n        m = a[7];a = a[8];var f = d * l * a - d * n * m - c * g * a + c * n * p + e * g * m - e * l * p;return [(l * a - n * m) / f, (e * m - c * a) / f, (c * n - e * l) / f, (n * p - g * a) / f, (d * a - e * p) / f, (e * g - d * n) / f, (g * m - l * p) / f, (c * p - d * m) / f, (d * l - c * g) / f];\n  }function z(a) {\n    var d = a.length;this.xa = [];this.ya = [];this.u = [];this.y2 = [];a.sort(function (a, b) {\n      return a[0] - b[0];\n    });for (var c = 0; c < d; c++) {\n      this.xa.push(a[c][0]), this.ya.push(a[c][1]);\n    }this.u[0] = 0;this.y2[0] = 0;for (c = 1; c < d - 1; ++c) {\n      a = this.xa[c + 1] - this.xa[c - 1];var e = (this.xa[c] - this.xa[c - 1]) / a,\n          g = e * this.y2[c - 1] + 2;this.y2[c] = (e - 1) / g;this.u[c] = (6 * ((this.ya[c + 1] - this.ya[c]) / (this.xa[c + 1] - this.xa[c]) - (this.ya[c] - this.ya[c - 1]) / (this.xa[c] - this.xa[c - 1])) / a - e * this.u[c - 1]) / g;\n    }this.y2[d - 1] = 0;for (c = d - 2; 0 <= c; --c) {\n      this.y2[c] = this.y2[c] * this.y2[c + 1] + this.u[c];\n    }\n  }function u(a, d) {\n    return new h(null, a + \"uniform sampler2D texture;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 coord=texCoord*texSize;\" + d + \"gl_FragColor=texture2D(texture,coord/texSize);vec2 clampedCoord=clamp(coord,vec2(0.0),texSize);if(coord!=clampedCoord){gl_FragColor.a*=max(0.0,1.0-length(coord-clampedCoord));}}\");\n  }function H(b, d) {\n    a.brightnessContrast = a.brightnessContrast || new h(null, \"uniform sampler2D texture;uniform float brightness;uniform float contrast;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.rgb+=brightness;if(contrast>0.0){color.rgb=(color.rgb-0.5)/(1.0-contrast)+0.5;}else{color.rgb=(color.rgb-0.5)*(1.0+contrast)+0.5;}gl_FragColor=color;}\");\n    f.call(this, a.brightnessContrast, { brightness: q(-1, b, 1), contrast: q(-1, d, 1) });return this;\n  }function t(a) {\n    a = new z(a);for (var d = [], c = 0; 256 > c; c++) {\n      d.push(q(0, Math.floor(256 * a.interpolate(c / 255)), 255));\n    }return d;\n  }function I(b, d, c) {\n    b = t(b);1 == arguments.length ? d = c = b : (d = t(d), c = t(c));for (var e = [], g = 0; 256 > g; g++) {\n      e.splice(e.length, 0, b[g], d[g], c[g], 255);\n    }this._.extraTexture.initFromBytes(256, 1, e);this._.extraTexture.use(1);a.curves = a.curves || new h(null, \"uniform sampler2D texture;uniform sampler2D map;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.r=texture2D(map,vec2(color.r)).r;color.g=texture2D(map,vec2(color.g)).g;color.b=texture2D(map,vec2(color.b)).b;gl_FragColor=color;}\");\n    a.curves.textures({ map: 1 });f.call(this, a.curves, {});return this;\n  }function J(b) {\n    a.denoise = a.denoise || new h(null, \"uniform sampler2D texture;uniform float exponent;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec4 center=texture2D(texture,texCoord);vec4 color=vec4(0.0);float total=0.0;for(float x=-4.0;x<=4.0;x+=1.0){for(float y=-4.0;y<=4.0;y+=1.0){vec4 sample=texture2D(texture,texCoord+vec2(x,y)/texSize);float weight=1.0-abs(dot(sample.rgb-center.rgb,vec3(0.25)));weight=pow(weight,exponent);color+=sample*weight;total+=weight;}}gl_FragColor=color/total;}\");\n    for (var d = 0; 2 > d; d++) {\n      f.call(this, a.denoise, { exponent: Math.max(0, b), texSize: [this.width, this.height] });\n    }return this;\n  }function K(b, d) {\n    a.hueSaturation = a.hueSaturation || new h(null, \"uniform sampler2D texture;uniform float hue;uniform float saturation;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float angle=hue*3.14159265;float s=sin(angle),c=cos(angle);vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;float len=length(color.rgb);color.rgb=vec3(dot(color.rgb,weights.xyz),dot(color.rgb,weights.zxy),dot(color.rgb,weights.yzx));float average=(color.r+color.g+color.b)/3.0;if(saturation>0.0){color.rgb+=(average-color.rgb)*(1.0-1.0/(1.001-saturation));}else{color.rgb+=(average-color.rgb)*(-saturation);}gl_FragColor=color;}\");\n    f.call(this, a.hueSaturation, { hue: q(-1, b, 1), saturation: q(-1, d, 1) });return this;\n  }function L(b) {\n    a.noise = a.noise || new h(null, \"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 color=texture2D(texture,texCoord);float diff=(rand(texCoord)-0.5)*amount;color.r+=diff;color.g+=diff;color.b+=diff;gl_FragColor=color;}\");\n    f.call(this, a.noise, { amount: q(0, b, 1) });return this;\n  }function M(b) {\n    a.sepia = a.sepia || new h(null, \"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float r=color.r;float g=color.g;float b=color.b;color.r=min(1.0,(r*(1.0-(0.607*amount)))+(g*(0.769*amount))+(b*(0.189*amount)));color.g=min(1.0,(r*0.349*amount)+(g*(1.0-(0.314*amount)))+(b*0.168*amount));color.b=min(1.0,(r*0.272*amount)+(g*0.534*amount)+(b*(1.0-(0.869*amount))));gl_FragColor=color;}\");\n    f.call(this, a.sepia, { amount: q(0, b, 1) });return this;\n  }function N(b, d) {\n    a.unsharpMask = a.unsharpMask || new h(null, \"uniform sampler2D blurredTexture;uniform sampler2D originalTexture;uniform float strength;uniform float threshold;varying vec2 texCoord;void main(){vec4 blurred=texture2D(blurredTexture,texCoord);vec4 original=texture2D(originalTexture,texCoord);gl_FragColor=mix(blurred,original,1.0+strength);}\");\n    this._.extraTexture.ensureFormat(this._.texture);this._.texture.use();this._.extraTexture.drawTo(function () {\n      h.getDefaultShader().drawRect();\n    });this._.extraTexture.use(1);this.triangleBlur(b);a.unsharpMask.textures({ originalTexture: 1 });f.call(this, a.unsharpMask, { strength: d });this._.extraTexture.unuse(1);return this;\n  }function O(b) {\n    a.vibrance = a.vibrance || new h(null, \"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-amount*3.0);color.rgb=mix(color.rgb,vec3(mx),amt);gl_FragColor=color;}\");\n    f.call(this, a.vibrance, { amount: q(-1, b, 1) });return this;\n  }function P(b, d) {\n    a.vignette = a.vignette || new h(null, \"uniform sampler2D texture;uniform float size;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float dist=distance(texCoord,vec2(0.5,0.5));color.rgb*=smoothstep(0.8,size*0.799,dist*(amount+size));gl_FragColor=color;}\");\n    f.call(this, a.vignette, { size: q(0, b, 1), amount: q(0, d, 1) });return this;\n  }function Q(b, d, c) {\n    a.lensBlurPrePass = a.lensBlurPrePass || new h(null, \"uniform sampler2D texture;uniform float power;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color=pow(color,vec4(power));gl_FragColor=vec4(color);}\");var e = \"uniform sampler2D texture0;uniform sampler2D texture1;uniform vec2 delta0;uniform vec2 delta1;uniform float power;varying vec2 texCoord;\" + s + \"vec4 sample(vec2 delta){float offset=random(vec3(delta,151.7182),0.0);vec4 color=vec4(0.0);float total=0.0;for(float t=0.0;t<=30.0;t++){float percent=(t+offset)/30.0;color+=texture2D(texture0,texCoord+delta*percent);total+=1.0;}return color/total;}\";\n    a.lensBlur0 = a.lensBlur0 || new h(null, e + \"void main(){gl_FragColor=sample(delta0);}\");a.lensBlur1 = a.lensBlur1 || new h(null, e + \"void main(){gl_FragColor=(sample(delta0)+sample(delta1))*0.5;}\");a.lensBlur2 = a.lensBlur2 || new h(null, e + \"void main(){vec4 color=(sample(delta0)+2.0*texture2D(texture1,texCoord))/3.0;gl_FragColor=pow(color,vec4(power));}\").textures({ texture1: 1 });for (var e = [], g = 0; 3 > g; g++) {\n      var l = c + 2 * g * Math.PI / 3;e.push([b * Math.sin(l) / this.width, b * Math.cos(l) / this.height]);\n    }b = Math.pow(10, q(-1, d, 1));f.call(this, a.lensBlurPrePass, { power: b });this._.extraTexture.ensureFormat(this._.texture);f.call(this, a.lensBlur0, { delta0: e[0] }, this._.texture, this._.extraTexture);f.call(this, a.lensBlur1, { delta0: e[1], delta1: e[2] }, this._.extraTexture, this._.extraTexture);f.call(this, a.lensBlur0, { delta0: e[1] });this._.extraTexture.use(1);f.call(this, a.lensBlur2, { power: 1 / b, delta0: e[2] });return this;\n  }\n  function R(b, d, c, e, g, l) {\n    a.tiltShift = a.tiltShift || new h(null, \"uniform sampler2D texture;uniform float blurRadius;uniform float gradientRadius;uniform vec2 start;uniform vec2 end;uniform vec2 delta;uniform vec2 texSize;varying vec2 texCoord;\" + s + \"void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);vec2 normal=normalize(vec2(start.y-end.y,end.x-start.x));float radius=smoothstep(0.0,1.0,abs(dot(texCoord*texSize-start,normal))/gradientRadius)*blurRadius;for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta/texSize*percent*radius);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}\");\n    var n = c - b,\n        p = e - d,\n        m = Math.sqrt(n * n + p * p);f.call(this, a.tiltShift, { blurRadius: g, gradientRadius: l, start: [b, d], end: [c, e], delta: [n / m, p / m], texSize: [this.width, this.height] });f.call(this, a.tiltShift, { blurRadius: g, gradientRadius: l, start: [b, d], end: [c, e], delta: [-p / m, n / m], texSize: [this.width, this.height] });return this;\n  }function S(b) {\n    a.triangleBlur = a.triangleBlur || new h(null, \"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;\" + s + \"void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta*percent);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}\");\n    f.call(this, a.triangleBlur, { delta: [b / this.width, 0] });f.call(this, a.triangleBlur, { delta: [0, b / this.height] });return this;\n  }function T(b, d, c) {\n    a.zoomBlur = a.zoomBlur || new h(null, \"uniform sampler2D texture;uniform vec2 center;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;\" + s + \"void main(){vec4 color=vec4(0.0);float total=0.0;vec2 toCenter=center-texCoord*texSize;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=0.0;t<=40.0;t++){float percent=(t+offset)/40.0;float weight=4.0*(percent-percent*percent);vec4 sample=texture2D(texture,texCoord+toCenter*percent*strength/texSize);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}\");\n    f.call(this, a.zoomBlur, { center: [b, d], strength: c, texSize: [this.width, this.height] });return this;\n  }function U(b, d, c, e) {\n    a.colorHalftone = a.colorHalftone || new h(null, \"uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(float angle){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);vec3 cmy=1.0-color.rgb;float k=min(cmy.x,min(cmy.y,cmy.z));cmy=(cmy-k)/(1.0-k);cmy=clamp(cmy*10.0-3.0+vec3(pattern(angle+0.26179),pattern(angle+1.30899),pattern(angle)),0.0,1.0);k=clamp(k*10.0-5.0+pattern(angle+0.78539),0.0,1.0);gl_FragColor=vec4(1.0-cmy-k,color.a);}\");\n    f.call(this, a.colorHalftone, { center: [b, d], angle: c, scale: Math.PI / e, texSize: [this.width, this.height] });return this;\n  }function V(b, d, c, e) {\n    a.dotScreen = a.dotScreen || new h(null, \"uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;gl_FragColor=vec4(vec3(average*10.0-5.0+pattern()),color.a);}\");\n    f.call(this, a.dotScreen, { center: [b, d], angle: c, scale: Math.PI / e, texSize: [this.width, this.height] });return this;\n  }function W(b) {\n    a.edgeWork1 = a.edgeWork1 || new h(null, \"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;\" + s + \"void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec3 sample=texture2D(texture,texCoord+delta*percent).rgb;float average=(sample.r+sample.g+sample.b)/3.0;color.x+=average*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=average*weight;total.y+=weight;}}gl_FragColor=vec4(color/total,0.0,1.0);}\");\n    a.edgeWork2 = a.edgeWork2 || new h(null, \"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;\" + s + \"void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec2 sample=texture2D(texture,texCoord+delta*percent).xy;color.x+=sample.x*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=sample.y*weight;total.y+=weight;}}float c=clamp(10000.0*(color.y/total.y-color.x/total.x)+0.5,0.0,1.0);gl_FragColor=vec4(c,c,c,1.0);}\");\n    f.call(this, a.edgeWork1, { delta: [b / this.width, 0] });f.call(this, a.edgeWork2, { delta: [0, b / this.height] });return this;\n  }function X(b, d, c) {\n    a.hexagonalPixelate = a.hexagonalPixelate || new h(null, \"uniform sampler2D texture;uniform vec2 center;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 tex=(texCoord*texSize-center)/scale;tex.y/=0.866025404;tex.x-=tex.y*0.5;vec2 a;if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));else a=vec2(ceil(tex.x),ceil(tex.y));vec2 b=vec2(ceil(tex.x),floor(tex.y));vec2 c=vec2(floor(tex.x),ceil(tex.y));vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);float alen=length(TEX-A);float blen=length(TEX-B);float clen=length(TEX-C);vec2 choice;if(alen<blen){if(alen<clen)choice=a;else choice=c;}else{if(blen<clen)choice=b;else choice=c;}choice.x+=choice.y*0.5;choice.y*=0.866025404;choice*=scale/texSize;gl_FragColor=texture2D(texture,choice+center/texSize);}\");\n    f.call(this, a.hexagonalPixelate, { center: [b, d], scale: c, texSize: [this.width, this.height] });return this;\n  }function Y(b) {\n    a.ink = a.ink || new h(null, \"uniform sampler2D texture;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 dx=vec2(1.0/texSize.x,0.0);vec2 dy=vec2(0.0,1.0/texSize.y);vec4 color=texture2D(texture,texCoord);float bigTotal=0.0;float smallTotal=0.0;vec3 bigAverage=vec3(0.0);vec3 smallAverage=vec3(0.0);for(float x=-2.0;x<=2.0;x+=1.0){for(float y=-2.0;y<=2.0;y+=1.0){vec3 sample=texture2D(texture,texCoord+dx*x+dy*y).rgb;bigAverage+=sample;bigTotal+=1.0;if(abs(x)+abs(y)<2.0){smallAverage+=sample;smallTotal+=1.0;}}}vec3 edge=max(vec3(0.0),bigAverage/bigTotal-smallAverage/smallTotal);gl_FragColor=vec4(color.rgb-dot(edge,edge)*strength*100000.0,color.a);}\");\n    f.call(this, a.ink, { strength: b * b * b * b * b, texSize: [this.width, this.height] });return this;\n  }function Z(b, d, c, e) {\n    a.bulgePinch = a.bulgePinch || u(\"uniform float radius;uniform float strength;uniform vec2 center;\", \"coord-=center;float distance=length(coord);if(distance<radius){float percent=distance/radius;if(strength>0.0){coord*=mix(1.0,smoothstep(0.0,radius/distance,percent),strength*0.75);}else{coord*=mix(1.0,pow(percent,1.0+strength*0.75)*radius/distance,1.0-percent);}}coord+=center;\");\n    f.call(this, a.bulgePinch, { radius: c, strength: q(-1, e, 1), center: [b, d], texSize: [this.width, this.height] });return this;\n  }function $(b, d, c) {\n    a.matrixWarp = a.matrixWarp || u(\"uniform mat3 matrix;uniform bool useTextureSpace;\", \"if(useTextureSpace)coord=coord/texSize*2.0-1.0;vec3 warp=matrix*vec3(coord,1.0);coord=warp.xy/warp.z;if(useTextureSpace)coord=(coord*0.5+0.5)*texSize;\");b = Array.prototype.concat.apply([], b);if (4 == b.length) b = [b[0], b[1], 0, b[2], b[3], 0, 0, 0, 1];else if (9 != b.length) throw \"can only warp with 2x2 or 3x3 matrix\";f.call(this, a.matrixWarp, { matrix: d ? y(b) : b, texSize: [this.width, this.height], useTextureSpace: c | 0 });return this;\n  }function aa(a, d) {\n    var c = x.apply(null, d),\n        e = x.apply(null, a),\n        c = y(c);return this.matrixWarp([c[0] * e[0] + c[1] * e[3] + c[2] * e[6], c[0] * e[1] + c[1] * e[4] + c[2] * e[7], c[0] * e[2] + c[1] * e[5] + c[2] * e[8], c[3] * e[0] + c[4] * e[3] + c[5] * e[6], c[3] * e[1] + c[4] * e[4] + c[5] * e[7], c[3] * e[2] + c[4] * e[5] + c[5] * e[8], c[6] * e[0] + c[7] * e[3] + c[8] * e[6], c[6] * e[1] + c[7] * e[4] + c[8] * e[7], c[6] * e[2] + c[7] * e[5] + c[8] * e[8]]);\n  }function ba(b, d, c, e) {\n    a.swirl = a.swirl || u(\"uniform float radius;uniform float angle;uniform vec2 center;\", \"coord-=center;float distance=length(coord);if(distance<radius){float percent=(radius-distance)/radius;float theta=percent*percent*angle;float s=sin(theta);float c=cos(theta);coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);}coord+=center;\");\n    f.call(this, a.swirl, { radius: c, center: [b, d], angle: e, texSize: [this.width, this.height] });return this;\n  }var v = {};(function () {\n    function a(b) {\n      if (!b.getExtension(\"OES_texture_float\")) return !1;var c = b.createFramebuffer(),\n          e = b.createTexture();b.bindTexture(b.TEXTURE_2D, e);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);\n      b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 1, 1, 0, b.RGBA, b.UNSIGNED_BYTE, null);b.bindFramebuffer(b.FRAMEBUFFER, c);b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, e, 0);c = b.createTexture();b.bindTexture(b.TEXTURE_2D, c);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 2, 2, 0, b.RGBA, b.FLOAT, new Float32Array([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));var e = b.createProgram(),\n          d = b.createShader(b.VERTEX_SHADER),\n          g = b.createShader(b.FRAGMENT_SHADER);b.shaderSource(d, \"attribute vec2 vertex;void main(){gl_Position=vec4(vertex,0.0,1.0);}\");b.shaderSource(g, \"uniform sampler2D texture;void main(){gl_FragColor=texture2D(texture,vec2(0.5));}\");b.compileShader(d);b.compileShader(g);b.attachShader(e, d);b.attachShader(e, g);b.linkProgram(e);d = b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER, d);b.bufferData(b.ARRAY_BUFFER, new Float32Array([0, 0]), b.STREAM_DRAW);b.enableVertexAttribArray(0);b.vertexAttribPointer(0, 2, b.FLOAT, !1, 0, 0);d = new Uint8Array(4);b.useProgram(e);b.viewport(0, 0, 1, 1);b.bindTexture(b.TEXTURE_2D, c);b.drawArrays(b.POINTS, 0, 1);b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, d);return 127 === d[0] || 128 === d[0];\n    }function d() {}function c(a) {\n      \"OES_texture_float_linear\" === a ? (void 0 === this.$OES_texture_float_linear$ && Object.defineProperty(this, \"$OES_texture_float_linear$\", { enumerable: !1, configurable: !1, writable: !1, value: new d() }), a = this.$OES_texture_float_linear$) : a = n.call(this, a);return a;\n    }function e() {\n      var a = f.call(this);-1 === a.indexOf(\"OES_texture_float_linear\") && a.push(\"OES_texture_float_linear\");return a;\n    }try {\n      var g = document.createElement(\"canvas\").getContext(\"experimental-webgl\");\n    } catch (l) {}if (g && -1 === g.getSupportedExtensions().indexOf(\"OES_texture_float_linear\") && a(g)) {\n      var n = WebGLRenderingContext.prototype.getExtension,\n          f = WebGLRenderingContext.prototype.getSupportedExtensions;\n      WebGLRenderingContext.prototype.getExtension = c;WebGLRenderingContext.prototype.getSupportedExtensions = e;\n    }\n  })();var a;v.canvas = function () {\n    var b = document.createElement(\"canvas\");try {\n      a = b.getContext(\"experimental-webgl\", { premultipliedAlpha: !1 });\n    } catch (d) {\n      a = null;\n    }if (!a) throw \"This browser does not support WebGL\";b._ = { gl: a, isInitialized: !1, texture: null, spareTexture: null, flippedShader: null };b.texture = k(A);b.draw = k(C);b.update = k(D);b.replace = k(E);b.contents = k(F);b.getPixelArray = k(G);b.brightnessContrast = k(H);\n    b.hexagonalPixelate = k(X);b.hueSaturation = k(K);b.colorHalftone = k(U);b.triangleBlur = k(S);b.unsharpMask = k(N);b.perspective = k(aa);b.matrixWarp = k($);b.bulgePinch = k(Z);b.tiltShift = k(R);b.dotScreen = k(V);b.edgeWork = k(W);b.lensBlur = k(Q);b.zoomBlur = k(T);b.noise = k(L);b.denoise = k(J);b.curves = k(I);b.swirl = k(ba);b.ink = k(Y);b.vignette = k(P);b.vibrance = k(O);b.sepia = k(M);return b;\n  };v.splineInterpolate = t;var h = function () {\n    function b(b, c) {\n      var e = a.createShader(b);a.shaderSource(e, c);a.compileShader(e);if (!a.getShaderParameter(e, a.COMPILE_STATUS)) throw \"compile error: \" + a.getShaderInfoLog(e);return e;\n    }function d(d, l) {\n      this.texCoordAttribute = this.vertexAttribute = null;this.program = a.createProgram();d = d || c;l = l || e;l = \"precision highp float;\" + l;a.attachShader(this.program, b(a.VERTEX_SHADER, d));a.attachShader(this.program, b(a.FRAGMENT_SHADER, l));a.linkProgram(this.program);if (!a.getProgramParameter(this.program, a.LINK_STATUS)) throw \"link error: \" + a.getProgramInfoLog(this.program);\n    }var c = \"attribute vec2 vertex;attribute vec2 _texCoord;varying vec2 texCoord;void main(){texCoord=_texCoord;gl_Position=vec4(vertex*2.0-1.0,0.0,1.0);}\",\n        e = \"uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,texCoord);}\";d.prototype.destroy = function () {\n      a.deleteProgram(this.program);this.program = null;\n    };d.prototype.uniforms = function (b) {\n      a.useProgram(this.program);for (var e in b) {\n        if (b.hasOwnProperty(e)) {\n          var c = a.getUniformLocation(this.program, e);if (null !== c) {\n            var d = b[e];if (\"[object Array]\" == Object.prototype.toString.call(d)) switch (d.length) {case 1:\n                a.uniform1fv(c, new Float32Array(d));break;\n              case 2:\n                a.uniform2fv(c, new Float32Array(d));break;case 3:\n                a.uniform3fv(c, new Float32Array(d));break;case 4:\n                a.uniform4fv(c, new Float32Array(d));break;case 9:\n                a.uniformMatrix3fv(c, !1, new Float32Array(d));break;case 16:\n                a.uniformMatrix4fv(c, !1, new Float32Array(d));break;default:\n                throw \"dont't know how to load uniform \\\"\" + e + '\" of length ' + d.length;} else if (\"[object Number]\" == Object.prototype.toString.call(d)) a.uniform1f(c, d);else throw 'attempted to set uniform \"' + e + '\" to invalid value ' + (d || \"undefined\").toString();\n          }\n        }\n      }return this;\n    };d.prototype.textures = function (b) {\n      a.useProgram(this.program);for (var c in b) {\n        b.hasOwnProperty(c) && a.uniform1i(a.getUniformLocation(this.program, c), b[c]);\n      }return this;\n    };d.prototype.drawRect = function (b, c, e, d) {\n      var f = a.getParameter(a.VIEWPORT);c = void 0 !== c ? (c - f[1]) / f[3] : 0;b = void 0 !== b ? (b - f[0]) / f[2] : 0;e = void 0 !== e ? (e - f[0]) / f[2] : 1;d = void 0 !== d ? (d - f[1]) / f[3] : 1;null == a.vertexBuffer && (a.vertexBuffer = a.createBuffer());a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);a.bufferData(a.ARRAY_BUFFER, new Float32Array([b, c, b, d, e, c, e, d]), a.STATIC_DRAW);null == a.texCoordBuffer && (a.texCoordBuffer = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer), a.bufferData(a.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), a.STATIC_DRAW));null == this.vertexAttribute && (this.vertexAttribute = a.getAttribLocation(this.program, \"vertex\"), a.enableVertexAttribArray(this.vertexAttribute));null == this.texCoordAttribute && (this.texCoordAttribute = a.getAttribLocation(this.program, \"_texCoord\"), a.enableVertexAttribArray(this.texCoordAttribute));\n      a.useProgram(this.program);a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);a.vertexAttribPointer(this.vertexAttribute, 2, a.FLOAT, !1, 0, 0);a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer);a.vertexAttribPointer(this.texCoordAttribute, 2, a.FLOAT, !1, 0, 0);a.drawArrays(a.TRIANGLE_STRIP, 0, 4);\n    };d.getDefaultShader = function () {\n      a.defaultShader = a.defaultShader || new d();return a.defaultShader;\n    };return d;\n  }();z.prototype.interpolate = function (a) {\n    for (var d = 0, c = this.ya.length - 1; 1 < c - d;) {\n      var e = c + d >> 1;this.xa[e] > a ? c = e : d = e;\n    }var e = this.xa[c] - this.xa[d],\n        g = (this.xa[c] - a) / e;a = (a - this.xa[d]) / e;return g * this.ya[d] + a * this.ya[c] + ((g * g * g - g) * this.y2[d] + (a * a * a - a) * this.y2[c]) * e * e / 6;\n  };var r = function () {\n    function b(b, c, d, f) {\n      this.gl = a;this.id = a.createTexture();this.width = b;this.height = c;this.format = d;this.type = f;a.bindTexture(a.TEXTURE_2D, this.id);a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);b && c && a.texImage2D(a.TEXTURE_2D, 0, this.format, b, c, 0, this.format, this.type, null);\n    }function d(a) {\n      null == c && (c = document.createElement(\"canvas\"));c.width = a.width;c.height = a.height;a = c.getContext(\"2d\");a.clearRect(0, 0, c.width, c.height);return a;\n    }b.fromElement = function (c) {\n      var d = new b(0, 0, a.RGBA, a.UNSIGNED_BYTE);d.loadContentsOf(c);return d;\n    };b.prototype.loadContentsOf = function (b) {\n      this.width = b.width || b.videoWidth;this.height = b.height || b.videoHeight;a.bindTexture(a.TEXTURE_2D, this.id);a.texImage2D(a.TEXTURE_2D, 0, this.format, this.format, this.type, b);\n    };b.prototype.initFromBytes = function (b, c, d) {\n      this.width = b;this.height = c;this.format = a.RGBA;this.type = a.UNSIGNED_BYTE;a.bindTexture(a.TEXTURE_2D, this.id);a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, b, c, 0, a.RGBA, this.type, new Uint8Array(d));\n    };b.prototype.destroy = function () {\n      a.deleteTexture(this.id);this.id = null;\n    };b.prototype.use = function (b) {\n      a.activeTexture(a.TEXTURE0 + (b || 0));a.bindTexture(a.TEXTURE_2D, this.id);\n    };b.prototype.unuse = function (b) {\n      a.activeTexture(a.TEXTURE0 + (b || 0));a.bindTexture(a.TEXTURE_2D, null);\n    };b.prototype.ensureFormat = function (b, c, d, f) {\n      if (1 == arguments.length) {\n        var h = arguments[0];b = h.width;c = h.height;d = h.format;f = h.type;\n      }if (b != this.width || c != this.height || d != this.format || f != this.type) this.width = b, this.height = c, this.format = d, this.type = f, a.bindTexture(a.TEXTURE_2D, this.id), a.texImage2D(a.TEXTURE_2D, 0, this.format, b, c, 0, this.format, this.type, null);\n    };b.prototype.drawTo = function (b) {\n      a.framebuffer = a.framebuffer || a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER, a.framebuffer);a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.id, 0);if (a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE) throw Error(\"incomplete framebuffer\");a.viewport(0, 0, this.width, this.height);b();a.bindFramebuffer(a.FRAMEBUFFER, null);\n    };var c = null;b.prototype.fillUsingCanvas = function (b) {\n      b(d(this));this.format = a.RGBA;this.type = a.UNSIGNED_BYTE;a.bindTexture(a.TEXTURE_2D, this.id);a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, c);return this;\n    };\n    b.prototype.toImage = function (b) {\n      this.use();h.getDefaultShader().drawRect();var f = 4 * this.width * this.height,\n          k = new Uint8Array(f),\n          n = d(this),\n          p = n.createImageData(this.width, this.height);a.readPixels(0, 0, this.width, this.height, a.RGBA, a.UNSIGNED_BYTE, k);for (var m = 0; m < f; m++) {\n        p.data[m] = k[m];\n      }n.putImageData(p, 0, 0);b.src = c.toDataURL();\n    };b.prototype.swapWith = function (a) {\n      var b;b = a.id;a.id = this.id;this.id = b;b = a.width;a.width = this.width;this.width = b;b = a.height;a.height = this.height;this.height = b;b = a.format;a.format = this.format;this.format = b;\n    };return b;\n  }(),\n      s = \"float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}\";return v;\n}();"

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = "\"use strict\";\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/*\n  pngtoy version 0.5.5 ALPHA\n  (c) 2015-2016 Epistemex.com\n  MIT License\n*/\nfunction PngToy(c) {\n  c = c || {};this.doCRC = a(c.doCRC) ? c.doCRC : !0;this.allowInvalid = a(c.allowInvalid) ? c.allowInvalid : !1;this.beforeSend = c.beforeSend || b;function b() {}this.url = null;this.buffer = null;this.view = null;this.chunks = null;this.debug = {};function a(d) {\n    return typeof d === \"boolean\";\n  }\n}PngToy.prototype = { fetch: function fetch(b) {\n    var a = this;a.url = b;a.buffer = a.chunks = a.view = null;a._pos = 0;return new Promise(function (e, d) {\n      try {\n        var f = new XMLHttpRequest();f.open(\"GET\", b, !0);f.responseType = \"arraybuffer\";a.beforeSend(f);f.onerror = function (g) {\n          d(\"Network error. \" + g.message);\n        };f.onload = function () {\n          if (f.status === 200) {\n            var h = new DataView(f.response),\n                g;if (h.getUint32(0) === 2303741511 && h.getUint32(4) === 218765834) {\n              a.buffer = h.buffer;a.view = h;g = PngToy._getChunks(a.buffer, a.view, a.doCRC, a.allowInvalid);a.chunks = g.chunks || null;if (a.chunks || a.allowInvalid) {\n                e();\n              } else {\n                d(g.error);\n              }\n            } else {\n              d(\"Not a PNG file.\");\n            }\n          } else {\n            d(\"Loading error:\" + f.statusText);\n          }\n        };f.send();\n      } catch (c) {\n        d(c.message);\n      }\n    });\n  }, getChunk: function getChunk(a) {\n    var b = [\"IHDR\", \"IDAT\", \"PLTE\", \"sPLT\", \"tRNS\", \"iTXt\", \"tEXt\", \"zTXt\", \"iCCP\", \"gAMA\", \"cHRM\", \"sRGB\", \"hIST\", \"sBIT\", \"pHYs\", \"bKGD\", \"tIME\", \"oFFs\", \"sTER\", \"sCAL\", \"pCAL\", \"IEND\"];if (b.indexOf(a) > -1) {\n      return a === \"IEND\" ? !!PngToy._findChunk(this.chunks, \"IEND\") : PngToy[\"_\" + a](this);\n    } else {\n      return PngToy._findChunk(this.chunks, a);\n    }\n  }, getGammaLUT: function getGammaLUT(c, b, f) {\n    c = c || 1;b = b || 2.2;f = f || 1;var a = new Uint8Array(256),\n        e = 0,\n        d = 1 / (c * b * f);for (; e < 256; e++) {\n      a[e] = Math.round(Math.pow(e / 255, d) * 255);\n    }return a;\n  }, guessDisplayGamma: function guessDisplayGamma() {\n    return navigator.userAgent.indexOf(\"Mac OS\") > -1 ? 1.8 : 2.2;\n  } };PngToy._blockSize = 3000000;PngToy._delay = 7;PngToy._getChunks = function (b, F, k, a) {\n  var x = this,\n      C = 8,\n      v = b.byteLength,\n      e = [],\n      d,\n      w,\n      m,\n      A,\n      h,\n      g,\n      B,\n      E,\n      p,\n      z,\n      D,\n      t = !0,\n      y = [\"iTXT\", \"tIME\", \"tEXt\", \"zTXt\"],\n      l = PngToy._findChunk;if (k && !this.table) {\n    this.table = new Uint32Array(256);for (var q = 0, u; q < 256; q++) {\n      h = q >>> 0;for (u = 0; u < 8; u++) {\n        h = h & 1 ? 3988292384 ^ h >>> 1 : h >>> 1;\n      }this.table[q] = h;\n    }\n  }while (C < v) {\n    w = o();m = n();if (w > 2147483647 && !a) {\n      return { error: \"Invalid chunk size.\" };\n    }A = C;C = A + w;h = o();d = new PngToy.Chunk(m, A, w, h);if (k) {\n      c(d);if (!d.crcOk && !a) {\n        return { error: \"Invalid CRC in chunk \" + m };\n      }\n    }if (d.isReserved && !a) {\n      return { error: \"Invalid chunk name: \" + m };\n    }e.push(d);\n  }if (!a) {\n    if (!f(\"IHDR\", 1, 1)) {\n      return { error: \"Invalid number of IHDR chunks.\" };\n    }if (!f(\"tIME\", 0, 1)) {\n      return { error: \"Invalid number of tIME chunks.\" };\n    }if (!f(\"zTXt\", 0, -1)) {\n      return { error: \"Invalid number of zTXt chunks.\" };\n    }if (!f(\"tEXt\", 0, -1)) {\n      return { error: \"Invalid number of tEXt chunks.\" };\n    }if (!f(\"iTXt\", 0, -1)) {\n      return { error: \"Invalid number of iTXt chunks.\" };\n    }if (!f(\"pHYs\", 0, 1)) {\n      return { error: \"Invalid number of pHYs chunks.\" };\n    }if (!f(\"sPLT\", 0, -1)) {\n      return { error: \"Invalid number of sPLT chunks.\" };\n    }if (!f(\"iCCP\", 0, 1)) {\n      return { error: \"Invalid number of iCCP chunks.\" };\n    }if (!f(\"sRGB\", 0, 1)) {\n      return { error: \"Invalid number of sRGB chunks.\" };\n    }if (!f(\"sBIT\", 0, 1)) {\n      return { error: \"Invalid number of sBIT chunks.\" };\n    }if (!f(\"gAMA\", 0, 1)) {\n      return { error: \"Invalid number of gAMA chunks.\" };\n    }if (!f(\"cHRM\", 0, 1)) {\n      return { error: \"Invalid number of cHRM chunks.\" };\n    }if (!f(\"PLTE\", 0, 1)) {\n      return { error: \"Invalid number of PLTE chunks.\" };\n    }if (!f(\"tRNS\", 0, 1)) {\n      return { error: \"Invalid number of tRNS chunks.\" };\n    }if (!f(\"hIST\", 0, 1)) {\n      return { error: \"Invalid number of hIST chunks.\" };\n    }if (!f(\"bKGD\", 0, 1)) {\n      return { error: \"Invalid number of bKGD chunks.\" };\n    }if (!f(\"IDAT\", 1, -1)) {\n      return { error: \"Invalid number of IDAT chunks.\" };\n    }if (!f(\"IEND\", 1, 1)) {\n      return { error: \"Invalid number of IEND chunks.\" };\n    }if (e[0].name !== \"IHDR\" || e[e.length - 1].name !== \"IEND\") {\n      return { error: \"Invalid PNG chunk order.\" };\n    }g = F.getUint8(l(e, \"IHDR\").offset + 9);B = l(e, \"PLTE\");p = l(e, \"hIST\");E = l(e, \"tRNS\");z = l(e, \"oFFs\");D = l(e, \"sTER\");if (l(e, \"iCCP\") && l(e, \"sRGB\")) {\n      return { error: \"Both iCCP and sRGB cannot be present.\" };\n    }if (g === 3 && !B) {\n      return { error: \"Missing PLTE chunk.\" };\n    }if ((g === 0 || g === 4) && B) {\n      return { error: \"PLTE chunk should not appear with this color type.\" };\n    }if ((g === 4 || g === 6) && E) {\n      return { error: \"tRNS chunk should not appear with this color type.\" };\n    }if (p && !B) {\n      return { error: \"hIST chunk can only appear if a PLTE chunk is present.\" };\n    }if (B) {\n      if (!r(\"PLTE\", \"IDAT\")) {\n        return { error: \"Invalid chunk order for PLTE.\" };\n      }if (p && !s(\"PLTE\", \"hIST\", \"IDAT\")) {\n        return { error: \"Invalid chunk order for hIST.\" };\n      }if (E && !s(\"PLTE\", \"tRNS\", \"IDAT\")) {\n        return { error: \"Invalid chunk order for tRNS.\" };\n      }if (l(e, \"bKGD\") && !s(\"PLTE\", \"bKGD\", \"IDAT\")) {\n        return { error: \"Invalid chunk order for bKGD.\" };\n      }if (!r(\"cHRM\", \"PLTE\")) {\n        return { error: \"Invalid chunk order for cHRM.\" };\n      }if (!r(\"gAMA\", \"PLTE\")) {\n        return { error: \"Invalid chunk order for gAMA.\" };\n      }if (!r(\"iCCP\", \"PLTE\")) {\n        return { error: \"Invalid chunk order for iCCP.\" };\n      }if (!r(\"sRGB\", \"PLTE\")) {\n        return { error: \"Invalid chunk order for sRGB.\" };\n      }\n    }if (z && !r(\"oFFs\", \"IDAT\")) {\n      return { error: \"Invalid chunk order for oFFs.\" };\n    }if (D && !r(\"sTER\", \"IDAT\")) {\n      return { error: \"Invalid chunk order for sTER.\" };\n    }for (q = e.length - 2; q > 0; q--) {\n      if (t && e[q].name !== \"IDAT\" && y.indexOf(e[q].name) < 0) {\n        t = !1;\n      } else {\n        if (!t && e[q].name === \"IDAT\") {\n          return { error: \"Invalid chunk inside IDAT chunk sequence.\" };\n        }\n      }\n    }\n  }return { chunks: e };function f(i, H, G) {\n    var j = PngToy._findChunks(e, i);return G < 0 ? j.length >= H : j.length >= H && j.length <= G;\n  }function s(j, G, i) {\n    return r(j, G) && r(G, i);\n  }function r(j, H) {\n    var G = -1,\n        I = -1,\n        J,\n        K = e.length;for (J = 0; J < K; J++) {\n      if (e[J].name === j) {\n        G = J;\n      }if (e[J].name === H) {\n        I = J;\n      }\n    }return G < I;\n  }function c(j) {\n    var G = new Uint8Array(b, j.offset - 4, j.length + 4);j.crcOk = j.crc === i(G);function i(H) {\n      var I = -1 >>> 0,\n          K = H.length,\n          J;for (J = 0; J < K; J++) {\n        I = I >>> 8 ^ x.table[(I ^ H[J]) & 255];\n      }return (I ^ -1) >>> 0;\n    }\n  }function n() {\n    var j = o(),\n        i = String.fromCharCode;return i((j & 4278190080) >>> 24) + i((j & 16711680) >>> 16) + i((j & 65280) >>> 8) + i((j & 255) >>> 0);\n  }function o() {\n    var j = F.getUint32(C);C += 4;return j >>> 0;\n  }\n};PngToy._getChunks.table = null;PngToy._findChunk = function (b, d) {\n  for (var c = 0, a; a = b[c++];) {\n    if (a.name === d) {\n      return a;\n    }\n  }return null;\n};PngToy._findChunks = function (b, e) {\n  for (var c = 0, d = [], a; a = b[c++];) {\n    if (a.name === e) {\n      d.push(a);\n    }\n  }return d;\n};PngToy._getStr = function (j, e, d) {\n  var g = \"\",\n      c = e,\n      a = -1,\n      h,\n      k = !1,\n      b = String.fromCharCode,\n      f = \" abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\\\"%&'()*+,-./:;<=>?_\";d += c;for (; c < d && a;) {\n    a = j.getUint8(c++);if (a) {\n      h = b(a);if (f.indexOf(h) > -1) {\n        g += h;\n      } else {\n        k = !0;\n      }continue;\n    }break;\n  }return { offset: c, text: g, warning: k };\n};PngToy.Chunk = function (c, d, b, a) {\n  this.name = c;this.offset = d;this.length = b;this.crc = a;this.crcOk = !0;this.isCritical = !(c.charCodeAt(0) & 32);this.isPrivate = !!(c.charCodeAt(1) & 32);this.isReserved = !!(c.charCodeAt(2) & 32);this.isCopySafe = !!(c.charCodeAt(3) & 32);\n};PngToy._IHDR = function (d) {\n  var g = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"IHDR\"),\n      e,\n      f;if (!b) {\n    return { error: \"Critical - IHDR chunk is missing.\" };\n  }e = b.offset;f = { width: g.getUint32(e), height: g.getUint32(e + 4), depth: g.getUint8(e + 8), type: g.getUint8(e + 9), compression: g.getUint8(e + 10), filter: g.getUint8(e + 11), interlaced: g.getUint8(e + 12) };if (!a) {\n    if ([0, 2, 3, 4, 6].indexOf(f.type) < 0) {\n      return { error: \"Invalid color type.\" };\n    }switch (f.type) {case 0:\n        if ([1, 2, 4, 8, 16].indexOf(f.depth) < 0) {\n          return { error: \"Invalid color depth.\" };\n        }break;case 3:\n        if ([1, 2, 4, 8].indexOf(f.depth) < 0) {\n          return { error: \"Invalid color depth.\" };\n        }break;default:\n        if ([8, 16].indexOf(f.depth) < 0) {\n          return { error: \"Invalid color depth.\" };\n        }}if (!f.width || !f.height) {\n      return { error: \"Invalid dimension.\" };\n    }if (f.compression) {\n      return { error: \"Invalid compression type.\" };\n    }if (f.filter) {\n      return { error: \"Invalid filter type.\" };\n    }if (f.interlaced < 0 || f.interlaced > 1) {\n      return { error: \"Invalid interlace mode \" + f.interlaced };\n    }\n  }return f;\n};PngToy._IDAT = function (f) {\n  var b = f.buffer,\n      d = f.chunks,\n      a = f.allowInvalid,\n      g = 0,\n      c,\n      j = !1,\n      h = new pako.Inflate(),\n      e = !1;while (c = d[g++]) {\n    if (c.name === \"IDAT\") {\n      e = !0;break;\n    }\n  }while (c) {\n    j = c.name === \"IEND\";if (c.name === \"IDAT\") {\n      h.push(new Uint8Array(b, c.offset, c.length), j);\n    }c = d[g++];\n  }if (!j && !a) {\n    return { error: \"Critical - missing IEND chunk.\" };\n  }return e ? h.err ? { error: h.msg } : { buffer: h.result } : a ? { buffer: null } : { error: \"Critical - no IDAT chunk(s).\" };\n};PngToy._PLTE = function (e) {\n  var b = e.buffer,\n      d = e.chunks,\n      a = e.allowInvalid,\n      c = PngToy._findChunk(d, \"PLTE\"),\n      f;if (!c) {\n    return null;\n  }f = new Uint8Array(b, c.offset, c.length);if (!a) {\n    if (f.length % 3) {\n      return { error: \"Invalid palette size.\" };\n    }if (f.length < 3 || f.length > 3 * 256) {\n      return { error: \"Invalid number of palette entries.\" };\n    }\n  }return { palette: f, length: f.length / 3 };\n};PngToy._sPLT = function (d) {\n  var f = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunks(c, \"sPLT\"),\n      e = [];if (!b.length) {\n    return null;\n  }b.forEach(function (h) {\n    var p = { depth: null, name: null, palette: [], entries: 0 },\n        m,\n        o,\n        l,\n        q,\n        g,\n        n = [],\n        k,\n        j;o = h.offset;m = PngToy._getStr(f, o, 80);p.name = m.text;o = m.offset;p.depth = f.getUint8(o++);q = p.depth === 8 ? 6 : 10;g = p.depth === 8 ? 1 : 2;l = h.length - (o - h.offset);j = q === 6 ? f.getUint8.bind(f) : f.getUint16.bind(f);for (k = 0; k < l; k += q) {\n      n.push(j(o + k), j(o + k + g), j(o + k + g * 2), j(o + k + g * 3), f.getUint16(o + k + g * 4));\n    }p.palette = n;p.entries = n.length / q;if (!a) {\n      if (p.depth === 8 && l % 6 || p.depth === 16 && l % 10) {\n        return { error: \"Invalid sPLT chunk.\" };\n      }\n    }e.push(p);\n  });return e;\n};PngToy._tRNS = function (e) {\n  var b = e.buffer,\n      d = e.chunks,\n      a = e.allowInvalid,\n      c = PngToy._findChunk(d, \"tRNS\"),\n      g = PngToy._PLTE(e),\n      f = PngToy._IHDR(e),\n      h;if (!c) {\n    return null;\n  }if (!a) {\n    if (f.type === 2 && c.length % 6) {\n      return { error: \"Invalid tRNS length.\" };\n    }\n  }switch (f.type) {case 0:\n      h = { alphas: new Uint16Array(b.slice(c.offset, c.offset + c.length)), length: c.length >> 1 };break;case 2:\n      h = { alphas: new Uint16Array(b.slice(c.offset, c.offset + c.length)), length: c.length / 6 };break;case 3:\n      h = { alphas: new Uint8Array(b, c.offset, c.length), length: c.length };break;default:\n      return a ? { alphas: null, length: 0 } : { error: \"tRNS chunk is not valid for this color type.\" };}if (!a && g && h.length > g.length) {\n    return { error: \"tRNS chunk contains more entries than palette entries.\" };\n  }return h;\n};PngToy._hIST = function (e) {\n  var i = e.view,\n      c = e.chunks,\n      a = e.allowInvalid,\n      b = PngToy._findChunk(c, \"hIST\"),\n      g = PngToy._PLTE(e),\n      d = [],\n      h,\n      f;if (!b) {\n    return null;\n  }if (!a && b.length % 2) {\n    return { error: \"Invalid length of hIST chunk.\" };\n  }h = b.offset;f = h + b.length;for (; h < f; h += 2) {\n    d.push(i.getUint16(h));\n  }if (!a) {\n    if (d.length !== g.length) {\n      return { error: \"hIST chunk must have same number of entries as PLTE chunk.\" };\n    }\n  }return { histogram: d };\n};PngToy._iTXt = function (e) {\n  var l = e.view,\n      d = e.chunks,\n      b = e.allowInvalid,\n      c = PngToy._findChunks(d, \"iTXt\"),\n      j,\n      k,\n      h,\n      f,\n      m = !1,\n      a = !1,\n      g = [];if (!c.length) {\n    return null;\n  }c.forEach(function (i) {\n    if (a) {\n      return;\n    }var o = {};j = i.offset;h = PngToy._getStr(l, j, 80);o.keyword = h.text;j = h.offset;if (h.warn) {\n      m = !0;\n    }o.hasCompression = l.getUint8(j);o.compression = l.getUint8(j + 1);j += 2;h = PngToy._getStr(l, j, 20);o.language = h.text.toLowerCase();j = h.offset;if (h.warn) {\n      m = !0;\n    }h = PngToy._getStr(l, j, 80);o.keywordLang = h.text;j = h.offset;if (h.warn) {\n      m = !0;\n    }k = new Uint8Array(l.buffer, j, i.length - (j - i.offset));if (o.hasCompression === 1) {\n      if (!b && !o.compression) {\n        o = { error: \"Invalid compression type for iTXt.\" };\n      } else {\n        try {\n          o.text = pako.inflate(k, { to: \"string\" });\n        } catch (n) {\n          if (b) {\n            o.text = \"\";\n          } else {\n            o = { error: n };\n          }\n        }\n      }\n    } else {\n      if (!o.hasCompression) {\n        h = \"\";for (f = 0; f < k.length; f++) {\n          h += String.fromCharCode(k[f]);\n        }o.text = h;\n      } else {\n        if (b) {\n          o.text = \"\";\n        } else {\n          o = { error: \"Invalid compression flag.\" };\n        }\n      }\n    }if (!b && m) {\n      a = !0;return { error: \"One or more field contains illegal chars.\" };\n    }g.push(o);\n  });return g;\n};PngToy._tEXt = function (e) {\n  var l = e.view,\n      d = e.chunks,\n      b = e.allowInvalid,\n      c = PngToy._findChunks(d, \"tEXt\"),\n      m = !1,\n      a = !1,\n      j,\n      k,\n      h,\n      f,\n      g = [];if (!c.length) {\n    return null;\n  }c.forEach(function (i) {\n    if (a) {\n      return;\n    }var n = {};j = i.offset;h = PngToy._getStr(l, j, 80);n.keyword = h.text;j = h.offset;if (h.warn) {\n      m = !0;\n    }k = new Uint8Array(l.buffer, j, i.length - (j - i.offset));h = \"\";for (f = 0; f < k.length; f++) {\n      h += String.fromCharCode(k[f]);\n    }n.text = h;g.push(n);if (!b && m) {\n      a = !0;return { error: \"One or more field contains illegal chars.\" };\n    }\n  });return g;\n};PngToy._zTXt = function (e) {\n  var i = e.view,\n      d = e.chunks,\n      b = e.allowInvalid,\n      c = PngToy._findChunks(d, \"zTXt\"),\n      j = !1,\n      a = !1,\n      f = [],\n      h,\n      g;if (!c.length) {\n    return null;\n  }c.forEach(function (k) {\n    if (a) {\n      return;\n    }var m = {};h = k.offset;g = PngToy._getStr(i, h, 80);m.keyword = g.text;h = g.offset;if (g.warn) {\n      j = !0;\n    }if (i.getUint8(h++) && !b) {\n      m = { error: \"Invalid compression type.\" };\n    } else {\n      try {\n        m.text = pako.inflate(new Uint8Array(i.buffer, h, k.length - (h - k.offset)), { to: \"string\" });\n      } catch (l) {\n        if (b) {\n          m.text = \"\";\n        } else {\n          m = { error: l };\n        }\n      }\n    }if (!b && j) {\n      a = !0;return { error: \"One or more field contains illegal chars.\" };\n    }f.push(m);\n  });return f;\n};PngToy._iCCP = function () {\n  var l = host.view,\n      d = host.chunks,\n      a = host.allowInvalid,\n      c = PngToy._findChunk(d, \"iCCP\"),\n      j,\n      h,\n      g,\n      f,\n      b,\n      k = { name: null, icc: null };if (!c) {\n    return null;\n  }j = c.offset;h = PngToy._getStr(l, j, 80);g = h.text;j = h.offset;if (!a) {\n    for (f = 0; f < g.length; f++) {\n      b = g.charCodeAt(f);if (!(b > 31 && b < 127) && !(b > 160 && b < 256)) {\n        return { error: \"ICC profile contains illegal chars in name.\" };\n      }\n    }\n  }k.name = g;if (l.getUint8(j++) && !a) {\n    return { error: \"Invalid compression type.\" };\n  }try {\n    k.icc = pako.inflate(new Uint8Array(l.buffer, j, c.length - (j - c.offset)));\n  } catch (e) {\n    if (!a) {\n      return { error: e };\n    }\n  }return k;\n};PngToy._gAMA = function (e) {\n  var f = e.view,\n      c = e.chunks,\n      a = e.allowInvalid,\n      b = PngToy._findChunk(c, \"gAMA\"),\n      d;if (!b) {\n    return null;\n  }d = f.getUint32(b.offset) / 100000;if (!a) {}return { gamma: d };\n};PngToy._cHRM = function (d) {\n  var g = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"cHRM\"),\n      f,\n      e;if (!b) {\n    return null;\n  }e = b.offset;f = { whiteX: g.getUint32(e) / 100000, whiteY: g.getUint32(e + 4) / 100000, redX: g.getUint32(e + 8) / 100000, redY: g.getUint32(e + 12) / 100000, greenX: g.getUint32(e + 16) / 100000, greenY: g.getUint32(e + 20) / 100000, blueX: g.getUint32(e + 24) / 100000, blueY: g.getUint32(e + 28) / 100000 };if (!a) {}return f;\n};PngToy._sRGB = function (d) {\n  var g = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"sRGB\"),\n      e,\n      f = [\"Perceptual\", \"Relative colorimetric\", \"Saturation\", \"Absolute colorimetric\"];if (!b) {\n    return null;\n  }e = g.getUint8(b.offset);if (!a) {\n    if (e < 0 || e > 3) {\n      return { error: \"Invalid range for sRGB render intent.\" };\n    }\n  }return { intent: e, desc: f[e] || null };\n};PngToy._pHYs = function (d) {\n  var g = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"pHYs\"),\n      e,\n      f = {};if (!b) {\n    return null;\n  }e = b.offset;f.ppuX = g.getUint32(e);f.ppuY = g.getUint32(e + 4);f.unit = g.getUint8(e + 8);if (f.unit === 1) {\n    f.desc = \"Meters\";\n  } else {\n    f.desc = \"ratio\";\n  }if (!a) {\n    if (f.ppuX > 2147483647 || f.ppuY > 2147483647) {\n      return { error: \"Invalid unit lengths.\" };\n    }if (f.unit < 0 || f.unit > 1) {\n      return { error: \"Invalid unit for pHYs chunk.\" };\n    }\n  } else {\n    f.ppuX &= 2147483647;f.ppuY &= 2147483647;f.unit &= 1;\n  }return f;\n};PngToy._bKGD = function (c) {\n  var e = c.view,\n      b = c.chunks,\n      a = PngToy._findChunk(b, \"bKGD\"),\n      d = PngToy._IHDR(c);if (!a) {\n    return null;\n  }switch (d.type) {case 0:case 4:\n      return { background: [e.getUint16(a.offset)] };case 2:case 6:\n      return { background: new Uint16Array(e.buffer, a.offset, 6) };default:\n      return { index: e.getUint8(a.offset) };}\n};PngToy._tIME = function (e) {\n  var h = e.view,\n      c = e.chunks,\n      a = e.allowInvalid,\n      b = PngToy._findChunk(c, \"tIME\"),\n      f,\n      g;if (!b) {\n    return null;\n  }f = b.offset;g = { year: h.getUint16(f), month: h.getUint8(f + 2), day: h.getUint8(f + 3), hour: h.getUint8(f + 4), minute: h.getUint8(f + 5), second: h.getUint8(f + 6), date: null };if (!a) {\n    if (g.year < 0 || g.year > 65535 || g.month < 1 || g.month > 12 || g.day < 1 || g.day > 31 || g.hour < 0 || g.hour > 23 || g.minute < 0 || g.minute > 59 || g.second < 0 || g.second > 60) {\n      return { error: \"Invalid timestamp.\" };\n    }\n  }try {\n    g.date = new Date(g.year, g.month - 1, g.day, g.hour, g.minute, Math.min(59, g.second));\n  } catch (d) {\n    if (!a) {\n      return { error: d };\n    }\n  }return g;\n};PngToy._oFFs = function (d) {\n  var g = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"oFFs\"),\n      e,\n      f = {};if (!b) {\n    return null;\n  }e = b.offset;f.x = g.getInt32(e);f.y = g.getInt32(e + 4);f.unit = g.getUint8(e + 8);f.desc = [\"Pixels\", \"Micrometers\"][f.unit] || \"Invalid\";if (!a) {\n    if (f.unit < 0 || f.unit > 1) {\n      return { error: \"Invalid unit for oFFs chunk.\" };\n    }\n  }return f;\n};PngToy._sCAL = function (d) {\n  var h = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"sCAL\"),\n      f,\n      e,\n      g = {};if (!b.length) {\n    return null;\n  }f = b.offset;g.unit = h.getUint8(f++);g.desc = [\"meters\", \"radians\"][g.unit] || null;e = PngToy._getStr(h, f, 100000);g.unitsX = e.text;f = e.offset;e = PngToy._getStr(h, f, b.length - (f - b.offset));g.unitsY = e.text;if (!a) {\n    if (g.unit < 1 || g.unit > 2) {\n      return { error: \"Invalid unit\" };\n    }\n  }return g;\n};PngToy._pCAL = function (d) {\n  var l = d.view,\n      c = d.chunks,\n      a = d.allowInvalid,\n      b = PngToy._findChunk(c, \"pCAL\"),\n      m = !1,\n      j,\n      g,\n      k = {},\n      h = [],\n      e = 0,\n      f;if (!b.length) {\n    return null;\n  }j = b.offset;g = PngToy._getStr(l, j, 80);k.calName = g.text;j = g.offset;if (g.warn) {\n    m = !0;\n  }k.x0 = l.getInt32(j);k.x1 = l.getInt32(j + 4);k.eqType = l.getUint8(j + 8);k.eqDesc = [\"Linear mapping\", \"Base-e exponential mapping\", \"Arbitrary-base exponential mapping\", \"Hyperbolic mapping\"][k.eqType] || null;k.paramCount = l.getUint8(j + 9);j += 10;g = PngToy._getStr(l, j, 10000);k.unitName = g.text;j = g.offset;if (g.warn) {\n    m = !0;\n  }f = k.paramCount - 1;for (; e < f; e++) {\n    g = PngToy._getStr(l, j, 10000);h.push(g.text);j = g.offset;if (g.warn) {\n      m = !0;\n    }\n  }g = PngToy._getStr(l, j, b.length - (j - b.offset));h.push(g.text);if (g.warn) {\n    m = !0;\n  }k.parameters = h;if (!a) {\n    if (k.x0 === k.x1) {\n      return { error: \"Invalid x0 or x1.\" };\n    }if (h.length !== k.paramCount) {\n      return { error: \"Mismatching parameter count and number of parameters.\" };\n    }if (k.eqType < 0 || k.eqType > 3) {\n      return { error: \"Invalid equation type.\" };\n    }if (m) {\n      return { error: \"One or more text field contains illegal chars.\" };\n    }\n  }return k;\n};PngToy.prototype.decode = function () {\n  var a = this;return new Promise(function (Q, P) {\n    var C = a.getChunk(\"IHDR\"),\n        Z = C.width,\n        B = C.height,\n        Y = C.type,\n        m = C.depth,\n        g = m / 8,\n        D = g === 2,\n        M = [1, 0, 3, 1, 2, 0, 4][Y],\n        G = D ? 65535 : 255,\n        l = M * g,\n        F = Z * l,\n        E = F + Math.ceil(l),\n        S = a.getChunk(\"IDAT\").buffer,\n        o = new Uint8Array(Math.max(1, Math.ceil(Z * l) * B)),\n        z = [r, s, t, u, v],\n        R = 0,\n        n = 0,\n        i = 0,\n        N = 0,\n        ab = 0,\n        O,\n        f = S.byteLength,\n        T = S.length,\n        H = [0, 4, 0, 2, 0, 1, 0],\n        I = [0, 0, 4, 0, 2, 0, 1],\n        U = [8, 8, 4, 4, 2, 2, 1],\n        V = [8, 8, 8, 4, 4, 2, 2],\n        d = [8, 4, 4, 2, 2, 1, 1],\n        c = [8, 8, 4, 4, 2, 2, 1],\n        L,\n        W,\n        X,\n        J,\n        e,\n        b,\n        aa;a.debug = { pixelWidth: M, byteWidth: g, delta: l, lineLen: F, lineDlt: E, filters: [], preFilt: -1, postFilt: -1, srcPos: -1, srcLen: S.length, pass: 0, x: -1, stepX: 0, stepY: 0, stepsX: 0, stepsY: 0 };if (C.interlaced) {\n      if (typeof console !== \"undefined\") {\n        console.log(\"WARN: In current alpha interlaced PNGs will not decode properly unless all line-filters are filter 0.\");\n      }L = ab = J = 0;W = X = e = b = 8;setTimeout(k, PngToy._delay);\n    } else {\n      setTimeout(j, PngToy._delay);\n    }function j() {\n      try {\n        var x,\n            ad,\n            y,\n            ac = a.debug.filters,\n            h = PngToy._blockSize;l = Math.ceil(l);while (ab < B && h > 0) {\n          y = S[R++];x = z[y];if (ac.indexOf(y) < 0) {\n            ac.push(y);\n          }ad = Math.min(f, R + F);i = n;while (R < ad) {\n            o[n] = x(S[R++], n - l, n - F, n - E) & G;n++;\n          }N = i;h -= F;ab++;\n        }ab < B ? setTimeout(j, PngToy._delay) : Q(A());\n      } catch (w) {\n        P(w);\n      }\n    }function k() {\n      try {\n        var ac,\n            ad,\n            ah,\n            w = PngToy._blockSize,\n            ae = a.debug.filters,\n            am = Z / W | 0,\n            aj = B / X | 0,\n            ak = am * aj,\n            al = new Uint8Array(ak);while (ab < B) {\n          if (R >= T) {\n            ab = B;continue;\n          }ad = S[R++];if (ae.indexOf(ad) < 0) {\n            ae.push(ad);\n          }if (ad < 0 || ad > 4) {\n            a.debug.preFilt = S[R - 2];a.debug.postFilt = S[R];a.debug.srcPos = R;a.debug.pass = L;a.debug.x = aa;a.debug.stepX = W;a.debug.stepY = X;a.debug.stepsX = Z / W;a.debug.stepsY = B / X;\n          }ac = z[ad];lineEnd = Math.min(f, Math.ceil(R + F));i = ab * F;N = Math.max(0, i - F);aa = J;while (aa < F) {\n            n = i + aa * l | 0;ah = 0;while (ah < M) {\n              O = ac(S[R++], n - Math.ceil(l), n - F, n - Math.ceil(E)) & G;for (var ag = 0, h = Math.min(b, B - ab); ag < h; ag++) {\n                for (var af = 0, ai = ag * F, x = Math.min(e, Z - aa); af < x; af++) {\n                  o[n + ai + af * l] = O;\n                }\n              }n++;ah++;\n            }aa += W * l;\n          }w -= F;ab += X;\n        }if (ab < B) {\n          setTimeout(k, PngToy._delay);\n        } else {\n          if (++L < 7) {\n            ab = I[L];J = H[L];W = U[L];X = V[L];e = d[L];b = c[L];setTimeout(k, PngToy._delay);\n          } else {\n            Q(A());\n          }\n        }\n      } catch (y) {\n        P(y);\n      }\n    }function A() {\n      return { bitmap: D ? new Uint16Array(o.buffer) : new Uint8Array(o.buffer), width: Z, height: B, byteWidth: g, pixelWidth: M, depth: C.depth, type: C.type };\n    }function p(h) {\n      return h < i ? 0 : o[h] >>> 0;\n    }function q(h) {\n      return h < N ? 0 : o[h] >>> 0;\n    }function r(h) {\n      return h;\n    }function s(w, h) {\n      return w + p(h);\n    }function t(x, h, w) {\n      return x + q(w);\n    }function u(x, h, w) {\n      return x + (p(h) + q(w) >>> 1);\n    }function v(y, h, w, x) {\n      return y + K(p(h), q(w), q(x));\n    }function K(h, w, x) {\n      var y = h + w - x,\n          ac = Math.abs(y - h),\n          ad = Math.abs(y - w),\n          ae = Math.abs(y - x);if (ac <= ad && ac <= ae) {\n        return h;\n      }if (ad <= ae) {\n        return w;\n      }return x;\n    }\n  });\n};PngToy.prototype.convertToRGBA = function (a, c) {\n  var b = this;c = c || {};return new Promise(function (O, N) {\n    if (a.type === 6 && a.depth === 8 && !c.useGamma) {\n      var R = c.ignoreAspectRatio ? null : b.getChunk(\"pHYs\"),\n          L = R ? R.ppuY / (R.ppuX || 1) : 1,\n          M = R ? R.ppuX / (R.ppuY || 1) : 1;if (c.ignoreAspectRatio || !c.ignoreAspectRatio && L === 1 && M === 1) {\n        O({ bitmap: a.bitmap, width: a.width, height: a.height, ratioX: L, ratioY: M });\n      }return;\n    }var J,\n        S,\n        H,\n        k,\n        G,\n        d,\n        U = a.width,\n        D = a.height,\n        T = a.type,\n        g = a.depth,\n        e = g / 8,\n        I = [1, 0, 3, 1, 2, 0, 4][T],\n        l = p(T, g),\n        Q = a.bitmap,\n        j = new Uint8Array(U * D * 4),\n        P = 0,\n        i = 0,\n        E = Q.byteLength,\n        K,\n        F;if (a.type === 3) {\n      J = b.getChunk(\"PLTE\");G = J ? J.palette : [];\n    }S = b.getChunk(\"tRNS\");d = S && S.alphas ? S.alphas : [];H = b.getChunk(\"pHYs\");k = b.getChunk(\"gAMA\");k = k ? k.gamma : 1;(function f() {\n      var h = PngToy._blockSize,\n          V = U * e * I,\n          w = P + V;if (c.useGamma) {\n        F = F ? F : b.getGammaLUT(k, c.gamma || 1);while (P < E && h > 0) {\n          if (P >= w) {\n            P = Math.ceil(P);w = P + V;\n          }K = l();j[i++] = F[K[0]];j[i++] = F[K[1]];j[i++] = F[K[2]];j[i++] = K[3];h--;\n        }\n      } else {\n        while (P < E && h > 0) {\n          if (P >= w) {\n            P = Math.ceil(P);w = P + V;\n          }K = l();j[i++] = K[0];j[i++] = K[1];j[i++] = K[2];j[i++] = K[3];h--;\n        }\n      }if (P < E) {\n        setTimeout(f, PngToy._delay);\n      } else {\n        O({ bitmap: j, width: U, height: D, ratioX: H ? H.ppuY / (H.ppuX || 1) : 1, ratioY: H ? H.ppuX / (H.ppuY || 1) : 1 });\n      }\n    })();function r() {\n      var w = Q[P | 0],\n          V = (P - (P | 0)) / e,\n          W = w & 128 >> V ? 255 : 0,\n          h = d.length ? d[0] >>> 8 & 128 >> V === W ? 0 : 255 : 255;P += e;return [W, W, W, h];\n    }function t() {\n      var w = Q[P | 0],\n          V = (P - (P | 0)) / e << 1,\n          W = (w >>> V & 3) * 85 & 255,\n          h = d.length ? (d[0] >>> 8 & 3) * 85 & 255 === W ? 0 : 255 : 255;P += e;return [W, W, W, h];\n    }function u() {\n      var w = Q[P | 0],\n          V = (P - (P | 0)) / e,\n          W = V ? (w & 15) << 4 : w & 240,\n          h = d.length ? (d[0] & 3840) >>> 4 === W ? 0 : 255 : 255;P += e;return [W, W, W, h];\n    }function m() {\n      var h = Q[P | 0],\n          w = (P - (P | 0)) / e,\n          V = h & 128 >>> w ? 1 : 0,\n          W = V * 3;P += e;return [G[W], G[W + 1], G[W + 2], 255];\n    }function n() {\n      var w = Q[P | 0],\n          V = (P - (P | 0)) / e << 1,\n          W = (w << V & 192) >>> 6,\n          X = W * 3,\n          h = W < d.length ? d[W] : 255;P += e;return [G[X], G[X + 1], G[X + 2], h];\n    }function o() {\n      var w = Q[P | 0],\n          V = (P - (P | 0)) / e,\n          W = V ? w & 15 : (w & 240) >>> 4,\n          X = W * 3,\n          h = W < d.length ? d[W] : 255;P += e;return [G[X], G[X + 1], G[X + 2], h];\n    }function q() {\n      var w = Q[P++],\n          h = d.length && w === d[0] >>> 8 ? 0 : 255;w &= 255;return [w, w, w, h];\n    }function s() {\n      var w = Q[P++],\n          h = d.length && d[0] === w ? 0 : 255;w &= 255;return [w, w, w, h];\n    }function z() {\n      var Z = Q[P++],\n          Y = Q[P++],\n          X = Q[P++],\n          W,\n          V,\n          w,\n          h = 255;if (d.length) {\n        W = d[0] >>> 8;V = d[1] >>> 8;w = d[2] >>> 8;if (W === Z && V === Y && w === X) {\n          h = 0;\n        }\n      }return [Z & 255, Y & 255, X & 255, h];\n    }function B() {\n      return [Q[P++], Q[P++], Q[P++], Q[P++]];\n    }function A() {\n      var W = Q[P++],\n          V = Q[P++],\n          w = Q[P++],\n          h = d.length && d[0] === W && d[1] === V && d[2] === w ? 0 : 255;return [W & 255, V & 255, w & 255, h];\n    }function v() {\n      var h = Q[P++];return [h, h, h, Q[P++]];\n    }function x() {\n      var h = Q[P++] & 255;return [h, h, h, Q[P++] & 255];\n    }function y() {\n      var w = Q[P++],\n          h = w * 3;return [G[h], G[h + 1], G[h + 2], w < d.length ? d[w] : 255];\n    }function C() {\n      return [Q[P++] & 255, Q[P++] & 255, Q[P++] & 255, Q[P++] & 255];\n    }function p(w, h) {\n      if (h === 16) {\n        return [s, 0, A, y, x, 0, C][w];\n      } else {\n        if (h < 8) {\n          switch (h) {case 1:\n              return w ? m : r;case 2:\n              return w ? n : t;case 4:\n              return w ? o : u;}\n        } else {\n          return [q, 0, z, y, v, 0, B][w];\n        }\n      }\n    }\n  });\n};PngToy.prototype.convertToCanvas = function (a, c) {\n  var b = this;c = c || {};return new Promise(function (e, d) {\n    b.convertToRGBA(a, c).then(function (f) {\n      try {\n        var g = document.createElement(\"canvas\"),\n            i = g.getContext(\"2d\");g.width = f.width;g.height = f.height;var l = i.createImageData(f.width, f.height);l.data.set(f.bitmap);i.putImageData(l, 0, 0);if ((f.ratioY !== 1 || f.ratioX !== 1) && !c.ignoreAspectRatio) {\n          var m = document.createElement(\"canvas\"),\n              n = m.getContext(\"2d\"),\n              o,\n              k;if (f.ratioY >= 1) {\n            o = g.width;k = g.height * f.ratioY | 0;\n          } else {\n            if (f.ratioY < 1) {\n              o = g.width * f.ratioX | 0;k = g.height;\n            }\n          }m.width = o;m.height = k;n.drawImage(g, 0, 0, o, k);g = m;\n        }e(g);\n      } catch (j) {\n        d(j);\n      }\n    }, d);\n  });\n};(function (a) {\n  if ((typeof exports === \"undefined\" ? \"undefined\" : _typeof(exports)) === \"object\" && typeof module !== \"undefined\") {\n    module.exports = a();\n  } else {\n    if (typeof define === \"function\" && define.amd) {\n      define([], a);\n    } else {\n      var b;if (typeof window !== \"undefined\") {\n        b = window;\n      } else {\n        if (typeof global !== \"undefined\") {\n          b = global;\n        } else {\n          if (typeof self !== \"undefined\") {\n            b = self;\n          } else {\n            b = this;\n          }\n        }\n      }b.pako = a();\n    }\n  }\n})(function () {\n  var a, d, c;return function b(k, f, h) {\n    function j(p, q) {\n      if (!f[p]) {\n        if (!k[p]) {\n          var i = typeof require == \"function\" && require;if (!q && i) {\n            return i(p, !0);\n          }if (e) {\n            return e(p, !0);\n          }var m = new Error(\"Cannot find module '\" + p + \"'\");throw m.code = \"MODULE_NOT_FOUND\", m;\n        }var n = f[p] = { exports: {} };k[p][0].call(n.exports, function (l) {\n          var o = k[p][1][l];return j(o ? o : l);\n        }, n, n.exports, b, k, f, h);\n      }return f[p].exports;\n    }var e = typeof require == \"function\" && require;for (var g = 0; g < h.length; g++) {\n      j(h[g]);\n    }return j;\n  }({ 1: [function (i, h, e) {\n      var j = typeof Uint8Array !== \"undefined\" && typeof Uint16Array !== \"undefined\" && typeof Int32Array !== \"undefined\";e.assign = function (k) {\n        var n = Array.prototype.slice.call(arguments, 1);while (n.length) {\n          var m = n.shift();if (!m) {\n            continue;\n          }if ((typeof m === \"undefined\" ? \"undefined\" : _typeof(m)) !== \"object\") {\n            throw new TypeError(m + \"must be non-object\");\n          }for (var l in m) {\n            if (m.hasOwnProperty(l)) {\n              k[l] = m[l];\n            }\n          }\n        }return k;\n      };e.shrinkBuf = function (k, l) {\n        if (k.length === l) {\n          return k;\n        }if (k.subarray) {\n          return k.subarray(0, l);\n        }k.length = l;return k;\n      };var f = { arraySet: function arraySet(k, o, p, n, l) {\n          if (o.subarray && k.subarray) {\n            k.set(o.subarray(p, p + n), l);return;\n          }for (var m = 0; m < n; m++) {\n            k[l + m] = o[p + m];\n          }\n        }, flattenChunks: function flattenChunks(m) {\n          var n, o, p, q, k, r;p = 0;for (n = 0, o = m.length; n < o; n++) {\n            p += m[n].length;\n          }r = new Uint8Array(p);q = 0;for (n = 0, o = m.length; n < o; n++) {\n            k = m[n];r.set(k, q);q += k.length;\n          }return r;\n        } };var g = { arraySet: function arraySet(k, o, p, n, l) {\n          for (var m = 0; m < n; m++) {\n            k[l + m] = o[p + m];\n          }\n        }, flattenChunks: function flattenChunks(k) {\n          return [].concat.apply([], k);\n        } };e.setTyped = function (k) {\n        if (k) {\n          e.Buf8 = Uint8Array;e.Buf16 = Uint16Array;e.Buf32 = Int32Array;e.assign(e, f);\n        } else {\n          e.Buf8 = Array;e.Buf16 = Array;e.Buf32 = Array;e.assign(e, g);\n        }\n      };e.setTyped(j);\n    }, {}], 2: [function (k, i, h) {\n      var n = k(\"./common\");var l = !0;var m = !0;try {\n        String.fromCharCode.apply(null, [0]);\n      } catch (e) {\n        l = !1;\n      }try {\n        String.fromCharCode.apply(null, new Uint8Array(1));\n      } catch (e) {\n        m = !1;\n      }var f = new n.Buf8(256);for (var j = 0; j < 256; j++) {\n        f[j] = j >= 252 ? 6 : j >= 248 ? 5 : j >= 240 ? 4 : j >= 224 ? 3 : j >= 192 ? 2 : 1;\n      }f[254] = f[254] = 1;h.string2buf = function (u) {\n        var o,\n            q,\n            r,\n            t,\n            s,\n            v = u.length,\n            p = 0;for (t = 0; t < v; t++) {\n          q = u.charCodeAt(t);if ((q & 64512) === 55296 && t + 1 < v) {\n            r = u.charCodeAt(t + 1);if ((r & 64512) === 56320) {\n              q = 65536 + (q - 55296 << 10) + (r - 56320);t++;\n            }\n          }p += q < 128 ? 1 : q < 2048 ? 2 : q < 65536 ? 3 : 4;\n        }o = new n.Buf8(p);for (s = 0, t = 0; s < p; t++) {\n          q = u.charCodeAt(t);if ((q & 64512) === 55296 && t + 1 < v) {\n            r = u.charCodeAt(t + 1);if ((r & 64512) === 56320) {\n              q = 65536 + (q - 55296 << 10) + (r - 56320);t++;\n            }\n          }if (q < 128) {\n            o[s++] = q;\n          } else {\n            if (q < 2048) {\n              o[s++] = 192 | q >>> 6;o[s++] = 128 | q & 63;\n            } else {\n              if (q < 65536) {\n                o[s++] = 224 | q >>> 12;o[s++] = 128 | q >>> 6 & 63;o[s++] = 128 | q & 63;\n              } else {\n                o[s++] = 240 | q >>> 18;o[s++] = 128 | q >>> 12 & 63;o[s++] = 128 | q >>> 6 & 63;o[s++] = 128 | q & 63;\n              }\n            }\n          }\n        }return o;\n      };function g(o, q) {\n        if (q < 65537) {\n          if (o.subarray && m || !o.subarray && l) {\n            return String.fromCharCode.apply(null, n.shrinkBuf(o, q));\n          }\n        }var r = \"\";for (var p = 0; p < q; p++) {\n          r += String.fromCharCode(o[p]);\n        }return r;\n      }h.buf2binstring = function (o) {\n        return g(o, o.length);\n      };h.binstring2buf = function (r) {\n        var o = new n.Buf8(r.length);for (var p = 0, q = o.length; p < q; p++) {\n          o[p] = r.charCodeAt(p);\n        }return o;\n      };h.buf2string = function (o, t) {\n        var r, u, p, q;var s = t || o.length;var v = new Array(s * 2);for (u = 0, r = 0; r < s;) {\n          p = o[r++];if (p < 128) {\n            v[u++] = p;continue;\n          }q = f[p];if (q > 4) {\n            v[u++] = 65533;r += q - 1;continue;\n          }p &= q === 2 ? 31 : q === 3 ? 15 : 7;while (q > 1 && r < s) {\n            p = p << 6 | o[r++] & 63;q--;\n          }if (q > 1) {\n            v[u++] = 65533;continue;\n          }if (p < 65536) {\n            v[u++] = p;\n          } else {\n            p -= 65536;v[u++] = 55296 | p >> 10 & 1023;v[u++] = 56320 | p & 1023;\n          }\n        }return g(v, u);\n      };h.utf8border = function (o, p) {\n        var q;p = p || o.length;if (p > o.length) {\n          p = o.length;\n        }q = p - 1;while (q >= 0 && (o[q] & 192) === 128) {\n          q--;\n        }if (q < 0) {\n          return p;\n        }if (q === 0) {\n          return p;\n        }return q + f[o[q]] > p ? q : p;\n      };\n    }, { \"./common\": 1 }], 3: [function (h, g, f) {\n      function e(i, j, k, m) {\n        var o = i & 65535 | 0,\n            p = i >>> 16 & 65535 | 0,\n            l = 0;while (k !== 0) {\n          l = k > 2000 ? 2000 : k;k -= l;do {\n            o = o + j[m++] | 0;p = p + o | 0;\n          } while (--l);o %= 65521;p %= 65521;\n        }return o | p << 16 | 0;\n      }g.exports = e;\n    }, {}], 4: [function (g, f, e) {\n      f.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };\n    }, {}], 5: [function (i, h, g) {\n      var f = PngToy._getChunks.table;function e(k, j, n, o) {\n        var p = f,\n            l = o + n;k ^= -1;for (var m = o; m < l; m++) {\n          k = k >>> 8 ^ p[(k ^ j[m]) & 255];\n        }return k ^ -1;\n      }h.exports = e;\n    }, {}], 6: [function (h, g, e) {\n      function f() {\n        this.text = 0;this.time = 0;this.xflags = 0;this.os = 0;this.extra = null;this.extra_len = 0;this.name = \"\";this.comment = \"\";this.hcrc = 0;this.done = !1;\n      }g.exports = f;\n    }, {}], 7: [function (i, h, f) {\n      var e = 30;var j = 12;h.exports = function g(H, F) {\n        var G;var k;var y;var l;var m;var s;var r;var K;var I;var J;var E;var w;var n;var z;var o;var B;var q;var v;var C;var A;var p;var t;var u;var x, D;G = H.state;k = H.next_in;x = H.input;y = k + (H.avail_in - 5);l = H.next_out;D = H.output;m = l - (F - H.avail_out);s = l + (H.avail_out - 257);r = G.dmax;K = G.wsize;I = G.whave;J = G.wnext;E = G.window;w = G.hold;n = G.bits;z = G.lencode;o = G.distcode;B = (1 << G.lenbits) - 1;q = (1 << G.distbits) - 1;top: do {\n          if (n < 15) {\n            w += x[k++] << n;n += 8;w += x[k++] << n;n += 8;\n          }v = z[w & B];dolen: for (;;) {\n            C = v >>> 24;w >>>= C;n -= C;C = v >>> 16 & 255;if (C === 0) {\n              D[l++] = v & 65535;\n            } else {\n              if (C & 16) {\n                A = v & 65535;C &= 15;if (C) {\n                  if (n < C) {\n                    w += x[k++] << n;n += 8;\n                  }A += w & (1 << C) - 1;w >>>= C;n -= C;\n                }if (n < 15) {\n                  w += x[k++] << n;n += 8;w += x[k++] << n;n += 8;\n                }v = o[w & q];dodist: for (;;) {\n                  C = v >>> 24;w >>>= C;n -= C;C = v >>> 16 & 255;if (C & 16) {\n                    p = v & 65535;C &= 15;if (n < C) {\n                      w += x[k++] << n;n += 8;if (n < C) {\n                        w += x[k++] << n;n += 8;\n                      }\n                    }p += w & (1 << C) - 1;if (p > r) {\n                      H.msg = \"invalid distance too far back\";G.mode = e;break top;\n                    }w >>>= C;n -= C;C = l - m;if (p > C) {\n                      C = p - C;if (C > I) {\n                        if (G.sane) {\n                          H.msg = \"invalid distance too far back\";G.mode = e;break top;\n                        }\n                      }t = 0;u = E;if (J === 0) {\n                        t += K - C;if (C < A) {\n                          A -= C;do {\n                            D[l++] = E[t++];\n                          } while (--C);t = l - p;u = D;\n                        }\n                      } else {\n                        if (J < C) {\n                          t += K + J - C;C -= J;if (C < A) {\n                            A -= C;do {\n                              D[l++] = E[t++];\n                            } while (--C);t = 0;if (J < A) {\n                              C = J;A -= C;do {\n                                D[l++] = E[t++];\n                              } while (--C);t = l - p;u = D;\n                            }\n                          }\n                        } else {\n                          t += J - C;if (C < A) {\n                            A -= C;do {\n                              D[l++] = E[t++];\n                            } while (--C);t = l - p;u = D;\n                          }\n                        }\n                      }while (A > 2) {\n                        D[l++] = u[t++];D[l++] = u[t++];D[l++] = u[t++];A -= 3;\n                      }if (A) {\n                        D[l++] = u[t++];if (A > 1) {\n                          D[l++] = u[t++];\n                        }\n                      }\n                    } else {\n                      t = l - p;do {\n                        D[l++] = D[t++];D[l++] = D[t++];D[l++] = D[t++];A -= 3;\n                      } while (A > 2);if (A) {\n                        D[l++] = D[t++];if (A > 1) {\n                          D[l++] = D[t++];\n                        }\n                      }\n                    }\n                  } else {\n                    if ((C & 64) === 0) {\n                      v = o[(v & 65535) + (w & (1 << C) - 1)];continue dodist;\n                    } else {\n                      H.msg = \"invalid distance code\";G.mode = e;break top;\n                    }\n                  }break;\n                }\n              } else {\n                if ((C & 64) === 0) {\n                  v = z[(v & 65535) + (w & (1 << C) - 1)];continue dolen;\n                } else {\n                  if (C & 32) {\n                    G.mode = j;break top;\n                  } else {\n                    H.msg = \"invalid literal/length code\";G.mode = e;break top;\n                  }\n                }\n              }\n            }break;\n          }\n        } while (k < y && l < s);A = n >> 3;k -= A;n -= A << 3;w &= (1 << n) - 1;H.next_in = k;H.next_out = l;H.avail_in = k < y ? 5 + (y - k) : 5 - (k - y);H.avail_out = l < s ? 257 + (s - l) : 257 - (l - s);G.hold = w;G.bits = n;return;\n      };\n    }, {}], 8: [function (ae, ab, y) {\n      var am = ae(\"../utils/common\");var e = ae(\"./adler32\");var m = ae(\"./crc32\");var F = ae(\"./inffast\");var G = ae(\"./inftrees\");var i = 0;var W = 1;var t = 2;var at = 4;var ao = 5;var az = 6;var aw = 0;var ax = 1;var av = 2;var ay = -2;var aq = -3;var au = -4;var ap = -5;var ar = 8;var D = 1;var B = 2;var ai = 3;var ad = 4;var x = 5;var z = 6;var ac = 7;var j = 8;var C = 9;var p = 10;var o = 11;var aj = 12;var ak = 13;var af = 14;var l = 15;var k = 16;var ah = 17;var V = 18;var h = 19;var R = 20;var Q = 21;var S = 22;var q = 23;var r = 24;var Y = 25;var X = 26;var g = 27;var U = 28;var u = 29;var f = 30;var aa = 31;var ag = 32;var w = 852;var v = 592;var Z = 15;var n = Z;function aA(aB) {\n        return (aB >>> 24 & 255) + (aB >>> 8 & 65280) + ((aB & 65280) << 8) + ((aB & 255) << 24);\n      }function P() {\n        this.mode = 0;this.last = !1;this.wrap = 0;this.havedict = !1;this.flags = 0;this.dmax = 0;this.check = 0;this.total = 0;this.head = null;this.wbits = 0;this.wsize = 0;this.whave = 0;this.wnext = 0;this.window = null;this.hold = 0;this.bits = 0;this.length = 0;this.offset = 0;this.extra = 0;this.lencode = null;this.distcode = null;this.lenbits = 0;this.distbits = 0;this.ncode = 0;this.nlen = 0;this.ndist = 0;this.have = 0;this.next = null;this.lens = new am.Buf16(320);this.work = new am.Buf16(288);this.lendyn = null;this.distdyn = null;this.sane = 0;this.back = 0;this.was = 0;\n      }function N(aC) {\n        var aB;if (!aC || !aC.state) {\n          return ay;\n        }aB = aC.state;aC.total_in = aC.total_out = aB.total = 0;aC.msg = \"\";if (aB.wrap) {\n          aC.adler = aB.wrap & 1;\n        }aB.mode = D;aB.last = 0;aB.havedict = 0;aB.dmax = 32768;aB.head = null;aB.hold = 0;aB.bits = 0;aB.lencode = aB.lendyn = new am.Buf32(w);aB.distcode = aB.distdyn = new am.Buf32(v);aB.sane = 1;aB.back = -1;return aw;\n      }function L(aC) {\n        var aB;if (!aC || !aC.state) {\n          return ay;\n        }aB = aC.state;aB.wsize = 0;aB.whave = 0;aB.wnext = 0;return N(aC);\n      }function M(aC, aD) {\n        var aE;var aB;if (!aC || !aC.state) {\n          return ay;\n        }aB = aC.state;if (aD < 0) {\n          aE = 0;aD = -aD;\n        } else {\n          aE = (aD >> 4) + 1;if (aD < 48) {\n            aD &= 15;\n          }\n        }if (aD && (aD < 8 || aD > 15)) {\n          return ay;\n        }if (aB.window !== null && aB.wbits !== aD) {\n          aB.window = null;\n        }aB.wrap = aE;aB.wbits = aD;return L(aC);\n      }function K(aD, aE) {\n        var aB;var aC;if (!aD) {\n          return ay;\n        }aC = new P();aD.state = aC;aC.window = null;aB = M(aD, aE);if (aB !== aw) {\n          aD.state = null;\n        }return aB;\n      }function J(aB) {\n        return K(aB, n);\n      }var an = !0;var T, s;function A(aB) {\n        if (an) {\n          var aC;T = new am.Buf32(512);s = new am.Buf32(32);aC = 0;while (aC < 144) {\n            aB.lens[aC++] = 8;\n          }while (aC < 256) {\n            aB.lens[aC++] = 9;\n          }while (aC < 280) {\n            aB.lens[aC++] = 7;\n          }while (aC < 288) {\n            aB.lens[aC++] = 8;\n          }G(W, aB.lens, 0, 288, T, 0, aB.work, { bits: 9 });aC = 0;while (aC < 32) {\n            aB.lens[aC++] = 5;\n          }G(t, aB.lens, 0, 32, s, 0, aB.work, { bits: 5 });an = !1;\n        }aB.lencode = T;aB.lenbits = 9;aB.distcode = s;aB.distbits = 5;\n      }function al(aG, aE, aD, aB) {\n        var aC;var aF = aG.state;if (aF.window === null) {\n          aF.wsize = 1 << aF.wbits;aF.wnext = 0;aF.whave = 0;aF.window = new am.Buf8(aF.wsize);\n        }if (aB >= aF.wsize) {\n          am.arraySet(aF.window, aE, aD - aF.wsize, aF.wsize, 0);aF.wnext = 0;aF.whave = aF.wsize;\n        } else {\n          aC = aF.wsize - aF.wnext;if (aC > aB) {\n            aC = aB;\n          }am.arraySet(aF.window, aE, aD - aB, aC, aF.wnext);aB -= aC;if (aB) {\n            am.arraySet(aF.window, aE, aD - aB, aB, 0);aF.wnext = aB;aF.whave = aF.wsize;\n          } else {\n            aF.wnext += aC;if (aF.wnext === aF.wsize) {\n              aF.wnext = 0;\n            }if (aF.whave < aF.wsize) {\n              aF.whave += aC;\n            }\n          }\n        }return 0;\n      }function E(a3, aF) {\n        var a2;var aP, aZ;var aW;var a0;var aI, aT;var aO;var aD;var aB, aC;var aE;var aG;var aH;var aK = 0;var aL, aM, aN;var aQ, aR, aS;var aU;var a1;var aJ = new am.Buf8(4);var aX;var aV;var aY = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];if (!a3 || !a3.state || !a3.output || !a3.input && a3.avail_in !== 0) {\n          return ay;\n        }a2 = a3.state;if (a2.mode === aj) {\n          a2.mode = ak;\n        }a0 = a3.next_out;aZ = a3.output;aT = a3.avail_out;aW = a3.next_in;aP = a3.input;aI = a3.avail_in;aO = a2.hold;aD = a2.bits;aB = aI;aC = aT;a1 = aw;inf_leave: for (;;) {\n          switch (a2.mode) {case D:\n              if (a2.wrap === 0) {\n                a2.mode = ak;break;\n              }while (aD < 16) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if (a2.wrap & 2 && aO === 35615) {\n                a2.check = 0;aJ[0] = aO & 255;aJ[1] = aO >>> 8 & 255;a2.check = m(a2.check, aJ, 2, 0);aO = 0;aD = 0;a2.mode = B;break;\n              }a2.flags = 0;if (a2.head) {\n                a2.head.done = !1;\n              }if (!(a2.wrap & 1) || (((aO & 255) << 8) + (aO >> 8)) % 31) {\n                a3.msg = \"incorrect header check\";a2.mode = f;break;\n              }if ((aO & 15) !== ar) {\n                a3.msg = \"unknown compression method\";a2.mode = f;break;\n              }aO >>>= 4;aD -= 4;aU = (aO & 15) + 8;if (a2.wbits === 0) {\n                a2.wbits = aU;\n              } else {\n                if (aU > a2.wbits) {\n                  a3.msg = \"invalid window size\";a2.mode = f;break;\n                }\n              }a2.dmax = 1 << aU;a3.adler = a2.check = 1;a2.mode = aO & 512 ? p : aj;aO = 0;aD = 0;break;case B:\n              while (aD < 16) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }a2.flags = aO;if ((a2.flags & 255) !== ar) {\n                a3.msg = \"unknown compression method\";a2.mode = f;break;\n              }if (a2.flags & 57344) {\n                a3.msg = \"unknown header flags set\";a2.mode = f;break;\n              }if (a2.head) {\n                a2.head.text = aO >> 8 & 1;\n              }if (a2.flags & 512) {\n                aJ[0] = aO & 255;aJ[1] = aO >>> 8 & 255;a2.check = m(a2.check, aJ, 2, 0);\n              }aO = 0;aD = 0;a2.mode = ai;case ai:\n              while (aD < 32) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if (a2.head) {\n                a2.head.time = aO;\n              }if (a2.flags & 512) {\n                aJ[0] = aO & 255;aJ[1] = aO >>> 8 & 255;aJ[2] = aO >>> 16 & 255;aJ[3] = aO >>> 24 & 255;a2.check = m(a2.check, aJ, 4, 0);\n              }aO = 0;aD = 0;a2.mode = ad;case ad:\n              while (aD < 16) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if (a2.head) {\n                a2.head.xflags = aO & 255;a2.head.os = aO >> 8;\n              }if (a2.flags & 512) {\n                aJ[0] = aO & 255;aJ[1] = aO >>> 8 & 255;a2.check = m(a2.check, aJ, 2, 0);\n              }aO = 0;aD = 0;a2.mode = x;case x:\n              if (a2.flags & 1024) {\n                while (aD < 16) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }a2.length = aO;if (a2.head) {\n                  a2.head.extra_len = aO;\n                }if (a2.flags & 512) {\n                  aJ[0] = aO & 255;aJ[1] = aO >>> 8 & 255;a2.check = m(a2.check, aJ, 2, 0);\n                }aO = 0;aD = 0;\n              } else {\n                if (a2.head) {\n                  a2.head.extra = null;\n                }\n              }a2.mode = z;case z:\n              if (a2.flags & 1024) {\n                aE = a2.length;if (aE > aI) {\n                  aE = aI;\n                }if (aE) {\n                  if (a2.head) {\n                    aU = a2.head.extra_len - a2.length;if (!a2.head.extra) {\n                      a2.head.extra = new Array(a2.head.extra_len);\n                    }am.arraySet(a2.head.extra, aP, aW, aE, aU);\n                  }if (a2.flags & 512) {\n                    a2.check = m(a2.check, aP, aE, aW);\n                  }aI -= aE;aW += aE;a2.length -= aE;\n                }if (a2.length) {\n                  break inf_leave;\n                }\n              }a2.length = 0;a2.mode = ac;case ac:\n              if (a2.flags & 2048) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aE = 0;do {\n                  aU = aP[aW + aE++];if (a2.head && aU && a2.length < 65536) {\n                    a2.head.name += String.fromCharCode(aU);\n                  }\n                } while (aU && aE < aI);if (a2.flags & 512) {\n                  a2.check = m(a2.check, aP, aE, aW);\n                }aI -= aE;aW += aE;if (aU) {\n                  break inf_leave;\n                }\n              } else {\n                if (a2.head) {\n                  a2.head.name = null;\n                }\n              }a2.length = 0;a2.mode = j;case j:\n              if (a2.flags & 4096) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aE = 0;do {\n                  aU = aP[aW + aE++];if (a2.head && aU && a2.length < 65536) {\n                    a2.head.comment += String.fromCharCode(aU);\n                  }\n                } while (aU && aE < aI);if (a2.flags & 512) {\n                  a2.check = m(a2.check, aP, aE, aW);\n                }aI -= aE;aW += aE;if (aU) {\n                  break inf_leave;\n                }\n              } else {\n                if (a2.head) {\n                  a2.head.comment = null;\n                }\n              }a2.mode = C;case C:\n              if (a2.flags & 512) {\n                while (aD < 16) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }if (aO !== (a2.check & 65535)) {\n                  a3.msg = \"header crc mismatch\";a2.mode = f;break;\n                }aO = 0;aD = 0;\n              }if (a2.head) {\n                a2.head.hcrc = a2.flags >> 9 & 1;a2.head.done = !0;\n              }a3.adler = a2.check = 0;a2.mode = aj;break;case p:\n              while (aD < 32) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }a3.adler = a2.check = aA(aO);aO = 0;aD = 0;a2.mode = o;case o:\n              if (a2.havedict === 0) {\n                a3.next_out = a0;a3.avail_out = aT;a3.next_in = aW;a3.avail_in = aI;a2.hold = aO;a2.bits = aD;return av;\n              }a3.adler = a2.check = 1;a2.mode = aj;case aj:\n              if (aF === ao || aF === az) {\n                break inf_leave;\n              }case ak:\n              if (a2.last) {\n                aO >>>= aD & 7;aD -= aD & 7;a2.mode = g;break;\n              }while (aD < 3) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }a2.last = aO & 1;aO >>>= 1;aD -= 1;switch (aO & 3) {case 0:\n                  a2.mode = af;break;case 1:\n                  A(a2);a2.mode = R;if (aF === az) {\n                    aO >>>= 2;aD -= 2;break inf_leave;\n                  }break;case 2:\n                  a2.mode = ah;break;case 3:\n                  a3.msg = \"invalid block type\";a2.mode = f;}aO >>>= 2;aD -= 2;break;case af:\n              aO >>>= aD & 7;aD -= aD & 7;while (aD < 32) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if ((aO & 65535) !== (aO >>> 16 ^ 65535)) {\n                a3.msg = \"invalid stored block lengths\";a2.mode = f;break;\n              }a2.length = aO & 65535;aO = 0;aD = 0;a2.mode = l;if (aF === az) {\n                break inf_leave;\n              }case l:\n              a2.mode = k;case k:\n              aE = a2.length;if (aE) {\n                if (aE > aI) {\n                  aE = aI;\n                }if (aE > aT) {\n                  aE = aT;\n                }if (aE === 0) {\n                  break inf_leave;\n                }am.arraySet(aZ, aP, aW, aE, a0);aI -= aE;aW += aE;aT -= aE;a0 += aE;a2.length -= aE;break;\n              }a2.mode = aj;break;case ah:\n              while (aD < 14) {\n                if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }a2.nlen = (aO & 31) + 257;aO >>>= 5;aD -= 5;a2.ndist = (aO & 31) + 1;aO >>>= 5;aD -= 5;a2.ncode = (aO & 15) + 4;aO >>>= 4;aD -= 4;if (a2.nlen > 286 || a2.ndist > 30) {\n                a3.msg = \"too many length or distance symbols\";a2.mode = f;break;\n              }a2.have = 0;a2.mode = V;case V:\n              while (a2.have < a2.ncode) {\n                while (aD < 3) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }a2.lens[aY[a2.have++]] = aO & 7;aO >>>= 3;aD -= 3;\n              }while (a2.have < 19) {\n                a2.lens[aY[a2.have++]] = 0;\n              }a2.lencode = a2.lendyn;a2.lenbits = 7;aX = { bits: a2.lenbits };a1 = G(i, a2.lens, 0, 19, a2.lencode, 0, a2.work, aX);a2.lenbits = aX.bits;if (a1) {\n                a3.msg = \"invalid code lengths set\";a2.mode = f;break;\n              }a2.have = 0;a2.mode = h;case h:\n              while (a2.have < a2.nlen + a2.ndist) {\n                for (;;) {\n                  aK = a2.lencode[aO & (1 << a2.lenbits) - 1];aL = aK >>> 24;aM = aK >>> 16 & 255;aN = aK & 65535;if (aL <= aD) {\n                    break;\n                  }if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }if (aN < 16) {\n                  aO >>>= aL;aD -= aL;a2.lens[a2.have++] = aN;\n                } else {\n                  if (aN === 16) {\n                    aV = aL + 2;while (aD < aV) {\n                      if (aI === 0) {\n                        break inf_leave;\n                      }aI--;aO += aP[aW++] << aD;aD += 8;\n                    }aO >>>= aL;aD -= aL;if (a2.have === 0) {\n                      a3.msg = \"invalid bit length repeat\";a2.mode = f;break;\n                    }aU = a2.lens[a2.have - 1];aE = 3 + (aO & 3);aO >>>= 2;aD -= 2;\n                  } else {\n                    if (aN === 17) {\n                      aV = aL + 3;while (aD < aV) {\n                        if (aI === 0) {\n                          break inf_leave;\n                        }aI--;aO += aP[aW++] << aD;aD += 8;\n                      }aO >>>= aL;aD -= aL;aU = 0;aE = 3 + (aO & 7);aO >>>= 3;aD -= 3;\n                    } else {\n                      aV = aL + 7;while (aD < aV) {\n                        if (aI === 0) {\n                          break inf_leave;\n                        }aI--;aO += aP[aW++] << aD;aD += 8;\n                      }aO >>>= aL;aD -= aL;aU = 0;aE = 11 + (aO & 127);aO >>>= 7;aD -= 7;\n                    }\n                  }if (a2.have + aE > a2.nlen + a2.ndist) {\n                    a3.msg = \"invalid bit length repeat\";a2.mode = f;break;\n                  }while (aE--) {\n                    a2.lens[a2.have++] = aU;\n                  }\n                }\n              }if (a2.mode === f) {\n                break;\n              }if (a2.lens[256] === 0) {\n                a3.msg = \"invalid code -- missing end-of-block\";a2.mode = f;break;\n              }a2.lenbits = 9;aX = { bits: a2.lenbits };a1 = G(W, a2.lens, 0, a2.nlen, a2.lencode, 0, a2.work, aX);a2.lenbits = aX.bits;if (a1) {\n                a3.msg = \"invalid literal/lengths set\";a2.mode = f;break;\n              }a2.distbits = 6;a2.distcode = a2.distdyn;aX = { bits: a2.distbits };a1 = G(t, a2.lens, a2.nlen, a2.ndist, a2.distcode, 0, a2.work, aX);a2.distbits = aX.bits;if (a1) {\n                a3.msg = \"invalid distances set\";a2.mode = f;break;\n              }a2.mode = R;if (aF === az) {\n                break inf_leave;\n              }case R:\n              a2.mode = Q;case Q:\n              if (aI >= 6 && aT >= 258) {\n                a3.next_out = a0;a3.avail_out = aT;a3.next_in = aW;a3.avail_in = aI;a2.hold = aO;a2.bits = aD;F(a3, aC);a0 = a3.next_out;aZ = a3.output;aT = a3.avail_out;aW = a3.next_in;aP = a3.input;aI = a3.avail_in;aO = a2.hold;aD = a2.bits;if (a2.mode === aj) {\n                  a2.back = -1;\n                }break;\n              }a2.back = 0;for (;;) {\n                aK = a2.lencode[aO & (1 << a2.lenbits) - 1];aL = aK >>> 24;aM = aK >>> 16 & 255;aN = aK & 65535;if (aL <= aD) {\n                  break;\n                }if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if (aM && (aM & 240) === 0) {\n                aQ = aL;aR = aM;aS = aN;for (;;) {\n                  aK = a2.lencode[aS + ((aO & (1 << aQ + aR) - 1) >> aQ)];aL = aK >>> 24;aM = aK >>> 16 & 255;aN = aK & 65535;if (aQ + aL <= aD) {\n                    break;\n                  }if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }aO >>>= aQ;aD -= aQ;a2.back += aQ;\n              }aO >>>= aL;aD -= aL;a2.back += aL;a2.length = aN;if (aM === 0) {\n                a2.mode = X;break;\n              }if (aM & 32) {\n                a2.back = -1;a2.mode = aj;break;\n              }if (aM & 64) {\n                a3.msg = \"invalid literal/length code\";a2.mode = f;break;\n              }a2.extra = aM & 15;a2.mode = S;case S:\n              if (a2.extra) {\n                aV = a2.extra;while (aD < aV) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }a2.length += aO & (1 << a2.extra) - 1;aO >>>= a2.extra;aD -= a2.extra;a2.back += a2.extra;\n              }a2.was = a2.length;a2.mode = q;case q:\n              for (;;) {\n                aK = a2.distcode[aO & (1 << a2.distbits) - 1];aL = aK >>> 24;aM = aK >>> 16 & 255;aN = aK & 65535;if (aL <= aD) {\n                  break;\n                }if (aI === 0) {\n                  break inf_leave;\n                }aI--;aO += aP[aW++] << aD;aD += 8;\n              }if ((aM & 240) === 0) {\n                aQ = aL;aR = aM;aS = aN;for (;;) {\n                  aK = a2.distcode[aS + ((aO & (1 << aQ + aR) - 1) >> aQ)];aL = aK >>> 24;aM = aK >>> 16 & 255;aN = aK & 65535;if (aQ + aL <= aD) {\n                    break;\n                  }if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }aO >>>= aQ;aD -= aQ;a2.back += aQ;\n              }aO >>>= aL;aD -= aL;a2.back += aL;if (aM & 64) {\n                a3.msg = \"invalid distance code\";a2.mode = f;break;\n              }a2.offset = aN;a2.extra = aM & 15;a2.mode = r;case r:\n              if (a2.extra) {\n                aV = a2.extra;while (aD < aV) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }a2.offset += aO & (1 << a2.extra) - 1;aO >>>= a2.extra;aD -= a2.extra;a2.back += a2.extra;\n              }if (a2.offset > a2.dmax) {\n                a3.msg = \"invalid distance too far back\";a2.mode = f;break;\n              }a2.mode = Y;case Y:\n              if (aT === 0) {\n                break inf_leave;\n              }aE = aC - aT;if (a2.offset > aE) {\n                aE = a2.offset - aE;if (aE > a2.whave) {\n                  if (a2.sane) {\n                    a3.msg = \"invalid distance too far back\";a2.mode = f;break;\n                  }\n                }if (aE > a2.wnext) {\n                  aE -= a2.wnext;aG = a2.wsize - aE;\n                } else {\n                  aG = a2.wnext - aE;\n                }if (aE > a2.length) {\n                  aE = a2.length;\n                }aH = a2.window;\n              } else {\n                aH = aZ;aG = a0 - a2.offset;aE = a2.length;\n              }if (aE > aT) {\n                aE = aT;\n              }aT -= aE;a2.length -= aE;do {\n                aZ[a0++] = aH[aG++];\n              } while (--aE);if (a2.length === 0) {\n                a2.mode = Q;\n              }break;case X:\n              if (aT === 0) {\n                break inf_leave;\n              }aZ[a0++] = a2.length;aT--;a2.mode = Q;break;case g:\n              if (a2.wrap) {\n                while (aD < 32) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO |= aP[aW++] << aD;aD += 8;\n                }aC -= aT;a3.total_out += aC;a2.total += aC;if (aC) {\n                  a3.adler = a2.check = a2.flags ? m(a2.check, aZ, aC, a0 - aC) : e(a2.check, aZ, aC, a0 - aC);\n                }aC = aT;if ((a2.flags ? aO : aA(aO)) !== a2.check) {\n                  a3.msg = \"incorrect data check\";a2.mode = f;break;\n                }aO = 0;aD = 0;\n              }a2.mode = U;case U:\n              if (a2.wrap && a2.flags) {\n                while (aD < 32) {\n                  if (aI === 0) {\n                    break inf_leave;\n                  }aI--;aO += aP[aW++] << aD;aD += 8;\n                }if (aO !== (a2.total & 4294967295)) {\n                  a3.msg = \"incorrect length check\";a2.mode = f;break;\n                }aO = 0;aD = 0;\n              }a2.mode = u;case u:\n              a1 = ax;break inf_leave;case f:\n              a1 = aq;break inf_leave;case aa:\n              return au;case ag:default:\n              return ay;}\n        }a3.next_out = a0;a3.avail_out = aT;a3.next_in = aW;a3.avail_in = aI;a2.hold = aO;a2.bits = aD;if (a2.wsize || aC !== a3.avail_out && a2.mode < f && (a2.mode < g || aF !== at)) {\n          if (al(a3, a3.output, a3.next_out, aC - a3.avail_out)) {\n            a2.mode = aa;return au;\n          }\n        }aB -= a3.avail_in;aC -= a3.avail_out;a3.total_in += aB;a3.total_out += aC;a2.total += aC;if (a2.wrap && aC) {\n          a3.adler = a2.check = a2.flags ? m(a2.check, aZ, aC, a3.next_out - aC) : e(a2.check, aZ, aC, a3.next_out - aC);\n        }a3.data_type = a2.bits + (a2.last ? 64 : 0) + (a2.mode === aj ? 128 : 0) + (a2.mode === R || a2.mode === l ? 256 : 0);if ((aB === 0 && aC === 0 || aF === at) && a1 === aw) {\n          a1 = ap;\n        }return a1;\n      }function H(aC) {\n        if (!aC || !aC.state) {\n          return ay;\n        }var aB = aC.state;if (aB.window) {\n          aB.window = null;\n        }aC.state = null;return aw;\n      }function I(aD, aB) {\n        var aC;if (!aD || !aD.state) {\n          return ay;\n        }aC = aD.state;if ((aC.wrap & 2) === 0) {\n          return ay;\n        }aC.head = aB;aB.done = !1;return aw;\n      }function O(aG, aC) {\n        var aD = aC.length;var aF;var aB;var aE;if (!aG || !aG.state) {\n          return ay;\n        }aF = aG.state;if (aF.wrap !== 0 && aF.mode !== o) {\n          return ay;\n        }if (aF.mode === o) {\n          aB = 1;aB = e(aB, aC, aD, 0);if (aB !== aF.check) {\n            return aq;\n          }\n        }aE = al(aG, aC, aD, aD);if (aE) {\n          aF.mode = aa;return au;\n        }aF.havedict = 1;return aw;\n      }y.inflateReset = L;y.inflateReset2 = M;y.inflateResetKeep = N;y.inflateInit = J;y.inflateInit2 = K;y.inflate = E;y.inflateEnd = H;y.inflateGetHeader = I;y.inflateSetDictionary = O;y.inflateInfo = \"pako inflate (from Nodeca project)\";\n    }, { \"../utils/common\": 1, \"./adler32\": 3, \"./crc32\": 5, \"./inffast\": 7, \"./inftrees\": 9 }], 9: [function (r, q, k) {\n      var s = r(\"../utils/common\");var p = 15;var j = 852;var i = 592;var e = 0;var n = 1;var h = 2;var m = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];var o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];var f = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];var g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];q.exports = function l(Z, M, N, w, X, Y, ab, U) {\n        var v = U.bits;var L = 0;var W = 0;var R = 0,\n            Q = 0;var V = 0;var y = 0;var z = 0;var K = 0;var aa = 0;var H = 0;var J;var D;var O;var P;var S;var t = null;var u = 0;var A;var x = new s.Buf16(p + 1);var T = new s.Buf16(p + 1);var B = null;var C = 0;var E, F, G;for (L = 0; L <= p; L++) {\n          x[L] = 0;\n        }for (W = 0; W < w; W++) {\n          x[M[N + W]]++;\n        }V = v;for (Q = p; Q >= 1; Q--) {\n          if (x[Q] !== 0) {\n            break;\n          }\n        }if (V > Q) {\n          V = Q;\n        }if (Q === 0) {\n          X[Y++] = 1 << 24 | 64 << 16 | 0;X[Y++] = 1 << 24 | 64 << 16 | 0;U.bits = 1;return 0;\n        }for (R = 1; R < Q; R++) {\n          if (x[R] !== 0) {\n            break;\n          }\n        }if (V < R) {\n          V = R;\n        }K = 1;for (L = 1; L <= p; L++) {\n          K <<= 1;K -= x[L];if (K < 0) {\n            return -1;\n          }\n        }if (K > 0 && (Z === e || Q !== 1)) {\n          return -1;\n        }T[1] = 0;for (L = 1; L < p; L++) {\n          T[L + 1] = T[L] + x[L];\n        }for (W = 0; W < w; W++) {\n          if (M[N + W] !== 0) {\n            ab[T[M[N + W]]++] = W;\n          }\n        }if (Z === e) {\n          t = B = ab;A = 19;\n        } else {\n          if (Z === n) {\n            t = m;u -= 257;B = o;C -= 257;A = 256;\n          } else {\n            t = f;B = g;A = -1;\n          }\n        }H = 0;W = 0;L = R;S = Y;y = V;z = 0;O = -1;aa = 1 << V;P = aa - 1;if (Z === n && aa > j || Z === h && aa > i) {\n          return 1;\n        }var I = 0;for (;;) {\n          I++;E = L - z;if (ab[W] < A) {\n            F = 0;G = ab[W];\n          } else {\n            if (ab[W] > A) {\n              F = B[C + ab[W]];G = t[u + ab[W]];\n            } else {\n              F = 32 + 64;G = 0;\n            }\n          }J = 1 << L - z;D = 1 << y;R = D;do {\n            D -= J;X[S + (H >> z) + D] = E << 24 | F << 16 | G | 0;\n          } while (D !== 0);J = 1 << L - 1;while (H & J) {\n            J >>= 1;\n          }if (J !== 0) {\n            H &= J - 1;H += J;\n          } else {\n            H = 0;\n          }W++;if (--x[L] === 0) {\n            if (L === Q) {\n              break;\n            }L = M[N + ab[W]];\n          }if (L > V && (H & P) !== O) {\n            if (z === 0) {\n              z = V;\n            }S += R;y = L - z;K = 1 << y;while (y + z < Q) {\n              K -= x[y + z];if (K <= 0) {\n                break;\n              }y++;K <<= 1;\n            }aa += 1 << y;if (Z === n && aa > j || Z === h && aa > i) {\n              return 1;\n            }O = H & P;X[O] = V << 24 | y << 16 | S - Y | 0;\n          }\n        }if (H !== 0) {\n          X[S + H] = L - z << 24 | 64 << 16 | 0;\n        }U.bits = V;return 0;\n      };\n    }, { \"../utils/common\": 1 }], 10: [function (g, f, e) {\n      f.exports = { 2: \"need dictionary\", 1: \"stream end\", 0: \"\", \"-1\": \"file error\", \"-2\": \"stream error\", \"-3\": \"data error\", \"-4\": \"insufficient memory\", \"-5\": \"buffer error\", \"-6\": \"incompatible version\" };\n    }, {}], 11: [function (g, f, e) {\n      function h() {\n        this.input = null;this.next_in = 0;this.avail_in = 0;this.total_in = 0;this.output = null;this.next_out = 0;this.avail_out = 0;this.total_out = 0;this.msg = \"\";this.state = null;this.data_type = 2;this.adler = 0;\n      }f.exports = h;\n    }, {}], \"/lib/inflate.js\": [function (m, k, f) {\n      var q = m(\"./zlib/inflate\");var p = m(\"./utils/common\");var n = m(\"./utils/strings\");var e = m(\"./zlib/constants\");var l = m(\"./zlib/messages\");var r = m(\"./zlib/zstream\");var g = m(\"./zlib/gzheader\");var o = Object.prototype.toString;function i(t) {\n        if (!(this instanceof i)) {\n          return new i(t);\n        }this.options = p.assign({ chunkSize: 16384, windowBits: 0, to: \"\" }, t || {});var s = this.options;if (s.raw && s.windowBits >= 0 && s.windowBits < 16) {\n          s.windowBits = -s.windowBits;if (s.windowBits === 0) {\n            s.windowBits = -15;\n          }\n        }if (s.windowBits >= 0 && s.windowBits < 16 && !(t && t.windowBits)) {\n          s.windowBits += 32;\n        }if (s.windowBits > 15 && s.windowBits < 48) {\n          if ((s.windowBits & 15) === 0) {\n            s.windowBits |= 15;\n          }\n        }this.err = 0;this.msg = \"\";this.ended = !1;this.chunks = [];this.strm = new r();this.strm.avail_out = 0;var u = q.inflateInit2(this.strm, s.windowBits);if (u !== e.Z_OK) {\n          throw new Error(l[u]);\n        }this.header = new g();q.inflateGetHeader(this.strm, this.header);\n      }i.prototype.push = function (v, y) {\n        var B = this.strm;var u = this.options.chunkSize;var x = this.options.dictionary;var A, s;var z, C, D;var w;var t = !1;if (this.ended) {\n          return !1;\n        }s = y === ~~y ? y : y === !0 ? e.Z_FINISH : e.Z_NO_FLUSH;if (typeof v === \"string\") {\n          B.input = n.binstring2buf(v);\n        } else {\n          if (o.call(v) === \"[object ArrayBuffer]\") {\n            B.input = new Uint8Array(v);\n          } else {\n            B.input = v;\n          }\n        }B.next_in = 0;B.avail_in = B.input.length;do {\n          if (B.avail_out === 0) {\n            B.output = new p.Buf8(u);B.next_out = 0;B.avail_out = u;\n          }A = q.inflate(B, e.Z_NO_FLUSH);if (A === e.Z_NEED_DICT && x) {\n            if (typeof x === \"string\") {\n              w = n.string2buf(x);\n            } else {\n              if (o.call(x) === \"[object ArrayBuffer]\") {\n                w = new Uint8Array(x);\n              } else {\n                w = x;\n              }\n            }A = q.inflateSetDictionary(this.strm, w);\n          }if (A === e.Z_BUF_ERROR && t === !0) {\n            A = e.Z_OK;t = !1;\n          }if (A !== e.Z_STREAM_END && A !== e.Z_OK) {\n            this.onEnd(A);this.ended = !0;return !1;\n          }if (B.next_out) {\n            if (B.avail_out === 0 || A === e.Z_STREAM_END || B.avail_in === 0 && (s === e.Z_FINISH || s === e.Z_SYNC_FLUSH)) {\n              if (this.options.to === \"string\") {\n                z = n.utf8border(B.output, B.next_out);C = B.next_out - z;D = n.buf2string(B.output, z);B.next_out = C;B.avail_out = u - C;if (C) {\n                  p.arraySet(B.output, B.output, z, C, 0);\n                }this.onData(D);\n              } else {\n                this.onData(p.shrinkBuf(B.output, B.next_out));\n              }\n            }\n          }if (B.avail_in === 0 && B.avail_out === 0) {\n            t = !0;\n          }\n        } while ((B.avail_in > 0 || B.avail_out === 0) && A !== e.Z_STREAM_END);if (A === e.Z_STREAM_END) {\n          s = e.Z_FINISH;\n        }if (s === e.Z_FINISH) {\n          A = q.inflateEnd(this.strm);this.onEnd(A);this.ended = !0;return A === e.Z_OK;\n        }if (s === e.Z_SYNC_FLUSH) {\n          this.onEnd(e.Z_OK);B.avail_out = 0;return !0;\n        }return !0;\n      };i.prototype.onData = function (s) {\n        this.chunks.push(s);\n      };i.prototype.onEnd = function (s) {\n        if (s === e.Z_OK) {\n          if (this.options.to === \"string\") {\n            this.result = this.chunks.join(\"\");\n          } else {\n            this.result = p.flattenChunks(this.chunks);\n          }\n        }this.chunks = [];this.err = s;this.msg = this.strm.msg;\n      };function h(t, u) {\n        var s = new i(u);s.push(t, !0);if (s.err) {\n          throw s.msg;\n        }return s.result;\n      }function j(s, t) {\n        t = t || {};t.raw = !0;return h(s, t);\n      }f.Inflate = i;f.inflate = h;f.inflateRaw = j;f.ungzip = h;\n    }, { \"./utils/common\": 1, \"./utils/strings\": 2, \"./zlib/constants\": 4, \"./zlib/gzheader\": 6, \"./zlib/inflate\": 8, \"./zlib/messages\": 10, \"./zlib/zstream\": 11 }] }, {}, [])(\"/lib/inflate.js\");\n});function PngImage() {\n  var m = \"\",\n      i = this,\n      j = new PngToy(),\n      a,\n      b,\n      n = 0,\n      g = 0,\n      c = !1;this.onload = null;this.onerror = null;Object.defineProperty(this, \"src\", { get: function get() {\n      return m;\n    }, set: function set(h) {\n      m = h;k();\n    } });Object.defineProperty(this, \"width\", { get: function get() {\n      return n;\n    } });Object.defineProperty(this, \"height\", { get: function get() {\n      return g;\n    } });Object.defineProperty(this, \"naturalWidth\", { get: function get() {\n      return n;\n    } });Object.defineProperty(this, \"naturalHeight\", { get: function get() {\n      return g;\n    } });Object.defineProperty(this, \"image\", { get: function get() {\n      return b;\n    } });Object.defineProperty(this, \"pngtoy\", { get: function get() {\n      return j;\n    } });Object.defineProperty(this, \"complete\", { get: function get() {\n      return c;\n    } });function k() {\n    j.fetch(m).then(e, f);\n  }function e(h) {\n    j.decode(h).then(d, f);\n  }function d(h) {\n    a = h;n = h.width;g = h.height;j.convertToCanvas(h, { ignoreAspectRatio: !1, useGamma: !1 }).then(l.bind(i), f.bind(i));\n  }function l(h) {\n    b = h;c = !0;if (i.onload) {\n      i.onload({ timeStamp: Date.now() });\n    }\n  }function f(h) {\n    if (i.onerror) {\n      i.onerror({ message: h, timeStamp: Date.now() });\n    }\n  }\n};\nwindow.PngToy = PngToy;"

/***/ },
/* 41 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OnScreenController = exports.KeyboardController = exports.CRTScreen = exports.Screen = exports.Ram = exports.OS = exports.JSGS = undefined;

__webpack_require__(15);

__webpack_require__(14);

var _Keyboard = __webpack_require__(1);

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _OnScreen = __webpack_require__(9);

var _OnScreen2 = _interopRequireDefault(_OnScreen);

var _JSGS = __webpack_require__(10);

var _JSGS2 = _interopRequireDefault(_JSGS);

var _OS = __webpack_require__(11);

var _OS2 = _interopRequireDefault(_OS);

var _Ram = __webpack_require__(12);

var _Ram2 = _interopRequireDefault(_Ram);

var _Screen = __webpack_require__(2);

var _Screen2 = _interopRequireDefault(_Screen);

var _CRTScreen = __webpack_require__(13);

var _CRTScreen2 = _interopRequireDefault(_CRTScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.JSGS = _JSGS2.default;
exports.OS = _OS2.default;
exports.Ram = _Ram2.default;
exports.Screen = _Screen2.default;
exports.CRTScreen = _CRTScreen2.default;
exports.KeyboardController = _Keyboard2.default;
exports.OnScreenController = _OnScreen2.default;

/***/ }
/******/ ]);