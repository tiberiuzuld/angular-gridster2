/**
 * Detect Element Resize
 *
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * version: 0.5.3
 **/
const myDocument: any = document;
const myWindow: any = window;
const attachEvent = myDocument.attachEvent;
let stylesCreated = false;
let animationKeyframes;
let animationName;
let animationStyle;
let animationstartevent;
const requestFrame = (function () {
  const raf = window.requestAnimationFrame || myWindow.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
    function (fn) {
      return window.setTimeout(fn, 20);
    };
  return function (fn) {
    return raf(fn);
  };
})();

const cancelFrame = (function () {
  const cancel = window.cancelAnimationFrame || myWindow.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
    window.clearTimeout;
  return function (id) {
    return cancel(id);
  };
})();
if (!attachEvent) {
  /* Detect CSS Animations support to detect element display/re-attach */
  const domPrefixes = 'Webkit Moz O ms'.split(' '),
    startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
  let animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    pfx = '';
  animationstartevent = 'animationstart';
  {
    const elm = document.createElement('fakeelement');
    if (elm.style.animationName !== undefined) {
      animation = true;
    }

    if (animation === false) {
      for (let i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
          pfx = domPrefixes[i];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animationstartevent = startEvents[i];
          animation = true;
          break;
        }
      }
    }
  }

  animationName = 'resizeanim';
  animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
  animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
}

function resetTriggers(element) {
  const triggers = element.__resizeTriggers__,
    expand = triggers.firstElementChild,
    contract = triggers.lastElementChild,
    expandChild = expand.firstElementChild;
  contract.scrollLeft = contract.scrollWidth;
  contract.scrollTop = contract.scrollHeight;
  expandChild.style.width = expand.offsetWidth + 1 + 'px';
  expandChild.style.height = expand.offsetHeight + 1 + 'px';
  expand.scrollLeft = expand.scrollWidth;
  expand.scrollTop = expand.scrollHeight;
}

function checkTriggers(element) {
  return element.offsetWidth !== element.__resizeLast__.width ||
    element.offsetHeight !== element.__resizeLast__.height;
}

function scrollListener(e) {
  const element = this;
  resetTriggers(this);
  if (this.__resizeRAF__) {
    cancelFrame(this.__resizeRAF__);
  }
  this.__resizeRAF__ = requestFrame(function () {
    if (checkTriggers(element)) {
      element.__resizeLast__.width = element.offsetWidth;
      element.__resizeLast__.height = element.offsetHeight;
      element.__resizeListeners__.forEach(function (fn) {
        fn.call(element, e);
      });
    }
  });
}

function createStyles() {
  if (!stylesCreated) {
    // opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    const css = (animationKeyframes ? animationKeyframes : '') +
        '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
        '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; ' +
        'position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > ' +
        'div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style: any = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    stylesCreated = true;
  }
}

export function addResizeListener(element, fn) {
  if (attachEvent) {
    element.attachEvent('onresize', fn);
  } else {
    if (!element.__resizeTriggers__) {
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      createStyles();
      element.__resizeLast__ = {};
      element.__resizeListeners__ = [];
      (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
      element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
        '<div class="contract-trigger"></div>';
      element.appendChild(element.__resizeTriggers__);
      resetTriggers(element);
      element.addEventListener('scroll', scrollListener, true);

      /* Listen for a css animation to detect element display/re-attach */
      animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function (e) {
        if (e.animationName === animationName) {
          resetTriggers(element);
        }
      });
    }
    element.__resizeListeners__.push(fn);
  }
}

export function removeResizeListener(element, fn) {
  if (attachEvent) {
    element.detachEvent('onresize', fn);
  } else {
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      element.removeEventListener('scroll', scrollListener);
      element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
    }
  }
}
