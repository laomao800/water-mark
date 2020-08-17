/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function getType(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
}
function isPlainObject(payload) {
    if (getType(payload) !== 'Object')
        return false;
    return (payload.constructor === Object &&
        Object.getPrototypeOf(payload) === Object.prototype);
}
var parsePx = function (input) {
    var num = parseInt(input);
    num = !isNaN(num) ? num : 0;
    return num + "px";
};
var getTextRect = function (text, fontSize, lineHeight) {
    if (lineHeight === void 0) { lineHeight = '1.4'; }
    var $wrap = document.createElement('div');
    $wrap.style['display'] = 'inline-block';
    $wrap.style['whiteSpace'] = 'pre-wrap';
    $wrap.style['position'] = 'fixed';
    $wrap.style['opacity'] = '0';
    $wrap.style['fontSize'] = parsePx(fontSize);
    $wrap.style['lineHeight'] = lineHeight;
    $wrap.innerHTML = text;
    document.body.appendChild($wrap);
    var _a = $wrap.getBoundingClientRect(), width = _a.width, height = _a.height;
    document.body.removeChild($wrap);
    return { width: width, height: height };
};

var BASIC_MASK_STYLE = "pointer-events:none;position:fixed;";
var WaterMark = /** @class */ (function () {
    function WaterMark(def) {
        this.$el = document.body;
        this.$mask = null;
        this.text = '';
        this.config = {
            fontSize: 12,
            color: '#000',
            opacity: 0.08,
            gap: 120,
            rotate: -15,
            offset: [0, 0],
            zIndex: 999999
        };
        if (isPlainObject(def)) {
            this.config = __assign(__assign({}, this.config), def);
            this.text = def.text;
            if (typeof def.el === 'string') {
                this.$el = document.querySelector(def.el);
            }
            else if (def.el) {
                this.$el = def.el;
            }
        }
        else {
            this.text = def;
        }
        if (!this.$el)
            return;
        this.createMask();
    }
    WaterMark.prototype.createMask = function () {
        this.$mask = document.createElement('div');
        this.$mask.setAttribute('style', BASIC_MASK_STYLE);
        this.$mask.style.zIndex = this.config.zIndex;
        this.$mask.style.opacity = this.config.opacity;
        this.$mask.style.backgroundImage = "url(\"" + this.createMaskImage() + "\")";
        if (this.$el === document.body) {
            this.$mask.style.top = 0;
            this.$mask.style.left = 0;
            this.$mask.style.width = '100%';
            this.$mask.style.height = '100%';
        }
        else {
            var _a = this.$el.getBoundingClientRect(), top_1 = _a.top, left = _a.left, width = _a.width, height = _a.height;
            this.$mask.style.top = parsePx(top_1);
            this.$mask.style.left = parsePx(left);
            this.$mask.style.width = parsePx(width);
            this.$mask.style.height = parsePx(height);
        }
        this.$el.appendChild(this.$mask);
    };
    WaterMark.prototype.createMaskImage = function () {
        var _this = this;
        var _a = getTextRect(this.text, this.config.fontSize), textWidth = _a.width, textHeight = _a.height;
        var abs = Math.abs, sin = Math.sin, cos = Math.cos;
        var rotate = this.config.rotate;
        var gap = this.config.gap;
        var _b = this.config.offset, offsetX = _b[0], offsetY = _b[1];
        offsetX = offsetX + this.config.fontSize;
        offsetY = offsetY + this.config.fontSize;
        if (rotate < 0) {
            offsetY = offsetY + abs(textWidth * cos(rotate));
        }
        var width = abs(textWidth * sin(rotate)) + abs(textHeight * cos(rotate));
        var height = abs(textWidth * cos(rotate)) + abs(textHeight * sin(rotate));
        width = Math.ceil(width + offsetX) + abs(textWidth * cos(rotate)) + gap * 2;
        height = Math.ceil(height) + gap;
        var _genText = function (x, y) {
            return "<text transform='translate(" + x + ", " + y + ") rotate(" + rotate + ")' fill='" + color + "' font-size='" + _this.config.fontSize + "'>" + _this.text + "</text>";
        };
        var color = encodeURIComponent(this.config.color);
        var text1 = _genText(offsetX, offsetY);
        var text2 = _genText(offsetX + textWidth + gap / 2, offsetY + gap);
        var svg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='" + height + "px' width='" + width + "px'>" + text1 + text2 + "</svg>";
        return svg;
    };
    WaterMark.prototype.destroy = function () {
        this.$el.removeChild(this.$mask);
        this.$mask = null;
    };
    return WaterMark;
}());

function initWaterMark(config) {
    return new WaterMark(config);
}

export default initWaterMark;
