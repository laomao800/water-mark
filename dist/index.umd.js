!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).waterMark=e()}(this,function(){"use strict";var e=function(){return(e=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var n in e=arguments[i])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)};function i(t){var e;return"Object"===(e=t,Object.prototype.toString.call(e).slice(8,-1))&&(t.constructor===Object&&Object.getPrototypeOf(t)===Object.prototype)}function y(t){var e=parseInt(t);return(e=isNaN(e)?0:e)+"px"}var s=(t.prototype.createMask=function(){var t,e,i,s,n;this.$mask=document.createElement("div"),this.$mask.setAttribute("style","pointer-events:none;position:fixed;"),this.$mask.style.zIndex=this.config.zIndex,this.$mask.style.opacity=this.config.opacity,this.$mask.style.backgroundImage='url("'+this.createMaskImage()+'")',this.$el===document.body?(this.$mask.style.top=0,this.$mask.style.left=0,this.$mask.style.width="100%",this.$mask.style.height="100%"):(e=(t=this.$el.getBoundingClientRect()).top,i=t.left,s=t.width,n=t.height,this.$mask.style.top=y(e),this.$mask.style.left=y(i),this.$mask.style.width=y(s),this.$mask.style.height=y(n)),this.$el.appendChild(this.$mask)},t.prototype.createMaskImage=function(){var i=this,t=function(t,e,i){void 0===i&&(i="1.4");var s=document.createElement("div");s.style.display="inline-block",s.style.whiteSpace="pre-wrap",s.style.position="fixed",s.style.opacity="0",s.style.fontSize=y(e),s.style.lineHeight=i,s.innerHTML=t,document.body.appendChild(s);var n=s.getBoundingClientRect(),o=n.width,h=n.height;return document.body.removeChild(s),{width:o,height:h}}(this.text,this.config.fontSize),e=t.width,s=t.height,n=Math.abs,o=Math.sin,h=Math.cos,a=this.config.rotate,r=this.config.gap,l=this.config.offset,c=l[0],f=l[1];c+=this.config.fontSize,f+=this.config.fontSize,a<0&&(f+=n(e*h(a)));function d(t,e){return"<text transform='translate("+t+", "+e+") rotate("+a+")' fill='"+g+"' font-size='"+i.config.fontSize+"'>"+i.text+"</text>"}var p=n(e*o(a))+n(s*h(a)),u=n(e*h(a))+n(s*o(a)),p=Math.ceil(p+c)+n(e*h(a))+2*r,u=Math.ceil(u)+r,g=encodeURIComponent(this.config.color);return"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='"+u+"px' width='"+p+"px'>"+d(c,f)+d(c+e+r/2,f+r)+"</svg>"},t.prototype.destroy=function(){this.$el.removeChild(this.$mask),this.$mask=null},t);function t(t){this.$el=document.body,this.$mask=null,this.text="",this.config={fontSize:12,color:"#000",opacity:.08,gap:120,rotate:-15,offset:[0,0],zIndex:999999},i(t)?(this.config=e(e({},this.config),t),this.text=t.text,"string"==typeof t.el?this.$el=document.querySelector(t.el):t.el&&(this.$el=t.el)):this.text=t,this.$el&&this.createMask()}return function(t){return new s(t)}});