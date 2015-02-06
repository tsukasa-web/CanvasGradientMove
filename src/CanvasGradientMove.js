/*
  CanvasGradientMove
  Copyright(c) 2015 SHIFTBRAIN - Tsukasa Tokura
  This software is released under the MIT License.
  http://opensource.org/licenses/mit-license.php
 */
var CanvasGradientMove,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

CanvasGradientMove = (function() {
  CanvasGradientMove.prototype.defaults = {
    colorArray: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#e4d874', '#41431f', '#6d7039', '#646a00', '#cfd46c', '#ffdf69', '#bca84e', '#584d23', '#c4b052', '#e09c64', '#b98256', '#674734', '#e7aa4a', '#ceaa89', '#744e2a', '#ceaa89', '#ffefd8', '#61afd3', '#2d5ea8', '#233b5e', '#1b2b40', '#101c2f', '#192a47', '#1363a9', '#c8fff5', '#DDDDDD', '#DDDDDD', '#DDDDDD', '#EEEEEE'],
    colorPoint: [0, 0.5, 1],
    firstScene: 0,
    directionX: 'right',
    directionY: 'bottom',
    deg: 45,
    directPointMode: null,
    maskImg: false,
    liquid: true
  };

  function CanvasGradientMove(_$targetParent, options) {
    this.moveFrame = __bind(this.moveFrame, this);
    this.canvasClear = __bind(this.canvasClear, this);
    this.canvasDrawGradient = __bind(this.canvasDrawGradient, this);
    this._EasingGradient = __bind(this._EasingGradient, this);
    this.gradientMove = __bind(this.gradientMove, this);
    this._canvasResize = __bind(this._canvasResize, this);
    var i, _i, _ref;
    this.options = $.extend({}, this.defaults, options);
    this.$targetParent = _$targetParent;
    this.gradientNum = this.options.colorPoint.length;
    this.animObj = {
      progress: 0
    };
    this.colorObj = [];
    this.nowFrame = {
      scene: this.options.firstScene,
      percent: 0
    };
    this.rad = this.options.deg * Math.PI / 180;
    if (this.nowFrame.scene < 0 || this.nowFrame.scene > this.options.colorArray.length - 1) {
      console.error("Input Error : FirstFrame - Input Number 1 ~ " + this.options.colorArray.length);
      return false;
    } else if (this.options.deg < 0 || this.options.deg > 90) {
      console.error("Input Error : deg - Input Number 0 ~ 90");
      return false;
    } else {
      for (i = _i = 0, _ref = this.gradientNum; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.nowFrame.scene + i > this.options.colorArray.length - 1) {
          i = (this.nowFrame.scene + i) % (this.options.colorArray.length - 1);
          this.colorObj.push(this.options.colorArray[i]);
        } else {
          this.colorObj.push(this.options.colorArray[this.nowFrame.scene + i]);
        }
      }
    }
  }

  CanvasGradientMove.prototype.init = function() {
    this.$targetParent.append('<canvas class="canvas-gradient"></canvas>');
    this.canvas = this.$targetParent.find('.canvas-gradient')[0];
    this.ctx = this.canvas.getContext("2d");
    this._canvasResize();
    if (this.options.liquid) {
      return $(window).on('resize', this._debounce((function(_this) {
        return function() {
          return _this._canvasResize();
        };
      })(this), 300));
    }
  };

  CanvasGradientMove.prototype._canvasResize = function() {
    var parentHeight, parentWidth;
    parentWidth = this.$targetParent.width();
    parentHeight = this.$targetParent.height();
    $(this.canvas).attr({
      'width': parentWidth,
      'height': parentHeight
    });
    return this.canvasDrawGradient();
  };

  CanvasGradientMove.prototype._debounce = function(func, threshold, execAsap) {
    var timeout;
    timeout = null;
    return function() {
      var args, delayed, obj;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      obj = this;
      delayed = function() {
        if (!execAsap) {
          func.apply(obj, args);
        }
        return timeout = null;
      };
      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }
      return timeout = setTimeout(delayed, threshold || 100);
    };
  };

  CanvasGradientMove.prototype.gradientMove = function(skipFrame, duration, easing, callback) {
    if (easing == null) {
      easing = 'swing';
    }
    if (callback == null) {
      callback = null;
    }
    this.animObj = {
      progress: 0
    };
    if (skipFrame > 0) {
      this.direction = true;
    } else if (skipFrame < 0) {
      this.direction = false;
    } else {
      console.error("Input Error : skipFrame - can't use 0");
    }
    this.skipFrame = skipFrame;
    this.FrameBu = null;
    return $(this.animObj).stop().animate({
      progress: 1
    }, {
      duration: duration,
      easing: easing,
      progress: this._EasingGradient,
      complete: (function(_this) {
        return function() {
          if (callback) {
            return callback();
          }
        };
      })(this)
    });
  };

  CanvasGradientMove.prototype._EasingGradient = function() {
    var baseframe, colorLength, countCv, finishframe, i, nextSceneFrame, nextframe, sceneNum, scenePercent, _i, _j, _ref, _ref1;
    colorLength = this.options.colorArray.length;
    if (this.direction) {
      countCv = 1;
      sceneNum = Math.floor(this.animObj.progress * this.skipFrame);
    } else {
      countCv = -1;
      sceneNum = Math.ceil(this.animObj.progress * this.skipFrame);
    }
    scenePercent = ((this.animObj.progress * Math.abs(this.skipFrame) * 100) % 100) / 100;
    if (this.FrameBu === null) {
      this.FrameBu = sceneNum;
    }
    if (this.FrameBu !== sceneNum) {
      this.FrameBu = sceneNum;
      nextSceneFrame = this.nowFrame.scene + countCv;
      nextSceneFrame = (nextSceneFrame + colorLength) % colorLength;
      this.nowFrame = {
        scene: nextSceneFrame,
        percent: scenePercent
      };
    } else {
      this.nowFrame.percent = scenePercent;
    }
    if (sceneNum === this.skipFrame) {
      for (i = _i = 0, _ref = this.gradientNum; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        finishframe = this.nowFrame.scene + i;
        finishframe = (finishframe + colorLength) % colorLength;
        this.colorObj[i] = this.options.colorArray[finishframe];
      }
    } else {
      for (i = _j = 0, _ref1 = this.gradientNum; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        baseframe = this.nowFrame.scene + i;
        baseframe = (baseframe + colorLength) % colorLength;
        nextframe = baseframe + countCv;
        nextframe = (nextframe + colorLength) % colorLength;
        this.colorObj[i] = jQuery.Color(this.options.colorArray[baseframe]).transition(this.options.colorArray[nextframe], scenePercent);
      }
    }
    return this.canvasDrawGradient();
  };

  CanvasGradientMove.prototype.canvasDrawGradient = function() {
    var PointArray, canvasHeight, canvasWidth, grad, gradHeight, gradWidth, i, num, radX, radY, startX, startY, tanni, tmp, _i, _j, _ref, _ref1;
    canvasWidth = this.canvas.width;
    canvasHeight = this.canvas.height;
    if (this.options.directPointMode) {
      PointArray = this.options.directPointMode;
      if (PointArray.length === 4) {
        for (i = _i = 0, _ref = PointArray.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          tmp = /(\d+)(\D+)/.exec(PointArray[i]);
          num = tmp[1];
          tanni = tmp[2];
          if (tanni === 'px') {
            PointArray[i] = Number(num);
          } else if (tanni === '%') {
            if (i === 0 || i === 2) {
              PointArray[i] = canvasWidth * num / 100;
            } else {
              PointArray[i] = canvasHeight * num / 100;
            }
          } else {
            console.error('Input Error : directPointMode - Input % or px');
          }
        }
        grad = this.ctx.createLinearGradient(PointArray[0], PointArray[1], PointArray[2], PointArray[3]);
      } else {
        console.error('Input Error : directPointMode - Input 4values');
      }
    } else {
      radX = canvasWidth / Math.cos(this.rad);
      radY = canvasHeight / Math.sin(this.rad);
      if (radX > radY) {
        gradHeight = canvasHeight;
        gradWidth = Math.cos(this.rad) * radY;
        startX = (canvasWidth - gradWidth) / 2;
        startY = 0;
      } else {
        gradWidth = canvasWidth;
        gradHeight = Math.sin(this.rad) * radX;
        startX = 0;
        startY = (canvasHeight - gradHeight) / 2;
      }
      if (this.options.directionX === 'right' && this.options.directionY === 'bottom') {
        grad = this.ctx.createLinearGradient(startX, startY, gradWidth + startX, gradHeight + startY);
      } else if (this.options.directionX === 'right' && this.options.directionY === 'top') {
        grad = this.ctx.createLinearGradient(startX, canvasHeight - startY, gradWidth + startX, canvasHeight - (gradHeight + startY));
      } else if (this.options.directionX === 'left' && this.options.directionY === 'bottom') {
        grad = this.ctx.createLinearGradient(gradWidth + startX, startY, startX, gradHeight + startY);
      } else if (this.options.directionX === 'left' && this.options.directionY === 'top') {
        grad = this.ctx.createLinearGradient(gradWidth + startX, canvasHeight - startY, startX, canvasHeight - (gradHeight + startY));
      } else {
        console.error('Input Error : directionX or directionY');
      }
    }
    if (this.options.maskImg) {
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx.globalCompositeOperation = 'source-over';
    }
    this.ctx.beginPath();
    for (i = _j = 0, _ref1 = this.gradientNum; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      grad.addColorStop(this.options.colorPoint[i], this.colorObj[i]);
    }
    this.ctx.fillStyle = grad;
    this.ctx.rect(0, 0, canvasWidth, canvasHeight);
    this.ctx.fill();
    if (this.options.maskImg) {
      this.ctx.globalCompositeOperation = 'xor';
      return this.ctx.drawImage(this.options.maskImg, 0, 0, canvasWidth, canvasHeight);
    }
  };

  CanvasGradientMove.prototype.canvasClear = function() {
    return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  CanvasGradientMove.prototype.moveFrame = function(skipFrame) {
    var baseframe, i, nextSceneFrame, _i, _ref, _results;
    nextSceneFrame = this.nowFrame.scene + skipFrame;
    if (nextSceneFrame < 0) {
      nextSceneFrame = this.options.colorArray.length + nextSceneFrame;
    } else if (nextSceneFrame > this.options.colorArray.length - 1) {
      nextSceneFrame = nextSceneFrame - this.options.colorArray.length;
    }
    this.nowFrame = {
      scene: nextSceneFrame,
      percent: 0
    };
    _results = [];
    for (i = _i = 0, _ref = this.gradientNum; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      baseframe = this.nowFrame.scene + i;
      if (baseframe < 0) {
        baseframe = this.options.colorArray.length + baseframe;
      } else if (baseframe > this.options.colorArray.length - 1) {
        baseframe = baseframe - this.options.colorArray.length;
      }
      _results.push(this.colorObj[i] = this.options.colorArray[baseframe]);
    }
    return _results;
  };

  CanvasGradientMove.prototype.liquidOn = function() {
    this.options.liquid = true;
    this._canvasResize();
    return $(window).on('resize', this._canvasResize);
  };

  CanvasGradientMove.prototype.liquidOff = function() {
    this.options.liquid = false;
    return $(window).off('resize', this._canvasResize);
  };

  return CanvasGradientMove;

})();

