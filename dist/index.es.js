var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function getType(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isPlainObject(payload) {
  if (getType(payload) !== "Object")
    return false;
  return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
}
const parsePx = (input) => {
  let num = parseInt(input);
  num = !isNaN(num) ? num : 0;
  return `${num}px`;
};
const getTextRect = (text, fontSize, lineHeight = "1.4") => {
  const $wrap = document.createElement("div");
  $wrap.style["display"] = "inline-block";
  $wrap.style["whiteSpace"] = "pre-wrap";
  $wrap.style["position"] = "fixed";
  $wrap.style["opacity"] = "0";
  $wrap.style["fontSize"] = parsePx(fontSize);
  $wrap.style["lineHeight"] = lineHeight;
  $wrap.innerHTML = text;
  document.body.appendChild($wrap);
  const { width, height } = $wrap.getBoundingClientRect();
  document.body.removeChild($wrap);
  return { width, height };
};
const PX_RATIO = window.devicePixelRatio;
function getDeg(deg) {
  return deg * (Math.PI / 180);
}
class WaterMark {
  constructor(def) {
    this.$el = document.body;
    this.$mask = null;
    this.text = "";
    this.config = {
      fixed: true,
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.1)",
      gap: 10,
      rotate: -15,
      offset: 0,
      width: null,
      height: null,
      zIndex: 999999,
      debug: false
    };
    if (isPlainObject(def)) {
      this.config = __spreadValues(__spreadValues({}, this.config), def);
      this.text = def.text;
      if (typeof def.el === "string") {
        this.$el = document.querySelector(def.el);
      } else if (def.el) {
        this.$el = def.el;
      }
    } else {
      this.text = def;
    }
    if (!this.$el)
      return;
  }
  createMaskElm() {
    const { dataURL } = this.createWaterMarkImage();
    const maskEl = document.createElement("div");
    maskEl.setAttribute("style", "pointer-events:none;");
    maskEl.style.zIndex = String(this.config.zIndex);
    maskEl.style.backgroundImage = `url(${dataURL})`;
    maskEl.style.width = "100%";
    maskEl.style.top = "0";
    maskEl.style.left = "0";
    if (this.$el === document.body) {
      maskEl.style.height = `${this.$el.scrollHeight}px`;
      if (this.config.fixed) {
        maskEl.style.position = "fixed";
      } else {
        this.$el.style.position = "relative";
        maskEl.style.position = "absolute";
      }
    } else {
      this.$el.style.position = "relative";
      if (this.config.fixed) {
        const { height } = this.$el.getBoundingClientRect();
        maskEl.style.position = "sticky";
        maskEl.style.height = parsePx(height);
        maskEl.style.marginBottom = parsePx(height * -1);
      } else {
        this.$el.style.position = "relative";
        maskEl.style.position = "absolute";
        maskEl.style.height = parsePx(this.$el.scrollHeight);
      }
    }
    this.destroy();
    this.$el.prepend(maskEl);
    this.$el.dataset;
    this.$mask = maskEl;
  }
  createWaterMarkImage() {
    const { abs, sin, cos } = Math;
    const { offset, fontSize, gap, rotate, debug, width, height } = this.config;
    const { width: textWidth, height: textHeight } = getTextRect(this.text, fontSize);
    let gapX;
    let gapY;
    if (Array.isArray(gap)) {
      [gapX, gapY] = gap;
    } else {
      gapX = gap || 0;
      gapY = gap || 0;
    }
    let offsetX;
    let offsetY;
    if (Array.isArray(offset)) {
      [offsetX, offsetY] = offset;
    } else {
      offsetX = offset || 0;
      offsetY = offset || 0;
    }
    if (rotate < 0) {
      offsetY = offsetY + abs(textWidth * sin(getDeg(rotate)));
    }
    let _width = width;
    if (!_width) {
      _width = abs(textHeight * cos(getDeg(rotate)));
      _width = Math.ceil(_width + offsetX) + abs(textWidth * cos(getDeg(rotate))) + gapX * 2;
    }
    let _height = height;
    if (!_height) {
      _height = abs(textWidth * sin(getDeg(rotate))) + abs(textHeight * cos(getDeg(rotate)));
      _height = Math.ceil(_height) + gapY;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const canvasWidth = (_width + gapX) * PX_RATIO;
    const canvasHeight = (_height + gapY) * PX_RATIO;
    const canvasOffsetLeft = offsetX * PX_RATIO;
    const canvasOffsetTop = offsetY * PX_RATIO;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const markWidth = canvasWidth * PX_RATIO;
    const markHeight = canvasHeight * PX_RATIO;
    if (debug) {
      ctx.strokeStyle = "#aaa";
      ctx.strokeRect(0, 0, markWidth, markHeight);
    }
    ctx.rotate(rotate * (Math.PI / 180));
    if (debug) {
      ctx.strokeStyle = "#369";
      ctx.strokeRect(0, 0, markWidth, markHeight);
    }
    ctx.font = `${this.config.fontSize}px Arial`;
    ctx.fillStyle = this.config.color;
    ctx.fillText(this.text, canvasOffsetLeft, canvasOffsetTop + fontSize * PX_RATIO);
    return {
      dataURL: canvas.toDataURL(),
      width: canvasWidth,
      height: canvasHeight
    };
  }
  render() {
    this.createMaskElm();
    return this;
  }
  destroy() {
    if (this.$mask) {
      this.$el.removeChild(this.$mask);
      this.$mask = null;
    }
  }
}
function renderWaterMark(config) {
  return new WaterMark(config).render();
}
function createWaterMarkImage(config) {
  return new WaterMark(config).createWaterMarkImage();
}
export { WaterMark, createWaterMarkImage, renderWaterMark as default };