$.fn.CanvasGradientMove = function(options) {
  return this.each(function(i, el) {
    var $el, GradientMove;
    $el = $(el);
    GradientMove = new CanvasGradientMove($el, options);
    return $el.data('CanvasGradientMove', GradientMove);
  });
};


    /*!
     * jQuery Color Animations v@VERSION
     * https://github.com/jquery/jquery-color
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * Date: @DATE
     */
    !function(r,n){function t(r,n,t){var e=f[n.type]||{};return null==r?t||!n.def?null:n.def:(r=e.floor?~~r:parseFloat(r),isNaN(r)?n.def:e.mod?(r+e.mod)%e.mod:0>r?0:e.max<r?e.max:r)}function e(n){var t=l(),e=t._rgba=[];return n=n.toLowerCase(),h(u,function(r,o){var a,s=o.re.exec(n),i=s&&o.parse(s),u=o.space||"rgba";return i?(a=t[u](i),t[c[u].cache]=a[c[u].cache],e=t._rgba=a._rgba,!1):void 0}),e.length?("0,0,0,0"===e.join()&&r.extend(e,a.transparent),t):a[n]}function o(r,n,t){return t=(t+1)%1,1>6*t?r+(n-r)*t*6:1>2*t?n:2>3*t?r+(n-r)*(2/3-t)*6:r}var a,s="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",i=/^([\-+])=\s*(\d+\.?\d*)/,u=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[r[1],r[2],r[3],r[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[2.55*r[1],2.55*r[2],2.55*r[3],r[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(r){return[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(r){return[parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16),parseInt(r[3]+r[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(r){return[r[1],r[2]/100,r[3]/100,r[4]]}}],l=r.Color=function(n,t,e,o){return new r.Color.fn.parse(n,t,e,o)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},f={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},p=l.support={},d=r("<p>")[0],h=r.each;d.style.cssText="background-color:rgba(1,1,1,.5)",p.rgba=d.style.backgroundColor.indexOf("rgba")>-1,h(c,function(r,n){n.cache="_"+r,n.props.alpha={idx:3,type:"percent",def:1}}),l.fn=r.extend(l.prototype,{parse:function(o,s,i,u){if(o===n)return this._rgba=[null,null,null,null],this;(o.jquery||o.nodeType)&&(o=r(o).css(s),s=n);var f=this,p=r.type(o),d=this._rgba=[];return s!==n&&(o=[o,s,i,u],p="array"),"string"===p?this.parse(e(o)||a._default):"array"===p?(h(c.rgba.props,function(r,n){d[n.idx]=t(o[n.idx],n)}),this):"object"===p?(o instanceof l?h(c,function(r,n){o[n.cache]&&(f[n.cache]=o[n.cache].slice())}):h(c,function(n,e){var a=e.cache;h(e.props,function(r,n){if(!f[a]&&e.to){if("alpha"===r||null==o[r])return;f[a]=e.to(f._rgba)}f[a][n.idx]=t(o[r],n,!0)}),f[a]&&r.inArray(null,f[a].slice(0,3))<0&&(f[a][3]=1,e.from&&(f._rgba=e.from(f[a])))}),this):void 0},is:function(r){var n=l(r),t=!0,e=this;return h(c,function(r,o){var a,s=n[o.cache];return s&&(a=e[o.cache]||o.to&&o.to(e._rgba)||[],h(o.props,function(r,n){return null!=s[n.idx]?t=s[n.idx]===a[n.idx]:void 0})),t}),t},_space:function(){var r=[],n=this;return h(c,function(t,e){n[e.cache]&&r.push(t)}),r.pop()},transition:function(r,n){var e=l(r),o=e._space(),a=c[o],s=0===this.alpha()?l("transparent"):this,i=s[a.cache]||a.to(s._rgba),u=i.slice();return e=e[a.cache],h(a.props,function(r,o){var a=o.idx,s=i[a],l=e[a],c=f[o.type]||{};null!==l&&(null===s?u[a]=l:(c.mod&&(l-s>c.mod/2?s+=c.mod:s-l>c.mod/2&&(s-=c.mod)),u[a]=t((l-s)*n+s,o)))}),this[o](u)},blend:function(n){if(1===this._rgba[3])return this;var t=this._rgba.slice(),e=t.pop(),o=l(n)._rgba;return l(r.map(t,function(r,n){return(1-e)*o[n]+e*r}))},toRgbaString:function(){var n="rgba(",t=r.map(this._rgba,function(r,n){return null==r?n>2?1:0:r});return 1===t[3]&&(t.pop(),n="rgb("),n+t.join()+")"},toHslaString:function(){var n="hsla(",t=r.map(this.hsla(),function(r,n){return null==r&&(r=n>2?1:0),n&&3>n&&(r=Math.round(100*r)+"%"),r});return 1===t[3]&&(t.pop(),n="hsl("),n+t.join()+")"},toHexString:function(n){var t=this._rgba.slice(),e=t.pop();return n&&t.push(~~(255*e)),"#"+r.map(t,function(r){return r=(r||0).toString(16),1===r.length?"0"+r:r}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n,t,e=r[0]/255,o=r[1]/255,a=r[2]/255,s=r[3],i=Math.max(e,o,a),u=Math.min(e,o,a),l=i-u,c=i+u,f=.5*c;return n=u===i?0:e===i?60*(o-a)/l+360:o===i?60*(a-e)/l+120:60*(e-o)/l+240,t=0===l?0:.5>=f?l/c:l/(2-c),[Math.round(n)%360,t,f,null==s?1:s]},c.hsla.from=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n=r[0]/360,t=r[1],e=r[2],a=r[3],s=.5>=e?e*(1+t):e+t-e*t,i=2*e-s;return[Math.round(255*o(i,s,n+1/3)),Math.round(255*o(i,s,n)),Math.round(255*o(i,s,n-1/3)),a]},h(c,function(e,o){var a=o.props,s=o.cache,u=o.to,c=o.from;l.fn[e]=function(e){if(u&&!this[s]&&(this[s]=u(this._rgba)),e===n)return this[s].slice();var o,i=r.type(e),f="array"===i||"object"===i?e:arguments,p=this[s].slice();return h(a,function(r,n){var e=f["object"===i?r:n.idx];null==e&&(e=p[n.idx]),p[n.idx]=t(e,n)}),c?(o=l(c(p)),o[s]=p,o):l(p)},h(a,function(n,t){l.fn[n]||(l.fn[n]=function(o){var a,s=r.type(o),u="alpha"===n?this._hsla?"hsla":"rgba":e,l=this[u](),c=l[t.idx];return"undefined"===s?c:("function"===s&&(o=o.call(this,c),s=r.type(o)),null==o&&t.empty?this:("string"===s&&(a=i.exec(o),a&&(o=c+parseFloat(a[2])*("+"===a[1]?1:-1))),l[t.idx]=o,this[u](l)))})})}),l.hook=function(n){var t=n.split(" ");h(t,function(n,t){r.cssHooks[t]={set:function(n,o){var a,s,i="";if("transparent"!==o&&("string"!==r.type(o)||(a=e(o)))){if(o=l(a||o),!p.rgba&&1!==o._rgba[3]){for(s="backgroundColor"===t?n.parentNode:n;(""===i||"transparent"===i)&&s&&s.style;)try{i=r.css(s,"backgroundColor"),s=s.parentNode}catch(u){}o=o.blend(i&&"transparent"!==i?i:"_default")}o=o.toRgbaString()}try{n.style[t]=o}catch(u){}}},r.fx.step[t]=function(n){n.colorInit||(n.start=l(n.elem,t),n.end=l(n.end),n.colorInit=!0),r.cssHooks[t].set(n.elem,n.start.transition(n.end,n.pos))}})},l.hook(s),r.cssHooks.borderColor={expand:function(r){var n={};return h(["Top","Right","Bottom","Left"],function(t,e){n["border"+e+"Color"]=r}),n}},a=r.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery);
;